import type { Metadata } from "next";

import { buildSearchIndex, getPublishedStoryMetas, getTaxonomy } from "@/lib/content";
import { toCardData } from "@/lib/cards";
import { UI } from "@/lib/i18n";
import { pageAlternates } from "@/lib/routes";
import { PageHeader } from "@/components/site/section-heading";
import { StoryExplorer } from "@/components/site/story-explorer";
import practices from "@/content/practices.json";

export const metadata: Metadata = {
  title: UI.en.stories.title,
  description: UI.en.stories.lead,
  alternates: pageAlternates("/stories"),
};

export default function EnStoriesPage() {
  const metas = getPublishedStoryMetas().map(toCardData);
  const docs = buildSearchIndex("en");
  const types = getTaxonomy();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={UI.en.stories.title} lead={UI.en.stories.lead} />
      <StoryExplorer locale="en" metas={metas} docs={docs} types={types} practices={practices} />
    </div>
  );
}
