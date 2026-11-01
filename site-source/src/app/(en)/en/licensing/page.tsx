import type { Metadata } from "next";

import { UI } from "@/lib/i18n";
import { pageAlternates } from "@/lib/routes";
import { LicensingBody } from "@/components/site/licensing-body";

export const metadata: Metadata = {
  title: UI.en.licensing.title,
  description: UI.en.licensing.lead,
  alternates: pageAlternates("/licensing"),
};

export default function EnLicensingPage() {
  return <LicensingBody locale="en" />;
}
