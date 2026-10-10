"use client";
/*
 * File: map.tsx
 * Modification: 2026-10-11 - Shared bilingual map view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function SkyMap({locale}:{locale:Locale}){
  const [query,setQuery]=useState("");const [zoom,setZoom]=useState(1);
  const objects=useMemo(()=>measurable.filter(x=>findObjects(query,locale).includes(x)).slice(0,150),[query,locale]);
  const viewBox=`${450-450/zoom} ${250-250/zoom} ${900/zoom} ${500/zoom}`;
  return <Layout locale={locale} view="map" title="Sky Map" intro={langOf(locale,"赤經–赤緯的等距矩形投影；這不是地面視角或即時星圖。","Equidistant cylindrical RA/Dec sketch, not a live or horizon-facing sky chart.")}><section className="card"><label>{langOf(locale,"搜尋天體","Search object")}<input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="M42, Sirius, Orion" /></label><div className="toolbar"><button className="button" onClick={()=>setZoom(v=>Math.max(1,v-.5))} disabled={zoom===1}>−</button><span>{zoom.toFixed(1)}×</span><button className="button" onClick={()=>setZoom(v=>Math.min(4,v+.5))} disabled={zoom===4}>＋</button><button className="button" onClick={()=>setZoom(1)}>{langOf(locale,"重設","Reset")}</button></div><div className="map-wrap"><svg viewBox={viewBox} className="sky-map" role="img" aria-label="Equatorial sky map"><rect x="0" y="0" width="900" height="500" fill="var(--panel)" />{[0,6,12,18,24].map(h=><g key={h}><line x1={20+(24-h)/24*860} x2={20+(24-h)/24*860} y1="20" y2="480" stroke="var(--line)"/><text x={20+(24-h)/24*860+5} y="35" fill="var(--muted)" fontSize="13">{h}h</text></g>)}{[-60,-30,0,30,60].map(d=><g key={d}><line x1="20" x2="880" y1={20+(90-d)/180*460} y2={20+(90-d)/180*460} stroke="var(--line)"/><text x="24" y={20+(90-d)/180*460-4} fill="var(--muted)" fontSize="12">{d}°</text></g>)}{objects.map(item=><Link href={pathFor(locale,"object",item.id)} key={item.id}><circle cx={20+(360-item.raDeg)/360*860} cy={20+(90-item.decDeg)/180*460} r={item.magnitude!==null&&item.magnitude<3?6:4} fill="var(--accent)"/><title>{label(item,locale)}</title></Link>)}</svg></div><p className="muted">{langOf(locale,`顯示 ${objects.length} 筆具有座標的天體。搜尋索引不含假造座標。`,`Showing ${objects.length} targets with coordinates; index entries never receive invented positions.`)}</p></section></Layout>;
}
