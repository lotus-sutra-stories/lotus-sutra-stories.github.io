import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookMarked, Flower2, Sparkles } from "lucide-react";

import { SITE } from "@/config/site";
import { countPeriods, countWitnesses, getLatestStories, getPublishedStoryMetas, getWorks } from "@/lib/content";
import { toCardData } from "@/lib/cards";
import { UI } from "@/lib/i18n";
import { localePath, pageAlternates } from "@/lib/routes";
import { LotusMark } from "@/components/site/lotus-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { StoryCard } from "@/components/site/story-card";
import { StoryOfDay } from "@/components/site/story-of-day";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: SITE.brandZh,
  description: SITE.taglineZh,
  alternates: pageAlternates("/"),
};

export default function ZhHomePage() {
  const t = UI.zh;
  const stories = getPublishedStoryMetas();
  const cards = stories.map(toCardData);
  const latest = getLatestStories(4).map(toCardData);
  const works = getWorks();
  const peaceCount = stories.filter((m) => m.themes.includes("peaceful-life")).length;
  const pureCount = stories.filter((m) => m.themes.includes("pure-land")).length;

  const stats = [
    { value: stories.length, label: t.home.statsStories },
    { value: countWitnesses(), label: t.home.statsWitnesses },
    { value: countPeriods(), label: t.home.statsDynasties },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="hero-wash border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 pb-14 pt-14 text-center sm:px-6 md:pb-20 md:pt-20">
          <LotusMark className="mx-auto h-24 w-24 text-primary md:h-28 md:w-28" />
          <p className="mt-6 text-sm font-medium tracking-[0.4em] text-primary/90">{t.home.heroKicker}</p>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
            {t.home.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.home.heroLead}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-1.5">
              <Link href={localePath("zh", "/stories")}>
                {t.home.browseAll}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={localePath("zh", "/methodology")}>{t.nav.methodology}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 md:space-y-20 md:py-16">
        {/* Stats */}
        <Reveal>
          <dl className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-border/70 rounded-xl border border-border/70 bg-card/70 py-6 text-center">
            {stats.map((s) => (
              <div key={s.label} className="px-2">
                <dt className="order-2 mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</dt>
                <dd className="order-1 font-serif text-3xl font-semibold text-primary sm:text-4xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Two themes */}
        <section aria-label={`${t.nav.peacefulLife} · ${t.nav.pureLand}`}>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={0}>
              <Link
                href={localePath("zh", "/theme/peaceful-life")}
                className="group flex h-full flex-col rounded-xl border border-amber-300/50 bg-gradient-to-b from-amber-100/50 to-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/70 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/70 bg-amber-100 text-amber-800">
                  <Flower2 className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-amber-950 sm:text-2xl">
                  {t.home.ctaPeace}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-amber-950/75">{t.home.ctaPeaceDesc}</p>
                <p className="mt-4 text-xs text-amber-900/70">
                  {peaceCount} {t.common.story}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-amber-900">
                  {t.home.ctaEnter}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <Link
                href={localePath("zh", "/theme/pure-land")}
                className="group flex h-full flex-col rounded-xl border border-rose-300/50 bg-gradient-to-b from-rose-100/45 to-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400/70 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-300/70 bg-rose-100 text-rose-800">
                  <Sparkles className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-rose-950 sm:text-2xl">
                  {t.home.ctaPureLand}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-rose-950/75">{t.home.ctaPureLandDesc}</p>
                <p className="mt-4 text-xs text-rose-900/70">
                  {pureCount} {t.common.story}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-rose-900">
                  {t.home.ctaEnter}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Story of the day */}
        <Reveal>
          <StoryOfDay locale="zh" stories={cards} />
        </Reveal>

        {/* Latest additions */}
        <section aria-labelledby="latest-heading">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="latest-heading" className="font-serif text-2xl font-semibold">
              {t.home.latestTitle}
            </h2>
            <Link
              href={localePath("zh", "/stories")}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {t.home.browseAll}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {latest.map((m, i) => (
              <StoryCard key={m.slug} story={m} locale="zh" index={i} />
            ))}
          </div>
        </section>

        {/* Source works */}
        <section aria-labelledby="works-heading">
          <SectionHeading id="works-heading" title={t.home.worksTitle} description={t.home.worksDesc} />
          <div className="grid gap-6 md:grid-cols-2">
            {works.map((w, i) => (
              <Reveal key={w.code} delay={i * 0.08}>
                <Link
                  href={localePath("zh", "/library")}
                  className="group flex h-full flex-col rounded-xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-semibold leading-snug" lang="zh-Hant">
                        {w.titleZh}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.titleEn}</p>
                    </div>
                    <BookMarked className="size-5 shrink-0 text-primary/70" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm text-foreground/80" lang="zh-Hant">
                    {w.compilerZh}
                    <span className="mx-2 text-border" aria-hidden="true">|</span>
                    {w.dynastyZh}
                  </p>
                  <div className="mt-auto pt-5">
                    <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
                      {w.cbetaId}
                    </Badge>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <Reveal>
          <section
            aria-labelledby="disclaimer-heading"
            className="rounded-xl border border-amber-300/60 bg-amber-100/45 p-6 sm:p-8"
          >
            <h2 id="disclaimer-heading" className="font-serif text-lg font-semibold text-amber-950">
              {t.home.disclaimerTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-amber-950/80">{t.footer.disclaimer}</p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
