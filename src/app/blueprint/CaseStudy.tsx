// Case study, deconstructed: an exploded drawing of the project.
// Click a numbered part (or use ← →) to open that component's story panel.
import { useEffect, useState, type CSSProperties } from "react";
import { MISSIONS, PHASE_KEYS, phases, type Mission } from "./data";
import { Exploded, Mini } from "./Ink";
import { go } from "./nav";

const STORY_POSE = ["wave", "think", "coffee", "type", "armsUp"] as const;

export function CaseStudy({ mission: m }: { mission: Mission }) {
  const ph = phases(m);
  const [i, setI] = useState(0);
  const [img, setImg] = useState(0);
  const idx = MISSIONS.indexOf(m);
  const next = MISSIONS[(idx + 1) % MISSIONS.length];
  const p = ph[i];

  const pick = (n: number) => { if (n >= 0 && n < ph.length) { setI(n); setImg(0); } };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowRight") pick(i + 1);
      if (e.key === "ArrowLeft") pick(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="sheet" aria-labelledby="case-title" style={{ maxWidth: 1320 }}>
      {/* top bar: back · part stepper · next */}
      <div className="case-top">
        <button className="btn" onClick={() => go("#/work")}>← all work</button>
        <div className="case-dots" role="tablist" aria-label="Parts of this case study">
          {ph.map((x, n) => (
            <button key={x.key} role="tab" aria-selected={n === i} onClick={() => pick(n)} className="case-dot"
              style={{ "--c": m.color } as CSSProperties}>
              <span>{x.num}</span><em>{x.key}</em>
            </button>
          ))}
        </div>
        <button className="btn" onClick={() => go(`#/case/${next.slug}`)}>next: {next.label.toLowerCase()} →</button>
      </div>

      <div className="case-grid">
        {/* left: title + big numbers (like a spec sheet) */}
        <aside>
          <div className="sheet-tag" style={{ marginBottom: 6 }}><span>case {m.num} · the design of</span></div>
          <h1 id="case-title" className="serif" style={{ fontSize: "clamp(40px, 4.4vw, 60px)", lineHeight: 0.95, margin: 0, color: m.color }}>{m.label}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", margin: "12px 0 22px" }}>{m.brief.split(". ")[0]}.</p>
          {m.stats.slice(0, 3).map(s => (
            <div key={s.label} style={{ borderTop: "1.5px solid var(--ink)", padding: "10px 0 14px" }}>
              <div className="serif" style={{ fontSize: "clamp(30px, 3.2vw, 46px)", lineHeight: 1 }}>{s.val}</div>
              <div className="label muted" style={{ fontSize: 10, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
          <div className="hand" style={{ fontSize: 20, color: "var(--blue)", marginTop: 8 }}>tip: click a numbered part, or use ← →</div>
        </aside>

        {/* centre: the exploded drawing */}
        <div className="panel grid-bg" style={{ padding: "8px 8px 0", minHeight: 560 }}>
          <span className="caption blue" style={{ position: "absolute", bottom: 10, left: 10, zIndex: 1 }}>fig. {m.num} — exploded view</span>
          <Exploded slug={m.slug} accent={m.color} active={i} onPick={pick} labels={PHASE_KEYS} />
        </div>

        {/* right: the story panel for the selected part */}
        <article key={`${m.slug}-${i}`} className="panel fade-up case-story" aria-live="polite">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, padding: "14px 16px 0" }}>
            <div>
              <span className="caption" style={{ background: m.color, color: "#fff", borderColor: m.color }}>{p.num} · {p.key}</span>
              <h2 className="serif" style={{ fontSize: 32, lineHeight: 1, margin: "10px 0 2px" }}>{p.title}</h2>
              <div className="hand" style={{ fontSize: 22, color: "var(--blue)" }}>— {p.caption}</div>
            </div>
            <div style={{ marginLeft: "auto" }}><Mini pose={STORY_POSE[i]} size={78} sleepy={i === 2} /></div>
          </div>

          {p.images.length > 0 && (
            <figure style={{ margin: "12px 16px 0" }}>
              <div className="panel" style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                <img src={p.images[img]} alt={`${m.label} — ${p.key.toLowerCase()} artifact ${img + 1}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
              {p.images.length > 1 && (
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {p.images.map((src, n) => (
                    <button key={src} onClick={() => setImg(n)} aria-label={`Show image ${n + 1}`} style={{ width: 48, height: 36, padding: 0, border: `2px solid ${n === img ? m.color : "var(--ink)"}`, opacity: n === img ? 1 : 0.6, background: "#fff", cursor: "pointer" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </figure>
          )}

          <div style={{ padding: "12px 16px 4px" }}>
            {p.paragraphs.map((t, n) => <p key={n} style={{ fontSize: 15, lineHeight: 1.65, margin: "0 0 12px" }}>{t}</p>)}
          </div>
          <dl style={{ margin: "0 16px 16px", borderTop: "1.5px solid var(--ink)" }}>
            {p.facts.map(f => (
              <div key={f.label} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10, padding: "8px 0", borderBottom: "1px dashed var(--ink-2)" }}>
                <dt className="label muted" style={{ fontSize: 10, paddingTop: 2 }}>{f.label}</dt>
                <dd style={{ margin: 0, fontSize: 14 }}>{f.val}</dd>
              </div>
            ))}
          </dl>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 16px 16px" }}>
            <button className="btn" onClick={() => pick(i - 1)} disabled={i === 0} style={{ opacity: i === 0 ? 0.35 : 1 }}>← {i > 0 ? ph[i - 1].key.toLowerCase() : ""}</button>
            {i < ph.length - 1
              ? <button className="btn primary" onClick={() => pick(i + 1)}>{ph[i + 1].key.toLowerCase()} →</button>
              : <button className="btn primary" onClick={() => go(`#/case/${next.slug}`)}>next case →</button>}
          </div>
        </article>
      </div>

      <style>{`
        .case-top { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
        .case-dots { flex: 1; display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; }
        .case-dot { display: flex; flex-direction: column; align-items: center; gap: 2px; background: none; border: 0; cursor: pointer; padding: 2px 8px; min-height: 44px; color: var(--ink); }
        .case-dot span { width: 34px; height: 34px; border-radius: 50%; border: 2px solid var(--ink); display: grid; place-items: center; font-family: var(--mono); font-size: 12px; transition: background .25s, color .25s; }
        .case-dot em { font-style: normal; font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
        .case-dot[aria-selected="true"] span { background: var(--c); border-color: var(--c); color: #fff; box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 25%, transparent); }
        .case-grid { display: grid; gap: 16px; grid-template-columns: 250px minmax(0, 1fr) 400px; align-items: start; }
        .case-story { max-height: calc(100vh - 150px); overflow-y: auto; position: sticky; top: 76px; }
        @media (max-width: 1100px) { .case-grid { grid-template-columns: 1fr 1fr; } .case-grid aside { grid-column: 1 / -1; } }
        @media (max-width: 760px) { .case-grid { grid-template-columns: 1fr; } .case-story { max-height: none; position: static; } }
      `}</style>
    </section>
  );
}
