"use client";

import { useMemo, useState } from "react";
import { Bookmark, Search, SearchX, X } from "lucide-react";

import type { SiteLocale } from "@/config/site";
import type { StoryCardData } from "@/lib/cards";
import type { SearchDoc } from "@/lib/content";
import type { TaxonomyType } from "@/lib/types";
import { UI, fmt } from "@/lib/i18n";
import { BOOKMARK_FILTER_LABEL, REBIRTH_LABEL, THEME_LABEL } from "@/lib/labels";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { FilterSelect } from "@/components/site/filters";
import { StoryCard } from "@/components/site/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function matchesQuery(doc: SearchDoc, tokens: string[]): boolean {
  const hay = [
    doc.title,
    doc.person,
    doc.period,
    doc.synopsis,
    doc.aliases.join(" "),
    doc.body ?? "",
  ]
    .join("\n")
    .toLowerCase();
  return tokens.every((token) => hay.includes(token));
}

/**
 * All-stories explorer: client-side full-text search over the locale
 * search index, plus theme / type / practice / period / rebirth filters
 * and a bookmark filter backed by localStorage.
 */
export function StoryExplorer({
  locale,
  metas,
  docs,
  types,
  practices,
}: {
  locale: SiteLocale;
  metas: StoryCardData[];
  docs: SearchDoc[];
  types: TaxonomyType[];
  practices: { code: string; zh: string; en: string }[];
}) {
  const t = UI[locale];
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("all");
  const [type, setType] = useState("all");
  const [practice, setPractice] = useState("all");
  const [period, setPeriod] = useState("all");
  const [rebirth, setRebirth] = useState("all");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const bookmarked = useBookmarks();

  const docMap = useMemo(() => new Map(docs.map((d) => [d.slug, d])), [docs]);

  const periods = useMemo(() => {
    const seen: string[] = [];
    for (const m of metas) {
      const label = m.periodLabel[locale];
      if (!seen.includes(label)) seen.push(label);
    }
    return seen;
  }, [metas, locale]);

  const themeTypes = useMemo(
    () => (theme === "all" ? types : types.filter((ty) => ty.theme === theme)),
    [types, theme],
  );

  const usedPractices = useMemo(() => {
    const used = new Set(metas.flatMap((m) => m.practices));
    return practices.filter((p) => used.has(p.code));
  }, [metas, practices]);

  const rebirthOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of metas) counts.set(m.rebirthClaim, (counts.get(m.rebirthClaim) ?? 0) + 1);
    return (["explicit", "interpreted", "not-stated", "disputed"] as const)
      .filter((r) => (counts.get(r) ?? 0) > 0)
      .map((r) => ({ value: r, label: REBIRTH_LABEL[r][locale] }));
  }, [metas, locale]);

  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return metas.filter((m) => {
      if (tokens.length > 0) {
        const doc = docMap.get(m.slug);
        if (!doc || !matchesQuery(doc, tokens)) return false;
      }
      if (theme !== "all" && !m.themes.includes(theme as "peaceful-life" | "pure-land")) return false;
      if (type !== "all" && !m.secondaryTypes.includes(type)) return false;
      if (practice !== "all" && !m.practices.includes(practice)) return false;
      if (period !== "all" && m.periodLabel[locale] !== period) return false;
      if (rebirth !== "all" && m.rebirthClaim !== rebirth) return false;
      if (bookmarksOnly && !bookmarked.has(m.slug)) return false;
      return true;
    });
  }, [metas, query, theme, type, practice, period, rebirth, bookmarksOnly, bookmarked, docMap, locale]);

  const hasFilters =
    query.trim() !== "" ||
    theme !== "all" ||
    type !== "all" ||
    practice !== "all" ||
    period !== "all" ||
    rebirth !== "all" ||
    bookmarksOnly;

  const clearAll = () => {
    setQuery("");
    setTheme("all");
    setType("all");
    setPractice("all");
    setPeriod("all");
    setRebirth("all");
    setBookmarksOnly(false);
  };

  return (
    <div className="space-y-6">
      {/* Search + filters */}
      <div className="space-y-4 rounded-xl border border-border/80 bg-card/70 p-4 sm:p-5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="story-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.stories.searchPlaceholder}
            aria-label={t.stories.searchLabel}
            className="h-11 bg-card pl-10 text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <FilterSelect
            id="filter-theme"
            label={t.stories.themesLabel}
            allLabel={t.taxonomy.filterAll}
            value={theme}
            onChange={(v) => {
              setTheme(v);
              setType("all");
            }}
            options={[
              { value: "peaceful-life", label: THEME_LABEL["peaceful-life"][locale] },
              { value: "pure-land", label: THEME_LABEL["pure-land"][locale] },
            ]}
          />
          <FilterSelect
            id="filter-type"
            label={t.taxonomy.filterType}
            allLabel={t.taxonomy.filterAll}
            value={type}
            onChange={setType}
            options={themeTypes.map((ty) => ({ value: ty.code, label: ty[locale] }))}
          />
          <FilterSelect
            id="filter-practice"
            label={t.taxonomy.filterPractice}
            allLabel={t.taxonomy.filterAll}
            value={practice}
            onChange={setPractice}
            options={usedPractices.map((p) => ({ value: p.code, label: p[locale] }))}
          />
          <FilterSelect
            id="filter-period"
            label={t.taxonomy.filterPeriod}
            allLabel={t.taxonomy.filterAll}
            value={period}
            onChange={setPeriod}
            options={periods.map((p) => ({ value: p, label: p }))}
          />
          <FilterSelect
            id="filter-rebirth"
            label={t.taxonomy.filterRebirth}
            allLabel={t.taxonomy.filterAll}
            value={rebirth}
            onChange={setRebirth}
            options={rebirthOptions}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={bookmarksOnly ? "default" : "outline"}
            size="sm"
            className="h-9 gap-1.5"
            aria-pressed={bookmarksOnly}
            onClick={() => setBookmarksOnly((v) => !v)}
          >
            <Bookmark className="size-3.5" aria-hidden="true" />
            {BOOKMARK_FILTER_LABEL[locale]}
          </Button>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 gap-1.5 text-muted-foreground"
              onClick={clearAll}
            >
              <X className="size-3.5" aria-hidden="true" />
              {t.taxonomy.clearFilters}
            </Button>
          )}
          <p className="ml-auto text-sm text-muted-foreground" aria-live="polite">
            {query.trim()
              ? fmt(t.stories.searchCount, { count: filtered.length })
              : fmt(t.taxonomy.resultsCount, { count: filtered.length })}
          </p>
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="lss-scroll grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m, i) => (
            <StoryCard key={m.slug} story={m} locale={locale} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <SearchX className="size-10 text-muted-foreground/60" aria-hidden="true" />
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {query.trim()
              ? fmt(t.stories.searchNoResults, { query: query.trim() })
              : t.taxonomy.noResults}
          </p>
          {hasFilters && (
            <Button type="button" variant="outline" size="sm" onClick={clearAll}>
              {t.taxonomy.clearFilters}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
