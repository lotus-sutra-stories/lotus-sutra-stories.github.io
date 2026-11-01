"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown, Languages, Menu } from "lucide-react";

import { SITE, type SiteLocale } from "@/config/site";
import { UI } from "@/lib/i18n";
import { localePath, otherLocalePath } from "@/lib/routes";
import { LotusMark } from "@/components/site/lotus-mark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  match: (p: string) => boolean;
}

export function SiteHeader({ locale }: { locale: SiteLocale }) {
  const t = UI[locale];
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  const items: NavItem[] = [
    {
      href: localePath(locale, "/"),
      label: t.nav.home,
      match: (p) => p === localePath(locale, "/"),
    },
    {
      href: localePath(locale, "/theme/peaceful-life"),
      label: t.nav.peacefulLife,
      match: (p) => p === localePath(locale, "/theme/peaceful-life"),
    },
    {
      href: localePath(locale, "/theme/pure-land"),
      label: t.nav.pureLand,
      match: (p) => p === localePath(locale, "/theme/pure-land"),
    },
    {
      href: localePath(locale, "/stories"),
      label: t.nav.stories,
      match: (p) => p.startsWith(localePath(locale, "/stories")),
    },
    {
      href: localePath(locale, "/library"),
      label: t.nav.library,
      match: (p) => p.startsWith(localePath(locale, "/library")),
    },
    {
      href: localePath(locale, "/methodology"),
      label: t.nav.methodology,
      match: (p) => p.startsWith(localePath(locale, "/methodology")),
    },
    {
      href: localePath(locale, "/about"),
      label: t.nav.about,
      match: (p) => p.startsWith(localePath(locale, "/about")),
    },
  ];

  const switchTarget = otherLocalePath(pathname, locale);
  const brand = locale === "zh" ? SITE.brandZh : SITE.brandEn;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t.nav.skip}
      </a>

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand */}
        <Link
          href={localePath(locale, "/")}
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label={brand}
        >
          <LotusMark className="h-8 w-8 shrink-0 text-primary" />
          <span className="whitespace-nowrap font-serif text-base font-semibold tracking-normal xl:text-lg">
            {brand}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t.nav.menu} className="hidden min-w-0 items-center gap-0 xl:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.match(pathname) ? "page" : undefined}
              className={cn(
                "rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                item.match(pathname)
                  ? "text-primary"
                  : "text-foreground/80",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Language switch */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 gap-1.5 px-3" aria-label={t.nav.language}>
                <Languages className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t.nav.switchTo}</span>
                <span className="sm:hidden" aria-hidden="true">
                  {t.nav.switchToCode.toUpperCase()}
                </span>
                <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{t.nav.language}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                aria-current={locale === "zh" ? "true" : undefined}
              >
                <Link href={otherLocalePath(pathname, "en")} className="flex w-full items-center justify-between">
                  <span>繁體中文</span>
                  {locale === "zh" && <Check className="size-4 text-primary" aria-hidden="true" />}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                aria-current={locale === "en" ? "true" : undefined}
              >
                <Link href={otherLocalePath(pathname, "zh")} className="flex w-full items-center justify-between">
                  <span>English</span>
                  {locale === "en" && <Check className="size-4 text-primary" aria-hidden="true" />}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 xl:hidden"
                aria-label={t.nav.menu}
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-serif">
                  <LotusMark className="h-6 w-6 text-primary" />
                  {brand}
                </SheetTitle>
                <SheetDescription>
                  {locale === "zh" ? SITE.taglineZh : SITE.taglineEn}
                </SheetDescription>
              </SheetHeader>
              <nav aria-label={t.nav.menu} className="flex flex-col gap-1 px-4">
                {items.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      aria-current={item.match(pathname) ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        item.match(pathname) ? "bg-accent/60 text-primary" : "text-foreground/85",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-3 h-px bg-border" aria-hidden="true" />
                <SheetClose asChild>
                  <Link
                    href={switchTarget}
                    className="flex min-h-11 items-center gap-2 rounded-md px-3 text-base font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Languages className="size-4" aria-hidden="true" />
                    {t.nav.switchTo}
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
