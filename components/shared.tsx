"use client";
/*
 * File: shared.tsx
 * Modification: 2026-10-11 - Bilingual layouts, labels, common controls and navigation.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { label } from "../lib/catalog";
import type { AstroObject, Locale, ObjectType } from "../lib/catalog";
import { formatLocalDateTime, formatRa, formatDec } from "../lib/astronomy";
import { persist } from "../lib/storage";

export type View = "home" | "catalog" | "tools" | "tonight" | "map" | "planner" | "compare" | "deep-sky" | "constellations" | "moon" | "equipment" | "exposure" | "object";
export const types: Record<ObjectType, [string, string]> = {
  galaxy: ["星系", "Galaxy"], nebula: ["星雲", "Nebula"], cluster: ["星團", "Cluster"],
  planetary: ["行星狀星雲", "Planetary nebula"], remnant: ["超新星殘骸", "Supernova remnant"],
  star: ["亮星", "Star"], planet: ["行星", "Planet"], dark: ["暗星雲", "Dark nebula"], index: ["索引資料", "Index only"],
};
export const phaseLabels: Record<Locale, string[]> = {
  "zh-TW": ["新月", "盈眉月", "上弦月", "盈凸月", "滿月", "虧凸月", "下弦月", "虧眉月"],
  en: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
};
export const cameras = [
  { name: "APS-C 22.3 × 14.9 mm", w: 22.3, h: 14.9 },
  { name: "Full frame 36 × 24 mm", w: 36, h: 24 },
  { name: "Micro Four Thirds 17.3 × 13 mm", w: 17.3, h: 13 },
];
export const tools: Array<{ id: View; zh: string; en: string; descZh: string; descEn: string }> = [
  { id: "catalog", zh: "天體目錄", en: "Astro Catalog", descZh: "搜尋 Messier、NGC、IC 與亮星。", descEn: "Search Messier, NGC, IC and bright stars." },
  { id: "tonight", zh: "今晚觀測", en: "Sky Tonight", descZh: "依時間與位置計算高度、方位、暗夜觀測時段。", descEn: "Altitude, azimuth and dark-sky visibility windows." },
  { id: "map", zh: "相對星圖", en: "Relative Sky Map", descZh: "赤經、赤緯分布示意，可點選目標。", descEn: "An interactive equatorial coordinate overview." },
  { id: "deep-sky", zh: "深空搜尋", en: "Deep Sky Finder", descZh: "依星等、類型及星座篩選。", descEn: "Filter by magnitude, constellation and type." },
  { id: "constellations", zh: "星座探索", en: "Constellations", descZh: "從星座尋找已收錄的天體。", descEn: "Browse curated targets by constellation." },
  { id: "moon", zh: "月相", en: "Moon Phase", descZh: "月齡與月面照明比例近似值。", descEn: "Approximate moon age and illumination." },
  { id: "equipment", zh: "器材視野", en: "Equipment FOV", descZh: "以實際焦距與感光元件計算視野。", descEn: "Compute optical field of view." },
  { id: "exposure", zh: "曝光計算", en: "Exposure Planner", descZh: "總積分、抖動次數與時間開銷。", descEn: "Integration, dithers and time overhead." },
  { id: "compare", zh: "目標比較", en: "Target Comparison", descZh: "比較角大小、星等與座標。", descEn: "Compare apparent size and magnitudes." },
  { id: "planner", zh: "拍攝計畫", en: "Imaging Planner", descZh: "整合視野、曝光與拍攝筆記並匯出。", descEn: "Combine FOV, exposure and an exportable plan." },
];
export const langOf = (locale: Locale, zh: string, en: string) => locale === "en" ? en : zh;
export const typeOf = (type: ObjectType, locale: Locale) => types[type][locale === "en" ? 1 : 0];
export const prefix = (locale: Locale) => locale === "en" ? "/en" : "";
export const pathFor = (locale: Locale, view: View, id?: string) => `${prefix(locale)}${view === "home" ? "/" : view === "object" ? `/astro/object/${id}/` : `/astro/${view === "catalog" ? "" : `${view}/`}`}`;
export function distanceLabel(distance: string, locale: Locale): string {
  if (locale === "zh-TW" || distance === "—") return distance;
  const found = distance.replaceAll(",", "").match(/(\d+(?:\.\d+)?)\s*(萬)?光年/);
  if (!found) return distance;
  const ly = Number(found[1]) * (found[2] ? 10000 : 1);
  return `${distance.includes("約") ? "≈ " : ""}${ly.toLocaleString("en-US")} ly`;
}
export const degLabel = (n: number | null) => n === null ? "—" : `${n.toFixed(1)}°`;
export const formatMin = (n: number) => `${Math.floor(n / 3600)}h ${String(Math.floor(n % 3600 / 60)).padStart(2, "0")}m ${String(Math.floor(n % 60)).padStart(2, "0")}s`;
export function localDate(): string { return formatLocalDateTime(new Date()).slice(0, 10); }
export function parseSizeDeg(size: string): number | null {
  const m = size.match(/(\d+(?:\.\d+)?)\s*([°′″])/);
  if (!m) return null;
  return Number(m[1]) / (m[2] === "°" ? 1 : m[2] === "′" ? 60 : 3600);
}

export function ThemeSwitch({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<"light" | "dark" | "red">("dark");
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("astrolab.theme"); } catch { /* private mode */ }
    const initial = stored === "light" || stored === "dark" || stored === "red" ? stored : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(initial); document.documentElement.dataset.theme = initial;
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => {
        // Offline cache is optional; the online site should remain functional.
      });
    }
  }, []);
  function cycle() {
    const next = theme === "light" ? "dark" : theme === "dark" ? "red" : "light";
    setTheme(next); document.documentElement.dataset.theme = next;
    persist("astrolab.theme", next);
  }
  return <button type="button" className="theme-button" onClick={cycle} title={langOf(locale, "淺色 → 深色 → 紅光", "Light → Dark → Red")}>{langOf(locale, "主題", "Theme")}: {theme}</button>;
}

export function Layout({ locale, view, children, title, intro, objectId }: { locale: Locale; view: View; children: ReactNode; title: string; intro?: string; objectId?: string }) {
  const switchHref = pathFor(locale === "en" ? "zh-TW" : "en", view, objectId);
  return <main className="container"><header className="site-header"><Link className="brand" href={pathFor(locale, "home")}>✦ AstroLab</Link><nav aria-label={langOf(locale,"主導覽","Main navigation")}><Link href={pathFor(locale, "catalog")}>{langOf(locale,"目錄","Catalog")}</Link><Link href={pathFor(locale, "tools")}>{langOf(locale,"工具","Tools")}</Link><Link href={switchHref} hrefLang={locale === "en" ? "zh-Hant" : "en"}>{locale === "en" ? "繁體中文" : "English"}</Link><ThemeSwitch locale={locale} /></nav></header><div className="heading"><span className="eyebrow">ASTROLAB · OBSERVATION TOOLKIT</span><h1>{title}</h1>{intro && <p className="muted">{intro}</p>}</div>{children}<footer>{langOf(locale,"僅供觀測規劃。天文位置、月相與目錄值為近似／待核對資料，不取代專業星曆與即時天氣。","For planning only. Coordinates, phase and catalogue data are approximate or pending review; not professional ephemerides or weather.")}</footer></main>;
}

export function ObjectLink({item,locale,children}:{item:AstroObject;locale:Locale;children?:ReactNode}){return <Link href={pathFor(locale,"object",item.id)}>{children??label(item,locale)}</Link>}

export function ObjectFacts({item,locale}:{item:AstroObject;locale:Locale}){
  const facts = [
    [langOf(locale,"類型","Type"),typeOf(item.type,locale)],
    [langOf(locale,"星座","Constellation"),item.constellation[locale]],
    [langOf(locale,"赤經 (J2000)","Right ascension (J2000)"),item.raDeg === null ? "—" : formatRa(item.raDeg)],
    [langOf(locale,"赤緯 (J2000)","Declination (J2000)"),item.decDeg === null ? "—" : formatDec(item.decDeg)],
    [langOf(locale,"視星等","Magnitude"),item.magnitude === null ? "—" : String(item.magnitude)],
    [langOf(locale,"角尺寸","Angular size"),item.angularSize],
    [langOf(locale,"距離（原始整理值）","Distance (legacy value)"),distanceLabel(item.distance,locale)],
    [langOf(locale,"資料狀態","Data quality"),item.dataStatus === "index" ? langOf(locale,"僅索引","Index only") : langOf(locale,"待來源核對","Pending source review")],
  ];
  return <dl className="facts">{facts.map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>;
}

export function ToolGrid({locale}:{locale:Locale}){return <section className="grid tools">{tools.map(tool=><Link key={tool.id} className="card tool" href={pathFor(locale,tool.id)}><span className="eyebrow">{tool.id.toUpperCase()}</span><h2>{locale==="en"?tool.en:tool.zh}</h2><p>{locale==="en"?tool.descEn:tool.descZh}</p><span className="arrow">{langOf(locale,"開啟 →","Open →")}</span></Link>)}</section>}
