import type { Metadata } from "next";

import "../../globals.css";

import { HTML_LANG, SITE } from "@/config/site";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Toaster } from "@/components/ui/sonner";

/**
 * ROOT layout for the English tree (route group `(en)` — URLs under the
 * `/en` prefix). One of the site's two root layouts.
 */
export const metadata: Metadata = {
  title: {
    default: SITE.brandEn,
    template: `%s · ${SITE.brandEn}`,
  },
  description: SITE.taglineEn,
  applicationName: SITE.brandEn,
  icons: { icon: "/lotus-favicon.png" },
};

export default function EnRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={HTML_LANG.en} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <SiteHeader locale="en" />
        <main id="main" className="w-full flex-1">
          {children}
        </main>
        <SiteFooter locale="en" />
        <Toaster theme="light" position="bottom-right" />
      </body>
    </html>
  );
}
