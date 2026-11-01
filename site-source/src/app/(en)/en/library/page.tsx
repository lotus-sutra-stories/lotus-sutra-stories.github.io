import type { Metadata } from "next";
import Link from "next/link";
import { BookMarked, ExternalLink, ScrollText } from "lucide-react";

import { getPublishedStoryMetas, getWorks } from "@/lib/content";
import { UI, fmt } from "@/lib/i18n";
import { LIBRARY_TABLE_LABELS } from "@/lib/labels";
import { localePath, pageAlternates } from "@/lib/routes";
import { PageHeader, SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: UI.en.library.title,
  description: UI.en.library.lead,
  alternates: pageAlternates("/library", "en"),
};

export default function EnLibraryPage() {
  const t = UI.en.library;
  const works = getWorks();
  const stories = getPublishedStoryMetas();
  const cols = LIBRARY_TABLE_LABELS.en;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={t.title} lead={t.lead} />

      {/* Work records */}
      {works.map((w, i) => {
        const storiesInWork = stories.filter((m) =>
          m.witnesses.some((x) => x.work === w.code),
        );
        return (
          <Reveal key={w.code} delay={i * 0.06}>
            <section
              aria-labelledby={`work-${w.code}`}
              className="rounded-xl border border-border/80 bg-card p-6 shadow-xs sm:p-8"
            >
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id={`work-${w.code}`} className="font-serif text-xl font-semibold leading-snug sm:text-2xl">
                    {w.titleEn}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground" lang="zh-Hant">
                    {w.titleZh}
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
                  {w.cbetaId}
                </Badge>
              </header>

              <p className="mt-4 text-sm text-foreground/85">
                {w.compilerEn}
                <span className="mx-2 text-border" aria-hidden="true">|</span>
                {w.dynastyEn}
                <span className="mx-2 text-border" aria-hidden="true">|</span>
                {t.volLabel} {w.volumes}
              </p>

              <div className="mt-6">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
                  <ScrollText className="size-3.5" aria-hidden="true" />
                  {t.structureTitle}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">
                  {w.structureNote.en}
                </p>
                <div className="lss-scroll mt-4 overflow-x-auto rounded-lg border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-serif">{cols[0]}</TableHead>
                        <TableHead className="font-serif">{cols[1]}</TableHead>
                        <TableHead className="font-serif">{cols[2]}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {w.sections.map((s) => (
                        <TableRow key={s.nameEn}>
                          <TableCell className="font-medium">
                            {s.nameEn}
                            <span className="block text-xs font-normal text-muted-foreground" lang="zh-Hant">
                              {s.nameZh}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground" lang="zh-Hant">
                            {s.count ?? "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {s.juan === "1-2"
                              ? fmt(t.juanLabel, { juan: "1–2" })
                              : fmt(t.juanLabel, { juan: s.juan })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
                  <BookMarked className="size-3.5" aria-hidden="true" />
                  {t.sourceLinks}
                </h3>
                <ul className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2.5">
                  {w.sourceUrls.map((u) => (
                    <li key={u.url}>
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {u.label}
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-lg bg-muted/60 p-4">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground">
                  {t.licenseTitle}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {w.licenseNote.en}
                </p>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">
                {storiesInWork.length} {t.storiesInSection}
                <span aria-hidden="true"> · </span>
                <a href={`#browse-${w.code}`} className="text-primary underline underline-offset-4">
                  {t.browseBySection}
                </a>
              </p>
            </section>
          </Reveal>
        );
      })}

      {/* Browse by original section */}
      <section aria-labelledby="browse-heading">
        <SectionHeading id="browse-heading" title={t.browseBySection} />
        <div className="grid gap-6 md:grid-cols-2">
          {works.map((w) => {
            const storyList = stories.filter((m) =>
              m.witnesses.some((x) => x.work === w.code),
            );
            return (
              <div
                key={w.code}
                id={`browse-${w.code}`}
                className="rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-6"
              >
                <h3 className="font-serif text-lg font-semibold">{w.titleEn}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {storyList.length} {t.storiesInSection}
                </p>
                <ul className="lss-scroll mt-4 max-h-96 space-y-1 overflow-y-auto pr-1">
                  {storyList.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={localePath("en", `/stories/${m.slug}`)}
                        className="flex min-h-11 items-baseline justify-between gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <span className="min-w-0">{m.title.en}</span>
                        <span className="shrink-0 text-xs font-normal text-muted-foreground">
                          {m.period.label.en}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
