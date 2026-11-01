"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const components: Components = {
  table: ({ children }) => (
    <div className="lss-scroll my-4 w-full overflow-x-auto rounded-lg border border-border/70">
      <table>{children}</table>
    </div>
  ),
  a: ({ href, children }) => {
    const external = /^https?:\/\//.test(href ?? "");
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  img: ({ alt, src }) => (
    <img alt={alt ?? ""} src={typeof src === "string" ? src : undefined} className="mx-auto my-4 max-w-full rounded-lg border border-border/70" />
  ),
};

/**
 * Markdown renderer for story bodies and editorial notes, with
 * GitHub-flavoured tables. Optionally strips a redundant leading H1
 * (the page already displays the story title prominently).
 */
export function MarkdownBody({
  children,
  className,
  lang,
  stripTitle = true,
}: {
  children: string;
  className?: string;
  lang?: string;
  stripTitle?: boolean;
}) {
  const source = stripTitle
    ? children.replace(/^#\s+[^\n]+\n+/, "")
    : children;
  return (
    <div className={cn("md-body", className)} lang={lang}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
