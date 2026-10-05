// Faint engineering drawings behind the non-case-study pages (the case studies have their own truck,
// parking, car and robot drawings). Same style: precise white lines, low opacity, decorative only.
// One drawing per section, none repeated: Garage = workbench + pegboard, Lab = lab bench, About = camera,
// route plan, suitcase, desk and trophy (one per section),
// Contact = mailbox, Résumé = a stack of drawing sheets, Home = drafting board, dividers, caliper, desk lamp.

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

/** About · hello: an instant camera in elevation, a print sliding out of it. */
function Camera() {
  return (
    <svg viewBox="0 0 1000 600">
      <path d="M260 160 h420 a30 30 0 0 1 30 30 v250 a30 30 0 0 1 -30 30 h-420 a30 30 0 0 1 -30 -30 v-250 a30 30 0 0 1 30 -30 Z" />
      <path d="M300 160 v-36 h120 v36 M560 190 h90 v50 h-90 z M250 400 H700" />
      <circle cx="470" cy="300" r="110" /><circle cx="470" cy="300" r="78" /><circle cx="470" cy="300" r="40" />
      <path d="M470 160 V440 M330 300 H610" className="tb-center" />
      <circle cx="640" cy="320" r="14" /><circle cx="290" cy="210" r="10" />
      <path d="M330 470 v90 h280 v-90 M350 490 h240 v50 h-240 z" />
      <Dim x1={230} x2={710} y={110} t="BODY · 120" /><Dim x1={360} x2={580} y={590} t="PRINT · 86 × 54" />
      <Balloon x={470} y={300} n="1" tx={820} ty={150} /><Balloon x={600} y={515} n="2" tx={820} ty={470} />
    </svg>
  );
}

/** About · how I got here: a route plan with waypoints, a compass rose and a scale bar. */
function Route() {
  return (
    <svg viewBox="0 0 1100 600">
      <path d="M80 480 C 220 470, 240 360, 360 350 S 520 420, 600 300 S 760 140, 880 170 S 1000 260, 1040 120" className="tb-center" />
      {[[80, 480], [360, 350], [600, 300], [880, 170], [1040, 120]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="12" /><circle cx={x} cy={y} r="3" className="tb-solid" /></g>)}
      <circle cx="170" cy="150" r="70" /><circle cx="170" cy="150" r="54" />
      <path d="M170 70 L184 150 L170 230 L156 150 Z M90 150 L170 136 L250 150 L170 164 Z" /><path d="M170 70 L184 150 L156 150 Z" className="tb-solid" />
      <text x="170" y="60" textAnchor="middle">N</text>
      <path d="M700 520 h300 M700 510 v20 M775 514 v12 M850 510 v20 M925 514 v12 M1000 510 v20" />
      <text x="850" y="560" textAnchor="middle">0 ——— 5 YEARS</text>
      <Balloon x={600} y={300} n="1" tx={560} ty={150} /><Balloon x={1040} y={120} n="2" tx={980} ty={40} />
    </svg>
  );
}

/** About · out and about: a suitcase in elevation with a luggage tag and wheels. */
function Suitcase() {
  return (
    <svg viewBox="0 0 1000 620">
      <path d="M320 140 h360 a24 24 0 0 1 24 24 v330 a24 24 0 0 1 -24 24 h-360 a24 24 0 0 1 -24 -24 v-330 a24 24 0 0 1 24 -24 Z" />
      <path d="M440 140 V80 h120 v60 M460 140 V100 h80 v40" />
      <path d="M400 150 V508 M600 150 V508" /><path d="M296 320 H704" className="tb-center" />
      <circle cx="350" cy="550" r="22" /><circle cx="650" cy="550" r="22" /><path d="M350 518 v10 M650 518 v10 M240 572 H760" />
      <path d="M704 200 l70 30 M774 230 l-10 70 l70 30 l10 -70 z" /><circle cx="790" cy="250" r="6" />
      <path d="M786 280 h40 M782 296 h36" />
      <Dim x1={296} x2={704} y={40} t="CABIN · 550 × 400" />
      <Balloon x={810} y={280} n="1" tx={920} ty={420} />
    </svg>
  );
}

/** About · side hustles: a trophy on a plinth, in elevation with its centre line. */
function Trophy() {
  return (
    <svg viewBox="0 0 900 620">
      <path d="M330 110 h240 v40 a120 140 0 0 1 -240 0 Z" />
      <path d="M330 140 h-60 a50 50 0 0 0 60 90 M570 140 h60 a50 50 0 0 1 -60 90" />
      <path d="M430 290 h40 v80 h-40 z M390 370 h120 v30 h-120 z" />
      <path d="M340 400 h220 v120 h-220 z M360 430 h180 M360 490 h180" />
      <path d="M450 80 V540" className="tb-center" /><path d="M260 540 H640" />
      <path d="M450 160 l12 26 l28 4 l-20 20 l5 28 l-25 -13 l-25 13 l5 -28 l-20 -20 l28 -4 z" />
      <Dim x1={330} x2={570} y={60} t="CUP · 240" /><Dim x1={340} x2={560} y={570} t="PLINTH" />
      <Balloon x={540} y={460} n="1" tx={760} ty={420} />
    </svg>
  );
}

/** Home · selected prints: a drafting board on its stand with a T-square, a set square and a pinned print. */
function Drafting() {
  return (
    <svg viewBox="0 0 1000 620">
      <path d="M160 120 L840 60 L880 420 L200 480 Z" /><path d="M180 140 L820 84 M196 456 L860 400" className="tb-hatch" />
      <path d="M150 300 L890 236 M150 300 l-20 -6 v28 l20 -6 M890 236 v20" /><path d="M150 286 h-30 v30 h30" />
      <path d="M560 260 l120 -12 l-108 -80 z" /><path d="M586 246 l52 -5 l-46 -34 z" />
      <path d="M300 170 l170 -16 l14 150 l-170 16 z M318 190 h120 M320 214 h96 M322 238 h110" /><circle cx="384" cy="166" r="6" />
      <path d="M380 470 L330 600 M700 440 L760 600 M300 600 H800 M350 540 h400" />
      <Dim x1={160} x2={840} y={30} t="BOARD · A0" />
      <Balloon x={620} y={230} n="1" tx={940} ty={140} />
    </svg>
  );
}

/** Home · my story: a pair of dividers stepping off a ruler. */
function Dividers() {
  return (
    <svg viewBox="0 0 1000 560">
      <path d="M80 440 H920 V500 H80 Z" />
      {Array.from({ length: 43 }).map((_, i) => <path key={i} d={`M${100 + i * 19.5} 440 v${i % 5 === 0 ? 26 : 13}`} />)}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <text key={i} x={100 + i * 97.5} y={490} textAnchor="middle">{i}</text>)}
      <circle cx="420" cy="110" r="22" /><circle cx="420" cy="110" r="6" className="tb-solid" />
      <path d="M420 70 v18 M410 132 L300 436 M430 132 L560 436 M300 436 l-4 8 M560 436 l4 8" />
      <path d="M345 300 Q 430 260 515 300" /><path d="M420 110 V436" className="tb-center" />
      <path d="M300 410 A 140 140 0 0 1 560 410" className="tb-center" />
      <Dim x1={300} x2={560} y={530} t="ONE STEP" />
      <Balloon x={420} y={110} n="1" tx={660} ty={80} />
    </svg>
  );
}

/** Home · tools I use: a vernier caliper with its jaws open. */
function Caliper() {
  return (
    <svg viewBox="0 0 1000 460">
      <path d="M120 180 H900 V240 H120 Z" />
      {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M${220 + i * 17} 180 v${i % 5 === 0 ? 22 : 11}`} />)}
      <path d="M120 180 V60 h50 V180 M120 240 V330 l40 40 V240" />
      <path d="M470 160 h160 v100 h-160 z M470 180 h160 M470 240 h160" />
      <path d="M470 160 V60 h-46 V160 M470 260 V330 l-40 40 V260" />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${490 + i * 13} 240 v-${i % 5 === 0 ? 16 : 9}`} />)}
      <circle cx="560" cy="150" r="10" /><path d="M630 210 H900" className="tb-center" />
      <Dim x1={170} x2={424} y={30} t="JAW · 0–150 MM" />
      <Balloon x={560} y={150} n="1" tx={760} ty={90} />
    </svg>
  );
}

/** Home · reviews / wake her up: a desk lamp at night, its light cone dashed. */
function Lamp() {
  return (
    <svg viewBox="0 0 900 600">
      <path d="M120 540 H780" />
      <path d="M220 540 h160 v-20 h-160 z" /><circle cx="300" cy="500" r="12" />
      <path d="M300 500 L420 300 M420 300 L560 180" /><circle cx="420" cy="300" r="10" /><circle cx="560" cy="180" r="10" />
      <path d="M560 180 l60 -10 l70 90 l-110 60 z" /><path d="M640 290 q30 10 40 -20" />
      <path d="M600 330 L520 540 M690 270 L800 470" className="tb-center" />
      <path d="M760 80 a50 50 0 1 0 40 80 a40 40 0 1 1 -40 -80 z" />
      <Dim x1={220} x2={380} y={580} t="BASE · 160" />
      <Balloon x={630} y={240} n="1" tx={820} ty={300} />
    </svg>
  );
}

export type PageView = "garage" | "lab" | "desk" | "mailbox" | "sheets" | "camera" | "route" | "suitcase" | "trophy" | "drafting" | "dividers" | "caliper" | "lamp";
const VIEWS: Record<PageView, () => JSX.Element> = { garage: Garage, lab: Lab, desk: Desk, mailbox: Mailbox, sheets: Sheets, camera: Camera, route: Route, suitcase: Suitcase, trophy: Trophy,
  drafting: Drafting, dividers: Dividers, caliper: Caliper, lamp: Lamp };
export function PageDrawing({ view, side = "right" }: { view: PageView; side?: "left" | "right" }) {
  const V = VIEWS[view];
  return (
    <div className={`tb tb-${side}`} aria-hidden>
      <V />
    </div>
  );
}
