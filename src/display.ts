// Display detection and the viewer's visual preferences (scale, density,
// effects, touch targets, font).
//
// Display metrics come from the page itself (window.screen is in DIPs and, with
// no browser zoom in a desktop shell, devicePixelRatio is the OS scale). Where
// prefs are stored, and how fullscreen works, is up to the app's DisplayHost:
// localStorageHost() for a plain browser, or one backed by a desktop shell.

export interface DisplayInfo {
  scaleFactor: number;
  size: { width: number; height: number };
  workArea: { width: number; height: number };
  physical: { width: number; height: number };
  touch: boolean;
}

export type Profile = "handheld" | "compact" | "desktop" | "large";
export type Density = "compact" | "comfortable" | "spacious";
export type Effects = "full" | "reduced" | "off";
export type Font = "pixel" | "readable";

export interface Prefs {
  scale: "auto" | number;
  density: "auto" | Density;
  effects: "auto" | Effects;
  touch: "auto" | "on" | "off";
  font: Font;
}

export interface Resolved {
  profile: Profile;
  scale: number;
  density: Density;
  effects: Effects;
  touch: boolean;
  font: Font;
}

/** Where prefs live and who owns fullscreen. */
export interface DisplayHost {
  /** Saved prefs as stored (sanitized on read), or null for defaults. */
  load(): unknown;
  save(prefs: Prefs): void;
  /** Inside a desktop shell: F11 toggles fullscreen through `fullscreen`, and the key hint says so. */
  isDesktop: boolean;
  /** Shell-owned fullscreen. Without it the page uses the browser Fullscreen API. */
  fullscreen?: { toggle(): Promise<boolean>; get(): Promise<boolean> };
}

/** Prefs in localStorage under `key` (in-memory only when storage is unavailable). */
export function localStorageHost(key: string): DisplayHost {
  return {
    isDesktop: false,
    load() {
      try {
        return JSON.parse(localStorage.getItem(key) || "null");
      } catch {
        return null;
      }
    },
    save(prefs) {
      try {
        localStorage.setItem(key, JSON.stringify(prefs));
      } catch {
        /* storage unavailable: prefs last for this session only */
      }
    },
  };
}

export const DEFAULT_PREFS: Prefs = { scale: "auto", density: "auto", effects: "auto", touch: "auto", font: "pixel" };
export const SCALE_MIN = 0.6;
export const SCALE_MAX = 2;
export const SCALE_STEP = 0.05;

export const clampScale = (n: number) => Math.round(Math.min(SCALE_MAX, Math.max(SCALE_MIN, n)) * 100) / 100;

const coarsePointer = () => window.matchMedia?.("(any-pointer: coarse)").matches ?? false;

/** Display metrics as the browser sees them. */
export function browserDisplay(): DisplayInfo {
  const s = window.screen;
  const dpr = window.devicePixelRatio || 1;
  return {
    scaleFactor: dpr,
    size: { width: s.width, height: s.height },
    workArea: { width: s.availWidth, height: s.availHeight },
    physical: { width: Math.round(s.width * dpr), height: Math.round(s.height * dpr) },
    touch: coarsePointer(),
  };
}

/** Classify a display by its logical (DIP) size and input. */
export function profileOf(d: DisplayInfo): Profile {
  const w = Math.max(d.size.width, d.size.height);
  const h = Math.min(d.size.width, d.size.height);
  if (w <= 1366 && h <= 800) return d.touch ? "handheld" : "compact";
  if (w < 1100) return "compact";
  if (w >= 2400) return "large";
  return "desktop";
}

/** Turn "auto" choices into concrete ones for this display. */
export function resolve(prefs: Prefs, d: DisplayInfo): Resolved {
  const profile = profileOf(d);
  const w = d.workArea.width;
  const autoScale = profile === "large" ? (w >= 3200 ? 1.5 : 1.25) : 1;
  const autoDensity: Density =
    profile === "handheld" || profile === "compact" ? "compact" : profile === "large" ? "spacious" : d.workArea.height < 900 ? "compact" : "comfortable";
  // Handhelds run on battery: skip the full-screen scanline layer and heavy glows.
  const autoEffects: Effects = profile === "handheld" ? "reduced" : "full";
  return {
    profile,
    scale: prefs.scale === "auto" ? autoScale : clampScale(prefs.scale),
    density: prefs.density === "auto" ? autoDensity : prefs.density,
    effects: prefs.effects === "auto" ? autoEffects : prefs.effects,
    touch: prefs.touch === "auto" ? d.touch : prefs.touch === "on",
    font: prefs.font,
  };
}

/** Coerce whatever was stored into valid Prefs, defaulting anything unknown. */
export function sanitizePrefs(raw: unknown): Prefs {
  const p = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => (allowed.includes(v as T) ? (v as T) : fallback);
  return {
    scale: typeof p.scale === "number" && Number.isFinite(p.scale) ? clampScale(p.scale) : "auto",
    density: pick(p.density, ["auto", "compact", "comfortable", "spacious"] as const, "auto"),
    effects: pick(p.effects, ["auto", "full", "reduced", "off"] as const, "auto"),
    touch: pick(p.touch, ["auto", "on", "off"] as const, "auto"),
    font: pick(p.font, ["pixel", "readable"] as const, "pixel"),
  };
}

export function loadPrefs(host: DisplayHost): Prefs {
  try {
    return sanitizePrefs(host.load());
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

/** Push the resolved look onto <html>: data-* attributes for CSS, and the scale as CSS zoom. */
export function applyResolved(r: Resolved) {
  const root = document.documentElement;
  root.dataset.profile = r.profile;
  root.dataset.density = r.density;
  root.dataset.effects = r.effects;
  root.dataset.touch = r.touch ? "on" : "off";
  root.dataset.font = r.font;
  root.style.setProperty("--zoom", String(r.scale));
}

/** Apply the saved look before React's first paint (call from main.tsx). */
export function applySavedDisplay(host: DisplayHost) {
  applyResolved(resolve(loadPrefs(host), browserDisplay()));
}

/** Describe a display for the settings panel, e.g. "1280×720 @150% · 1920×1080 px · touch". */
export function describeDisplay(d: DisplayInfo): string {
  const parts = [`${d.size.width}×${d.size.height} @${Math.round(d.scaleFactor * 100)}%`, `${d.physical.width}×${d.physical.height} px`];
  if (d.touch) parts.push("touch");
  return parts.join(" · ");
}
