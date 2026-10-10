"use client";
/*
 * File: equipment.tsx
 * Modification: 2026-10-11 - Shared bilingual equipment view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Equipment({locale}:{locale:Locale}){
  const [focal,setFocal]=useState(600);const [camera,setCamera]=useState(0);const [target,setTarget]=useState("m42");
  const sensor=cameras[camera];const obj=getObject(target)??measurable[0];
  const fovW=fieldOfView(sensor.w,focal),fovH=fieldOfView(sensor.h,focal);
  const major=parseSizeDeg(obj.angularSize);
  return <Layout locale={locale} view="equipment" title={langOf(locale,"器材與構圖","Equipment & FOV")} intro={langOf(locale,"使用 2·atan(sensor / 2focal) 計算真實幾何視野。","Geometric FOV from 2·atan(sensor / 2focal), without framing rotation.")}><section className="card form-grid"><label>{langOf(locale,"焦距（mm）","Focal length (mm)")}<input className="input" type="number" min="0.1" step="any" value={focal} onChange={e=>setFocal(Number(e.target.value))}/></label><label>{langOf(locale,"感光元件","Sensor")}<select className="input" value={camera} onChange={e=>setCamera(Number(e.target.value))}>{cameras.map((x,i)=><option key={x.name} value={i}>{x.name}</option>)}</select></label><label>{langOf(locale,"目標","Target")}<select className="input" value={target} onChange={e=>setTarget(e.target.value)}>{measurable.map(item=><option key={item.id} value={item.id}>{label(item,locale)}</option>)}</select></label></section><section className="card"><h2>{langOf(locale,"相機視野","Sensor field of view")}</h2><div className="big-number">{fovW===null||fovH===null?langOf(locale,"請輸入正確焦距","Invalid focal length"):`${fovW.toFixed(2)}° × ${fovH.toFixed(2)}°`}</div><p>{label(obj,locale)} · {langOf(locale,"目標角尺寸","Object angular size")}: {obj.angularSize}</p>{major&&fovW!==null&&fovH!==null&&<p className="notice">{major>Math.max(fovW,fovH)?langOf(locale,"目標長軸大於最大視野，可能需要廣角或拼接。","Target major axis exceeds the larger FOV: consider a mosaic."):langOf(locale,"目標長軸小於最大視野；實際仍須考慮方向角與構圖。","Major axis fits the longer FOV axis; orientation still matters.")}</p>}<div className="fov-preview"><div className="fov-frame" style={{aspectRatio:fovW&&fovH?`${fovW}/${fovH}`:"3/2"}}><span>{langOf(locale,"視野範圍示意","Sensor framing (schematic)")}</span></div></div></section></Layout>;
}
