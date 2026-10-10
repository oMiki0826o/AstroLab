"use client";
/*
 * File: deep-sky.tsx
 * Modification: 2026-10-11 - Shared bilingual deep-sky view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function DeepSky({locale}:{locale:Locale}){
  const [kind,setKind]=useState("");const [constellation,setConstellation]=useState("");const [limit,setLimit]=useState(12);
  const objects=measurable.filter(x=>x.type!=="star"&&x.type!=="planet");
  const constellations=[...new Map(objects.map(x=>[x.constellation[locale],x.constellation[locale]])).values()].sort();
  const matches=objects.filter(x=>(!kind||x.type===kind)&&(!constellation||x.constellation[locale]===constellation)&&x.magnitude!==null&&x.magnitude<=limit).sort((a,b)=>(a.magnitude??99)-(b.magnitude??99));
  return <Layout locale={locale} view="deep-sky" title="Deep Sky Finder" intro={langOf(locale,"僅顯示已收錄數值星等的深空天體；不能只用總星等判斷攝影難度。","Deep-sky objects with known integrated magnitude; surface brightness also matters.")}><section className="card form-grid"><label>{langOf(locale,"天體類型","Type")}<select className="input" value={kind} onChange={e=>setKind(e.target.value)}><option value="">{langOf(locale,"全部","All")}</option>{Object.keys(types).filter(k=>k!=="star"&&k!=="planet"&&k!=="index").map(k=><option key={k} value={k}>{typeOf(k as ObjectType,locale)}</option>)}</select></label><label>{langOf(locale,"星座","Constellation")}<select className="input" value={constellation} onChange={e=>setConstellation(e.target.value)}><option value="">{langOf(locale,"全部","All")}</option>{constellations.map(k=><option key={k}>{k}</option>)}</select></label><label>{langOf(locale,"最暗星等","Faintest magnitude")}: {limit}<input className="range" type="range" min="4" max="13" step="0.5" value={limit} onChange={e=>setLimit(Number(e.target.value))} /></label></section><section className="card"><h2>{langOf(locale,`符合條件：${matches.length} 筆`,`Matches: ${matches.length}`)}</h2><div className="list">{matches.map(item=><ObjectLink item={item} locale={locale} key={item.id}><span>{label(item,locale)} <small>{item.constellation[locale]}</small></span><b>{item.magnitude} mag</b></ObjectLink>)}</div></section></Layout>;
}
