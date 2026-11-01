import type { StoryMeta, WorkRecord, TaxonomyType, GlossaryEntry } from "./types";

/**
 * Dependency-free structural validation for editorial content.
 * Used both at build time (fail fast on malformed content) and by
 * scripts/validate-content.ts in CI. Deliberately avoids pulling a
 * schema library into the runtime dependency graph.
 */

export interface ValidationIssue {
  story?: string;
  field: string;
  message: string;
  severity: "error" | "warning";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isLangRecord(v: unknown): v is { zh: string; en: string } {
  return (
    typeof v === "object" && v !== null &&
    isNonEmptyString((v as Record<string, unknown>).zh) &&
    isNonEmptyString((v as Record<string, unknown>).en)
  );
}

const WORK_CODES = ["X1540", "X1541"];
const THEMES = ["peaceful-life", "pure-land"];
const STATUSES = ["draft", "source-checked", "translation-draft", "published"];
const REBIRTH = ["explicit", "interpreted", "not-stated", "disputed"];
const DESTINATIONS = ["sukhavati", "tusita", "other", "unspecified"];

export function validateStoryMeta(meta: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const m = meta as Record<string, unknown>;
  const id = isNonEmptyString(m.id) ? m.id : "<missing-id>";

  const require = (field: string, ok: boolean, message: string, severity: "error" | "warning" = "error") => {
    if (!ok) issues.push({ story: id, field, message, severity });
  };

  require("id", isNonEmptyString(m.id), "id must be a non-empty string");
  require("slug", /^[a-z0-9-]+$/.test(String(m.slug ?? "")), "slug must be kebab-case");
  require("status", STATUSES.includes(String(m.status ?? "")), `status must be one of ${STATUSES.join("|")}`);
  require("title", isLangRecord(m.title), "title.zh and title.en required");
  require("person", isLangRecord(m.person), "person.zh and person.en required");
  require("period.label", isLangRecord((m.period as Record<string, unknown>)?.label), "period.label required");
  require(
    "themes",
    Array.isArray(m.themes) && m.themes.length > 0 && (m.themes as unknown[]).every((x) => THEMES.includes(String(x))),
    "themes must be a non-empty subset of peaceful-life|pure-land",
  );
  require(
    "secondaryTypes",
    Array.isArray(m.secondaryTypes) && (m.secondaryTypes as unknown[]).every(isNonEmptyString),
    "secondaryTypes must be an array of taxonomy codes",
  );
  require(
    "practices",
    Array.isArray(m.practices) && (m.practices as unknown[]).every(isNonEmptyString),
    "practices must be an array of taxonomy codes",
  );
  require("rebirthClaim", REBIRTH.includes(String(m.rebirthClaim ?? "")), "rebirthClaim required");
  require(
    "reportedDestination",
    DESTINATIONS.includes(String(m.reportedDestination ?? "")),
    "reportedDestination required",
  );
  require(
    "aspirationForSukhavati",
    [true, false, "uncertain"].includes(m.aspirationForSukhavati as unknown as boolean | string),
    "aspirationForSukhavati must be true|false|\"uncertain\"",
  );
  require("isSutraNarrative", typeof m.isSutraNarrative === "boolean", "isSutraNarrative must be boolean");
  require("synopsis", isLangRecord(m.synopsis), "synopsis.zh and synopsis.en required");
  require(
    "witnesses",
    Array.isArray(m.witnesses) && (m.witnesses as unknown[]).length > 0,
    "at least one primary witness is required",
  );

  const witnesses = (m.witnesses as Record<string, unknown>[]) ?? [];
  witnesses.forEach((w, i) => {
    const tag = `witnesses[${i}]`;
    require(`${tag}.work`, WORK_CODES.includes(String(w.work ?? "")), "work must be X1540 or X1541");
    require(`${tag}.juan`, [1, 2].includes(Number(w.juan)), "juan must be 1 or 2");
    require(`${tag}.heading`, isNonEmptyString(w.heading), "heading required");
    require(`${tag}.anchorStart`, /^X78n154[01]_p\d{4}[a-c]\d{2}$/.test(String(w.anchorStart ?? "")), "anchorStart must match X78n154X_pPPPPcLL pattern");
    require(`${tag}.anchorEnd`, /^X78n154[01]_p\d{4}[a-c]\d{2}$/.test(String(w.anchorEnd ?? "")), "anchorEnd must match X78n154X_pPPPPcLL pattern");
    require(`${tag}.locator`, isNonEmptyString(w.locator), "locator required");
    require(`${tag}.url`, /^https?:\/\//.test(String(w.url ?? "")), "url must be http(s)");
    require(`${tag}.accessed`, /^\d{4}-\d{2}-\d{2}$/.test(String(w.accessed ?? "")), "accessed must be ISO date");
    require(
      `${tag}.paragraphs`,
      Array.isArray(w.paragraphs) && (w.paragraphs as unknown[]).length > 0 &&
        (w.paragraphs as Record<string, unknown>[]).every(
          (p) => isNonEmptyString(p.anchor) && isNonEmptyString(p.text),
        ),
      "paragraphs with anchors and text required",
    );
  });

  // Publication gates
  if (m.status === "published") {
    require("witnesses(nonempty)", witnesses.length > 0, "published stories require at least one witness");
    const ed = m.editorial as Record<string, unknown> | undefined;
    require(
      "editorial.sourceVerifiedDate",
      ed != null && /^\d{4}-\d{2}-\d{2}$/.test(String(ed?.sourceVerifiedDate ?? "")),
      "published stories require a source verification date",
    );
    require(
      "editorial.translationStatus",
      ed != null && isLangRecord(ed?.translationStatus),
      "published stories require translation status for both languages",
    );
  }

  return issues;
}

export function validateWorkRecord(work: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const w = work as Record<string, unknown>;
  if (!WORK_CODES.includes(String(w.code ?? ""))) {
    issues.push({ field: "code", message: "work code must be X1540 or X1541", severity: "error" });
  }
  for (const field of ["titleZh", "titleEn", "compilerZh", "compilerEn", "dynastyZh", "dynastyEn", "cbetaId"]) {
    if (!isNonEmptyString(w[field])) {
      issues.push({ field, message: `${field} required`, severity: "error" });
    }
  }
  if (!isLangRecord(w.structureNote)) {
    issues.push({ field: "structureNote", message: "structureNote.zh/en required", severity: "error" });
  }
  if (!isLangRecord(w.licenseNote)) {
    issues.push({ field: "licenseNote", message: "licenseNote.zh/en required", severity: "error" });
  }
  return issues;
}

export type { StoryMeta, WorkRecord, TaxonomyType, GlossaryEntry };
