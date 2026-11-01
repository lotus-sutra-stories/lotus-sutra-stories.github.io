import fs from "node:fs";
import path from "node:path";
import type { SiteLocale } from "@/config/site";
import type { StoryMeta, WorkRecord, TaxonomyType, GlossaryEntry } from "./types";
import { validateStoryMeta, validateWorkRecord, type ValidationIssue } from "./validation";

/**
 * Build-time content loader. All access is synchronous file reads from
 * src/content — there is no runtime content backend, database or CMS.
 * Every page using this module is statically generated.
 */

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
const STORIES_ROOT = path.join(CONTENT_ROOT, "stories");

function readJson<T>(relPath: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_ROOT, relPath), "utf-8")) as T;
}

function readStoryFile(slug: string, file: string): string | null {
  const p = path.join(STORIES_ROOT, slug, file);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null;
}

/** All story metadata (any status), validated. Throws on structural errors. */
export function getAllStoryMetas(): StoryMeta[] {
  const slugs = fs.readdirSync(STORIES_ROOT).filter((d) => {
    const metaPath = path.join(STORIES_ROOT, d, "meta.json");
    return fs.existsSync(metaPath);
  });
  const metas: StoryMeta[] = [];
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  for (const slug of slugs) {
    let meta: unknown;
    try {
      meta = JSON.parse(fs.readFileSync(path.join(STORIES_ROOT, slug, "meta.json"), "utf-8"));
    } catch (e) {
      throw new Error(`Malformed JSON in stories/${slug}/meta.json: ${(e as Error).message}`);
    }
    const storyIssues = validateStoryMeta(meta);
    issues.push(...storyIssues);
    const m = meta as StoryMeta;
    if (seenIds.has(m.id)) {
      issues.push({ story: m.id, field: "id", message: `duplicate story id: ${m.id}`, severity: "error" });
    }
    if (seenSlugs.has(m.slug)) {
      issues.push({ story: m.id, field: "slug", message: `duplicate story slug: ${m.slug}`, severity: "error" });
    }
    if (m.slug !== slug) {
      issues.push({ story: m.id, field: "slug", message: `slug "${m.slug}" does not match folder "${slug}"`, severity: "error" });
    }
    seenIds.add(m.id);
    seenSlugs.add(m.slug);
    metas.push(m);
  }
  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length > 0) {
    const lines = errors.map((i) => `  [${i.story ?? "-"}] ${i.field}: ${i.message}`);
    throw new Error(`Content validation failed (${errors.length} error(s)):\n${lines.join("\n")}`);
  }
  return metas;
}

export function validationWarnings(): ValidationIssue[] {
  const metas = getAllStoryMetas();
  return metas.flatMap((m) => validateStoryMeta(m).filter((i) => i.severity === "warning"));
}

/** Publicly listed stories only — drafts never leak into listings or sitemaps. */
export function getPublishedStoryMetas(): StoryMeta[] {
  return getAllStoryMetas()
    .filter((m) => m.status === "published")
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getStoryBySlug(slug: string): StoryMeta | undefined {
  return getAllStoryMetas().find((m) => m.slug === slug && m.status === "published");
}

export interface StoryTexts {
  zh: string;
  en: string;
  notes: string;
}

export function getStoryTexts(slug: string): StoryTexts | null {
  const zh = readStoryFile(slug, "zh.md");
  const en = readStoryFile(slug, "en.md");
  const notes = readStoryFile(slug, "notes.md");
  if (!zh || !en) return null;
  return { zh, en, notes: notes ?? "" };
}

export function getWorks(): WorkRecord[] {
  const works = readJson<WorkRecord[]>("sources/works.json");
  const issues = works.flatMap((w) => validateWorkRecord(w));
  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length > 0) {
    throw new Error(`Work record validation failed: ${JSON.stringify(errors)}`);
  }
  return works;
}

export function getTaxonomy(): TaxonomyType[] {
  return readJson<TaxonomyType[]>("taxonomy.json");
}

export function getGlossary(): GlossaryEntry[] {
  return readJson<GlossaryEntry[]>("glossary.json");
}

export function getTaxonomyMap(): Map<string, TaxonomyType> {
  return new Map(getTaxonomy().map((t) => [t.code, t]));
}

/** Deterministic story-of-the-day rotation across the published corpus. */
export function getRotatingStory(date: Date): StoryMeta | undefined {
  const stories = getPublishedStoryMetas();
  if (stories.length === 0) return undefined;
  const dayNumber = Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
  return stories[dayNumber % stories.length];
}

/** Latest additions (by verification date, then id). */
export function getLatestStories(count: number): StoryMeta[] {
  return getPublishedStoryMetas()
    .sort((a, b) => {
      const da = a.editorial.sourceVerifiedDate;
      const db = b.editorial.sourceVerifiedDate;
      if (da !== db) return da < db ? 1 : -1;
      return a.id.localeCompare(b.id);
    })
    .slice(0, count);
}

export interface SearchDoc {
  slug: string;
  title: string;
  person: string;
  period: string;
  synopsis: string;
  aliases: string[];
  themes: string[];
  types: string[];
  practices: string[];
  body?: string;
}

/**
 * Client-side search index for a locale. Built at generation time from
 * published stories only; the locale-matched text prevents mismatch
 * between the indexed language and the page language.
 */
export function buildSearchIndex(locale: SiteLocale): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const m of getPublishedStoryMetas()) {
    const texts = getStoryTexts(m.slug);
    const body =
      locale === "zh"
        ? [texts?.zh ?? "", m.synopsis.zh, m.person.zh, m.title.zh, m.aliases.join(" ")].join("\n")
        : [texts?.en ?? "", m.synopsis.en, m.person.en, m.title.en, m.aliases.join(" ")].join("\n");
    docs.push({
      slug: m.slug,
      title: locale === "zh" ? m.title.zh : m.title.en,
      person: locale === "zh" ? m.person.zh : m.person.en,
      period: locale === "zh" ? m.period.label.zh : m.period.label.en,
      synopsis: locale === "zh" ? m.synopsis.zh : m.synopsis.en,
      aliases: m.aliases,
      themes: m.themes,
      types: m.secondaryTypes,
      practices: m.practices,
      body,
    });
  }
  return docs;
}

/** Number of distinct primary witnesses across published stories. */
export function countWitnesses(): number {
  return getPublishedStoryMetas().reduce((n, m) => n + m.witnesses.length, 0);
}

/** Distinct period labels across published stories (rough dynastic spread). */
export function countPeriods(): number {
  return new Set(getPublishedStoryMetas().map((m) => m.period.label.zh)).size;
}
