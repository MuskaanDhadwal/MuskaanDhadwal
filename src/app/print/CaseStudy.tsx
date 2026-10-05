// ENGINEERING CASE STUDY — blue throughout. Hero = exploded drawing that doubles as the table of contents.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Exploded, cardPct } from "./Exploded";
import { Mini, type PoseName } from "./Minis";
import { BRIEFS, MISSIONS, PRINT, sectionText, type Brief } from "./story";
import type { Mission } from "../blueprint/data";
import { Callout, Chamfer, Dim, Specimen, SpecTable, Stamp, TitleBlock, useInView, useReducedMotion } from "./ui";
import { go } from "./nav";
import { TruckDrawing, type TruckView } from "./TruckDrawings";
import { TxBuild, TxBuildWide, TxDefine, TxDefineWide, TxDesign, TxDesignWide, TxImpactWide, TxOverview, TxOverviewWide, TxResearch, TxResearchWide } from "./TraxenCase";
import { BmDefine, BmDefineWide, BmDesign, BmDesignWide, BmHandoff, BmHandoffWide, BmImpact, BmImpactWide, BmOverview, BmOverviewWide, BmResearch, BmResearchWide } from "./BuyMySpotCase";
import { ParkingDrawing, type ParkingView } from "./ParkingDrawings";
import { CarDrawing, type CarView } from "./CarDrawings";
import { RobotDrawing, type RobotView } from "./RobotDrawings";
import { GC_VIDEO, GcBuild, GcBuildWide, GcDefine, GcDefineWide, GcDesign, GcDesignWide, GcImpact, GcImpactWide, GcOverview, GcOverviewWide, GcResearch, GcResearchWide } from "./GcCase";
import { GmDefine, GmDefineWide, GmDesign, GmDesignWide, GmOutcome, GmOutcomeWide, GmOverview, GmOverviewWide, GmResearch, GmResearchWide, GmSystem, GmSystemWide } from "./GmCase";

const SECTIONS = ["Overview", "Research", "Define", "Design", "Build", "Impact"];
// a designer's "build" is the handoff; anchors keep the shared ids
// (a design proposal's "build" is its system, and its "impact" is what the proposal adds up to)
const sectionName = (slug: string, k: number) => (slug === "buymyspot" && k === 4 ? "Handoff" : slug === "gm" && k === 4 ? "System" : slug === "gm" && k === 5 ? "Outcome" : SECTIONS[k]);
const anchor = (slug: string, k: number) => `${slug}-${SECTIONS[k].toLowerCase()}`;
const scrollToSection = (slug: string, k: number) => document.getElementById(anchor(slug, k))?.scrollIntoView({ behavior: "smooth" });

// ── small pieces ────────────────────────────────────────────────────────────
// One small her per sheet, and a different set per case study, so no pose repeats across the project.
const CAMEOS: Record<string, { hero: PoseName; poses: [PoseName, string][] }> = {
  traxen: { hero: "csSign", poses: [["csNotes", "Muskaan taking notes on a clipboard"], ["csTape", "Muskaan measuring with a tape"], ["csWrench", "Muskaan tightening a bolt"], ["csThumbs", "Muskaan giving a thumbs-up"]] },
  buymyspot: { hero: "csPoint", poses: [["csMagnify", "Muskaan looking through a magnifying glass"], ["csPencil", "Muskaan drawing with a giant pencil"], ["csBox", "Muskaan carrying a box of parts"], ["csFlag", "Muskaan planting a flag"]] },
  gm: { hero: "gmWheel", poses: [] },
  guardiancare: { hero: "csHeart", poses: [["csBinoc", "Muskaan looking through binoculars"], ["csCheck", "Muskaan ticking off a checklist"], ["csLaptop", "Muskaan typing on a laptop"], ["csTrophy", "Muskaan holding up a trophy"]] },
};
const cameoFor = (slug: string, n: number) => (CAMEOS[slug] ?? CAMEOS.traxen).poses[n];

function Cameo({ pose, alt }: { pose: PoseName; alt: string }) {
  return <div style={{ height: 120 }}><Mini pose={pose} label={alt} unit={1.3} className="pop" /></div>;
}

function SheetSection({ m, brief, k, children, cameo, wide, plain, bg, pbg, cbg, rbg }: { m: Mission; brief: Brief; k: number; children: ReactNode; cameo?: [PoseName, string]; wide?: ReactNode; plain?: boolean; bg?: [TruckView, "left" | "right"]; pbg?: ParkingView; cbg?: CarView; rbg?: RobotView }) {
  const label = k === 0 ? "the whole object" : `part 0${k + 1} · ${brief.layers[k - 1].part}`;
  return (
    <section id={anchor(m.slug, k)} className={`sheet ${bg || pbg || cbg || rbg ? "tx-has-bg" : ""}`} style={{ minHeight: 0, scrollMarginTop: 60 }} aria-labelledby={`${anchor(m.slug, k)}-h`}>
      {bg && <TruckDrawing view={bg[0]} side={bg[1]} />}
      {pbg && <ParkingDrawing view={pbg} />}
      {cbg && <CarDrawing view={cbg} />}
      {rbg && <RobotDrawing view={rbg} />}
      <div className="rail" aria-hidden><span className="rail-label">{brief.code} · Sheet 0{k + 1}</span><span className="rail-line" /></div>
      <div className="sheet-no label" aria-hidden>SHEET 0{k + 1}/06</div>
      {plain ? (
        // no repeated exploded crop: the drawing appears once, in the hero
        <div className="tx-sheet-head">
          <div className="display tx-sheet-no" aria-hidden>0{k + 1}</div>
          <div>
            <div className="label mid">{label}</div>
            <h2 id={`${anchor(m.slug, k)}-h`} className="display" style={{ fontSize: "clamp(48px, 6vw, 80px)", margin: "8px 0 20px" }}>{sectionName(m.slug, k)}</h2>
            {children}
          </div>
        </div>
      ) : (
      <div className="cs-grid">
        <div>
          {/* zoomed crop of the part this section hangs off, in a white Loop-style panel */}
          <div className="paper-panel crop-panel" style={{ aspectRatio: "4 / 3", position: "relative" }}>
            <div className="scene tone-paper" style={{ position: "absolute", inset: 12 }}>
              <Exploded slug={m.slug} brief={brief} focusLayer={k === 0 ? undefined : k - 1} assembled={k === 0} />
            </div>
          </div>
          <div className="display" style={{ fontStyle: "italic", fontSize: 96, marginTop: 10 }}>0{k + 1}</div>
          {cameo && <Cameo pose={cameo[0]} alt={cameo[1]} />}
        </div>
        <div>
          <div className="label mid">{label}</div>
          <h2 id={`${anchor(m.slug, k)}-h`} className="display" style={{ fontSize: "clamp(48px, 6vw, 80px)", margin: "8px 0 20px" }}>{sectionName(m.slug, k)}</h2>
          {children}
        </div>
      </div>
      )}
      {wide && <div className="tx-wide">{wide}</div>}
    </section>
  );
}

const Body = ({ ps }: { ps: string[] }) => <>{ps.map((t, i) => <p key={i} style={{ maxWidth: 680, margin: "0 0 16px" }}>{t}</p>)}</>;

/** Process photo: blue duotone, taped on with two white strips. */
function Taped({ src, alt, tilt = -1.5 }: { src: string; alt: string; tilt?: number }) {
  return (
    <figure style={{ position: "relative", margin: "16px 0", transform: `rotate(${tilt}deg)`, maxWidth: 520 }}>
      <img src={src} alt={alt} loading="lazy" style={{ display: "block", width: "100%", filter: "url(#duotone)" }} />
      <span aria-hidden style={{ position: "absolute", top: -10, left: "12%", width: 70, height: 20, background: "rgba(255,255,255,.85)", transform: "rotate(-6deg)" }} />
      <span aria-hidden style={{ position: "absolute", top: -10, right: "12%", width: 70, height: 20, background: "rgba(255,255,255,.85)", transform: "rotate(5deg)" }} />
    </figure>
  );
}

/** SKETCH ← → SHIPPED trace reveal (keyboard operable range input). */
function TraceReveal({ pair, label }: { pair: [string, string]; label: string }) {
  const [v, setV] = useState(50);
  return (
    <div style={{ margin: "24px 0" }}>
      <div className="specimen" style={{ position: "relative" }}>
        <div style={{ position: "relative" }}>
          <img src={pair[1]} alt={`${label} — shipped screen`} style={{ display: "block", width: "100%" }} />
          <img src={pair[0]} alt={`${label} — early wireframe`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - v}% 0 0)`, background: "#fff" }} />
          <span aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: `${v}%`, width: 2, background: "var(--blueprint-dk)" }} />
        </div>
        <figcaption>SPEC. {label} · wireframe ↔ shipped</figcaption>
      </div>
      <label className="label" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        Sketch <input type="range" min={0} max={100} value={v} onChange={e => setV(+e.target.value)} style={{ flex: 1, accentColor: "#fff" }} aria-label="Drag between wireframe and shipped screen" /> Shipped
      </label>
    </div>
  );
}

/** LIVE EXPLODED UI: the real screen on top, its structure as line drawings underneath. Scrubs with scroll. */
function LiveExplodedUI({ shot, label }: { shot: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [p, setP] = useState(1);
  useEffect(() => {
    if (reduced) return;
    const on = () => { const r = ref.current?.getBoundingClientRect(); if (!r) return; setP(Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * 0.9)))); };
    on(); addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [reduced]);
  const names = ["UI surface", "Components", "State / logic", "Data"];
  const M = "matrix(0.866 0.5 -0.866 0.5 0 0)";
  return (
    <div ref={ref} style={{ margin: "24px 0" }}>
      <svg viewBox="0 0 520 470" className="scene" style={{ width: "100%", maxWidth: 620 }} role="img" aria-label={`${label} screen exploded into four layers: ${names.join(", ")}`}>
        {[3, 2, 1, 0].map(i => {
          const y = 120 + i * (40 + 50 * p);
          return (
            <g key={i}>
              <g transform={`translate(260 ${y}) ${M}`} className="bp">
                <rect x="-110" y="-70" width="220" height="140" fill={i === 0 ? "#fff" : "var(--blueprint)"} />
                {i === 0 && <image href={shot} x="-106" y="-66" width="212" height="132" preserveAspectRatio="xMidYMid slice" />}
                {i === 1 && <><rect x="-96" y="-56" width="80" height="40" /><rect x="-6" y="-56" width="92" height="40" /><rect x="-96" y="-6" width="182" height="58" /></>}
                {i === 2 && <><circle cx="-60" cy="0" r="14" /><circle cx="0" cy="-30" r="14" /><circle cx="60" cy="10" r="14" /><path d="M-46 0 L-14 -26 M14 -26 L48 2" /></>}
                {i === 3 && <><ellipse cx="0" cy="-30" rx="44" ry="12" /><path d="M-44 -30 v50 a44 12 0 0 0 88 0 v-50" /></>}
              </g>
              <path d={`M${260 + 190} ${y} h40`} className="bp" />
              <text x="494" y={y + 4} fontSize="11" className="bp-text" textAnchor="end" style={{ textTransform: "uppercase" }}>{names[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** BUILD: internals as a circuit schematic; white dots travel along to show data flow. */
function Schematic({ nodes }: { nodes: string[] }) {
  const reduced = useReducedMotion();
  const cols = 3, w = 170, h = 54, gx = 60, gy = 70;
  const pos = nodes.map((_, i) => [20 + (i % cols) * (w + gx), 20 + Math.floor(i / cols) * (h + gy)] as [number, number]);
  const links = nodes.slice(1).map((_, i) => {
    const [x1, y1] = pos[i], [x2, y2] = pos[i + 1];
    return y1 === y2 ? `M${x1 + w} ${y1 + h / 2} H${x2}` : `M${x1 + w / 2} ${y1 + h} V${y1 + h + gy / 2} H${x2 + w / 2} V${y2}`;
  });
  return (
    <svg viewBox={`0 0 ${20 + cols * (w + gx)} ${40 + Math.ceil(nodes.length / cols) * (h + gy)}`} className="scene" style={{ width: "100%", maxWidth: 760, margin: "16px 0" }} role="img" aria-label={`System schematic: ${nodes.join(" → ")}`}>
      {links.map((d, i) => (
        <g key={i}><path d={d} className="bp" /><circle r="2.5" className="solid" style={{ fill: "#fff" }}>
          {!reduced && <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={d} />}
        </circle></g>
      ))}
      {pos.map(([x, y], i) => (
        <g key={i} className="bp"><rect x={x} y={y} width={w} height={h} fill="var(--blueprint-dk)" /><circle cx={x} cy={y + h / 2} r="3" className="solid" style={{ fill: "#fff" }} />
          <text x={x + w / 2} y={y + h / 2 + 4} fontSize="11" textAnchor="middle" className="bp-text" style={{ textTransform: "uppercase" }}>{nodes[i]}</text></g>
      ))}
    </svg>
  );
}

/** Ruler gauge that SNAPs to its value when scrolled into view. */
function Gauge({ label, from, to }: { label: string; from?: string; to: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, true);
  return (
    <div ref={ref} style={{ borderTop: "1px solid var(--white)", paddingTop: 14 }}>
      <svg viewBox="0 0 200 26" style={{ width: "100%", height: 26 }} aria-hidden className="bp">
        {Array.from({ length: 21 }).map((_, i) => <path key={i} d={`M${i * 10} 0 v${i % 5 ? 8 : 16}`} />)}
        <path d="M10 0 v26" stroke="var(--accent)" strokeWidth="3" style={{ transform: `translateX(${seen ? 180 : 0}px)`, transition: "transform var(--dur-draw) var(--ease-spring)" }} />
      </svg>
      <div className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)", marginTop: 8, color: seen ? "var(--white)" : "var(--line-mid)", transition: "color var(--dur-ui)" }}>
        {from && <span className="mid" style={{ fontSize: ".55em" }}>{from} → </span>}{to}
      </div>
      <div className="label mid">{label}</div>
    </div>
  );
}


/** End of every case study: pick the next one (all four, the current one marked "you're here"). */
function NextPrints({ current }: { current: string }) {
  return (
    <section className="sheet next-prints" aria-labelledby="np-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">Pick the next print</span><span className="rail-line" /></div>
      <h2 id="np-title" className="display ab-h2">Pick the next print</h2>
      <p className="label mid" style={{ margin: "6px 0 24px" }}>four case studies · open any of them</p>
      <ol className="np-list">
        {MISSIONS.map(n => {
          const here = n.slug === current, pr = PRINT[n.slug];
          return (
            <li key={n.slug}>
              <a href={`#/case/${n.slug}`} className={`np-row ${here ? "here" : ""}`} aria-current={here ? "page" : undefined}
                onClick={e => { e.preventDefault(); if (here) scrollTo({ top: 0, behavior: "smooth" }); else go(`#/case/${n.slug}`); }}>
                <span className="np-code display">{pr.code}</span>
                <span className="np-name display">{n.label}</span>
                <span className="np-meta label">{n.role} · {n.year}</span>
                <span className="np-go label">{here ? "you're here ↑" : "open →"}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ── page ────────────────────────────────────────────────────────────────────
export function CaseStudy({ mission: m }: { mission: Mission }) {
  const brief = BRIEFS[m.slug];
  const p = PRINT[m.slug];
  const t = sectionText(m);
  const [active, setActive] = useState(-1);
  const next = MISSIONS[(MISSIONS.indexOf(m) + 1) % MISSIONS.length];
  const cardIndexActive = active === 99 ? 0 : active >= 0 ? active + 1 : -1;

  return (
    <article aria-labelledby="cs-name">
      {/* HERO — SHEET 00: EXPLODED ASSEMBLY */}
      <section className="sheet" style={{ minHeight: "100vh" }}>
        <div className="rail" aria-hidden><span className="rail-label" style={{ border: "1px solid currentColor", borderRadius: 999, padding: "10px 4px" }}>{brief.code} · Engineering case study</span><span className="rail-line" /></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <button className="label dimlink" onClick={() => go("#/work")} style={{ display: "block", background: "none", border: 0, cursor: "pointer", padding: "8px 0", minHeight: 44, marginBottom: 12 }}>← all prints</button>
            <h1 id="cs-name" className="display" style={{ background: "var(--white)", color: "var(--blueprint-dk)", fontSize: "clamp(40px, 7vw, 96px)", padding: "6px 16px 2px", display: "inline-block", maxWidth: "100%", boxSizing: "border-box", overflowWrap: "anywhere", marginTop: 8 }}>{m.label}</h1>
            <p style={{ maxWidth: 460, marginTop: 14 }}>{m.slug === "traxen" ? "Multi-app driving, made safer: the Traxen floating window experience." : m.slug === "buymyspot" ? "Parking, booked like a stay: the buyer web app for a peer-to-peer parking marketplace." : m.slug === "gm" ? "Luxury, made personal: an in-vehicle experience for GM's luxury segment, across four connected screens." : m.slug === "guardiancare" ? "Redefining senior living: Ava, a companion robot that keeps seniors safe without watching them." : `${m.brief.split(". ")[0]}.`}</p>
          </div>
          <div style={{ minWidth: 280, maxWidth: 380, flex: "0 1 380px" }}>
            <SpecTable caption="Project specs" rows={[["Role", m.role], ["Team", p.team], ["Timeline", m.slug === "traxen" ? "1 month · 2024" : m.slug === "buymyspot" ? "Jun – Aug 2023 · 3 months" : m.slug === "gm" ? "Mar – Apr 2024 · SI 594, University of Michigan" : m.slug === "guardiancare" ? "Aug – Dec 2023 · SI 612, University of Michigan" : m.year], ["Tools", m.slug === "traxen" ? "Figma · Penpot · Atlassian · Android Studio · Kotlin · Claude Code · Cursor" : m.slug === "buymyspot" ? "Figma · FigJam · Miro" : m.slug === "gm" ? "Figma" : m.slug === "guardiancare" ? "Figma · FigJam · Miro · Qualtrics" : "Figma · Miro"], ["Status", <Stamp key="s">{p.result}</Stamp>]]} />
          </div>
        </div>

        {m.slug === "guardiancare" && <div className="gc-hero-video">{GC_VIDEO}</div>}
        <div className="hero-cs">
          <div className="drawing" data-tap="">
            <Exploded slug={m.slug} brief={brief} active={active} setActive={setActive} onPick={k => scrollToSection(m.slug, k)} cameo={(CAMEOS[m.slug] ?? CAMEOS.traxen).hero} />
          </div>
          <ol className="cards" aria-label="Sections of this case study">
            <span aria-hidden className="bus" />
            {SECTIONS.map((s, k) => {
              const hook = k === 0 ? `${brief.object} — assembled. ${t.overview[0].split(". ")[0]}.` : brief.layers[k - 1].hook;
              const on = cardIndexActive === k;
              return (
                <li key={s} style={{ top: `${cardPct(k)}%` }}>
                  <a href={`#${anchor(m.slug, k)}`} className={`cs-card ${on ? "on" : ""}`} onClick={e => { e.preventDefault(); scrollToSection(m.slug, k); }}
                    onMouseEnter={() => setActive(k === 0 ? 99 : k - 1)} onMouseLeave={() => setActive(-1)} onFocus={() => setActive(k === 0 ? 99 : k - 1)} onBlur={() => setActive(-1)}>
                    <span className="display cs-card-no">0{k + 1}</span>
                    <span><span className="display cs-card-name">{sectionName(m.slug, k)}</span><span className="cs-card-hook">{hook}</span></span>
                  </a>
                </li>
              );
            })}
            <span aria-hidden className="label bracket">6 sheets</span>
          </ol>
        </div>
        <div className="label mid" style={{ display: "flex", gap: 20, marginTop: 24 }} aria-label="Platform">
          {brief.icons.map(i => <span key={i}>◻ {i}</span>)}
        </div>
      </section>

      {m.slug === "traxen" ? (
        <>
          <SheetSection plain bg={["truck", "right"]} m={m} brief={brief} k={0} wide={<TxOverviewWide />}><TxOverview /></SheetSection>
          <SheetSection plain bg={["cab", "right"]} m={m} brief={brief} k={1} wide={<TxResearchWide />}><TxResearch /></SheetSection>
          <SheetSection plain bg={["front", "right"]} m={m} brief={brief} k={2} wide={<TxDefineWide />}><TxDefine /></SheetSection>
          <SheetSection plain bg={["mount", "right"]} m={m} brief={brief} k={3} wide={<TxDesignWide />}><TxDesign /></SheetSection>
          <SheetSection plain bg={["wheel", "right"]} m={m} brief={brief} k={4} wide={<TxBuildWide schematic={<Schematic nodes={brief.internals} />} />}><TxBuild /></SheetSection>
          <SheetSection plain bg={["side", "right"]} m={m} brief={brief} k={5} wide={<TxImpactWide next={next} />}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28, marginBottom: 28 }}>
              {brief.gauges.map(g => <Gauge key={g.label} {...g} />)}
            </div>
            <Body ps={t.impact.slice(0, 1)} />
          </SheetSection>
        </>
      ) : m.slug === "gm" ? (
        <>
          <SheetSection plain cbg="side" m={m} brief={brief} k={0} wide={<GmOverviewWide />}><GmOverview /></SheetSection>
          <SheetSection plain cbg="top" m={m} brief={brief} k={1} wide={<GmResearchWide />}><GmResearch /></SheetSection>
          <SheetSection plain cbg="dash" m={m} brief={brief} k={2} wide={<GmDefineWide />}><GmDefine /></SheetSection>
          <SheetSection plain cbg="wheel" m={m} brief={brief} k={3} wide={<GmDesignWide />}><GmDesign /></SheetSection>
          <SheetSection plain cbg="cluster" m={m} brief={brief} k={4} wide={<GmSystemWide />}><GmSystem /></SheetSection>
          <SheetSection plain cbg="seat" m={m} brief={brief} k={5} wide={<GmOutcomeWide next={next} />}><GmOutcome /></SheetSection>
        </>
      ) : m.slug === "guardiancare" ? (
        <>
          <SheetSection plain rbg="front" m={m} brief={brief} k={0} wide={<GcOverviewWide />}><GcOverview /></SheetSection>
          <SheetSection plain rbg="home" m={m} brief={brief} k={1} wide={<GcResearchWide />}><GcResearch /></SheetSection>
          <SheetSection plain rbg="band" m={m} brief={brief} k={2} wide={<GcDefineWide />}><GcDefine /></SheetSection>
          <SheetSection plain rbg="side" m={m} brief={brief} k={3} wide={<GcDesignWide />}><GcDesign /></SheetSection>
          <SheetSection plain rbg="drawer" m={m} brief={brief} k={4} wide={<GcBuildWide />}><GcBuild /></SheetSection>
          <SheetSection plain rbg="wheel" m={m} brief={brief} k={5} wide={<GcImpactWide next={next} />}><GcImpact /></SheetSection>
        </>
      ) : m.slug === "buymyspot" ? (
        <>
          <SheetSection plain pbg="lot" m={m} brief={brief} k={0} wide={<BmOverviewWide />}><BmOverview /></SheetSection>
          <SheetSection plain pbg="map" m={m} brief={brief} k={1} wide={<BmResearchWide />}><BmResearch /></SheetSection>
          <SheetSection plain pbg="sign" m={m} brief={brief} k={2} wide={<BmDefineWide />}><BmDefine /></SheetSection>
          <SheetSection plain pbg="phone" m={m} brief={brief} k={3} wide={<BmDesignWide />}><BmDesign /></SheetSection>
          <SheetSection plain pbg="garage" m={m} brief={brief} k={4} wide={<BmHandoffWide />}><BmHandoff /></SheetSection>
<SheetSection plain pbg="car" m={m} brief={brief} k={5} wide={<BmImpactWide next={next} />}><BmImpact /></SheetSection>
        </>
      ) : (
        <>
      {/* SHEET 01 — OVERVIEW */}
      <SheetSection m={m} brief={brief} k={0}>
        <Body ps={t.overview} />
        <Specimen src={brief.overviewShot} alt={`${m.label} — final product`} caption={`SPEC. ${brief.code}-01 · ${t.build} · final`} style={{ maxWidth: 620 }} />
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 16 }}>{m.tags.map(tag => <Callout key={tag}>{tag}</Callout>)}</div>
      </SheetSection>

      {/* SHEET 02 — RESEARCH */}
      <SheetSection m={m} brief={brief} k={1} cameo={cameoFor(m.slug, 0)}>
        <Body ps={t.research} />
        <ol style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
          {t.researchSteps.map((s, i) => <li key={s} style={{ padding: "10px 0", borderBottom: "1px solid var(--line-mid)", display: "flex", gap: 14 }}><span className="label">F-0{i + 1}</span><span>{s}</span></li>)}
        </ol>
        {t.images.research.slice(0, 2).map((src, i) => <Taped key={src} src={src} alt={`${m.label} research artifact ${i + 1}`} tilt={i ? 1.2 : -1.5} />)}
      </SheetSection>

      {/* SHEET 03 — DEFINE */}
      <SheetSection m={m} brief={brief} k={2} cameo={cameoFor(m.slug, 1)}>
        <Body ps={t.define} />
        <div style={{ overflowX: "auto", margin: "20px 0" }}>
          <table className="spec-table" style={{ minWidth: 560 }}>
            <caption className="sr-only">Constraints and requirements</caption>
            <thead><tr><th>ID</th><th>Constraint</th><th>So the UI must…</th><th>Priority</th></tr></thead>
            <tbody>{brief.constraints.map(c => <tr key={c.id}><td>{c.id}</td><td>{c.constraint}</td><td>{c.must}</td><td>{c.priority}</td></tr>)}</tbody>
          </table>
        </div>
      </SheetSection>

      {/* SHEET 04 — DESIGN */}
      <SheetSection m={m} brief={brief} k={3}>
        <Body ps={t.design} />
        <LiveExplodedUI shot={t.images.design[0] ?? brief.overviewShot} label={m.label} />
        {brief.trace && <TraceReveal pair={brief.trace} label={`${brief.code}-04`} />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginTop: 16 }}>
          {t.images.design.map((src, i) => <Specimen key={src} src={src} alt={`${m.label} design screen ${i + 1}`} caption={`SPEC. ${brief.code}-04-${String.fromCharCode(65 + i)}`} />)}
        </div>
      </SheetSection>

      {/* SHEET 05 — BUILD */}
      <SheetSection m={m} brief={brief} k={4} cameo={cameoFor(m.slug, 2)}>
        <Schematic nodes={brief.internals} />
        {t.images.build.map((src, i) => <Specimen key={src} src={src} alt={`${m.label} build artifact ${i + 1}`} caption={`SPEC. ${brief.code}-05-${i + 1}`} style={{ marginTop: 24 }} />)}
      </SheetSection>

      {/* SHEET 06 — IMPACT */}
      <SheetSection m={m} brief={brief} k={5} cameo={cameoFor(m.slug, 3)}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 28, marginBottom: 28 }}>
          {brief.gauges.map(g => <Gauge key={g.label} {...g} />)}
        </div>
        <Body ps={t.impact} />
        <Dim>Lessons · next revision</Dim>
        <ul style={{ paddingLeft: 18 }}>{brief.lessons.map(l => <li key={l} style={{ marginBottom: 8 }}>{l}</li>)}</ul>
        <div style={{ marginTop: 28 }}><Chamfer solid onClick={() => go(`#/case/${next.slug}`)}>Next print → {next.label}</Chamfer></div>
      </SheetSection>
        </>
      )}
      <NextPrints current={m.slug} />
    </article>
  );
}
