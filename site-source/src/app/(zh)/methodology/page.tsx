import type { Metadata } from "next";
import Link from "next/link";
import { BookCheck, History, Languages, Layers, Link2, ScrollText } from "lucide-react";

import { getGlossary } from "@/lib/content";
import { UI } from "@/lib/i18n";
import { CLASSIFICATION_FIELDS, METHODOLOGY_SECTIONS } from "@/lib/methodology-content";
import { GLOSSARY_TITLE, METHODOLOGY_FOOTER } from "@/lib/labels";
import { localePath, pageAlternates } from "@/lib/routes";
import { PageHeader } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: UI.zh.methodology.title,
  description: UI.zh.methodology.lead,
  alternates: pageAlternates("/methodology"),
};

const SECTION_ICONS = [BookCheck, ScrollText, Languages, Layers, History, Link2];

export default function ZhMethodologyPage() {
  const t = UI.zh;
  const glossary = getGlossary();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={t.methodology.title} lead={t.methodology.lead} />

      <div className="space-y-10">
        {METHODOLOGY_SECTIONS.map((section, i) => {
          const Icon = SECTION_ICONS[i] ?? ScrollText;
          const isClassification = section.id === "classification";
          return (
            <Reveal key={section.id} delay={Math.min(i * 0.04, 0.16)}>
              <section
                aria-labelledby={`method-${section.id}`}
                className="rounded-xl border border-border/80 bg-card p-6 shadow-xs sm:p-8"
              >
                <h2
                  id={`method-${section.id}`}
                  className="flex items-center gap-2.5 font-serif text-xl font-semibold sm:text-2xl"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  {section.title.zh}
                </h2>
                <div className="mt-5 space-y-4" lang="zh-Hant">
                  {section.paragraphs.zh.map((p, j) => (
                    <p key={j} className="text-sm leading-loose text-foreground/85">
                      {p}
                    </p>
                  ))}
                </div>

                {isClassification && (
                  <div className="lss-scroll mt-6 space-y-5 overflow-x-auto">
                    {CLASSIFICATION_FIELDS.map((field) => (
                      <div key={field.field.zh} className="min-w-full sm:min-w-96">
                        <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground" lang="zh-Hant">
                          {field.field.zh}
                        </h3>
                        <div className="rounded-lg border border-border/70">
                          <Table>
                            <TableBody>
                              {field.values.map((v) => (
                                <TableRow key={v.value}>
                                  <TableCell className="w-24 font-mono text-[11px] text-muted-foreground">
                                    {v.value}
                                  </TableCell>
                                  <TableCell className="text-sm" lang="zh-Hant">
                                    {v.zh}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </Reveal>
          );
        })}

        {/* Glossary */}
        <Reveal>
          <section
            aria-labelledby="method-glossary"
            className="rounded-xl border border-border/80 bg-card p-6 shadow-xs sm:p-8"
          >
            <h2 id="method-glossary" className="font-serif text-xl font-semibold sm:text-2xl">
              {GLOSSARY_TITLE.zh}
            </h2>
            <Accordion type="multiple" className="mt-5">
              {glossary.map((entry, i) => (
                <AccordionItem key={`${entry.zh}-${i}`} value={`g-${i}`}>
                  <AccordionTrigger className="py-3 text-left font-serif text-base font-semibold hover:no-underline">
                    <span lang="zh-Hant">{entry.zh}</span>
                    <span className="ml-2.5 text-xs font-normal text-muted-foreground">
                      {entry.en}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {entry.note ? (
                      <p className="text-sm leading-relaxed text-muted-foreground" lang="zh-Hant">
                        {entry.note.zh}
                      </p>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </Reveal>

        <Reveal>
          <p className="rounded-xl border border-dashed border-border bg-card/60 p-5 text-center text-sm text-muted-foreground" lang="zh-Hant">
            {METHODOLOGY_FOOTER.zh}{" "}
            <Link
              href={localePath("zh", "/library")}
              className="text-primary underline underline-offset-4"
            >
              {t.library.title}
            </Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
