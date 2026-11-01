import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublishedStoryMetas, getTaxonomy } from "@/lib/content";
import { toCardData } from "@/lib/cards";
import { UI } from "@/lib/i18n";
import { pageAlternates } from "@/lib/routes";
import type { Theme } from "@/lib/types";
import { PageHeader } from "@/components/site/section-heading";
import { ThemeGallery } from "@/components/site/theme-gallery";
import practices from "@/content/practices.json";

const THEMES: Theme[] = ["peaceful-life", "pure-land"];

interface ThemePageProps {
  params: Promise<{ theme: string }>;
}

export function generateStaticParams() {
  return THEMES.map((theme) => ({ theme }));
}

function isTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme);
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { theme } = await params;
  if (!isTheme(theme)) return {};
  const t = UI.en.taxonomy;
  const title = theme === "pure-land" ? t.pureLandTitle : t.peacefulLifeTitle;
  const description = theme === "pure-land" ? t.pureLandDesc : t.peacefulLifeDesc;
  return {
    title,
    description,
    alternates: pageAlternates(`/theme/${theme}`, "en"),
  };
}

export default async function EnThemePage({ params }: ThemePageProps) {
  const { theme } = await params;
  if (!isTheme(theme)) notFound();

  const t = UI.en.taxonomy;
  const title = theme === "pure-land" ? t.pureLandTitle : t.peacefulLifeTitle;
  const description = theme === "pure-land" ? t.pureLandDesc : t.peacefulLifeDesc;

  const metas = getPublishedStoryMetas()
    .filter((m) => m.themes.includes(theme))
    .map(toCardData);
  const types = getTaxonomy().filter((ty) => ty.theme === theme);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={title} lead={description} />
      <ThemeGallery locale="en" theme={theme} metas={metas} types={types} practices={practices} />
    </div>
  );
}
