import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, Landmark, ScrollText, ShieldCheck, Sparkles } from "lucide-react";

import { UI } from "@/lib/i18n";
import { ABOUT_BLOCKS } from "@/lib/about-content";
import { localePath, pageAlternates } from "@/lib/routes";
import { LotusMark } from "@/components/site/lotus-mark";
import { PageHeader } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: UI.zh.about.title,
  description: UI.zh.about.lead,
  alternates: pageAlternates("/about"),
};

const BLOCK_ICONS = [Sparkles, ScrollText, Landmark, HeartHandshake, ShieldCheck, ScrollText];

export default function ZhAboutPage() {
  const t = UI.zh;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={t.about.title} lead={t.about.lead} />

      <div className="space-y-8">
        {ABOUT_BLOCKS.map((block, i) => {
          const Icon = BLOCK_ICONS[i] ?? ScrollText;
          return (
            <Reveal key={block.title.zh} delay={Math.min(i * 0.04, 0.16)}>
              <section
                aria-labelledby={`about-${i}`}
                className="rounded-xl border border-border/80 bg-card p-6 shadow-xs sm:p-7"
              >
                <h2 id={`about-${i}`} className="flex items-center gap-2.5 font-serif text-lg font-semibold">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {block.title.zh}
                </h2>
                <div className="mt-4 space-y-3" lang="zh-Hant">
                  {block.paragraphs.zh.map((p, j) => (
                    <p key={j} className="text-sm leading-loose text-foreground/85">
                      {p}
                    </p>
                  ))}
                </div>
                {block.title.en === "Sources" && (
                  <p className="mt-4">
                    <Link
                      href={localePath("zh", "/library")}
                      className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      {t.library.title} →
                    </Link>
                  </p>
                )}
              </section>
            </Reveal>
          );
        })}

        <Reveal>
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
            <LotusMark className="h-12 w-12 text-primary" />
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground" lang="zh-Hant">
              {t.footer.disclaimer}
            </p>
            <Separator className="w-24" />
            <p className="text-xs text-muted-foreground">{t.footer.notDeployedNote}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
