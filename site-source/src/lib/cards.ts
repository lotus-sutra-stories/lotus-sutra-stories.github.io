import { getIdentityCategory } from "./identity-records";
import type { IdentityCategory } from "./identities";
import type { StoryMeta, Theme, RebirthClaim, ReportedDestination } from "./types";

/**
 * Lightweight, fully-serialisable projection of a story used by client
 * components (cards, filters, story-of-the-day). Keeps the full witness
 * paragraph texts out of listing pages.
 */
export interface StoryCardData {
  identityCategory: IdentityCategory;
  id: string;
  slug: string;
  title: { zh: string; en: string };
  person: { zh: string; en: string };
  periodLabel: { zh: string; en: string };
  themes: Theme[];
  secondaryTypes: string[];
  practices: string[];
  rebirthClaim: RebirthClaim;
  reportedDestination: ReportedDestination;
  aspirationForSukhavati: string;
  isSutraNarrative: boolean;
  synopsis: { zh: string; en: string };
  witnessCount: number;
  translationStatus: { zh: string; en: string };
}

export function toCardData(m: StoryMeta): StoryCardData {
  return {
    identityCategory: getIdentityCategory(m.id),
    id: m.id,
    slug: m.slug,
    title: m.title,
    person: m.person,
    periodLabel: m.period.label,
    themes: m.themes,
    secondaryTypes: m.secondaryTypes,
    practices: m.practices,
    rebirthClaim: m.rebirthClaim,
    reportedDestination: m.reportedDestination,
    aspirationForSukhavati:
      m.aspirationForSukhavati === true
        ? "true"
        : m.aspirationForSukhavati === false
          ? "false"
          : "uncertain",
    isSutraNarrative: m.isSutraNarrative,
    synopsis: m.synopsis,
    witnessCount: m.witnesses.length,
    translationStatus: m.editorial.translationStatus,
  };
}
