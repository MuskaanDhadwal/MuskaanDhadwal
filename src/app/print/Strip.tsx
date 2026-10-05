// "TODAY" — a comic strip of small panels. Each panel is one moment of the day with one poke.
// Fix the posture → fix the pixel → refuel → ship it → lights out.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Figure, type Pose } from "./Character";
import { useInView, useReducedMotion } from "./ui";

const SLOGANS = ["“UX” IS MY PASSION", "IT WORKS ON MY MACHINE", "SHIP IT", "CAFFEINE: CRITICAL"];

function useBoil(ref: React.RefObject<Element>) {
  const on = useInView(ref);
  const reduced = useReducedMotion();
  const [b, setB] = useState(0);
  useEffect(() => { if (!on || reduced) return; const id = setInterval(() => setB(x => x + 1), 125); return () => clearInterval(id); }, [on, reduced]);
  return b;
}

/** One comic panel: caption box on top, scene in the middle, status at the bottom. The whole panel is the button. */
function Panel({ n, time, task, done, status, label, onPoke, children }: {
  n: number; time: string; task: string; done: boolean; status: string; label: string; onPoke: () => void; children: ReactNode;
}) {
  const [popKey, setPopKey] = useState(0);
  return (
    <div className={`strip-panel ${done ? "done" : ""}`}>
      <button onClick={() => { setPopKey(k => k + 1); onPoke(); }} aria-label={label} data-tap="">
        <span className="strip-cap label"><b>{String(n).padStart(2, "0")}</b> {time} · {task}</span>
        <span key={popKey} className={popKey ? "strip-scene pop" : "strip-scene"}>{children}</span>
        <span className="strip-status label" aria-live="polite">{done ? "✓ " : "▸ "}{status}</span>
      </button>
    </div>
  );
}

/** Scene canvas: 240×230, precise props + Muskaan's figure (framed from the waist up). */
function Scene({ pose, children, over }: { pose: Pose; children?: ReactNode; over?: ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  const boil = useBoil(ref);
  return (
    <svg ref={ref} viewBox="0 0 240 230" className="scene" aria-hidden>
      <svg x="40" y="6" width="180" height="210" viewBox="0 -6 220 240" overflow="visible"><Figure pose={pose} boil={boil} /></svg>
      {children}
      {over}
    </svg>
  );
}

const Desk = () => <path d="M0 196 H240" className="bp" strokeWidth="2" />;
const Laptop = ({ x = 4 }: { x?: number }) => (
  <g className="bp" strokeWidth="1.8">
    <path d={`M${x} 132 L${x + 56} 128 L${x + 70} 196 H${x + 4} Z`} className="fill" />
    <text x={x + 34} y="172" fontSize="18" fontWeight="700" textAnchor="middle" className="bp-text" style={{ fontFamily: "var(--body)" }}>M</text>
  </g>
);

export function Strip({ render }: { render?: (panels: ReactNode[], done: number) => ReactNode } = {}) {
  const reduced = useReducedMotion();
  // 01 posture
  const [upright, setUpright] = useState(false);
  const [angle, setAngle] = useState(62);
  const [fixes, setFixes] = useState(0);
  const sink = useRef<number>();
  // 02 pixel · 03 coffee · 04 ship · 05 lights
  const [pixel, setPixel] = useState(false);
  const [sips, setSips] = useState(0);
  const [sipping, setSipping] = useState(false);
  const [shipped, setShipped] = useState(false);
  const [awake, setAwake] = useState(false);
  const [night, setNight] = useState(() => document.documentElement.dataset.theme === "night");
  useEffect(() => { document.documentElement.dataset.theme = night ? "night" : "day"; }, [night]);
  useEffect(() => () => clearTimeout(sink.current), []);

  const tick = (from: number, to: number, step: number, ms: number) => {
    if (reduced) return setAngle(to);
    let a = from; const id = setInterval(() => { a = step > 0 ? Math.min(to, a + step) : Math.max(to, a + step); setAngle(a); if (a === to) clearInterval(id); }, ms);
  };
  const fixPosture = () => {
    setUpright(true); setFixes(f => f + 1); tick(angle, 90, 4, 30);
    clearTimeout(sink.current);
    sink.current = window.setTimeout(() => { setUpright(false); tick(90, 62, -2, 60); }, 6000);
  };

  const done = [fixes > 0, pixel, sips > 0, shipped, awake].filter(Boolean).length;

  const panels = [
    <Panel key={1} n={1} time="09:00" task="posture" done={fixes > 0} onPoke={fixPosture}
          label="Panel 1: Muskaan is hunched over her laptop. Fix her posture."
          status={fixes === 0 ? "she's slouching — tap" : fixes >= 5 ? "ok ok I'll buy a chair" : `${angle}° · fixes: ${fixes}`}>
          <Scene pose={upright ? "upright" : "hunched"} over={upright && (
            <g className="bp">
              <path d={`M200 196 A60 60 0 0 0 ${200 - 60 * Math.cos(angle * Math.PI / 180)} ${196 - 60 * Math.sin(angle * Math.PI / 180)}`} strokeDasharray="3 3" />
              <text x="206" y="120" fontSize="13" className="bp-text">{angle}°{angle >= 90 ? "✓" : ""}</text>
            </g>
          )}><Desk /><Laptop /></Scene>
        </Panel>,
    <Panel key={2} n={2} time="10:30" task="the pixel" done={pixel} onPoke={() => setPixel(true)}
          label={pixel ? "Panel 2: the pixel is fixed" : "Panel 2: one pixel on the screen is 1px off. Snap it into place."}
          status={pixel ? "Δ 1PX resolved" : "1px off — tap"}>
          <Scene pose={pixel ? "upright" : "hunched"}>
            <Desk /><Laptop />
            <g className="bp">
              <circle cx="56" cy="62" r="34" className="fill" /><path d="M80 86 l14 14" strokeWidth="3" />
              {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${31 + i * 10} 34 V90 M28 ${37 + i * 10} H84`} opacity=".3" />)}
              <rect x={pixel ? 51 : 55} y={pixel ? 57 : 61} width="10" height="10" style={{ fill: pixel ? "var(--white)" : "var(--redline)", transition: "all var(--dur-ui) var(--ease-spring)" }} stroke="none" />
            </g>
          </Scene>
        </Panel>,
    <Panel key={3} n={3} time="13:00" task="refuel" done={sips > 0}
          onPoke={() => { setSips(s => s + 1); setSipping(true); setTimeout(() => setSipping(false), 1300); }}
          label={`Panel 3: take a sip. The mug says ${SLOGANS[sips % SLOGANS.length]}`}
          status={sips === 0 ? "running on empty — tap" : `sip #${sips} · ${["mug full", "¾ left", "½ left", "¼ left"][sips % 4]}`}>
          <Scene pose={sipping ? "sip" : "hunched"}>
            <Desk /><Laptop />
            {!sipping && <g className="bp">
              <path d="M168 150 h42 l-3 46 h-36 z" className="fill" /><path d="M210 160 q14 0 14 12 t-15 12" />
              <path d={`M172 ${158 + (sips % 4) * 9} h34`} strokeDasharray="3 3" opacity=".6" />
              <foreignObject x="168" y="158" width="42" height="36"><div className="hand" style={{ fontSize: 8, lineHeight: 1.05, textAlign: "center", color: "var(--white)" }}>{SLOGANS[sips % SLOGANS.length]}</div></foreignObject>
            </g>}
          </Scene>
        </Panel>,
    <Panel key={4} n={4} time="16:00" task="ship it" done={shipped} onPoke={() => setShipped(true)}
          label={shipped ? "Panel 4: shipped" : "Panel 4: press the ship button"}
          status={shipped ? "shipped to production" : "ready to ship — tap"}>
          <Scene pose={shipped ? "thumbs" : "upright"} over={shipped && (
            <g transform="translate(150 50) rotate(-8)"><rect x="-6" y="-16" width="86" height="26" fill="none" stroke="var(--white)" strokeWidth="2.5" />
              <text x="37" y="2" fontSize="13" fontWeight="700" textAnchor="middle" className="bp-text" >SHIPPED</text></g>
          )}>
            <Desk />
            <g className="bp">
              <rect x="20" y="160" width="60" height="36" className="fill" />
              <circle cx="50" cy="172" r={shipped ? 8 : 10} style={{ fill: shipped ? "var(--accent)" : "var(--redline)", transition: "r var(--dur-micro)" }} stroke="currentColor" />
              <text x="50" y="192" fontSize="8" textAnchor="middle" className="bp-text">DEPLOY</text>
            </g>
          </Scene>
        </Panel>,
    <Panel key={5} n={5} time="23:00" task="lights out" done={awake}
          onPoke={() => { setAwake(a => !a); setNight(n => !n); }}
          label={awake ? "Panel 5: she's awake. Tap to switch the lamp and go back to sleep." : "Panel 5: she fell asleep at the keyboard. Wake her up (also toggles night mode)."}
          status={awake ? "awake! · night mode " + (night ? "on" : "off") : "z z z — tap"}>
          <Scene pose={awake ? "wave" : "asleep"}>
            <Desk />
            <g className="bp">
              <path d="M200 196 V96 L170 70" /><path d="M150 62 l28 -14 l12 26 l-28 14 z" className="fill" />
              {night && <path d="M164 82 L120 196 H230 Z" style={{ fill: "var(--accent)" }} opacity=".25" stroke="none" />}
            </g>
          </Scene>
        </Panel>
  ];

  if (render) return <>{render(panels, done)}</>;
  return (
    <div className="strip-wrap">
      <div className="strip-head">
        <span className="label">Today · 5 small tasks · tap a box</span>
        <span className="label" aria-live="polite">{done}/5 done{done === 5 ? " — productive day ✓" : ""}</span>
      </div>
      <div className="strip" role="list">{panels}</div>
    </div>
  );
}
