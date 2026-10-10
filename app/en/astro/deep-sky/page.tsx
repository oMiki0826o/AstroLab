"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import ThemeToggle from "../../../../components/theme-toggle";
import { catalog } from "../../../../lib/astro";

export default function EnglishDeepSkyFinder() {
  const targets = catalog.filter(item => !item.indexOnly && item.type !== "亮星" && item.type !== "行星");
  const [type, setType] = useState(""); const [constellation, setConstellation] = useState(""); const [limit, setLimit] = useState(12);
  const results = useMemo(() => targets.filter(item => (!type || item.type === type) && (!constellation || item.constellation === constellation) && item.magnitude <= limit).sort((a, b) => a.magnitude - b.magnitude), [type, constellation, limit]);
  const types = [...new Set(targets.map(item => item.type))]; const constellations = [...new Set(targets.map(item => item.constellation))];
  return <main className="app" lang="en"><div className="app-header"><div><Link className="back" href="/AstroLab/en/astro/tools/">← Observation tools</Link><h1>Deep Sky Finder</h1><p className="muted">Narrow the catalogue by brightness and constellation, then open a target for its locating notes.</p></div><ThemeToggle /></div><section className="panel deep-filters"><label className="field-label">Object type<select className="field" value={type} onChange={event => setType(event.target.value)}><option value="">All types</option>{types.map(item => <option key={item}>{item}</option>)}</select></label><label className="field-label">Constellation<select className="field" value={constellation} onChange={event => setConstellation(event.target.value)}><option value="">All constellations</option>{constellations.map(item => <option key={item}>{item}</option>)}</select></label><label className="field-label">Faintest magnitude: {limit}<input type="range" min="4" max="12" step="0.5" value={limit} onChange={event => setLimit(Number(event.target.value))}/></label><span className="muted">{results.length} targets</span></section><section className="deep-results">{results.map(item => <Link className="deep-result" href={`/AstroLab/en/astro/object/${item.id}/`} key={item.id}><div><span className="tag">{item.type}</span><h2>{item.name}</h2><p>{item.constellation} · magnitude {item.magnitude} · {item.angularSize}</p></div><span className="arrow">Open details →</span></Link>)}</section>{results.length === 0 && <p className="empty-state">No targets match these filters. Raise the magnitude limit or clear the constellation.</p>}</main>;
}
