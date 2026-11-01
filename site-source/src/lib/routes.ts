import type { Metadata } from "next";
import type { SiteLocale } from "@/config/site";
import { SITE } from "@/config/site";

/**
 * Locale-aware path helpers. Traditional Chinese lives at the root (no
 * prefix); English lives under /en. `trailingSlash` is enabled in
 * next.config.ts, so Next.js resolves these to directory URLs.
 */
export function localePath(locale: SiteLocale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? `/en${clean}` : clean === "" ? "/" : clean;
}

/** Path of the same page in the *other* locale (language switcher). */
export function otherLocalePath(pathname: string, from: SiteLocale): string {
  const p = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  if (from === "en") {
    const stripped = p === "/en" ? "/" : p.replace(/^\/en(?=\/|$)/, "");
    return stripped === "" ? "/" : stripped;
  }
  return p === "/" ? "/en" : `/en${p}`;
}

/** Canonical + hreflang alternates for a page, both locales. */
export function pageAlternates(path: string): Metadata["alternates"] {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: `${SITE.pagesOrigin}${clean}/`,
    languages: {
      "zh-Hant": `${SITE.pagesOrigin}${clean}/`,
      en: `${SITE.pagesOrigin}/en${clean}/`,
    },
  };
}
