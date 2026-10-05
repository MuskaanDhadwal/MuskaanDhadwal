// Home — opening lettering (mini-Muskaans living on the letters) + the "selected work" comic page.
import type { CSSProperties, ReactNode } from "react";
import { ARCHIVED_PROJECTS, MISSIONS, SIDE_QUESTS, TRANSMISSIONS, type Mission } from "./data";
import { Exploded, Mini, type Pose } from "./Ink";
import { go } from "./nav";

// ── Opening ────────────────────────────────────────────────────────────────
// Each letter can host a character + a handwritten blueprint note.
const LETTERS: { ch: string; pose?: Pose; where?: "top" | "under" | "left"; note?: string; lift?: number; flip?: boolean }[] = [
  { ch: "M", pose: "camera", where: "left", note: "researches everything" },
  { ch: "U", pose: "type", where: "top", note: "designs AND codes" },
  { ch: "S" },
  { ch: "K", pose: "armsUp", where: "under", lift: 26, note: "holds the system up" },
  { ch: "A" },
  { ch: "A", pose: "sit", where: "top", note: "ships, then naps" },
  { ch: "N", pose: "wave", where: "top", note: "says hi!", flip: true },
];

function Note({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return <span className="hand" aria-hidden style={{ position: "absolute", color: "var(--blue)", fontSize: "clamp(16px, 1.6vw, 22px)", whiteSpace: "nowrap", lineHeight: 1, ...style }}>{children}</span>;
}

function Opening() {
  return (
    <section className="sheet grid-bg" aria-labelledby="hello" style={{ paddingTop: 28, overflow: "hidden" }}>
      <div className="sheet-tag"><span>fig. 01 — the designer who codes</span><span>portfolio · 2026</span></div>

      {/* dimension line, like a drafting sheet */}
      <div aria-hidden className="mono" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--blue)", fontSize: 11, margin: "8px clamp(8px,6vw,80px) 0" }}>
        <span>|←</span><span style={{ flex: 1, borderTop: "1.5px dashed var(--blue)" }} /><span>7 letters · 1 UX engineer · ∞ coffee</span><span style={{ flex: 1, borderTop: "1.5px dashed var(--blue)" }} /><span>→|</span>
      </div>

      <h1 id="hello" aria-label="Muskaan Dhadwal" className="serif" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", margin: "110px 0 0", fontSize: "clamp(64px, 14vw, 196px)", lineHeight: 0.82, color: "var(--ink)", userSelect: "none" }}>
        {LETTERS.map((l, i) => (
          <span key={i} aria-hidden style={{ position: "relative", display: "inline-block", transform: l.lift ? `translateY(-${l.lift}px)` : undefined }}>
            {l.ch}
            {l.pose && l.where === "top" && (
              <span style={{ position: "absolute", left: "50%", bottom: "92%", transform: "translateX(-50%)", animation: "bob 3s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}>
                <Mini pose={l.pose} size={92} />
              </span>
            )}
            {l.pose && l.where === "under" && (
              <span style={{ position: "absolute", left: "50%", top: "86%", transform: "translateX(-50%)" }}><Mini pose={l.pose} size={86} /></span>
            )}
            {l.pose && l.where === "left" && (
              <span style={{ position: "absolute", right: "92%", bottom: -6 }}><Mini pose={l.pose} size={86} /></span>
            )}
            {l.note && (
              <Note style={l.where === "under" ? { top: "calc(86% + 90px)", left: "50%", transform: "translateX(-50%)" }
                : l.where === "left" ? { right: "100%", top: "-30%" }
                : l.flip ? { bottom: "calc(92% + 40px)", left: "85%", transform: "rotate(6deg)" }
                : { bottom: "calc(92% + 96px)", left: "50%", transform: "translateX(-50%) rotate(-4deg)" }}>
                {l.where === "left" ? "↘ " : l.flip ? "↙ " : "↓ "}{l.note}
              </Note>
            )}
          </span>
        ))}
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 16, margin: "110px clamp(8px,6vw,80px) 0" }}>
        <div>
          <div className="serif" style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "var(--red)", lineHeight: 1 }}>Dhadwal</div>
          <div className="label" style={{ marginTop: 10 }}>UX Engineer @ Traxen AI · Ann Arbor, Michigan</div>
        </div>
        <p className="hand" style={{ fontSize: 26, maxWidth: 420, margin: 0, lineHeight: 1.15 }}>
          I take messy, complicated systems apart — then put them back together so they make sense. Every project here is drawn the same way: <span style={{ color: "var(--blue)" }}>component by component.</span>
        </p>
        <button className="btn primary" onClick={() => go("#/work")}>see the work ↓</button>
      </div>
    </section>
  );
}

// ── Selected work: a comic page ───────────────────────────────────────────
const STAMP: Record<string, string> = { traxen: "shipped", buymyspot: "internship", guardiancare: "2 awards" };

function ProjectPanel({ m, big }: { m: Mission; big?: boolean }) {
  const open = () => go(`#/case/${m.slug}`);
  return (
    <button onClick={open} className="panel" aria-label={`Open ${m.label} case study`}
      style={{ display: "flex", flexDirection: "column", textAlign: "left", padding: 0, cursor: "pointer", height: "100%", width: "100%", background: big ? "var(--paper)" : undefined }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 12px 0" }}>
        <span className="caption">case {m.num} · {m.label}</span>
        <span className="stamp">{STAMP[m.slug]}</span>
      </div>
      <div style={{ flex: 1, minHeight: big ? 360 : 230, padding: big ? "0 16px" : "0 8px" }}>
        <Exploded slug={m.slug} accent={m.color} compact />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, padding: "0 12px 12px" }}>
        <span className="caption" style={{ maxWidth: 360 }}>
          {m.role} · {m.year}<br /><b style={{ color: m.color }}>{m.stats[0].val}</b> {m.stats[0].label.toLowerCase()}
        </span>
        <span className="hand" style={{ fontSize: 22, color: "var(--blue)", whiteSpace: "nowrap" }}>take it apart →</span>
      </div>
    </button>
  );
}

function SideQuest({ title, meta, desc }: { title: string; meta: string; desc: string }) {
  return (
    <div className="panel" style={{ padding: "10px 12px" }}>
      <div className="label muted" style={{ fontSize: 10 }}>{meta}</div>
      <div className="serif" style={{ fontSize: 19, lineHeight: 1.1, margin: "4px 0 2px" }}>{title.toLowerCase()}</div>
      <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
}

function Mailbag() {
  const tilt = [-3, 2, -1.5, 3];
  return (
    <div className="panel ink" style={{ padding: "18px 18px 22px", display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ minWidth: 150 }}>
        <div className="label" style={{ color: "#FFFFFFAA" }}>the mailbag</div>
        <div className="hand" style={{ fontSize: 30, lineHeight: 1, marginTop: 4 }}>things people<br />have told me</div>
        <div style={{ marginTop: 8, filter: "invert(1)" }}><Mini pose="think" size={70} /></div>
      </div>
      {TRANSMISSIONS.map((t, i) => (
        <figure key={t.sender} style={{ flex: "1 1 200px", margin: 0, transform: `rotate(${tilt[i]}deg)` }}>
          <blockquote className="bubble" style={{ margin: 0, fontSize: 19 }}>{t.text.replace(/^"|"$/g, "")}</blockquote>
          <figcaption className="mono" style={{ fontSize: 11, marginTop: 16, color: "#FFFFFFCC" }}>— {t.sender.toLowerCase()} · <span style={{ color: "var(--yellow)" }}>{t.status.toLowerCase()}</span></figcaption>
        </figure>
      ))}
    </div>
  );
}

function Work() {
  const [traxen, bms, gc] = MISSIONS;
  const eco = ARCHIVED_PROJECTS[0];
  return (
    <section id="work" className="sheet" aria-labelledby="work-title" style={{ scrollMarginTop: 80 }}>
      <div className="sheet-tag"><span id="work-title">selected work: layer 01</span><span>3 case studies · 5 side quests</span></div>
      <div className="work-grid">
        <div style={{ gridArea: "a" }}><ProjectPanel m={traxen} big /></div>
        <div style={{ gridArea: "side", display: "flex", flexDirection: "column", gap: 8 }}>
          <SideQuest title={eco.label} meta={eco.year} desc="0→1 sustainable-transport app, researched + designed solo." />
          <div className="arrow-down" aria-hidden>↓</div>
          {SIDE_QUESTS.slice(0, 3).map((q, i) => (
            <div key={q.title} style={{ display: "contents" }}>
              <SideQuest title={q.title} meta={`${q.org.split("·")[0]} · ${q.year}`} desc={q.desc} />
              {i < 2 && <div className="arrow-down" aria-hidden>↓</div>}
            </div>
          ))}
        </div>
        <div style={{ gridArea: "b" }}><ProjectPanel m={bms} /></div>
        <div style={{ gridArea: "c" }}><ProjectPanel m={gc} /></div>
        <div style={{ gridArea: "mail" }}><Mailbag /></div>
        <div className="panel tint" style={{ gridArea: "foot", padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <span className="mono" style={{ fontSize: 13, lineHeight: 1.6 }}>seen.<br />left on read.<br />blocked.<br />quack.</span>
          <span className="hand" style={{ fontSize: 24, marginLeft: "auto", textAlign: "right" }}>want to add to the mailbag?</span>
          <button className="btn" onClick={() => go("#/contact")}>write to me →</button>
        </div>
      </div>
      <style>{`
        .work-grid { display: grid; gap: 14px; grid-template-columns: 1fr 1fr 290px;
          grid-template-areas: "a a side" "b c side" "mail mail mail" "foot foot foot"; }
        @media (max-width: 900px) { .work-grid { grid-template-columns: 1fr; grid-template-areas: "a" "b" "c" "side" "mail" "foot"; } }
      `}</style>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Opening />
      <Work />
    </>
  );
}
