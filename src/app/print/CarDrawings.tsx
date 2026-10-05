// Faint engineering drawings behind the luxury-vehicle sheets, like the truck (Traxen) and parking (BuyMySpot) sets.
// Precise blueprint lines, low opacity, decorative (aria-hidden). Six views, one per sheet, none repeats.
// Uses the shared .tb styles (case.css). Screen sizes are the brief's own numbers.
import type { ReactNode } from "react";

const Dim = ({ x1, x2, y, t }: { x1: number; x2: number; y: number; t: string }) => (
  <g className="tb-dim">
    <path d={`M${x1} ${y - 10} V${y + 10} M${x2} ${y - 10} V${y + 10} M${x1} ${y} H${x2}`} />
    <path d={`M${x1} ${y} l10 -4 v8 z M${x2} ${y} l-10 -4 v8 z`} className="tb-solid" />
    <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">{t}</text>
  </g>
);
const VDim = ({ x, y1, y2, t }: { x: number; y1: number; y2: number; t: string }) => (
  <g className="tb-dim">
    <path d={`M${x - 10} ${y1} H${x + 10} M${x - 10} ${y2} H${x + 10} M${x} ${y1} V${y2}`} />
    <path d={`M${x} ${y1} l-4 10 h8 z M${x} ${y2} l-4 -10 h8 z`} className="tb-solid" />
    <text x={x + 16} y={(y1 + y2) / 2 + 4}>{t}</text>
  </g>
);

/** Side elevation of a low luxury coupé. */
function Side() {
  return (
    <svg viewBox="0 0 1200 560">
      <path d="M40 470 H1160" className="tb-center" />
      <path d="M90 420 C90 360 130 330 220 318 L420 300 C500 220 600 190 720 196 C820 200 900 250 960 300 L1080 318 C1120 326 1130 360 1128 420 Z" />
      <path d="M440 300 C520 236 600 214 700 216 C780 218 840 250 890 300 Z M660 216 V300" />
      <circle cx="290" cy="420" r="62" /><circle cx="290" cy="420" r="38" /><circle cx="940" cy="420" r="62" /><circle cx="940" cy="420" r="38" />
      <path d="M520 340 h60 M1060 340 h40 M120 360 h40" />
      <Dim x1={290} x2={940} y={530} t="WHEELBASE" /><text x="60" y="160">ELEVATION · DRIVER SIDE</text>
    </svg>
  );
}

/** The dashboard, front elevation, with the four screens and their sizes from the brief. */
function Dash() {
  return (
    <svg viewBox="0 0 1200 720">
      <path d="M60 300 Q600 160 1140 300 V420 Q600 380 60 420 Z" />
      <rect x="170" y="290" width="300" height="110" rx="20" /><text x="320" y="352" textAnchor="middle">DRIVER DISPLAY</text>
      <Dim x1={170} x2={470} y={270} t={'10"'} /><VDim x={140} y1={290} y2={400} t={'4"'} />
      <rect x="600" y="250" width="420" height="210" rx="10" /><text x="810" y="360" textAnchor="middle">CENTRAL CONSOLE</text>
      <Dim x1={600} x2={1020} y={226} t={'14"'} /><VDim x={1050} y1={250} y2={460} t={'7"'} />
      <rect x="690" y="500" width="160" height="210" rx="8" /><text x="770" y="610" textAnchor="middle">FRONT</text><text x="770" y="630" textAnchor="middle">CONSOLE</text>
      <Dim x1={690} x2={850} y={490} t={'5"'} />
      <circle cx="320" cy="560" r="130" /><circle cx="320" cy="560" r="40" /><path d="M200 520 L280 552 M440 520 L360 552 M320 600 V690" />
      <text x="60" y="700">ELEVATION · DASHBOARD · FROM THE DRIVER'S SEAT</text>
    </svg>
  );
}

/** The steering wheel with its selection menu: up / down / prev / next / OK. */
function Wheel() {
  return (
    <svg viewBox="0 0 1000 760">
      <circle cx="500" cy="400" r="300" /><circle cx="500" cy="400" r="250" /><circle cx="500" cy="400" r="90" />
      <path d="M260 340 L410 380 M740 340 L590 380 M500 490 V650" />
      <circle cx="330" cy="420" r="42" /><text x="330" y="414" textAnchor="middle">▲</text><text x="330" y="440" textAnchor="middle">▼</text>
      <circle cx="670" cy="420" r="42" /><text x="670" y="425" textAnchor="middle">OK</text>
      <path d="M640 420 h-14 M700 420 h14" />
      <text x="780" y="150">SELECTION MENU · ON WHEEL</text><path d="M770 146 L690 380" />
      <text x="40" y="740">PLAN · STEERING WHEEL · CONTROLS</text>
    </svg>
  );
}

/** A seat, side elevation (the HVAC panel controls front and rear seats). */
function Seat() {
  return (
    <svg viewBox="0 0 1000 720">
      <path d="M40 660 H960" className="tb-center" />
      <path d="M300 600 L620 600 Q680 600 690 540 L700 480 Q700 450 660 450 L360 450 Q320 450 310 490 Z" />
      <path d="M330 470 L250 160 Q240 110 290 100 L340 92 Q380 90 390 140 L440 450" />
      <path d="M262 110 Q300 40 350 60 Q380 74 372 100" />
      <path d="M360 600 V660 M620 600 V660 M300 650 H700" />
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${330 + i * 14} ${200 + i * 70} q30 -10 60 0`} className="tb-hatch" />)}
      <text x="720" y="380">HEATED</text><path d="M712 376 L640 470" /><text x="720" y="200">FAN · AUTO</text><path d="M712 196 L400 240" />
      <text x="40" y="700">ELEVATION · FRONT SEAT</text>
    </svg>
  );
}

/** Top plan of the cabin: driver, passenger, rear. */
function Top() {
  return (
    <svg viewBox="0 0 1200 600">
      <path d="M120 300 C120 170 220 90 400 80 L860 70 C1010 66 1100 160 1100 300 C1100 440 1010 534 860 530 L400 520 C220 510 120 430 120 300 Z" />
      <path d="M360 110 C420 200 420 400 360 490 M820 100 C870 200 870 400 820 500" />
      <rect x="470" y="150" width="130" height="120" rx="20" /><rect x="470" y="330" width="130" height="120" rx="20" />
      <rect x="660" y="140" width="140" height="320" rx="24" /><path d="M660 300 H800" className="tb-center" />
      <circle cx="430" cy="210" r="40" /><text x="535" y="216" textAnchor="middle">DRIVER</text><text x="535" y="396" textAnchor="middle">PASSENGER</text><text x="730" y="306" textAnchor="middle">REAR</text>
      <Dim x1={470} x2={600} y={40} t="FRONT · SYNC" /><text x="120" y="580">PLAN · CABIN · CLIMATE ZONES</text>
    </svg>
  );
}

/** The gauge cluster: speed left, compass centre, battery right. */
function Cluster() {
  return (
    <svg viewBox="0 0 1200 520">
      <path d="M80 420 Q60 120 300 100 L900 100 Q1140 120 1120 420 Q900 470 600 470 Q300 470 80 420 Z" />
      <circle cx="300" cy="290" r="140" /><path d="M200 390 A140 140 0 0 1 300 150" strokeWidth="4" />
      <text x="300" y="300" textAnchor="middle" style={{ fontSize: 48 }}>100</text>
      <circle cx="600" cy="290" r="80" />{Array.from({ length: 16 }).map((_, i) => { const a = (i / 16) * Math.PI * 2; return <path key={i} d={`M${600 + Math.cos(a) * 70} ${290 + Math.sin(a) * 70} L${600 + Math.cos(a) * 80} ${290 + Math.sin(a) * 80}`} />; })}
      <text x="600" y="296" textAnchor="middle">NW</text>
      <circle cx="900" cy="290" r="140" /><path d="M1000 390 A140 140 0 0 0 1030 240" strokeWidth="4" /><text x="900" y="296" textAnchor="middle">65 %</text>
      <text x="80" y="510">ELEVATION · DRIVER DISPLAY · DEFAULT MODE</text>
    </svg>
  );
}

const VIEWS: Record<string, () => ReactNode> = { side: Side, dash: Dash, wheel: Wheel, seat: Seat, top: Top, cluster: Cluster };
export type CarView = "side" | "dash" | "wheel" | "seat" | "top" | "cluster";

export function CarDrawing({ view, side = "right" }: { view: CarView; side?: "left" | "right" }) {
  const V = VIEWS[view];
  return <div className={`tb tb-${side} tb-${view}`} aria-hidden><V /></div>;
}
