export type Theme = "arcade" | "glass";

export const THEMES: readonly Theme[] = ["arcade", "glass"];

/** Map any string (config value, saved pref) to a known theme; unknown or empty names use the fallback. */
export function resolveTheme(value: string | null | undefined, fallback: Theme = "arcade"): Theme {
  const v = (value ?? "").trim().toLowerCase();
  return THEMES.find((t) => t === v) ?? fallback;
}

/** Select a theme by setting data-theme on <html>. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}
