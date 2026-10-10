/*
 * File: layout.tsx
 * Modification: 2026-10-11 - Accessible page metadata and theme bootstrapping.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AstroLab", template: "%s · AstroLab" },
  description: "A bilingual, static astronomy catalogue and observation planning toolkit.",
  applicationName: "AstroLab",
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/manifest.webmanifest`,
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant" suppressHydrationWarning><head><meta name="color-scheme" content="light dark"/></head><body><script dangerouslySetInnerHTML={{ __html: `(()=>{try{const s=localStorage.getItem('astrolab.theme');let t=['light','dark','red'].includes(s)?s:(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();` }} />{children}</body></html>;
}
