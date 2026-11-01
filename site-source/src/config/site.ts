/**
 * Site-level configuration for Lotus Sutra Stories（法華感應錄）.
 *
 * IMPORTANT: the custom domain `lotus-sutra-stories.com` is NOT purchased
 * and NOT configured. Metadata below deliberately references only the
 * GitHub Pages origin, which itself is only a *planned* deployment target
 * pending owner review. No canonical URL is asserted for an unowned host.
 */

export const SITE = {
  brandZh: "法華感應錄",
  brandEn: "Lotus Sutra Stories",
  taglineZh: "受持法華的故事，現世安樂的啟發，往生淨土的願心。",
  taglineEn:
    "Stories of upholding the Lotus Sutra, inspiring peace in this life and aspirations for the Pure Land.",
  /** Planned (not yet live) GitHub Pages origin; do not present as live. */
  pagesOrigin: "https://lotus-sutra-stories.github.io",
  /** Reported available but NOT purchased; never emitted into metadata. */
  prospectiveDomain: "lotus-sutra-stories.com",
  locales: ["zh", "en"] as const,
  defaultLocale: "zh" as const,
} as const;

export type SiteLocale = (typeof SITE.locales)[number];

export function isLocale(value: string): value is SiteLocale {
  return (SITE.locales as readonly string[]).includes(value);
}

/** HTML `lang` values: Traditional Chinese default, English second. */
export const HTML_LANG: Record<SiteLocale, string> = {
  zh: "zh-Hant",
  en: "en",
};
