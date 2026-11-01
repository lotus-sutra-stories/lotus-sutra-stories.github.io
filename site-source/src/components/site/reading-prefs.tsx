"use client";

import { Moon, Settings2, Sun } from "lucide-react";

import type { SiteLocale } from "@/config/site";
import { UI } from "@/lib/i18n";
import { LINE_HEIGHT_OPTIONS } from "@/lib/labels";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface ReaderPrefs {
  fontSize: "s" | "m" | "l";
  lineHeight: 0 | 1 | 2; // compact / normal / loose
  pane: "paper" | "night";
  showAnchors: boolean;
}

export const DEFAULT_PREFS: ReaderPrefs = {
  fontSize: "m",
  lineHeight: 1,
  pane: "paper",
  showAnchors: false,
};

/** localStorage key for the reader preferences blob. */
export const PREFS_KEY = "lss-reader-prefs";

export function parsePrefs(raw: string | null): ReaderPrefs {
  if (!raw) return DEFAULT_PREFS;
  try {
    const parsed = JSON.parse(raw) as Partial<ReaderPrefs>;
    return {
      fontSize:
        parsed.fontSize === "s" || parsed.fontSize === "l" ? parsed.fontSize : "m",
      lineHeight:
        parsed.lineHeight === 0 || parsed.lineHeight === 2 ? parsed.lineHeight : 1,
      pane: parsed.pane === "night" ? "night" : "paper",
      showAnchors: typeof parsed.showAnchors === "boolean" ? parsed.showAnchors : false,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

/**
 * Reading preferences panel: font size, line height, paper/night pane
 * tone, and per-paragraph line-anchor visibility.
 */
export function ReadingPrefs({
  locale,
  prefs,
  onChange,
  idPrefix = "prefs",
}: {
  locale: SiteLocale;
  prefs: ReaderPrefs;
  onChange: (prefs: ReaderPrefs) => void;
  idPrefix?: string;
}) {
  const t = UI[locale];
  const lineLabels = LINE_HEIGHT_OPTIONS[locale];

  return (
    <div className="space-y-5 rounded-xl border border-border/80 bg-card p-4 sm:p-5">
      <h3 className="flex items-center gap-2 font-serif text-sm font-semibold tracking-wide">
        <Settings2 className="size-4 text-primary" aria-hidden="true" />
        {t.reader.readingPrefs}
      </h3>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-fontsize`} className="text-xs font-medium text-muted-foreground">
          {t.reader.fontSize}
        </Label>
        <ToggleGroup
          id={`${idPrefix}-fontsize`}
          type="single"
          value={prefs.fontSize}
          onValueChange={(v) => {
            if (v === "s" || v === "m" || v === "l") onChange({ ...prefs, fontSize: v });
          }}
          className="grid w-full grid-cols-3"
          variant="outline"
        >
          <ToggleGroupItem value="s" className="h-9 text-xs" aria-label="A-">S</ToggleGroupItem>
          <ToggleGroupItem value="m" className="h-9 text-sm" aria-label="A">M</ToggleGroupItem>
          <ToggleGroupItem value="l" className="h-9 text-base" aria-label="A+">L</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-lineheight`} className="text-xs font-medium text-muted-foreground">
          {t.reader.lineHeight}
        </Label>
        <ToggleGroup
          id={`${idPrefix}-lineheight`}
          type="single"
          value={String(prefs.lineHeight)}
          onValueChange={(v) => {
            const n = Number(v);
            if (n === 0 || n === 1 || n === 2) onChange({ ...prefs, lineHeight: n });
          }}
          className="grid w-full grid-cols-3"
          variant="outline"
        >
          {lineLabels.map((label, i) => (
            <ToggleGroupItem key={label} value={String(i)} className="h-9 text-xs">
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-pane`} className="text-xs font-medium text-muted-foreground">
          {t.reader.theme}
        </Label>
        <ToggleGroup
          id={`${idPrefix}-pane`}
          type="single"
          value={prefs.pane}
          onValueChange={(v) => {
            if (v === "paper" || v === "night") onChange({ ...prefs, pane: v });
          }}
          className="grid w-full grid-cols-2"
          variant="outline"
        >
          <ToggleGroupItem value="paper" className="h-9 gap-1.5 text-xs">
            <Sun className="size-3.5" aria-hidden="true" />
            {t.reader.themeLight}
          </ToggleGroupItem>
          <ToggleGroupItem value="night" className="h-9 gap-1.5 text-xs">
            <Moon className="size-3.5" aria-hidden="true" />
            {t.reader.themeDark}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={`${idPrefix}-anchors`} className="text-xs font-medium text-muted-foreground">
          {t.reader.showAnchors}
        </Label>
        <Switch
          id={`${idPrefix}-anchors`}
          checked={prefs.showAnchors}
          onCheckedChange={(v) => onChange({ ...prefs, showAnchors: v })}
        />
      </div>
    </div>
  );
}
