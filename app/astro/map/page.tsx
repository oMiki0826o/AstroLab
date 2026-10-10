"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeToggle from "../../../components/theme-toggle";
import { catalog } from "../../../lib/astro";

function rightAscension(value: string) { const match = value.match(/(\d+)h\s*(\d+)m/); return match ? Number(match[1]) + Number(match[2]) / 60 : null; }
function declination(value: string) { const match = value.match(/([+−-])(\d+)°\s*(\d+)?/); if (!match) return null; return (match[1] === "-" || match[1] === "−" ? -1 : 1) * (Number(match[2]) + Number(match[3] || 0) / 60); }

export default function AstroMapPage() {
  const [query, setQuery] = useState("");
  const objects = useMemo(() => catalog.filter(item => rightAscension(item.ra) !== null && declination(item.dec) !== null && (!query.trim() || `${item.name} ${item.aliases.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()))).slice(0, 80), [query]);
  return <main className="app"><div className="app-header"><div><Link className="back" href="/astro">← Astro Catalog</Link><h1>Sky Map</h1><p className="muted">把已整理座標放進一張可點選的相對位置圖。</p></div><ThemeToggle /></div><section className="panel"><label className="field-label">搜尋目標<input className="field search-field" value={query} onChange={event => setQuery(event.target.value)} placeholder="M42、Sirius、Orion" /></label><p className="muted">這是目標分布示意，不包含地平線、歲差、地形遮蔽或即時星曆；詳細觀測請再開啟 Sky Tonight。</p></section><section className="panel astro-map-panel"><svg className="astro-map" viewBox="0 0 900 500" role="img" aria-label="AstroLab relative sky map"><rect width="900" height="500" rx="16" fill="var(--card)" />{Array.from({ length: 30 }, (_, index) => <line key={index} x1={index * 30} y1="0" x2={index * 30} y2="500" stroke="var(--line)" opacity=".35" />)}{Array.from({ length: 16 }, (_, index) => <line key={index} x1="0" y1={index * 32} x2="900" y2={index * 32} stroke="var(--line)" opacity=".35" />)}{objects.map(item => { const ra = rightAscension(item.ra) ?? 0; const dec = declination(item.dec) ?? 0; const x = (24 - ra) / 24 * 860 + 20; const y = (90 - dec) / 180 * 460 + 20; return <Link href={`/astro/object/${item.id}/`} key={item.id}><circle cx={x} cy={y} r={item.magnitude < 3 ? 7 : 4} fill="var(--accent)" /><title>{item.name}</title></Link>; })}</svg><div className="astro-map-legend"><span>● 目錄目標</span><span>點擊星點查看詳細資料</span></div></section></main>;
}
