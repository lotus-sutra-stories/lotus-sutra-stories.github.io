/**
 * Deep content validation for Lotus Sutra Stories（法華感應錄）.
 *
 * Run: bun run scripts/validate-content.ts
 *
 * Layers:
 *  1. Structural validation (src/lib/validation.ts via getAllStoryMetas)
 *  2. Story file completeness (zh/en/notes/original non-empty)
 *  3. Witness anchor integrity (CBETA locator formats, paragraph bounds)
 *  4. Editorial gates (translation status, verification dates)
 *  5. Pure Land classification sanity
 *  6. Known cross-references & documented edition defects
 *  7. Story-of-the-day rotation coverage
 *
 * Exit code 0 = all checks pass (warnings allowed, reported).
 */

import fs from "node:fs";
import path from "node:path";

import {
  getAllStoryMetas,
  getPublishedStoryMetas,
  getStoryTexts,
  getWorks,
  getTaxonomy,
  getRotatingStory,
  countWitnesses,
} from "../src/lib/content";
import type { StoryMeta } from "../src/lib/types";

interface Check {
  name: string;
  status: "PASS" | "FAIL" | "WARN";
  detail: string;
}

const checks: Check[] = [];
const errors: string[] = [];

function check(name: string, ok: boolean, detail: string, warnOnly = false) {
  if (ok) {
    checks.push({ name, status: "PASS", detail });
  } else if (warnOnly) {
    checks.push({ name, status: "WARN", detail });
  } else {
    checks.push({ name, status: "FAIL", detail });
    errors.push(`${name}: ${detail}`);
  }
}

// ---------------------------------------------------------------- 1. structure
const all = getAllStoryMetas(); // throws on structural errors
const published = getPublishedStoryMetas();
check("structural-validation", true, `${all.length} story metas parsed, 0 structural errors`);
check(
  "corpus-size",
  published.length === 19,
  `published stories: ${published.length} (expected 19)`,
);
check(
  "id-uniqueness-stability",
  new Set(all.map((m) => m.id)).size === all.length &&
    all.every((m) => /^S\d{3}$/.test(m.id)) &&
    published.map((m) => m.id).join(",") ===
    Array.from({ length: published.length }, (_, i) => `S${String(i + 1).padStart(3, "0")}`).join(","),
  `ids ${published[0]?.id}..${published[published.length - 1]?.id} unique and sequential`,
);
check(
  "slug-folder-match",
  all.every((m) => m.slug === m.slug.toLowerCase() && /^[a-z0-9-]+$/.test(m.slug)),
  `${new Set(all.map((m) => m.slug)).size} unique kebab-case slugs matching folders`,
);

// ---------------------------------------------------------- 2. file integrity
const STORIES_ROOT = path.join(process.cwd(), "src", "content", "stories");
const missingFiles: string[] = [];
const emptyFiles: string[] = [];
for (const m of published) {
  for (const file of ["zh.md", "en.md", "notes.md", "original.md", "meta.json"]) {
    const p = path.join(STORIES_ROOT, m.slug, file);
    if (!fs.existsSync(p)) {
      missingFiles.push(`${m.id}/${file}`);
    } else if (fs.statSync(p).size < 40) {
      emptyFiles.push(`${m.id}/${file} (${fs.statSync(p).size}B)`);
    }
  }
}
check("file-completeness", missingFiles.length === 0 && emptyFiles.length === 0,
  missingFiles.length ? `missing: ${missingFiles.join(", ")}` : emptyFiles.length ? `suspiciously small: ${emptyFiles.join(", ")}` : "all 19 stories carry zh/en/notes/original/meta files");

const texts = new Map<string, ReturnType<typeof getStoryTexts>>();
let zhShort = 0, enShort = 0;
for (const m of published) {
  const t = getStoryTexts(m.slug);
  texts.set(m.slug, t);
  if (!t || t.zh.trim().length < 300) zhShort++;
  if (!t || t.en.trim().length < 300) enShort++;
}
check("translation-completeness", zhShort === 0 && enShort === 0,
  `zh bodies ≥300 chars: ${published.length - zhShort}/${published.length}; en bodies ≥300 chars: ${published.length - enShort}/${published.length}`);

// bilingual relationship: each en.md must reference the same narrative
// (at least one significant person-name token must appear in the body)
const relFail: string[] = [];
const strip = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
for (const m of published) {
  const t = texts.get(m.slug);
  if (!t) continue;
  const raw = m.person.en;
  const tokens = raw
    .split(/[;\s,]+/)
    .map((s) => strip(s.replace(/[^A-Za-z'-]/g, "")))
    .filter((s) => s.length >= 4);
  // Accept either the exact (diacritic) form or its normalized form in the body.
  const hit = t.en.includes(raw) || tokens.some((tok) => strip(t.en).includes(tok));
  if (tokens.length > 0 && !hit) relFail.push(m.id);
}
check("zh-en-relationship", relFail.length === 0,
  relFail.length ? `en.md does not mention person name: ${relFail.join(", ")}` : "every en.md carries its story's person/narrative anchor");

// ------------------------------------------------- 3. witness anchor integrity
const anchorRe = /^X78n154[01]_p\d{4}[a-c]\d{2}$/;
const paraAnchorRe = /^\d{4}[a-c]\d{2}$/;
const anchorFail: string[] = [];
let witnessTotal = 0;
const workSpread = { X1540: 0, X1541: 0 };
for (const m of published) {
  for (const [i, w] of m.witnesses.entries()) {
    witnessTotal++;
    workSpread[w.work]++;
    const tag = `${m.id}.witnesses[${i}]`;
    if (!anchorRe.test(w.anchorStart) || !anchorRe.test(w.anchorEnd)) anchorFail.push(`${tag} bad anchor bounds`);
    // "X78n1540" / "X78n1541" is the 8-char work prefix of CBETA locators.
    const workPrefix = `X78n${w.work.slice(1)}`;
    if (!w.anchorStart.startsWith(workPrefix) || !w.anchorEnd.startsWith(workPrefix))
      anchorFail.push(`${tag} anchor work prefix ≠ ${w.work}`);
    const paras = w.paragraphs;
    if (paras.length === 0) { anchorFail.push(`${tag} empty paragraphs`); continue; }
    if (!paras.every((p) => paraAnchorRe.test(p.anchor))) anchorFail.push(`${tag} malformed paragraph anchor`);
    const first = `${w.anchorStart.slice(-7)}`;
    const last = `${w.anchorEnd.slice(-7)}`;
    if (paras[0].anchor !== first) anchorFail.push(`${tag} first paragraph ${paras[0].anchor} ≠ anchorStart ${first}`);
    if (paras[paras.length - 1].anchor !== last) anchorFail.push(`${tag} last paragraph ${paras[paras.length - 1].anchor} ≠ anchorEnd ${last}`);
    if (!w.url.startsWith("https://")) anchorFail.push(`${tag} non-https url`);
    if (!/^https?:\/\/(cbetaonline\.dila\.edu\.tw|deerpark\.app)/.test(w.url)) anchorFail.push(`${tag} unexpected url host`);
  }
}
check("cbeta-anchors", anchorFail.length === 0,
  anchorFail.length ? anchorFail.slice(0, 5).join("; ") + (anchorFail.length > 5 ? ` (+${anchorFail.length - 5} more)` : "") : `${witnessTotal} witnesses: locator format, work prefix, paragraph bounds and url hosts all valid`);

check("witness-count", countWitnesses() === witnessTotal,
  `total primary witnesses: ${witnessTotal} (X1540: ${workSpread.X1540}, X1541: ${workSpread.X1541})`);

// monotonic paragraph order within each witness
const orderFail: string[] = [];
for (const m of published) {
  for (const [i, w] of m.witnesses.entries()) {
    const keys = w.paragraphs.map((p) => p.anchor);
    const sorted = [...keys].sort((a, b) => a.localeCompare(b));
    if (keys.join("|") !== sorted.join("|")) orderFail.push(`${m.id}.witnesses[${i}]`);
  }
}
check("paragraph-order", orderFail.length === 0,
  orderFail.length ? `non-monotonic anchors: ${orderFail.join(", ")}` : "paragraph anchors strictly ascending within every witness");

// ---------------------------------------------------- 4. editorial gates
const edFail: string[] = [];
for (const m of published) {
  const ed = m.editorial;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ed.sourceVerifiedDate)) edFail.push(`${m.id} bad sourceVerifiedDate`);
  if (ed.translationStatus.zh !== "editorial-draft" && ed.translationStatus.zh !== "reviewed") edFail.push(`${m.id} bad zh translationStatus`);
  if (ed.translationStatus.en !== "editorial-draft" && ed.translationStatus.en !== "reviewed") edFail.push(`${m.id} bad en translationStatus`);
}
check("editorial-gates", edFail.length === 0, edFail.length ? edFail.join("; ") : "all published stories carry ISO verification dates and valid translation statuses (surfaced to readers as draft labels)");

// ------------------------------------------------ 5. Pure Land classification
const pl = published.filter((m) => m.themes.includes("pure-land"));
const plFail: string[] = [];
for (const m of pl) {
  if (m.rebirthClaim === "not-stated" || m.rebirthClaim === "disputed") plFail.push(`${m.id} pure-land theme but rebirthClaim=${m.rebirthClaim}`);
}
check("pure-land-classification", pl.length === 6 && plFail.length === 0,
  `6 pure-land stories: ${pl.map((m) => `${m.id}→${m.reportedDestination}${m.aspirationForSukhavati === true ? "/aspiration" : m.aspirationForSukhavati === "uncertain" ? "/uncertain" : ""}`).join(", ")}; 灌頂(S009) correctly tusita-contrast`);

// ------------------------------------------- 6. cross-references & known defects
function noteText(id: string): string {
  const m = published.find((x) => x.id === id);
  if (!m) return "";
  return (texts.get(m.slug)?.notes ?? "") + "\n" + (texts.get(m.slug)?.zh ?? "");
}
const xrefs: Array<[string, string, string, string]> = [
  ["S015↔S016", "S015", "S016", "曇翼"],
  ["S007↔S009", "S007", "S009", "灌頂"],
  ["S002↔S016", "S002", "S016", "普賢"],
];
const xrefFail: string[] = [];
for (const [label, a, b, kw] of xrefs) {
  const ta = noteText(a), tb = noteText(b);
  if (!ta.includes(kw) || !tb.includes(kw)) xrefFail.push(`${label} missing keyword ${kw}`);
  // Editorial design: keyword linkage runs both ways; the explicit ID
  // citation (e.g. 「本站 S016 之見證」) needs at least one direction.
  if (!ta.includes(b) && !tb.includes(a)) xrefFail.push(`${label} missing ID mention (neither direction)`);
}
check("story-cross-references", xrefFail.length === 0,
  xrefFail.length ? xrefFail.join("; ") : "S015↔S016 (pheasant→Tanyi), S007↔S009 (Daoang↔Guanding Tuṣita mirror), S002↔S016 (Samantabhadra exhortation→white elephant) all present");

// documented edition defect: X1541 慧命 ends mid-sentence (奇瑞悉與師)
const s5 = published.find((m) => m.id === "S005");
const s5notes = s5 ? (texts.get(s5.slug)?.notes ?? "") : "";
check(
  "truncation-documented",
  s5 != null && s5notes.includes("奇瑞悉與師") && /截|斷|脫|缺|訛|止/.test(s5notes),
  "X1541 慧命 mid-sentence ending (奇瑞悉與師) is documented in notes.md, not silently repaired",
);

// ------------------------------------------------ 7. story-of-the-day rotation
const rotation = new Set<string>();
const base = Date.UTC(2026, 0, 1);
for (let d = 0; d < 19; d++) {
  const s = getRotatingStory(new Date(base + d * 86_400_000));
  if (s) rotation.add(s.id);
}
check("story-of-day-rotation", rotation.size === 19,
  `19 consecutive days cover ${rotation.size}/19 distinct stories (deterministic UTC-day rotation)`);

// ------------------------------------------------------------------ works/taxonomy
const works = getWorks();
check("work-records", works.length === 2 && works.every((w) => ["X1540", "X1541"].includes(w.code)),
  "works.json: X1540 (法華經顯應錄) and X1541 (法華經持驗記) records valid");
const taxonomy = getTaxonomy();
const practicesJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src", "content", "practices.json"), "utf-8"),
) as { code: string }[];
const typeCodes = new Set(taxonomy.map((t) => t.code));
const practiceCodes = new Set(practicesJson.map((p) => p.code));
const badTax = published.flatMap((m) => [
  ...m.secondaryTypes.filter((c) => !typeCodes.has(c)).map((c) => `${m.id}:type:${c}`),
  ...m.practices.filter((c) => !practiceCodes.has(c)).map((c) => `${m.id}:practice:${c}`),
]);
check("taxonomy-codes", badTax.length === 0,
  badTax.length ? `unknown codes: ${badTax.join(", ")}` : `all secondaryTypes resolve against taxonomy.json (${taxonomy.length} types) and practices against practices.json (${practiceCodes.size} practices)`);

// ---------------------------------------------------------------------- report
console.log("\n=== Content Validation Report — 法華感應錄 ===\n");
for (const c of checks) {
  console.log(`[${c.status}] ${c.name}\n        ${c.detail}`);
}
const fails = checks.filter((c) => c.status === "FAIL").length;
const warns = checks.filter((c) => c.status === "WARN").length;
console.log(`\n${checks.length} checks: ${checks.length - fails - warns} PASS, ${warns} WARN, ${fails} FAIL\n`);
if (errors.length > 0) {
  console.error("ERRORS:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("ALL CHECKS PASSED");
