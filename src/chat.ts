import { Children, type ReactNode } from "react";

/** Elapsed time since `fromMs`: "7s", then "1m 05s". Never negative. */
export function fmtElapsed(fromMs: number, nowMs: number): string {
  const total = Math.max(0, Math.floor((nowMs - fromMs) / 1000));
  if (total < 60) return `${total}s`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

/** True when the scroll position is within `threshold` px of the bottom. */
export function isNearBottom(
  m: { scrollTop: number; scrollHeight: number; clientHeight: number },
  threshold = 48,
): boolean {
  return m.scrollHeight - m.scrollTop - m.clientHeight <= threshold;
}

/** Enter sends; Shift+Enter inserts a newline; Enter confirming an IME composition does not send. */
export function isSendKey(e: { key: string; shiftKey: boolean; isComposing?: boolean }): boolean {
  return e.key === "Enter" && !e.shiftKey && !e.isComposing;
}

/** True when `children` renders nothing: null, false, `[]`, or arrays of only null/false. */
export function hasNoChildren(children: ReactNode): boolean {
  return Children.toArray(children).length === 0;
}
