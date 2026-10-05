// PLAY — the fun leftovers (mailbag + side quests).
import { Character } from "./Character";
import { LINKS, MISSIONS, PRINT, SIDE_QUESTS, TRANSMISSIONS, ARCHIVED_PROJECTS } from "./story";
import { Chamfer, Dim, Sheet, SpecTable, Stamp } from "./ui";
import { go } from "./nav";

export function Play() {
  return (
    <>
      <Sheet rail="Play · mailbag" no="P/01" labelledBy="play-title" title={[["Contents", "Fan mail"], ["Rev", "2026.10"]]}>
        <h1 id="play-title" className="display" style={{ fontSize: "clamp(56px, 8vw, 104px)" }}>The mailbag</h1>
        <p className="mid label" style={{ margin: "8px 0 40px" }}>Things people have actually said to me. Probably.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40, alignItems: "start" }}>
          {TRANSMISSIONS.map((t, i) => (
            <figure key={t.sender} style={{ margin: 0, transform: `rotate(${[-2, 1.5, -1, 2][i]}deg)` }}>
              <blockquote className="hand" style={{ position: "relative", margin: 0, background: "#fff", color: "var(--blueprint-dk)", borderRadius: 18, padding: "14px 18px", fontSize: 21, lineHeight: 1.2 }}>
                {t.text.replace(/^"|"$/g, "")}
              </blockquote>
              <figcaption className="label" style={{ marginTop: 12 }}>— {t.sender} · <span style={{ color: "var(--accent)" }}>{t.status}</span></figcaption>
            </figure>
          ))}
        </div>
      </Sheet>
      <Sheet rail="Play · side quests" no="P/02" tone="paper" labelledBy="sq-title">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <h2 id="sq-title" className="display" style={{ fontSize: "clamp(48px, 6vw, 84px)" }}>Side quests</h2>
          <Character pose="sign" alt="Muskaan holding up a sign" height={200} tone="paper" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginTop: 24 }}>
          {[{ title: ARCHIVED_PROJECTS[0].label, org: "SI 699 capstone", year: "2024", desc: "0→1 sustainable-transport app: 87-response survey, carpooling with a women-only filter, incentive system." }, ...SIDE_QUESTS].map(q => (
            <div key={q.title} className="paper-panel" style={{ padding: 18, background: "#fff" }}>
              <div className="label">{q.org} · {q.year}</div>
              <div className="display" style={{ fontSize: 28, margin: "6px 0" }}>{q.title}</div>
              <p style={{ margin: 0 }}>{q.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 32 }}><Stamp>more on request</Stamp></p>
        <p><Chamfer onClick={() => go("#/char")}>Meet the character sheet →</Chamfer></p>
      </Sheet>
    </>
  );
}
