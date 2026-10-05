// "crossed wires: layer 01" — the about-me comic page. Uneven panel grid on the blueprint:
// big panel (her own illustration) · column of small task boxes with ↓ arrows · a story path ·
// a labelled flat-lay of her kit · a dark band · a closing caption strip.
import { useEffect, useRef, useState } from "react";
import { Figure } from "./Character";
import { Strip } from "./Strip";
import { BEATS, PARTS } from "./story";
import { Chamfer, Draw, useInView, useReducedMotion } from "./ui";
import { go } from "./nav";

function BigPanel() {
  return (
    <div className="cw-panel cw-big">
      <img src="/art/muskaan-desk-white.png" alt="Muskaan's own illustration of herself: round glasses, blunt bangs and a bun, leaning in close to a laptop marked M, mug that says UX is my passion." />
      <div className="cw-caption">ux engineer<br />designs it<br />builds it<br />(then fixes the padding)</div>
    </div>
  );
}

/** Story path: tiny her walks between four milestones. Prev/next, or it walks as you scroll. */
function StoryPath() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, true);
  const [i, setI] = useState(0);
  const [boil, setBoil] = useState(0);
  useEffect(() => { if (reduced) return; const id = setInterval(() => setBoil(b => b + 1), 125); return () => clearInterval(id); }, [reduced]);
  useEffect(() => { // first time it scrolls into view, walk through the beats once
    if (!seen || reduced) return;
    let n = 0; const id = setInterval(() => { n++; setI(n); if (n >= BEATS.length - 1) clearInterval(id); }, 1100);
    return () => clearInterval(id);
  }, [seen, reduced]);
  const posts = [[34, 150], [96, 110], [160, 128], [222, 88]];
  const [x, y] = posts[i];
  return (
    <div ref={ref} className="cw-panel cw-path">
      <svg viewBox="0 0 260 190" className="scene" role="img" aria-label="A path with four milestones; a small Muskaan walks along it.">
        <circle cx="210" cy="30" r="12" className="bp" />
        <path d="M120 40 q6 -12 18 -6 q8 -10 18 0 q10 0 8 10 h-46 z" className="bp fill" />
        <path d={`M10 170 C40 140 70 120 96 ${posts[1][1] + 30} S150 150 160 ${posts[2][1] + 30} S210 110 250 ${posts[3][1] + 20}`} className="bp" strokeDasharray="5 5" />
        {posts.map(([px, py], k) => (
          <g key={k} className="bp">
            <path d={`M${px} ${py + 32} v-22`} /><rect x={px - 13} y={py} width="26" height="12" className="fill" />
            <text x={px} y={py + 9} fontSize="8" textAnchor="middle" className="bp-text">{BEATS[k].when.split("–")[0].split(" ")[0]}</text>
          </g>
        ))}
        <g style={{ transform: `translate(${x - 16}px, ${y - 20}px)`, transition: "transform var(--dur-scene) var(--ease-out)" }}>
          <svg width="34" height="40" viewBox="-20 -10 240 260" overflow="visible"><Figure pose={i === BEATS.length - 1 ? "wave" : "walk"} boil={boil} /></svg>
        </g>
      </svg>
      <div className="cw-beat" aria-live="polite">
        <span className="label">{BEATS[i].when}</span>
        <span className="hand" style={{ fontSize: 20, lineHeight: 1.15 }}>{BEATS[i].text}</span>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 10px 10px" }}>
        <Chamfer onClick={() => setI(v => Math.max(0, v - 1))} ariaLabel="Previous milestone">←</Chamfer>
        <Chamfer onClick={() => setI(v => Math.min(BEATS.length - 1, v + 1))} ariaLabel="Next milestone">→</Chamfer>
        <span className="label" style={{ alignSelf: "center" }}>{i + 1}/{BEATS.length}</span>
      </div>
    </div>
  );
}

/** Flat-lay of the kit: precise line objects, each labelled — the parts list as a drawing. */
function FlatLay() {
  const L = (x: number, y: number, t: string) => <text x={x} y={y} fontSize="9" textAnchor="middle" className="bp-text" style={{ textTransform: "uppercase" }}>{t}</text>;
  const [figma, , kotlin, ai, miro, research, code, notion] = PARTS.map(p => p.name);
  return (
    <div className="cw-panel cw-lay">
      <Draw viewBox="0 0 520 250" className="bp" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label={`My kit: ${PARTS.map(p => p.name).join(", ")}`}>
        <rect x="18" y="18" width="88" height="120" rx="3" className="fill" /><rect x="36" y="32" width="52" height="18" /><text x="62" y="45" fontSize="10" textAnchor="middle" className="bp-text">SKETCH</text>
        <path d="M18 28 h-6 M18 52 h-6 M18 76 h-6 M18 100 h-6 M18 124 h-6" />{L(62, 156, "sketchbook")}
        <rect x="130" y="22" width="150" height="96" rx="6" className="fill" /><text x="205" y="80" fontSize="30" fontWeight="700" textAnchor="middle" className="bp-text" style={{ fontFamily: "var(--body)" }}>M</text><path d="M118 128 h174 l-8 8 h-158 z" className="fill" />{L(205, 156, figma)}
        <rect x="310" y="20" width="50" height="94" rx="9" className="fill" /><rect x="316" y="32" width="38" height="68" /><text x="335" y="70" fontSize="11" textAnchor="middle" className="bp-text">.kt</text>{L(335, 130, "Android · Kotlin")}
        <path d="M410 22 v18 M410 64 v18 M380 52 h18 M422 52 h18 M392 34 l10 10 M418 60 l10 10" />{L(410, 104, ai)}
        <rect x="462" y="22" width="44" height="40" className="fill" /><path d="M496 62 l10 -10" /><text x="484" y="46" fontSize="10" textAnchor="middle" className="bp-text" style={{ fontFamily: "var(--hand)" }}>HMW?</text>{L(484, 80, miro)}
        <circle cx="62" cy="200" r="18" /><path d="M75 213 l16 16" strokeWidth="3" />{L(62, 244, "Maze · Dovetail")}
        <rect x="140" y="178" width="96" height="50" className="fill" /><text x="188" y="210" fontSize="16" textAnchor="middle" className="bp-text">&lt;/&gt;</text>{L(188, 244, "HTML/CSS/JS")}
        <rect x="262" y="174" width="70" height="56" className="fill" /><path d="M272 188 h50 M272 200 h40 M272 212 h46" />{L(300, 244, "Notion")}
        <path d="M368 200 h40 l-4 40 h-32 z" className="fill" /><path d="M408 208 q12 0 12 10 t-14 10" />{L(390, 196 - 8, "mug, refillable")}
        <path d="M440 228 q0 -26 26 -26 q10 -16 24 -4 q14 -2 12 12 l12 -2 -10 10 q4 20 -22 22 h-30 q-12 0 -12 -12z" className="fill" /><circle cx="484" cy="208" r="2" className="solid" />{L(470, 246, "duck · senior dev")}
      </Draw>
    </div>
  );
}

export function ComicPage() {
  return (
    <section id="about" className="sheet" aria-labelledby="cw-title" style={{ scrollMarginTop: 60 }}>
      <div className="rail" aria-hidden><span className="rail-label">01. About · layer 01</span><span className="rail-line" /></div>
      <div className="sheet-no label" aria-hidden>SHEET 01/04</div>
      <h2 id="cw-title" className="label" style={{ margin: "0 0 14px" }}>crossed wires: layer 01 — a day in the life</h2>
      <Strip render={(p, done) => (
        <div className="cw-grid">
          <div style={{ gridArea: "big" }}><BigPanel /></div>
          <div className="cw-side" style={{ gridArea: "side" }}>
            {p[0]}<span className="cw-arrow" aria-hidden>↓</span>{p[1]}<span className="cw-arrow" aria-hidden>↓</span>{p[2]}
          </div>
          <div style={{ gridArea: "path" }}><StoryPath /></div>
          <div style={{ gridArea: "lay" }}><FlatLay /></div>
          <div className="cw-panel cw-dark" style={{ gridArea: "dark" }}>
            <div className="cw-dark-text">
              <span className="label">16:00 → 23:00</span>
              <span className="display" style={{ fontSize: "clamp(32px, 4vw, 54px)" }}>ship it.<br />then sleep.</span>
              <span className="label" aria-live="polite">{done}/5 tasks done{done === 5 ? " — productive day ✓" : ""}</span>
            </div>
            {p[3]}{p[4]}
          </div>
          <div className="cw-panel cw-foot" style={{ gridArea: "foot" }}>
            <span className="label" style={{ lineHeight: 1.7 }}>sketch.<br />build.<br />test.<br />ship.</span>
            <Chamfer onClick={() => go("#/work")}>See the prints →</Chamfer>
          </div>
        </div>
      )} />
    </section>
  );
}
