"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, ScrollText } from "lucide-react";

import type { SiteLocale } from "@/config/site";
import type { StoryCardData } from "@/lib/cards";
import { UI } from "@/lib/i18n";
import { localePath } from "@/lib/routes";
import { SUTRA_NARRATIVE_LABEL, THEME_LABEL, TRANSLATION_DRAFT_BADGE, WITNESS_COUNT_LABEL } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const THEME_BADGE_CLASS: Record<string, string> = {
  "peaceful-life": "border-amber-300/70 bg-amber-100/70 text-amber-900",
  "pure-land": "border-rose-300/70 bg-rose-100/70 text-rose-900",
};

/**
 * Story listing card. The whole card is clickable via an overlay link on
 * the title, with a subtle scroll-reveal animation.
 */
export function StoryCard({
  story,
  locale,
  index = 0,
  className,
}: {
  story: StoryCardData;
  locale: SiteLocale;
  index?: number;
  className?: string;
}) {
  const t = UI[locale];
  const reduceMotion = useReducedMotion();
  const href = localePath(locale, `/stories/${story.slug}`);
  const title = story.title[locale];
  const person = story.person[locale];
  const period = story.periodLabel[locale];
  const synopsis = story.synopsis[locale];

  const isDraft =
    story.translationStatus.zh === "editorial-draft" ||
    story.translationStatus.en === "editorial-draft";

  return (
    <motion.article
      className={cn("h-full", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{
        duration: 0.45,
        delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.3),
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      <div className="group relative flex h-full flex-col gap-3 rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-within:border-primary/50 sm:p-6">
        {/* Overlay link makes the entire card clickable. */}
        <Link
          href={href}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="sr-only">
            {title} — {t.stories.viewStory}
          </span>
        </Link>

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-base font-semibold leading-snug text-foreground group-hover:text-primary sm:text-lg">
            <span lang={locale === "zh" ? "zh-Hant" : "en"}>{title}</span>
          </h3>
          <ArrowRight
            className="mt-1 size-4 shrink-0 text-primary/70 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          <span lang={locale === "zh" ? "zh-Hant" : "en"}>
            {person}
            <span className="mx-2 text-border" aria-hidden="true">|</span>
            {period}
          </span>
        </p>

        <p
          className="line-clamp-3 text-sm leading-relaxed text-foreground/80"
          lang={locale === "zh" ? "zh-Hant" : "en"}
        >
          {synopsis}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {story.themes.map((th) => (
            <Badge
              key={th}
              variant="outline"
              className={cn("px-2 py-0 text-[11px] font-medium", THEME_BADGE_CLASS[th])}
            >
              {THEME_LABEL[th][locale]}
            </Badge>
          ))}
          {story.isSutraNarrative && (
            <Badge variant="outline" className="gap-1 border-orange-300/70 bg-orange-100/60 px-2 py-0 text-[11px] font-medium text-orange-900">
              <ScrollText className="size-3" aria-hidden="true" />
              {SUTRA_NARRATIVE_LABEL[locale]}
            </Badge>
          )}
          {isDraft && (
            <Badge variant="outline" className="px-2 py-0 text-[11px] font-medium text-muted-foreground">
              {TRANSLATION_DRAFT_BADGE[locale]}
            </Badge>
          )}
          <Badge variant="outline" className="gap-1 border-border bg-muted/60 px-2 py-0 text-[11px] font-medium text-muted-foreground">
            <BookOpen className="size-3" aria-hidden="true" />
            {WITNESS_COUNT_LABEL[locale](story.witnessCount)}
          </Badge>
        </div>
      </div>
    </motion.article>
  );
}
