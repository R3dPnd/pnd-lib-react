import { describe, expect, it } from "vitest";
import { clampScale, profileOf, resolve, sanitizePrefs, DEFAULT_PREFS, type DisplayInfo } from "../src/display";
import { relTime } from "../src/format";
import { readHashRoute } from "../src/hooks/useHashRoute";

const display = (width: number, height: number, touch = false): DisplayInfo => ({
  scaleFactor: 1,
  size: { width, height },
  workArea: { width, height: height - 40 },
  physical: { width, height },
  touch,
});

describe("display", () => {
  it("classifies displays", () => {
    expect(profileOf(display(1280, 800, true))).toBe("handheld");
    expect(profileOf(display(1280, 800))).toBe("compact");
    expect(profileOf(display(1920, 1080))).toBe("desktop");
    expect(profileOf(display(3840, 2160))).toBe("large");
  });

  it("resolves auto prefs per profile", () => {
    const large = resolve(DEFAULT_PREFS, display(3840, 2160));
    expect(large).toMatchObject({ scale: 1.5, density: "spacious", effects: "full" });
    const handheld = resolve(DEFAULT_PREFS, display(1280, 800, true));
    expect(handheld).toMatchObject({ scale: 1, density: "compact", effects: "reduced", touch: true });
  });

  it("keeps explicit prefs and clamps scale", () => {
    const r = resolve({ ...DEFAULT_PREFS, scale: 9, density: "comfortable", touch: "off" }, display(1280, 800, true));
    expect(r).toMatchObject({ scale: 2, density: "comfortable", touch: false });
    expect(clampScale(0.1)).toBe(0.6);
  });

  it("sanitizes stored prefs", () => {
    expect(sanitizePrefs(null)).toEqual(DEFAULT_PREFS);
    expect(sanitizePrefs({ scale: "big", density: "huge", effects: "off", font: "readable" })).toEqual({
      ...DEFAULT_PREFS,
      effects: "off",
      font: "readable",
    });
  });
});

describe("readHashRoute", () => {
  const routes = ["console", "bounties"] as const;
  it("reads #/route and #route", () => {
    expect(readHashRoute("#/bounties", routes, "console")).toBe("bounties");
    expect(readHashRoute("#bounties", routes, "console")).toBe("bounties");
  });
  it("falls back for unknown or empty hashes", () => {
    expect(readHashRoute("", routes, "console")).toBe("console");
    expect(readHashRoute("#/nope", routes, "console")).toBe("console");
  });
});

describe("relTime", () => {
  const now = Date.parse("2026-11-06T12:00:00Z");
  it("formats seconds, minutes and hours", () => {
    expect(relTime(now - 5_000, now)).toBe("5s ago");
    expect(relTime(now - 5 * 60_000, now)).toBe("5m ago");
    expect(relTime("2026-11-06T09:00:00Z", now)).toBe("3h ago");
  });
  it("never goes negative for clock skew", () => {
    expect(relTime(now + 10_000, now)).toBe("0s ago");
  });
});
