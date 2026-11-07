import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "danger" | "ghost" | "link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/** Pixel-framed button. `primary` fills with the page accent (`--accent`). */
export function Button({ variant = "ghost", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`btn btn--${variant} ${className}`} {...rest} />;
}
