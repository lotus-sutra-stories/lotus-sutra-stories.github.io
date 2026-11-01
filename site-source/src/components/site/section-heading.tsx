import { cn } from "@/lib/utils";
import { LotusDivider } from "@/components/site/lotus-mark";

/** Section heading with lotus ornament divider. */
export function SectionHeading({
  title,
  description,
  align = "center",
  id,
  className,
}: {
  title: string;
  description?: string;
  align?: "center" | "left";
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      <h2 id={id} className="font-serif text-2xl font-semibold leading-snug sm:text-3xl">
        {title}
      </h2>
      <LotusDivider className={align === "center" ? "justify-center" : undefined} />
      {description && (
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** Page-level header block (title + lead paragraph). */
export function PageHeader({
  title,
  lead,
  id,
}: {
  title: string;
  lead?: string;
  id?: string;
}) {
  return (
    <header className="space-y-4 pb-8 pt-10 text-center sm:pt-14">
      <h1 id={id} className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h1>
      <LotusDivider className="justify-center" />
      {lead && (
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {lead}
        </p>
      )}
    </header>
  );
}
