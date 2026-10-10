"use client";
/*
 * File: catalog.tsx
 * Modification: 2026-10-11 - Shared bilingual catalog view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Catalog({locale}:{locale:Locale}) {
  const [query,setQuery]=useState("");const [type,setType]=useState("");
  const [favoriteIds,setFavoriteIds]=useState<string[]>([]);const [onlyFav,setOnlyFav]=useState(false);const [notice,setNotice]=useState("");
  useEffect(()=>setFavoriteIds(loadIds("astrolab.favorites")),[]);
  const results=useMemo(()=>findObjects(query,locale,type).filter(x=>!onlyFav||favoriteIds.includes(x.id)),[query,locale,type,onlyFav,favoriteIds]);
  function favorite(id:string){const next=favoriteIds.includes(id)?favoriteIds.filter(x=>x!==id):[...favoriteIds,id];setFavoriteIds(next);if(!persist("astrolab.favorites",next))setNotice(langOf(locale,"無法儲存收藏（瀏覽器儲存空間不可用）。","Unable to save favorites (storage unavailable)."));}
  function exportList(){if(!favoriteIds.length){setNotice(langOf(locale,"目前沒有收藏。","No favorites yet."));return;}downloadText("astrolab-observation-list.json",JSON.stringify({schemaVersion:1,targets:catalog.filter(x=>favoriteIds.includes(x.id))},null,2));setNotice(langOf(locale,"已匯出 JSON。","JSON exported."));}
  return <Layout locale={locale} view="catalog" title={langOf(locale,"天體目錄","Astro Catalog")} intro={langOf(locale,"標準化 ID、雙語搜尋與本機收藏；不完整資料會清楚標示。","Canonical IDs, bilingual search, local favorites, and transparent data status.")}><section className="card"><div className="toolbar"><label className="grow">{langOf(locale,"搜尋","Search")}<input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="M42 / Orion / 獵戶座 / NGC 1976" /></label><label>{langOf(locale,"類型","Type")}<select className="input" value={type} onChange={e=>setType(e.target.value)}><option value="">{langOf(locale,"全部","All")}</option>{Object.entries(types).map(([k])=><option value={k} key={k}>{typeOf(k as ObjectType,locale)}</option>)}</select></label><button className="button" aria-pressed={onlyFav} onClick={()=>setOnlyFav(!onlyFav)}>{onlyFav?langOf(locale,"顯示全部","Show all"):langOf(locale,"只看收藏","Favorites only")}</button><button className="button" onClick={exportList}>{langOf(locale,"匯出 JSON","Export JSON")}</button></div><p className="muted">{langOf(locale,`找到 ${results.length} 筆，已收藏 ${favoriteIds.length} 筆。`,`Showing ${results.length}, favorites ${favoriteIds.length}.`)}</p>{notice&&<p role="status" className="notice">{notice}</p>}</section><section className="grid objects">{results.map(item=><article className="card object-card" key={item.id}><div className="row spread"><span className="chip">{typeOf(item.type,locale)}</span><button type="button" className="button star" onClick={()=>favorite(item.id)} aria-label={langOf(locale,`收藏 ${label(item,locale)}`,`Favorite ${label(item,locale)}`)} aria-pressed={favoriteIds.includes(item.id)}>{favoriteIds.includes(item.id)?"★":"☆"}</button></div><h2><ObjectLink item={item} locale={locale}/></h2><p className="muted">{item.constellation[locale]} · {item.magnitude===null?"—":item.magnitude} mag</p><p>{item.dataStatus==="index"?langOf(locale,"僅收錄索引，尚無可靠座標與星等。","Index only; coordinates and magnitude unavailable."):item.angularSize}</p><ObjectLink item={item} locale={locale} >{langOf(locale,"檢視資料 →","Details →")}</ObjectLink></article>)}</section>{results.length===0&&<p className="empty">{langOf(locale,"找不到符合條件的天體。","No matching objects.")}</p>}</Layout>;
}
