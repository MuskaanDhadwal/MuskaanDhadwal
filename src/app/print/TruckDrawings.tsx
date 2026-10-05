// Faint engineering drawings of the truck, used as backgrounds behind the Traxen sheets (like the
// robot line-art behind C.SEN's layout). Precise blueprint lines only, low opacity, decorative
// (aria-hidden). Six different views, one per sheet — none repeats.
import type { ReactNode } from "react";

const Wheel = ({ x, y, r = 46 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} /><circle cx={x} cy={y} r={r * 0.72} /><circle cx={x} cy={y} r={r * 0.3} />
    {Array.from({ length: 8 }).map((_, i) => { const a = (i * Math.PI) / 4; return <circle key={i} cx={x + Math.cos(a) * r * 0.5} cy={y + Math.sin(a) * r * 0.5} r={r * 0.05} />; })}
    <path d={`M${x - r - 10} ${y} H${x + r + 10} M${x} ${y - r - 10} V${y + r + 10}`} className="tb-center" />
  </g>
);
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

/** Side elevation: tractor + front of the trailer, on the road. */
function Side() {
  return (
    <svg viewBox="0 0 1200 520">
      <path d="M20 430 H1180" />
      <path d="M40 444 H1160" strokeDasharray="40 30" />
      {/* trailer */}
      <path d="M520 120 H1180 V380 H520 Z" /><path d="M520 150 H1180 M520 350 H1180" />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${580 + i * 60} 150 V350`} />)}
      <path d="M560 380 V400 H620 V380" />
      {/* tractor: sleeper, cab, hood */}
      <path d="M150 380 V150 Q150 110 190 110 H330 V380" /><path d="M330 120 H400 Q440 120 460 170 L490 250 H520 V380" />
      <path d="M340 140 H400 Q430 140 446 180 L470 240 H340 Z" />
      <path d="M350 260 H460 V340 H350 Z" /><path d="M360 300 h20" />
      <path d="M150 250 H330" /><path d="M170 180 h100 v50 h-100 z" />
      <path d="M100 380 V330 H150 M60 380 H520" />
      <path d="M128 330 V110 M120 110 h16" />
      <path d="M200 380 h120 v28 h-120 z" />
      <Wheel x={430} y={384} /><Wheel x={210} y={384} /><Wheel x={310} y={384} /><Wheel x={980} y={384} /><Wheel x={1080} y={384} />
      <Dim x1={60} x2={520} y={480} t="A — TRACTOR" />
      <Dim x1={520} x2={1180} y={480} t="B — TRAILER" />
      <Balloon x={400} y={190} n="1" tx={470} ty={70} />
      <Balloon x={300} y={200} n="2" tx={250} ty={60} />
      <text x="30" y="40" className="tb-text">SIDE ELEVATION · NOT TO SCALE</text>
    </svg>
  );
}

/** Front elevation: grille, lights, mirrors, windshield. */
function Front() {
  return (
    <svg viewBox="0 0 700 620">
      <path d="M350 20 V600" className="tb-center" />
      <path d="M170 120 Q350 80 530 120 L560 330 H140 Z" /><path d="M190 140 Q350 108 510 140 L530 280 H170 Z" />
      <path d="M350 108 V280" />
      <path d="M140 330 H560 V470 H140 Z" />
      <path d="M260 350 H440 V470 H260 Z" />{Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M260 ${366 + i * 15} H440`} />)}
      <path d="M160 360 H240 V410 H160 Z M460 360 H540 V410 H460 Z" /><circle cx="200" cy="385" r="16" /><circle cx="500" cy="385" r="16" />
      <path d="M120 470 H580 V510 H120 Z" />
      <path d="M140 160 L90 180 V270 H120 V200 M560 160 L610 180 V270 H580 V200" /><path d="M80 200 h20 v60 h-20 z M600 200 h20 v60 h-20 z" />
      <path d="M150 510 V580 H230 V510 M470 510 V580 H550 V510" />
      <path d="M100 580 H600" />
      <Dim x1={140} x2={560} y={40} t="C — CAB WIDTH" />
      <Balloon x={350} y={200} n="3" tx={640} ty={110} />
      <text x="20" y="610" className="tb-text">FRONT ELEVATION</text>
    </svg>
  );
}

/** Plan view of the cab: driver seat, wheel, dash arc, and where the tablet mounts. */
function CabPlan() {
  return (
    <svg viewBox="0 0 900 620">
      <path d="M60 80 H840 V560 H60 Z" /><path d="M60 140 Q450 40 840 140" />
      <path d="M90 170 Q450 90 810 170 V210 Q450 140 90 210 Z" />
      {/* steering wheel + column */}
      <ellipse cx="300" cy="250" rx="90" ry="34" /><ellipse cx="300" cy="250" rx="70" ry="24" /><path d="M300 226 V274 M230 250 H370" />
      {/* seat */}
      <path d="M220 330 H380 V470 H220 Z" /><path d="M235 470 V540 H365 V470" /><path d="M240 350 H360 M240 450 H360" />
      {/* passenger side */}
      <path d="M520 330 H680 V470 H520 Z" />
      {/* tablet on its mount */}
      <path d="M460 200 L470 250" /><rect x="430" y="168" width="90" height="56" rx="6" transform="rotate(-12 475 196)" />
      <path d="M440 300 H500" strokeDasharray="6 6" />
      <circle cx="300" cy="400" r="30" className="tb-center" />
      <Balloon x={470} y={196} n="4" tx={620} ty={250} />
      <Balloon x={300} y={250} n="5" tx={140} ty={290} />
      <Balloon x={300} y={400} n="6" tx={140} ty={420} />
      <text x="660" y="252" className="tb-text">TABLET</text><text x="80" y="330" className="tb-text">WHEEL</text><text x="80" y="460" className="tb-text">DRIVER</text>
      <text x="60" y="600" className="tb-text">CAB · PLAN VIEW</text>
    </svg>
  );
}

/** Exploded isometric of the tablet mount: tablet, cradle, arm, base, along a dashed axis. */
function MountExploded() {
  const C = 0.866;
  const box = (cx: number, cy: number, w: number, d: number, h: number) => {
    const p = (x: number, y: number, z: number) => `${(cx + (x - y) * C).toFixed(1)},${(cy + (x + y) * 0.5 - z).toFixed(1)}`;
    return <g>
      <polygon points={[p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)].join(" ")} />
      <polygon points={[p(0, d, 0), p(w, d, 0), p(w, d, h), p(0, d, h)].join(" ")} />
      <polygon points={[p(w, 0, 0), p(w, d, 0), p(w, d, h), p(w, 0, h)].join(" ")} />
    </g>;
  };
  return (
    <svg viewBox="0 0 800 760">
      <path d="M330 40 V730" strokeDasharray="10 10" />
      {box(250, 60, 180, 120, 10)}
      <g>{box(270, 210, 150, 100, 18)}</g>
      {box(310, 380, 40, 40, 80)}
      {box(290, 560, 80, 80, 20)}
      <ellipse cx="330" cy="700" rx="70" ry="22" />
      <Balloon x={430} y={130} n="7" tx={600} ty={90} /><Balloon x={420} y={270} n="8" tx={600} ty={250} />
      <Balloon x={360} y={400} n="9" tx={600} ty={420} /><Balloon x={380} y={600} n="10" tx={600} ty={600} />
      <text x="630" y="96" className="tb-text">TABLET</text><text x="630" y="256" className="tb-text">CRADLE</text>
      <text x="630" y="426" className="tb-text">ARM</text><text x="630" y="606" className="tb-text">BASE</text>
      <text x="40" y="740" className="tb-text">MOUNT · EXPLODED</text>
    </svg>
  );
}

/** Section through a wheel end: tyre, rim, hub, axle, with section hatching. */
function WheelSection() {
  return (
    <svg viewBox="0 0 900 620">
      <path d="M40 310 H860" className="tb-center" />
      <path d="M300 60 H420 V560 H300 Z" />
      {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M300 ${70 + i * 22} l120 -40`} className="tb-hatch" />)}
      <path d="M420 120 H480 V500 H420" /><path d="M480 200 H560 V420 H480" />
      <path d="M560 260 H760 V360 H560 Z" /><path d="M760 280 H840 V340 H760" />
      <path d="M500 200 V160 M540 200 V170 M500 420 V460 M540 420 V450" />
      <path d="M180 80 Q140 310 180 540 M300 60 Q200 60 180 80 M300 560 Q200 560 180 540" />
      <Balloon x={360} y={110} n="11" tx={240} ty={30} /><Balloon x={520} y={220} n="12" tx={640} ty={150} /><Balloon x={700} y={300} n="13" tx={760} ty={200} />
      <text x="40" y="600" className="tb-text">SECTION A–A · WHEEL END</text>
    </svg>
  );
}

/** Isometric truck, exploded: cab lifted off the chassis, trailer pulled back. */
function TruckExploded() {
  const C = 0.866;
  const box = (cx: number, cy: number, w: number, d: number, h: number) => {
    const p = (x: number, y: number, z: number) => `${(cx + (x - y) * C).toFixed(1)},${(cy + (x + y) * 0.5 - z).toFixed(1)}`;
    return <g>
      <polygon points={[p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)].join(" ")} />
      <polygon points={[p(0, d, 0), p(w, d, 0), p(w, d, h), p(0, d, h)].join(" ")} />
      <polygon points={[p(w, 0, 0), p(w, d, 0), p(w, d, h), p(w, 0, h)].join(" ")} />
    </g>;
  };
  return (
    <svg viewBox="0 0 1100 760">
      {box(560, 40, 420, 110, 130)}
      {box(220, 230, 120, 110, 120)}
      {box(260, 430, 160, 110, 26)}
      {box(330, 560, 200, 110, 14)}
      <path d="M460 190 L380 300 M620 260 L540 380" strokeDasharray="8 8" />
      <path d="M330 350 V420 M440 350 V470" strokeDasharray="8 8" />
      {/* cab details: windshield, side window, door, grille */}
      <path d="M232 222 L300 186 L300 230 L232 266 Z" /><path d="M318 196 L398 236 L398 270 L318 230 Z" /><path d="M330 250 L380 275 L380 330 L330 305 Z" />
      <path d="M210 300 L290 260 M210 316 L290 276 M210 332 L290 292" />
      {/* trailer ribs */}
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${600 + i * 40} ${178 + i * 20} V${308 + i * 20}`} />)}
      {/* wheels: front axle, drive axles, trailer bogie */}
      {[[300, 620], [400, 676], [520, 640], [600, 690], [860, 300], [930, 340]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx="34" ry="20" /><ellipse cx={x} cy={y} rx="14" ry="8" /></g>)}
      <Balloon x={720} y={140} n="14" tx={900} ty={60} /><Balloon x={300} y={280} n="15" tx={120} ty={200} />
      <Balloon x={360} y={470} n="16" tx={120} ty={470} />
      <text x="940" y="66" className="tb-text">TRAILER</text><text x="40" y="206" className="tb-text">CAB</text><text x="30" y="476" className="tb-text">CHASSIS</text>
      <text x="40" y="740" className="tb-text">ASSEMBLY · EXPLODED</text>
    </svg>
  );
}

const VIEWS: Record<string, () => ReactNode> = { truck: TruckExploded, cab: CabPlan, front: Front, mount: MountExploded, wheel: WheelSection, side: Side };
export type TruckView = "truck" | "cab" | "front" | "mount" | "wheel" | "side";

export function TruckDrawing({ view, side = "right" }: { view: TruckView; side?: "left" | "right" }) {
  const V = VIEWS[view];
  return <div className={`tb tb-${side} tb-${view}`} aria-hidden><V /></div>;
}
