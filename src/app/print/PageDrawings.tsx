// Faint engineering drawings behind the non-case-study pages (the case studies have their own truck,
// parking, car and robot drawings). Same style: precise white lines, low opacity, decorative only.
// One drawing per page, none repeated: Garage = workbench + pegboard, Lab = lab bench, About = desk
// elevation, Contact = mailbox, Résumé = a stack of drawing sheets.

const Dim = ({ x1, x2, y, t }: { x1: number; x2: number; y: number; t: string }) => (
  <g className="tb-dim">
    <path d={`M${x1} ${y - 10} V${y + 10} M${x2} ${y - 10} V${y + 10} M${x1} ${y} H${x2}`} />
    <path d={`M${x1} ${y} l10 -4 v8 z M${x2} ${y} l-10 -4 v8 z`} className="tb-solid" />
    <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">{t}</text>
  </g>
);
const Balloon = ({ x, y, n, tx, ty }: { x: number; y: number; n: string; tx: number; ty: number }) => (
  <g><path d={`M${x} ${y} L${tx} ${ty}`} /><circle cx={tx} cy={ty} r="16" /><text x={tx} y={ty + 5} textAnchor="middle" className="tb-text">{n}</text></g>
);

/** Garage: a pegboard with tools over a workbench, a toolbox and a stool. */
function Garage() {
  return (
    <svg viewBox="0 0 1100 620">
      <rect x="120" y="40" width="760" height="300" />
      {Array.from({ length: 11 }).map((_, r) => Array.from({ length: 25 }).map((_, c) => <circle key={`${r}-${c}`} cx={150 + c * 29} cy={66 + r * 26} r="2" />))}
      <path d="M200 90 v120 M188 210 h24 l-4 30 h-16 z" /><path d="M300 90 l40 150 M330 236 l20 -6" /><circle cx="300" cy="90" r="8" />
      <path d="M430 100 h70 v24 h-70 z M462 124 v110" /><path d="M560 96 a40 40 0 1 0 0.1 0 M560 136 v100" />
      <path d="M660 90 l-20 60 h40 z M660 150 v90" /><path d="M760 100 h60 v140 h-60 z M770 120 h40 M770 140 h40 M770 160 h40" />
      <path d="M80 380 H920 V404 H80 Z" /><path d="M110 404 V600 M890 404 V600 M110 520 H890" />
      <path d="M200 340 h140 v40 h-140 z M210 352 h120" />
      <path d="M600 330 h180 v50 h-180 z M600 345 h180 M680 330 v-14 h20 v14" />
      <path d="M960 600 V470 h80 v130 M950 470 h100 M970 540 h60" />
      <path d="M40 600 H1080" />
      <Dim x1={80} x2={920} y={440} t="WORKBENCH · 2400" />
      <Balloon x={560} y={136} n="1" tx={960} ty={90} /><Balloon x={690} y={355} n="2" tx={990} ty={300} />
    </svg>
  );
}

/** Lab: a bench with flasks, a beaker, a microscope and a laptop. */
function Lab() {
  return (
    <svg viewBox="0 0 1100 560">
      <path d="M60 400 H1040 V424 H60 Z M90 424 V540 M1010 424 V540 M40 540 H1060" />
      <path d="M180 400 V300 l-40 -100 h80 l-40 100 M150 200 h60 M160 330 h40" /><path d="M150 360 h60" className="tb-center" />
      <path d="M300 400 V250 h70 v150 M300 300 h70 M310 330 h20 M310 360 h30" />
      <path d="M470 400 h120 M500 400 v-30 h60 v30 M530 370 V230 M500 230 h60 v-40 h-60 z M530 190 V150 M515 150 h30 M560 300 l60 -40" /><circle cx="530" cy="300" r="22" />
      <path d="M700 400 h200 l-20 -10 h-160 z M720 390 V260 h160 v130 M740 280 h120 v90 h-120 z" />
      <path d="M760 300 h50 M760 320 h80 M760 340 h60" />
      <path d="M960 400 V340 a30 30 0 0 1 60 0 V400 M960 360 h60" />
      <Dim x1={140} x2={220} y={170} t="250 ML" /><Dim x1={720} x2={880} y={230} t="14 IN" />
      <Balloon x={530} y={230} n="A" tx={420} ty={110} /><Balloon x={800} y={320} n="B" tx={960} ty={200} />
    </svg>
  );
}

/** About: a desk in elevation, with a lamp, a mug, a plant and a laptop. */
function Desk() {
  return (
    <svg viewBox="0 0 1100 560">
      <path d="M100 360 H900 V384 H100 Z M130 384 V540 M870 384 V540 M600 384 V540 M600 440 H870 M600 490 H870 M40 540 H1060" />
      <path d="M180 360 v-10 h80 v10 M220 350 V230 l60 -60 M260 150 l50 40 l-30 30 z" />
      <path d="M380 360 l20 -120 h220 l20 120 z M420 260 h180 v80 h-180 z" />
      <path d="M690 360 V310 h44 V360 M734 320 q18 0 18 14 q0 14 -18 14" />
      <path d="M800 360 V320 h60 V360 M830 320 q-10 -40 -40 -60 M830 320 q14 -50 50 -70 M830 320 v-70" />
      <path d="M960 540 V300 h70 V540 M960 360 h70 M960 420 h70" />
      <Dim x1={100} x2={900} y={410} t="DESK · 1600" /><Dim x1={380} x2={640} y={210} t="LAPTOP" />
      <Balloon x={720} y={330} n="1" tx={700} ty={190} />
    </svg>
  );
}

/** Contact: a mailbox on a post, with an envelope in elevation. */
function Mailbox() {
  return (
    <svg viewBox="0 0 1000 560">
      <path d="M260 540 V320 h40 V540 M120 540 H880" />
      <path d="M160 320 V200 a120 90 0 0 1 240 0 V320 Z M160 200 h240 M400 220 h30 v-80 h30 v30 h-30" />
      <path d="M560 160 h320 v200 h-320 z M560 160 l160 110 l160 -110 M560 360 l120 -90 M880 360 l-120 -90" />
      <rect x="820" y="180" width="40" height="44" /><path d="M828 192 h24 M828 202 h24 M828 212 h18" />
      <Dim x1={560} x2={880} y={400} t="C6 · 162 × 114" /><Dim x1={160} x2={400} y={110} t="BOX · 480" />
      <Balloon x={720} y={270} n="1" tx={940} ty={480} />
    </svg>
  );
}

/** Résumé: a stack of drawing sheets with a title block, slightly fanned. */
function Sheets() {
  return (
    <svg viewBox="0 0 1000 600">
      <path d="M260 80 L700 60 L740 520 L300 540 Z" /><path d="M240 100 L680 90 L700 550 L260 560 Z" />
      <path d="M220 120 H660 V580 H220 Z" />
      <path d="M250 150 H630 M250 180 H560 M250 210 H600 M250 260 H630 M250 290 H520 M250 320 H590 M250 370 H630 M250 400 H540" />
      <path d="M460 500 H660 V580 H460 Z M460 525 H660 M460 550 H660 M540 500 V580" />
      <Dim x1={220} x2={660} y={30} t="A4 · 210 × 297" />
      <Balloon x={560} y={540} n="1" tx={820} ty={560} />
    </svg>
  );
}

export type PageView = "garage" | "lab" | "desk" | "mailbox" | "sheets";
export function PageDrawing({ view, side = "right" }: { view: PageView; side?: "left" | "right" }) {
  return (
    <div className={`tb tb-${side}`} aria-hidden>
      {view === "garage" ? <Garage /> : view === "lab" ? <Lab /> : view === "desk" ? <Desk /> : view === "mailbox" ? <Mailbox /> : <Sheets />}
    </div>
  );
}
