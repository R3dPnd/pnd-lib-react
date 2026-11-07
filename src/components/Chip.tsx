import type { ReactNode } from "react";

/** Neon palette colors, plus `muted` (dim text) and `plain` (ink, neutral frame). */
export type Tone = "cyan" | "teal" | "green" | "orange" | "violet" | "red" | "magenta" | "yellow" | "blue" | "muted" | "plain";

/** Small inline label used in feeds and stats. */
export function Chip({ tone = "plain", title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  return (
    <span className={`chip tone--${tone}`} title={title}>
      {children}
    </span>
  );
}

/** Outlined pill used for classifications on cards. */
export function Tag({ tone = "muted", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`tag tone--${tone}`}>{children}</span>;
}
