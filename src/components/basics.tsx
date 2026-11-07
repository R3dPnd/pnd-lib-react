import type { CSSProperties, ReactNode } from "react";
import { fmtTime } from "../format";

/** Colored initial for a person or agent. */
export function Avatar({ name, color, title }: { name: string; color: string; title?: string }) {
  return (
    <div className="avatar" title={title ?? name} style={{ "--who": color } as CSSProperties}>
      {name.charAt(0)}
    </div>
  );
}

export function Banner({ tone = "error", children }: { tone?: "error" | "warn"; children: ReactNode }) {
  return (
    <div className={`banner banner--${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

/** Placeholder text for an empty list. `center` adds a blinking cursor. */
export function EmptyState({ center = false, children }: { center?: boolean; children: ReactNode }) {
  return <div className={`empty ${center ? "empty--center" : ""}`}>{children}</div>;
}

export interface PanelProps {
  title: string;
  as?: "section" | "aside" | "div";
  className?: string;
  children: ReactNode;
}

/** Framed section with a pixel heading. Color it with `--edge` and `--panel-accent`. */
export function Panel({ title, as: Tag = "section", className = "", children }: PanelProps) {
  return (
    <Tag className={`panel ${className}`}>
      <h2>{title}</h2>
      {children}
    </Tag>
  );
}

/** Run/job status pill: running, done, error, stopped or idle get their own colors. */
export function StatusBadge({ status }: { status: string }) {
  return <span className={`status status--${status}`}>{status}</span>;
}

/** Local time of day for an epoch-ms timestamp. */
export function Timestamp({ ts }: { ts: number }) {
  return <span className="t">{fmtTime(ts)}</span>;
}

/** "<name> is working ●●●" in the speaker's color. */
export function TypingIndicator({ name, color, label = "is working" }: { name: string; color: string; label?: string }) {
  return (
    <div className="typing" style={{ "--who": color } as CSSProperties}>
      <span className="who">{name}</span> {label}
      <span className="typing__dots">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
