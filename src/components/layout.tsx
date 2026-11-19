import type { ButtonHTMLAttributes, ReactNode } from "react";
import { meterTone } from "../format";
import type { Tone } from "./Chip";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name; also the tooltip. */
  label: string;
  active?: boolean;
}

/** Square button holding an icon. */
export function IconButton({ label, active, className = "", type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`icon-btn${active ? " is-active" : ""} ${className}`}
      {...rest}
    />
  );
}

/** Unheaded framed surface (a Panel without the title). */
export function Card({
  children,
  className = "",
  tone,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  as?: "div" | "li" | "article";
}) {
  return <Tag className={`card${tone ? ` tone--${tone}` : ""} ${className}`}>{children}</Tag>;
}

/** Labelled usage bar. The percentage is clamped to 0-100. */
export function Meter({ label, percent, sub }: { label: string; percent: number; sub?: ReactNode }) {
  const pct = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
  return (
    <div className="meter">
      <div className="meter__head">
        <span className="meter__label">{label}</span>
        <span className="meter__value">{Math.round(pct)}%</span>
      </div>
      <div
        className="meter__track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div className={`meter__bar meter__bar--${meterTone(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      {sub !== undefined && <div className="meter__sub">{sub}</div>}
    </div>
  );
}

/** Vertical rail of icon items. */
export function NavRail({ children }: { children: ReactNode }) {
  return <nav className="nav-rail">{children}</nav>;
}

export function NavRailItem({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`nav-rail__item${active ? " is-active" : ""}`}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
