import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublishedStoryMetas, getStoryBySlug, getStoryTexts } from "@/lib/content";
import { toCardData } from "@/lib/cards";
import { UI } from "@/lib/i18n";
import { pageAlternates } from "@/lib/routes";
import { StoryReader } from "@/components/site/story-reader";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPublishedStoryMetas().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getStoryBySlug(slug);
  if (!meta) return {};
  return {
    title: meta.title.en,
    description: meta.synopsis.en,
    alternates: pageAlternates(`/stories/${meta.slug}`, "en"),
    openGraph: {
      title: `${meta.title.en} · ${UI.en.home.heroKicker}`,
      description: meta.synopsis.en,
      type: "article",
    },
  };
}

export default async function EnStoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const meta = getStoryBySlug(slug);
  if (!meta) notFound();

  const texts = getStoryTexts(slug);
  if (!texts) notFound();

  const all = getPublishedStoryMetas();
  const idx = all.findIndex((m) => m.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  const related = all
    .filter(
      (m) =>
        m.slug !== slug &&
        m.themes.some((th) => meta.themes.includes(th)) &&
        m.secondaryTypes.some((st) => meta.secondaryTypes.includes(st)),
    )
    .slice(0, 4)
    .map(toCardData);

  return (
    <StoryReader
      locale="en"
      meta={meta}
      texts={texts}
      prev={prev ? { slug: prev.slug, title: prev.title.en } : null}
      next={next ? { slug: next.slug, title: next.title.en } : null}
      related={related}
    />
  );
}
