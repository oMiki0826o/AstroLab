import Link from "next/link";
import ThemeToggle from "../components/theme-toggle";

const tools = [
  ["Astro Catalog", "搜尋 Messier、NGC、IC 與常用亮星。", "/astro/"],
  ["Astro Tools", "把觀測、拍攝與器材規劃集中在一起。", "/astro/tools/"],
  ["Sky Tonight", "估算目標目前的高度角與方位角。", "/astro/tonight/"],
  ["Deep Sky Finder", "依類型、星座與視星等篩選深空目標。", "/astro/deep-sky/"],
  ["Moon Phase Explorer", "查看月齡與照明比例，避開月光干擾。", "/astro/moon/"],
  ["Equipment Planner", "用焦段與相機尺寸估算拍攝視野。", "/astro/equipment/"],
  ["Exposure Calculator", "整理濾鏡、子曝光與總整合時間。", "/astro/exposure/"],
];

export default function AstroLabHome() {
  return <main className="app"><div className="app-header"><div><span className="eyebrow">ASTROLAB · OBSERVATION NOTES</span><h1>AstroLab</h1><p className="muted">先找到想看的天體，再決定今晚怎麼看、怎麼拍。</p></div><ThemeToggle/></div><section className="astro-tools-grid" aria-label="AstroLab tools">{tools.map(([title, description, href], index) => <Link className="astro-tool-card" href={href} key={title}><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{description}</p><span className="arrow">開啟工具 →</span></Link>)}</section><footer className="muted">資料是觀測規劃用的整理值，實際觀測請搭配星圖與當地星曆。</footer></main>;
}
