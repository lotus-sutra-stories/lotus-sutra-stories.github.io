import type { StoryCardData } from "./cards";
import type { SearchDoc } from "./content";
import type { SiteLocale } from "@/config/site";

export interface StoryFilters {
  query: string; theme: string; identity: string; type: string;
  practice: string; period: string; rebirth: string; bookmarksOnly: boolean;
}
export const EMPTY_FILTERS: StoryFilters = {
  query: "", theme: "all", identity: "all", type: "all", practice: "all",
  period: "all", rebirth: "all", bookmarksOnly: false,
};
export function filterStories(metas: StoryCardData[], docs: SearchDoc[], locale: SiteLocale, filters: StoryFilters, bookmarked: ReadonlySet<string>): StoryCardData[] {
  const docMap = new Map(docs.map(d => [d.slug, d]));
  const tokens = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return metas.filter(m => {
    const doc = docMap.get(m.slug);
    const hay = doc ? [doc.title, doc.person, doc.period, doc.synopsis, doc.aliases.join(" "), doc.body ?? ""].join("\n").toLowerCase() : "";
    if (tokens.length && (!doc || !tokens.every(token => hay.includes(token)))) return false;
    if (filters.theme !== "all" && !m.themes.includes(filters.theme as "peaceful-life" | "pure-land")) return false;
    if (filters.identity !== "all" && m.identityCategory !== filters.identity) return false;
    if (filters.type !== "all" && !m.secondaryTypes.includes(filters.type)) return false;
    if (filters.practice !== "all" && !m.practices.includes(filters.practice)) return false;
    if (filters.period !== "all" && m.periodLabel[locale] !== filters.period) return false;
    if (filters.rebirth !== "all" && m.rebirthClaim !== filters.rebirth) return false;
    return !filters.bookmarksOnly || bookmarked.has(m.slug);
  });
}
