import { site } from "@/content/site";
import type { ThemeConfig } from "@/content/types";

/**
 * Turns the theme block in `content/site.ts` into CSS custom properties.
 *
 * These are emitted once in the root layout, which means re-branding the entire
 * site is a matter of editing hex values in one config object — no component
 * touches a raw color.
 */
const cssVarNames: Record<keyof ThemeConfig, string> = {
  primary: "--brand-primary",
  primaryHover: "--brand-primary-hover",
  primaryForeground: "--brand-primary-foreground",
  secondary: "--brand-secondary",
  accent: "--brand-accent",
  accentHover: "--brand-accent-hover",
  accentForeground: "--brand-accent-foreground",
  background: "--brand-background",
  surface: "--brand-surface",
  muted: "--brand-muted",
  text: "--brand-text",
  textMuted: "--brand-text-muted",
  border: "--brand-border",
  highlight: "--brand-highlight",
  radius: "--brand-radius",
};

/**
 * Only values that look like CSS colors or lengths are emitted, so a typo in
 * the config can't inject arbitrary declarations into the stylesheet.
 */
const SAFE_VALUE = /^(#[0-9a-fA-F]{3,8}|rgba?\([\d\s.,%/]+\)|hsla?\([\d\s.,%/deg]+\)|oklch\([\d\s.,%/]+\)|[\d.]+(rem|px|em)|[a-zA-Z]+)$/;

export function themeCss(theme: ThemeConfig = site.theme) {
  const declarations = (Object.keys(cssVarNames) as (keyof ThemeConfig)[])
    .map((key) => {
      const value = String(theme[key]).trim();
      if (!SAFE_VALUE.test(value)) return null;
      return `${cssVarNames[key]}: ${value};`;
    })
    .filter(Boolean)
    .join("");

  return `:root{${declarations}}`;
}
