// Small versions of Muskaan, drawn to match her character kit ("Character Study / 01"): solid blunt
// fringe, a high bun, big round glasses, a tucked-in tee, long jeans with rolled cuffs, sneakers.
// Slim, long-legged proportions (head about a quarter of her height). One line colour (currentColor) —
// white on blueprint, ink on paper. Every pose is a little rig (hip + torso tilt + limb angles),
// so new poses are a few numbers, not a new drawing. Each pose is used in one place only.
import type { CSSProperties, ReactNode } from "react";

// ── geometry ───────────────────────────────────────────────────────────────
type P = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
/** angle convention: 0 = straight down, 90 = right, 180 = up, -90 = left */
const step = ([x, y]: P, a: number, len: number): P => [x + Math.sin(rad(a)) * len, y + Math.cos(rad(a)) * len];
const rot = ([x, y]: P, t: number): P => [x * Math.cos(rad(t)) - y * Math.sin(rad(t)), x * Math.sin(rad(t)) + y * Math.cos(rad(t))];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const f = (n: number) => n.toFixed(1);
const line = (...pts: P[]) => "M" + pts.map(p => `${f(p[0])} ${f(p[1])}`).join(" L");

// seeded random so the hatching is the same on every render
function rng(seed: number) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// ── head ───────────────────────────────────────────────────────────────────
export type Eyes = "dot" | "happy" | "closed" | "wide" | "tired" | "side" | "dizzy";
export type Mouth = "smile" | "open" | "flat" | "o" | "grin" | "frown" | "tongue";

const HATCH = (() => {
  const r = rng(7); const s: string[] = [];
  for (let i = 0; i < 7; i++) { // a few strands in the fringe, ending short of the blunt cut
    const x = -9.4 + i * 3 + (r() - .5) * .8;
    s.push(`M${f(x * .7 + 1.2)} ${f(-27 - r() * 2)} Q${f(x * .94)} ${f(-22.5)} ${f(x)} ${f(-19.4 - r() * .8)}`);
  }
  for (let i = 0; i < 4; i++) { // crown sweeping back toward the bun
    const x = -8 + i * 4;
    s.push(`M${f(x)} ${f(-28.4 + Math.abs(x) * .1)} Q${f(x + 6)} ${f(-31.4 - r())} ${f(6.5 + r() * 2.5)} ${f(-31)}`);
  }
  return s.join(" ");
})();

function Head({ eyes = "dot", mouth = "smile", blush }: { eyes?: Eyes; mouth?: Mouth; blush?: boolean }) {
  // neck base at (0,0); head centre about (0,-15)
  const lx = -5.6, rx = 5.4, ey = -11.4;
  const eye = (x: number) => {
    switch (eyes) {
      case "happy": return <path d={`M${x - 1.8} ${ey + .8} q1.8 -2.4 3.6 0`} className="mn-thin" />;
      case "closed": return <path d={`M${x - 1.8} ${ey + .4} q1.8 1.4 3.6 0`} className="mn-thin" />;
      case "wide": return <circle cx={x} cy={ey} r={1.5} className="mn-solid" />;
      case "tired": return <g><path d={`M${x - 2} ${ey - .2} h4`} className="mn-thin" /><circle cx={x} cy={ey + .7} r={.9} className="mn-solid" /></g>;
      case "side": return <circle cx={x + 1.3} cy={ey + .2} r={1.05} className="mn-solid" />;
      case "dizzy": return <path d={`M${x} ${ey} m-.2 0 a.6 .6 0 1 1 .8 .4 a1.3 1.3 0 1 1 -1.8 -1.4`} className="mn-thin" />;
      default: return <circle cx={x} cy={ey + .3} r={1.1} className="mn-solid" />;
    }
  };
  const m = {
    smile: <path d="M-2.2 -5.4 q2.2 2 4.4 0" className="mn-thin" />,
    grin: <path d="M-2.8 -5.8 q2.8 3.6 5.6 0 z" className="mn-solid" />,
    open: <path d="M-2.4 -6 q2.4 4.4 4.8 0 z" className="mn-fill mn-thin" />,
    flat: <path d="M-1.6 -4.8 h3.2" className="mn-thin" />,
    o: <ellipse cx="0" cy="-4.8" rx="1.1" ry="1.4" className="mn-fill mn-thin" />,
    frown: <path d="M-2 -4.2 q2 -1.8 4 0" className="mn-thin" />,
    tongue: <g><path d="M-2.4 -5.8 q2.4 3 4.8 0 z" className="mn-fill mn-thin" /><path d="M-.6 -4.4 q.9 1.8 1.8 0" className="mn-thin" /></g>,
  }[mouth];
  return (
    <g>
      {/* neck */}
      <path d="M-2.6 0.5 V-4 M2.6 0.5 V-4" className="mn-line" />
      {/* bun, behind the head */}
      <circle cx="9.2" cy="-31.5" r="5.6" className="mn-hair" />
      <path d="M5.6 -32 a3.8 3.6 0 1 1 3.6 4.1 M7.4 -31.6 a1.9 1.9 0 1 1 1.8 2" className="mn-hatch" />
      {/* face */}
      <path d="M-12.3 -18 C-12.6 -8.5 -7 -2.6 0 -2.6 C7 -2.6 12.4 -8.5 12.2 -18 Z" className="mn-fill mn-line" />
      {/* ear + stud */}
      <path d="M11.9 -14.2 q3.6 -1.2 3.4 2.6 q-.2 2.9 -3.3 3.1" className="mn-fill mn-line" />
      <circle cx="13.6" cy="-8" r=".85" className="mn-solid" />
      {/* hair: dome + blunt bangs + a long strand on the left cheek */}
      <path d="M-14 -7 C-17 -22 -13 -32.6 -0.5 -32.6 C12 -32.6 16.4 -24 13.6 -14.6 L12 -14.8 L12 -16.8 L-11.9 -16.8 L-12.1 -7 Z" className="mn-hair" />
      <path d={HATCH} className="mn-hatch" />
      {/* glasses */}
      <circle cx={lx} cy={ey} r="4.6" className="mn-fill mn-glass" />
      <circle cx={rx} cy={ey} r="4.6" className="mn-fill mn-glass" />
      <path d={`M${lx + 4.6} ${ey - .6} q${(rx - lx - 9.2) / 2} -1.1 ${rx - lx - 9.2} 0 M${rx + 4.6} ${ey - 1} L12.4 ${ey - 1.8}`} className="mn-thin" />
      {eye(lx)}{eye(rx)}
      {/* nose */}
      <path d="M.3 -9.4 q-1 1.6 .5 1.9" className="mn-thin" />
      {m}
      {blush && <path d="M-9.6 -6.6 l1.4 -1.2 M-8.2 -6.4 l1.4 -1.2 M7.4 -6.6 l1.4 -1.2 M8.8 -6.4 l1.4 -1.2" className="mn-thin" />}
    </g>
  );
}

// ── body rig ───────────────────────────────────────────────────────────────
type Limb = [number, number]; // [upper angle, lower angle], absolute
export interface Rig {
  hip: P; tilt?: number; headTilt?: number; eyes?: Eyes; mouth?: Mouth; blush?: boolean;
  armL: Limb; armR: Limb; legL?: Limb; legR?: Limb;
  /** which arm goes behind the body */
  back?: "L" | "R" | "both" | "none";
  /** hide the legs (e.g. sitting inside a folder) */
  noLegs?: boolean; noHead?: boolean;
  /** false = don't lift the hip to keep the feet on the ground (e.g. sitting on a chair) */
  ground?: boolean;
}
export interface Joints { lift: number; hip: P; neck: P; sL: P; sR: P; eL: P; eR: P; hL: P; hR: P; kL: P; kR: P; fL: P; fR: P; head: P }

// kit proportions: long legs, longer arms, a smaller head (HEAD_S). Poses were authored for the old
// short legs, so the hip is lifted automatically to keep the lowest foot where it was (on the ground).
const ARM: P = [12.5, 11.5], LEG: P = [17.5, 17], OLD_LEG: P = [13, 12.5];
export const HEAD_S = .74;

export function joints(r: Rig): Joints {
  const t = r.tilt ?? 0;
  const legL = r.legL ?? [-3, -1], legR = r.legR ?? [3, 1];
  const offL = rot([-4.4, 0], t), offR = rot([4.4, 0], t);
  const low = (L: P) => Math.max(offL[1] + Math.cos(rad(legL[0])) * L[0] + Math.cos(rad(legL[1])) * L[1], offR[1] + Math.cos(rad(legR[0])) * L[0] + Math.cos(rad(legR[1])) * L[1]);
  const lift = r.noLegs || r.ground === false ? 0 : low(OLD_LEG) - low(LEG);
  const hip: P = [r.hip[0], r.hip[1] + lift];
  const neck = add(hip, rot([0, -24], t));
  const sL = add(hip, rot([-8.2, -21.4], t)), sR = add(hip, rot([8.2, -21.4], t));
  const eL = step(sL, r.armL[0], ARM[0]), hL = step(eL, r.armL[1], ARM[1]);
  const eR = step(sR, r.armR[0], ARM[0]), hR = step(eR, r.armR[1], ARM[1]);
  const pL = add(hip, offL), pR = add(hip, offR);
  const kL = step(pL, legL[0], LEG[0]), fL = step(kL, legL[1], LEG[1]);
  const kR = step(pR, legR[0], LEG[0]), fR = step(kR, legR[1], LEG[1]);
  return { lift, hip, neck, sL, sR, eL, eR, hL, hR, kL, kR, fL, fR, head: add(neck, rot([0, -11.6], t + (r.headTilt ?? 0))) };
}

/** a limb drawn as an outlined tube: thick line, then a thinner fill-coloured line inside */
const Tube = ({ d, w = 5.6 }: { d: string; w?: number }) => (
  <g><path d={d} className="mn-tube" style={{ strokeWidth: w }} /><path d={d} className="mn-tube-in" style={{ strokeWidth: w - 2.5 }} /></g>
);

function Arm({ s, e, h }: { s: P; e: P; h: P }) {
  // the sleeve is part of the tee: a short flared tube over the top of the upper arm
  const a = Math.atan2(e[0] - s[0], e[1] - s[1]);
  const d: P = [Math.sin(a), Math.cos(a)], n: P = [d[1], -d[0]];
  const pt = (along: number, side: number): P => [s[0] + d[0] * along + n[0] * side, s[1] + d[1] * along + n[1] * side];
  const sleeve = `${line(pt(-1.5, 3.2), pt(5.8, 4), pt(5.8, -4), pt(-1.5, -3.2))}`;
  const fa = Math.atan2(h[0] - e[0], h[1] - e[1]) * 180 / Math.PI; // forearm direction, for the hand
  return (
    <g>
      <Tube d={line(s, e, h)} w={4.4} />
      <path d={sleeve} className="mn-fill mn-line" />
      <path d={line(pt(-1.5, 3.2), pt(-1.5, -3.2))} className="mn-fill" style={{ stroke: "var(--mn-fill)", strokeWidth: 2 }} />
      <path d={line(pt(5.1, 3.6), pt(5.1, -3.6))} className="mn-thin" />
      <g transform={`translate(${f(h[0])} ${f(h[1])}) rotate(${f(-fa)})`}>
        <path d="M-1.9 -1 C-2.3 1.6 -1.4 3.4 0 3.4 C1.5 3.4 2.3 1.6 1.9 -1 Z" className="mn-fill mn-line" />
        <path d="M1.8 .2 q1.3 .6 .7 1.9" className="mn-thin" />
      </g>
    </g>
  );
}

/** a jeans leg (straight, with a rolled cuff) and a low-top sneaker */
function Leg({ p, k, ft, facing }: { p: P; k: P; ft: P; facing: number }) {
  const la = Math.atan2(ft[0] - k[0], ft[1] - k[1]);
  const d: P = [Math.sin(la), Math.cos(la)], n: P = [d[1], -d[0]];
  const at = (back: number, side: number): P => [ft[0] - d[0] * back + n[0] * side, ft[1] - d[1] * back + n[1] * side];
  const a = la * 180 / Math.PI;
  return (
    <g>
      <Tube d={line(p, k, ft)} w={6.6} />
      <g transform={`translate(${f(ft[0])} ${f(ft[1] + .4)}) rotate(${f(-a * .25)}) scale(${facing} 1)`}>
        <path d="M-3.4 -2.2 C-1.6 -3 .6 -2.8 1.6 -2 C3.6 -1.6 5.8 -.6 6.2 .9 C6.4 1.9 5.6 2.3 4.6 2.3 L-3.2 2.3 C-4.3 2.3 -4.6 1.4 -4.4 .2 Z" className="mn-fill mn-line" />
        <path d="M-4.3 1 H6.1 M.2 -2.4 l1 1.3 M1.6 -2 l1 1.3" className="mn-thin" />
      </g>
      <path d={line(at(3.6, 3.8), at(3.6, -3.8), at(1.4, -3.9), at(1.4, 3.9)) + " Z"} className="mn-fill mn-line" />
    </g>
  );
}

export function Body({ r, facing = 1, children, front }: { r: Rig; facing?: 1 | -1; children?: ReactNode; front?: ReactNode }) {
  const j = joints(r), t = r.tilt ?? 0;
  const back = r.back ?? "none";
  const pL = add(j.hip, rot([-4.4, 0], t)), pR = add(j.hip, rot([4.4, 0], t));
  const armL = <Arm s={j.sL} e={j.eL} h={j.hL} />, armR = <Arm s={j.sR} e={j.eR} h={j.hR} />;
  return (
    <g>
      {(back === "L" || back === "both") && armL}
      {(back === "R" || back === "both") && armR}
      {children}
      {!r.noLegs && <><Leg p={pL} k={j.kL} ft={j.fL} facing={facing} /><Leg p={pR} k={j.kR} ft={j.fR} facing={facing} /></>}
      <g transform={`translate(${f(j.hip[0])} ${f(j.hip[1])}) rotate(${f(t)})`}>
        {/* jeans seat: high waist, covers the tops of the legs */}
        {!r.noLegs && <><path d="M-8.4 -3 L8.4 -3 L8 3.4 Q0 5.2 -8 3.4 Z" className="mn-fill" /><path d="M-8.4 -3 L-8 3.4 M8.4 -3 L8 3.4 M0 -1.4 V3.2" className="mn-line" /></>}
        {/* tee, tucked in */}
        <path d="M-3.6 -24.6 C-6.3 -24 -9.1 -23.4 -10.1 -20.6 C-11 -16 -9.8 -8 -8.8 -2.4 L8.8 -2.4 C9.8 -8 11 -16 10.1 -20.6 C9.1 -23.4 6.3 -24 3.6 -24.6 Z" className="mn-fill mn-line" />
        <path d="M-3.6 -24.6 Q0 -21.4 3.6 -24.6" className="mn-thin" />
        {/* waistband */}
        <path d="M-8.9 -4.4 H8.9 V-1.6 H-8.9 Z" className="mn-fill mn-line" />
        <path d="M-5.4 -4.4 v2.8 M5.4 -4.4 v2.8" className="mn-thin" />
      </g>
      {(back === "none" || back === "R") && armL}
      {(back === "none" || back === "L") && armR}
      {!r.noHead && (
        <g transform={`translate(${f(j.neck[0])} ${f(j.neck[1] + 1)}) rotate(${f(t + (r.headTilt ?? 0))}) scale(${f(facing * HEAD_S)} ${HEAD_S})`}>
          <Head eyes={r.eyes} mouth={r.mouth} blush={r.blush} />
        </g>
      )}
      {front}
    </g>
  );
}

// ── the figure wrapper ─────────────────────────────────────────────────────
export function MiniSvg({ vb, label, className = "", style, children, tone, place }: {
  vb: string; label?: string; className?: string; style?: CSSProperties; children: ReactNode; tone?: "paper" | "dark"; place?: number[];
}) {
  const at = place ? { x: place[0], y: place[1], width: place[2], height: place[3] } : {};
  return (
    <svg {...at} viewBox={vb} className={`mn ${tone ? `mn-${tone}` : ""} ${className}`} style={style} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} overflow="visible">
      <g className="mn-crayon">{children}</g>
    </svg>
  );
}

// ── props (machine-ish things stay simple line drawings) ───────────────────
export const Laptop = ({ x, y, s = 1, logo = true }: { x: number; y: number; s?: number; logo?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-13 0 L-11 -17 L11 -17 L13 0 Z" className="mn-fill mn-line" />
    {logo && <text x="0" y="-5.6" textAnchor="middle" className="mn-text" fontSize="8.5" fontWeight="700">M</text>}
    <path d="M-16 0 H16 L14 2.6 H-14 Z" className="mn-fill mn-line" />
  </g>
);
export const Mug = ({ x, y, s = 1, steam = false, text = true }: { x: number; y: number; s?: number; steam?: boolean; text?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-5 -6 h10 l-.6 11 h-8.8 z" className="mn-fill mn-line" />
    <path d="M5 -3.6 q3.6 0 3.4 3 t-3.8 2.8" className="mn-thin" />
    {text && <path d="M-3 -2.4 h4.4 M-3 -.2 h3 M-3 2 h4" className="mn-thin" style={{ strokeWidth: .7 }} />}
    {steam && <path d="M-2 -8.5 q-1.2 -1.6 0 -3.2 t0 -3.2 M2 -8.5 q-1.2 -1.6 0 -3.2 t0 -3.2" className="mn-thin" />}
  </g>
);
export const Folder = ({ x, y, s = 1, label, open }: { x: number; y: number; s?: number; label?: string; open?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 -18 h11 l3 -3.4 h18 v21.4 h-32 z" className="mn-folder" />
    {open && <path d="M-16 0 l4 -14 h32 l-4 14 z" className="mn-folder mn-folder-front" />}
    {label && <text x={open ? 2 : 0} y={open ? -4.4 : -6} textAnchor="middle" className="mn-folder-text" fontSize="5">{label}</text>}
  </g>
);
export const Books = ({ x, y, n = 3 }: { x: number; y: number; n?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }).map((_, i) => (
      <g key={i} transform={`translate(${[0, 1.5, -1][i % 3]} ${-i * 5.4})`}>
        <rect x="-13" y="-5.4" width="26" height="5.4" className="mn-fill mn-line" />
        <path d={`M-9 -2.7 h${[9, 6, 11][i % 3]}`} className="mn-thin" />
      </g>
    ))}
  </g>
);
export const Plant = ({ x, y, s = 1, dead = false }: { x: number; y: number; s?: number; dead?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-6 -8 h12 l-1.6 8 h-8.8 z" className="mn-fill mn-line" />
    {dead
      ? <path d="M0 -8 q.4 -6 -1 -9 q-2 -3 -5.4 -2 M0 -12 q2.6 -2.6 5 -1.4 q1.6 1.4 1.2 3.6 M-1 -16 q-3.4 -.6 -3.8 2.6" className="mn-thin" />
      : <path d="M0 -8 q-.6 -7 -5 -11 q4.8 1 5 6 q.6 -7 5 -10 q-1 6 -4.6 9" className="mn-thin" />}
  </g>
);
export const Dice = ({ x, y, s = 1, r = 0, n = 3 }: { x: number; y: number; s?: number; r?: number; n?: number }) => {
  const pips: Record<number, P[]> = { 1: [[0, 0]], 2: [[-2, -2], [2, 2]], 3: [[-2, -2], [0, 0], [2, 2]], 4: [[-2, -2], [2, -2], [-2, 2], [2, 2]], 5: [[-2, -2], [2, -2], [0, 0], [-2, 2], [2, 2]], 6: [[-2, -2.2], [2, -2.2], [-2, 0], [2, 0], [-2, 2.2], [2, 2.2]] };
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="1.6" className="mn-fill mn-line" />
      {pips[n].map(([px, py], i) => <circle key={i} cx={px} cy={py} r=".8" className="mn-solid" />)}
    </g>
  );
};
const Motion = ({ d }: { d: string }) => <path d={d} className="mn-thin" />;

/** chair + desk for the wake-her-up scene: seat at y = seat, desk top 9 above it */
const DeskScene = ({ seat }: { seat: number }) => (
  <g>
    <path d="M-30 0 H74" className="mn-thin" />
    <path d={`M-16 ${seat} H6 M-14 ${seat} V0 M4 ${seat} V0 M-16 ${seat} V${seat - 32}`} className="mn-line" />
    <path d={`M14 ${seat - 9} H74 M18 ${seat - 9} V0 M70 ${seat - 9} V0`} className="mn-line" />
  </g>
);

// ── the poses ──────────────────────────────────────────────────────────────
// Each returns an <svg>. Ground is y = 0 unless the pose says otherwise.
type PoseFn = ((o: { label?: string; className?: string; style?: CSSProperties; tone?: "paper" | "dark"; place?: number[] }) => ReactNode) & { vb: string };
const mk = (vb: string, draw: () => ReactNode): PoseFn => Object.assign((o: Parameters<PoseFn>[0]) => <MiniSvg vb={vb} {...o}>{draw()}</MiniSvg>, { vb });

export const POSES = {
  // LOADER — idea → shipped
  /** climbing out of the IDEA folder, reaching forward */
  ldOut: mk("-34 -78 76 82", () => {
    const r: Rig = { hip: [-2, -12], tilt: 34, armL: [68, 84], armR: [80, 96], back: "R", noLegs: true, eyes: "wide", mouth: "o" };
    return <><Folder x={-12} y={0} s={1.25} /><Body r={r} /><Folder x={-12} y={0} s={1.25} open label="IDEA" /></>;
  }),
  /** mid-air, flat out */
  ldFly: mk("-40 -60 84 56", () => {
    const r: Rig = { hip: [-10, -32], tilt: 98, headTilt: -14, armL: [76, 78], armR: [84, 86], legL: [-96, -100], legR: [-104, -108], back: "R", eyes: "closed", mouth: "grin" };
    return <><Body r={r} /><Motion d="M-38 -40 h-8 M-36 -32 h-11 M-38 -24 h-8" /></>;
  }),
  /** landed in a squat, hands on knees, seeing stars */
  ldLand: mk("-26 -74 56 78", () => {
    const r: Rig = { hip: [-4, -18], tilt: 16, headTilt: -12, armL: [34, 6], armR: [24, -6], legL: [62, -6], legR: [76, -2], eyes: "dizzy", mouth: "o" };
    return <><Body r={r} /><path d="M-14 0 h-6 M26 0 h6 M-4 -70 l2 -4 l2 4 l-4 -2 h4 z M12 -72 l1.4 -3 l1.4 3 l-2.8 -1.4 h2.8 z" className="mn-thin" /></>;
  }),
  /** standing up, a little dazed */
  ldStand: mk("-24 -88 48 92", () => {
    const r: Rig = { hip: [0, -26], headTilt: -8, armL: [-6, -2], armR: [8, 4], eyes: "dizzy", mouth: "flat" };
    return <><Body r={r} /><path d="M-4 -82 c-3 -3 2 -6 4 -3 c2 3 -4 6 -6 2 c-2 -5 6 -8 9 -3" className="mn-thin" /></>;
  }),
  /** walking toward the SHIPPED folder */
  ldWalk: mk("-26 -86 52 90", () => {
    const r: Rig = { hip: [0, -24.6], tilt: 4, armL: [26, 40], armR: [-24, -12], legL: [22, 8], legR: [-20, -44], back: "R", eyes: "side", mouth: "smile" };
    return <Body r={r} />;
  }),
  /** stuffing the work into the SHIPPED folder */
  ldPush: mk("-24 -64 80 68", () => {
    const r: Rig = { hip: [-4, -15], tilt: 30, armL: [72, 92], armR: [64, 84], legL: [-8, -84], legR: [72, 2], back: "L", eyes: "happy", mouth: "grin" };
    return <><Folder x={40} y={0} s={1.25} label="SHIPPED" /><Body r={r} /></>;
  }),

  // NAME — small her on the letters
  /** sitting cross-legged on top of the M, laptop on her lap */
  nmTyping: mk("-30 -66 60 68", () => {
    const r: Rig = { hip: [0, -6], armL: [24, 70], armR: [-24, -70], legL: [-78, 66], legR: [78, -66], eyes: "dot", mouth: "flat" };
    const j = joints(r);
    return <><Body r={r} front={<Laptop x={0} y={j.hip[1] + 4} s={.95} />} /><Motion d="M-20 -30 l-4 -3 M20 -30 l4 -3 M22 -24 h5" /></>;
  }),
  /** just head + hands, peeking over the K */
  nmPeek: mk("-18 -36 36 38", () => (
    <g>
      <g transform="translate(0 2)"><Head eyes="wide" mouth="o" /></g>
      {[-9, 9].map(x => <g key={x}><circle cx={x} cy={-0.6} r="3" className="mn-fill mn-line" /><path d={`M${x - 1.6} -2.6 v3 M${x} -3.4 v3.6 M${x + 1.6} -2.6 v3`} className="mn-thin" /></g>)}
    </g>
  )),
  /** a portrait in the D's counter: head and shoulders, grinning */
  nmFrame: mk("-20 -36 40 46", () => {
    const r: Rig = { hip: [0, 22], armL: [-4, -2], armR: [4, 2], noLegs: true, eyes: "happy", mouth: "grin", blush: true };
    return <><clipPath id="mn-frame-clip"><rect x="-30" y="-50" width="60" height="58" /></clipPath><g clipPath="url(#mn-frame-clip)"><Body r={r} /></g></>;
  }),
  /** sitting on the ground, legs out, sketchbook on her lap */
  nmSketch: mk("-22 -60 56 62", () => {
    const r: Rig = { hip: [-6, -6], tilt: -6, headTilt: 18, armL: [44, 96], armR: [26, 70], legL: [84, 92], legR: [90, 96], back: "L", eyes: "side", mouth: "smile" };
    const j = joints(r);
    return <Body r={r} front={<g>
      <g transform={`translate(${f(j.hL[0] + 4)} ${f(j.hL[1] - 2)}) rotate(-62)`}><rect x="-5.5" y="-7.5" width="11" height="15" className="mn-fill mn-line" /><path d="M-3 -3 q1.6 -2.4 3.2 0 t3 0 M-3 2 h5" className="mn-thin" /></g>
      <path d={`M${f(j.hR[0])} ${f(j.hR[1])} l4 -7`} className="mn-line" />
    </g>} />;
  }),
  /** standing on books, holding up the L */
  nmHold: mk("-22 -86 44 104", () => {
    const r: Rig = { hip: [0, -26], armL: [-158, 178], armR: [158, -178], eyes: "closed", mouth: "open" };
    return <><Books x={0} y={16} n={3} /><g transform="translate(0 -1)"><Body r={r} /></g><path d="M-14 -70 l-4 -3 M14 -70 l4 -3" className="mn-thin" /></>;
  }),

  // RAIL — walk cycle (two frames) with a prop that changes per section
  walkA: mk("-22 -82 44 86", () => <Body r={{ hip: [0, -24.6], tilt: 3, armL: [24, 36], armR: [-22, -10], legL: [20, 6], legR: [-18, -40], back: "R", eyes: "side", mouth: "smile" }} />),
  walkB: mk("-22 -82 44 86", () => <Body r={{ hip: [0, -25.4], tilt: 3, armL: [-18, -8], armR: [20, 34], legL: [-18, -40], legR: [20, 6], back: "L", eyes: "side", mouth: "smile" }} />),

  // HOW I SHIP — the "before" of boxes 02–04
  /** 11:00 — holding out an empty mug, upside down. not a drop left. */
  boxEmpty: mk("-26 -86 66 90", () => {
    const r: Rig = { hip: [-6, -25], headTilt: 10, armL: [-8, -2], armR: [118, 148], eyes: "tired", mouth: "frown" };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 6)} ${f(j.hR[1] - 2)}) rotate(160)`}><Mug x={0} y={0} s={1.15} /></g><path d={`M${f(j.hR[0] + 7)} ${f(j.hR[1] + 9)} q-1.4 2.4 0 3.4 q1.4 -1 0 -3.4`} className="mn-thin" /><text x={j.hR[0] + 14} y={j.hR[1] + 20} className="mn-text" fontSize="5">…</text></>;
  }),
  /** 16:00 — finger hovering over a big deploy button */
  boxHover: mk("-28 -86 80 90", () => {
    const r: Rig = { hip: [-8, -25], tilt: 6, armL: [-10, -4], armR: [80, 74], eyes: "wide", mouth: "flat" };
    return <><g transform="translate(36 0)"><path d="M-8 0 v-28 h16 v28" className="mn-fill mn-line" /><ellipse cx="0" cy="-31" rx="11" ry="4.4" className="mn-fill mn-line" /><ellipse cx="0" cy="-34" rx="8" ry="3.6" className="mn-accent mn-line" /></g><Body r={r} /><path d="M-24 -70 q-2 -4 1 -6 M-20 -74 q-1 -3 1 -4" className="mn-thin" /></>;
  }),
  /** 23:00 — yawning, stretching */
  boxYawn: mk("-30 -96 60 100", () => {
    const r: Rig = { hip: [0, -25], headTilt: -6, armL: [-150, -176], armR: [150, 176], eyes: "closed", mouth: "o" };
    return <><Body r={r} /><text x="16" y="-74" className="mn-text" fontSize="8">z</text><text x="22" y="-82" className="mn-text" fontSize="6">z</text></>;
  }),

  // ABOUT
  /** "Portfolio hello": a tablet held up in one hand, waving with the other */
  abWave: mk("-30 -100 62 104", () => {
    const r: Rig = { hip: [0, -25], headTilt: 6, armL: [-24, -158], armR: [140, 172], eyes: "happy", mouth: "open", blush: true };
    const j = joints(r);
    return <><Body r={r} front={<g transform={`translate(${f(j.hL[0] - 2)} ${f(j.hL[1] - 3)}) rotate(-8)`}><rect x="-6.5" y="-10" width="13" height="18" rx="2" className="mn-fill mn-line" /><rect x="-4.5" y="-7.6" width="9" height="12.4" className="mn-thin" /><path d="M-2.6 -4.4 h5.2 M-2.6 -1.6 h3.6" className="mn-thin" /></g>} />
      <path d={`M${f(j.hR[0] + 6)} ${f(j.hR[1] - 2)} l4 -3 M${f(j.hR[0] + 7)} ${f(j.hR[1] + 4)} h5 M${f(j.hR[0] + 2)} ${f(j.hR[1] - 7)} l2 -4`} className="mn-thin" /></>;
  }),
  /** "Plant person": watering a very droopy plant anyway, a little guilty */
  abPlant: mk("-42 -92 74 96", () => {
    const r: Rig = { hip: [8, -25], headTilt: -8, armL: [-58, -96], armR: [6, 2], eyes: "dot", mouth: "flat" };
    const j = joints(r);
    const [hx, hy] = j.hL;
    return <><Plant x={-28} y={0} s={1.3} dead /><Body r={r} front={<g transform={`translate(${f(hx - 4)} ${f(hy + 1)}) rotate(-18)`}>
        <path d="M-5 -5 h10 v9 q0 2 -2 2 h-6 q-2 0 -2 -2 z" className="mn-fill mn-line" /><path d="M-5 -2 L-14 -7" className="mn-line" /><path d="M5 -3 q5 0 4 5 q-1 3 -4 2" className="mn-thin" />
      </g>} />
      <path d={`M${f(hx - 18)} ${f(hy + 2)} l-1.4 4 M${f(hx - 21)} ${f(hy + 6)} l-1.4 4 M${f(hx - 17)} ${f(hy + 9)} l-1.4 4`} className="mn-thin" /></>;
  }),
  /** "Board-game person": crouched low, rolling dice across the floor */
  abDice: mk("-48 -74 82 78", () => {
    const r: Rig = { hip: [4, -12], tilt: -16, headTilt: 8, armL: [-46, -24], armR: [24, -10], legL: [-64, 12], legR: [56, -14], eyes: "wide", mouth: "grin" };
    const j = joints(r);
    return <><Body r={r} /><Dice x={j.hL[0] - 12} y={-5} r={18} n={6} /><Dice x={j.hL[0] - 25} y={-4.4} r={-12} n={4} s={.85} />
      <Motion d={`M${f(j.hL[0] - 4)} ${f(j.hL[1] - 4)} l-4 -3 M${f(j.hL[0] - 31)} -12 l-4 -2 M${f(j.hL[0] - 32)} -6 h-5`} /></>;
  }),
  /** whisking a bowl (stress-baking) */
  abBake: mk("-26 -84 54 88", () => {
    const r: Rig = { hip: [0, -25], armL: [36, 100], armR: [-20, -90], eyes: "dot", mouth: "tongue" };
    const j = joints(r);
    return <><Body r={r} front={<g transform={`translate(${f((j.hL[0] + j.hR[0]) / 2)} ${f(j.hL[1] + 2)})`}><path d="M-10 -3 h20 q-2 10 -10 10 q-8 0 -10 -10 z" className="mn-fill mn-line" /><path d="M2 -3 l5 -12 M4 -14 q4 -2 5 2 q-1 3 -4 1" className="mn-thin" /></g>} /><path d="M-6 -48 q-2 -3 0 -5 M6 -48 q2 -3 0 -5" className="mn-thin" /></>;
  }),
  /** "Reorganizer": a labelled box on one arm, one finger up (it's information architecture) */
  abLabel: mk("-30 -100 62 104", () => {
    const r: Rig = { hip: [0, -25], headTilt: -6, armL: [34, 92], armR: [96, 178], eyes: "happy", mouth: "smile" };
    const j = joints(r);
    const cx = j.hL[0] + 3, cy = j.hL[1] - 5;
    return <><Body r={r} front={<g transform={`translate(${f(cx)} ${f(cy)})`}><path d="M-13 -8 h26 v15 h-26 z" className="mn-fill mn-line" /><path d="M-13 -8 l3 -4 h26 l-3 4 M13 -8 l3 -4 v15 l-3 4" className="mn-fill mn-line" /><rect x="-7" y="-4.6" width="14" height="7" className="mn-fill mn-line" /><path d="M-4 -1.2 h8" className="mn-thin" /></g>} />
      <path d={`M${f(j.hR[0])} ${f(j.hR[1] - 2.4)} v-4.4`} className="mn-line" style={{ strokeWidth: 2 }} /><path d={`M${f(j.hR[0] + 5)} ${f(j.hR[1] - 8)} l3 -2 M${f(j.hR[0] + 6)} ${f(j.hR[1] - 3)} h4`} className="mn-thin" /></>;
  }),
  /** popcorn, very invested in a bad movie */
  abMovie: mk("-26 -64 52 66", () => {
    const r: Rig = { hip: [0, -6], armL: [30, 96], armR: [-150, -170], legL: [-80, 60], legR: [80, -60], eyes: "wide", mouth: "o" };
    const j = joints(r);
    return <><Body r={r} front={<g transform={`translate(${f(j.hL[0] + 2)} ${f(j.hL[1] + 2)})`}><path d="M-6 -8 h12 l-2 12 h-8 z" className="mn-fill mn-line" /><path d="M-6 -8 q1 -4 3 -2 q1 -4 3 -1 q2 -3 3 0 q3 -2 3 3" className="mn-fill mn-line" /><path d="M-3 -6 v9 M1 -6 v9" className="mn-thin" /></g>} /><circle cx={j.hR[0]} cy={j.hR[1] - 5} r="1.6" className="mn-fill mn-thin" /></>;
  }),
  /** tapping an NFC card on a phone */
  abNfc: mk("-28 -84 64 88", () => {
    const r: Rig = { hip: [-6, -25], armL: [60, 100], armR: [40, 80], back: "L", eyes: "dot", mouth: "smile" };
    const j = joints(r);
    return <><Body r={r} front={<g><rect x={j.hR[0] - 1} y={j.hR[1] - 12} width="9" height="15" rx="1.6" className="mn-fill mn-line" /><rect x={j.hR[0] + 6} y={j.hR[1] - 19} width="12" height="8" rx="1" transform={`rotate(-14 ${f(j.hR[0] + 12)} ${f(j.hR[1] - 15)})`} className="mn-fill mn-line" /><path d={`M${f(j.hR[0] + 21)} ${f(j.hR[1] - 22)} q3 3 0 6 M${f(j.hR[0] + 24)} ${f(j.hR[1] - 25)} q5 6 0 12`} className="mn-thin" /></g>} /></>;
  }),
  /** painting at a tiny easel */
  abArt: mk("-24 -92 66 96", () => {
    const r: Rig = { hip: [-6, -25], tilt: 4, armL: [-30, 10], armR: [96, 120], eyes: "side", mouth: "smile" };
    const j = joints(r);
    const top = j.hR[1] - 12;
    return <><g transform="translate(30 0)"><path d={`M-8 0 L-2 ${f(top)} M8 0 L2 ${f(top)} M0 ${f(top)} V0`} className="mn-line" /><rect x="-11" y={top} width="22" height="20" className="mn-fill mn-line" /><path d={`M-6 ${f(top + 14)} q3 -8 6 -3 q3 -6 6 1`} className="mn-thin" /><circle cx="-4" cy={top + 6} r="2" className="mn-thin" /></g><Body r={r} /><path d={`M${f(j.hR[0])} ${f(j.hR[1])} l6 -6`} className="mn-line" /><ellipse cx={j.hL[0] - 3} cy={j.hL[1] + 1} rx="6" ry="3.4" className="mn-fill mn-line" /></>;
  }),

  /** holding up a giant prize cheque */
  abPitch: mk("-34 -88 72 92", () => {
    const r: Rig = { hip: [0, -25], armL: [-150, -170], armR: [150, 170], eyes: "happy", mouth: "open", blush: true };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(0 ${f(j.hL[1] - 8)}) rotate(-4)`}><rect x="-32" y="-10" width="64" height="20" className="mn-fill mn-line" /><text x="-27" y="4" className="mn-text" fontSize="9" fontWeight="700">$$$</text><path d="M-4 3 h30 M-4 -3 h18" className="mn-thin" /></g><path d="M-30 -84 l-3 -4 M30 -84 l3 -4 M0 -90 v-4" className="mn-thin" /></>;
  }),
  /** VR headset on, reaching into thin air */
  abVR: mk("-34 -84 68 88", () => {
    const r: Rig = { hip: [0, -25], headTilt: -4, armL: [-100, -130], armR: [96, 70], eyes: "dot", mouth: "o" };
    const j = joints(r);
    return <><Body r={r} /><rect x="-9" y={j.head[1] - 1.2} width="18" height="7" rx="2.4" className="mn-fill mn-line" transform={`rotate(-4 0 ${f(j.head[1])})`} /><path d={`M${f(j.hR[0] + 4)} ${f(j.hR[1] - 6)} l4 -4 M${f(j.hR[0] + 6)} ${f(j.hR[1])} h5 M${f(j.hL[0] - 4)} ${f(j.hL[1] - 6)} l-4 -4`} className="mn-thin" /><path d="M-30 -20 l4 -6 l4 6 z M24 -30 l3 -5 l3 5 z" className="mn-thin" /></>;
  }),
  /** juggling five things at once (five startups, one summer) */
  abJuggle: mk("-30 -108 60 112", () => {
    const r: Rig = { hip: [0, -25], armL: [-130, -160], armR: [130, 160], eyes: "wide", mouth: "grin" };
    const lift = joints(r).lift;
    const pts: [number, number][] = [[-22, -66 + lift], [-12, -86 + lift], [2, -92 + lift], [16, -86 + lift], [24, -68 + lift]];
    return <><path d={`M-22 ${f(-66 + lift)} Q-20 ${f(-96 + lift)} 2 ${f(-94 + lift)} Q22 ${f(-96 + lift)} 24 ${f(-68 + lift)}`} className="mn-thin" strokeDasharray="2 3" /><Body r={r} />{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" className={i === 2 ? "mn-accent mn-line" : "mn-fill mn-line"} />)}</>;
  }),
  /** reading her own research paper, a wheat stalk in her other hand */
  abCrop: mk("-28 -88 60 92", () => {
    const r: Rig = { hip: [-4, -25], armL: [40, 120], armR: [-40, 150], eyes: "side", mouth: "smile" };
    const j = joints(r);
    return <><Body r={r} front={<g transform={`translate(${f(j.hL[0] - 2)} ${f(j.hL[1] - 6)}) rotate(-8)`}><rect x="-7" y="-9" width="14" height="18" className="mn-fill mn-line" /><path d="M-4 -5 h8 M-4 -1 h6 M-4 3 h7" className="mn-thin" /><path d="M-3 6 l2 -3 l2 2 l2 -4" className="mn-thin" /></g>} /><g transform={`translate(${f(j.hR[0])} ${f(j.hR[1])})`}><path d="M0 0 V-22" className="mn-line" /><path d="M0 -22 q-3 -3 0 -7 q3 4 0 7 M0 -16 q-4 -2 -3 -6 q3 2 3 6 M0 -16 q4 -2 3 -6 q-3 2 -3 6 M0 -10 q-4 -2 -3 -6 q3 2 3 6 M0 -10 q4 -2 3 -6 q-3 2 -3 6" className="mn-fill mn-thin" /></g></>;
  }),
  /** walking with a backpack: the About journey path */
  abTrek: mk("-24 -84 48 88", () => {
    const r: Rig = { hip: [0, -24.8], tilt: 5, armL: [30, 50], armR: [-30, -60], legL: [24, 6], legR: [-22, -46], back: "R", eyes: "side", mouth: "smile" };
    return <><rect x="-15" y="-46" width="9" height="16" rx="2" className="mn-fill mn-line" transform="rotate(5 0 -25)" /><Body r={r} /></>;
  }),

  // CONTACT
  /** throwing a paper plane */
  ctPlane: mk("-30 -92 76 96", () => {
    const r: Rig = { hip: [-8, -25], tilt: 10, armL: [-30, -14], armR: [140, 110], legL: [-14, -6], legR: [16, 4], eyes: "happy", mouth: "open" };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 16)} ${f(j.hR[1] - 10)}) rotate(-16)`}><path d="M-8 2 L10 -3 L-6 -6 Z M-6 -6 L-2 0 L10 -3" className="mn-fill mn-line" /></g><path d={`M${f(j.hR[0] + 2)} ${f(j.hR[1] - 2)} q6 -10 12 -8`} className="mn-thin" strokeDasharray="2 2" /></>;
  }),
  /** listening on the phone, ready */
  ctPhone: mk("-24 -88 50 92", () => {
    const r: Rig = { hip: [0, -25], headTilt: -8, armL: [-8, -2], armR: [150, -150], eyes: "dot", mouth: "smile" };
    const j = joints(r);
    return <><Body r={r} front={<rect x={j.hR[0] - 3.6} y={j.hR[1] - 7} width="6" height="11" rx="1.4" className="mn-fill mn-line" transform={`rotate(-20 ${f(j.hR[0])} ${f(j.hR[1])})`} />} /></>;
  }),

  // CASE STUDIES — small cameos
  /** clipboard, taking notes */
  csNotes: mk("-24 -84 52 88", () => {
    const r: Rig = { hip: [0, -25], armL: [40, 104], armR: [-26, -98], eyes: "side", mouth: "flat" };
    const j = joints(r);
    return <Body r={r} front={<g transform={`translate(${f((j.hL[0] + j.hR[0]) / 2)} ${f(j.hL[1] - 3)})`}><rect x="-7" y="-9" width="14" height="17" className="mn-fill mn-line" /><path d="M-3 -9 v-2 h6 v2 M-4 -4 h8 M-4 0 h6 M-4 4 h7" className="mn-thin" /></g>} />;
  }),
  /** measuring with a tape */
  csTape: mk("-44 -80 88 84", () => {
    const r: Rig = { hip: [0, -25], armL: [-80, -88], armR: [80, 88], eyes: "wide", mouth: "o" };
    const j = joints(r);
    return <><Body r={r} /><path d={`M${f(j.hL[0])} ${f(j.hL[1])} H${f(j.hR[0])}`} className="mn-line" /><path d={`M${f(j.hL[0] + 6)} ${f(j.hL[1])} v-2 M${f(j.hL[0] + 12)} ${f(j.hL[1])} v-3 M${f(j.hR[0] - 12)} ${f(j.hR[1])} v-3 M${f(j.hR[0] - 6)} ${f(j.hR[1])} v-2`} className="mn-thin" /><rect x={j.hR[0] - 1} y={j.hR[1] - 4} width="8" height="8" rx="1.6" className="mn-fill mn-line" /></>;
  }),
  /** tightening a bolt */
  csWrench: mk("-22 -84 60 88", () => {
    const r: Rig = { hip: [-4, -25], tilt: 10, armL: [-10, 10], armR: [96, 60], eyes: "dot", mouth: "tongue" };
    const j = joints(r);
    return <><Body r={r} /><path d={`M${f(j.hR[0])} ${f(j.hR[1])} l12 -6`} className="mn-line" style={{ strokeWidth: 3 }} /><circle cx={j.hR[0] + 14} cy={j.hR[1] - 7} r="3.2" className="mn-fill mn-line" /><path d={`M${f(j.hR[0] + 18)} ${f(j.hR[1] - 14)} q4 4 2 10`} className="mn-thin" /></>;
  }),
  /** thumbs up */
  csThumbs: mk("-26 -88 54 92", () => {
    const r: Rig = { hip: [0, -25], armL: [-8, -2], armR: [120, 168], eyes: "happy", mouth: "grin" };
    const j = joints(r);
    return <><Body r={r} /><path d={`M${f(j.hR[0] - .4)} ${f(j.hR[1] - 2.4)} v-4.6`} className="mn-line" style={{ strokeWidth: 2.4 }} /><path d="M20 -74 l3 -3 M22 -68 h4" className="mn-thin" /></>;
  }),
  /** holding up a little sign */
  csSign: mk("-26 -100 52 104", () => {
    const r: Rig = { hip: [0, -25], armL: [-160, 172], armR: [160, -172], eyes: "dot", mouth: "smile" };
    const j = joints(r);
    return <><Body r={r} /><rect x={j.hL[0] - 4} y={j.hL[1] - 16} width={j.hR[0] - j.hL[0] + 8} height="14" className="mn-fill mn-line" /><path d={`M${f(j.hL[0] + 2)} ${f(j.hL[1] - 9)} h${f(j.hR[0] - j.hL[0] - 4)}`} className="mn-thin" /></>;
  }),
  /** walking with a rolled-up blueprint under her arm: the case-study rail */
  csWalk: mk("-24 -84 50 88", () => {
    const r: Rig = { hip: [0, -24.8], tilt: 4, armL: [18, 60], armR: [-26, -14], legL: [-20, -44], legR: [22, 8], back: "R", eyes: "side", mouth: "flat" };
    return <Body r={r} front={<g transform="translate(4 -40) rotate(-24)"><rect x="-14" y="-3" width="28" height="6" rx="3" className="mn-fill mn-line" /><ellipse cx="14" cy="0" rx="1.6" ry="3" className="mn-thin" /></g>} />;
  }),
  /** holding up a tablet, pointing at it: Traxen overview */
  txTablet: mk("-24 -84 60 88", () => {
    const r: Rig = { hip: [-6, -25], armL: [-12, -4], armR: [110, 150], eyes: "happy", mouth: "open" };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 10)} ${f(j.hR[1] - 2)}) rotate(8)`}><rect x="-9" y="-12" width="18" height="24" rx="2.4" className="mn-fill mn-line" /><rect x="-6" y="-8" width="12" height="7" rx="1.4" className="mn-solid" /></g></>;
  }),
  /** stacking the top block onto a rising bar chart: increased retention */
  txRetain: mk("-30 -88 80 92", () => {
    const r: Rig = { hip: [-12, -25], tilt: 6, armL: [-10, -2], armR: [130, 150], eyes: "happy", mouth: "grin" };
    const j = joints(r);
    return <><g>{[[14, 18], [26, 30], [38, 46]].map(([x, h]) => <rect key={x} x={x} y={-h} width="10" height={h} className="mn-fill mn-line" />)}</g><Body r={r} /><rect x={j.hR[0] - 2} y={j.hR[1] - 9} width="10" height="9" className="mn-accent mn-line" /><path d="M46 -64 l4 -4 M52 -58 h5" className="mn-thin" /></>;
  }),
  /** leaning back, hands behind her head, nothing to juggle: reduced cognitive load */
  txCalm: mk("-30 -66 64 70", () => {
    const r: Rig = { hip: [0, -6], tilt: -14, headTilt: 8, armL: [-150, 60], armR: [-170, 40], legL: [86, 92], legR: [94, 100], back: "both", eyes: "closed", mouth: "smile" };
    return <><Body r={r} /><text x="16" y="-52" className="mn-text" fontSize="8" style={{ fontFamily: "var(--hand)" }}>ahh</text></>;
  }),
  /** star-jumping next to a smiling truck: happier fleets and drivers */
  txHappy: mk("-30 -92 92 96", () => {
    const r: Rig = { hip: [-10, -30], armL: [-140, -160], armR: [140, 160], legL: [-24, -14], legR: [24, 14], eyes: "happy", mouth: "open", blush: true };
    return <><Body r={r} /><g transform="translate(36 0)"><rect x="-4" y="-22" width="22" height="16" className="mn-fill mn-line" /><path d="M18 -16 h8 l5 6 v4 h-13 z" className="mn-fill mn-line" /><circle cx="2" cy="-4" r="3.4" className="mn-fill mn-line" /><circle cx="24" cy="-4" r="3.4" className="mn-fill mn-line" /><path d="M21 -14 h5 l3 4" className="mn-thin" /></g></>;
  }),
  /** tossing yet another draft into the bin: design is an evolution */
  txEvolve: mk("-26 -86 78 90", () => {
    const r: Rig = { hip: [-8, -25], tilt: 6, armL: [-12, -4], armR: [120, 100], eyes: "side", mouth: "smile" };
    const j = joints(r);
    return <><Body r={r} /><circle cx={j.hR[0] + 14} cy={j.hR[1] - 12} r="3.4" className="mn-fill mn-line" /><path d={`M${f(j.hR[0] + 3)} ${f(j.hR[1] - 4)} q6 -12 11 -8`} className="mn-thin" strokeDasharray="2 2" /><path d="M34 0 l-3 -18 h18 l-3 18 z" className="mn-fill mn-line" /><circle cx="22" cy="-3" r="3" className="mn-fill mn-line" /><circle cx="14" cy="-2.6" r="2.6" className="mn-fill mn-line" /></>;
  }),
  /** hand cupped to her ear, listening: the user is the ultimate decision-maker */
  txListen: mk("-24 -88 60 92", () => {
    const r: Rig = { hip: [-4, -25], tilt: 8, headTilt: 10, armL: [-10, -4], armR: [150, -150], eyes: "wide", mouth: "o" };
    return <><Body r={r} /><path d="M22 -70 q6 4 0 10 M27 -74 q10 8 0 18" className="mn-thin" /><text x="30" y="-78" className="mn-text" fontSize="9" style={{ fontFamily: "var(--hand)" }}>?</text></>;
  }),
  /** under an umbrella in the rain: think beyond the happy path */
  txUmbrella: mk("-28 -98 60 102", () => {
    const r: Rig = { hip: [0, -25], armL: [-10, -4], armR: [150, 176], eyes: "dot", mouth: "smile" };
    const j = joints(r);
    return <><Body r={r} /><path d={`M${f(j.hR[0])} ${f(j.hR[1] + 6)} V${f(j.hR[1] - 18)}`} className="mn-line" /><path d={`M${f(j.hR[0] - 24)} ${f(j.hR[1] - 16)} Q${f(j.hR[0])} ${f(j.hR[1] - 40)} ${f(j.hR[0] + 24)} ${f(j.hR[1] - 16)} q-6 -4 -12 0 q-6 -4 -12 0 q-6 -4 -12 0 q-6 -4 -12 0 z`} className="mn-accent mn-line" />{[[-22, -8], [-18, 6], [26, -4], [22, 10], [-6, -30], [12, -28]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 40} l-1.6 4`} className="mn-thin" />)}</>;
  }),
  /** asleep at her desk, head on her arms, "M" laptop + "UX" mug beside her (echoes her own desk drawings): home "wake her up" (before) */
  wkSleep: mk("-30 -70 104 74", () => {
    const r: Rig = { hip: [-4, -14], tilt: 30, headTilt: 46, armL: [74, 98], armR: [62, 96], legL: [80, 0], legR: [86, 4], back: "L", eyes: "closed", mouth: "flat" };
    const seat = joints(r).hip[1] + 2.5, desk = seat - 9;
    return <><DeskScene seat={seat} /><Body r={r} /><Laptop x={50} y={desk} s={0.8} /><Mug x={67} y={desk - 6} s={0.75} />
      <text x="20" y={desk - 26} className="mn-text" fontSize="9" style={{ fontFamily: "var(--hand)" }}>z</text><text x="27" y={desk - 33} className="mn-text" fontSize="7" style={{ fontFamily: "var(--hand)" }}>z</text><text x="33" y={desk - 39} className="mn-text" fontSize="5.5" style={{ fontFamily: "var(--hand)" }}>z</text></>;
  }),
  /** same desk, bolt upright, arms up, wide awake: home "wake her up" (after) */
  wkAwake: mk("-30 -112 104 116", () => {
    const r: Rig = { hip: [-4, -14], headTilt: -4, armL: [-150, -168], armR: [150, 168], legL: [80, 0], legR: [86, 4], eyes: "wide", mouth: "open" };
    const seat = joints(r).hip[1] + 2.5, desk = seat - 9;
    return <><DeskScene seat={seat} /><Body r={r} /><Laptop x={50} y={desk} s={0.8} /><Mug x={67} y={desk - 6} s={0.75} steam />
      <path d="M-24 -98 l-4 -4 M16 -98 l4 -4 M-4 -108 v-5" className="mn-thin" /></>;
  }),
  /** hand on hip, pointing back along her own timeline: home "My story" */
  hmStory: mk("-30 -88 66 92", () => {
    const r: Rig = { hip: [-4, -25], tilt: -3, headTilt: -6, armL: [-60, 30], armR: [100, 128], eyes: "happy", mouth: "smile" };
    return <><Body r={r} /><path d="M26 -58 l5 -2 M27 -52 h6" className="mn-thin" /></>;
  }),
  /** pointing at a map pin */
  csPoint: mk("-24 -88 66 92", () => {
    const r: Rig = { hip: [-6, -25], armL: [-8, -2], armR: [118, 128], eyes: "side", mouth: "open" };
    const j = joints(r);
    return <><Body r={r} /><path d={`M${f(j.hR[0] + 14)} ${f(j.hR[1] - 2)} c-6 -6 -6 -14 0 -14 c6 0 6 8 0 14 z`} className="mn-fill mn-line" /><circle cx={j.hR[0] + 14} cy={j.hR[1] - 10} r="2" className="mn-thin" /></>;
  }),
  /** magnifying glass up to one eye */
  csMagnify: mk("-28 -84 58 88", () => {
    const r: Rig = { hip: [0, -25], headTilt: -6, armL: [-8, -2], armR: [150, -132], eyes: "wide", mouth: "o" };
    const j = joints(r);
    return <><Body r={r} /><circle cx={j.hR[0] - 8} cy={j.hR[1] - 8} r="7" className="mn-line" style={{ fill: "rgba(255,255,255,.12)" }} /><path d={`M${f(j.hR[0] - 3)} ${f(j.hR[1] - 3)} L${f(j.hR[0])} ${f(j.hR[1])}`} className="mn-line" style={{ strokeWidth: 3 }} /></>;
  }),
  /** drawing with a pencil taller than she is */
  csPencil: mk("-26 -92 66 96", () => {
    const r: Rig = { hip: [-8, -25], tilt: 8, armL: [100, 120], armR: [70, 100], back: "L", eyes: "dot", mouth: "tongue" };
    const j = joints(r);
    return <><g transform={`translate(${f(j.hR[0] + 2)} ${f(j.hR[1])}) rotate(24)`}><path d="M-3 -40 h6 v38 l-3 6 l-3 -6 z" className="mn-fill mn-line" /><path d="M-3 -2 h6 M-3 -34 h6" className="mn-thin" /></g><Body r={r} /><path d="M10 0 q8 -6 16 -2 t16 -1" className="mn-thin" /></>;
  }),
  /** carrying a box of parts */
  csBox: mk("-24 -84 50 88", () => {
    const r: Rig = { hip: [0, -25], tilt: -4, armL: [30, 80], armR: [-30, -80], eyes: "closed", mouth: "flat" };
    const j = joints(r);
    return <Body r={r} front={<g transform={`translate(${f((j.hL[0] + j.hR[0]) / 2)} ${f(j.hL[1] - 4)})`}><rect x="-11" y="-9" width="22" height="16" className="mn-fill mn-line" /><path d="M-11 -4 h22 M-3 -9 v5" className="mn-thin" /></g>} />;
  }),
  /** planting a flag */
  csFlag: mk("-30 -98 62 102", () => {
    const r: Rig = { hip: [-6, -25], armL: [-10, -2], armR: [120, 160], eyes: "happy", mouth: "grin" };
    const j = joints(r);
    return <><path d={`M${f(j.hR[0])} ${f(j.hR[1] - 18)} V0`} className="mn-line" /><path d={`M${f(j.hR[0])} ${f(j.hR[1] - 18)} h14 l-3 5 l3 5 h-14`} className="mn-accent mn-line" /><Body r={r} /></>;
  }),
  /** holding a heart */
  csHeart: mk("-24 -84 50 88", () => {
    const r: Rig = { hip: [0, -25], armL: [40, 110], armR: [-40, -110], eyes: "happy", mouth: "smile", blush: true };
    const j = joints(r);
    return <Body r={r} front={<path transform={`translate(${f((j.hL[0] + j.hR[0]) / 2)} ${f(j.hL[1] - 2)})`} d="M0 6 C-10 -2 -8 -10 -3 -10 C-1 -10 0 -8 0 -7 C0 -8 1 -10 3 -10 C8 -10 10 -2 0 6 Z" className="mn-fill mn-line" />} />;
  }),
  /** binoculars */
  csBinoc: mk("-24 -88 50 92", () => {
    const r: Rig = { hip: [0, -25], armL: [-160, 150], armR: [160, -150], eyes: "wide", mouth: "o" };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(0 ${f(j.hL[1] + 1)})`}><rect x="-9" y="-4" width="7" height="8" rx="2" className="mn-fill mn-line" /><rect x="2" y="-4" width="7" height="8" rx="2" className="mn-fill mn-line" /><path d="M-2 0 h4" className="mn-line" /></g></>;
  }),
  /** ticking off a very long checklist */
  csCheck: mk("-24 -84 54 96", () => {
    const r: Rig = { hip: [-4, -25], armL: [30, 80], armR: [-10, 60], eyes: "dot", mouth: "flat" };
    const j = joints(r);
    return <Body r={r} front={<g transform={`translate(${f(j.hL[0] + 6)} ${f(j.hL[1] - 4)})`}><path d="M-6 -6 h14 v26 q-4 -2 -7 2 q-3 -3 -7 0 z" className="mn-fill mn-line" /><path d="M-3 -2 l1.4 1.4 l3 -3 M-3 4 l1.4 1.4 l3 -3 M-3 10 h7 M-3 15 h6" className="mn-thin" /></g>} />;
  }),
  /** typing on a laptop held on one arm, standing */
  csLaptop: mk("-24 -84 54 88", () => {
    const r: Rig = { hip: [-2, -25], armL: [30, 90], armR: [-10, 80], eyes: "dot", mouth: "flat" };
    const j = joints(r);
    return <><Body r={r} front={<g transform={`translate(${f(j.hL[0] + 4)} ${f(j.hL[1])}) rotate(180)`}><Laptop x={0} y={0} s={.7} logo={false} /></g>} /><path d="M20 -66 l4 -2 M21 -60 h5" className="mn-thin" /></>;
  }),
  /** a trophy over her head */
  csTrophy: mk("-24 -98 54 102", () => {
    const r: Rig = { hip: [-4, -25], armL: [-10, -4], armR: [148, 170], eyes: "happy", mouth: "open" };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 1)} ${f(j.hR[1] - 1)})`}><path d="M-6 -12 h12 q0 10 -6 11 q-6 -1 -6 -11 z M-1.6 -1 v4 h3.2 v-4 M-4 3 h8" className="mn-accent mn-line" /><path d="M-6 -10 q-4 0 -3 3 t4 2 M6 -10 q4 0 3 3 t-4 2" className="mn-thin" /></g></>;
  }),
  // BUYMYSPOT — the full case study (each used once)
  /** holding up a big phone with a map pin on it: overview */
  bmsPhone: mk("-26 -100 70 104", () => {
    const r: Rig = { hip: [-6, -25], armL: [-8, -2], armR: [118, 168], eyes: "happy", mouth: "open" };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 9)} ${f(j.hR[1] - 6)}) rotate(8)`}><rect x="-9" y="-16" width="18" height="30" rx="3" className="mn-fill mn-line" /><path d="M-5 -10 h10 M-5 -6 h6 M-5 6 h10" className="mn-thin" /><path d="M0 4 c-4 -4 -4 -9 0 -9 c4 0 4 5 0 9 z" className="mn-accent mn-line" /></g><path d="M30 -84 l4 -3 M32 -78 h5" className="mn-thin" /></>;
  }),
  /** pushing a giant slider knob from $ toward a short walk: the price ↔ proximity trade-off */
  bmsSlider: mk("-46 -92 124 96", () => {
    const r: Rig = { hip: [-8, -25], tilt: 14, armL: [70, 82], armR: [80, 90], legL: [-22, -34], legR: [26, 10], back: "L", eyes: "dot", mouth: "tongue" };
    const j = joints(r);
    const kx = j.hR[0] + 7;
    return <><g transform={`translate(0 ${f(j.lift)})`}><path d="M-42 -42 H74" className="mn-line" /><path d="M-42 -48 v12 M74 -48 v12" className="mn-thin" />
      <text x="-42" y="-54" className="mn-text" fontSize="9" style={{ fontFamily: "var(--hand)" }}>$</text><text x="56" y="-54" className="mn-text" fontSize="8" style={{ fontFamily: "var(--hand)" }}>close</text>
      </g><Body r={r} /><g transform={`translate(0 ${f(j.lift)})`}><rect x={kx - 6} y={-56} width="12" height="28" rx="3" className="mn-fill mn-line" /><path d={`M${f(kx - 2)} -48 v12 M${f(kx + 2)} -48 v12`} className="mn-thin" /></g></>;
  }),
  /** shrugging at an error: the edge cases */
  bmsOops: mk("-34 -100 72 104", () => {
    const r: Rig = { hip: [0, -25], headTilt: -8, armL: [-68, -150], armR: [68, 150], eyes: "wide", mouth: "flat" };
    return <><Body r={r} /><g transform="translate(26 -82)"><path d="M0 -9 L9 7 H-9 Z" className="mn-fill mn-line" /><path d="M0 -3 v5" className="mn-line" /><circle cx="0" cy="4.6" r=".9" className="mn-solid" /></g><text x="-30" y="-80" className="mn-text" fontSize="11" style={{ fontFamily: "var(--hand)" }}>?!</text></>;
  }),
  /** mid-story with two speech bubbles over her: let the people tell you what to build */
  bmsTalk: mk("-40 -104 86 108", () => {
    const r: Rig = { hip: [-4, -25], tilt: -4, armL: [-8, -2], armR: [108, 150], eyes: "happy", mouth: "open" };
    return <><Body r={r} /><g><rect x="-38" y="-102" width="30" height="16" rx="7" className="mn-fill mn-line" /><path d="M-26 -86 l-2 6 l7 -6" className="mn-fill mn-line" /><path d="M-30 -94 h3 M-24.5 -94 h3 M-19 -94 h3" className="mn-line" /></g>
      <g><rect x="14" y="-98" width="26" height="16" rx="7" className="mn-fill mn-line" /><path d="M22 -82 l-1 6 l6 -6" className="mn-fill mn-line" /><text x="27" y="-86" textAnchor="middle" className="mn-text" fontSize="11" fontWeight="700">!</text></g></>;
  }),
  /** holding open a style guide with a grid on it: a style guide + flowchart is non-negotiable */
  bmsGuide: mk("-30 -88 60 92", () => {
    const r: Rig = { hip: [0, -25], armL: [44, 112], armR: [-44, -112], eyes: "side", mouth: "smile" };
    const j = joints(r);
    return <Body r={r} front={<g transform={`translate(${f((j.hL[0] + j.hR[0]) / 2)} ${f(j.hL[1] - 2)})`}><path d="M-16 -16 l16 3 l16 -3 v18 l-16 3 l-16 -3 z" className="mn-fill mn-line" /><path d="M0 -13 v18" className="mn-thin" /><path d="M-12 -10 l9 1.6 M-12 -5 l9 1.6 M-12 0 l9 1.6 M-8 -12.6 v14 M3 -11.4 h10 v8 h-10 z M8 -11.4 v8" className="mn-thin" /></g>} />;
  }),
  /** jogging inside a loop of arrows: test after every pass */
  bmsLoop: mk("-44 -96 88 100", () => {
    const r: Rig = { hip: [0, -27], tilt: 10, armL: [44, 90], armR: [-40, -6], legL: [44, 6], legR: [-36, -70], back: "R", eyes: "side", mouth: "grin" };
    return <><path d="M-36 -62 A40 40 0 0 1 32 -70" className="mn-thin" strokeDasharray="3 3" /><path d="M26 -74 l7 4 l-7 4" className="mn-thin" />
      <path d="M36 -8 A40 40 0 0 1 -32 -4" className="mn-thin" strokeDasharray="3 3" /><path d="M-26 0 l-7 -4 l7 -4" className="mn-thin" /><Body r={r} /></>;
  }),

  /** pressing a giant app icon with a P on it: more people opening the app */
  bmsTapApp: mk("-28 -96 84 100", () => {
    const r: Rig = { hip: [-8, -25], tilt: 6, armL: [-10, -2], armR: [92, 76], eyes: "happy", mouth: "open" };
    const lift = joints(r).lift;
    return <><g transform={`translate(36 ${f(-40 + lift)})`}><rect x="-13" y="-13" width="26" height="26" rx="7" className="mn-fill mn-line" /><text x="0" y="5.5" textAnchor="middle" className="mn-text" fontSize="15" fontWeight="700">P</text></g>
      <path transform={`translate(0 ${f(lift)})`} d="M36 -60 v-6 M50 -54 l4 -4 M22 -54 l-4 -4 M54 -40 h6" className="mn-thin" /><Body r={r} /></>;
  }),
  /** catching a boomerang that came back: more parkers coming back */
  bmsBoomerang: mk("-26 -100 82 104", () => {
    const r: Rig = { hip: [-8, -25], armL: [-8, -2], armR: [124, 156], eyes: "wide", mouth: "grin" };
    const j = joints(r);
    return <><path d={`M${f(j.hR[0] + 4)} ${f(j.hR[1] - 6)} C${f(j.hR[0] + 30)} -104 52 -70 44 -40`} className="mn-thin" strokeDasharray="2 3" />
      <g transform={`translate(${f(j.hR[0] + 2)} ${f(j.hR[1] - 6)}) rotate(-20)`}><path d="M-8 0 Q0 -8 8 0 L5 2 Q0 -3 -5 2 Z" className="mn-accent mn-line" /></g><Body r={r} /></>;
  }),
  /** fanning out a swatch deck: one set of tokens, every screen */
  bmsSwatch: mk("-30 -96 72 100", () => {
    const r: Rig = { hip: [-6, -25], armL: [-10, -2], armR: [112, 150], eyes: "side", mouth: "smile" };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 2)} ${f(j.hR[1] - 2)})`}>{[-50, -25, 0, 25].map((a, k) => <g key={a} transform={`rotate(${a})`}><rect x="-3.4" y="-26" width="6.8" height="24" rx="1.4" className={k === 2 ? "mn-accent mn-line" : "mn-fill mn-line"} /><path d="M-2 -22 h4" className="mn-thin" /></g>)}<circle cx="0" cy="0" r="1.6" className="mn-solid" /></g></>;
  }),

  // LUXURY VEHICLE × GM — the case study (each used once)
  /** holding a steering wheel out in front with both hands: the hero cameo, inside the exploded drawing */
  gmWheel: mk("-30 -90 60 94", () => {
    const r: Rig = { hip: [0, -25], armL: [52, 100], armR: [-52, -100], eyes: "happy", mouth: "grin" };
    const j = joints(r);
    const cx = (j.hL[0] + j.hR[0]) / 2, cy = j.hL[1] - 2;
    return <Body r={r} front={<g transform={`translate(${f(cx)} ${f(cy)})`}><circle r="14" className="mn-line" style={{ fill: "none" }} /><circle r="4" className="mn-fill mn-line" /><path d="M-14 0 h10 M4 0 h10 M0 4 v10" className="mn-line" /></g>} />;
  }),
  /** pointing up at a rising line on a little chart: personalization drives loyalty (research) */
  gmTrend: mk("-30 -96 84 100", () => {
    const r: Rig = { hip: [-10, -25], tilt: -4, armL: [-8, -2], armR: [132, 150], eyes: "side", mouth: "smile" };
    return <><g transform="translate(36 -60)"><rect x="-16" y="-20" width="32" height="34" className="mn-fill mn-line" /><path d="M-11 8 L-3 0 L3 4 L11 -12" className="mn-line" /><path d="M7 -12 h4 v4" className="mn-line" /><path d="M-11 11 h22" className="mn-thin" /><path d="M0 14 v12" className="mn-line" /></g><Body r={r} /></>;
  }),
  /** holding up an empty screen frame with its size written on it: the screen-size brief (define) */
  gmScreen: mk("-36 -96 72 100", () => {
    const r: Rig = { hip: [0, -25], armL: [150, 176], armR: [-150, -176], eyes: "dot", mouth: "open" };
    const j = joints(r);
    const cx = (j.hL[0] + j.hR[0]) / 2, cy = Math.min(j.hL[1], j.hR[1]);
    return <><Body r={r} /><g transform={`translate(${f(cx)} ${f(cy - 4)})`}><rect x="-26" y="-18" width="52" height="24" rx="3" className="mn-fill mn-line" /><text x="0" y="-2" textAnchor="middle" className="mn-text" fontSize="9" style={{ fontFamily: "var(--hand)" }}>7" × 14"</text></g></>;
  }),
  /** reaching up to hang a star in the sky: the customizable sky theme */
  gmStars: mk("-28 -112 76 116", () => {
    const r: Rig = { hip: [-6, -25], tilt: -6, armL: [-10, -2], armR: [156, 172], legR: [10, 4], eyes: "happy", mouth: "smile" };
    const j = joints(r);
    const star = (x: number, y: number, s: number, cls = "mn-fill mn-line") => <path transform={`translate(${f(x)} ${f(y)}) scale(${s})`} d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z" className={cls} />;
    return <><path d="M14 -104 L30 -96 L40 -108 M30 -96 L34 -82" className="mn-thin" strokeDasharray="2 3" />{star(14, -104, .7)}{star(40, -108, .6)}{star(34, -82, .55)}<Body r={r} />{star(j.hR[0] + 2, j.hR[1] - 6, 1, "mn-accent mn-line")}</>;
  }),
  /** turning a big climate dial set to 21°: the dedicated HVAC panel */
  gmThermo: mk("-26 -88 78 92", () => {
    const r: Rig = { hip: [-8, -25], tilt: 6, armL: [-10, -2], armR: [96, 60], eyes: "side", mouth: "tongue" };
    const lift = joints(r).lift;
    return <><g transform={`translate(34 ${f(-44 + lift)})`}><circle r="14" className="mn-fill mn-line" /><circle r="9" className="mn-thin" /><path d="M0 -14 v5" className="mn-line" /><text x="0" y="3.4" textAnchor="middle" className="mn-text" fontSize="8" fontWeight="700">21°</text><path d="M-18 -10 a20 20 0 0 1 8 -8" className="mn-thin" /><path d="M-12 -19 l2 1.6 l-2.4 1" className="mn-thin" /></g><Body r={r} /></>;
  }),
  /** measuring a single icon tile with arrows: 44 × 44 touch targets (the system) */
  gmIcon: mk("-26 -92 80 96", () => {
    const r: Rig = { hip: [-8, -25], armL: [-8, -2], armR: [110, 140], eyes: "tired", mouth: "flat" };
    return <><g transform="translate(36 -50)"><rect x="-11" y="-11" width="22" height="22" rx="3" className="mn-fill mn-line" /><path d="M-5 3 V-1 L0 -5 L5 -1 V3 Z" className="mn-thin" /><path d="M-11 16 H11 M-11 14 v4 M11 14 v4 M16 -11 V11 M14 -11 h4 M14 11 h4" className="mn-thin" /><text x="0" y="26" textAnchor="middle" className="mn-text" fontSize="7" style={{ fontFamily: "var(--hand)" }}>44</text></g><Body r={r} /></>;
  }),
  /** dangling a set of car keys and winking: the end of the case study */
  gmKeys: mk("-26 -96 70 100", () => {
    const r: Rig = { hip: [-6, -25], headTilt: 6, armL: [-8, -2], armR: [132, 178], eyes: "happy", mouth: "grin", blush: true };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 1)} ${f(j.hR[1] + 3)})`}><circle cy="2" r="3.4" className="mn-line" style={{ fill: "none" }} /><path d="M0 5 l-4 12 M0 5 l3 13" className="mn-line" /><rect x="-8" y="16" width="8" height="11" rx="2.4" className="mn-fill mn-line" /><path d="M3 18 v9 l2 -1.6 M3 22 h2" className="mn-line" /></g><path d="M30 -70 l4 -3 M32 -62 h5" className="mn-thin" /></>;
  }),

  // PLAY PAGE
  /** "Pick a toy": gripping a game controller with both hands, wide stance (unused since Play became the Lab) */
  plController: mk("-30 -90 60 94", () => {
    const r: Rig = { hip: [0, -25], armL: [44, 104], armR: [-44, -104], legL: [-30, -4], legR: [30, 4], eyes: "wide", mouth: "grin", blush: true };
    const j = joints(r);
    const cx = (j.hL[0] + j.hR[0]) / 2, cy = j.hL[1] - 1;
    return <><Body r={r} front={<g transform={`translate(${f(cx)} ${f(cy)})`}><path d="M-13 -4 q0 -5 5 -5 h16 q5 0 5 5 l2 7 q1 5 -4 5 q-3 0 -5 -3 h-12 q-2 3 -5 3 q-5 0 -4 -5 z" className="mn-fill mn-line" /><path d="M-8 -3 v4 M-10 -1 h4" className="mn-thin" /><circle cx="6" cy="-2" r="1.2" className="mn-solid" /><circle cx="9" cy="1" r="1.2" className="mn-accent mn-line" /></g>} /><path d="M-24 -70 l-4 -3 M24 -70 l4 -3 M0 -92 v-4" className="mn-thin" /></>;
  }),

  // HOME — working with AI
  /** "High five, robot": a small robot reaches up and she meets it halfway: home "Working with AI" */
  hmAI: mk("-28 -96 92 100", () => {
    const r: Rig = { hip: [-8, -25], tilt: 6, armL: [-10, -2], armR: [104, 140], eyes: "happy", mouth: "grin" };
    const j = joints(r);
    const [hx, hy] = j.hR;
    return <><g transform="translate(46 0) scale(1.4)"><rect x="-9" y="-22" width="18" height="20" rx="3" className="mn-fill mn-line" /><path d="M-5 0 v-2 M5 0 v-2" className="mn-line" /><rect x="-10" y="-40" width="20" height="16" rx="4" className="mn-fill mn-line" /><circle cx="-4" cy="-32" r="1.6" className="mn-solid" /><circle cx="4" cy="-32" r="1.6" className="mn-solid" /><path d="M0 -40 v-6" className="mn-line" /><circle cx="0" cy="-48" r="2.2" className="mn-accent mn-line" /></g>
      <path d={`M33.4 -22 L${f(hx + 6)} ${f(hy + 4)}`} className="mn-line" /><circle cx={hx + 5} cy={hy + 2.6} r="2.4" className="mn-fill mn-line" />
      <Body r={r} /><path d={`M${f(hx + 3)} ${f(hy - 6)} l3 -4 M${f(hx + 8)} ${f(hy - 2)} l5 -2 M${f(hx - 2)} ${f(hy - 8)} l0 -5`} className="mn-thin" /></>;
  }),

  // RÉSUMÉ PAGE
  /** holding out a single sheet of paper: here's my résumé */
  rsHand: mk("-26 -92 74 96", () => {
    const r: Rig = { hip: [-6, -25], headTilt: 6, armL: [-8, -2], armR: [96, 126], eyes: "happy", mouth: "smile", blush: true };
    const j = joints(r);
    return <><Body r={r} /><g transform={`translate(${f(j.hR[0] + 10)} ${f(j.hR[1] - 8)}) rotate(10)`}><path d="M-9 -12 h13 l5 5 v19 h-18 z M4 -12 v5 h5" className="mn-fill mn-line" /><path d="M-5 -4 h9 M-5 0 h10 M-5 4 h7 M-5 8 h9" className="mn-thin" /></g></>;
  }),
  /** reaching up to hang a picture frame on a nail: the extra-projects wall */
  rsFrame: mk("-28 -110 76 114", () => {
    const r: Rig = { hip: [-10, -25], tilt: -4, armL: [-8, -2], armR: [150, 168], eyes: "dot", mouth: "tongue" };
    return <><circle cx="24" cy="-104" r="1.4" className="mn-solid" /><path d="M24 -104 L12 -90 M24 -104 L36 -90" className="mn-thin" /><rect x="8" y="-90" width="32" height="24" className="mn-fill mn-line" /><path d="M12 -70 l8 -10 l6 6 l4 -4 l6 8 z" className="mn-thin" /><circle cx="33" cy="-83" r="2.2" className="mn-thin" /><Body r={r} /></>;
  }),

  // ABOUT — weekend mode
  /** "Weekend kayaker": sitting in her kayak, paddle across her body, grinning */
  abPaddle: mk("-54 -78 108 84", () => {
    const r: Rig = { hip: [0, -10], armL: [36, 116], armR: [-24, -96], noLegs: true, eyes: "happy", mouth: "grin" };
    const j = joints(r);
    const dx = j.hR[0] - j.hL[0], dy = j.hR[1] - j.hL[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    const a: P = [j.hL[0] - ux * 22, j.hL[1] - uy * 22], b: P = [j.hR[0] + ux * 22, j.hR[1] + uy * 22];
    const ang = Math.atan2(uy, ux) * 180 / Math.PI;
    return <><Body r={r} front={<g>
      <path d="M-50 -14 C-30 -11 30 -11 50 -16 C42 -5 22 -1 0 -1 C-24 -1 -42 -5 -50 -14 Z" className="mn-fill mn-line" />
      <ellipse cx="0" cy="-12.6" rx="12" ry="2.6" className="mn-fill mn-line" /><path d="M-36 -9 C-20 -6 20 -6 36 -10" className="mn-thin" />
      <path d={line(a, b)} className="mn-line" style={{ strokeWidth: 2.2 }} />
      <ellipse cx={a[0]} cy={a[1]} rx="7" ry="3.4" transform={`rotate(${f(ang)} ${f(a[0])} ${f(a[1])})`} className="mn-fill mn-line" />
      <ellipse cx={b[0]} cy={b[1]} rx="7" ry="3.4" transform={`rotate(${f(ang)} ${f(b[0])} ${f(b[1])})`} className="mn-fill mn-line" /></g>} />
      <path d="M-50 3 q6 -4 12 0 t12 0 M-6 4 q6 -4 12 0 t12 0 M30 2 q6 -4 12 0" className="mn-thin" /></>;
  }),
} satisfies Record<string, PoseFn>;

export type PoseName = keyof typeof POSES;

/** Her own drawings replace the code-drawn poses (2026-10-05): pose → [art file in /art, natural height px].
 *  Each drawing is used once. Images never render taller than ~1.2× their natural height, so nothing goes soft. */
export const ART: Partial<Record<PoseName, [string, number]>> = {
  wkSleep: ["ld-tired", 150],
  wkAwake: ["at-armsup", 113],
  walkA: ["at-walk", 100],
  walkB: ["at-walk", 100],
  txTablet: ["at-tablet", 104],
  txRetain: ["at-presentteam", 92],
  txCalm: ["ld-listening", 225],
  txHappy: ["at-highfive", 108],
  csTape: ["at-magnify", 108],
  csWrench: ["at-fixbug", 94],
  txListen: ["at-listen", 117],
  txUmbrella: ["at-debug", 112],
  csThumbs: ["at-thumbs", 100],
  csSign: ["at-hips", 132],
  csPoint: ["at-bulb", 106],
  bmsPhone: ["at-phone", 88],
  csMagnify: ["at-compare", 102],
  bmsSlider: ["at-puzzled", 113],
  bmsOops: ["at-brokenui", 111],
  csPencil: ["at-erase", 112],
  csBox: ["at-laptopclosed", 95],
  bmsTalk: ["at-interview", 92],
  bmsGuide: ["at-designui", 116],
  bmsLoop: ["at-testing", 100],
  bmsTapApp: ["at-fistpump", 121],
  bmsBoomerang: ["at-celebrate", 122],
  bmsSwatch: ["at-phoneui", 101],
  csFlag: ["at-final", 100],
  csHeart: ["at-floor", 115],
  csBinoc: ["at-think", 104],
  csCheck: ["at-writing", 101],
  csLaptop: ["at-focused", 124],
  csTrophy: ["at-victory", 112],
  gmWheel: ["at-headphones", 113],
  gmTrend: ["at-connect", 105],
  gmScreen: ["at-wireframe", 111],
  gmStars: ["at-stars", 104],
  gmThermo: ["at-coffee", 98],
  gmIcon: ["at-debug2", 88],
  gmKeys: ["at-goodbye", 99],
  abTrek: ["ld-idea", 205],
  abLabel: ["at-sticky", 104],
  abMovie: ["at-cheeks", 106],
  abBake: ["at-hair", 101],
  abPitch: ["at-present", 104],
  abJuggle: ["at-overwhelmed", 103],
  abCrop: ["at-readbook", 106],
  rsHand: ["at-card", 102],
};
/** `unit` sets a consistent scale across poses: CSS length per drawing unit (e.g. 1.4 → px, or "0.011em"). */
export function Mini({ pose, label, className, style, tone, unit, at }: {
  pose: PoseName; label?: string; className?: string; style?: CSSProperties; tone?: "paper" | "dark"; unit?: number | string;
  /** inside another SVG: [x, y, scale] in the parent's units */
  at?: [number, number, number];
}) {
  const fn = POSES[pose];
  const art = ART[pose];
  if (art) {
    const [, , w, h] = fn.vb.split(" ").map(Number);
    const src = `/art/${art[0]}-${tone === "paper" ? "ink" : "white"}.png`;
    if (at) return <image href={src} x={at[0]} y={at[1]} width={w * at[2]} height={h * at[2]} preserveAspectRatio="xMidYMax meet" aria-label={label} />;
    const u = unit === undefined ? undefined : typeof unit === "number" ? `${unit}px` : unit;
    const sized: CSSProperties = { ...(u ? { height: `calc(${h} * ${u})` } : {}), width: "auto", maxHeight: Math.round(art[1] * (art[0].startsWith("at-") ? 2.4 : 1.2)), ...style };
    return <img src={src} alt={label ?? ""} aria-hidden={label ? undefined : true} className={`mn mn-art ${className ?? ""}`} style={sized} />;
  }
  if (at) {
    const [, , w, h] = fn.vb.split(" ").map(Number);
    return <>{fn({ label, className, tone, place: [at[0], at[1], w * at[2], h * at[2]], style: { width: w * at[2], height: h * at[2] } })}</>;
  }
  let sized = style;
  if (unit !== undefined) {
    const [, , w, h] = fn.vb.split(" ").map(Number);
    const u = typeof unit === "number" ? `${unit}px` : unit;
    sized = { width: `calc(${w} * ${u})`, height: `calc(${h} * ${u})`, ...style };
  }
  return <>{fn({ label, className, style: sized, tone })}</>;
}
