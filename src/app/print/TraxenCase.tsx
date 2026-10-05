// TRAXEN — the full case study, told as a set of engineering drawing sheets.
// Copy is from Muskaan's Framer case study (muskaandhadwal.framer.website/traxen) + her case-study notes.
// Pattern on every sheet: a broken-down concept (blueprint diagram) → the live thing (her real images,
// animations, videos) → a little comic moment (a mini of her, or Roger, saying something).
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mini, type PoseName } from "./Minis";
import { Chamfer, Dim, SpecTable, useInView, useReducedMotion } from "./ui";
import { go } from "./nav";

const A = (f: string) => `/case-studies/traxen/v2/${f}`;

// ── building blocks ─────────────────────────────────────────────────────────
/** A full-width band inside a sheet: numbered like a drawing callout. */
export function Band({ no, title, kicker, children }: { no: string; title: ReactNode; kicker?: string; children: ReactNode }) {
  return (
    <section className="tx-band" aria-label={typeof title === "string" ? title : undefined}>
      <header className="tx-band-head">
        <span className="tx-band-no label">{no}</span>
        <div>
          {kicker && <span className="label mid">{kicker}</span>}
          <h3 className="display tx-band-title">{title}</h3>
        </div>
      </header>
      {children}
    </section>
  );
}

/** Her real screens, framed like a specimen. Animated WebP shows a still for reduced motion. */
export function Shot({ src, still, alt, caption, className = "", fit }: { src: string; still?: string; alt: string; caption: string; className?: string; fit?: "contain" }) {
  return (
    <figure className={`specimen tx-shot ${className}`}>
      <picture>
        {still && <source media="(prefers-reduced-motion: reduce)" srcSet={still} />}
        <img src={src} alt={alt} loading="lazy" style={fit ? { objectFit: fit } : undefined} />
      </picture>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** A real video: short loops autoplay (muted) only while on screen; long ones get controls.
 *  `chapters` adds buttons that jump straight to a moment (e.g. the day → night switch). */
export function Clip({ src, caption, label, controls, poster, chapters }: {
  src: string; caption: string; label: string; controls?: boolean; poster?: string; chapters?: [string, number][];
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const on = useInView(ref);
  const [now, setNow] = useState(0);
  useEffect(() => { // React doesn't write `muted` as an attribute; browsers require it before they'll autoplay
    const v = ref.current; if (!v || controls) return;
    v.muted = true; v.setAttribute("muted", "");
  }, [controls]);
  useEffect(() => {
    const v = ref.current; if (!v || controls || reduced) return;
    if (on) v.play().catch(() => {}); else v.pause();
  }, [on, controls, reduced]);
  const jump = (t: number) => { const v = ref.current; if (!v) return; v.currentTime = t; v.play().catch(() => {}); };
  const active = chapters ? [...chapters].reverse().find(([, t]) => now >= t)?.[0] : undefined;
  return (
    <figure className="specimen tx-shot">
      <video ref={ref} src={src} muted={!controls} loop={!controls} playsInline preload={controls ? "metadata" : "auto"} controls={controls || reduced}
        poster={poster} aria-label={label} onTimeUpdate={e => setNow(e.currentTarget.currentTime)} />
      {chapters && (
        <div className="tx-chapters" role="group" aria-label="Jump to">
          {chapters.map(([name, t]) => <button key={name} className={`ct-chip ${active === name ? "on" : ""}`} aria-pressed={active === name} onClick={() => jump(t)}>{name}</button>)}
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** The comic layer: a small her (or Roger) with a speech bubble. */
export function Say({ pose, img, art, children, side = "left", alt }: { pose?: PoseName; img?: string; art?: string; children: ReactNode; side?: "left" | "right"; alt: string }) {
  return (
    <div className={`tx-say tx-say-${side}`}>
      <div className={`tx-say-who ${art ? "tx-say-art" : ""}`}>{pose ? <Mini pose={pose} label={alt} unit={1.15} /> : art ? <img src={`/art/${art}-white.png`} alt={alt} /> : <img src={img} alt={alt} />}</div>
      <p className="tx-say-bubble hand">{children}</p>
    </div>
  );
}

/** Loop-style card: white illustration panel on blue, italic number, big line. */
export function LoopCard({ no, art, title, children }: { no: string; art: ReactNode; title: string; children?: ReactNode }) {
  return (
    <article className="tx-loop">
      <div className="tx-loop-art">{art}</div>
      <span className="tx-loop-no display">{no}</span>
      <h4 className="tx-loop-title">{title}</h4>
      {children && <p className="tx-loop-body">{children}</p>}
    </article>
  );
}

// ── 01 OVERVIEW ─────────────────────────────────────────────────────────────
const STEPS: [string, string][] = [
  ["Research", "Analyzed driver workflows and user needs to identify and define the core pain points."],
  ["Ideate", "Brainstormed a wide range of solutions for a non-intrusive alert system in very limited real estate."],
  ["Structure", "Built detailed user flows and a prioritized alert hierarchy."],
  ["Design", "Designed and iterated on high-fidelity prototypes, with feedback from regular stakeholder critiques."],
  ["Build", "Engineered a full-stack MVP, coding both the front end and the back end from the final designs."],
  ["Test", "Ran in-vehicle and simulated guerrilla tests to validate the MVP, find bugs and hear from drivers."],
  ["Ship", "Refined and debugged from what testing taught me, then launched a production-ready product to the customer."],
];

export function TxOverview() {
  return (
    <>
      <p className="tx-lede">Traxen is redefining trucking tech with advanced driver-assist systems that make fleets safer and more efficient.</p>
      <p>Since summer 2024 I've led the design of Traxen's Android tablet app: the interface drivers use on the road, built to comply with federal safety guidelines and to be intuitive at a glance.</p>
      <p>This project was a non-intrusive, context-aware overlay that gives drivers at-a-glance information, end to end: core user flows, interface design, and the code, from concept to production.</p>
    </>
  );
}

export function TxOverviewWide() {
  return (
    <>
      <Band no="01.1" kicker="the product, assembled" title="One floating window, two sizes">
        <div className="tx-pair">
          <Shot src={A("final-max.png")} alt="The final floating window, maximized: current speed 65, a car icon with 12.0 secs headway, a microphone button, minimize and open-app icons." caption="SPEC. T1-01-A · floating window · maximized" />
          <div className="tx-pair-col">
            <Shot src={A("final-min.png")} alt="The final floating window, minimized to a single strip: speed 65, 12.0 secs headway and a microphone button." caption="SPEC. T1-01-B · minimized" />
            <Say pose="txTablet" alt="A small Muskaan holding up a tablet" side="right">It sits on top of every app in the cab. Navigation, hours-of-service, anything.</Say>
          </div>
        </div>
      </Band>
      <Band no="01.2" kicker="so what did I do to solve this?" title="Seven steps, one person">
        <ol className="tx-steps">
          {STEPS.map(([k, t], i) => (
            <li key={k}><span className="tx-step-dot display">{String(i + 1).padStart(2, "0")}</span><span className="label">{k}</span><span>{t}</span></li>
          ))}
        </ol>
      </Band>
      <Band no="01.3" kicker="the impact, in one line each" title="What changed">
        <div className="tx-loops">
          <LoopCard no="01" title="Increased retention rate" art={<Mini pose="txRetain" label="A small Muskaan stacking the top block onto a rising bar chart" tone="paper" />} />
          <LoopCard no="02" title="Reduced cognitive load" art={<Mini pose="txCalm" label="A small Muskaan leaning back, hands behind her head, relaxed" tone="paper" />} />
          <LoopCard no="03" title="Happier fleets and drivers" art={<Mini pose="txHappy" label="A small Muskaan star-jumping next to a smiling truck" tone="paper" />} />
        </div>
      </Band>
    </>
  );
}

// ── 02 RESEARCH ─────────────────────────────────────────────────────────────
export function TxResearch() {
  return (
    <>
      <p className="tx-lede">Switching between apps while driving is hard.</p>
      <p>Truck drivers juggle several in-cab apps: navigation, the federally required hours-of-service clocks, and sometimes a third-party tablet their fleet mandates. Every switch pulls them away from Traxen, which means missed safety alerts and less engagement with the system.</p>
      <p>So the answer had to be <b>simple, context-aware, and always within reach.</b></p>
    </>
  );
}

/** Broken-down concept: the app-switching loop in the cab. */
function SwitchDiagram() {
  const apps: [string, string, string][] = [["NAV", "navigation", ""], ["HOS", "hours of", "service"], ["FLEET", "fleet", "app"]];
  return (
    <svg viewBox="0 0 620 280" className="scene tx-diagram" role="img" aria-label="Diagram: one tablet, three apps the driver has to use, and Traxen hidden behind them. Every switch takes the driver's eyes off the road.">
      <rect x="10" y="10" width="380" height="260" rx="16" className="bp fill" />
      <rect x="26" y="26" width="348" height="228" className="bp" />
      <text x="40" y="50" fontSize="10" className="bp-text">THE TABLET</text>
      {apps.map(([k, l1, l2], i) => {
        const x = 44 + i * 112;
        return (
          <g key={k} className="bp">
            <rect x={x} y="96" width="92" height="88" className="fill" />
            <text x={x + 46} y="134" fontSize="16" textAnchor="middle" className="bp-text">{k}</text>
            <text x={x + 46} y="158" fontSize="9" textAnchor="middle" className="bp-text" style={{ textTransform: "uppercase" }}>{l1}</text>
            {l2 && <text x={x + 46} y="171" fontSize="9" textAnchor="middle" className="bp-text" style={{ textTransform: "uppercase" }}>{l2}</text>}
            {i < 2 && <><path d={`M${x + 60} 94 C${x + 74} 66 ${x + 116} 66 ${x + 128} 92`} strokeDasharray="4 4" /><path d={`M${x + 121} 87 l7 5 l1 -9`} /></>}
          </g>
        );
      })}
      <text x="150" y="58" fontSize="9" textAnchor="middle" className="bp-text">SWITCH</text>
      <text x="262" y="58" fontSize="9" textAnchor="middle" className="bp-text">SWITCH</text>
      <g className="bp"><rect x="44" y="202" width="316" height="34" strokeDasharray="4 4" /></g>
      <text x="202" y="224" fontSize="10" textAnchor="middle" className="bp-text">TRAXEN · BURIED BEHIND THE OTHER APPS</text>
      <path d="M390 140 H436" className="bp" />
      <g className="bp">
        <circle cx="500" cy="140" r="40" className="fill" />
        <path d="M472 140 q28 -26 56 0 q-28 26 -56 0 z" /><circle cx="500" cy="140" r="7" style={{ fill: "currentColor" }} />
        <path d="M470 110 l60 60" stroke="var(--accent)" strokeWidth="3" />
      </g>
      <text x="500" y="206" fontSize="10" textAnchor="middle" className="bp-text">EVERY SWITCH</text>
      <text x="500" y="222" fontSize="10" textAnchor="middle" className="bp-text">= EYES OFF THE ROAD</text>
    </svg>
  );
}

const RULES: { no: string; img: string; title: string; body: string }[] = [
  { no: "01", img: "rule-distraction-original.png", title: "Minimum driver distraction", body: "Eyes go back to the road fast. Anything on screen has to make sense in a glance." },
  { no: "02", img: "rule-multimodal-original.png", title: "Multi-modal interaction", body: "Voice, touch and sound work together, so the driver can pick whatever is safest right now." },
  { no: "03", img: "rule-consistency-original.png", title: "Consistency and learnability", body: "The same thing always looks and behaves the same way. Nothing new to learn at 65 mph." },
  { no: "04", img: "rule-touch-original.png", title: "76px minimum touch target", body: "Big targets for a moving cab, a bumpy road and sometimes gloves." },
];

export function TxResearchWide() {
  return (
    <>
      <Band no="02.1" kicker="broken down" title="The app-switching loop">
        <div className="tx-split">
          <SwitchDiagram />
          <div>
            <p>The tablet is shared real estate. Navigation and the hours-of-service clock win every time, because the driver needs them to do the job. Traxen gets pushed to the back, and its alerts go with it.</p>
            <Say art="kit-notetaker" alt="Muskaan at a desk, chin on her hand, taking notes on a clipboard">Every time a driver switched apps, Traxen disappeared. Noted.</Say>
          </div>
        </div>
      </Band>
      <Band no="02.2" kicker="before the details" title="Rules for designing a screen in a moving truck">
        <p className="tx-measure">Designing for an in-vehicle system is nothing like designing for a phone or a laptop. These four rules shaped every decision after this point.</p>
        <div className="tx-loops tx-loops-4">
          {RULES.map(r => <LoopCard key={r.no} no={r.no} title={r.title} art={<img src={A(r.img)} alt={`Rule ${r.no} icon: ${r.title.toLowerCase()}`} />}>{r.body}</LoopCard>)}
        </div>
      </Band>
      <Band no="02.3" kicker="the stakes were high" title="Two sides of the same problem">
        <div className="tx-stakes">
          <div className="tx-stake"><span className="label">User / driver</span><p>Any mental effort spent managing apps is attention taken away from driving safely.</p></div>
          <svg viewBox="0 0 200 120" className="scene tx-diagram tx-beam" aria-hidden>
            <path d="M100 30 L70 100 H130 Z" className="bp fill" /><path d="M20 30 H180" className="bp" style={{ strokeWidth: 3 }} />
            <path d="M20 30 v16 M180 30 v16" className="bp" /><path d="M6 46 h28 l-4 10 h-20 z M166 46 h28 l-4 10 h-20 z" className="bp fill" />
            <circle cx="100" cy="30" r="5" className="bp fill" />
          </svg>
          <div className="tx-stake"><span className="label">Business</span><p>Drivers often forget to open the Traxen app, so less data gets logged, insights are limited and the system's performance is hard to see.</p></div>
        </div>
      </Band>
      <Band no="02.4" kicker="persona" title="Meet Roger, the skeptical adopter">
        <div className="tx-persona">
          <div className="tx-persona-card on-paper">
            <img src={A("roger.png")} alt="Illustrated persona: Roger, a bearded truck driver in a cap." />
            <SpecTable caption="Roger" rows={[["Age", "54"], ["Job", "Veteran truck driver"], ["Tablet use", "Logging hours + navigating, because his fleet mandates it"], ["Attitude", "Pragmatic, not anti-tech"]]} />
          </div>
          <div>
            <p>From interviews with drivers and stakeholders, most people fit one archetype. It matters because it predicts which alerts are most important to the driver.</p>
            <p>Roger uses technology when it's essential to his job, but has little time for anything else. For him the Traxen app is a secondary tool. It has to work in the background; his focus stays on his real job.</p>
            <Say img={A("roger.png")} alt="Roger" side="right">“I often struggle to open different apps while driving.”</Say>
          </div>
        </div>
      </Band>
    </>
  );
}

// ── 03 DEFINE ───────────────────────────────────────────────────────────────
export function TxDefine() {
  return (
    <>
      <p className="tx-lede">This leads to the center of the problem.</p>
      <blockquote className="tx-hmw">
        How might we make the Traxen app an indispensable <em>co-pilot</em>, with seamless, non-distracting alerts across all apps
        <span className="tx-need">user need</span>, so that engagement and adoption follow naturally from its usefulness, without adding a new mental model for drivers
        <span className="tx-need">business need</span>?
      </blockquote>
    </>
  );
}

type Row = { alert: string; shows: string; level: 4 | 3 | 2 | 1; levelText: string; behavior: string; min: boolean; max: boolean };
const PRIORITY: Row[] = [
  { alert: "Collision warning", shows: "Minimized & maximized", level: 4, levelText: "Highest", behavior: "Takes over the entire window and overrides all other alerts.", min: true, max: true },
  { alert: "Curve ahead", shows: "Minimized & maximized", level: 3, levelText: "High", behavior: "Expands the window if minimized. Replaces the override assist bar / headway. Prevents minimizing.", min: true, max: true },
  { alert: "Speed limit ahead", shows: "Minimized & maximized", level: 3, levelText: "High", behavior: "Expands the window if minimized. Replaces the speed limit alert. Prevents minimizing.", min: true, max: true },
  { alert: "Set speed", shows: "Minimized & maximized", level: 3, levelText: "High", behavior: "Always displayed.", min: true, max: true },
  { alert: "Override assist bar", shows: "Minimized (maximized = low)", level: 2, levelText: "Medium", behavior: "Always shown when minimized; replaced by curve ahead when maximized.", min: true, max: false },
  { alert: "Headway duration", shows: "Minimized (high) / maximized (low)", level: 2, levelText: "Medium", behavior: "Overrides the speed limit alert when minimized; replaced by curve ahead when maximized.", min: true, max: false },
  { alert: "Speed limit alert", shows: "Minimized (low) / maximized (high)", level: 1, levelText: "Low → high", behavior: "Shown when issued; replaced by headway duration when minimized.", min: false, max: true },
];

function PriorityTable() {
  const [view, setView] = useState<"all" | "min" | "max">("all");
  return (
    <div>
      <div className="tx-toggle" role="group" aria-label="Filter alerts by window state">
        {([["all", "All alerts"], ["min", "In the minimized window"], ["max", "In the maximized window"]] as const).map(([k, l]) => (
          <button key={k} className={`ct-chip ${view === k ? "on" : ""}`} aria-pressed={view === k} onClick={() => setView(k)}>{l}</button>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="spec-table tx-prio">
          <caption className="sr-only">Alerts ranked by safety priority</caption>
          <thead><tr><th>Alert</th><th>Shows in</th><th>Priority</th><th>Behavior</th></tr></thead>
          <tbody>
            {PRIORITY.map(r => {
              const dim = (view === "min" && !r.min) || (view === "max" && !r.max);
              return (
                <tr key={r.alert} className={dim ? "dim" : ""}>
                  <td><b>{r.alert}</b></td>
                  <td>{r.shows}</td>
                  <td><span className="tx-meter" aria-hidden>{[1, 2, 3, 4].map(n => <i key={n} className={n <= r.level ? "on" : ""} />)}</span> {r.levelText}</td>
                  <td>{r.behavior}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CONSTRAINTS = [
  ["C-01", "The driver can only glance, never read", "make sense at a glance", "P1"],
  ["C-02", "Gloves, vibration, a moving cab", "use touch targets of at least 76px", "P1"],
  ["C-03", "Direct sunlight on the screen", "keep WCAG contrast in glare and at night", "P1"],
  ["C-04", "Navigation and HOS clocks are federally required", "never block navigation or HOS data", "P1"],
  ["C-05", "Day and night driving", "switch light/dark theme by time of day", "P2"],
];

export function TxDefineWide() {
  return (
    <>
      <Band no="03.1" kicker="real estate is limited, information is critical" title="Ranking every alert by safety priority">
        <p className="tx-measure">Designing for so little screen meant balancing functionality against road safety. I used a risk-assessment matrix to prioritize the high-value features, so drivers got the full power of the app with as little distraction as possible. Filter it the way the window does:</p>
        <PriorityTable />
      </Band>
      <Band no="03.2" kicker="written down before any pixels" title="Constraints → requirements">
        <div style={{ overflowX: "auto" }}>
          <table className="spec-table" style={{ minWidth: 560 }}>
            <caption className="sr-only">Constraints and requirements</caption>
            <thead><tr><th>ID</th><th>Constraint</th><th>So the UI must…</th><th>Priority</th></tr></thead>
            <tbody>{CONSTRAINTS.map(c => <tr key={c[0]}>{c.map((v, i) => <td key={i}>{v}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <Say pose="csTape" alt="A small Muskaan measuring with a tape" side="right">76px. I measured. Twice.</Say>
      </Band>
    </>
  );
}

// ── 04 DESIGN ───────────────────────────────────────────────────────────────
export function TxDesign() {
  return (
    <>
      <p className="tx-lede">It was a long road to the final design.</p>
      <p>Once the content requirements were clear, I focused on using the space efficiently and keeping the cognitive load low. To make it easy to adopt, I anchored the UI in patterns people already know. The automotive industry had no direct benchmark, so I looked at non-traditional sources: video recorders and Google Maps.</p>
      <p>As the only designer, I took the interface through several stages, each one refined by stakeholder feedback and brainstorming.</p>
    </>
  );
}

const REVS: { rev: string; img: string; changed: string; next: string; alt: string }[] = [
  { rev: "A", img: "rev-a.png", alt: "Iteration 1: thin status bars reading iQC available, iQC engaged and iQC override.",
    changed: "A top bar that only showed iQ-Cruise status, growing from an icon to a full sentence.",
    next: "Add what drivers actually check, like speed, limit and the road ahead." },
  { rev: "A·2", img: "rev-a-max.png", alt: "Iteration 1 maximized: three dark cards with speed, speed-limit and curve-ahead signs.",
    changed: "Maximized cards: speed, speed limit and road signs, all at once.",
    next: "Each card arranged things differently, so let the driver pick one layout." },
  { rev: "B", img: "rev-b.png", alt: "Iteration 2: three stacked card layouts with the caption Choose desired layout.",
    changed: "Three layouts to choose from, so the driver picks what suits them.",
    next: "No safety alerts yet. Design the warning states." },
  { rev: "C", img: "rev-c.png", alt: "Iteration 3: card states including a yellow collision warning and a red alert.",
    changed: "Alert states: a yellow collision warning and a red alert with a countdown.",
    next: "Sizes and styles were mixed. Make one consistent set." },
  { rev: "D", img: "rev-d.png", alt: "Iteration 4: two rows of every window state from available to alert.",
    changed: "Every state in one system: available → engaged → override → warning → alert.",
    next: "Still separate cards. Merge everything into one window." },
  { rev: "FINAL", img: "final-max-2.png", alt: "Final floating window: speed 65, 12.0 secs headway, microphone button.",
    changed: "One floating window: speed, headway, voice, minimize and open-app. Drag it anywhere.",
    next: "Shipped: it minimizes to a strip and expands on its own for critical alerts." },
];

function Revisions() {
  const track = useRef<HTMLDivElement>(null);
  const nudge = (d: number) => track.current?.scrollBy({ left: d * 340, behavior: "smooth" });
  return (
    <div>
      <div className="tx-revs-bar">
        <span className="label mid">REV A → FINAL · scroll sideways</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Chamfer onClick={() => nudge(-1)} ariaLabel="Earlier revisions">←</Chamfer>
          <Chamfer onClick={() => nudge(1)} ariaLabel="Later revisions">→</Chamfer>
        </div>
      </div>
      <ol ref={track} className="tx-revs">
        {REVS.map((r, i) => (
          <li key={r.rev} className={`tx-rev ${r.rev === "FINAL" ? "final" : ""}`}>
            <div className="tx-rev-head">
              <span className="tx-rev-tag">REV {r.rev}</span>
              <span className="label">{String(i + 1).padStart(2, "0")} / {String(REVS.length).padStart(2, "0")}</span>
            </div>
            <div className="tx-rev-img"><img src={A(r.img)} alt={r.alt} loading="lazy" /></div>
            <dl className="tx-rev-notes">
              <dt className="label">What changed</dt><dd>{r.changed}</dd>
              <dt className="label">{r.rev === "FINAL" ? "Result" : "Improved next"}</dt><dd className="hand">{r.next}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Anatomy: the real final window with numbered leader-line callouts. */
const PARTS: { n: number; x: number; y: number; t: string; d: string }[] = [
  { n: 1, x: 18, y: 26, t: "Speed + iQ-Cruise", d: "Current speed, with the cruise status icon above it." },
  { n: 2, x: 58, y: 34, t: "Headway", d: "Time to the vehicle ahead, in seconds, with the car icon." },
  { n: 3, x: 16, y: 74, t: "Voice", d: "One tap to talk: feedback without reading a menu." },
  { n: 4, x: 86, y: 18, t: "Minimize", d: "Shrinks the window down to a single strip." },
  { n: 5, x: 86, y: 74, t: "Open the app", d: "Jumps into the full Traxen app when there's time." },
];

function Anatomy() {
  const [on, setOn] = useState<number | null>(null);
  return (
    <div className="tx-anatomy">
      <div className="tx-anatomy-img">
        <img src={A("final-max-2.png")} alt="The final floating window with five numbered parts." />
        {PARTS.map(p => (
          <button key={p.n} className={`tx-pin ${on === p.n ? "on" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => setOn(p.n)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(p.n)} onBlur={() => setOn(null)} aria-label={`${p.n}. ${p.t}: ${p.d}`}>{p.n}</button>
        ))}
      </div>
      <ol className="tx-anatomy-list">
        {PARTS.map(p => (
          <li key={p.n} className={on === p.n ? "on" : ""} onMouseEnter={() => setOn(p.n)} onMouseLeave={() => setOn(null)}>
            <span className="tx-pin static" aria-hidden>{p.n}</span><span><b className="display">{p.t}</b><br />{p.d}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Concept diagrams for the four headline features. */
function TtcDiagram() {
  return (
    <svg viewBox="0 0 300 150" className="scene tx-diagram" role="img" aria-label="Time-to-collision: the distance to the truck ahead becomes seconds; at the moment of risk a sound and a visual pulse pull the driver's eyes to the screen.">
      <path d="M10 112 H290" className="bp" strokeDasharray="8 6" />
      <g className="bp"><rect x="20" y="78" width="60" height="30" className="fill" /><path d="M80 86 h18 l10 10 v12 h-28" className="fill" /><circle cx="36" cy="112" r="7" className="fill" /><circle cx="92" cy="112" r="7" className="fill" /></g>
      <g className="bp"><rect x="200" y="74" width="76" height="34" className="fill" /><circle cx="214" cy="112" r="7" className="fill" /><circle cx="262" cy="112" r="7" className="fill" /></g>
      <path d="M112 64 H196 M112 58 v12 M196 58 v12" className="bp" />
      <text x="154" y="54" fontSize="14" textAnchor="middle" className="bp-text">3.0 s</text>
      <g className="bp tx-pulse"><circle cx="154" cy="22" r="8" /><circle cx="154" cy="22" r="14" /></g>
      <path d="M120 18 q-6 4 0 8 M112 14 q-10 8 0 16 M188 18 q6 4 0 8 M196 14 q10 8 0 16" className="bp" />
      <text x="20" y="140" fontSize="9" className="bp-text">SOUND + PULSE = LOOK NOW</text>
    </svg>
  );
}
function StateDiagram() {
  return (
    <svg viewBox="0 0 300 150" className="scene tx-diagram" role="img" aria-label="State diagram: the minimized window expands on a critical event, such as a sharp curve or a speed-limit change, then goes back to minimized when it passes.">
      <g className="bp"><rect x="14" y="56" width="92" height="34" rx="6" className="fill" /><rect x="190" y="38" width="96" height="70" rx="6" className="fill" /></g>
      <text x="60" y="77" fontSize="10" textAnchor="middle" className="bp-text">MINIMIZED</text>
      <text x="238" y="77" fontSize="10" textAnchor="middle" className="bp-text">EXPANDED</text>
      <path d="M106 64 C140 30 160 30 190 52" className="bp" /><path d="M182 46 l8 6 l-10 3" className="bp" />
      <path d="M190 96 C160 122 140 122 106 84" className="bp" strokeDasharray="4 4" /><path d="M114 86 l-8 -2 l4 9" className="bp" />
      <text x="148" y="24" fontSize="9" textAnchor="middle" className="bp-text">CURVE / NEW SPEED LIMIT</text>
      <text x="148" y="138" fontSize="9" textAnchor="middle" className="bp-text">EVENT PASSES</text>
    </svg>
  );
}
function LoopDiagram() {
  const steps: [number, number, string, string][] = [
    [10, 20, "1 · THE APP ASKS", "out loud: “give feedback?”"],
    [220, 20, "2 · DRIVER ANSWERS", "by voice, after the beep"],
    [220, 130, "3 · REPORT LOGGED", "no menus, no typing"],
    [10, 130, "4 · TEAMS ACT ON IT", "root-cause what drivers flag"],
  ];
  return (
    <svg viewBox="0 0 400 200" className="scene tx-diagram" role="img" aria-label="Feedback loop: 1, the app asks out loud whether the driver wants to give feedback. 2, the driver answers by voice after the beep. 3, the report is logged with no menus or typing. 4, every team at Traxen, including controls and embedded, uses it to root-cause what drivers flag, and the loop starts again.">
      {steps.map(([x, y, t, d]) => (
        <g key={t}>
          <rect x={x} y={y} width="170" height="50" rx="8" className="bp fill" />
          <text x={x + 10} y={y + 21} fontSize="9.5" className="bp-text">{t}</text>
          <text x={x + 10} y={y + 38} className="bp-text" style={{ fontFamily: "var(--hand)", fontSize: 12, letterSpacing: 0 }}>{d}</text>
        </g>
      ))}
      <path d="M180 45 H220 m-7 -5 l7 5 l-7 5" className="bp" />
      <path d="M305 70 V130 m-5 -7 l5 7 l5 -7" className="bp" />
      <path d="M220 155 H180 m7 -5 l-7 5 l7 5" className="bp" />
      <path d="M95 130 V70 m-5 7 l5 -7 l5 7" className="bp" />
      <text x="200" y="104" fontSize="9" textAnchor="middle" className="bp-text">REPEATS</text>
    </svg>
  );
}
function ThemeDial() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const on = useInView(ref);
  const [hour, setHour] = useState(13);
  const [auto, setAuto] = useState(true);
  useEffect(() => { // sweep through a whole day while on screen, until the viewer takes over
    if (!on || !auto || reduced) return;
    const id = setInterval(() => setHour(h => (h + 0.25) % 24), 90);
    return () => clearInterval(id);
  }, [on, auto, reduced]);
  const night = hour < 6 || hour >= 19;
  const a = (hour / 24) * Math.PI * 2 - Math.PI / 2; // 00:00 at the top
  const hx = 80 + Math.cos(a) * 46, hy = 80 + Math.sin(a) * 46;
  const hh = Math.floor(hour), mm = Math.floor((hour % 1) * 60);
  const pt = (h: number, r = 62) => { const t = (h / 24) * Math.PI * 2 - Math.PI / 2; return `${(80 + Math.cos(t) * r).toFixed(1)} ${(80 + Math.sin(t) * r).toFixed(1)}`; };
  const arc = (from: number, to: number) => `M${pt(from)} A62 62 0 ${to - from > 12 ? 1 : 0} 1 ${pt(to)}`;
  return (
    <div ref={ref} className="tx-theme">
      <div className="tx-theme-row">
        <svg viewBox="0 0 160 160" className="scene tx-diagram tx-theme-dial" aria-hidden>
          <circle cx="80" cy="80" r="62" className="bp" />
          {/* night arc (19:00 → 06:00) drawn thick */}
          <path d={arc(19, 30)} className="bp" style={{ strokeWidth: 7, stroke: "var(--shadow)" }} />
          <path d={arc(6, 19)} className="bp" style={{ strokeWidth: 7, stroke: "#fff" }} />
          {Array.from({ length: 24 }).map((_, i) => { const t = (i / 24) * Math.PI * 2 - Math.PI / 2; return <path key={i} d={`M${80 + Math.cos(t) * 62} ${80 + Math.sin(t) * 62} L${80 + Math.cos(t) * (i % 6 ? 57 : 52)} ${80 + Math.sin(t) * (i % 6 ? 57 : 52)}`} className="bp" />; })}
          <text x="80" y="12" fontSize="8" textAnchor="middle" className="bp-text">00</text>
          <text x="80" y="156" fontSize="8" textAnchor="middle" className="bp-text">12</text>
          <path d={`M80 80 L${hx.toFixed(1)} ${hy.toFixed(1)}`} className="bp" style={{ strokeWidth: 2.4 }} />
          <circle cx={hx} cy={hy} r="7" style={{ fill: night ? "var(--shadow)" : "var(--accent)", stroke: "#fff", strokeWidth: 1.4 }} />
          <circle cx="80" cy="80" r="3" style={{ fill: "#fff" }} />
        </svg>
        <div className={`tx-fw ${night ? "night" : "day"}`} role="img" aria-label={`The floating window in its ${night ? "dark" : "light"} theme`}>
          <span className="tx-fw-speed">65</span>
          <span className="tx-fw-head">12.0 secs</span>
          <span className="tx-fw-mic" aria-hidden><svg viewBox="0 0 24 24" width="18" height="18"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" /><path d="M6 11a6 6 0 0 0 12 0 M12 17v4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg></span>
        </div>
      </div>
      <div className="tx-theme-ctrl">
        <span className="label">{String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")} · {night ? "night → dark theme" : "day → light theme"}</span>
        <input type="range" min={0} max={23.75} step={0.25} value={hour} aria-label="Time of day"
          onChange={e => { setAuto(false); setHour(+e.target.value); }} />
      </div>
      <span className="sr-only" aria-live="polite">{night ? "Dark theme" : "Light theme"}</span>
    </div>
  );
}

export function Feature({ no, title, children, diagram, media }: { no: string; title: string; children: ReactNode; diagram: ReactNode; media: ReactNode }) {
  return (
    <article className="tx-feature">
      <div className="tx-feature-text">
        <span className="label mid">{no}</span>
        <h4 className="display tx-feature-title">{title}</h4>
        {children}
        <div className="tx-feature-diagram"><span className="label mid">broken down ↓</span>{diagram}</div>
      </div>
      <div className="tx-feature-media"><span className="label mid">live ↓</span>{media}</div>
    </article>
  );
}

export function TxDesignWide() {
  return (
    <>
      <Band no="04.1" kicker="from the first idea to the last" title="Revision history">
        <Revisions />
      </Band>
      <Band no="04.2" kicker="hover or tab through the parts" title="Anatomy of the final design">
        <Anatomy />
      </Band>
      <Band no="04.3" kicker="from concept to completion" title="Three ways to use it">
        <div className="tx-loops">
          <LoopCard no="01" title="Just minimize the full app to get started" art={<img src={A("get-window.webp")} alt="Animation: minimizing the Traxen app turns it into the floating window." loading="lazy" />} />
          <LoopCard no="02" title="Need the basics on screen? Put it anywhere" art={<img src={A("placement.webp")} alt="Animation: dragging the floating window to different spots on top of the hours-of-service app." loading="lazy" />} />
          <LoopCard no="03" title="Don't need the full context? Shrink it" art={<img src={A("min-max.webp")} alt="Animation: the floating window switching between maximized and minimized." loading="lazy" />} />
        </div>
      </Band>
      <Band no="04.4" kicker="the features, broken down then live" title="What it does on the road">
        <div className="tx-features">
          <Feature no="F-01 · P1 critical" title="Alerts that save lives" diagram={<TtcDiagram />}
            media={<Shot src={A("collision-warning.webp")} still={A("collision-warning-still.jpg")} alt="Animation: a yellow collision warning takes over the floating window with a 3.0 seconds countdown." caption="SPEC. T1-04-F1 · collision warning" />}>
            <p>A key stakeholder requirement was a safety-critical ADAS warning for potential collisions. I designed it to give the driver time-to-collision, using sound plus a subtle visual pulse. It pulls the driver's attention to the screen at the exact moment of risk: highly glanceable, minimally distracting.</p>
          </Feature>
          <Feature no="F-02 · P2 high" title="The right information at the right time" diagram={<StateDiagram />}
            media={<Shot src={A("alerts-expand.webp")} still={A("alerts-expand-still.jpg")} alt="Animation: the minimized window expands to show a curve-ahead sign, then shrinks again." caption="SPEC. T1-04-F2 · adaptive expand" />}>
            <p>The window adapts to protect both space and safety. It stays out of the way until something critical happens, like a sharp curve or a change in speed limit. Then it expands on its own, from minimized into a high-visibility alert that guides the driver through it.</p>
          </Feature>
          <Feature no="F-03 · feedback" title="Real-time reporting" diagram={<LoopDiagram />}
            media={<Shot src={A("feedback.webp")} still={A("feedback-still.jpg")} alt="Animation: a Give feedback prompt appears and records the driver's voice after a beep." caption="SPEC. T1-04-F3 · voice feedback" />}>
            <p>A low-friction feedback tool that uses text-to-speech to ask drivers for input, so they stay focused on the road. Swapping visual menus for spoken prompts brought in far more field reports. Every team at Traxen now uses them, including the controls and embedded team, to root-cause the issues drivers flag.</p>
          </Feature>
          <Feature no="F-04 · legibility" title="Dynamic theming" diagram={<ThemeDial />}
            media={<Clip src={A("theme-change.mp4")} label="Video: the app switching from the light theme to the dark theme and back." caption="SPEC. T1-04-F4 · day → night → day" chapters={[["☀ Day", 0], ["☾ Night", 9], ["☀ Morning", 21]]} />}>
            <p>A theming system built on Material 3, with light and dark modes for different light conditions. It switches automatically by time of day to support night driving, and WCAG-compliant contrast keeps it legible in glare and in the dark.</p>
          </Feature>
        </div>
      </Band>
      <Band no="04.5" kicker="following rules can be impactful" title="The system underneath">
        <p className="tx-measure">To keep the UI professional and familiar, I anchored it in Material 3 and automotive guidelines. That kept the whole experience consistent and balanced.</p>
        <div className="tx-sys">
          <Shot src={A("sys-type.png")} alt="Typography board: Montserrat, display to body sizes, with a minimum body size for non-crucial information." caption="SPEC. T1-04-S1 · typography" />
          <Shot src={A("sys-consistency.png")} alt="Consistency board: Material 3 and Android Automotive components and states." caption="SPEC. T1-04-S2 · consistency is key" />
          <Shot src={A("sys-palette.png")} alt="Accessibility board: colour palettes with contrast checks for legible text." caption="SPEC. T1-04-S3 · accessibility is king" />
        </div>
      </Band>
    </>
  );
}

// ── 05 BUILD ────────────────────────────────────────────────────────────────
export function TxBuild() {
  return (
    <>
      <p className="tx-lede">Then I built it.</p>
      <p>I engineered the MVP myself, front end and back end, straight from the final designs. Owning the build meant nothing got lost in handoff: the thing drivers used is the thing I designed.</p>
    </>
  );
}

function Pipeline() {
  const stages = ["System design", "XML + front end", "Back end + data layer", "Debug + test"];
  return (
    <svg viewBox="0 0 760 150" className="scene tx-diagram" role="img" aria-label={`Development cycle: ${stages.join(" → ")}, then back to the front end to fix what testing found.`}>
      {stages.map((s, i) => (
        <g key={s}>
          <rect x={10 + i * 190} y="40" width="160" height="54" className="bp" style={{ fill: "var(--blueprint-dk)" }} />
          <text x={90 + i * 190} y="22" fontSize="12" textAnchor="middle" className="bp-text">0{i + 1}</text>
          <text x={90 + i * 190} y={s.includes("+") ? 64 : 72} fontSize="12" textAnchor="middle" className="bp-text" style={{ textTransform: "uppercase" }}>
            {s.includes("+") ? s.split(" + ").map((part, n) => <tspan key={part} x={90 + i * 190} dy={n ? 16 : 0}>{n ? `+ ${part}` : part}</tspan>) : s}
          </text>
          {i < 3 && <path d={`M${170 + i * 190} 67 H${200 + i * 190} m-8 -6 l8 6 l-8 6`} className="bp" />}
        </g>
      ))}
      <path d="M660 94 V128 H280 V94 m-6 8 l6 -8 l6 8" className="bp" strokeDasharray="5 5" />
      <text x="470" y="144" fontSize="10" textAnchor="middle" className="bp-text">WHAT TESTING FOUND GOES BACK IN</text>
    </svg>
  );
}

export function TxBuildWide({ schematic }: { schematic: ReactNode }) {
  return (
    <>
      <Band no="05.1" kicker="the full development cycle" title="Designed it, then wrote it">
        <Pipeline />
        {schematic}
      </Band>
      <Band no="05.2" kicker="field test" title="Testing it in an actual truck">
        <div className="tx-split">
          <figure className="tx-taped">
            <img src={A("live-testing.png")} alt="Two tablets mounted in a truck cab, running the Traxen app during a live test." loading="lazy" />
          </figure>
          <div>
            <p>I ran in-vehicle and simulated guerrilla tests to validate the MVP, catch bugs and hear straight from drivers, then debugged from what I found before launch.</p>
            <Say pose="csWrench" alt="A small Muskaan tightening a bolt">Just me testing in the truck. heheheehehe :&#125;</Say>
          </div>
        </div>
      </Band>
    </>
  );
}

// ── 06 IMPACT ───────────────────────────────────────────────────────────────
const TAKEAWAYS: [string, string][] = [
  ["Design is an evolution, not a destination", "I learned to detach my ego from my work. My first designs often felt like my strongest, and stakeholder feedback and user testing were a rude awakening that led somewhere much better. Great products come from iterating, failing and refining."],
  ["The user is the ultimate decision-maker", "A product has to fit into the workflow people already have, not force a new one. By reducing cognitive load and keeping the UI seamless, adoption went up 94%. Respect the user's mental model and engagement follows."],
  ["Think beyond the happy path", "With a developer's brain, I design for when things go wrong, not just when they go right. That made the system robust to edge cases and technical limits, like tricky Android permission settings, which became one of the most valuable lessons of the project."],
];

// a small her for each takeaway (each pose is used only here)
const TAKEAWAY_ART = [
  <img key="evo" src="/art/kit-brainstorm-ink.png" alt="Muskaan rearranging sticky notes on a wall, hand on her chin, thinking" />,
  <Mini key="user" pose="txListen" label="A small Muskaan with a hand cupped to her ear, listening" tone="paper" />,
  <Mini key="edge" pose="txUmbrella" label="A small Muskaan under an umbrella in the rain" tone="paper" />,
];

export function TxImpactWide({ next }: { next: { slug: string; label: string } }) {
  return (
    <>
      <Band no="06.1" kicker="key takeaways" title="What I'm keeping">
        <div className="tx-loops">
          {TAKEAWAYS.map(([t, b], i) => <LoopCard key={t} no={`0${i + 1}`} title={t} art={TAKEAWAY_ART[i]}>{b}</LoopCard>)}
        </div>
      </Band>
      <div className="tx-end">
        <Say pose="csThumbs" alt="A small Muskaan giving a thumbs-up">Enjoyed the read? There's a lot more to this story.</Say>
        <p className="tx-measure">This is a snapshot of my work on the driver experience at Traxen. If you want to talk automotive UX, design systems, or the messy middle of building something new, I'd love to hear from you.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
        </div>
      </div>
      <Dim>end of T1</Dim>
    </>
  );
}

/** The walkthrough, at the top of the case study (like GuardianCare): plays muted on its own, sound on demand. */
export function TxHeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => { const v = ref.current; if (!v) return; v.muted = true; v.setAttribute("muted", ""); if (!reduced) v.play().catch(() => {}); }, [reduced]);
  return (
    <figure className="specimen tx-shot gc-hero-video">
      <video ref={ref} src={A("walkthrough.mp4")} muted autoPlay={!reduced} loop playsInline controls preload="auto" poster={A("alerts-expand-still.jpg")}
        aria-label="Video walkthrough of the Traxen floating window and all its features." />
      <figcaption>SPEC. T1-00 · the whole thing, start to finish · playing muted, unmute in the controls</figcaption>
    </figure>
  );
}
