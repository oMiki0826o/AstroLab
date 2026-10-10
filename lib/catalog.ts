/*
 * File: catalog.ts
 * Modification: 2026-10-11 - Canonical Messier IDs, shared source, normalized search.
 */
import curated from "../content/astro/catalog.json";
import { isEquatorial } from "./astronomy";

export type Locale = "zh-TW" | "en";
export type ObjectType = "galaxy" | "nebula" | "cluster" | "planetary" | "remnant" | "star" | "dark" | "planet" | "index";
export type AstroObject = {
  id: string; name: Record<Locale, string>; aliases: readonly string[];
  type: ObjectType; constellation: Record<Locale, string>;
  raDeg: number | null; decDeg: number | null; epoch: "J2000";
  magnitude: number | null; angularSize: string; distance: string;
  dataStatus: "needs-review" | "index" | "complete"; source: string;
  guide?: Record<Locale, string>; related?: readonly string[];
};

const known: AstroObject[] = curated as unknown as AstroObject[]; // Schema checked by tools/validate-data.mjs
const ids = new Set(known.map(item => item.id));
const messier = Array.from({ length: 110 }, (_, index): AstroObject | null => {
  const id = `m${index + 1}`;
  return ids.has(id) ? null : {
    id, name: { "zh-TW": `梅西耶天體 M${index + 1}`, en: `Messier ${index + 1}` },
    aliases: [`Messier ${index + 1}`], type: "index",
    constellation: { "zh-TW": "尚未整理", en: "Not curated" },
    raDeg: null, decDeg: null, epoch: "J2000", magnitude: null,
    angularSize: "—", distance: "—", dataStatus: "index", source: "Messier catalogue index",
  };
}).filter((item): item is AstroObject => item !== null);
export const catalog: readonly AstroObject[] = [...known, ...messier];
export const measurable = catalog.filter((item): item is AstroObject & { raDeg: number; decDeg: number } =>
  item.raDeg !== null && item.decDeg !== null && isEquatorial({ raDeg: item.raDeg, decDeg: item.decDeg }));
export const getObject = (id: string) => catalog.find(item => item.id === id);
export const label = (item: AstroObject, locale: Locale) => item.type === "index" ? item.name[locale] : `${item.name[locale]}${/^m\d+$/.test(item.id) ? ` · ${item.id.toUpperCase()}` : ""}`;
export function normalizeTerm(value: string): string { return value.normalize("NFKC").toLocaleLowerCase().replace(/[\s_-]+/g, ""); }
export function findObjects(query: string, locale: Locale, category = "", includeIndex = false): AstroObject[] {
  const q = normalizeTerm(query.trim());
  return catalog.filter(item => {
    if (item.dataStatus === "index" && !q && !includeIndex && category !== "index") return false;
    if (category && item.type !== category) return false;
    if (!q) return true;
    return [item.id, item.name["zh-TW"], item.name.en, item.constellation["zh-TW"], item.constellation.en, ...item.aliases].some(v => normalizeTerm(v).includes(q));
  });
}
