import Link from "next/link";

import { SITE, type SiteLocale } from "@/config/site";
import { UI } from "@/lib/i18n";
import { localePath } from "@/lib/routes";
import { LotusMark } from "@/components/site/lotus-mark";

/**
 * Site footer with the full project disclosure. Rendered as the last child
 * of the root layout's `min-h-screen flex flex-col` body with `mt-auto`,
 * so it always sits at the bottom of the viewport (never floating).
 */
export function SiteFooter({ locale }: { locale: SiteLocale }) {
  const t = UI[locale];
  const brand = locale === "zh" ? SITE.brandZh : SITE.brandEn;
  const tagline = locale === "zh" ? SITE.taglineZh : SITE.taglineEn;

  const links = [
    { href: localePath(locale, "/stories"), label: t.nav.stories },
    { href: localePath(locale, "/library"), label: t.nav.library },
    { href: localePath(locale, "/methodology"), label: t.nav.methodology },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/licensing"), label: t.nav.licensing },
  ];

  return (
    <footer className="mt-auto border-t border-border/70 bg-secondary/40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <LotusMark className="h-8 w-8 text-primary" />
              <span className="font-serif text-lg font-semibold">{brand}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{tagline}</p>
            <nav aria-label={t.nav.menu} className="flex flex-wrap gap-x-5 gap-y-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-foreground/75 underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="max-w-xl space-y-3 rounded-lg border border-border/70 bg-card p-5">
            <h2 className="font-serif text-sm font-semibold tracking-wide text-foreground">
              {t.footer.disclosureTitle}
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t.footer.disclaimer}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t.footer.notDeployedNote}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-5 text-xs text-muted-foreground">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
