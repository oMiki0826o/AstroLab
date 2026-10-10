"use client";
/*
 * File: constellations.tsx
 * Modification: 2026-10-11 - Shared bilingual constellations view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Constellations({locale}:{locale:Locale}){
  const [query,setQuery]=useState("");const groups=new Map<string,AstroObject[]>();
  for(const item of measurable){const key=item.constellation[locale];if(!groups.has(key))groups.set(key,[]);groups.get(key)?.push(item);}
  const filtered=[...groups].filter(([name,items])=>[name,...items.map(item=>item.constellation[locale==="en"?"zh-TW":"en"])].some(v=>v.toLocaleLowerCase().includes(query.toLocaleLowerCase()))).sort((a,b)=>a[0].localeCompare(b[0],locale));
  return <Layout locale={locale} view="constellations" title={langOf(locale,"星座探索","Constellation Explorer")} intro={langOf(locale,"星座清單根據已整理座標的目標動態產生。","Groups are derived from objects with actual coordinates.")}><section className="card"><label>{langOf(locale,"搜尋星座（支援中英文）","Search constellation in either language")}<input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Orion / 獵戶座 / Lyra" /></label></section><section className="grid tools">{filtered.map(([name,items])=><section className="card" key={name}><h2>{name}</h2><div className="list">{items.map(item=><ObjectLink item={item} locale={locale} key={item.id}/>)}</div></section>)}</section></Layout>;
}
