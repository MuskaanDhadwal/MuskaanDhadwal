// About — a "crossed wires" comic page: the inside of a designer-engineer's head.
import { BIO, SIDE_LIFE, SKILLS, TIMELINE, TOOLS } from "./data";
import { BLUE, INK, Mini, PAPER } from "./Ink";
import { go } from "./nav";

const line = { stroke: INK, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Tangled thought-wires spilling out of her head. */
function Wires() {
  const loops = Array.from({ length: 9 }, (_, k) => {
    const x = 60 + (k % 3) * 95 + (k % 2) * 20, y = 40 + Math.floor(k / 3) * 60;
    return `M${x} ${y} c40 -50 90 10 60 40 s-80 30 -60 -10 s70 -40 90 0`;
  });
  return (
    <svg viewBox="0 0 400 260" style={{ width: "100%", height: "100%" }} aria-hidden>
      <g filter="url(#wobble)">
        {loops.map((d, k) => <path key={k} d={d} {...line} strokeWidth={k % 3 === 0 ? 2.6 : 1.5} />)}
        <path d="M190 258 C170 200 120 210 140 160 S230 120 250 80 M200 258 C230 210 290 230 280 170 S180 120 160 70 M210 258 C200 180 330 150 300 100" {...line} strokeWidth="2.2" />
        {[["figma", 70, 40], ["kotlin", 300, 52], ["users!!", 180, 110], ["why?", 330, 170], ["edge cases", 60, 170]].map(([t, x, y]) => (
          <text key={t as string} x={x as number} y={y as number} fontFamily="Caveat, cursive" fontSize="22" fill={BLUE}>{t}</text>
        ))}
      </g>
    </svg>
  );
}

function Doodle({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 120 80" style={{ width: "100%", height: 74 }} aria-hidden>
      <g filter="url(#wobble)" {...line}>
        {kind === "chef" && <><path d="M20 44 h80 q-6 28 -40 28 t-40 -28z" fill="#fff" /><path d="M70 40 l26 -30" strokeWidth="3" /><path d="M92 6 q8 -4 10 4 t-8 8" /><path d="M36 30 q4 -10 0 -18 M50 30 q4 -10 0 -18" strokeWidth="1.2" /></>}
        {kind === "boxes" && <><rect x="14" y="40" width="40" height="32" fill="#fff" /><rect x="58" y="40" width="40" height="32" fill="#fff" /><rect x="36" y="8" width="40" height="32" fill="#fff" /><text x="56" y="28" fontSize="9" fontFamily="Space Mono" textAnchor="middle" fill={INK} stroke="none">MISC?</text><text x="34" y="60" fontSize="8" fontFamily="Space Mono" textAnchor="middle" fill={INK} stroke="none">A–M</text><text x="78" y="60" fontSize="8" fontFamily="Space Mono" textAnchor="middle" fill={INK} stroke="none">N–Z</text></>}
        {kind === "movie" && <><path d="M10 22 h100 v12 a6 6 0 0 0 0 12 v12 h-100 v-12 a6 6 0 0 0 0 -12 z" fill="#fff" /><path d="M36 22 v36" strokeDasharray="3 3" /><text x="72" y="44" fontSize="13" fontFamily="DM Serif Display, serif" textAnchor="middle" fill={INK} stroke="none">CATS (2019)</text><text x="22" y="44" fontSize="9" textAnchor="middle" fill={INK} stroke="none">★★★</text></>}
        {kind === "plant" && <><path d="M44 50 h32 l-4 26 h-24 z" fill="#fff" /><path d="M60 50 C54 30 50 20 52 4 C58 20 62 34 60 50 M60 50 C66 32 72 20 80 10 C76 26 70 40 60 50 M60 50 C50 38 40 30 34 18 C46 26 54 36 60 50" fill={PAPER} /><text x="96" y="66" fontFamily="Caveat, cursive" fontSize="16" fill={BLUE} stroke="none">gerald</text></>}
      </g>
    </svg>
  );
}

/** Origin story: walking down a pier toward the horizon. */
function Pier() {
  return (
    <svg viewBox="0 0 260 220" style={{ width: "100%", height: 220 }} aria-hidden>
      <g filter="url(#wobble)" {...line}>
        <circle cx="70" cy="40" r="12" /><path d="M170 50 q6 -12 18 -6 q8 -10 18 0 q10 0 8 10 h-46 z" fill="#fff" />
        <path d="M0 110 H260" strokeWidth="2" />
        <path d="M110 110 L40 220 M150 110 L220 220" strokeWidth="2" />
        {[130, 150, 172, 196].map((y, k) => <path key={y} d={`M${110 - (y - 110) * 0.64} ${y} H${150 + (y - 110) * 0.64}`} strokeWidth={1 + k * 0.2} />)}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(k => <path key={k} d={`M${10 + k * 30} ${125 + (k % 3) * 12} h14`} strokeWidth="1" opacity="0.5" />)}
      </g>
      <foreignObject x="112" y="64" width="40" height="56"><Mini pose="walk" size={52} /></foreignObject>
    </svg>
  );
}

/** Flat-lay of her everyday kit, each item labelled. */
function FlatLay() {
  const T = (x: number, y: number, t: string) => <text x={x} y={y} fontFamily="Caveat, cursive" fontSize="17" fill={BLUE} stroke="none" textAnchor="middle">{t}</text>;
  return (
    <svg viewBox="0 0 520 250" style={{ width: "100%", height: "auto" }} role="img" aria-label={`Tools: ${TOOLS.design}; ${TOOLS.build}; ${TOOLS.research}`}>
      <g filter="url(#wobble)" {...line}>
        <rect x="16" y="20" width="110" height="150" rx="4" fill="#fff" /><rect x="40" y="36" width="62" height="20" /><text x="71" y="50" fontSize="11" fontFamily="Space Mono" textAnchor="middle" fill={INK} stroke="none">SKETCH</text><path d="M16 30 h-6 M16 60 h-6 M16 90 h-6 M16 120 h-6 M16 150 h-6" />{T(71, 192, "sketchbook (sacred)")}
        <rect x="150" y="30" width="160" height="104" rx="8" fill="#fff" /><rect x="160" y="40" width="140" height="84" /><path d="M170 50 h40 v30 h-40z M220 50 h70 M220 62 h50 M220 74 h60" strokeWidth="1.2" /><path d="M136 140 h188 l-10 10 h-168z" fill="#fff" />{T(230, 172, "figma, always open")}
        <rect x="340" y="24" width="56" height="100" rx="10" fill="#fff" /><rect x="346" y="36" width="44" height="74" /><text x="368" y="78" fontSize="10" fontFamily="Space Mono" textAnchor="middle" fill={INK} stroke="none">.kt</text>{T(368, 142, "android test phone")}
        <rect x="420" y="40" width="44" height="50" rx="6" fill="#fff" /><path d="M464 52 q16 0 16 13 t-16 13" /><path d="M432 30 q4 -8 0 -14 M448 30 q4 -8 0 -14" strokeWidth="1.2" />{T(450, 112, "coffee #3")}
        <rect x="150" y="190" width="54" height="46" fill="#F4C430" /><rect x="214" y="196" width="54" height="40" fill="#DCE4F5" /><text x="177" y="216" fontSize="11" fontFamily="Caveat" textAnchor="middle" fill={INK} stroke="none">HMW…?</text>{T(275, 248, "miro stickies")}
        <path d="M380 220 q0 -26 26 -26 q10 -16 24 -4 q14 -2 12 12 l12 -2 -10 10 q4 20 -22 22 h-30 q-12 0 -12 -12z" fill="#F4C430" /><circle cx="426" cy="200" r="2" fill={INK} />{T(430, 248, "rubber duck (senior dev)")}
      </g>
    </svg>
  );
}

export function About() {
  return (
    <section className="sheet" aria-labelledby="about-title">
      <div className="sheet-tag"><span id="about-title">crossed wires: about muskaan</span><span>page 02</span></div>
      <div className="about-grid">
        {/* big panel: head full of wires */}
        <div className="panel tint" style={{ gridArea: "head", minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "12px 12px 0" }}>
          <div style={{ width: "100%", flex: 1, minHeight: 240 }}><Wires /></div>
          <div style={{ marginTop: -18 }}><Mini pose="think" size={170} /></div>
          <div className="caption" style={{ position: "absolute", right: 14, bottom: 14 }}>ux engineer<br />designer who codes<br />systems thinker</div>
          <div className="panel ink" aria-hidden style={{ position: "absolute", left: 18, bottom: 18, width: 40, height: 90 }} />
        </div>

        {/* side column: life outside the screen */}
        <div style={{ gridArea: "life", display: "flex", flexDirection: "column", gap: 6 }}>
          {SIDE_LIFE.map((s, k) => (
            <div key={s.key} style={{ display: "contents" }}>
              <div className="panel" style={{ padding: "6px 10px 10px" }}>
                <Doodle kind={s.key} />
                <div className="label" style={{ fontSize: 10 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.35 }}>{s.text}</div>
              </div>
              {k < SIDE_LIFE.length - 1 && <div className="arrow-down" aria-hidden>↓</div>}
            </div>
          ))}
        </div>

        {/* origin story */}
        <div className="panel" style={{ gridArea: "pier", padding: 0 }}>
          <Pier />
          <div style={{ padding: "4px 16px 16px" }}>
            <span className="caption">origin story</span>
            {BIO.map((b, k) => <p key={k} style={{ fontSize: 15, lineHeight: 1.6, margin: "10px 0 0" }}>{b}</p>)}
          </div>
        </div>

        {/* everyday kit */}
        <div className="panel grid-bg" style={{ gridArea: "kit", padding: "12px 12px 8px" }}>
          <span className="caption">the kit</span>
          <FlatLay />
          <div className="mono" style={{ fontSize: 12, lineHeight: 1.7, color: "var(--ink-2)" }}>
            design — {TOOLS.design}<br />build — {TOOLS.build}<br />research — {TOOLS.research}
          </div>
        </div>

        {/* quest log strip */}
        <div className="panel ink" style={{ gridArea: "log", padding: "16px 18px" }}>
          <div className="label" style={{ color: "#FFFFFFAA", marginBottom: 12 }}>quest log</div>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {TIMELINE.map(t => (
              <li key={t.co} style={{ borderLeft: "2px solid #FFFFFF55", paddingLeft: 12 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--yellow)" }}>{t.year}</div>
                <div className="serif" style={{ fontSize: 22, lineHeight: 1.1, margin: "4px 0" }}>{t.role}</div>
                <div className="hand" style={{ fontSize: 20, color: "#FFFFFFCC" }}>@ {t.co}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: "#FFFFFFBB", marginTop: 4 }}>{t.desc}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* skills gauge */}
        <div className="panel tint" style={{ gridArea: "skills", padding: "14px 18px", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span className="caption">spec sheet</span>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "8px 28px" }}>
            {SKILLS.map(s => (
              <div key={s.name} style={{ display: "grid", gridTemplateColumns: "150px 1fr 30px", alignItems: "center", gap: 10, fontSize: 14 }}>
                <span>{s.name}</span>
                <span style={{ height: 10, border: "1.5px solid var(--ink)", background: `linear-gradient(90deg, var(--blue) ${s.pct}%, transparent ${s.pct}%)` }} />
                <span className="mono" style={{ fontSize: 12 }}>{s.pct}</span>
              </div>
            ))}
          </div>
          <button className="btn primary" onClick={() => go("#/contact")}>say hi →</button>
        </div>
      </div>
      <style>{`
        .about-grid { display: grid; gap: 14px; grid-template-columns: 1fr 1fr 240px;
          grid-template-areas: "head head life" "pier kit life" "log log log" "skills skills skills"; }
        @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; grid-template-areas: "head" "life" "pier" "kit" "log" "skills"; } }
      `}</style>
    </section>
  );
}
