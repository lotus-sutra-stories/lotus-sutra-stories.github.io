/**
 * Content model for Lotus Sutra Stories（法華感應錄）.
 *
 * Editorial integrity rules encoded in these types:
 * - Every story carries one or more *witnesses* (primary-source text
 *   occurrences in X1540 / X1541), kept separate even when the same
 *   narrative appears in both works (story-to-source many-to-many).
 * - Pure Land claims are classified explicitly (`rebirthClaim`,
 *   `reportedDestination`, `aspirationForSukhavati`) so that ambiguous
 *   accounts are never silently presented as attested rebirth.
 * - Publication states are strict; `published` requires a verified
 *   primary source plus complete bilingual content.
 */

export type WorkCode = "X1540" | "X1541";

export type Theme = "peaceful-life" | "pure-land";

export type StoryStatus =
  | "draft" // editorial backlog candidate only; never listed publicly
  | "source-checked" // original text transcribed & located; translations pending
  | "translation-draft" // bilingual drafts complete; awaiting independent review
  | "published"; // publicly listed (translation review status still surfaced)

export type RebirthClaim = "explicit" | "interpreted" | "not-stated" | "disputed";

export type ReportedDestination = "sukhavati" | "tusita" | "other" | "unspecified";

export type Ternary = true | false | "uncertain";

/** A single primary-source occurrence of a story narrative. */
export interface StoryWitness {
  work: WorkCode;
  juan: 1 | 2;
  /** Precise original section heading in the cited edition. */
  heading: string;
  /** CBETA locator of the first line, e.g. "X78n1540_p0034a09". */
  anchorStart: string;
  /** CBETA locator of the last line. */
  anchorEnd: string;
  /** Human-readable locator (page/col/line range in the 卍續藏 pagination). */
  locator: string;
  /** Working deep URL to the digital edition. */
  url: string;
  /** Date the source was accessed and transcribed (ISO 8601). */
  accessed: string;
  /** Inline source citation printed in the original (e.g. 續高僧傳), if any. */
  inlineCitation?: string;
  /** Transcribed paragraphs with per-paragraph line anchors. */
  paragraphs: { anchor: string; text: string }[];
}

export interface StoryMeta {
  /** Immutable canonical ID (stable across redesigns), e.g. "PL001". */
  id: string;
  /** URL slug, e.g. "bacheng-exclusive-prayer-for-the-west". */
  slug: string;
  status: StoryStatus;
  title: { zh: string; en: string };
  /** Primary person(s) the account is about. */
  person: { zh: string; en: string };
  /** Searchable name variants (incl. alias spellings & courtesy names). */
  aliases: string[];
  period: {
    label: { zh: string; en: string };
    note?: { zh: string; en: string };
  };
  themes: Theme[];
  /** Taxonomy codes from src/content/taxonomy.json. */
  secondaryTypes: string[];
  /** Practice codes from taxonomy.json practices list. */
  practices: string[];
  rebirthClaim: RebirthClaim;
  reportedDestination: ReportedDestination;
  aspirationForSukhavati: Ternary;
  /** True for narratives retold from the Lotus Sutra itself (古聖 section). */
  isSutraNarrative: boolean;
  synopsis: { zh: string; en: string };
  witnesses: StoryWitness[];
  editorial: {
    /** ISO date the original text was verified against the cited edition. */
    sourceVerifiedDate: string;
    translationStatus: {
      zh: "editorial-draft" | "reviewed";
      en: "editorial-draft" | "reviewed";
    };
  };
}

export interface WorkRecord {
  code: WorkCode;
  titleZh: string;
  titleEn: string;
  compilerZh: string;
  compilerEn: string;
  dynastyZh: string;
  dynastyEn: string;
  cbetaId: string;
  volumes: number;
  structureNote: { zh: string; en: string };
  sections: {
    nameZh: string;
    nameEn: string;
    count?: string;
    juan: 1 | 2 | "1-2";
  }[];
  sourceUrls: { label: string; url: string }[];
  licenseNote: { zh: string; en: string };
}

export interface TaxonomyType {
  code: string;
  theme: Theme;
  zh: string;
  en: string;
}

export interface GlossaryEntry {
  zh: string;
  en: string;
  note?: { zh: string; en: string };
}

export interface Bilingual {
  zh: string;
  en: string;
}
