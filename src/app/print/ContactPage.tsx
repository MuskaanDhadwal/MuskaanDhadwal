// CONTACT — "Say hi". Pick why you're here, she reacts, you write a postcard, it opens your email app.
// Never pretends to send: there is no backend, so "send" is a mailto with the subject and body filled in.
import { useState } from "react";
import { Mini } from "./Minis";
import { LINKS } from "./story";
import { Chamfer } from "./ui";

const REASONS = [
  { id: "hire", label: "Hiring a UX engineer", subject: "Let's talk about a role", quip: "Oh! Tell me about the team." },
  { id: "build", label: "Building something together", subject: "Let's build something", quip: "Yes. What are we making?" },
  { id: "talk", label: "Talking design + code", subject: "Design + code chat", quip: "My favourite topic. Coffee's refilled." },
  { id: "talk-ws", label: "A talk or workshop", subject: "Talk / workshop invite", quip: "I survived teaching AR/VR. Bring it on." },
  { id: "games", label: "Board-game night", subject: "Board-game night?", quip: "I'll bring snacks. You explain the rules." },
  { id: "plant", label: "Rescuing a plant", subject: "Plant rescue mission", quip: "Please. Save them from me." },
  { id: "hi", label: "Just saying hi", subject: "Hi!", quip: "Hi! That's it. That's the message." },
];
const EMAIL = LINKS.find(l => l.label === "Email")!.val;

export function ContactPage() {
  const [reason, setReason] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const r = REASONS.find(x => x.id === reason);
  const subject = r?.subject ?? "Hello from your portfolio";
  const body = `${msg || "(write your message here)"}\n\n${name ? `— ${name}` : ""}`;
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section className="sheet ct" aria-labelledby="ct-title">
      <div className="rail" aria-hidden><span className="rail-label">Contact · say hi</span><span className="rail-line" /></div>
      <div className="ct-head">
        <div>
          <p className="label mid">Contact · replies faster than my plants give up</p>
          <h1 id="ct-title" className="display ab-h1">Say hi.</h1>
          <p className="ab-lede" style={{ maxWidth: 520 }}>Pick why you're here, write me a postcard, and it'll open in your email app. No forms vanishing into the void.</p>
        </div>
        <div className="ct-me" aria-live="polite">
          <span className="ab-bubble hand">{sent ? "Got it, it's in your outbox. Talk soon!" : r ? r.quip : "Hi! What brings you here?"}</span>
          <Mini key={sent ? "plane" : "phone"} pose={sent ? "ctPlane" : "ctPhone"} unit="var(--ab-u)" className="pop"
            label={sent ? "A small Muskaan throwing a paper plane" : "A small Muskaan on the phone, ready to listen"} />
        </div>
      </div>

      <div className="ct-grid">
        <div>
          <h2 className="label" id="ct-why">01 · Why are you here?</h2>
          <div className="ct-chips" role="radiogroup" aria-labelledby="ct-why">
            {REASONS.map(x => (
              <button key={x.id} role="radio" aria-checked={reason === x.id} className={`ct-chip ${reason === x.id ? "on" : ""}`} onClick={() => { setReason(x.id); setSent(false); }}>{x.label}</button>
            ))}
          </div>
          <h2 className="label" style={{ marginTop: 32 }}>Or skip the postcard</h2>
          <ul className="ct-links">
            {[...LINKS, { label: "Resume", val: "résumé + PDFs", href: "/#/resume" }].map(l => (
              <li key={l.label}>
                <a className="dimlink" href={l.href} target={l.href.startsWith("mailto") || l.href.startsWith("/#") ? undefined : "_blank"} rel="noreferrer">
                  <span>{l.label}</span><span className="mid">{l.val} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="ct-postcard on-paper" onSubmit={e => { e.preventDefault(); setSent(true); window.location.href = href; }} aria-labelledby="ct-card">
          <h2 className="label" id="ct-card">02 · Your postcard</h2>
          <div className="ct-card-grid">
            <div className="ct-card-left">
              <label className="label" htmlFor="ct-msg">Message</label>
              <textarea id="ct-msg" rows={6} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Dear Muskaan, …" className="hand" />
              <label className="label" htmlFor="ct-name">Signed</label>
              <input id="ct-name" value={name} onChange={e => setName(e.target.value)} placeholder="your name" className="hand" autoComplete="name" />
            </div>
            <div className="ct-card-right">
              <span className="ct-stamp" aria-hidden><span className="display">MD</span><span>USA</span></span>
              <div className="ct-addr">
                <span className="label">To</span><span className="hand">Muskaan Dhadwal</span>
                <span className="label">Re</span><span className="hand">{subject}</span>
              </div>
            </div>
          </div>
          <div className="ct-send">
            <Chamfer solid>Send via email ✈</Chamfer>
            <span className="label" style={{ opacity: .75 }}>opens your email app, addressed to {EMAIL}</span>
          </div>
        </form>
      </div>
    </section>
  );
}
