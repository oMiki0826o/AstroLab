"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeToggle from "../../../../components/theme-toggle";
import { catalog } from "../../../../lib/astro";

function rightAscension(value: string) { const match = value.match(/(\d+)h\s*(\d+)m/); return match ? Number(match[1]) + Number(match[2]) / 60 : null; }
function declination(value: string) { const match = value.match(/([+−-])(\d+)°\s*(\d+)?/); if (!match) return null; return (match[1] === "-" || match[1] === "−" ? -1 : 1) * (Number(match[2]) + Number(match[3] || 0) / 60); }

export default function EnglishAstroMap() {
  const [query, setQuery] = useState(""); const [zoom, setZoom] = useState(1);
  const objects = useMemo(() => catalog.filter(item => rightAscension(item.ra) !== null && declination(item.dec) !== null && (!query.trim() || `${item.name} ${item.aliases.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()))).slice(0, 80), [query]);
  const viewBox = `${450 - 450 / zoom} ${250 - 250 / zoom} ${900 / zoom} ${500 / zoom}`;
  return <main className="app" lang="en"><div className="app-header"><div><Link className="back" href="/AstroLab/en/astro/">← Astro Catalog</Link><h1>Sky Map</h1><p className="muted">Browse the curated coordinates in a clickable, zoomable relative map.</p></div><ThemeToggle /></div><section className="panel"><label className="field-label">Search targets<input className="field search-field" value={query} onChange={event => setQuery(event.target.value)} placeholder="M42, Sirius, Orion" /></label><p className="muted">This is a relative distribution sketch, not a live sky chart. It does not model the horizon, precession, terrain or live ephemerides; open Sky Tonight for planning.</p></section><section className="panel astro-map-panel"><div className="toolbar"><span className="muted">Field zoom {zoom.toFixed(1)}×</span><button className="button" onClick={() => setZoom(value => Math.max(1, value - .5))} disabled={zoom <= 1}>−</button><button className="button" onClick={() => setZoom(value => Math.min(3, value + .5))} disabled={zoom >= 3}>＋</button></div><svg className="astro-map" viewBox={viewBox} role="img" aria-label="AstroLab relative sky map"><rect width="900" height="500" rx="16" fill="var(--card)" />{Array.from({ length: 30 }, (_, index) => <line key={`v-${index}`} x1={index * 30} y1="0" x2={index * 30} y2="500" stroke="var(--line)" opacity=".35" />)}{Array.from({ length: 16 }, (_, index) => <line key={`h-${index}`} x1="0" y1={index * 32} x2="900" y2={index * 32} stroke="var(--line)" opacity=".35" />)}{objects.map(item => { const ra = rightAscension(item.ra) ?? 0; const dec = declination(item.dec) ?? 0; const x = (24 - ra) / 24 * 860 + 20; const y = (90 - dec) / 180 * 460 + 20; return <Link href={`/AstroLab/en/astro/object/${item.id}/`} key={item.id}><circle cx={x} cy={y} r={item.magnitude < 3 ? 7 : 4} fill="var(--accent)" /><title>{item.name}</title></Link>; })}</svg><div className="astro-map-legend"><span>● Catalogue target</span><span>Select a point to open its details</span></div></section></main>;
}
