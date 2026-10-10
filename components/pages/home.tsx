"use client";
/*
 * File: home.tsx
 * Modification: 2026-10-11 - Shared bilingual home view.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { catalog, findObjects, getObject, label, measurable } from "../../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../../lib/catalog";
import { exposurePlan, fieldOfView, formatDec, formatLocalDateTime, formatRa, isPosition, moonPhase, nightWindow, solarAltitude, toHorizontal } from "../../lib/astronomy";
import { downloadText, loadIds, persist } from "../../lib/storage";
import { Layout, ObjectLink, ObjectFacts, ToolGrid, phaseLabels, cameras, types, langOf, typeOf, pathFor, distanceLabel, degLabel, formatMin, localDate, parseSizeDeg } from "../shared";


export function Home({locale}:{locale:Locale}){return <Layout locale={locale} view="home" title="AstroLab" intro={langOf(locale,"先找到天體，再判斷今晚何時觀測、用什麼器材拍攝。","Find targets, plan observing windows and frame your next image.")}><div className="hero-note">{langOf(locale,"純前端、無帳號，收藏與計畫只儲存在你的瀏覽器。","Static, account-free and private by default: lists stay in your browser.")}</div><ToolGrid locale={locale}/></Layout>}

export function Tools({locale}:{locale:Locale}){return <Layout locale={locale} view="tools" title={langOf(locale,"觀測與攝影工具","Observation tools")} intro={langOf(locale,"計算與資料均能在瀏覽器運作。","Client-side tools with no login required.")}><ToolGrid locale={locale}/></Layout>}
