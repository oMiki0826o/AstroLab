import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../content/astro/common.md", import.meta.url), "utf8");
const blocks = source.split(/^## /m).slice(1);
const required = ["id", "aliases", "type", "constellation", "ra", "dec", "angularSize", "distance", "magnitude", "note", "nearbyStars", "searchGuide"];
const ids = new Set();
const errors = [];

for (const [index, block] of blocks.entries()) {
  const lines = block.trim().split(/\r?\n/);
  const heading = lines.shift() ?? `第 ${index + 1} 筆`;
  const values = Object.fromEntries(lines.filter(line => line.includes(":")).map(line => {
    const separator = line.indexOf(":");
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  }));
  for (const field of required) if (!values[field]) errors.push(`${heading}: 缺少 ${field}`);
  if (values.id && ids.has(values.id)) errors.push(`${heading}: 重複 id ${values.id}`);
  if (values.id) ids.add(values.id);
  if (values.dataStatus && !["complete", "index", "needs-review"].includes(values.dataStatus)) errors.push(`${heading}: 無效 dataStatus ${values.dataStatus}`);
  if (values.magnitude && Number.isNaN(Number(values.magnitude))) errors.push(`${heading}: magnitude 不是數字`);
}

if (errors.length) {
  console.error(`Astro data check failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Astro data check passed: ${blocks.length} entries, ${ids.size} unique ids.`);
