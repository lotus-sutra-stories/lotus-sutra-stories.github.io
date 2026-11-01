import type { SiteLocale } from "@/config/site";

export const IDENTITY_CATEGORIES = ["ancient-sage", "monk", "nun", "lay-man", "lay-woman", "unknown"] as const;
export type IdentityCategory = typeof IDENTITY_CATEGORIES[number];
export const IDENTITY_LABEL: Record<IdentityCategory, Record<SiteLocale, string>> = {
  "ancient-sage": { zh: "古聖", en: "Ancient sages" },
  monk: { zh: "高僧", en: "Monks" },
  nun: { zh: "高尼", en: "Nuns" },
  "lay-man": { zh: "信男", en: "Laymen" },
  "lay-woman": { zh: "信女", en: "Laywomen" },
  unknown: { zh: "身分待核", en: "Unclassified" },
};
export const IDENTITY_FILTER_LABEL = { zh: "身分門類", en: "Social identity" };
export const IDENTITY_SCOPE_LABEL = {
  zh: "身分依篇章主框架分類，不代表所有出場者；與現世安樂、往生極樂主題分開篩選。",
  en: "Identity follows the main narrative frame, not every participant; it is separate from the two themes.",
};
