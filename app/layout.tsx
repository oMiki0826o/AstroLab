import type { Metadata } from "next";
import "./globals.css";
import "./astro-map.css";

export const metadata: Metadata = { title: "AstroLab", description: "以靜態資料整理常用深空天體、亮星與觀測提示。", manifest: "./manifest.webmanifest" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-Hant" suppressHydrationWarning><body><script dangerouslySetInnerHTML={{__html:`(()=>{const t=localStorage.getItem('astrolab.theme');const prefers=matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=t||(prefers?'dark':'light')})()`}} />{children}</body></html>; }
