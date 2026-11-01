import type { SiteLocale } from "@/config/site";
import type { Theme, WorkCode, RebirthClaim, ReportedDestination, Ternary } from "./types";

/**
 * Bilingual UI labels that belong to presentation components rather than
 * the core i18n table (src/lib/i18n.ts is frozen for this task). Kept
 * minimal, factual and in the same voice as the existing strings.
 */
export const SUTRA_NARRATIVE_LABEL: Record<SiteLocale, string> = {
  zh: "聖典敘事",
  en: "Scriptural narrative",
};

export const LINE_HEIGHT_OPTIONS: Record<SiteLocale, string[]> = {
  zh: ["緊湊", "適中", "寬鬆"],
  en: ["Compact", "Normal", "Loose"],
};

export const INLINE_CITATION_LABEL: Record<SiteLocale, string> = {
  zh: "原書夾注引書",
  en: "Cited in the original as",
};

export const WITNESS_COUNT_LABEL: Record<SiteLocale, (n: number) => string> = {
  zh: (n) => `${n} 則原典引文`,
  en: (n) => `${n} primary ${n === 1 ? "witness" : "witnesses"}`,
};

export const TRANSLATION_DRAFT_BADGE: Record<SiteLocale, string> = {
  zh: "譯註初稿",
  en: "Draft translation",
};

export const BOOKMARK_FILTER_LABEL: Record<SiteLocale, string> = {
  zh: "我的書籤",
  en: "Bookmarks",
};

/** Column headers for the library structure table. */
export const LIBRARY_TABLE_LABELS: Record<SiteLocale, string[]> = {
  zh: ["門類", "收錄", "卷"],
  en: ["Section", "Contents", "Fascicle"],
};

/** Glossary section title on the methodology page. */
export const GLOSSARY_TITLE: Record<SiteLocale, string> = {
  zh: "詞彙表",
  en: "Glossary",
};

/** Footer note on the methodology page, pointing to the sources page. */
export const METHODOLOGY_FOOTER: Record<SiteLocale, string> = {
  zh: "所引典籍之版本與授權資訊，詳見",
  en: "See the Sources page for the editions and licences of the works cited:",
};

export const TRANSLATION_REVIEWED_BADGE: Record<SiteLocale, string> = {
  zh: "已審校",
  en: "Reviewed",
};

/** 工作頭銜 per code, bilingual, without 書名號 (used in badges/panels). */
export const WORK_TITLE: Record<WorkCode, Record<SiteLocale, string>> = {
  X1540: { zh: "法華經顯應錄", en: "Fahua jing xianying lu" },
  X1541: { zh: "法華經持驗記", en: "Fahua jing chiyan ji" },
};

export const THEME_LABEL: Record<Theme, Record<SiteLocale, string>> = {
  "peaceful-life": { zh: "現世安樂", en: "Peace & Well-being" },
  "pure-land": { zh: "往生極樂", en: "Pure Land" },
};

export const REBIRTH_LABEL: Record<RebirthClaim, Record<SiteLocale, string>> = {
  explicit: { zh: "明言往生", en: "Explicitly stated" },
  interpreted: { zh: "經解讀推斷", en: "Interpreted" },
  "not-stated": { zh: "未明言", en: "Not stated" },
  disputed: { zh: "有異說", en: "Disputed" },
};

export const DESTINATION_LABEL: Record<ReportedDestination, Record<SiteLocale, string>> = {
  sukhavati: { zh: "西方極樂", en: "Sukhāvatī (Western Pure Land)" },
  tusita: { zh: "兜率天", en: "Tuṣita Heaven" },
  other: { zh: "其他", en: "Other" },
  unspecified: { zh: "未載明", en: "Unspecified" },
};

export const ASPIRATION_LABEL: Record<string, Record<SiteLocale, string>> = {
  true: { zh: "有西方之願", en: "Aspiration attested" },
  false: { zh: "無西方之願", en: "No such aspiration" },
  uncertain: { zh: "西方之願不明", en: "Aspiration uncertain" },
};

/** No corpus story is classified as an explicit rebirth claim yet. */
export const NO_EXPLICIT_REBIRTH_NOTE: Record<SiteLocale, string> = {
  zh: "目前收錄中尚無「明言往生」之條目；所有往生記載均屬「經解讀推斷」或「未明言」。",
  en: "No story in the current corpus is classified as \"explicitly stated\"; all rebirth records are currently interpreted or not stated.",
};

/** Chinese numeral for juan numbers 1–2. */
export function juanCn(juan: number): string {
  return juan === 1 ? "一" : juan === 2 ? "二" : String(juan);
}

export function aspirationKey(v: Ternary): string {
  return v === true ? "true" : v === false ? "false" : "uncertain";
}
