// Contact — Muskaan at her desk, plus a hand-drawn "new message" window.
// There's no backend: sending hands the message to the visitor's email app.
import { useEffect, useState } from "react";
import { LINKS } from "./data";
import { BLUE, INK, Mini } from "./Ink";

function Desk() {
  return (
    <svg viewBox="0 0 360 300" style={{ width: "100%", maxWidth: 440 }} role="img" aria-label="Muskaan at her laptop with a mug that says UX is my passion">
      <g filter="url(#wobble)" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 250 H350" strokeWidth="2.4" />
        <path d="M30 248 L60 150 H170 L150 248 Z" fill="#fff" /><path d="M150 248 h70" />
        <path d="M100 196 c-6 -8 -4 -14 2 -14 2 -6 10 -6 10 0 6 -2 10 4 4 10 z" fill={BLUE} stroke="none" />
        <path d="M188 172 h54 M196 172 l-6 78 M234 172 l6 78 M193 214 h44" strokeWidth="2" />
        <rect x="282" y="186" width="50" height="62" rx="6" fill="#fff" />
        <path d="M332 202 q18 0 18 15 t-18 15" />
        <text x="307" y="206" fontFamily="Caveat, cursive" fontSize="13" fill={BLUE} stroke="none" textAnchor="middle">UX IS</text>
        <text x="307" y="220" fontFamily="Caveat, cursive" fontSize="13" fill={BLUE} stroke="none" textAnchor="middle">MY</text>
        <text x="307" y="234" fontFamily="Caveat, cursive" fontSize="13" fill={BLUE} stroke="none" textAnchor="middle">PASSION</text>
        <path d="M298 178 q4 -10 0 -18 M314 178 q4 -10 0 -18" strokeWidth="1.4" />
      </g>
      <foreignObject x="150" y="40" width="160" height="220"><Mini pose="type" size={210} noProp /></foreignObject>
    </svg>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [pct, setPct] = useState(-1); // -1 idle · 0–100 packing · >=100 ready
  const ready = pct >= 100;

  useEffect(() => {
    if (pct < 0 || pct >= 100) return;
    const id = setTimeout(() => setPct(p => Math.min(100, p + 4 + Math.random() * 6)), 50);
    return () => clearTimeout(id);
  }, [pct]);

  const mailto = `mailto:mdhadwal@umich.edu?subject=${encodeURIComponent(`Hello from ${form.name}`)}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)}`;
  const field = { width: "100%", boxSizing: "border-box" as const, border: "2px solid var(--ink)", background: "#fff", padding: "10px 12px", fontFamily: "var(--sans)", fontSize: 16, color: "var(--ink)", borderRadius: 2 };

  return (
    <section className="sheet" aria-labelledby="contact-title">
      <div className="sheet-tag"><span id="contact-title">page 03: say hi</span><span>replies within ~48h (after coffee)</span></div>
      <div className="contact-grid">
        <div className="panel grid-bg" style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="bubble" style={{ alignSelf: "flex-start", maxWidth: 380, fontSize: 24 }}>
            Let's build something that actually makes sense to use.
          </div>
          <Desk />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* hand-drawn message window */}
          <div style={{ background: "#EDEFF4", border: "2px solid var(--ink)", borderRadius: 6, boxShadow: "6px 6px 0 var(--ink)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#B9C0CF", borderBottom: "2px solid var(--ink)", borderRadius: "4px 4px 0 0" }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", border: "1.8px solid var(--ink)", background: "#fff" }} />)}
              <span className="mono" style={{ marginLeft: 8, fontSize: 12 }}>new_message.txt</span>
            </div>
            {pct < 0 ? (
              <form style={{ padding: 18, display: "grid", gap: 12 }} onSubmit={e => { e.preventDefault(); setPct(0); }}>
                <label className="label" style={{ display: "grid", gap: 6 }}>Your name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={field} /></label>
                <label className="label" style={{ display: "grid", gap: 6 }}>Your email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={field} /></label>
                <label className="label" style={{ display: "grid", gap: 6 }}>Message<textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...field, resize: "vertical" }} /></label>
                <button className="btn primary" type="submit" style={{ justifySelf: "start" }}>fold it into a paper plane ✈</button>
              </form>
            ) : (
              <div style={{ padding: 18 }} aria-live="polite">
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  <Mini pose={ready ? "wave" : "carry"} size={86} />
                  <p className="hand" style={{ fontSize: 26, margin: 0, lineHeight: 1.1 }}>
                    {ready ? `Folded! Last step, ${form.name.split(" ")[0] || "friend"}: your email app sends it.` : "Folding your message into a paper plane…"}
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 4, padding: 5, margin: "14px 0", background: "var(--blue-light)", border: "2px solid var(--ink)", borderRadius: 4 }}>
                  {Array.from({ length: 16 }).map((_, i) => <span key={i} style={{ height: 12, borderRadius: 2, background: i < Math.round(Math.max(0, pct) / 100 * 16) ? "#fff" : "transparent", border: "1.5px solid #FFFFFF88" }} />)}
                </div>
                {ready && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="btn primary" href={mailto}>open email to send ↗</a>
                    <button className="btn" onClick={() => { setPct(-1); setForm({ name: "", email: "", message: "" }); }}>start over</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="panel" style={{ padding: "12px 16px" }}>
            <span className="caption">or find me here</span>
            {LINKS.map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px dashed var(--ink-2)", color: "var(--ink)", textDecoration: "none", minHeight: 24 }}>
                <span className="serif" style={{ fontSize: 22 }}>{l.label}</span><span className="mono" style={{ fontSize: 12, color: "var(--blue)" }}>{l.val} ↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .contact-grid { display: grid; gap: 16px; grid-template-columns: 1.1fr 1fr; align-items: start; }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
