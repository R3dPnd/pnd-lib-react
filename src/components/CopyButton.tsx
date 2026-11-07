import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

/** Copies `text` to the clipboard and shows "Copied" for 1.5 s. */
export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (permissions / insecure context); ignore.
    }
  }

  return (
    <Button variant="ghost" className={className} onClick={copy}>
      {copied ? "Copied" : label}
    </Button>
  );
}
