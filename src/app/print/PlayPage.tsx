// PLAY — things to poke. The shelf is data (play.ts); this file renders it and holds the built-in games.
import { useState, type ReactNode } from "react";
import { Mini } from "./Minis";
import { Chamfer } from "./ui";
import { go } from "./nav";
import { TOYS, type Toy } from "./play";

// ── embed: another app, loaded only when the visitor asks (it may want the camera) ──
// With a promo video, the stage has two tabs: watch first, then try it (the video is the default view).
function EmbedToy({ t }: { t: Toy }) {
  const [on, setOn] = useState(false);
  const [tab, setTab] = useState<"watch" | "try">(t.video ? "watch" : "try");
  return (
    <div className="pl-stage-wrap">
      {t.video && (
        <div className="tx-toggle pl-tabs" role="group" aria-label={`${t.title}: watch or try`}>
          <button className={`ct-chip ${tab === "watch" ? "on" : ""}`} aria-pressed={tab === "watch"} onClick={() => { setTab("watch"); setOn(false); }}>▶ Watch the promo · {t.video.length}</button>
          <button className={`ct-chip ${tab === "try" ? "on" : ""}`} aria-pressed={tab === "try"} onClick={() => setTab("try")}>Try it live</button>
        </div>
      )}
      {tab === "watch" && t.video ? (
        <div className="pl-stage">
          <video className="pl-frame pl-video" src={t.video.src} poster={t.video.poster} controls playsInline preload="none" aria-label={t.video.label} />
          <div className="pl-stage-bar">
            <span className="label mid">the promo · press play</span>
            <Chamfer solid onClick={() => setTab("try")}>Now try it →</Chamfer>
          </div>
        </div>
      ) : (
    <div className="pl-stage">
      {on
        ? <iframe src={t.url} title={t.title} allow={t.allow} className="pl-frame" />
        : (
          <button className="pl-poster" onClick={() => setOn(true)} aria-label={`Start ${t.title}${t.allow?.includes("camera") ? " (it will ask to use your camera)" : ""}`}>
            {t.poster && <img src={t.poster} alt="" />}
            <span className="pl-start"><span className="display">▶ Start</span>{t.allow?.includes("camera") && <span className="label">it will ask for your camera</span>}</span>
          </button>
        )}
      <div className="pl-stage-bar">
        <span className="label mid">{on ? "running · if the camera is blocked here, open it in a new tab" : "loads only when you press start"}</span>
        <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {on && <Chamfer onClick={() => setOn(false)}>Stop</Chamfer>}
          <Chamfer href={t.url} external>Open in a new tab ↗</Chamfer>
        </span>
      </div>
    </div>
      )}
    </div>
  );
}

// built-in games: write a component and register it here by the `game` id used in play.ts
const GAMES: Record<string, () => ReactNode> = {};

function ToySection({ t, n }: { t: Toy; n: number }) {
  return (
    <section className="tx-band pl-toy" aria-labelledby={`toy-${t.id}`}>
      <div className="pl-toy-grid">
        <div className="pl-toy-text">
          <span className="label mid">{String(n).padStart(2, "0")} · {t.tag}</span>
          <h2 id={`toy-${t.id}`} className="display tx-band-title">{t.title}</h2>
          <p>{t.blurb}</p>
          {t.how && <ol className="pl-how">{t.how.map(h => <li key={h}>{h}</li>)}</ol>}
          {t.credit && <p className="pl-credit">{t.credit}</p>}
          {t.more && <Chamfer onClick={() => go(t.more![1])}>{t.more[0]} →</Chamfer>}
          {t.kind === "link" && t.url && <Chamfer solid href={t.url} external>Open it ↗</Chamfer>}
        </div>
        <div>
          {t.kind === "embed" && <EmbedToy t={t} />}
          {t.kind === "game" && t.game && GAMES[t.game]?.()}
        </div>
      </div>
    </section>
  );
}

export function PlayPage() {
  return (
    <section className="sheet" aria-labelledby="pl-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">Play · the toy shelf</span><span className="rail-line" /></div>
      <div className="rs-head">
        <div>
          <p className="label mid">Play · things to poke</p>
          <h1 id="pl-title" className="display ab-h1">Play</h1>
          <p className="ab-lede">Toys and experiments. Some I designed, some I built with AI. Each one is all here: what it is, how it was made, and the real thing to poke.</p>
        </div>
        <div className="rs-me">
          <span className="ab-bubble hand">pick a toy!</span>
          <Mini pose="plController" label="A small Muskaan gripping a game controller, ready to play" unit="var(--ab-u)" />
        </div>
      </div>
      {TOYS.map((t, i) => <ToySection key={t.id} t={t} n={i + 1} />)}
      <div className="ab-end">
        <h2 className="display ab-h2">More toys are in the workshop.</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Suggest one →</Chamfer>
          <Chamfer onClick={() => go("#/work")}>See the real work</Chamfer>
        </div>
      </div>
    </section>
  );
}
