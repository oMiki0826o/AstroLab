import Link from "next/link";
import ThemeToggle from "../components/theme-toggle";

export default function NotFound() {
  return <main className="app not-found astro-not-found"><div className="app-header"><div><span className="eyebrow">ASTROLAB / LOST SIGNAL</span><h1>這個目標不在星表裡。</h1><p className="muted">路徑沒有對應的天體或工具，先回到 AstroLab 重新搜尋。</p></div><ThemeToggle /></div><section className="panel not-found-panel"><span className="not-found-code">404</span><p>沒有訊號，不代表天空是空的。</p><Link className="button primary" href="/">回到 AstroLab</Link></section></main>;
}
