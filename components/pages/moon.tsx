"use client";
/*
 * File: moon.tsx
 * Modification: 2026-10-11 - Shared bilingual moon view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Moon({locale}:{locale:Locale}){
  const [date,setDate]=useState("");useEffect(()=>setDate(localDate()),[]);
  const parsed=date?new Date(`${date}T12:00:00`):null;
  const value=parsed&&Number.isFinite(parsed.getTime())?moonPhase(parsed):null;
  return <Layout locale={locale} view="moon" title="Moon Phase" intro={langOf(locale,"簡化朔望月近似值，非精密月球星曆。","Synodic-cycle approximation, not a precision lunar ephemeris.")}><section className="card"><label>{langOf(locale,"日期","Date")}<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>{value&&<div className="moon-summary"><div className="moon-orb" aria-hidden="true"><div style={{width:`${value.illumination*100}%`}} /></div><div><h2>{phaseLabels[locale][value.index]}</h2><p>{langOf(locale,"月齡","Age")}: {value.ageDays.toFixed(1)} {langOf(locale,"日","days")}</p><p>{langOf(locale,"照明比例","Illumination")}: {(value.illumination*100).toFixed(1)}%</p></div></div>}<p className="muted">{langOf(locale,"本圖條形只是照明比例示意，並非真實月面明暗幾何。","The graphic visualizes percentage, not the actual lunar terminator.")}</p></section></Layout>;
}
