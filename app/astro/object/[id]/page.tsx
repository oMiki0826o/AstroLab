/*
 * File: page.tsx
 * Modification: 2026-10-11 - Unique static object routes.
 */
import AstroApp from "@/components/astro-app";
import { catalog } from "@/lib/catalog";
import { notFound } from "next/navigation";
export function generateStaticParams() { return catalog.map(item => ({ id: item.id })); }
export default async function ObjectPage({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  if (!catalog.some(item => item.id === id)) notFound();
  return <AstroApp locale="zh-TW" view="object" id={id}/>;
}
