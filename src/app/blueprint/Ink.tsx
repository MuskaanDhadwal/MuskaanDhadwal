// Ink kit — hand-drawn line illustrations for the blueprint comic.
// Everything is plain SVG + a shared "wobble" filter that makes strokes look pen-drawn.
import type { CSSProperties, ReactNode } from "react";

export const INK = "#1A2744";
export const PAPER = "#F5F0E6";
export const BLUE = "#1A52D4";
export const TINT = "#DCE4F5";

/** Mount once. Gives every illustration a slightly shaky, hand-inked line. */
export function InkDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

// ─── Mini Muskaan ────────────────────────────────────────────────────────────
// A small comic version of Muskaan: long dark hair, white tee, dark trousers.
export type Pose = "stand" | "walk" | "wave" | "armsUp" | "dive" | "slump" | "coffee" | "carry" | "sit" | "type" | "camera" | "think";

interface PoseDef { head: [number, number, number]; arms: number[][]; legs: number[][]; rotate?: number; torsoY?: number; extra?: ReactNode }

const Folder = ({ x, y, label, fill = TINT }: { x: number; y: number; label?: string; fill?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 3 L6 3 L8 0 L16 0 L16 3 L22 3 L22 16 L0 16 Z" fill={fill} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
    {label && <text x="11" y="12" fontSize="4.2" fontFamily="Space Mono, monospace" textAnchor="middle" fill={INK}>{label}</text>}
  </g>
);
const Mug = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} stroke={INK} strokeWidth="1.3" fill="#fff">
    <rect x="0" y="0" width="8" height="9" rx="1.5" /><path d="M8 2.5 q3 0 3 2.5 t-3 2.5" fill="none" />
    <path d="M2 -2 q1 -2 0 -4 M5 -2 q1 -2 0 -4" fill="none" strokeWidth="0.9" />
  </g>
);

const POSES: Record<Pose, PoseDef> = {
  stand:  { head: [30, 13, 0], arms: [[24, 26, 22, 36, 21, 45], [36, 26, 38, 36, 39, 45]], legs: [[27, 47, 27, 74], [33, 47, 33, 74]] },
  walk:   { head: [31, 13, 5], arms: [[24, 26, 19, 35, 16, 42], [36, 26, 41, 35, 45, 39]], legs: [[28, 47, 23, 61, 18, 74], [32, 47, 36, 61, 41, 73]] },
  wave:   { head: [30, 13, -6], arms: [[24, 26, 22, 36, 21, 45], [36, 26, 44, 18, 46, 7]], legs: [[27, 47, 27, 74], [33, 47, 33, 74]] },
  armsUp: { head: [30, 13, 0], arms: [[24, 26, 20, 14, 19, 3], [36, 26, 40, 14, 41, 3]], legs: [[27, 47, 27, 74], [33, 47, 33, 74]] },
  dive:   { head: [30, 13, 0], arms: [[24, 26, 20, 14, 19, 3], [36, 26, 40, 14, 41, 3]], legs: [[27, 47, 25, 72], [33, 47, 36, 70]], rotate: -118 },
  slump:  { head: [27, 30, 32], torsoY: 14, arms: [[24, 40, 20, 52, 22, 62], [36, 40, 40, 52, 38, 62]], legs: [[27, 61, 16, 64, 10, 74], [33, 61, 44, 64, 50, 74]] },
  coffee: { head: [30, 13, 8], arms: [[24, 26, 22, 36, 21, 45], [36, 26, 41, 35, 35, 33]], legs: [[27, 47, 27, 74], [33, 47, 33, 74]], extra: <Mug x={30} y={28} /> },
  carry:  { head: [31, 13, 4], arms: [[24, 26, 30, 36, 37, 36], [36, 26, 41, 33, 45, 35]], legs: [[28, 47, 24, 61, 21, 74], [32, 47, 35, 61, 39, 73]], extra: <Folder x={34} y={28} label="SHIPPED" fill="#F4C430" /> },
  sit:    { head: [30, 13, 0], arms: [[24, 26, 20, 36, 18, 44], [36, 26, 40, 36, 42, 44]], legs: [[27, 47, 18, 47, 18, 64], [33, 47, 24, 48, 24, 64]] },
  type:   { head: [28, 14, 10], arms: [[24, 27, 16, 37, 9, 40], [36, 27, 26, 38, 15, 41]], legs: [[27, 47, 14, 48, 14, 64], [33, 47, 20, 49, 20, 64]],
            extra: <g stroke={INK} strokeWidth="1.3" fill="#fff"><path d="M-6 42 L16 42 L13 30 L-4 30 Z" /><line x1="-8" y1="42" x2="18" y2="42" strokeWidth="1.8" /></g> },
  camera: { head: [32, 22, -4], torsoY: 10, arms: [[26, 36, 20, 34, 18, 28], [38, 36, 30, 30, 24, 28]], legs: [[29, 57, 16, 62, 6, 64], [35, 57, 22, 68, 10, 72]],
            extra: <g stroke={INK} strokeWidth="1.3" fill="#fff"><rect x="10" y="22" width="15" height="10" rx="1.5" /><circle cx="15" cy="27" r="3" /><rect x="19" y="20" width="4" height="2" /></g> },
  think:  { head: [30, 13, 10], arms: [[24, 26, 22, 36, 21, 45], [36, 26, 40, 32, 33, 20]], legs: [[27, 47, 27, 74], [33, 47, 33, 74]] },
};

function Head({ x, y, r, blink }: { x: number; y: number; r: number; blink?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M-9.5 1 C-10.5 -12 10.5 -12 9.5 1 L10 15 L6 15 L5.5 4 C3 0 -3 0 -5.5 4 L-6 15 L-10 15 Z" fill={INK} />
      <circle cx="0" cy="1.5" r="7.2" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <path d="M-7.6 0.5 C-8 -8.5 8 -8.5 7.6 0.5 C4.5 -3.5 -1 -4.5 -7.6 0.5 Z" fill={INK} />
      {blink
        ? <><path d="M-4 3 h2.4 M1.6 3 h2.4" stroke={INK} strokeWidth="1" /></>
        : <><circle cx="-2.7" cy="3" r="1" fill={INK} /><circle cx="2.7" cy="3" r="1" fill={INK} /></>}
      <path d="M-1.4 6 q1.4 1 2.8 0" stroke={INK} strokeWidth="0.9" fill="none" />
    </g>
  );
}

/** Mini Muskaan. `size` is the rendered height in px. */
export function Mini({ pose = "stand", size = 80, sleepy, noProp, style, title }: { pose?: Pose; size?: number; sleepy?: boolean; noProp?: boolean; style?: CSSProperties; title?: string }) {
  const p = POSES[pose];
  const ty = p.torsoY ?? 0;
  const limb = (pts: number[], w: number, color = INK) => (
    <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 60 80" style={{ overflow: "visible", ...style }} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g filter="url(#wobble)" transform={p.rotate ? `rotate(${p.rotate} 30 40)` : undefined}>
        {p.legs.map((l, i) => <g key={i}>{limb(l, 5.4)}</g>)}
        <path d={`M23 ${24 + ty} Q30 ${21 + ty} 37 ${24 + ty} L36.5 ${47 + ty} L23.5 ${47 + ty} Z`} fill="#fff" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        {p.arms.map((a, i) => <g key={i}>{limb(a, 1.9)}<circle cx={a[a.length - 2]} cy={a[a.length - 1]} r="1.8" fill="#fff" stroke={INK} strokeWidth="1.1" /></g>)}
        <Head x={p.head[0]} y={p.head[1]} r={p.head[2]} blink={sleepy} />
        {!noProp && p.extra}
      </g>
    </svg>
  );
}

export { Folder, Mug };

// ─── Exploded "deconstruction" diagrams ──────────────────────────────────────
// Each case study is drawn as an exploded stack of 5 plates (one per phase).
// Plates are drawn flat (±100 × ±65) and projected isometrically.
const ISO = "matrix(0.866 0.5 -0.866 0.5 0 0)";
const S = { stroke: INK, strokeWidth: 1.6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const T = (x: number, y: number, t: string, size = 11, anchor: "start" | "middle" | "end" = "middle") =>
  <text x={x} y={y} fontSize={size} fontFamily="Space Mono, monospace" fill={INK} textAnchor={anchor} stroke="none">{t}</text>;

type PlateArt = (accent: string) => ReactNode;

const TRAXEN: PlateArt[] = [
  // 01 Brief — the tablet in the cab
  (a) => <g {...S}><rect x="-96" y="-62" width="192" height="124" rx="12" /><rect x="-84" y="-52" width="168" height="104" rx="4" /><circle cx="90" cy="0" r="2.5" />{T(0, 6, "IN-CAB TABLET", 12)}</g>,
  // 02 Challenge — 4+ app switches an hour
  (a) => <g {...S}>{[-60, -20, 20, 60].map((x, i) => <rect key={i} x={x - 16} y="-24" width="32" height="40" rx="4" />)}<path d="M-60 26 C-40 50 40 50 60 26" stroke={a} strokeDasharray="4 4" />{T(0, -38, "NAV · HOS · FLEET · TRAXEN", 9)}</g>,
  // 03 Process — HOS dials from ride-alongs
  (a) => <g {...S}>{[["8:00", -66], ["11:00", -22], ["14:00", 22], ["70:00", 66]].map(([t, x]) => <g key={t as string}><circle cx={x as number} cy="0" r="18" stroke={a} strokeWidth="2.4" />{T(x as number, 4, t as string, 9)}</g>)}</g>,
  // 04 Solution — the floating overlay
  (a) => <g {...S}><rect x="-58" y="-34" width="116" height="68" rx="10" fill="#fff" />{T(-30, 6, "65", 26)}{T(-30, 20, "MPH", 8)}<rect x="10" y="-20" width="30" height="30" rx="3" />{T(25, -4, "80", 12)}<circle cx="-30" cy="-22" r="4" fill={a} stroke="none" /><path d="M46 -26 l6 0 M46 -22 l6 0" /></g>,
  // 05 Impact — rating climb
  (a) => <g {...S}>{[-60, -30, 0, 30].map(x => <path key={x} d={`M${x} -18 l5 10 11 1 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -1 z`} fill={a} stroke={a} />)}<path d="M60 -18 l5 10 11 1 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -1 z" />{T(0, 34, "1.2★ → 4.4★", 12)}</g>,
];

const BUYMYSPOT: PlateArt[] = [
  (a) => <g {...S}><rect x="-44" y="-62" width="88" height="124" rx="12" /><path d="M-12 -56 h24" /><circle cx="0" cy="54" r="3" />{T(0, 4, "BUYER APP", 10)}</g>,
  (a) => <g {...S}>{[-36, -18, 0, 18, 36].map(y => <g key={y}><path d={`M-88 ${y} h40`} />{[-30, -6, 18, 42, 66].map(x => <circle key={x} cx={x} cy={y} r="5" />)}</g>)}{T(18, -48, "20 ATTRIBUTES × 30 PEOPLE", 9)}</g>,
  (a) => <g {...S}>{[-50, 50].map((x, i) => <g key={x}><rect x={x - 40} y="-48" width="80" height="96" rx="4" fill="#fff" /><circle cx={x} cy="-20" r="12" /><path d={`M${x - 20} 16 q20 -24 40 0`} />{T(x, 36, i ? "CONVENIENCE" : "BUDGET", 8)}</g>)}</g>,
  (a) => <g {...S}><rect x="-92" y="-56" width="92" height="112" /><path d="M-92 -10 C-60 -30 -30 10 0 -14 M-70 -56 L-50 56" stroke={a} />{[[-62, -20], [-34, 18], [-20, -34]].map(([x, y]) => <path key={x} d={`M${x} ${y} c-6 -8 -6 -14 0 -14 6 0 6 6 0 14z`} fill={a} />)}{[-40, -6, 28].map(y => <rect key={y} x="10" y={y} width="80" height="26" rx="3" />)}</g>,
  (a) => <g {...S}><rect x="-70" y="-50" width="140" height="100" rx="4" />{[-30, -10, 10, 30].map(y => <path key={y} d={`M-70 ${y} h140`} />)}{[-35, 0, 35].map(x => <path key={x} d={`M${x} -50 v100`} />)}<path d="M8 -4 l8 8 16 -18" stroke={a} strokeWidth="3" />{T(0, 66, "BOOKED", 10)}</g>,
];

const GUARDIAN: PlateArt[] = [
  (a) => <g {...S}><rect x="-56" y="-46" width="112" height="84" rx="22" fill="#fff" /><circle cx="-20" cy="-6" r="8" fill={a} stroke="none" /><circle cx="20" cy="-6" r="8" fill={a} stroke="none" /><path d="M-14 16 q14 12 28 0" /><path d="M0 -46 v-12" /><circle cx="0" cy="-60" r="3" />{T(0, 58, "AVA", 11)}</g>,
  (a) => <g {...S}><rect x="-90" y="-56" width="180" height="112" /><path d="M-10 -56 v50 h100 M-90 10 h60 v46" /><path d="M30 20 l10 -10 6 12 10 -14" stroke={a} strokeWidth="2.4" /><rect x="-70" y="-36" width="12" height="20" rx="5" stroke={a} />{T(36, 46, "FALLS · MEDS", 9)}</g>,
  (a) => <g {...S}>{[-48, 48].map(x => <g key={x}><rect x={x - 40} y="-52" width="80" height="104" rx="3" fill="#fff" />{[-30, -16, -2, 12, 26].map(y => <path key={y} d={`M${x - 28} ${y} h56`} />)}</g>)}{T(0, 70, "DIARY · 111 SURVEYS", 9)}</g>,
  (a) => <g {...S}><rect x="-88" y="-20" width="56" height="20" rx="10" /><circle cx="-60" cy="-10" r="12" fill="#fff" />{[10, 18, 26].map(r => <path key={r} d={`M${-4 - r * 0.3} ${-r} a${r} ${r} 0 0 1 ${r * 0.6} 0`} stroke={a} />)}<circle cx="-2" cy="2" r="5" fill={a} stroke="none" /><rect x="40" y="-44" width="44" height="80" rx="8" />{T(-60, 30, "BAND", 8)}{T(-2, 30, "BEACON", 8)}{T(62, 50, "APP", 8)}</g>,
  (a) => <g {...S}>{[-44, 44].map(x => <g key={x}><circle cx={x} cy="-12" r="24" fill="#fff" /><circle cx={x} cy="-12" r="14" stroke={a} /><path d={`M${x - 14} 8 l-8 40 14 -10 8 14 8 -44`} /></g>)}{T(0, 62, "2 AWARDS", 11)}</g>,
];

export const PLATES: Record<string, PlateArt[]> = { traxen: TRAXEN, buymyspot: BUYMYSPOT, guardiancare: GUARDIAN };

/**
 * Exploded view. `active` lifts and tints one plate; `onPick` makes plates + callouts clickable.
 * Callouts alternate sides with leader lines, like an engineering drawing.
 */
export function Exploded({ slug, accent, active = -1, onPick, labels, compact }: {
  slug: string; accent: string; active?: number; onPick?: (i: number) => void; labels?: string[]; compact?: boolean;
}) {
  const plates = PLATES[slug] ?? TRAXEN;
  const cx = 300, gap = compact ? 92 : 104, top = 96;
  const ys = plates.map((_, i) => top + i * gap);
  const order = plates.map((_, i) => i).reverse(); // draw bottom plate first so upper plates sit in front
  return (
    <svg viewBox={`0 0 600 ${top + gap * 4 + 110}`} style={{ width: "100%", height: "100%", display: "block" }} role="img" aria-label="Exploded diagram of the case study, one layer per phase">
      <g filter="url(#wobble)">
        <line x1={cx} y1={top - 70} x2={cx} y2={ys[4] + 90} stroke={INK} strokeWidth="1" strokeDasharray="2 5" opacity="0.6" />
        {order.map(i => {
          const on = i === active;
          const lift = on ? -16 : 0;
          const right = i % 2 === 0;
          const ax = cx + (right ? 143 : -143), ay = ys[i] + (right ? 17 : -17) + lift;
          const lx = right ? 560 : 40;
          return (
            <g key={i} style={{ cursor: onPick ? "pointer" : undefined }} onClick={onPick ? () => onPick(i) : undefined}>
              <g style={{ transition: "transform .45s cubic-bezier(.22,1,.36,1)", transform: `translateY(${lift}px)` }}>
                <g transform={`translate(${cx} ${ys[i]}) ${ISO}`}>
                  <rect x="-100" y="-65" width="200" height="130" fill={on ? TINT : PAPER} stroke={on ? accent : INK} strokeWidth={on ? 2.6 : 1.6} />
                  {plates[i](accent)}
                </g>
              </g>
              <polyline points={`${ax},${ay} ${right ? ax + 30 : ax - 30},${ay} ${lx},${ays(ys[i], right)}`} fill="none" stroke={on ? accent : INK} strokeWidth={on ? 2 : 1} />
              <circle cx={lx} cy={ays(ys[i], right)} r="15" fill={on ? accent : PAPER} stroke={on ? accent : INK} strokeWidth="1.6" />
              <text x={lx} y={ays(ys[i], right) + 4.5} fontSize="12" fontFamily="Space Mono, monospace" fontWeight="700" textAnchor="middle" fill={on ? "#fff" : INK}>{String(i + 1).padStart(2, "0")}</text>
              {labels && <text x={lx} y={ays(ys[i], right) + 32} fontSize="12" fontFamily="Space Mono, monospace" textAnchor="middle" fill={on ? accent : INK}>{labels[i].toUpperCase()}</text>}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
const ays = (y: number, right: boolean) => y + (right ? -26 : 26);
