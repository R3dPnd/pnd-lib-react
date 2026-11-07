/** Local time of day, e.g. "4:12:07 PM". */
export function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString();
}

/** "12s ago", "5m ago", "3h ago"; older than a day falls back to the date. */
export function relTime(ts: number | string, now = Date.now()): string {
  const ms = typeof ts === "string" ? Date.parse(ts) : ts;
  const diff = Math.max(0, (now - ms) / 1000);
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ms).toLocaleDateString();
}
