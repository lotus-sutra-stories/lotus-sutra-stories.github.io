"use client";

import { useMemo, useState } from "react";
import { Info, ListFilter, SearchX, X } from "lucide-react";

import type { SiteLocale } from "@/config/site";
import type { StoryCardData } from "@/lib/cards";
import type { Theme, TaxonomyType } from "@/lib/types";
import { UI, fmt } from "@/lib/i18n";
import { NO_EXPLICIT_REBIRTH_NOTE, REBIRTH_LABEL } from "@/lib/labels";
import { FilterSelect } from "@/components/site/filters";
import { StoryCard } from "@/components/site/story-card";
import { Button } from "@/components/ui/button";

const REBIRTH_ORDER = ["explicit", "interpreted", "not-stated", "disputed"] as const;

interface FilterState {
  type: string;
  practice: string;
  period: string;
  rebirth: string;
  locale: SiteLocale;
  applyRebirth: boolean;
}

function applyFilters(list: StoryCardData[], f: FilterState): StoryCardData[] {
  return list.filter((m) => {
    if (f.type !== "all" && !m.secondaryTypes.includes(f.type)) return false;
    if (f.practice !== "all" && !m.practices.includes(f.practice)) return false;
    if (f.period !== "all" && m.periodLabel[f.locale] !== f.period) return false;
    if (f.applyRebirth && f.rebirth !== "all" && m.rebirthClaim !== f.rebirth) return false;
    return true;
  });
}

/**
 * Theme gallery with client-side filters. For the pure-land theme the
 * stories are split into a main section (attested aspiration for
 * Sukhāvatī or reported Sukhāvatī destination) and a related-records
 * section (e.g. the recorded Tuṣita destination of S009).
 */
export function ThemeGallery({
  locale,
  theme,
  metas,
  types,
  practices,
}: {
  locale: SiteLocale;
  theme: Theme;
  metas: StoryCardData[];
  types: TaxonomyType[];
  practices: { code: string; zh: string; en: string }[];
}) {
  const t = UI[locale];
  const [type, setType] = useState("all");
  const [practice, setPractice] = useState("all");
  const [period, setPeriod] = useState("all");
  const [rebirth, setRebirth] = useState("all");
  const [showRelated, setShowRelated] = useState(true);

  const isPureLand = theme === "pure-land";

  const { main, related } = useMemo(() => {
    if (!isPureLand) return { main: metas, related: [] as StoryCardData[] };
    const mainList = metas.filter(
      (m) => m.aspirationForSukhavati === "true" || m.reportedDestination === "sukhavati",
    );
    return { main: mainList, related: metas.filter((m) => !mainList.includes(m)) };
  }, [metas, isPureLand]);

  const periods = useMemo(() => {
    const seen: string[] = [];
    for (const m of metas) {
      const label = m.periodLabel[locale];
      if (!seen.includes(label)) seen.push(label);
    }
    return seen;
  }, [metas, locale]);

  const usedPractices = useMemo(() => {
    const used = new Set(metas.flatMap((m) => m.practices));
    return practices.filter((p) => used.has(p.code));
  }, [metas, practices]);

  const rebirthOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of metas) counts.set(m.rebirthClaim, (counts.get(m.rebirthClaim) ?? 0) + 1);
    return REBIRTH_ORDER
      .filter((r) => (counts.get(r) ?? 0) > 0)
      .map((r) => ({
        value: r,
        label: `${REBIRTH_LABEL[r][locale]} · ${counts.get(r) ?? 0}`,
      }));
  }, [metas, locale]);

  const explicitCount = metas.filter((m) => m.rebirthClaim === "explicit").length;

  const filterState: FilterState = {
    type,
    practice,
    period,
    rebirth,
    locale,
    applyRebirth: isPureLand,
  };

  // The corpus is small (19 stories); filtering is trivial, so no
  // memoization is needed and recomputing on render keeps the filtered
  // lists always consistent with the filter state.
  const filteredMain = applyFilters(main, filterState);
  const filteredRelated = applyFilters(related, filterState);

  const hasFilters =
    type !== "all" || practice !== "all" || period !== "all" || rebirth !== "all";

  const clearAll = () => {
    setType("all");
    setPractice("all");
    setPeriod("all");
    setRebirth("all");
  };

  return (
    <div className="space-y-8">
      {isPureLand && (
        <aside
          className="flex gap-3 rounded-xl border border-amber-300/70 bg-amber-100/60 p-4 text-sm leading-relaxed text-amber-950 sm:p-5"
          role="note"
        >
          <Info className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden="true" />
          <p className="font-medium">{t.taxonomy.taxonomyCaveat}</p>
        </aside>
      )}

      {/* Filter bar */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card/70 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
          <ListFilter className="size-4" aria-hidden="true" />
          {t.taxonomy.filterType} · {t.taxonomy.filterPractice} · {t.taxonomy.filterPeriod}
          {isPureLand ? ` · ${t.taxonomy.filterRebirth}` : null}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <FilterSelect
            id="theme-filter-type"
            label={t.taxonomy.filterType}
            allLabel={t.taxonomy.filterAll}
            value={type}
            onChange={setType}
            options={types.map((ty) => ({ value: ty.code, label: ty[locale] }))}
          />
          <FilterSelect
            id="theme-filter-practice"
            label={t.taxonomy.filterPractice}
            allLabel={t.taxonomy.filterAll}
            value={practice}
            onChange={setPractice}
            options={usedPractices.map((p) => ({ value: p.code, label: p[locale] }))}
          />
          <FilterSelect
            id="theme-filter-period"
            label={t.taxonomy.filterPeriod}
            allLabel={t.taxonomy.filterAll}
            value={period}
            onChange={setPeriod}
            options={periods.map((p) => ({ value: p, label: p }))}
          />
          {isPureLand && (
            <FilterSelect
              id="theme-filter-rebirth"
              label={t.taxonomy.filterRebirth}
              allLabel={t.taxonomy.filterAll}
              value={rebirth}
              onChange={setRebirth}
              options={rebirthOptions}
            />
          )}
        </div>
        {isPureLand && explicitCount === 0 && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            ※ {NO_EXPLICIT_REBIRTH_NOTE[locale]}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
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
            {fmt(t.taxonomy.resultsCount, { count: filteredMain.length })}
          </p>
        </div>
      </div>

      {/* Main grid */}
      {filteredMain.length > 0 ? (
        <div className="lss-scroll grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMain.map((m, i) => (
            <StoryCard key={m.slug} story={m} locale={locale} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <SearchX className="size-10 text-muted-foreground/60" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{t.taxonomy.noResults}</p>
          {hasFilters && (
            <Button type="button" variant="outline" size="sm" onClick={clearAll}>
              {t.taxonomy.clearFilters}
            </Button>
          )}
        </div>
      )}

      {/* Related records (pure-land only) */}
      {isPureLand && related.length > 0 && (
        <section aria-labelledby="related-records" className="space-y-4 border-t border-border/70 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="related-records" className="font-serif text-xl font-semibold">
              {t.taxonomy.relatedNote}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 text-muted-foreground"
              aria-pressed={showRelated}
              onClick={() => setShowRelated((v) => !v)}
            >
              {t.taxonomy.showRelated}
            </Button>
          </div>
          {showRelated && (
            <div className="lss-scroll grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRelated.map((m, i) => (
                <StoryCard key={m.slug} story={m} locale={locale} index={i} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
