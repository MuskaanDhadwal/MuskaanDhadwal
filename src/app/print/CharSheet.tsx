// #/char — the character sheet: every small version of her, on blue and on paper.
// Internal reference for keeping the minis consistent (not linked from the nav).
import { Mini, POSES, type PoseName } from "./Minis";

const ALL = Object.keys(POSES) as PoseName[];
const H = Number(new URLSearchParams(location.search).get("h")) || 150; // ?h=300 for a closer look

export function CharSheet() {
  return (
    <>
      <section className="sheet" aria-labelledby="cs-title" style={{ ["--cs-h" as string]: `${H}px` }}>
        <h1 id="cs-title" className="display" style={{ fontSize: 64 }}>Character sheet</h1>
        <p className="label mid" style={{ margin: "8px 0 32px" }}>Muskaan, small · hatched bangs + bun · round glasses · stud earring · plain tee</p>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${H}px, 1fr))`, gap: 24 }}>
          {ALL.map(p => (
            <figure key={p} style={{ margin: 0, textAlign: "center" }}>
              <div style={{ height: "var(--cs-h, 150px)", display: "flex", justifyContent: "center" }}><Mini pose={p} label={p} style={{ maxWidth: "100%" }} /></div>
              <figcaption className="label">{p}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="sheet paper on-paper">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 24 }}>
          {ALL.slice(0, 12).map(p => <div key={p} style={{ height: 150, display: "flex", justifyContent: "center" }}><Mini pose={p} tone="paper" /></div>)}
        </div>
      </section>
    </>
  );
}
