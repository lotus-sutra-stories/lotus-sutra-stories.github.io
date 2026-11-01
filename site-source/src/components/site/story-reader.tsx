"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  FileText,
  Info,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import type { SiteLocale } from "@/config/site";
import type { StoryCardData } from "@/lib/cards";
import type { StoryMeta, StoryWitness } from "@/lib/types";
import { UI, fmt } from "@/lib/i18n";
import {
  INLINE_CITATION_LABEL,
  REBIRTH_LABEL,
  SUTRA_NARRATIVE_LABEL,
  THEME_LABEL,
  TRANSLATION_REVIEWED_BADGE,
  juanCn,
} from "@/lib/labels";
import { localePath } from "@/lib/routes";
import { toggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { updateReaderPrefs, useReaderPrefs } from "@/hooks/use-reader-prefs";
import { MarkdownBody } from "@/components/site/markdown-body";
import { ReadingPrefs } from "@/components/site/reading-prefs";
import { StoryCard } from "@/components/site/story-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Mode = "modern" | "original" | "english" | "parallel";

const THEME_BADGE_CLASS: Record<string, string> = {
  "peaceful-life": "border-amber-300/70 bg-amber-100/70 text-amber-900",
  "pure-land": "border-rose-300/70 bg-rose-100/70 text-rose-900",
};

function workTitleLabel(locale: SiteLocale, work: "X1540" | "X1541"): string {
  return work === "X1540" ? UI[locale].reader.witnessX1540 : UI[locale].reader.witnessX1541;
}

function anchorTitle(anchor: string, locale: SiteLocale): string {
  const page = anchor.slice(0, 4);
  const col = anchor.slice(4, 5);
  return fmt(UI[locale].reader.anchorHint, { page, col });
}

/** Split a classical paragraph into text and preserved 〔注：…〕 notes. */
function renderInlineNotes(text: string, locale: SiteLocale) {
  const parts = text.split(/(〔注：[^〕]*〕)/g);
  const label = UI[locale].reader.inlineNoteLabel;
  return parts.map((part, i) =>
    part.startsWith("〔注：") ? (
      <span key={i} className="inline-note" title={label}>
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function buildCitation(locale: SiteLocale, meta: StoryMeta, witness: StoryWitness): string {
  const workTitle = workTitleLabel(locale, witness.work);
  const no = witness.work === "X1540" ? "1540" : "1541";
  if (locale === "zh") {
    return `${meta.title.zh}（${meta.id}）${workTitle}${fmt(UI.zh.library.juanLabel, {
      juan: juanCn(witness.juan),
    })}，CBETA X78, No. ${no}，${witness.locator}。${witness.url}（accessed ${witness.accessed}）`;
  }
  return `${meta.title.en} (${meta.id}), ${workTitle}, juan ${witness.juan}, CBETA X78, No. ${no}, ${witness.locator}. ${witness.url} (accessed ${witness.accessed})`;
}

/**
 * The story reader: four reading modes (modern Chinese, original
 * witnesses with line anchors and inline notes, English, side-by-side),
 * localStorage-persisted reading preferences, bookmark, citation copy,
 * source/editorial panels and textual notes.
 */
export function StoryReader({
  locale,
  meta,
  texts,
  prev,
  next,
  related,
}: {
  locale: SiteLocale;
  meta: StoryMeta;
  texts: { zh: string; en: string; notes: string };
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  related: StoryCardData[];
}) {
  const t = UI[locale];
  const [mode, setMode] = useState<Mode>("modern");
  const [witnessIdx, setWitnessIdx] = useState(0);
  // Shared, localStorage-backed stores (see @/hooks/use-bookmarks and
  // @/hooks/use-reader-prefs): reading prefs follow the reader across
  // pages, bookmarks stay in sync with the story explorer, and both render
  // stable server snapshots so static export hydration is mismatch-free.
  const prefs = useReaderPrefs();
  const bookmarks = useBookmarks();
  const bookmarked = bookmarks.has(meta.slug);

  const witness =
    meta.witnesses[Math.min(witnessIdx, meta.witnesses.length - 1)] ?? meta.witnesses[0];
  const citation = useMemo(
    () => buildCitation(locale, meta, witness),
    [locale, meta, witness],
  );

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      toast(t.reader.citationCopied);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = citation;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        toast(t.reader.citationCopied);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  const fontClass =
    prefs.fontSize === "s" ? "text-[15px]" : prefs.fontSize === "l" ? "text-[19px]" : "text-[17px]";
  const lineClass =
    prefs.lineHeight === 0
      ? "leading-relaxed"
      : prefs.lineHeight === 2
        ? "leading-[2.15]"
        : "leading-loose";
  const paneClass = cn(
    "rounded-xl px-5 py-7 sm:px-8 sm:py-10 md:px-10",
    prefs.pane === "night" ? "pane-night" : "pane-paper",
    fontClass,
    lineClass,
  );

  const title = meta.title[locale];
  const isDraftZh = meta.editorial.translationStatus.zh === "editorial-draft";
  const isDraftEn = meta.editorial.translationStatus.en === "editorial-draft";

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
          <li>
            <Link
              href={localePath(locale, "/")}
              className="underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {t.nav.home}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={localePath(locale, "/stories")}
              className="underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {t.stories.title}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="max-w-full truncate text-foreground/80">
            {title}
          </li>
        </ol>
      </nav>

      {/* Article header */}
      <header className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className="bg-transparent px-2 py-0 text-[11px] font-mono text-muted-foreground" variant="outline">
            {meta.id}
          </Badge>
          {meta.themes.map((th) => (
            <Badge
              key={th}
              variant="outline"
              className={cn("px-2 py-0 text-[11px] font-medium", THEME_BADGE_CLASS[th])}
            >
              {THEME_LABEL[th][locale]}
            </Badge>
          ))}
          {meta.isSutraNarrative && (
            <Badge
              variant="outline"
              className="gap-1 border-orange-300/70 bg-orange-100/60 px-2 py-0 text-[11px] font-medium text-orange-900"
            >
              <ScrollText className="size-3" aria-hidden="true" />
              {SUTRA_NARRATIVE_LABEL[locale]}
            </Badge>
          )}
          {meta.themes.includes("pure-land") && (
            <Badge variant="outline" className="px-2 py-0 text-[11px] font-medium text-muted-foreground">
              {REBIRTH_LABEL[meta.rebirthClaim][locale]}
            </Badge>
          )}
        </div>

        <h1
          className="font-serif text-2xl font-semibold leading-tight sm:text-4xl"
          lang={locale === "zh" ? "zh-Hant" : "en"}
        >
          {title}
        </h1>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p lang={locale === "zh" ? "zh-Hant" : "en"}>
            <span className="font-medium text-foreground/80">{t.stories.personLabel}：</span>
            {meta.person[locale]}
          </p>
          <p lang={locale === "zh" ? "zh-Hant" : "en"}>
            <span className="font-medium text-foreground/80">{t.stories.periodLabel}：</span>
            {meta.period.label[locale]}
          </p>
          {meta.period.note && (
            <p className="text-xs leading-relaxed" lang={locale === "zh" ? "zh-Hant" : "en"}>
              {meta.period.note[locale]}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={bookmarked ? "default" : "outline"}
                  size="sm"
                  className="h-10 gap-1.5"
                  aria-pressed={bookmarked}
                  onClick={() => toggleBookmark(meta.slug)}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="size-4" aria-hidden="true" />
                  ) : (
                    <Bookmark className="size-4" aria-hidden="true" />
                  )}
                  {bookmarked ? t.reader.bookmarked : t.reader.bookmark}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-center text-xs">
                {t.reader.bookmarkHint}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 gap-1.5"
            onClick={copyCitation}
          >
            <Copy className="size-4" aria-hidden="true" />
            {t.reader.copyCitation}
          </Button>
        </div>
      </header>

      {/* Body: reading pane + side panels */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Reading preferences (mobile) */}
          <div className="mb-5 lg:hidden">
            <ReadingPrefs locale={locale} prefs={prefs} onChange={updateReaderPrefs} idPrefix="prefs-m" />
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
            <div className="mb-5">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:w-auto sm:grid-cols-4">
                <TabsTrigger value="modern" className="h-[52px] min-h-[52px] w-full min-w-0 whitespace-normal px-3 py-2 text-center text-xs leading-snug sm:h-12 sm:min-h-12 sm:text-sm">
                  {t.reader.modeModern}
                </TabsTrigger>
                <TabsTrigger value="original" className="h-[52px] min-h-[52px] w-full min-w-0 whitespace-normal px-3 py-2 text-center text-xs leading-snug sm:h-12 sm:min-h-12 sm:text-sm">
                  {t.reader.modeOriginal}
                </TabsTrigger>
                <TabsTrigger value="english" className="h-[52px] min-h-[52px] w-full min-w-0 whitespace-normal px-3 py-2 text-center text-xs leading-snug sm:h-12 sm:min-h-12 sm:text-sm">
                  {t.reader.modeEnglish}
                </TabsTrigger>
                <TabsTrigger value="parallel" className="h-[52px] min-h-[52px] w-full min-w-0 whitespace-normal px-3 py-2 text-center text-xs leading-snug sm:h-12 sm:min-h-12 sm:text-sm">
                  {t.reader.modeParallel}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="modern" className="mt-0">
              <div className={paneClass}>
                <MarkdownBody lang="zh-Hant">{texts.zh}</MarkdownBody>
              </div>
            </TabsContent>

            <TabsContent value="original" className="mt-0 space-y-4">
              {meta.witnesses.length > 1 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {t.reader.witnessLabel}
                  </p>
                  <ToggleGroup
                    type="single"
                    value={String(witnessIdx)}
                    onValueChange={(v) => {
                      if (v !== "") setWitnessIdx(Number(v));
                    }}
                    variant="outline"
                    className="flex w-fit flex-wrap justify-start gap-2"
                  >
                    {meta.witnesses.map((w, i) => (
                      <ToggleGroupItem
                        key={`${w.work}-${w.juan}-${i}`}
                        value={String(i)}
                        className="h-10 gap-2 whitespace-nowrap rounded-lg px-3 text-xs sm:text-sm"
                        aria-label={`${workTitleLabel(locale, w.work)} ${w.juan}`}
                      >
                        <span lang="zh-Hant">{workTitleLabel(locale, w.work)}</span>
                        <span className="text-muted-foreground">
                          {fmt(t.library.juanLabel, { juan: juanCn(w.juan) })}
                        </span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              )}

              <div className={paneClass} lang="zh-Hant">
                <div className="space-y-6">
                  {witness.paragraphs.map((p, i) => (
                    <p key={`${p.anchor}-${i}`} className="orig-para">
                      {prefs.showAnchors && (
                        <span className="anchor-code" title={anchorTitle(p.anchor, locale)}>
                          {p.anchor}
                          <span className="sr-only"> — {anchorTitle(p.anchor, locale)}</span>
                        </span>
                      )}
                      {renderInlineNotes(p.text, locale)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  {t.reader.witnessNote}
                </p>
                <p className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  {t.reader.gaijiNote}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="english" className="mt-0">
              <div className={paneClass}>
                <MarkdownBody lang="en">{texts.en}</MarkdownBody>
              </div>
            </TabsContent>

            <TabsContent value="parallel" className="mt-0">
              <div className={paneClass}>
                <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                  <section lang="zh-Hant" aria-label={t.reader.modeModern}>
                    <h3 className="pane-subhead font-serif text-sm font-semibold tracking-wide">
                      {t.reader.modeModern}
                    </h3>
                    <MarkdownBody lang="zh-Hant">{texts.zh}</MarkdownBody>
                  </section>
                  <section lang="en" aria-label={t.reader.modeEnglish}>
                    <h3 className="pane-subhead font-serif text-sm font-semibold tracking-wide">
                      {t.reader.modeEnglish}
                    </h3>
                    <MarkdownBody lang="en">{texts.en}</MarkdownBody>
                  </section>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Textual notes & variants */}
          {texts.notes.trim().length > 0 && (
            <Collapsible className="mt-8">
              <div className="rounded-xl border border-border/80 bg-card">
                <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5">
                  <span className="flex items-center gap-2 font-serif text-sm font-semibold tracking-wide">
                    <FileText className="size-4 text-primary" aria-hidden="true" />
                    {t.reader.notesPanel}
                  </span>
                  <ChevronDown
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-5 sm:px-5 sm:pb-6">
                  <Separator className="mb-4" />
                  <MarkdownBody lang="zh-Hant" className="text-sm">
                    {texts.notes}
                  </MarkdownBody>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </div>

        {/* Side panels */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label={t.reader.sourcePanel}>
          {/* Reading preferences (desktop) */}
          <div className="hidden lg:block">
            <ReadingPrefs locale={locale} prefs={prefs} onChange={updateReaderPrefs} idPrefix="prefs-d" />
          </div>

          {/* Source panel */}
          <section className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
            <h3 className="flex items-center gap-2 font-serif text-sm font-semibold tracking-wide">
              <BookOpen className="size-4 text-primary" aria-hidden="true" />
              {t.reader.sourcePanel}
            </h3>
            <div className="mt-4 space-y-5">
              {meta.witnesses.map((w, i) => (
                <div key={`${w.work}-${i}`} className="space-y-1.5 text-sm">
                  <p className="font-serif font-semibold leading-snug" lang="zh-Hant">
                    {workTitleLabel(locale, w.work)}
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      {fmt(t.library.juanLabel, { juan: juanCn(w.juan) })}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground" lang="zh-Hant">
                    「{w.heading}」
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">{w.locator}</p>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {t.library.sourceLinks}
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {t.common.dateLabel}: {w.accessed}
                  </p>
                  {w.inlineCitation && (
                    <p className="text-xs leading-relaxed text-muted-foreground" lang="zh-Hant">
                      {INLINE_CITATION_LABEL[locale]}：{w.inlineCitation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Editorial panel */}
          <section className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
            <h3 className="flex items-center gap-2 font-serif text-sm font-semibold tracking-wide">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              {t.reader.editorialPanel}
            </h3>
            <div className="mt-4 space-y-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.reader.sourceVerified}（{meta.editorial.sourceVerifiedDate}）
              </p>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-foreground/80">{t.reader.translationStatus}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="px-2 py-0 text-[11px] text-muted-foreground">
                    {isDraftZh ? t.reader.zhDraft : TRANSLATION_REVIEWED_BADGE[locale]}
                  </Badge>
                  <Badge variant="outline" className="px-2 py-0 text-[11px] text-muted-foreground">
                    {isDraftEn ? t.reader.enDraft : TRANSLATION_REVIEWED_BADGE[locale]}
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Prev / next */}
      <nav aria-label={t.nav.stories} className="mt-10 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={localePath(locale, `/stories/${prev.slug}`)}
            className="group flex items-center gap-3 rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ChevronLeft
              className="size-5 shrink-0 text-primary/70 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t.reader.prevStory}</p>
              <p className="truncate font-serif text-sm font-semibold" lang={locale === "zh" ? "zh-Hant" : "en"}>
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" aria-hidden="true" />
        )}
        {next ? (
          <Link
            href={localePath(locale, `/stories/${next.slug}`)}
            className="group flex items-center justify-end gap-3 rounded-xl border border-border/80 bg-card p-4 text-right transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t.reader.nextStory}</p>
              <p className="truncate font-serif text-sm font-semibold" lang={locale === "zh" ? "zh-Hant" : "en"}>
                {next.title}
              </p>
            </div>
            <ChevronRight
              className="size-5 shrink-0 text-primary/70 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <div className="hidden sm:block" aria-hidden="true" />
        )}
      </nav>

      {/* Related stories */}
      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-stories">
          <div className="mb-5 flex items-center gap-3">
            <h2 id="related-stories" className="font-serif text-xl font-semibold sm:text-2xl">
              {t.reader.relatedStories}
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" aria-hidden="true" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((m, i) => (
              <StoryCard key={m.slug} story={m} locale={locale} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
