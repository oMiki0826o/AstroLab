/*
 * File: validate-data.mjs
 * Modification: 2026-10-11 - Strict catalogue record validation with alias-conflict detection.
 */
import { readFileSync } from "node:fs";
const catalog = JSON.parse(readFileSync(new URL("../content/astro/catalog.json", import.meta.url), "utf8"));
const ids = new Set(), errors = [], aliasToId = new Map();
const englishName = /^[\p{L}\p{N} .',()\-]+$/u;
for (const [index, item] of catalog.entries()) {
  const at = `${item?.id ?? index}`;
  if (!item || typeof item !== "object") { errors.push(`${at}: invalid object`); continue; }
  if (typeof item.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(item.id)) errors.push(`${at}: bad id`);
  if (ids.has(item.id)) errors.push(`${at}: duplicate canonical id`);
  ids.add(item.id);
  if (!item.name?.["zh-TW"] || !item.name?.en) errors.push(`${at}: missing bilingual name`);
  if (!item.constellation?.["zh-TW"] || !item.constellation?.en) errors.push(`${at}: missing constellation`);
  if (!englishName.test(item.name?.en ?? "")) errors.push(`${at}: suspicious English name`);
  if (item.dataStatus === "index" && item.type === "planet") {
    if (item.raDeg !== null || item.decDeg !== null) errors.push(`${at}: moving body must not have fixed coordinates`);
  } else {
    if (typeof item.raDeg !== "number" || item.raDeg < 0 || item.raDeg >= 360) errors.push(`${at}: invalid RA`);
    if (typeof item.decDeg !== "number" || item.decDeg < -90 || item.decDeg > 90) errors.push(`${at}: invalid Dec`);
  }
  if (item.epoch !== "J2000") errors.push(`${at}: unknown coordinate epoch`);
  if (item.magnitude !== null && (typeof item.magnitude !== "number" || !Number.isFinite(item.magnitude) || item.magnitude < -30 || item.magnitude > 35)) errors.push(`${at}: invalid magnitude`);
  if (!["galaxy", "nebula", "cluster", "planetary", "remnant", "star", "dark", "planet"].includes(item.type)) errors.push(`${at}: invalid object type`);
  if (!Array.isArray(item.aliases) || item.aliases.some(x => typeof x !== "string")) errors.push(`${at}: invalid aliases`);
  if (!["complete", "index", "needs-review"].includes(item.dataStatus)) errors.push(`${at}: invalid dataStatus`);
  if (!item.source) errors.push(`${at}: missing source`);
  const terms = [item.id, item.name?.["zh-TW"], item.name?.en, ...(item.aliases ?? [])];
  for (const term of terms) {
    const normalized = String(term ?? "").normalize("NFKC").toLowerCase().replace(/[\s_-]+/g, "");
    if (!normalized) continue;
    // Multiple astronomical aliases may be ambiguous; warn only on exact collisions.
    const previous = aliasToId.get(normalized);
    if (previous && previous !== item.id) errors.push(`${at}: alias '${term}' collides with ${previous}`);
    aliasToId.set(normalized, item.id);
  }
}
if (!Array.isArray(catalog) || catalog.length < 35) errors.push("Missing migrated catalogue entries");
if (errors.length) { for (const error of errors) console.error(`ERROR ${error}`); process.exit(1); }
console.log(`OK: ${ids.size} curated targets, unique IDs and aliases, valid coordinate ranges.`);
console.log(`With on-demand Messier index: ${ids.size + Array.from({length:110},(_,i)=>`m${i+1}`).filter(id=>!ids.has(id)).length} canonical routes.`);
