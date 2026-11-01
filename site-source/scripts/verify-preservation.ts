import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { getAllStoryMetas, getPublishedStoryMetas, getStoryBySlug, getLatestStories, buildSearchIndex, countWitnesses, getRotatingStory } from "../src/lib/content";
import hashes from "./baseline-story-hashes.json";

let count = 0;
function check(ok: boolean, label: string) {
  if (!ok) throw new Error(`[FAIL] ${label}`);
  console.log(`[PASS] ${label}`); count++;
}
function sha(p: string) { return createHash("sha256").update(fs.readFileSync(p)).digest("hex"); }
check(Object.entries(hashes).length === 95 && Object.entries(hashes).every(([p, h]) => sha(p) === h), "原有 95 個故事檔案逐位元保留");
check(sha("public/lotus-approved.png") === "fc297d59b5d3eda675e2e5232fa46ad382866382fe6198e5b3f380b4884273b6", "官方透明標誌 SHA-256 完全一致");
const all = getAllStoryMetas(), published = getPublishedStoryMetas();
check(published.length === 19 && countWitnesses() === 29, "公開仍為 19 篇、29 份見證");
check(published.map(m => m.id).join() === Array.from({length: 19}, (_, i) => `S${String(i+1).padStart(3,"0")}`).join(), "公開 ID 仍為 S001–S019");
check(new Set(all.map(m => m.id)).size === all.length && new Set(all.map(m => m.slug)).size === all.length, "全部 ID、slug 無重複");
const drafts = all.filter(m => !published.some(p => p.id === m.id));
check(drafts.every(m => m.status === "translation-draft" && m.editorial.translationStatus.zh === "editorial-draft" && m.editorial.translationStatus.en === "editorial-draft"), "非公開狀態與譯註初稿標籤保留");
check(drafts.every(m => getStoryBySlug(m.slug) === undefined), "公開 loader 不接受草稿 slug");
for (const locale of ["zh", "en"] as const) {
  const docs = buildSearchIndex(locale);
  check(docs.length === 19 && docs.every(d => published.some(p => p.slug === d.slug)), `${locale} 搜尋無草稿`);
}
check(getLatestStories(99).length === 19 && getLatestStories(99).every(m => m.status === "published"), "最新列表無草稿");
check(Array.from({length: 40}, (_, i) => getRotatingStory(new Date(Date.UTC(2026, 0, 1+i)))).every(m => m?.status === "published"), "每日故事無草稿");
check(all.length === 19 && drafts.length === 0, "公開保存版不包含十篇草稿");
console.log(`${count}/${count} 項通過`);
