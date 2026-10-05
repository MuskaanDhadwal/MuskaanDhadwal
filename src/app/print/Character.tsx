// Muskaan, drawn in code: single-colour crayon line, hatched hair + bun, round glasses,
// calm closed eyes, plain sweater. Colour = currentColor (white on blue, --blueprint-dk on paper).
// BOIL = cycling between three crayon filters with different noise seeds at 8fps.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "./ui";

/** Mount once: three crayon textures (same look, different grain) for line boil. */
export function CrayonDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        {[11, 23, 37].map((seed, i) => (
          <filter key={i} id={`crayon-${i}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={seed} result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.55 1.3" result="mask" />
            <feComposite in="SourceGraphic" in2="mask" operator="in" result="grainy" />
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed + 5} result="warp" />
            <feDisplacementMap in="grainy" in2="warp" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        ))}
        <filter id="duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 1 0" />
          <feComponentTransfer><feFuncR type="table" tableValues=".043 .969" /><feFuncG type="table" tableValues=".106 .965" /><feFuncB type="table" tableValues=".302 .949" /></feComponentTransfer>
        </filter>
        <clipPath id="bun-clip"><circle cx="134" cy="22" r="12" /></clipPath>
      </defs>
    </svg>
  );
}

// ── Hair: dense directional hatching, generated once ───────────────────────
function rand(seed: number) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const HAIR = (() => {
  const r = rand(11);
  const strokes: string[] = [];
  // blunt bangs: dense near-vertical strokes ending on one straight cut line
  for (let i = 0; i < 72; i++) {
    const t = i / 71, x = 63 + t * 74;
    const sx = 84 + t * 34 + (r() - .5) * 6, sy = 30 + Math.abs(t - .45) * 14 + r() * 3;
    strokes.push(`M${sx.toFixed(1)} ${sy.toFixed(1)} Q${(x + (sx - x) * .35).toFixed(1)} ${(42 + r() * 4).toFixed(1)} ${(x + (r() - .5)).toFixed(1)} ${(57 + r() * 1.2).toFixed(1)}`);
  }
  // crown: strokes sweeping back and up toward the bun
  for (let i = 0; i < 34; i++) {
    const t = i / 33, sx = 74 + t * 54, sy = 34 - Math.sin(t * Math.PI) * 8 + r() * 3;
    strokes.push(`M${sx.toFixed(1)} ${sy.toFixed(1)} Q${(sx + 18 + r() * 6).toFixed(1)} ${(sy - 10 - r() * 4).toFixed(1)} ${(122 + r() * 8).toFixed(1)} ${(28 + r() * 4).toFixed(1)}`);
  }
  // right side behind the ear
  for (let i = 0; i < 12; i++) strokes.push(`M${(132 + i * .6).toFixed(1)} ${(36 + i * 2.2).toFixed(1)} Q${(142 + r() * 2).toFixed(1)} ${(52 + i * 1.6).toFixed(1)} ${(138 + r() * 2).toFixed(1)} ${(64 + i * 1.2).toFixed(1)}`);
  // outline of the hair dome + the blunt cut
  strokes.push("M62 66 C56 22 142 14 141 64", "M63 57.5 H137");
  // thin side strands down the cheeks
  strokes.push("M64 58 Q62 80 63 100", "M67.5 58 Q66 78 67 96", "M135 58 Q137 76 136 90");
  return strokes;
})();
// bun: a spiral-hatched ball at the top-back of the head
const BUN = Array.from({ length: 9 }, (_, i) => { const rr = 15 - i * 1.6; return `M${(126 - rr).toFixed(1)} 20 A${rr.toFixed(1)} ${(rr * .92).toFixed(1)} 0 1 1 ${(126 + rr * .7).toFixed(1)} ${(20 + rr * .7).toFixed(1)}`; });

export type Pose =
  | "hunched" | "upright" | "sip" | "wave" | "asleep" | "whiteboard" | "ladder" | "deskSit" | "walk"
  | "tired1" | "tired2" | "tired3" | "tired4" | "tired5"
  | "wrench" | "tape" | "sign" | "clipboard" | "thumbs"
  | "sketch" | "laptopSit" | "peek" | "holdUp" | "nap";

type Eyes = "closed" | "open" | "sleep" | "wide" | "smug";
interface PoseDef {
  head?: { dx?: number; dy?: number; rot?: number }; eyes?: Eyes; mouth?: "flat" | "smile" | "o";
  lean?: number; armL: string; armR: string; legs: "stand" | "sit" | "walk" | "hidden";
  prop?: ReactNode; extra?: ReactNode; rotateAll?: number; shift?: [number, number];
}

const L = { down: "M74 124 Q64 150 70 174", fwd: "M74 124 Q58 150 36 156", up: "M74 124 Q58 92 68 56", chest: "M74 124 Q82 152 98 142", out: "M74 124 Q50 142 28 150", fold: "M74 124 Q52 150 30 140" };
const R = { down: "M126 124 Q136 150 130 174", wave: "M126 124 Q152 104 150 72", sip: "M126 124 Q148 140 122 110", up: "M126 124 Q148 92 158 58", pin: "M126 124 Q142 92 132 56", thumbs: "M126 124 Q152 126 150 100", pen: "M126 124 Q118 152 106 140", fwd: "M126 124 Q112 154 70 160", wrench: "M126 124 Q150 144 172 140", out: "M126 124 Q150 142 172 150", back: "M126 124 Q148 152 172 172" };

const Mug = ({ x, y, slogan = "UX IS MY PASSION" }: { x: number; y: number; slogan?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 h22 l-2 28 h-18 z" className="fill" />
    <path d="M22 6 q9 0 9 8 t-10 8" fill="none" />
    <text x="11" y="12" fontSize="4.6" textAnchor="middle" className="ink-text">{slogan.split(" ").slice(0, 2).join(" ")}</text>
    <text x="11" y="18" fontSize="4.6" textAnchor="middle" className="ink-text">{slogan.split(" ").slice(2).join(" ")}</text>
  </g>
);
const Folder = ({ x, y, label, rot = 0 }: { x: number; y: number; label: string; rot?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M0 6 h18 l4 -6 h22 v6 h22 v44 h-66 z" className="fill" />
    <text x="33" y="32" fontSize="7" textAnchor="middle" className="ink-text mono">{label}</text>
  </g>
);
const Zz = ({ x, y }: { x: number; y: number }) => <text x={x} y={y} fontSize="16" className="ink-text hand-t">z z</text>;
const Action = ({ x, y }: { x: number; y: number }) => <g className="action-lines" transform={`translate(${x} ${y})`}><path d="M0 0 l-8 -6 M2 -6 l-4 -10 M8 -4 l2 -10" /></g>;

const POSES: Record<Pose, PoseDef> = {
  hunched: { head: { dx: -14, dy: 18, rot: -16 }, lean: -14, armL: L.fwd, armR: R.fwd, legs: "hidden" },
  upright: { eyes: "open", mouth: "smile", armL: L.fwd, armR: R.fwd, legs: "hidden" },
  sip: { head: { rot: -6 }, armL: L.fwd, armR: R.sip, legs: "hidden", prop: <Mug x={104} y={86} /> },
  wave: { eyes: "open", mouth: "smile", armL: L.down, armR: R.wave, legs: "hidden" },
  asleep: { head: { dx: -30, dy: 48, rot: -70 }, eyes: "sleep", lean: -30, armL: L.fold, armR: R.fwd, legs: "hidden", extra: <Zz x={30} y={60} /> },
  whiteboard: { head: { rot: -8, dx: 4 }, armL: L.down, armR: R.up, legs: "stand" },
  ladder: { head: { rot: -4, dy: -2 }, eyes: "open", armL: L.up, armR: R.pin, legs: "stand" },
  deskSit: { armL: L.chest, armR: R.sip, legs: "sit", prop: <Mug x={104} y={86} /> },
  walk: { head: { rot: 4 }, armL: "M74 124 Q66 150 58 168", armR: "M126 124 Q138 148 148 164", legs: "walk" },
  tired1: { head: { dx: 6, dy: 8, rot: 10 }, eyes: "sleep", lean: 12, armL: L.down, armR: R.back, legs: "walk", prop: <Folder x={150} y={164} label="CASE STUDIES" rot={8} /> },
  tired2: { eyes: "sleep", armL: L.up, armR: R.pin, legs: "stand", rotateAll: -84, shift: [96, 40] },
  tired3: { head: { dx: -10, dy: 36, rot: -60 }, eyes: "sleep", lean: -26, armL: L.fold, armR: R.fwd, legs: "sit", extra: <Zz x={40} y={50} /> },
  tired4: { eyes: "wide", mouth: "o", armL: L.down, armR: R.sip, legs: "stand", prop: <Mug x={104} y={84} slogan="SHIP IT" />, extra: <Action x={60} y={36} /> },
  tired5: { eyes: "smug", mouth: "smile", armL: L.fwd, armR: R.thumbs, legs: "stand", prop: <Folder x={-26} y={128} label="CASE STUDIES" /> },
  wrench: { head: { rot: 8 }, armL: L.chest, armR: R.wrench, legs: "stand", prop: <path d="M170 132 l14 10 m-2 -14 l8 4 l-4 8" fill="none" /> },
  tape: { eyes: "open", armL: L.out, armR: R.out, legs: "stand", prop: <><rect x="14" y="140" width="16" height="16" rx="3" className="fill" /><path d="M30 150 H172" strokeDasharray="2 4" /></> },
  sign: { mouth: "smile", armL: L.up, armR: R.pin, legs: "stand" },
  clipboard: { head: { rot: 10, dy: 4 }, armL: L.chest, armR: R.pen, legs: "stand", prop: <rect x="84" y="128" width="26" height="34" className="fill" /> },
  sketch: { head: { rot: 10, dy: 6 }, armL: "M74 124 Q76 150 86 156", armR: "M126 124 Q126 152 112 150", legs: "sit",
    prop: <g><path d="M74 150 l40 -6 l4 26 l-40 6 z" className="fill" /><path d="M94 147 l3 26" /><path d="M110 150 l14 -22" strokeWidth="2.6" /></g> },
  laptopSit: { head: { rot: -4, dy: 2 }, mouth: "flat", armL: "M74 124 Q72 152 90 154", armR: "M126 124 Q128 152 110 154", legs: "sit",
    prop: <g><path d="M70 160 h60 l-6 -36 h-48 z" className="fill" /><text x="100" y="150" fontSize="14" fontWeight="700" textAnchor="middle" className="ink-text" style={{ fontFamily: "var(--body)" }}>M</text></g> },
  peek: { head: { rot: 6 }, armL: "M74 124 Q64 104 78 96", armR: "M126 124 Q150 112 152 92", legs: "hidden",
    prop: <g><circle cx="156" cy="80" r="14" className="fill" /><circle cx="156" cy="80" r="9" fill="none" opacity=".5" /><path d="M150 94 l-6 14" strokeWidth="3" /></g> },
  holdUp: { eyes: "open", mouth: "o", armL: "M74 124 Q56 70 70 6", armR: "M126 124 Q144 70 130 6", legs: "stand",
    extra: <g><rect x="66" y="234" width="68" height="11" className="fill" /><rect x="60" y="245" width="80" height="11" className="fill" />
      <text x="100" y="243" fontSize="8" textAnchor="middle" className="ink-text mono">MSI · HCI</text><text x="100" y="254" fontSize="8" textAnchor="middle" className="ink-text mono">B.TECH · CS</text></g> },
  nap: { head: { dx: -4, dy: 14, rot: -22 }, eyes: "sleep", armL: "M74 124 Q70 152 92 158", armR: "M126 124 Q130 150 112 156", legs: "sit",
    prop: <g><path d="M96 140 h22 l-2 22 h-18 z" className="fill" /><path d="M118 146 q8 0 8 6 t-8 6" fill="none" /></g>, extra: <Zz x={142} y={30} /> },
  thumbs: { eyes: "smug", mouth: "smile", armL: L.down, armR: R.thumbs, legs: "stand", prop: <path d="M148 98 v-8 q0 -4 4 -4 v8" fill="none" /> },
};

function Head({ eyes = "open", mouth = "flat" }: { eyes?: Eyes; mouth?: "flat" | "smile" | "o" }) {
  const eye = (cx: number) => {
    if (eyes === "open") return <circle cx={cx} cy={80} r="3.4" className="solid" />;
    if (eyes === "wide") return <><circle cx={cx} cy={80} r="5" fill="none" /><circle cx={cx} cy={80} r="2" className="solid" /></>;
    if (eyes === "sleep") return <path d={`M${cx - 5} 79 q5 4 10 0`} fill="none" />;
    if (eyes === "smug") return <path d={`M${cx - 5} 81 q5 -4 10 0`} fill="none" />;
    return <path d={`M${cx - 5} 80 h10`} />;
  };
  return (
    <g>
      <path d="M62 64 Q58 112 100 115 Q140 112 138 64" className="fill" />{/* face */}
      <path d="M136 70 q10 -1 9 11 q-1 9 -9 7" className="fill" /><path d="M139 76 q3 2 1 6" fill="none" strokeWidth="1.2" /><circle cx="139" cy="90" r="1.7" className="solid" />{/* ear + stud */}
      <circle cx="126" cy="20" r="15" className="fill" />
      <g strokeWidth="1.15">{BUN.map((d, i) => <path key={i} d={d} fill="none" />)}{HAIR.map((d, i) => <path key={`h${i}`} d={d} fill="none" />)}</g>
      {/* eyebrows */}
      <path d="M79 64 q6 -3.5 12 0 M110 64 q6 -3.5 12 0" fill="none" strokeWidth="1.6" />
      {/* big round wire glasses */}
      <circle cx="85" cy="80" r="15.5" fill="none" strokeWidth="1.8" /><circle cx="117" cy="80" r="15.5" fill="none" strokeWidth="1.8" />
      <path d="M100.5 79 q.5 -3 1.5 0 M132.5 78 L138 75" fill="none" strokeWidth="1.8" />
      {eye(87)}{eye(117)}
      <path d="M103 89 q-4 4 -1 7" fill="none" strokeWidth="1.4" />
      {mouth === "flat" && <path d="M97 104 q4 -1.5 8 0" fill="none" strokeWidth="1.6" />}
      {mouth === "smile" && <path d="M95 102 q6 5 12 0" fill="none" />}
      {mouth === "o" && <circle cx="101" cy="104" r="3" fill="none" />}
    </g>
  );
}

const Tube = ({ d, w }: { d: string; w: number }) => (
  <g>
    <path d={d} fill="none" strokeWidth={w} strokeLinecap="round" />
    <path d={d} fill="none" strokeWidth={w - 3.4} strokeLinecap="round" className="tube-in" />
  </g>
);

const LEGS = {
  stand: ["M90 176 Q88 204 88 230", "M110 176 Q112 204 112 230"],
  walk: ["M92 176 Q84 204 74 228", "M108 176 Q116 204 126 226"],
  sit: ["M90 176 Q70 178 56 182 Q50 206 52 228", "M110 176 Q88 184 72 190 Q66 210 70 230"],
  hidden: [] as string[],
};

/** The figure itself (viewBox 0 0 200 240). Use inside <Character> or embed in a scene <svg>. */
export function Figure({ pose, boil = 0 }: { pose: Pose; boil?: number }) {
  const p = POSES[pose];
  const h = p.head ?? {};
  const outer = [p.shift ? `translate(${p.shift[0]} ${p.shift[1]})` : "", p.rotateAll ? `rotate(${p.rotateAll} 100 200)` : ""].join(" ");
  return (
    <g className="crayon" filter={`url(#crayon-${boil % 3})`} transform={outer || undefined}>
      {LEGS[p.legs].map((d, i) => <g key={i}><Tube d={d} w={22} /><path d={`M${d.split(" ").slice(-2).join(" ")} m-9 2 h18`} /></g>)}
      <g transform={p.lean ? `rotate(${p.lean} 100 178)` : undefined}>
        <path d="M66 130 Q66 112 92 110 Q100 116 108 110 Q134 112 134 130 L136 178 Q100 186 64 178 Z" className="fill" />
        <path d="M90 111 Q100 119 110 111" fill="none" />
        <path d="M72 168 Q100 174 128 168" fill="none" strokeWidth="1" opacity=".7" />
        <Tube d={p.armL} w={17} /><Tube d={p.armR} w={17} />
        <g transform={`translate(${h.dx ?? 0} ${h.dy ?? 0}) rotate(${h.rot ?? 0} 100 104)`}><Head eyes={p.eyes} mouth={p.mouth} /></g>
        {p.prop}
      </g>
      {p.extra}
    </g>
  );
}

/** A standalone, boiling character. `tone` picks the line colour; fill matches the sheet behind. */
export function Character({ pose, alt, height = 220, tone = "blue", className = "", style }: {
  pose: Pose; alt: string; height?: number; tone?: "blue" | "paper" | "night"; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const on = useInView(ref);
  const reduced = useReducedMotion();
  const [b, setB] = useState(0);
  useEffect(() => {
    if (!on || reduced) return;
    const id = setInterval(() => setB(x => x + 1), 125);
    return () => clearInterval(id);
  }, [on, reduced]);
  return (
    <svg ref={ref} viewBox="-20 -10 240 260" height={height} className={`char-svg tone-${tone} ${className}`} style={style} role="img" aria-label={alt}>
      <Figure pose={pose} boil={b} />
    </svg>
  );
}
