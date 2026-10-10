"use client";
/*
 * File: compare.tsx
 * Modification: 2026-10-11 - Shared bilingual compare view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Comparison({locale}:{locale:Locale}){
  const [a,setA]=useState("m42"),[b,setB]=useState("m31");
  useEffect(()=>{const first=new URLSearchParams(window.location.search).get("a");if(first&&getObject(first))setA(first);},[]);
  const left=getObject(a)??measurable[0],right=getObject(b)??measurable[1];
  const rows=[[langOf(locale,"類型","Type"),typeOf(left.type,locale),typeOf(right.type,locale)],
    [langOf(locale,"星座","Constellation"),left.constellation[locale],right.constellation[locale]],
    [langOf(locale,"視星等","Magnitude"),String(left.magnitude??"—"),String(right.magnitude??"—")],
    [langOf(locale,"角尺寸","Angular size"),left.angularSize,right.angularSize],
    [langOf(locale,"距離","Distance"),distanceLabel(left.distance,locale),distanceLabel(right.distance,locale)],
    ["RA",left.raDeg===null?"—":formatRa(left.raDeg),right.raDeg===null?"—":formatRa(right.raDeg)],
    ["Dec",left.decDeg===null?"—":formatDec(left.decDeg),right.decDeg===null?"—":formatDec(right.decDeg)]];
  return <Layout locale={locale} view="compare" title="Target Comparison" intro={langOf(locale,"直接對照兩個目標的資料，不宣稱僅憑星等就能比較拍攝難易度。","Compare two targets, without pretending that integrated magnitude predicts exposure difficulty.")}><section className="card two-col">{[[a,setA],[b,setB]].map(([value,setter],i)=><label key={i}>{langOf(locale,`目標 ${i===0?"A":"B"}`,`Target ${i===0?"A":"B"}`)}<select className="input" value={value as string} onChange={e=>(setter as (v:string)=>void)(e.target.value)}>{catalog.map(item=><option key={item.id} value={item.id}>{label(item,locale)}</option>)}</select></label>)}</section><section className="card scroll-x"><table><thead><tr><th>{langOf(locale,"項目","Field")}</th><th>{label(left,locale)}</th><th>{label(right,locale)}</th></tr></thead><tbody>{rows.map(([key,lv,rv])=><tr key={key}><th>{key}</th><td>{lv}</td><td>{rv}</td></tr>)}</tbody></table></section></Layout>;
}
