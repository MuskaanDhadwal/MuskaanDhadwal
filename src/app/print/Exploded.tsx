// Exploded engineering drawing — the case study's table of contents. Every part (and the whole-object
// bracket) is clickable and scrolls to its section, like the numbered markers and the cards.
// Machines are precise isometric boxes (flat fills: blueprint / blueprint-dk / shadow).
// People + Muskaan's cameo are crayon line (the BLEND RULE). Real layer SVGs can replace the boxes:
// drop /exploded/<slug>-layer-0N.svg and it is used instead of the placeholder box.
import { useEffect, useState, type ReactNode } from "react";
import { Mini, type PoseName } from "./Minis";
import type { Brief } from "./story";
import { useReducedMotion } from "./ui";

const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
const iso = (x: number, y: number, z: number): [number, number] => [(x - y) * C30, (x + y) * S30 - z];
const pts = (a: [number, number][]) => a.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");

// Per-layer box sizes: people platform · mount/shell · screen · internals · outcome base
const DIMS = [[120, 80, 6], [80, 70, 34], [170, 112, 10], [140, 100, 40], [230, 90, 5]];
// BuyMySpot is its own object: sidewalk · a parking stall · a phone (portrait) · the design-system/flow plate · the street grid
// Luxury vehicle: the driver's seat · the dashboard (wheel + screens) · the central console (2:1) · the design-system plate · the road
const DIMS_BY: Record<string, number[][]> = { buymyspot: [[120, 80, 6], [128, 74, 8], [70, 122, 8], [126, 92, 26], [230, 96, 5]], gm: [[120, 80, 6], [150, 62, 20], [172, 86, 8], [126, 92, 18], [230, 90, 5]] };
const dimsFor = (slug: string) => DIMS_BY[slug] ?? DIMS;

export const VIEW = { w: 560, top: -90, h: 750 };
const WHOLE_X = 16; // x of the whole-object bracket
/** Card k (0 = overview … 5 = impact) centre, in drawing units and as % of height. */
export const cardY = (k: number) => VIEW.top + ((k + 0.5) * VIEW.h) / 6;
export const cardPct = (k: number) => ((k + 0.5) / 6) * 100;

export function layerOrigin(i: number, axis: Brief["axis"], spread: number): [number, number] {
  if (axis === "horizontal") return [150 + i * 66 * spread, 90 + i * 112 * spread];
  return [250, 70 + i * 116 * spread];
}

/** Box anchored so its top-face centre sits at (ox, oy). */
function Box({ i, ox, oy, shot, highlight, slug = "" }: { i: number; ox: number; oy: number; shot?: string; highlight?: boolean; slug?: string }) {
  const [w, d, h] = dimsFor(slug)[i];
  const bms = slug === "buymyspot", gm = slug === "gm", gc = slug === "guardiancare";
  const P = (x: number, y: number, z: number): [number, number] => { const [sx, sy] = iso(x - w / 2, y - d / 2, z - h); return [ox + sx, oy + sy]; };
  const top = [P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)];
  const left = [P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)];
  const right = [P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)];
  const [ex, ey] = P(0, 0, h);
  const face = (children: ReactNode) => <g transform={`matrix(${C30} ${S30} ${-C30} ${S30} ${ex} ${ey})`}>{children}</g>;
  return (
    <g className="bp" style={{ strokeWidth: highlight ? 2.4 : 1.4 }}>
      <polygon points={pts(left)} fill="var(--blueprint-dk)" />
      <polygon points={pts(right)} fill="var(--shadow)" />
      <polygon points={pts(top)} fill="var(--blueprint)" />
      {/* screen layer: the REAL screenshot mapped onto the top face (mixed media inside the drawing) */}
      {shot && (
        <g transform={`matrix(${C30} ${S30} ${-C30} ${S30} ${ex} ${ey})`}>
          <image href={shot} x="6" y="6" width={w - 12} height={d - 12} preserveAspectRatio="xMidYMid slice" />
          <rect x="6" y="6" width={w - 12} height={d - 12} />
        </g>
      )}
      {/* BuyMySpot: stall lines + a parked car + a P sign · the flow/design-system plate · the street grid with price pins */}
      {bms && i === 1 && face(<g><path d={`M8 6 V${d - 6} M${w / 2} 6 V${d - 6} M${w - 8} 6 V${d - 6}`} /><rect x="16" y="14" width={w / 2 - 24} height={d - 28} rx="7" fill="var(--blueprint-dk)" /><path d={`M22 26 h${w / 2 - 36} M22 ${d - 26} h${w / 2 - 36}`} /><rect x={w / 2 + 14} y={d / 2 - 12} width="24" height="24" rx="3" /><text x={w / 2 + 26} y={d / 2 + 6} fontSize="16" textAnchor="middle" className="bp-text">P</text></g>)}
      {bms && i === 3 && face(<g><rect x="10" y="10" width="26" height="16" /><rect x="50" y="10" width="26" height="16" /><rect x="90" y="10" width="26" height="16" /><path d="M36 18 H50 M76 18 H90" /><rect x="50" y="44" width="26" height="16" /><path d="M63 26 V44" />{[0, 1, 2, 3, 4].map(k => <rect key={k} x={10 + k * 12} y={d - 24} width="10" height="10" fill={k === 2 ? "var(--accent)" : k % 2 ? "var(--white)" : "var(--blueprint-dk)"} />)}<path d={`M76 ${d - 19} H${w - 10} M76 ${d - 13} H${w - 30}`} /></g>)}
      {bms && i === 4 && face(<g><path d={`M10 ${d / 3} H${w - 10} M10 ${(2 * d) / 3} H${w - 10} M${w / 4} 8 V${d - 8} M${w / 2} 8 V${d - 8} M${(3 * w) / 4} 8 V${d - 8}`} strokeDasharray="10 8" />{[[w / 4 - 22, d / 3 - 6], [w / 2 + 20, (2 * d) / 3 - 6], [(3 * w) / 4 + 24, d / 3 + 10]].map(([px, py], k) => <g key={k}><rect x={px - 13} y={py - 7} width="26" height="14" rx="7" fill="#fff" /><text x={px} y={py + 4} fontSize="9" textAnchor="middle" fill="var(--blueprint-dk)">${[78, 100, 190][k]}</text></g>)}</g>)}
      {/* GM: dashboard with a wheel + cluster + console outlines · the system plate (five swatches + "Aa") · the road with a car */}
      {gm && i === 1 && face(<g><circle cx={w * 0.26} cy={d / 2} r={d * 0.34} /><circle cx={w * 0.26} cy={d / 2} r={d * 0.1} /><path d={`M${w * 0.26 - d * 0.34} ${d / 2} H${w * 0.26 - d * 0.1} M${w * 0.26 + d * 0.1} ${d / 2} H${w * 0.26 + d * 0.34}`} /><rect x={w * 0.5} y="10" width={w * 0.42} height={d - 20} /><rect x={w * 0.56} y="16" width={w * 0.14} height={d - 32} fill="var(--blueprint-dk)" /></g>)}
      {gm && i === 3 && face(<g>{["#111111", "#1463FD", "#59C1FA", "#FF4242", "#9AE77E"].map((c, k) => <rect key={c} x={10 + k * 22} y="12" width="18" height="18" fill={c} />)}<text x="14" y={d - 18} fontSize="26" className="bp-text">Aa</text><path d={`M60 ${d - 34} H${w - 12} M60 ${d - 24} H${w - 30} M60 ${d - 14} H${w - 50}`} /></g>)}
      {gm && i === 4 && face(<g><path d={`M10 ${d / 2} H${w - 10}`} strokeDasharray="12 10" /><path d={`M10 12 H${w - 10} M10 ${d - 12} H${w - 10}`} /><rect x={w * 0.6} y={d / 2 + 6} width="44" height="22" rx="8" fill="var(--blueprint-dk)" /><path d={`M${w * 0.6 + 12} ${d / 2 + 6} v22 M${w * 0.6 + 32} ${d / 2 + 6} v22`} /></g>)}
      {/* GuardianCare: the body with its drawer + light ring · wristband + beacons · the home floor plan */}
      {gc && i === 1 && face(<g><rect x="10" y="10" width={w * 0.5} height={d - 20} /><path d={`M18 ${d / 2} h${w * 0.5 - 16}`} /><circle cx={w * 0.78} cy={d / 2} r={d * 0.24} /><circle cx={w * 0.78} cy={d / 2} r={d * 0.12} /></g>)}
      {gc && i === 3 && face(<g><rect x="14" y="14" width="34" height="40" rx="9" /><path d="M24 54 v14 M38 54 v14 M24 14 v-8 M38 14 v-8" />{[0, 1, 2].map(k => <g key={k}><circle cx={74 + k * 22} cy={d - 26} r="4" fill="var(--white)" /><circle cx={74 + k * 22} cy={d - 26} r="10" strokeDasharray="2 3" /></g>)}</g>)}
      {gc && i === 4 && face(<g><path d={`M10 10 H${w - 10} V${d - 10} H10 Z M${w * 0.45} 10 V${d * 0.6} M10 ${d * 0.6} H${w * 0.7} M${w * 0.7} ${d * 0.6} V${d - 10}`} />{[[w * 0.25, d * 0.3], [w * 0.7, d * 0.3], [w * 0.25, d * 0.8], [w * 0.85, d * 0.8]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="4" fill="var(--white)" />)}</g>)}
      {/* internals: a few precise chip lines */}
      {!bms && !gm && !gc && i === 3 && <g transform={`matrix(${C30} ${S30} ${-C30} ${S30} ${ex} ${ey})`}><rect x="16" y="16" width="40" height="30" /><rect x="70" y="20" width="50" height="22" /><path d="M56 31 H70 M36 46 V80 H100 M120 31 H130" /><circle cx="100" cy="80" r="4" /></g>}
      {/* outcome base: lane markings */}
      {!bms && !gm && !gc && i === 4 && <g transform={`matrix(${C30} ${S30} ${-C30} ${S30} ${ex} ${ey})`}><path d={`M10 ${d / 2} H${w - 10}`} strokeDasharray="12 10" /></g>}
    </g>
  );
}

/** Generic crayon person for the research layer (not Muskaan). */
function Person({ x, y, cap, s = 1 }: { x: number; y: number; cap?: boolean; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-46" r="9" className="fill" />
      {cap && <path d="M-10 -50 q10 -12 20 0 h6" />}
      <path d="M-12 -4 Q-12 -32 0 -34 Q12 -32 12 -4 Z" className="fill" />
      <path d="M-4 -45 h1 M4 -45 h1 M-3 -40 q3 2 6 0" />
    </g>
  );
}

export function Exploded({ slug, brief, active, setActive, onPick, cameo, focusLayer, assembled }: {
  slug: string; brief: Brief; active?: number; setActive?: (i: number) => void; onPick?: (i: number) => void;
  cameo?: PoseName; focusLayer?: number; assembled?: boolean;
}) {
  const reduced = useReducedMotion();
  const [exploded, setExploded] = useState(reduced || !!focusLayer || focusLayer === 0);
  const [scrub, setScrub] = useState(0);
  const [boil, setBoil] = useState(0);
  useEffect(() => { if (!exploded) { const id = setTimeout(() => setExploded(true), 120); return () => clearTimeout(id); } }, [exploded]);
  useEffect(() => {
    if (reduced || focusLayer !== undefined || assembled) return;
    const on = () => setScrub(Math.min(1, scrollY / (innerHeight * 0.8)));
    addEventListener("scroll", on, { passive: true });
    const id = setInterval(() => setBoil(b => b + 1), 125);
    return () => { removeEventListener("scroll", on); clearInterval(id); };
  }, [reduced, focusLayer, assembled]);

  const spread = assembled ? 0.38 : exploded ? 1 + scrub * 0.12 : 0.38;
  const layers = brief.layers.map((_, i) => { const o = layerOrigin(i, brief.axis, 1), c = layerOrigin(i, brief.axis, spread); return { i, o, cur: c, t: [c[0] - o[0], c[1] - o[1]] as [number, number] }; });
  const shot = brief.overviewShot;
  const show = (i: number) => focusLayer === undefined || focusLayer === i;
  const markerFor = (i: number): [number, number] => { const [x, y] = layers[i].cur; const [w, d] = dimsFor(slug)[i]; return [x + ((w + d) / 2) * C30 + 22, y + (w - d) / 4]; };

  // view box: zoom to one layer for section crops
  let vb = `0 ${VIEW.top} ${VIEW.w} ${VIEW.h}`;
  if (focusLayer !== undefined) { const [x, y] = layers[focusLayer].o; vb = `${x - 170} ${y - 140} 340 260`; }

  return (
    <svg viewBox={vb} className="scene" style={{ width: "100%", height: "100%", overflow: "visible" }} role="img"
      aria-label={`Exploded drawing of ${brief.object}: ${brief.layers.map(l => `${l.no} ${l.part}`).join(", ")}`}>
      {/* dashed guide axis */}
      {focusLayer === undefined && (
        brief.axis === "vertical"
          ? <path d={`M250 ${layers[0].o[1] - 30} V${layers[4].o[1] + 40}`} className="bp" strokeDasharray="4 6" opacity=".6" />
          : <path d={`M${layers[0].cur[0] - 40} ${layers[0].cur[1] - 60} L${layers[4].cur[0] + 40} ${layers[4].cur[1] + 60}`} className="bp" strokeDasharray="4 6" opacity=".6" />
      )}

      {/* 01 = the whole object: a bracket spanning every layer, so the marker points at something */}
      {focusLayer === undefined && (() => {
        const top = layers[0].cur[1] - 70, bottom = layers[4].cur[1] + 50;
        return <g style={{ cursor: onPick ? "pointer" : undefined }} onClick={() => onPick?.(0)} onMouseEnter={() => setActive?.(99)} onMouseLeave={() => setActive?.(-1)}>
          <path d={`M${WHOLE_X + 12} ${top} H${WHOLE_X} V${bottom} H${WHOLE_X + 12}`} className="bp" style={{ opacity: .8 }} />
          <rect x={WHOLE_X - 10} y={top} width="24" height={bottom - top} fill="transparent" />
        </g>;
      })()}

      {[...layers].reverse().map(({ i, o, t }) => show(i) && (
        <g key={i} style={{ transition: `transform var(--dur-scene) var(--ease-out) ${i * 80}ms`, transform: `translate(${t[0]}px, ${t[1] + (active === i ? -6 : 0)}px)`, cursor: onPick ? "pointer" : undefined }}
          onMouseEnter={() => setActive?.(i)} onMouseLeave={() => setActive?.(-1)} onClick={() => onPick?.(i + 1)}>
          {active === i && <g transform="translate(2 2)" opacity=".9"><Box i={i} ox={o[0]} oy={o[1]} slug={slug} /></g>}
          <Box i={i} ox={o[0]} oy={o[1]} shot={i === 2 ? shot : undefined} highlight={active === i} slug={slug} />
          <image href={`/exploded/${slug}-layer-0${i + 1}.svg`} x={o[0] - 120} y={o[1] - 120} width="240" height="160" onError={e => (e.currentTarget.style.display = "none")} />
          {/* people layer: crayon people standing on the platform */}
          {i === 0 && (
            <g className="crayon" filter={`url(#crayon-${boil % 3})`}>
              {slug === "traxen" && <><Person x={o[0] - 10} y={o[1] - 4} cap /><path d={`M${o[0] + 14} ${o[1] - 30} a16 16 0 1 0 0.1 0`} /><text x={o[0] + 40} y={o[1] - 50} fontSize="14" className="ink-text">brrr</text><path d={`M${o[0] - 50} ${o[1] - 40} l-8 -4 M${o[0] - 50} ${o[1] - 30} l-10 0`} /></>}
              {slug === "buymyspot" && <><Person x={o[0] - 30} y={o[1] - 2} /><Person x={o[0] + 30} y={o[1] + 6} s={0.9} /><text x={o[0] - 60} y={o[1] - 64} fontSize="14" className="ink-text">where do I park??</text></>}
              {slug === "gm" && <><Person x={o[0] - 14} y={o[1] - 2} /><path d={`M${o[0] - 44} ${o[1] - 4} v-38 q0 -8 8 -8 h8 M${o[0] - 44} ${o[1] - 4} h56`} /><ellipse cx={o[0] + 16} cy={o[1] - 30} rx="7" ry="16" /><text x={o[0] + 34} y={o[1] - 54} fontSize="14" className="ink-text">make it mine</text></>}
              {slug === "guardiancare" && <><Person x={o[0] - 20} y={o[1]} /><path d={`M${o[0] - 44} ${o[1] - 6} v-30 h48 v30`} /><Person x={o[0] + 34} y={o[1] + 6} s={0.85} /><rect x={o[0] + 44} y={o[1] - 40} width="8" height="14" className="fill" /></>}
            </g>
          )}
        </g>
      ))}

      {/* Muskaan's cameo inside the drawing, working on the mount/shell layer */}
      {show(1) && cameo && (() => { const [x, y] = layers[1].cur; return (
        <Mini pose={cameo} at={[x - 128, y - 96, 1.05]} />
      ); })()}

      {/* the machine talks: bubble with a leader-line tail from the screen layer */}
      {show(2) && (() => { const [x, y] = layers[2].cur; const bx = x - 250; const by = y - 66; return (
        <g>
          <path d={`M${x - 40} ${y - 10} L${bx + 90} ${by + 14}`} className="bp" />
          <rect x={bx} y={by - 18} width={brief.bubble.length * 7.6 + 20} height="32" rx="14" fill="#fff" stroke="var(--blueprint-dk)" strokeWidth="1.5" />
          <text x={bx + 10} y={by + 3} fontSize="15" fill="var(--blueprint-dk)" style={{ fontFamily: "var(--hand)" }}>{brief.bubble}</text>
        </g>
      ); })()}

      {/* markers: 01 = whole object, 02–06 = parts. Elbow leader lines run to the numbered cards. */}
      {focusLayer === undefined && [-1, 0, 1, 2, 3, 4].map(i => {
        const k = i + 1;
        const [x, y] = i < 0 ? [WHOLE_X, layers[0].cur[1] - 70] : markerFor(i);
        const id = i < 0 ? 99 : i, on = active === id;
        const elbow = VIEW.w - 14 - k * 9, cy = cardY(k);
        return (
          <g key={k} style={{ cursor: "pointer" }} onClick={() => onPick?.(k)} onMouseEnter={() => setActive?.(id)} onMouseLeave={() => setActive?.(-1)}>
            <polyline points={`${x},${y} ${elbow},${y} ${elbow},${cy} ${VIEW.w + 24},${cy}`} className="bp" fill="none"
              style={{ strokeWidth: on ? 2.4 : 1, opacity: on ? 1 : .6 }} strokeDasharray={on ? undefined : "2 4"} />
            <circle cx={x} cy={y} r="14" style={{ fill: on ? "var(--white)" : "var(--blueprint)" }} stroke="var(--white)" strokeWidth="1.5" />
            <text x={x} y={y + 4.5} fontSize="12" textAnchor="middle" className="bp-text" style={{ fill: on ? "var(--blueprint-dk)" : "var(--white)" }}>{String(k + 1).padStart(2, "0")}</text>
            {i < 0 && <text x={x - 2} y={y - 22} fontSize="10" className="bp-text">WHOLE OBJECT</text>}
          </g>
        );
      })}
    </svg>
  );
}


