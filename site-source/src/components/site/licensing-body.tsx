import Link from "next/link";

import type { SiteLocale } from "@/config/site";
import { LICENSING } from "@/lib/licensing-content";
import { localePath } from "@/lib/routes";
import { PageHeader } from "@/components/site/section-heading";

/**
 * Shared body for the bilingual Sources & Licensing pages
 * (/licensing/ and /en/licensing/). Content is defined in
 * `src/lib/licensing-content.ts`; the CBETA declaration is a verbatim
 * quotation and must not be reworded here.
 */

const LINK_CLASS =
  "text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring break-words";

interface DeclarationData {
  intro: string;
  baseTextsLead: string;
  baseTexts: { label: string; children?: string[] }[];
  acknowledgments: string;
  provisionsTitle: string;
  provisions: string[];
  closing: string[];
}

function DeclarationBlock({ data, lang, variant }: { data: DeclarationData; lang: string; variant: "zh" | "en" }) {
  return (
    <div
      lang={lang}
      data-cbeta-declaration={variant}
      className="space-y-5 border-l-2 border-primary/40 pl-4 sm:pl-5"
    >
      <p>{data.intro}</p>
      <p>{data.baseTextsLead}</p>
      <ul className="list-disc space-y-2 pl-5">
        {data.baseTexts.map((entry) => (
          <li key={entry.label}>
            {entry.label}
            {entry.children && (
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {entry.children.map((child) => (
                  <li key={child}>{child}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <p>{data.acknowledgments}</p>
      <h3 className="font-serif text-base font-semibold">{data.provisionsTitle}</h3>
      <ol className="list-decimal space-y-4 pl-6" data-cbeta-provisions={variant}>
        {data.provisions.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
      <div className="rounded-lg border border-border/70 bg-secondary/40 p-4">
        {data.closing.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export function LicensingBody({ locale }: { locale: SiteLocale }) {
  const c = LICENSING[locale];
  const tocItems = [
    { id: "status", label: c.sections.status },
    { id: "sources", label: c.sections.sources },
    { id: "official-zh", label: c.sections.officialZh },
    { id: "translation-en", label: c.sections.translationEn },
    { id: "rights", label: c.sections.rights },
    { id: "editorial", label: c.sections.editorial },
    { id: "corrections", label: c.sections.corrections },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={c.title} lead={c.lead} />

      <nav aria-label={c.tocLabel} className="mb-8 rounded-xl border border-border/70 bg-secondary/40 p-5">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {tocItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-8">
        <section aria-labelledby="status" className="scroll-mt-24 min-w-0 rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-7">
          <h2 id="status" className="scroll-mt-24 font-serif text-xl font-semibold">
            {c.sections.status}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/85">
            <p>{c.statusParagraph}</p>
          </div>
        </section>

        <section aria-labelledby="sources" className="scroll-mt-24 min-w-0 rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-7">
          <h2 id="sources" className="scroll-mt-24 font-serif text-xl font-semibold">
            {c.sections.sources}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/85">
            {c.works.map((w) => (
              <article key={w.code} className="min-w-0 rounded-lg border border-border/70 p-4">
                <h3 className="font-serif text-base font-semibold">{w.title}</h3>
                <p>
                  {w.compiler} · {w.code} · {w.cbetaId}
                </p>
                <p>{w.collectionLine}</p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {w.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} className={LINK_CLASS}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            {c.editionNotes.map((note) => (
              <p key={note.slice(0, 24)}>{note}</p>
            ))}
            <Link href={localePath(locale, "/library")} className={LINK_CLASS}>
              {c.libraryLinkLabel}
            </Link>
          </div>
        </section>

        <section aria-labelledby="official-zh" className="scroll-mt-24 min-w-0 rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-7">
          <h2 id="official-zh" className="scroll-mt-24 font-serif text-xl font-semibold">
            {c.sections.officialZh}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/85">
            <p>{c.declarationIntro}</p>
            <p>
              <a href={c.declarationPageLink.url} className={LINK_CLASS}>
                {c.declarationPageLink.label}
              </a>
            </p>
            <DeclarationBlock data={c.declaration} lang="zh-Hant" variant="zh" />
          </div>
        </section>

        <section aria-labelledby="translation-en" className="scroll-mt-24 min-w-0 rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-7">
          <h2 id="translation-en" className="scroll-mt-24 font-serif text-xl font-semibold">
            {c.sections.translationEn}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/85">
            <p lang="en" className="rounded-lg border border-primary/30 bg-primary/5 p-4 font-medium">
              {c.translationNoteBox}
            </p>
            <p>{c.translationIntro}</p>
            <DeclarationBlock data={c.translation} lang="en" variant="en" />
          </div>
        </section>

        <section aria-labelledby="rights" className="scroll-mt-24 min-w-0 rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-7">
          <h2 id="rights" className="scroll-mt-24 font-serif text-xl font-semibold">
            {c.sections.rights}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/85">
            {c.rightsParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <a href={c.ccLicenceUrl} className={LINK_CLASS}>
                {c.ccLicenceLabel}
              </a>
            </p>
            <p>{c.rightsNote}</p>
            <div className="space-y-4">
              {c.rightsLayers.map((layer) => (
                <div key={layer.title} className="rounded-lg border border-border/70 p-4">
                  <h3 className="font-semibold">{layer.title}</h3>
                  <p className="mt-2">{layer.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="editorial" className="scroll-mt-24 min-w-0 rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-7">
          <h2 id="editorial" className="scroll-mt-24 font-serif text-xl font-semibold">
            {c.sections.editorial}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/85">
            <ul className="list-disc space-y-3 pl-5">
              {c.editorialPrinciples.map((item) => (
                <li key={item.slice(0, 24)}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="corrections" className="scroll-mt-24 min-w-0 rounded-xl border border-border/80 bg-card p-5 shadow-xs sm:p-7">
          <h2 id="corrections" className="scroll-mt-24 font-serif text-xl font-semibold">
            {c.sections.corrections}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/85">
            <p>{c.correctionsParagraph}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
