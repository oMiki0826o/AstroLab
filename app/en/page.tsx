import Link from "next/link";
import ThemeToggle from "../../components/theme-toggle";

const tools = [
  ["Astro Catalog", "Search Messier, NGC, IC objects and bright stars.", "/AstroLab/astro/"],
  ["Sky Tonight", "Estimate altitude and azimuth for a target.", "/AstroLab/astro/tonight/"],
  ["Deep Sky Finder", "Filter targets by type, constellation and magnitude.", "/AstroLab/astro/deep-sky/"],
  ["Exposure Calculator", "Draft sub-exposures and total integration time.", "/AstroLab/astro/exposure/"],
];

export default function EnglishAstroLab() {
  return <main className="app" lang="en"><div className="app-header"><div><span className="eyebrow">ASTROLAB</span><h1>AstroLab</h1><p className="muted">A small static catalogue for finding stars, deep-sky objects and planning observations.</p></div><ThemeToggle /></div><section className="astro-tools-grid">{tools.map(([title, description, href], index) => <Link className="astro-tool-card" href={href} key={title}><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{description}</p><span className="arrow">Open tool →</span></Link>)}</section><p className="muted"><Link href="/AstroLab/">使用繁體中文</Link></p></main>;
}
