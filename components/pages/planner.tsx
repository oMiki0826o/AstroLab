"use client";
/*
 * File: planner.tsx
 * Modification: 2026-10-11 - Shared bilingual planner view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Planner({locale}:{locale:Locale}){
  const [name,setName]=useState("");const [focal,setFocal]=useState(600);const [seconds,setSeconds]=useState(180);const [frames,setFrames]=useState(40);const [notes,setNotes]=useState("");const [saved,setSaved]=useState(false);
  const plan=exposurePlan(seconds,frames,0);const fov=fieldOfView(22.3,focal);
  const output={schemaVersion:1,target:name.trim(),focalMm:focal,sensor:"APS-C 22.3mm",exposureSeconds:seconds,frames,notes:notes.trim(),integrationSeconds:plan?.integrationSeconds??null,fovWidthDeg:fov};
  function save(){if(!plan||!fov)return;setSaved(persist("astrolab.imaging-plan",output));}
  useEffect(()=>{try{const raw=localStorage.getItem("astrolab.imaging-plan");if(!raw)return;const value=JSON.parse(raw);if(typeof value.target==="string")setName(value.target);if(Number.isFinite(value.focalMm)&&value.focalMm>0)setFocal(value.focalMm);if(Number.isFinite(value.exposureSeconds)&&value.exposureSeconds>0)setSeconds(value.exposureSeconds);if(Number.isInteger(value.frames)&&value.frames>0)setFrames(value.frames);if(typeof value.notes==="string")setNotes(value.notes);}catch{/* not a valid saved plan */}},[]);
  return <Layout locale={locale} view="planner" title="Imaging Planner" intro={langOf(locale,"一份簡單的可保存、可匯出的攝影計畫；不需後端。","A simple locally saved, exportable imaging plan with no backend.")}><section className="card form-grid"><label>{langOf(locale,"拍攝目標","Target")}<input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="M42"/></label><label>{langOf(locale,"焦距 mm","Focal length mm")}<input className="input" type="number" min="1" value={focal} onChange={e=>setFocal(Number(e.target.value))}/></label><label>{langOf(locale,"曝光秒數","Exposure seconds")}<input className="input" type="number" min="1" value={seconds} onChange={e=>setSeconds(Number(e.target.value))}/></label><label>{langOf(locale,"曝光張數","Frames")}<input className="input" type="number" min="1" value={frames} onChange={e=>setFrames(Number(e.target.value))}/></label><label className="full-width">{langOf(locale,"備註","Notes")}<textarea className="input" rows={4} value={notes} onChange={e=>setNotes(e.target.value)} /></label></section><section className="card"><h2>{langOf(locale,"計畫摘要","Summary")}</h2>{plan&&fov?<p>{langOf(locale,"水平視野","Horizontal FOV")}: {fov.toFixed(2)}° · {langOf(locale,"總積分","Integration")}: {formatMin(plan.integrationSeconds)}</p>:<p className="error">{langOf(locale,"請修正輸入值。","Correct the input values.")}</p>}<div className="toolbar"><button className="button primary" disabled={!plan||!fov} onClick={save}>{langOf(locale,"儲存於此瀏覽器","Save locally")}</button><button className="button" disabled={!plan||!fov} onClick={()=>downloadText("astrolab-plan.json",JSON.stringify(output,null,2))}>{langOf(locale,"匯出 JSON","Export JSON")}</button></div>{saved&&<p className="notice" role="status">{langOf(locale,"計畫已儲存。","Plan saved.")}</p>}</section></Layout>;
}
