import { useEffect, useState } from "react";

/** Route named by the URL hash ("#/bounties" → "bounties"), or `fallback` if it isn't one of `routes`. */
export function readHashRoute<T extends string>(hash: string, routes: readonly T[], fallback: T): T {
  const h = hash.replace(/^#\/?/, "");
  return (routes as readonly string[]).includes(h) ? (h as T) : fallback;
}

/** Current top-level tab, kept in the URL hash (#/bounties) so links and reloads work. */
export function useHashRoute<T extends string>(routes: readonly T[], fallback: T = routes[0]): [T, (r: T) => void] {
  const [route, setRoute] = useState<T>(() => readHashRoute(window.location.hash, routes, fallback));
  useEffect(() => {
    const onHash = () => setRoute(readHashRoute(window.location.hash, routes, fallback));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [routes, fallback]);
  return [route, (r) => (window.location.hash = `/${r}`)];
}
