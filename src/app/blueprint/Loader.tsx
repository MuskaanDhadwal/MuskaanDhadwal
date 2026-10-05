// Loader — a tired designer-engineer dragging a project from SKETCH to SHIPPED.
import { useCallback, useEffect, useRef, useState } from "react";
import { Folder, Mini, type Pose } from "./Ink";

const FRAMES: { pose: Pose; sleepy?: boolean; note: string }[] = [
  { pose: "dive", note: "dives in" },
  { pose: "slump", sleepy: true, note: "regrets it" },
  { pose: "coffee", note: "coffee #3" },
  { pose: "think", note: "aha!" },
  { pose: "walk", note: "ships it" },
  { pose: "carry", note: "" },
];

const STATUS = [
  "Renaming final_FINAL_v7.fig…",
  "Pushing pixels (gently)…",
  "Rubber-ducking the bugs…",
  "Arguing with the button padding…",
  "Waiting on one more round of feedback…",
  "Shipping it. Probably.",
];

const CELLS = 22;

export function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const done = useRef(false);
  const finish = useCallback(() => { if (!done.current) { done.current = true; onDone(); } }, [onDone]);

  useEffect(() => {
    if (pct >= 100) { const id = setTimeout(finish, 700); return () => clearTimeout(id); }
    const id = setTimeout(() => setPct(p => Math.min(100, p + 0.8 + Math.random() * 1.8)), 40);
    return () => clearTimeout(id);
  }, [pct, finish]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const frame = Math.min(FRAMES.length - 1, Math.floor((pct / 100) * FRAMES.length));
  const coffees = Math.max(0, Math.ceil((100 - pct) / 34));
  const filled = Math.round((pct / 100) * CELLS);

  return (
    <div role="dialog" aria-modal="true" aria-label="Loading Muskaan's portfolio" style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="hand" style={{ position: "absolute", top: 28, left: 32, color: "#fff", fontSize: 28 }}>time travel: sketch → shipped</div>

      <div className="fade-up" style={{ width: "min(860px, 100%)", background: "#EDEFF4", border: "2px solid var(--ink)", boxShadow: "8px 8px 0 var(--blue-dark)", borderRadius: 6 }}>
        {/* window chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#B9C0CF", borderBottom: "2px solid var(--ink)", borderRadius: "4px 4px 0 0" }}>
          {[0, 1, 2].map(i => <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", border: "1.8px solid var(--ink)", background: "#fff" }} />)}
          <span className="mono" style={{ marginLeft: 8, fontSize: 12 }}>final_FINAL_v7.fig — opening portfolio</span>
        </div>

        <div style={{ padding: "28px 28px 22px" }}>
          {/* the comic strip */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${FRAMES.length}, 1fr)`, alignItems: "end", gap: 4, minHeight: 130 }}>
            {FRAMES.map((f, i) => (
              <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", opacity: i <= frame ? 1 : 0.28, transition: "opacity .35s" }}>
                {i === 0 && <div style={{ position: "absolute", left: 0, bottom: 4 }}><svg width="64" height="48" viewBox="0 0 24 18" style={{ overflow: "visible" }}><Folder x={0} y={0} label="SKETCH" /></svg></div>}
                <div style={{ position: "relative", zIndex: 1, animation: i === frame ? "bob 1s ease-in-out infinite" : undefined }}>
                  <Mini pose={f.pose} sleepy={f.sleepy} size={100} />
                </div>
                <span className="hand" style={{ fontSize: 18, color: "var(--ink-2)", height: 20 }}>{f.note}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span className="hand" style={{ fontSize: 30, letterSpacing: "0.04em" }}>SKETCH</span>
            <span className="hand" style={{ fontSize: 30, letterSpacing: "0.04em" }}>SHIPPED</span>
          </div>

          {/* chunky progress bar */}
          <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}
            style={{ display: "grid", gridTemplateColumns: `repeat(${CELLS}, 1fr)`, gap: 5, padding: 6, marginTop: 14, background: "var(--blue-light)", border: "2px solid var(--ink)", borderRadius: 4 }}>
            {Array.from({ length: CELLS }).map((_, i) => (
              <span key={i} style={{ height: 14, borderRadius: 2, background: i < filled ? "#fff" : "transparent", border: `1.5px solid ${i < filled ? "#fff" : "#FFFFFF55"}`, transition: "background .2s" }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
            <span className="hand" style={{ fontSize: 24 }}>
              {pct >= 100 ? "Done. Mostly. Come on in." : `${STATUS[Math.min(STATUS.length - 1, Math.floor(pct / (100 / STATUS.length)))]} about ${coffees} coffee${coffees === 1 ? "" : "s"} left`}
            </span>
            <button onClick={finish} className="hand" style={{ marginLeft: "auto", fontSize: 20, background: "#B9C0CF", border: "2px solid var(--ink)", borderRadius: 4, padding: "4px 14px", cursor: "pointer", whiteSpace: "nowrap", minHeight: 40 }}>
              skip (I need a nap)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
