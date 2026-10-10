import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "AstroLab", description: "以靜態資料整理常用深空天體、亮星與觀測提示。", manifest: "./manifest.webmanifest" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-Hant"><body>{children}</body></html>; }
