import Link from "next/link";
import ThemeToggle from "../../../../components/theme-toggle";

const tools = [
  ["Sky Map", "Open the relative target map and select a point for its object page.", "/AstroLab/en/astro/map/"],
  ["Astro Catalog", "Search the shared Messier, NGC, IC and bright-star catalogue.", "/AstroLab/astro/"],
  ["Sky Tonight", "Estimate altitude, azimuth and a useful observation window.", "/AstroLab/astro/tonight/"],
  ["Deep Sky Finder", "Filter deep-sky targets by type, constellation and magnitude.", "/AstroLab/astro/deep-sky/"],
  ["Constellation Explorer", "Browse catalogue targets grouped by constellation.", "/AstroLab/astro/constellations/"],
  ["Moon Phase", "Use the approximate lunar phase when planning a session.", "/AstroLab/astro/moon/"],
  ["Equipment Planner", "Estimate a camera field of view from focal length and sensor size.", "/AstroLab/astro/equipment/"],
  ["Exposure Calculator", "Draft sub-exposure counts and total integration time.", "/AstroLab/astro/exposure/"],
  ["Target Comparison", "Compare two catalogue targets before a session.", "/AstroLab/astro/compare/"],
];

export default function EnglishToolsPage() {
  return <main className="app" lang="en"><div className="app-header"><div><Link className="back" href="/AstroLab/en/">← AstroLab</Link><h1>Observation tools</h1><p className="muted">Small planning tools around the shared AstroLab catalogue.</p></div><ThemeToggle /></div><section className="astro-tools-grid">{tools.map(([title, description, href], index) => <Link className="astro-tool-card" href={href} key={title}><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{description}</p><span className="arrow">Open tool →</span></Link>)}</section><p className="muted">The calculation pages currently keep their original Traditional Chinese labels; object data and this index are available in English.</p></main>;
}
