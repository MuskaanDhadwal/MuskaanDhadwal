// LOADER — "idea → shipped", after the 시간 이동 (time travel) dialog: a little Muskaan climbs out of the
// IDEA folder, flies, lands, gets up, walks over and stuffs the work into the SHIPPED folder.
// It really loads: the progress bar follows the home page's drawings + fonts (with a short minimum so the
// little story can play), then the window drops away and the homepage is underneath.
import { useEffect, useRef, useState } from "react";
import { Mini, type PoseName } from "./Minis";
import { useReducedMotion } from "./ui";

const FRAMES: { pose: PoseName; alt: string; status: string }[] = [
  { pose: "ldOut", alt: "climbing out of the IDEA folder", status: "opening the idea" },
  { pose: "ldFly", alt: "flying, flat out", status: "leaping before looking" },
  { pose: "ldLand", alt: "landing in a squat, seeing stars", status: "landing on edge cases" },
  { pose: "ldStand", alt: "standing up, a little dazed", status: "reading the user feedback" },
  { pose: "ldWalk", alt: "walking on", status: "fixing the padding (again)" },
  { pose: "ldPush", alt: "stuffing the work into the SHIPPED folder", status: "shipping it" },
];
const CELLS = 22;
const MIN_MS = 2600;   // the story needs a moment even on a fast connection
const MAX_MS = 9000;   // never hold anyone hostage on a slow one

// What the homepage needs before it looks right.
const ASSETS = ["hunched", "straight", "coffee", "deploy", "nap"].map(n => `/art/ship-${n}-white.png`);

function preload(onEach: () => void) {
  const jobs: Promise<unknown>[] = ASSETS.map(src => new Promise<void>(res => {
    const i = new Image(); i.onload = i.onerror = () => { onEach(); res(); }; i.src = src;
  }));
  jobs.push((document.fonts?.ready ?? Promise.resolve()).then(onEach));
  return Promise.all(jobs);
}

export function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const loaded = useRef(0);
  const total = ASSETS.length + 1;

  useEffect(() => {
    // a plain timer (not requestAnimationFrame) so it still finishes in a background tab
    let finished = false;
    const t0 = performance.now();
    preload(() => { loaded.current++; });
    const id = window.setInterval(() => {
      const elapsed = performance.now() - t0;
      const time = Math.min(1, elapsed / (reduced ? 400 : MIN_MS));
      const assets = loaded.current / total;
      // the bar can't run ahead of what has actually loaded (unless we hit the cap)
      const p = elapsed > MAX_MS ? 1 : Math.min(time, assets);
      setPct(p * 100);
      if (p >= 1 && !finished) {
        finished = true; clearInterval(id);
        setTimeout(() => { setLeaving(true); setTimeout(onDone, reduced ? 0 : 650); }, reduced ? 0 : 450);
      }
    }, 40);
    return () => clearInterval(id);
  }, [onDone, reduced, total]);

  const frame = Math.min(FRAMES.length - 1, Math.floor((pct / 100) * FRAMES.length));
  const done = pct >= 100;

  return (
    <div role="status" aria-label="Loading Muskaan's portfolio" className={`ld ${leaving ? "ld-out" : ""}`}>
      <div className="ld-win on-paper">
        <div className="ld-bar" aria-hidden><i /><i /><i /><span>idea → shipped</span></div>
        <div className="ld-body">
          <div className="ld-strip">
            {FRAMES.map((f, i) => (
              <div key={f.pose} className={`ld-frame ${i <= frame ? "on" : ""} ${i === frame ? "now" : ""}`}>
                <Mini pose={f.pose} tone="paper" unit="var(--ld-u)" label={`Muskaan ${f.alt}`} />
              </div>
            ))}
          </div>
          <div className="ld-ends" aria-hidden><span>IDEA</span><span>SHIPPED</span></div>
          <div className="ld-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Loading">
            {Array.from({ length: CELLS }).map((_, i) => <span key={i} className={i < Math.round((pct / 100) * CELLS) ? "full" : ""} />)}
          </div>
          <div className="ld-foot">
            <span className="ld-status">{done ? "shipped. opening the homepage…" : `${FRAMES[frame].status}…`}</span>
            <span className="ld-pct">{Math.round(pct)}%</span>
          </div>
        </div>
      </div>
      <svg className="ld-cursor" viewBox="0 0 20 24" aria-hidden><path d="M2 2 L2 19 L6.5 14.5 L9.5 21.5 L12.5 20 L9.5 13.2 L16 13.2 Z" /></svg>
    </div>
  );
}
