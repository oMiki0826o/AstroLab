"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeToggle from "../../../../components/theme-toggle";
import { catalog } from "../../../../lib/astro";

export default function EnglishConstellationExplorer() {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => { const map = new Map<string, typeof catalog>(); for (const item of catalog.filter(entry => !entry.indexOnly)) { if (!map.has(item.constellation)) map.set(item.constellation, []); map.get(item.constellation)!.push(item); } return [...map.entries()].filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase())); }, [query]);
  return <main className="app" lang="en"><div className="app-header"><div><Link className="back" href="/AstroLab/en/astro/tools/">← Observation tools</Link><h1>Constellation Explorer</h1><p className="muted">Start with a constellation and browse its bright stars and deep-sky targets.</p></div><ThemeToggle /></div><section className="panel"><label className="field-label">Search constellations<input className="field search-field" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Orion, Lyra or Cassiopeia" /></label></section><section className="constellation-grid">{groups.map(([name, items]) => <article className="constellation-card" key={name}><span className="eyebrow">{items.length} TARGETS</span><h2>{name}</h2><div className="constellation-targets">{items.map(item => <Link href={`/AstroLab/en/astro/object/${item.id}/`} key={item.id}><span>{item.name}</span><small>{item.type} · {item.magnitude}</small></Link>)}</div></article>)}</section>{groups.length === 0 && <p className="empty-state">No constellation matched. Try a catalogue name shown in the list.</p>}</main>;
}
