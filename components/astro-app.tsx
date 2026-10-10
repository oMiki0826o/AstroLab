"use client";
/*
 * File: astro-app.tsx
 * Modification: 2026-10-11 - Thin route dispatcher for shared bilingual pages.
 */
import { useEffect } from "react";
import type { Locale } from "../lib/catalog";
import type { View } from "./shared";
import { Home, Tools } from "./pages/home";
import { Catalog } from "./pages/catalog";
import { ObjectPage } from "./pages/object";
import { Tonight } from "./pages/tonight";
import { SkyMap } from "./pages/map";
import { DeepSky } from "./pages/deep-sky";
import { Constellations } from "./pages/constellations";
import { Moon } from "./pages/moon";
import { Equipment } from "./pages/equipment";
import { Exposure } from "./pages/exposure";
import { Comparison } from "./pages/compare";
import { Planner } from "./pages/planner";

export default function AstroApp({locale,view,id}:{locale:Locale;view:View;id?:string}) {
  useEffect(() => { document.documentElement.lang = locale === "en" ? "en" : "zh-Hant"; }, [locale]);
  switch(view){
    case "home":return <Home locale={locale}/>;
    case "tools":return <Tools locale={locale}/>;
    case "catalog":return <Catalog locale={locale}/>;
    case "object":return <ObjectPage locale={locale} id={id??""}/>;
    case "tonight":return <Tonight locale={locale}/>;
    case "map":return <SkyMap locale={locale}/>;
    case "deep-sky":return <DeepSky locale={locale}/>;
    case "constellations":return <Constellations locale={locale}/>;
    case "moon":return <Moon locale={locale}/>;
    case "equipment":return <Equipment locale={locale}/>;
    case "exposure":return <Exposure locale={locale}/>;
    case "compare":return <Comparison locale={locale}/>;
    case "planner":return <Planner locale={locale}/>;
  }
}
