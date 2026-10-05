// LUXURY VEHICLE × GM — the full case study, told as drawing sheets like Traxen and BuyMySpot.
// Source: the team's SI 594 final presentation (Figma bdSDqOQTI8Ow6KchbINTqS, pages "Presentation Slides" +
// "components"). Only the deck's own facts. Her rules: no teammate names, no numbers from her résumé,
// every fact has one home. Screens are cut from the deck renders (scripts/process-gm-2026-10.py).
// Pattern on every sheet: broken down (a blueprint diagram) → live (the real screens, or a working recreation) → comic (a small her).
import { useState, type ReactNode } from "react";
import { Mini } from "./Minis";
import { Chamfer, Dim } from "./ui";
import { Band, LoopCard, Say, Shot } from "./TraxenCase";
import { CabinSim } from "./GmSim";
import { go } from "./nav";

const A = (f: string) => `/case-studies/gm/${f}`;
const FIGMA = "https://www.figma.com/design/bdSDqOQTI8Ow6KchbINTqS/Final-Presentation-SI-594?node-id=0-1";
const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// ── building blocks ─────────────────────────────────────────────────────────
/** A car screen in a thin bezel. */
function Screen({ src, alt, caption, className = "" }: { src: string; alt: string; caption?: string; className?: string }) {
  return (
    <figure className={`gm-screen ${className}`}>
      <div className="gm-bezel"><img src={src} alt={alt} loading="lazy" /></div>
      {caption && <figcaption className="label">{caption}</figcaption>}
    </figure>
  );
}
/** The companion phone app (393 × 852). */
function Phone({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="gm-phone">
      <div className="gm-phone-body"><img src={src} alt={alt} loading="lazy" /></div>
      {caption && <figcaption className="label">{caption}</figcaption>}
    </figure>
  );
}
function Chips<T extends string>({ items, value, onPick, label }: { items: [T, string][]; value: T; onPick: (v: T) => void; label: string }) {
  return (
    <div className="tx-toggle" role="group" aria-label={label}>
      {items.map(([k, l]) => <button key={k} className={`ct-chip ${value === k ? "on" : ""}`} aria-pressed={value === k} onClick={() => onPick(k)}>{l}</button>)}
    </div>
  );
}

// ── 01 OVERVIEW ─────────────────────────────────────────────────────────────
// Role / team / timeline / tools live in the hero's spec table only.
export function GmOverview() {
  return (
    <>
      <p className="tx-lede">A luxury cabin should feel like yours, and stay calm at speed.</p>
      <p>For SI 594 at the University of Michigan, we wrote a design proposal for GM's luxury customer segment: one in-vehicle experience spread across four connected surfaces. Tap a surface in 01.1 to see what lives where.</p>
    </>
  );
}

type Surface = "cc" | "dd" | "fc" | "ph";
// boxes are % of cabin.webp (x, y, w, h)
const SURFACES: Record<Surface, { name: string; does: string; box: [number, number, number, number]; more: [string, string] }> = {
  ph: { name: "Companion app", does: "The car in your pocket: the theme, the exact cabin temperature, locks and messages.", box: [0.4, 6.5, 20.4, 87.5], more: ["Phone screens", "gm-kd1"] },
  dd: { name: "Driver display", does: "The cluster behind the wheel: speed, heading, battery and range, with navigation and voice modes.", box: [26.8, 22, 29.1, 23.3], more: ["The cluster", "gm-kd2"] },
  cc: { name: "Central console", does: "Home base: a greeting, today's calendar, the route and the music, all over the sky theme.", box: [58.1, 4.4, 40.6, 40.6], more: ["Sky theme", "gm-kd1"] },
  fc: { name: "Front console", does: "A dedicated climate panel for driver and passenger, front and rear.", box: [58.4, 58, 14.6, 41], more: ["Climate", "gm-kd3"] },
};
const ORDER: Surface[] = ["ph", "dd", "cc", "fc"];

/** The real cabin, with each surface as a button (pins like Traxen's anatomy band). */
function CabinMap() {
  const [s, setS] = useState<Surface>("cc");
  const x = SURFACES[s];
  return (
    <div className="gm-cabin">
      <div className="gm-cabin-img">
        <img src={A("cabin.webp")} alt="The whole cabin: the companion app on the left, then the driver display and the central console side by side over a starry 'Linda · Sagittarius' strip, and the front console climate panel below." />
        {ORDER.map((k, i) => {
          const [l, t, w, h] = SURFACES[k].box;
          return (
            <button key={k} className={`gm-hot ${s === k ? "on" : ""}`} style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }} onClick={() => setS(k)} aria-pressed={s === k} aria-label={SURFACES[k].name}>
              <span className="tx-pin static">{i + 1}</span>
            </button>
          );
        })}
      </div>
      <div className="gm-cabin-side" aria-live="polite">
        <Chips label="Surfaces" value={s} onPick={setS} items={ORDER.map((k, i) => [k, `${i + 1} · ${SURFACES[k].name}`] as [Surface, string])} />
        <h4 className="display gm-cabin-name">{x.name}</h4>
        <p>{x.does}</p>
        <button className="label dimlink gm-link" onClick={() => jump(x.more[1])}>see it in the design sheet → {x.more[0]}</button>
      </div>
    </div>
  );
}

export function GmOverviewWide() {
  return <Band no="01.1" kicker="tap a surface" title="Four screens, one cabin"><CabinMap /></Band>;
}

// ── 02 RESEARCH ─────────────────────────────────────────────────────────────
export function GmResearch() {
  return (
    <>
      <p className="tx-lede">Millennials (34–40) at the wheel: personalization drives luxury car loyalty.</p>
      <p>We started from who buys luxury cars now and what keeps them loyal, using industry research (CarGurus' dealer research on today's luxury buyers, McKinsey's five trends shaping the luxury-car market), then looked at what the competition was already doing.</p>
    </>
  );
}

const BENCH: [string, string][] = [["2022", "BMW i7"], ["2019", "Porsche Taycan"], ["2021", "Mercedes-Benz EQS"], ["2021", "Tesla Model S"]];
const TRENDS: [string, string][] = [
  ["Wellness integration", "Ambient lighting, massage seats and fragrance create personalized wellness profiles."],
  ["Individual control", "In-car profiles let passengers adjust sound, temperature and visuals for a customized journey."],
];

type Prob = "overload" | "generic" | "load";
const PROBLEMS: Record<Prob, { t: string; a: number; answers: [string, string, string][] }> = {
  overload: { t: "Information overload", a: -90, answers: [["04.2", "A cluster that puts the crucial information where the wheel won't hide it", "gm-kd2"]] },
  generic: { t: "Intrusive and generic", a: 150, answers: [["04.1", "A sky theme the driver picks for their mood (or none at all)", "gm-kd1"], ["04.3", "Alerts that are visible without taking over", "gm-alerts"]] },
  load: { t: "Complex task → cognitive load", a: 30, answers: [["04.2", "Three ways in: the wheel, voice or touch", "gm-kd2"], ["04.4", "A dedicated climate panel, and a number pad for exact values", "gm-kd3"]] },
};

/** The problem dial from the deck: three ticks around "in-cabin experience". Pick one to see where the design answers it. */
function ProblemDial() {
  const [p, setP] = useState<Prob>("overload");
  const pr = PROBLEMS[p];
  return (
    <div className="tx-split" style={{ alignItems: "start" }}>
      <svg viewBox="0 0 420 380" className="tx-diagram" aria-hidden>
        <circle cx="210" cy="190" r="150" className="bp" strokeDasharray="3 5" /><circle cx="210" cy="190" r="96" className="bp" />
        <text x="210" y="186" textAnchor="middle" className="bp-text" fontSize="13">IN-CABIN</text><text x="210" y="204" textAnchor="middle" className="bp-text" fontSize="13">EXPERIENCE</text>
        {(Object.keys(PROBLEMS) as Prob[]).map(k => {
          const a = (PROBLEMS[k].a * Math.PI) / 180, on = k === p;
          const x1 = 210 + Math.cos(a) * 72, y1 = 190 + Math.sin(a) * 72, x2 = 210 + Math.cos(a) * 94, y2 = 190 + Math.sin(a) * 94;
          return <path key={k} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={on ? "var(--accent)" : "var(--white)"} strokeWidth={on ? 8 : 5} strokeLinecap="round" />;
        })}
      </svg>
      <div>
        <Chips label="Problems in the cabin" value={p} onPick={setP} items={(Object.keys(PROBLEMS) as Prob[]).map(k => [k, PROBLEMS[k].t])} />
        <h4 className="display gm-prob">{pr.t}</h4>
        <p className="label mid">where the design answers it</p>
        <ul className="gm-answers">
          {pr.answers.map(([no, t, id]) => <li key={no + t}><button className="gm-answer" onClick={() => jump(id)}><span className="tx-band-no label">{no}</span><span>{t}</span><span aria-hidden>→</span></button></li>)}
        </ul>
      </div>
    </div>
  );
}

export function GmResearchWide() {
  return (
    <>
      <Band no="02.1" kicker="competitive analysis" title="What the competition does">
        <div className="tx-split" style={{ alignItems: "start" }}>
          <div>
            <p className="label mid">benchmarked</p>
            <ol className="gm-bench">{BENCH.map(([y, c]) => <li key={c}><span className="label">{y}</span><span className="display">{c}</span></li>)}</ol>
          </div>
          <div className="gm-trends">
            <p className="label mid">emerging trends</p>
            {TRENDS.map(([t, d], i) => <article key={t} className="gm-trend"><span className="tx-loop-no display">0{i + 1}</span><h4 className="display">{t}</h4><p>{d}</p></article>)}
          </div>
        </div>
      </Band>
      <Band no="02.2" kicker="problem statement" title="Three things wrong with the cabin today">
        <ProblemDial />
        <Say pose="gmTrend" alt="A small Muskaan pointing at a little chart with a rising line">Personal wins. Loud loses.</Say>
      </Band>
    </>
  );
}

// ── 03 DEFINE ───────────────────────────────────────────────────────────────
export function GmDefine() {
  return (
    <>
      <p className="tx-lede">Customer segment 3: luxury.</p>
      <p>Our brief said luxury cars should have four things: comfort, features, convenience and an in-vehicle theme. Every screen is designed for one driver, Linda: the cabin greets her by name and shows her star sign, Sagittarius.</p>
      <p className="tx-hmw">How might we make a luxury cabin feel <em>personal</em> without adding to the driver's <em>cognitive load</em>?</p>
    </>
  );
}

const PILLARS: [string, string, string, string][] = [
  ["Comfort", "a dedicated climate panel: driver and passenger, front and rear", "04.4", "gm-kd3"],
  ["Features", "a cluster with navigation and voice modes", "04.2", "gm-kd2"],
  ["Convenience", "the companion app: exact temperature, locks, messages", "04.3", "gm-alerts"],
  ["In-vehicle theme", "four skies to choose from, or none", "04.1", "gm-kd1"],
];
// the brief's own sizes; inches are drawn to one scale (24 px per inch)
const SIZES: { n: string; w: number; h: number; t: string }[] = [
  { n: "Central console", w: 14, h: 7, t: '7" × 14"' }, { n: "Driver display", w: 10, h: 4, t: '4" × 10"' }, { n: "Front console", w: 5, h: 7, t: '7" × 5"' },
];

export function GmDefineWide() {
  const [on, setOn] = useState(0);
  return (
    <>
      <Band no="03.1" kicker="the brief → where it landed" title="Four things a luxury car should have">
        <div className="gm-pillars">
          {PILLARS.map(([t, d, no, id]) => (
            <button key={t} className="gm-pillar" onClick={() => jump(id)}>
              <span className="display">{t}</span><span>{d}</span><span className="label mid">{no} →</span>
            </button>
          ))}
        </div>
      </Band>
      <Band no="03.2" kicker="screen size requirements" title="Drawn to scale">
        <div className="tx-split">
          <svg viewBox="0 0 640 350" className="tx-diagram" role="img" aria-label="The three in-car screens drawn to one scale: central console 7 by 14 inches, driver display 4 by 10 inches, front console 7 by 5 inches.">
            <text x="10" y="24" className="bp-text" fontSize="12">ONE SCALE · 24 PX = 1 INCH</text>
            {SIZES.map((z, i) => {
              const [x, y] = [[10, 40], [370, 40], [370, 160]][i];
              const sel = i === on;
              return <rect key={z.n} x={x} y={y} width={z.w * 24} height={z.h * 24} className="bp" onMouseEnter={() => setOn(i)}
                style={{ fill: sel ? "var(--blueprint-dk)" : "transparent", strokeWidth: sel ? 2.6 : 1.2, cursor: "pointer" }} />;
            })}
            {SIZES.map((z, i) => { const [x, y] = [[10, 40], [370, 40], [370, 160]][i]; return <text key={z.n} x={x + (z.w * 24) / 2} y={y + (z.h * 24) / 2 + 4} textAnchor="middle" className="bp-text" fontSize="11" style={{ pointerEvents: "none" }}>{z.t}</text>; })}
          </svg>
          <div>
            <Chips label="Screens" value={String(on)} onPick={v => setOn(+v)} items={SIZES.map((z, i) => [String(i), z.n] as [string, string])} />
            <p className="display gm-size">{SIZES[on].t}</p>
            <p>Plus the companion app on the phone, designed at 393 × 852 px.</p>
            <Say pose="gmScreen" alt="A small Muskaan holding up an empty screen frame labelled 7 by 14 inches">Measure twice, design once.</Say>
          </div>
        </div>
      </Band>
    </>
  );
}

// ── 04 DESIGN ───────────────────────────────────────────────────────────────
export function GmDesign() {
  return (
    <>
      <p className="tx-lede">Three key decisions. Take them for a drive first.</p>
      <p>04.1 is the whole cabin rebuilt in code: steer the cluster from the wheel, talk to it, change the sky, set the climate, and see how an alert behaves. Then each decision, with the real screens.</p>
    </>
  );
}

// the phone's number pad, working (04.5)
function NumPad() {
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [cur, setCur] = useState(21.4); // stored in °C
  const [typed, setTyped] = useState("");
  const show = (c: number) => (unit === "C" ? c : c * 9 / 5 + 32).toFixed(1).replace(/\.0$/, "");
  const key = (k: string) => setTyped(t => (k === "." && t.includes(".")) || t.length >= 4 ? t : t + k);
  const set = () => { const v = parseFloat(typed); if (!isNaN(v)) setCur(unit === "C" ? v : (v - 32) * 5 / 9); setTyped(""); };
  return (
    <div className="gm-phone gm-numpad" role="group" aria-label="Recreated companion-app number pad for the cabin temperature">
      <div className="gm-phone-body gm-np">
        <p className="gm-np-cap">Current Temperature</p>
        <p className="gm-np-now" aria-live="polite">{show(cur)} °{unit}</p>
        <div className="gm-np-field"><span>{typed || `${show(cur)} °${unit}`}</span><button onClick={set}>Set</button></div>
        <div className="gm-np-keys">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((n, i) => <button key={n} style={{ gridRow: Math.floor(i / 3) + 1, gridColumn: (i % 3) + 1 }} onClick={() => key(n)}>{n}</button>)}
          <button className="zero" onClick={() => key("0")}>0</button><button style={{ gridRow: 4, gridColumn: 3 }} onClick={() => key(".")}>.</button>
          <button className={`unit c ${unit === "C" ? "on" : ""}`} onClick={() => { setUnit("C"); setTyped(""); }} aria-pressed={unit === "C"}>°C</button>
          <button className={`unit f ${unit === "F" ? "on" : ""}`} onClick={() => { setUnit("F"); setTyped(""); }} aria-pressed={unit === "F"}>°F</button>
        </div>
      </div>
      <figcaption className="label">try it · type a temperature, press Set</figcaption>
    </div>
  );
}

/** A key decision, the way the class decks presented them: headline + two points on the left, labelled screens on the right. */
function Decision({ id, no, kicker, title, points, children, foot }: { id: string; no: string; kicker: string; title: string; points: [string, string][]; children: ReactNode; foot?: ReactNode }) {
  return (
    <div id={id} style={{ scrollMarginTop: 80 }}>
      <Band no={no} kicker={kicker} title={title}>
        <div className="kd">
          <div>
            <ul className="kd-points">{points.map(([b, t]) => <li key={b}><b>{b}</b>{t}</li>)}</ul>
            <button className="label dimlink gm-link kd-try" onClick={() => jump("gm-sim")}>↑ try it in the cabin (04.1)</button>
            {foot}
          </div>
          <div className="kd-shots">{children}</div>
        </div>
      </Band>
    </div>
  );
}
const Labelled = ({ label, children }: { label: string; children: ReactNode }) => <div><p className="gm-shot-label">{label}</p>{children}</div>;

const TRY: string[] = ["Press ▶ on the wheel, or say “navigation”", "Say or type “sunset sky”, or tap Themes on the console", "Drag a climate slider; toggle SYNC", "Press Drive, then “Car ahead brakes”"];

export function GmDesignWide() {
  return (
    <>
      <div id="gm-sim" style={{ scrollMarginTop: 80 }}>
        <Band no="04.1" kicker="the cabin, rebuilt in code · drive it" title="Take the cabin for a spin">
          <ol className="gm-try" aria-label="Things to try">{TRY.map((t, i) => <li key={t}><span className="tx-band-no label">0{i + 1}</span>{t}</li>)}</ol>
          <CabinSim />
          <p className="label mid" style={{ marginTop: 10 }}>a working sketch of the proposal · voice uses your browser's speech recognition (Chrome, Edge, Safari); typing works everywhere</p>
        </Band>
      </div>

      <Decision id="gm-kd1" no="04.2" kicker="key decision 1 · personalization" title="Customizable sky theme"
        points={[["Four skies, one tap", "Not just one, but four options: the driver changes the car's sky to fit the mood they're in, or want their car to be in."], ["Or none at all", "A Default option keeps the cabin plain for drivers who want nothing on it."]]}
        foot={<Say pose="gmStars" alt="A small Muskaan reaching up to hang a star in the sky">Pick a sky. Any sky.</Say>}>
        <div className="kd-pair">
          <Labelled label="Theme picker · Constellation"><Screen src={A("cc-theme-constellation.webp")} alt="The theme picker on the central console: Constellation selected (blue), over a dark night sky." /></Labelled>
          <Labelled label="Theme picker · Sunrise"><Screen src={A("cc-theme-sunrise.webp")} alt="The theme picker: Sunrise selected (yellow), over a dusky sky with pine silhouettes." /></Labelled>
        </div>
        <div className="kd-pair">
          <Labelled label="Phone · your star sign"><Phone src={A("m-settings-constellation.webp")} alt="Companion app settings: 'Howdy, Linda', Constellation selected, 'Set your StarShine: Sagittarius', cabin light at 40%." /></Labelled>
          <Labelled label="Phone · your sunset colour"><Phone src={A("m-settings-sunset.webp")} alt="Companion app settings: Sunset selected, 'Set your sunset colour: Pink Hues', cabin light at 40%." /></Labelled>
        </div>
        <p className="label mid">the seven-icon nav bar follows Nielsen Norman Group's (2023) icon-usability guidelines</p>
      </Decision>

      <Decision id="gm-kd2" no="04.3" kicker="key decision 2 · IC optimization" title="A cluster that respects the wheel"
        points={[["Prioritization", "The crucial information on the driver display is placed around where the steering wheel sits, in both default and navigation modes."], ["Multi input-modality", "Features can be activated with the steering-wheel controls, by voice, or by touching the screen directly."]]}>
        <Labelled label="Driver display · default mode"><Screen src={A("dd-default-hi.webp")} alt="Driver display, default mode: a speed dial reading 100 at left, a compass in the centre, 65% battery and 31 miles of range at right." /></Labelled>
        <div className="kd-pair">
          <Labelled label="Navigation mode"><Screen src={A("dd-nav-small.webp")} alt="Driver display, navigation mode: a map with 'Turn left onto Clay St, 500 m', speed in the lane view, music on the right." /></Labelled>
          <Labelled label="Voice assistant activated"><Screen src={A("dd-voice.webp")} alt="Driver display with the voice assistant listening: the map, the speed, and a glowing 'Listening' shape on the right." /></Labelled>
        </div>
        <div className="kd-pair">
          <Labelled label="Selection menu on the wheel"><Screen src={A("wheel-menu.webp")} alt="The selection menu on the wheel: Menu up/inc, Menu down/dec, Prev, Next and a centre button." className="gm-small" /></Labelled>
          <Labelled label="Where it sits"><Screen src={A("wheel-line.webp")} alt="A line drawing of the steering wheel showing where the control sits under the right thumb." className="gm-small" /></Labelled>
        </div>
      </Decision>

      <Decision id="gm-alerts" no="04.4" kicker="key decision 2 · non-intrusive alerts" title="Alerts that stay visible"
        points={[["Never behind the wheel", "Alerts are visible and evident without being limited by the physicality of the steering wheel."], ["Safety first for ADAS", "The advanced driving assistant system gives visual feedback on the driver display to alert the driver."]]}>
        <Labelled label="Visible alerts · the corners the wheel never covers"><Screen src={A("dd-alerts.webp")} alt="The driver display with the steering wheel's outline drawn over it; the warning lights sit in the top corners, outside the area the wheel covers." /></Labelled>
        <div className="kd-pair">
          <Labelled label="ADAS · all clear"><Screen src={A("adas-clear.webp")} alt="ADAS view: the car in its lane with a calm blue ring; cars ahead in the other lanes." /></Labelled>
          <Labelled label="ADAS · Brake!"><Screen src={A("adas-brake.webp")} alt="ADAS view: a red ring around the car and 'Brake!' at the top." /></Labelled>
        </div>
        <div className="kd-pair">
          <Labelled label="Phone · security"><Phone src={A("m-windows.webp")} alt="Companion app security screen: 'Windows open' in red over a top view of the car with a lock on each door." /></Labelled>
          <Labelled label="Phone · message centre"><Phone src={A("m-messages.webp")} alt="Companion app message centre: 'Vehicle is in good condition', then notifications for the cabin temperature, locking and charging." /></Labelled>
        </div>
      </Decision>

      <Decision id="gm-kd3" no="04.5" kicker="key decision 3 · driver–passenger controls" title="A dedicated climate panel"
        points={[["A slider on the console", "The driver changes the temperature quickly and accurately with a slider on the front console. The volume slider uses the same format."], ["A number pad on the phone", "Entering an exact number on the companion app is faster and more efficient."]]}
        foot={<Say pose="gmThermo" alt="A small Muskaan turning a big climate dial set to 21 degrees">21.4°. Exactly.</Say>}>
        <div className="kd-pair">
          <Labelled label="Front console · climate"><Screen src={A("fc-climate-hi.webp")} alt="Front console climate panel: A/C, Auto, On, Off along the top; front and rear temperature sliders at 21°C; sync; two seats with auto buttons; fan and seat-heat controls." /></Labelled>
          <Labelled label="Phone · number pad (working)"><NumPad /></Labelled>
        </div>
        <Labelled label="Same slider, for volume"><Screen src={A("cc-volume.webp")} alt="The volume control on the central console: a vertical slider in the same style as the climate sliders." className="gm-small" /></Labelled>
      </Decision>
    </>
  );
}

// ── 05 SYSTEM ───────────────────────────────────────────────────────────────
export function GmSystem() {
  return (
    <>
      <p className="tx-lede">One dark system for four screens.</p>
      <p>Every surface shares the same colours, type and components, so the cabin reads as one product. Here it is rebuilt live from the file.</p>
    </>
  );
}

const COLORS: [string, string][] = [["Dark Gray", "#111111"], ["Azure Blue", "#1463FD"], ["Sky Blue", "#59C1FA"], ["Red", "#FF4242"], ["Lime Green", "#9AE77E"]];
const lum = (hex: string) => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

export function GmSystemWide() {
  const [w, setW] = useState<400 | 500 | 700>(500);
  return (
    <>
      <Band no="05.1" kicker="colour · checked against the dark background" title="Five colours">
        <div className="gm-swatches">
          {COLORS.map(([n, h]) => {
            const r = ratio(h, "#111111");
            return (
              <div key={h} className="gm-swatch">
                <span className="gm-chip" style={{ background: h }} />
                <span className="display">{n}</span><span className="label">{h}</span>
                <span className="label mid">{h === "#111111" ? "the background" : `${r.toFixed(1)}:1 on #111111`}</span>
              </div>
            );
          })}
        </div>
      </Band>
      <Band no="05.2" kicker="type" title="Karla, in three sizes">
        <Chips label="Weight" value={String(w)} onPick={v => setW(+v as 400 | 500 | 700)} items={[["400", "Regular"], ["500", "Medium"], ["700", "Bold"]]} />
        <div className="gm-type">
          {[20, 18, 14].map(s => <p key={s} style={{ fontSize: s, fontWeight: w }}><span className="label mid">Karla · {s}px</span> Welcome back, Linda! Resume route · 24 km · 13 mins</p>)}
        </div>
      </Band>
      <Band no="05.3" kicker="icons · components" title="44 × 44, everywhere">
        <div className="tx-split" style={{ alignItems: "start" }}>
          <Shot src={A("ds-icons.webp")} alt="The icon set: phone, music, home, apps, navigation, volume, brightness, Bluetooth, Wi-Fi, signal, lights, camera, heart, search, play, pause, settings, seat heat, fan, battery and more, with one icon measured at 44 by 44 px." caption="SPEC. V4-05 · icon set · 44 px touch target" />
          <div>
            <p>Every icon sits on a 44 × 44 px target, from the nav bar to the climate panel.</p>
            <Say pose="gmIcon" alt="A small Muskaan measuring a single icon tile with little dimension arrows">44. I checked. Twice.</Say>
          </div>
        </div>
        <Shot src={A("ds-components.webp")} alt="Components: the speed dial, a destination bar, auto and seat-heat buttons, a battery gauge, a compass, light and on/off toggles, the lane view, the map card, the voice-assistant glow, a store icon and plus/minus steppers." caption="SPEC. V4-05 · components · shared by all four surfaces" />
      </Band>
    </>
  );
}

// ── 06 OUTCOME ──────────────────────────────────────────────────────────────
export function GmOutcome() {
  return (
    <>
      <p className="tx-lede">So, what did we propose?</p>
      <p>Four screens that work as one cabin: personal when you want it to be, quiet when you're driving.</p>
    </>
  );
}

const REFS: [string, string][] = [
  ["Dealer Resource Center (CarGurus). Who are today's in-market new luxury car buyers?", "https://dealers.cargurus.com/drc/who-are-todays-in-market-new-luxury-car-buyers"],
  ["Zhang, T., Liu, X., Zeng, W., Tao, D., Li, G., & Qu, X. (2023). Input modality matters: A comparison of touch, speech, and gesture based in-vehicle interaction. Applied Ergonomics, 108, 103958.", "https://doi.org/10.1016/j.apergo.2022.103958"],
  ["Guan, M., Köstring, J., Middleton, S., & Möller, T. (2022, July 8). Five trends shaping tomorrow's luxury-car market. McKinsey & Company.", "https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/five-trends-shaping-tomorrows-luxury-car-market"],
];

/** Small ink drawings for the outcome cards (line art on the white panel, like Traxen's takeaways). */
function Ink({ k }: { k: "sky" | "wheel" | "dial" }) {
  return (
    <svg viewBox="0 0 120 90" className="tx-ink" aria-hidden>
      {k === "sky" && <><path d="M14 72 h92" /><path d="M30 72 a30 30 0 0 1 60 0" /><path d="M60 22 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" className="tx-fill" /><path d="M24 22 l1.6 4 l4 1.6 l-4 1.6 l-1.6 4 l-1.6 -4 l-4 -1.6 l4 -1.6 z M96 30 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4 z" /></>}
      {k === "wheel" && <><path d="M8 18 Q60 4 112 18 V44 Q60 36 8 44 Z" /><circle cx="60" cy="58" r="26" className="tx-thick" /><circle cx="60" cy="58" r="7" /><path d="M34 58 h19 M67 58 h19 M60 65 v19" /><circle cx="16" cy="24" r="3" className="tx-dot" /><circle cx="104" cy="24" r="3" className="tx-dot" /></>}
      {k === "dial" && <><circle cx="60" cy="46" r="30" className="tx-thick" /><circle cx="60" cy="46" r="20" /><path d="M60 16 v10" className="tx-thick" /><text x="60" y="52" textAnchor="middle" fontSize="16" style={{ fill: "var(--blueprint-dk)", stroke: "none", fontFamily: "var(--mono)" }}>21°</text><path d="M24 30 a40 40 0 0 1 12 -14" /><path d="M32 13 l4 3 l-5 2" /></>}
    </svg>
  );
}

export function GmOutcomeWide({ next }: { next: { slug: string; label: string } }) {
  return (
    <>
      <Band no="06.1" kicker="the proposal, in one line each" title="What it adds up to">
        <div className="tx-loops">
          <LoopCard no="01" title="Personal, not generic: a sky for every mood, or none" art={<Ink k="sky" />} />
          <LoopCard no="02" title="Calm at speed: crucial info around the wheel, alerts it can't hide" art={<Ink k="wheel" />} />
          <LoopCard no="03" title="Exact when it matters: a climate panel of its own" art={<Ink k="dial" />} />
        </div>
      </Band>
      <Band no="06.2" kicker="what the research stood on" title="References">
        <ol className="gm-refs">{REFS.map(([t, u]) => <li key={u}>{t} <a className="dimlink" href={u} target="_blank" rel="noreferrer">link ↗</a></li>)}</ol>
      </Band>
      <div className="tx-end">
        <Say pose="gmKeys" alt="A small Muskaan dangling a set of car keys, winking">Keys are in. Want a ride?</Say>
        <p className="tx-measure">Automotive is where screens, people and moving metal meet, and it's where I work every day now. If you're building in-vehicle experiences, I'd love to talk.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
          <Chamfer href={FIGMA} external>Every screen in Figma ↗</Chamfer>
          <Chamfer onClick={() => go(`#/case/${next.slug}`)}>Next print → {next.label}</Chamfer>
        </div>
      </div>
      <Dim>end of V4</Dim>
    </>
  );
}
