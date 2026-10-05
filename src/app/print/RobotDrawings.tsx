// Faint engineering drawings behind the GuardianCare sheets (like the truck, parking and car sets).
// Precise blueprint lines, low opacity, decorative (aria-hidden). Six views, one per sheet, none repeats.
import type { ReactNode } from "react";

const Dim = ({ x1, x2, y, t }: { x1: number; x2: number; y: number; t: string }) => (
  <g className="tb-dim">
    <path d={`M${x1} ${y - 10} V${y + 10} M${x2} ${y - 10} V${y + 10} M${x1} ${y} H${x2}`} />
    <path d={`M${x1} ${y} l10 -4 v8 z M${x2} ${y} l-10 -4 v8 z`} className="tb-solid" />
    <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle">{t}</text>
  </g>
);

/** Ava, front elevation: screen head, body, drawer, light ring, wheels. */
function Front() {
  return (
    <svg viewBox="0 0 900 800">
      <path d="M40 740 H860" className="tb-center" />
      <rect x="300" y="90" width="300" height="210" rx="14" /><rect x="324" y="112" width="252" height="166" />
      <circle cx="400" cy="190" r="22" /><circle cx="500" cy="190" r="22" /><path d="M430 236 q20 16 40 0" />
      <circle cx="286" cy="200" r="22" /><circle cx="614" cy="200" r="22" />
      <rect x="290" y="300" width="320" height="400" />
      <rect x="330" y="360" width="160" height="90" /><text x="410" y="412" textAnchor="middle">DRAWER</text>
      <circle cx="540" cy="520" r="34" /><circle cx="540" cy="520" r="20" />
      <circle cx="330" cy="720" r="22" /><circle cx="570" cy="720" r="22" />
      <text x="650" y="200">SCREEN · FACE</text><path d="M644 196 H600" />
      <text x="650" y="525">LIGHT RING</text><path d="M644 521 H574" />
      <Dim x1={290} x2={610} y={770} t="BODY" /><text x="40" y="60">ELEVATION · AVA · FRONT</text>
    </svg>
  );
}
/** Ava, side elevation with the drawer pulled out. */
function Side() {
  return (
    <svg viewBox="0 0 900 800">
      <path d="M40 740 H860" className="tb-center" />
      <rect x="360" y="100" width="90" height="200" rx="10" /><path d="M450 120 l30 8 v150 l-30 8" />
      <rect x="330" y="300" width="160" height="400" />
      <rect x="490" y="370" width="150" height="80" /><path d="M490 370 L330 370 M490 450 L330 450" className="tb-center" />
      <path d="M640 390 h24 v40 h-24" /><text x="560" y="350">PULLS OUT</text><path d="M640 360 l40 0 m-10 -6 l10 6 l-10 6" />
      <circle cx="380" cy="720" r="22" /><circle cx="460" cy="720" r="22" />
      <text x="40" y="60">ELEVATION · AVA · SIDE</text>
    </svg>
  );
}
/** The medicine drawer, detail. */
function Drawer() {
  return (
    <svg viewBox="0 0 900 600">
      <rect x="140" y="160" width="520" height="280" /><rect x="180" y="200" width="300" height="200" />
      {[0, 1, 2, 3].map(i => <path key={i} d={`M${180 + i * 75} 200 V400`} />)}
      <text x="330" y="190" textAnchor="middle">AM · NOON · PM · BED</text>
      <circle cx="580" cy="300" r="50" />{Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <circle key={i} cx={580 + Math.cos(a) * 36} cy={300 + Math.sin(a) * 36} r="5" />; })}
      <text x="580" y="380" textAnchor="middle">NEOPIXEL · RED → GREEN</text>
      <Dim x1={140} x2={660} y={480} t="DRAWER · DISPENSES ON SCHEDULE" /><text x="40" y="60">DETAIL · MEDICINE DRAWER</text>
    </svg>
  );
}
/** The wristband, plan + section. */
function Band() {
  return (
    <svg viewBox="0 0 900 600">
      <path d="M200 300 a250 120 0 1 0 500 0 a250 120 0 1 0 -500 0" /><path d="M230 300 a220 96 0 1 0 440 0 a220 96 0 1 0 -440 0" />
      <rect x="380" y="220" width="140" height="160" rx="26" /><rect x="400" y="242" width="100" height="116" rx="16" />
      <path d="M430 320 l20 -40 l20 40 z" /><text x="450" y="340" textAnchor="middle">SOS</text>
      <text x="560" y="210">HEART RATE · BP · SLEEP</text><path d="M554 206 L510 240" />
      <text x="560" y="420">BUTTON · FALL SENSOR · BLE</text><path d="M554 416 L510 370" />
      <text x="40" y="60">PLAN · WRISTBAND</text>
    </svg>
  );
}
/** A small home, plan view, with beacons in each room. */
function Home() {
  const Beacon = ({ x, y }: { x: number; y: number }) => <g><circle cx={x} cy={y} r="8" className="tb-solid" /><circle cx={x} cy={y} r="26" className="tb-center" /><circle cx={x} cy={y} r="46" className="tb-center" /></g>;
  return (
    <svg viewBox="0 0 1100 700">
      <rect x="60" y="80" width="980" height="560" /><path d="M500 80 V400 M60 400 H760 M760 400 V640 M760 240 H1040" />
      <text x="120" y="130">LIVING</text><text x="560" y="130">KITCHEN</text><text x="120" y="450">BEDROOM</text><text x="800" y="450">BATH</text><text x="800" y="290">HALL</text>
      <Beacon x={300} y={250} /><Beacon x={660} y={250} /><Beacon x={300} y={540} /><Beacon x={900} y={540} /><Beacon x={900} y={320} />
      <Dim x1={60} x2={1040} y={670} t="BEACONS · NO CAMERAS" /><text x="60" y="50">PLAN · HOME · LOCATION BEACONS</text>
    </svg>
  );
}
/** A wheel, section. */
function Wheel() {
  return (
    <svg viewBox="0 0 900 600">
      <circle cx="450" cy="300" r="200" /><circle cx="450" cy="300" r="150" /><circle cx="450" cy="300" r="40" />
      {Array.from({ length: 6 }).map((_, i) => { const a = (i / 6) * Math.PI * 2; return <path key={i} d={`M${450 + Math.cos(a) * 40} ${300 + Math.sin(a) * 40} L${450 + Math.cos(a) * 150} ${300 + Math.sin(a) * 150}`} />; })}
      {Array.from({ length: 24 }).map((_, i) => { const a = (i / 24) * Math.PI * 2; return <path key={i} d={`M${450 + Math.cos(a) * 200} ${300 + Math.sin(a) * 200} L${450 + Math.cos(a) * 216} ${300 + Math.sin(a) * 216}`} className="tb-hatch" />; })}
      <Dim x1={250} x2={650} y={560} t="WHEEL · MOBILITY" /><text x="40" y="60">SECTION · WHEEL</text>
    </svg>
  );
}

const VIEWS: Record<string, () => ReactNode> = { front: Front, side: Side, drawer: Drawer, band: Band, home: Home, wheel: Wheel };
export type RobotView = "front" | "side" | "drawer" | "band" | "home" | "wheel";

export function RobotDrawing({ view, side = "right" }: { view: RobotView; side?: "left" | "right" }) {
  const V = VIEWS[view];
  return <div className={`tb tb-${side} tb-${view}`} aria-hidden><V /></div>;
}
