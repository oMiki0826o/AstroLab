/*
 * File: storage.ts
 * Modification: 2026-10-11 - Safe and validated browser-only preference storage.
 */
export function loadIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(raw) ? [...new Set(raw.filter((x): x is string => typeof x === "string" && /^[a-z0-9-]+$/.test(x)))].slice(0, 500) : [];
  } catch { return []; }
}
export function persist(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export function downloadText(filename: string, text: string, mime = "application/json"): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
