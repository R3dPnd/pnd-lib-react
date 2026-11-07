/**
 * JSON fetch helpers. A non-2xx response throws an Error carrying the server's
 * `error` (or `detail`, FastAPI's field) when the body has one.
 */

async function parse<T>(res: Response, label: string): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: unknown; detail?: unknown }).error ?? (data as { detail?: unknown }).detail;
    throw new Error(typeof msg === "string" ? msg : `${label} failed: ${res.status}`);
  }
  return data as T;
}

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  return parse<T>(await fetch(url, init), `GET ${url}`);
}

export async function postJson<T>(url: string, body: unknown = {}, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    method: "POST",
    headers: { "Content-Type": "application/json", ...init?.headers },
    body: JSON.stringify(body),
  });
  return parse<T>(res, `POST ${url}`);
}
