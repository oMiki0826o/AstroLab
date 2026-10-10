"use client";
/*
 * File: tonight.tsx
 * Modification: 2026-10-11 - Shared bilingual tonight view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Tonight({locale}:{locale:Locale}){
  const [lat,setLat]=useState(25.033);const [lon,setLon]=useState(121.565);const [date,setDate]=useState("");const [selected,setSelected]=useState("m42");
  useEffect(()=>{setDate(formatLocalDateTime(new Date()));const target=new URLSearchParams(window.location.search).get("target");if(target && measurable.some(x=>x.id===target))setSelected(target);},[]);
  const valid=isPosition(lat,lon)&&date!==""&&Number.isFinite(new Date(date).getTime());
  const timestamp=valid?new Date(date):null;
  const target=measurable.find(x=>x.id===selected)??measurable[0];
  const current=timestamp?toHorizontal({raDeg:target.raDeg,decDeg:target.decDeg},timestamp,lat,lon):null;
  const sun=timestamp?solarAltitude(timestamp,lat,lon):null;
  const windowResult=timestamp?nightWindow({raDeg:target.raDeg,decDeg:target.decDeg},timestamp,lat,lon):null;
  const ranked=useMemo(()=>timestamp?measurable.map(item=>({item,pos:toHorizontal({raDeg:item.raDeg,decDeg:item.decDeg},timestamp,lat,lon)})).filter(row=>row.pos&&row.pos.altitude>0).sort((a,b)=>(b.pos?.altitude??-90)-(a.pos?.altitude??-90)).slice(0,30):[],[date,lat,lon]);
  const eligible=current && sun!==null && current.altitude>=25 && sun<=-12;
  return <Layout locale={locale} view="tonight" title="Sky Tonight" intro={langOf(locale,"先看太陽高度，再看天體高度；計算採 J2000 靜態座標的近似模型。","Approximate positions from J2000 coordinates; combines Sun and target altitude.")}><section className="card"><div className="form-grid"><label>{langOf(locale,"日期與當地時間","Local date and time")}<input className="input" type="datetime-local" value={date} onChange={e=>setDate(e.target.value)}/></label><label>{langOf(locale,"緯度（−90 至 +90）","Latitude (−90 to +90)")}<input className="input" type="number" min="-90" max="90" step="any" value={lat} onChange={e=>setLat(e.target.value===""?NaN:Number(e.target.value))}/></label><label>{langOf(locale,"經度（−180 至 +180）","Longitude (−180 to +180)")}<input className="input" type="number" min="-180" max="180" step="any" value={lon} onChange={e=>setLon(e.target.value===""?NaN:Number(e.target.value))}/></label><label>{langOf(locale,"天體","Target")}<select className="input" value={selected} onChange={e=>setSelected(e.target.value)}>{measurable.map(item=><option key={item.id} value={item.id}>{label(item,locale)}</option>)}</select></label></div>{!valid&&<p role="alert" className="error">{langOf(locale,"請輸入有效的時間及經緯度。","Please enter a valid time and coordinates.")}</p>}</section>{current&&<section className="card"><h2>{label(target,locale)}</h2><div className="metrics"><div><small>{langOf(locale,"高度角","Altitude")}</small><strong>{degLabel(current.altitude)}</strong></div><div><small>{langOf(locale,"方位角（北=0°）","Azimuth (N=0°)")}</small><strong>{degLabel(current.azimuth)}</strong></div><div><small>{langOf(locale,"太陽高度角","Sun altitude")}</small><strong>{degLabel(sun)}</strong></div></div><p className={eligible?"success":"muted"}>{eligible?langOf(locale,"此時符合基本暗夜與目標高度條件。","Meets basic dark-sky and altitude criteria."):langOf(locale,"此時未同時符合太陽 ≤ −12°、目標 ≥ 25° 的篩選條件。","Sun ≤ −12° and target ≥ 25° are not both satisfied at this time.")}</p><h3>{langOf(locale,"今晚建議觀測時段","Suggested night window")}</h3>{windowResult?<p>{windowResult.start.toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit"})} – {windowResult.end.toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit"})} · {langOf(locale,"最適合高度","Peak altitude")} {degLabel(windowResult.peak.altitude)} ({windowResult.peak.time.toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit"})})</p>:<p className="muted">{langOf(locale,"指定夜間時段沒有符合條件的取樣點。","No sampled time meets the criteria this night.")}</p>}<p className="muted">{langOf(locale,"每 15 分鐘取樣；未計大氣折射、地形、雲量、月光、歲差與移動天體。","Sampled every 15 minutes; excludes refraction, terrain, clouds, moonlight, precession and moving objects.")}</p></section>}<section className="card"><h2>{langOf(locale,"已升起目標（依高度排序）","Above-horizon targets by altitude")}</h2><div className="list">{ranked.map(row=><ObjectLink item={row.item} locale={locale} key={row.item.id}><span>{label(row.item,locale)}</span><b>{degLabel(row.pos?.altitude??null)}</b></ObjectLink>)}</div></section></Layout>;
}
