"use client";
/*
 * File: exposure.tsx
 * Modification: 2026-10-11 - Shared bilingual exposure view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Exposure({locale}:{locale:Locale}){
  const [seconds,setSeconds]=useState(180);const [frames,setFrames]=useState(40);const [dither,setDither]=useState(10);const [overhead,setOverhead]=useState(3);const [settle,setSettle]=useState(15);const [filter,setFilter]=useState("Ha");
  const result=exposurePlan(seconds,frames,dither,overhead,settle);
  return <Layout locale={locale} view="exposure" title="Exposure Planner" intro={langOf(locale,"積分時間與實際經過時間分開計算；抖動只發生於曝光組之間。","Separates integration and elapsed time; dithering occurs only between frame groups.")}><section className="card form-grid">{[[langOf(locale,"單張曝光（秒）","Exposure (s)"),seconds,setSeconds],[langOf(locale,"張數","Frames"),frames,setFrames],[langOf(locale,"每 N 張抖動一次（0=停用）","Dither every N (0=off)"),dither,setDither],[langOf(locale,"單張讀出等開銷（秒）","Per-frame overhead (s)"),overhead,setOverhead],[langOf(locale,"每次抖動穩定等待（秒）","Settle delay per dither (s)"),settle,setSettle]].map(([title,value,setter])=><label key={title as string}>{title as string}<input className="input" type="number" step="any" min="0" value={value as number} onChange={e=>(setter as (n:number)=>void)(Number(e.target.value))}/></label>)}<label>{langOf(locale,"濾鏡","Filter")}<select className="input" value={filter} onChange={e=>setFilter(e.target.value)}>{["L","RGB","Ha","OIII","SII"].map(x=><option key={x}>{x}</option>)}</select></label></section><section className="card">{result?<><div className="metrics"><div><small>{langOf(locale,"總積分","Integration")}</small><strong>{formatMin(result.integrationSeconds)}</strong></div><div><small>{langOf(locale,"預期經過時間","Elapsed time")}</small><strong>{formatMin(result.elapsedSeconds)}</strong></div><div><small>{langOf(locale,"抖動次數","Dither events")}</small><strong>{result.dithers}</strong></div></div><p className="muted">{filter}: {frames} × {seconds}s · {langOf(locale,"未計濾鏡切換、翻轉與天氣。","Filter changes, meridian flips and weather excluded.")}</p><h3>{langOf(locale,"前八張曝光預覽","First eight frames")}</h3><ol>{Array.from({length:Math.min(frames,8)},(_,i)=><li key={i}>{i+1}. {filter} · {seconds}s {(dither>0&&(i+1)%dither===0&&i+1<frames)?"· dither":""}</li>)}</ol></>:<p role="alert" className="error">{langOf(locale,"請輸入有效且非負的值，曝光時間與張數必須大於零。","Enter valid non-negative values; exposure and frame count must be positive.")}</p>}</section></Layout>;
}
