import type { KeyboardEvent, ReactNode } from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}

export function Checkbox({ checked, onChange, disabled, children }: CheckboxProps) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      {children}
    </label>
  );
}

export interface SelectProps {
  /** Small caps label above the control; omit for an unlabelled select. */
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className="control">
      {label !== undefined && <span className="control__label">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export interface TextInputProps {
  /** Small caps label above the input; omit for a bare input (placeholder becomes its aria-label). */
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "search" | "url";
  disabled?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/** Single-line input with a small caps label above it. */
export function TextInput({ label, value, onChange, placeholder, type = "text", disabled, onKeyDown }: TextInputProps) {
  return (
    <label className="control">
      {label !== undefined && <span className="control__label">{label}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        aria-label={label === undefined ? placeholder : undefined}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export interface TextFieldProps {
  /** Accent label above the textarea; omit for a bare textarea (placeholder becomes its aria-label). */
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

/** Multi-line textarea with an accent-colored label. */
export function TextField({ label, value, onChange, placeholder, rows = 2, required }: TextFieldProps) {
  return (
    <label className="field">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label === undefined ? placeholder : undefined}
        rows={rows}
        required={required}
      />
    </label>
  );
}
