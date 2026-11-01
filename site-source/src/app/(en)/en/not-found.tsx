import Link from "next/link";

import { UI } from "@/lib/i18n";
import { localePath } from "@/lib/routes";
import { LotusMark } from "@/components/site/lotus-mark";
import { Button } from "@/components/ui/button";

export default function EnNotFound() {
  const t = UI.en;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <LotusMark className="h-16 w-16 text-primary/70" />
      <h1 className="mt-6 font-serif text-2xl font-semibold sm:text-3xl">
        {t.common.notFoundTitle}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {t.common.notFoundDesc}
      </p>
      <Button asChild className="mt-8">
        <Link href={localePath("en", "/")}>{t.common.backHome}</Link>
      </Button>
    </div>
  );
}
