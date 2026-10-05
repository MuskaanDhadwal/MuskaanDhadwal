// Faint engineering drawings behind the BuyMySpot sheets, the way the truck drawings sit behind Traxen.
// Precise blueprint lines, low opacity, decorative (aria-hidden). Six views, one per sheet, none repeats.
// Uses the same .tb styles as TruckDrawings (case.css).
import type { ReactNode } from "react";

const Dim = ({ x1, x2, y, t }: { x1: number; x2: number; y: number; t: string }) => (
  <g className="tb-dim">
    <path d={`M${x1} ${y - 10} V${y + 10} M${x2} ${y - 10} V${y + 10} M${x1} ${y} H${x2}`} />
    <path d={`M${x1} ${y} l10 -4 v8 z M${x2} ${y} l-10 -4 v8 z`} className="tb-solid" />
    <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">{t}</text>
  </g>
);
const Pin = ({ x, y, t }: { x: number; y: number; t: string }) => (
  <g><path d={`M${x} ${y} c-16 -18 -16 -40 0 -40 c16 0 16 22 0 40 z`} /><circle cx={x} cy={y - 26} r="6" /><text x={x + 22} y={y - 22}>{t}</text></g>
);
const Car = ({ x, y, r = 0 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x="-22" y="-44" width="44" height="88" rx="12" /><path d="M-18 -22 h36 M-18 20 h36 M-16 -22 q16 -10 32 0 M-16 20 q16 8 32 0" />
  </g>
);

/** Top plan of a surface lot: numbered stalls, drive aisle, entry. */
function Lot() {
  return (
    <svg viewBox="0 0 1200 760">
      <path d="M60 60 H1140 V700 H60 Z" /><path d="M60 330 H1140 M60 430 H1140" className="tb-center" />
      {Array.from({ length: 12 }).map((_, i) => <g key={i}><path d={`M${120 + i * 84} 60 V250`} /><text x={162 + i * 84} y="240" textAnchor="middle">{`A${String(i + 1).padStart(2, "0")}`}</text></g>)}
      {Array.from({ length: 12 }).map((_, i) => <g key={`b${i}`}><path d={`M${120 + i * 84} 510 V700`} /><text x={162 + i * 84} y="530" textAnchor="middle">{`B${String(i + 1).padStart(2, "0")}`}</text></g>)}
      <Car x={330} y={150} /><Car x={666} y={150} /><Car x={498} y={606} /><Car x={918} y={606} />
      <path d="M440 380 H760 m-20 -12 l20 12 l-20 12" /><text x="600" y="368" textAnchor="middle">DRIVE AISLE · ONE WAY</text>
      <path d="M1140 340 v80" strokeWidth="5" /><text x="1060" y="300">ENTRY</text>
      <Dim x1={120} x2={204} y={30} t="2.7 M" /><Dim x1={60} x2={1140} y={735} t="SURFACE LOT · 24 STALLS" />
      <text x="70" y="290">PLAN · LEVEL 0</text>
    </svg>
  );
}

/** Street grid of the neighbourhood with priced pins (the map in the split view). */
function MapGrid() {
  return (
    <svg viewBox="0 0 1200 760">
      {Array.from({ length: 9 }).map((_, i) => <path key={`v${i}`} d={`M${80 + i * 130} 40 V720`} />)}
      {Array.from({ length: 6 }).map((_, i) => <path key={`h${i}`} d={`M40 ${80 + i * 124} H1160`} />)}
      <path d="M40 700 C300 520 600 600 1160 160" className="tb-center" />
      <Pin x={340} y={250} t="$78" /><Pin x={600} y={380} t="$100" /><Pin x={860} y={210} t="$190" /><Pin x={730} y={560} t="$210" /><Pin x={470} y={520} t="$170" />
      <circle cx="600" cy="300" r="160" className="tb-center" /><text x="610" y="130">0.5 MI · 10 MIN WALK</text>
      <path d="M592 300 h16 M600 292 v16" /><text x="40" y="30">GRID · NEIGHBOURHOOD · N ↑</text>
    </svg>
  );
}

/** Side elevation of a sedan with the clearance the filters ask about. */
function Sedan() {
  return (
    <svg viewBox="0 0 1200 560">
      <path d="M40 440 H1160" /><path d="M60 452 H1140" strokeDasharray="36 26" />
      <path d="M180 400 V320 Q180 290 220 286 L380 270 L480 170 Q500 150 540 150 H760 Q800 150 830 180 L920 270 L1010 290 Q1040 296 1040 330 V400 Z" />
      <path d="M500 270 L560 180 H660 V270 Z M690 270 V180 H760 Q790 180 810 200 L870 270 Z" />
      {[320, 900].map(x => <g key={x}><circle cx={x} cy="400" r="62" /><circle cx={x} cy="400" r="34" /><path d={`M${x - 80} 400 H${x + 80} M${x} 320 V480`} className="tb-center" /></g>)}
      <Dim x1={180} x2={1040} y={510} t="4.8 M · STANDARD" /><path d="M1100 150 V440" /><path d="M1100 150 l-6 14 h12 z M1100 440 l-6 -14 h12 z" className="tb-solid" />
      <text x="1112" y="300">1.5 M</text><path d="M120 110 H1100" strokeDasharray="10 8" /><text x="120" y="96">MAX HEIGHT 8′8″ · COVERED LOT</text>
    </svg>
  );
}

/** Section through a three-level garage. */
function Garage() {
  return (
    <svg viewBox="0 0 1200 700">
      <path d="M40 640 H1160" />
      {[640, 470, 300, 130].map((y, i) => <g key={y}><path d={`M100 ${y} H1100`} strokeWidth="3" />{i < 3 && <text x="1112" y={y - 8}>{`L${i}`}</text>}</g>)}
      {[100, 360, 620, 880, 1100].map(x => <path key={x} d={`M${x} 130 V640`} />)}
      <path d="M140 640 L560 470 M640 470 L1060 300 M140 300 L560 130" className="tb-center" />
      {[[220, 600], [700, 430], [960, 260], [300, 260]].map(([x, y]) => <g key={`${x}`} transform={`translate(${x} ${y})`}><rect x="-60" y="-26" width="120" height="30" rx="10" /><circle cx="-34" cy="6" r="12" /><circle cx="34" cy="6" r="12" /></g>)}
      <Dim x1={100} x2={1100} y={680} t="SECTION A–A · STRUCTURED GARAGE" /><text x="110" y="110">OVERGROUND LOT · IN & OUT ALLOWED</text>
    </svg>
  );
}

/** The phone, front elevation, with the split view as a wireframe. */
function Phone() {
  return (
    <svg viewBox="0 0 1200 760">
      <rect x="420" y="40" width="360" height="680" rx="48" /><rect x="444" y="96" width="312" height="580" rx="10" /><path d="M560 66 H640" strokeWidth="5" />
      <rect x="464" y="116" width="272" height="44" rx="8" /><path d="M480 138 h120" />
      <path d="M444 420 H756" /><path d="M560 432 h80" strokeWidth="4" />
      {[460, 540, 620].map(y => <g key={y}><rect x="464" y={y} width="180" height="60" /><rect x="656" y={y} width="80" height="60" /></g>)}
      {[[520, 260, "$100"], [640, 330, "$78"], [690, 220, "$190"]].map(([x, y, t]) => <g key={t as string}><rect x={(x as number) - 30} y={(y as number) - 16} width="60" height="30" rx="14" /><text x={x as number} y={(y as number) + 5} textAnchor="middle">{t}</text></g>)}
      <path d="M800 420 h80 m-14 -8 l14 8 l-14 8" /><text x="890" y="425">SWIPE UP · LIST</text>
      <path d="M800 260 h80" /><text x="890" y="265">MAP · PEEK LIST</text>
      <Dim x1={420} x2={780} y={748} t="390 PT" />
    </svg>
  );
}

/** A parking sign and meter post, elevation. */
function Sign() {
  return (
    <svg viewBox="0 0 1200 700">
      <path d="M40 660 H1160" />
      <path d="M300 660 V120" strokeWidth="3" /><rect x="200" y="80" width="200" height="200" rx="16" /><text x="300" y="200" textAnchor="middle" style={{ fontSize: 96 }}>P</text>
      <rect x="220" y="300" width="160" height="80" /><text x="300" y="336" textAnchor="middle">2 HR</text><text x="300" y="362" textAnchor="middle">8 AM – 6 PM</text>
      <path d="M760 660 V360" strokeWidth="3" /><rect x="700" y="180" width="120" height="180" rx="40" /><rect x="724" y="220" width="72" height="50" /><path d="M740 300 h40 M760 300 v26" />
      <text x="860" y="240">METER · OR · BUYMYSPOT</text><path d="M850 236 H830" />
      <Dim x1={200} x2={400} y={40} t="600 MM" /><text x="440" y="640">ELEVATION · STREET</text>
    </svg>
  );
}

const VIEWS: Record<string, () => ReactNode> = { lot: Lot, map: MapGrid, car: Sedan, garage: Garage, phone: Phone, sign: Sign };
export type ParkingView = "lot" | "map" | "car" | "garage" | "phone" | "sign";

export function ParkingDrawing({ view, side = "right" }: { view: ParkingView; side?: "left" | "right" }) {
  const V = VIEWS[view];
  return <div className={`tb tb-${side} tb-${view}`} aria-hidden><V /></div>;
}
