import { useEffect, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { fmtElapsed, hasNoChildren, isNearBottom, isSendKey } from "../chat";
import { useNow } from "../hooks/useNow";
import { Button } from "./Button";

/** Small spinning ring. Announces itself as a status region when labelled. */
export function Spinner({ size = "sm", label }: { size?: "sm" | "md"; label?: string }) {
  return (
    <span
      className={`spinner spinner--${size}`}
      {...(label ? { role: "status", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}

export interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  children: ReactNode;
  time?: ReactNode;
  /** Rendered beside assistant bubbles; revealed on hover or focus-within. */
  actions?: ReactNode;
}

export function ChatMessage({ role, children, time, actions }: ChatMessageProps) {
  return (
    <div className={`msg msg--${role}`}>
      <div className="msg__col">
        <div className="msg__bubble">{children}</div>
        {time != null && <div className="msg__time">{time}</div>}
      </div>
      {role === "assistant" && actions != null && <div className="msg__actions">{actions}</div>}
    </div>
  );
}

export interface MessageListProps {
  children: ReactNode;
  /** Changes whenever content grows; scrolls to bottom only if the reader was already near it. */
  stickKey: unknown;
  /** Changes when the reader's own action should always jump to the bottom. */
  forceKey?: unknown;
  empty?: ReactNode;
  className?: string;
}

export function MessageList({ children, stickKey, forceKey, empty, className = "" }: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Updated on every scroll, so it reflects the position *before* the next content change.
  const wasNear = useRef(true);
  const mounted = useRef(false);

  const toBottom = () => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const onScroll = () => {
    const el = ref.current;
    if (el) wasNear.current = isNearBottom(el);
  };

  useLayoutEffect(() => {
    if (!mounted.current || wasNear.current) toBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickKey]);

  useLayoutEffect(() => {
    if (mounted.current) {
      wasNear.current = true;
      toBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceKey]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  return (
    <div ref={ref} className={`msglist ${className}`.trim()} onScroll={onScroll}>
      {empty != null && hasNoChildren(children) ? empty : children}
    </div>
  );
}

export function ToolActivity({ label }: { label: string }) {
  return (
    <span className="tool-activity">
      <Spinner />
      {label}
    </span>
  );
}

export function WorkingIndicator({ label, startedMs }: { label: string; startedMs: number }) {
  const now = useNow();
  return (
    <span className="working" role="status">
      <Spinner />
      {label}
      <small className="working__time" aria-hidden="true">{fmtElapsed(startedMs, now)}</small>
    </span>
  );
}

export interface ComposerProps {
  value: string;
  onChange(v: string): void;
  onSend(): void;
  placeholder?: string;
  disabled?: boolean;
  sendLabel?: string;
  extra?: ReactNode;
}

export function Composer({ value, onChange, onSend, placeholder, disabled, sendLabel = "Send", extra }: ComposerProps) {
  const cannotSend = !!disabled || value.trim() === "";
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isSendKey({ key: e.key, shiftKey: e.shiftKey, isComposing: e.nativeEvent.isComposing })) {
      e.preventDefault();
      if (!cannotSend) onSend();
    }
  };
  return (
    <div className="composer control">
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {extra}
      <Button variant="primary" disabled={cannotSend} onClick={onSend}>
        {sendLabel}
      </Button>
    </div>
  );
}
