"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

import type { SiteLocale } from "@/config/site";
import type { StoryCardData } from "@/lib/cards";
import { UI } from "@/lib/i18n";
import { localePath } from "@/lib/routes";
import { LotusMark } from "@/components/site/lotus-mark";
import { Button } from "@/components/ui/button";

/**
 * Story of the day. The rotating pick is computed from the CLIENT's date
 * (replicating getRotatingStory's day-number logic), so it stays correct
 * on a static export long after build time. The pick is read through
 * useSyncExternalStore with a one-minute subscription — during static
 * generation the server snapshot (first story) is used, and after
 * hydration the store serves today's pick without a hydration mismatch.
 */

const DAY_MS = 86_400_000;

function subscribeDay(callback: () => void): () => void {
  const id = setInterval(callback, 60_000);
  return () => clearInterval(id);
}

function pickOfDay(stories: StoryCardData[]): StoryCardData {
  const now = new Date();
  const dayNumber = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / DAY_MS,
  );
  return stories[dayNumber % stories.length];
}

export function StoryOfDay({
  locale,
  stories,
}: {
  locale: SiteLocale;
  stories: StoryCardData[];
}) {
  const t = UI[locale];

  const story: StoryCardData | null = useSyncExternalStore(
    subscribeDay,
    () => (stories.length > 0 ? pickOfDay(stories) : null),
    () => (stories.length > 0 ? stories[0] : null),
  );

  return (
    <section aria-labelledby="story-of-day" className="w-full">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="story-of-day" className="font-serif text-2xl font-semibold">
          {t.home.featuredTitle}
        </h2>
        <p className="text-xs text-muted-foreground">{t.home.featuredNote}</p>
      </div>

      {story === null ? (
        <div className="rounded-xl border border-border/80 bg-card p-6 text-sm text-muted-foreground sm:p-8">
          {t.common.loading}
        </div>
      ) : (
        <article className="relative overflow-hidden rounded-xl border border-primary/25 bg-card p-6 shadow-xs sm:p-8">
          <LotusMark
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-10"
          />
          <p className="mb-2 text-xs font-medium tracking-widest text-primary/80">
            {story.id}
          </p>
          <h3 className="font-serif text-xl font-semibold leading-snug sm:text-2xl">
            <span lang={locale === "zh" ? "zh-Hant" : "en"}>{story.title[locale]}</span>
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground" lang={locale === "zh" ? "zh-Hant" : "en"}>
            {story.person[locale]}
            <span className="mx-2 text-border" aria-hidden="true">|</span>
            {story.periodLabel[locale]}
          </p>
          <p
            className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/85 sm:text-base"
            lang={locale === "zh" ? "zh-Hant" : "en"}
          >
            {story.synopsis[locale]}
          </p>
          <div className="mt-6">
            <Button asChild className="gap-1.5 font-medium">
              <Link href={localePath(locale, `/stories/${story.slug}`)}>
                {t.stories.viewStory}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </article>
      )}
    </section>
  );
}
