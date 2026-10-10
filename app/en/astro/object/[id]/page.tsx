import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeToggle from "../../../../../components/theme-toggle";
import { catalog } from "../../../../../lib/astro";

export function generateStaticParams() {
  return catalog.map((item) => ({ id: item.id }));
}

export default async function EnglishAstroObject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = catalog.find((entry) => entry.id === id);
  if (!item) notFound();

  return (
    <main className="app" lang="en">
      <div className="app-header">
        <div>
          <Link className="back" href="/AstroLab/en/">← AstroLab</Link>
          <span className="tag">{item.type}</span>
          <h1>{item.name}</h1>
          <p className="muted">Catalogue note: {item.note}</p>
        </div>
        <ThemeToggle />
      </div>
      <section className="panel object-detail">
        {item.indexOnly && <p className="catalog-status">This is an index entry. Coordinates and observing details still need to be checked against a professional catalogue.</p>}
        <dl className="astro-detail-grid">
          <div><dt>Status</dt><dd>{item.dataStatus === "complete" ? "Curated" : "Index entry"}</dd></div>
          <div><dt>Source</dt><dd>{item.source ?? "AstroLab catalogue"}</dd></div>
          <div><dt>Aliases</dt><dd>{item.aliases.join(", ")}</dd></div>
          <div><dt>Constellation</dt><dd>{item.constellation}</dd></div>
          <div><dt>Right ascension</dt><dd>{item.ra}</dd></div>
          <div><dt>Declination</dt><dd>{item.dec}</dd></div>
          <div><dt>Magnitude</dt><dd>{item.indexOnly ? "Not yet curated" : item.magnitude}</dd></div>
          <div><dt>Angular size</dt><dd>{item.indexOnly ? "Not yet curated" : item.angularSize}</dd></div>
          <div><dt>Distance</dt><dd>{item.indexOnly ? "Not yet curated" : item.distance}</dd></div>
          <div><dt>Nearby stars</dt><dd>{item.nearbyStars?.join(", ") || "Not yet curated"}</dd></div>
        </dl>
        <div className="object-note"><h2>How to find it</h2><p>{item.searchGuide || "Use the constellation and coordinates to locate this target on a star chart."}</p><h2>Observation note</h2><p>{item.note}</p></div>
        <div className="actions"><Link className="button primary" href={`/AstroLab/en/astro/tonight/?target=${item.id}`}>Open tonight planner</Link><Link className="button" href="/AstroLab/en/astro/">Back to catalogue</Link></div>
      </section>
    </main>
  );
}
