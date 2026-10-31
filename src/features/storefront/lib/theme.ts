import type { CSSProperties } from "react";
import type { ThemeColors } from "../types";

export function generateThemeCssVariables(theme?: Partial<ThemeColors>): CSSProperties {
  if (!theme) return {};

  const vars: Record<string, string> = {};

  if (theme.gold) {
    vars["--gold"] = theme.gold;
    vars["--accent"] = theme.gold;
  }
  if (theme.goldHover) vars["--gold-hover"] = theme.goldHover;
  if (theme.goldLight) vars["--gold-light"] = theme.goldLight;
  if (theme.goldPale) vars["--gold-pale"] = theme.goldPale;
  if (theme.goldDark) vars["--gold-dark"] = theme.goldDark;
  if (theme.obsidian) vars["--obsidian"] = theme.obsidian;
  if (theme.obsidianSurface) vars["--obsidian-surface"] = theme.obsidianSurface;
  if (theme.background) vars["--background"] = theme.background;
  if (theme.foreground) vars["--foreground"] = theme.foreground;

  return vars as CSSProperties;
}
