/*
 * File: not-found.tsx
 * Modification: 2026-10-11 - Friendly route fallback.
 */
import Link from "next/link";
export default function NotFound() { return <main className="container"><div className="heading"><h1>404 · Not Found</h1><p>這個頁面不存在，或尚未收錄。 / This page does not exist.</p><Link className="button" href="/">← AstroLab</Link></div></main>; }
