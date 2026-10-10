"use client";
/*
 * File: object.tsx
 * Modification: 2026-10-11 - Shared bilingual object view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function ObjectPage({locale,id}:{locale:Locale;id:string}){
  const item=getObject(id);
  if(!item)return <Layout locale={locale} view="object" title="404"><p>{langOf(locale,"無此天體。","Unknown object.")}</p></Layout>;
  const ready=item.raDeg!==null&&item.decDeg!==null;
  return <Layout locale={locale} view="object" objectId={item.id} title={label(item,locale)} intro={langOf(locale,"天體資料與相關觀測工具","Target details and observing tools")}><div className="card"><ObjectFacts item={item} locale={locale}/><p className="muted">{langOf(locale,"來源／待核對","Source / review pending")}: {item.source}</p><p>{langOf(locale,"別名","Aliases")}: {item.aliases.join(" · ")||"—"}</p>{item.guide&&<section className="guide"><h2>{langOf(locale,"如何找到它","How to find it")}</h2><p>{item.guide[locale]}</p></section>}{item.related&&item.related.length>0&&<section className="guide"><h2>{langOf(locale,"相關目標","Nearby or related targets")}</h2><div className="toolbar">{item.related.map(key=>getObject(key)).filter((x):x is AstroObject=>!!x).map(other=><Link className="button" href={pathFor(locale,"object",other.id)} key={other.id}>{label(other,locale)}</Link>)}</div></section>}<div className="toolbar">{ready&&<Link className="button primary" href={`${pathFor(locale,"tonight")}?target=${item.id}`}>{langOf(locale,"今晚觀測","Tonight")}</Link>}<Link className="button" href={`${pathFor(locale,"compare")}?a=${item.id}`}>{langOf(locale,"加入比較","Compare")}</Link><Link className="button" href={pathFor(locale,"catalog")}>{langOf(locale,"回到目錄","Back to catalog")}</Link></div></div></Layout>;
}
