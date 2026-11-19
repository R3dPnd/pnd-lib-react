import { describe, expect, it } from "vitest";
import { clampScale, profileOf, resolve, sanitizePrefs, DEFAULT_PREFS, type DisplayInfo } from "../src/display";
import { meterTone, relTime } from "../src/format";
import { fmtElapsed, hasNoChildren, isNearBottom, isSendKey } from "../src/chat";
import { readHashRoute } from "../src/hooks/useHashRoute";
import { resolveTheme } from "../src/theme";

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

describe("resolveTheme", () => {
  it("accepts known themes", () => {
    expect(resolveTheme("glass")).toBe("glass");
    expect(resolveTheme("arcade", "glass")).toBe("arcade");
  });
  it("falls back for empty, unknown and legacy names", () => {
    expect(resolveTheme(undefined)).toBe("arcade");
    expect(resolveTheme("", "glass")).toBe("glass");
    expect(resolveTheme("rose", "glass")).toBe("glass");
    expect(resolveTheme(" Glass ")).toBe("glass"); // trimmed, case-insensitive
  });
});

describe("chat helpers", () => {
  it("formats elapsed time", () => {
    expect(fmtElapsed(0, 0)).toBe("0s");
    expect(fmtElapsed(0, 59_900)).toBe("59s");
    expect(fmtElapsed(0, 72_000)).toBe("1m 12s");
    expect(fmtElapsed(0, 65_000)).toBe("1m 05s");
    expect(fmtElapsed(10_000, 5_000)).toBe("0s"); // started "in the future"
  });
  it("knows when the list is at the bottom", () => {
    expect(isNearBottom({ scrollTop: 552, scrollHeight: 1000, clientHeight: 400 })).toBe(true);
    expect(isNearBottom({ scrollTop: 300, scrollHeight: 1000, clientHeight: 400 })).toBe(false);
    expect(isNearBottom({ scrollTop: 0, scrollHeight: 300, clientHeight: 400 })).toBe(true);
  });
  it("sends on Enter only", () => {
    expect(isSendKey({ key: "Enter", shiftKey: false })).toBe(true);
    expect(isSendKey({ key: "Enter", shiftKey: true })).toBe(false);
    expect(isSendKey({ key: "Enter", shiftKey: false, isComposing: true })).toBe(false);
    expect(isSendKey({ key: "a", shiftKey: false })).toBe(false);
  });
});

describe("hasNoChildren", () => {
  it("treats empty renderables as empty", () => {
    expect(hasNoChildren([])).toBe(true);
    expect(hasNoChildren([null, false])).toBe(true);
    expect(hasNoChildren(null)).toBe(true);
    expect(hasNoChildren(["a"])).toBe(false);
    expect(hasNoChildren([null, "a"])).toBe(false);
  });
});

describe("meterTone", () => {
  it("is green below 70, orange below 90, red from 90", () => {
    expect(meterTone(0)).toBe("green");
    expect(meterTone(69.9)).toBe("green");
    expect(meterTone(70)).toBe("orange");
    expect(meterTone(89.9)).toBe("orange");
    expect(meterTone(90)).toBe("red");
    expect(meterTone(100)).toBe("red");
  });
});
