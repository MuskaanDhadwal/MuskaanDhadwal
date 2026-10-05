// HOME — name in a sticky side column (with small versions of Muskaan living on the letters),
// everything else on the right: A day of shipping (4 tap-able boxes) → Fresh prints (hanging line) → Reviews + say hi.
// A small Muskaan walks down the left rail as you scroll.
// Big drawings are Muskaan's own (public/art/*); the small ones are drawn in code in her style (Minis.tsx).
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MISSIONS, PRINT, TRANSMISSIONS } from "./story";
import { Chamfer, useInView, useReducedMotion } from "./ui";
import { Mini as MiniFig, type PoseName } from "./Minis";
import { go } from "./nav";

const BUILD = "2026.10";
const art = (name: string) => `/art/${name}-white.png`;

// After Aesha Koshti's PORTFOLIO lettering: every letter has its own height and tilt, and each drawing of her
// does something different with one: sits on the M, is framed in the U, peeks over the S, holds the second A
// up while standing on a stack of books, leans on the N. Each drawing is a solid silhouette (filled
// with the page blue, `scripts/make-solid.py`), so where she overlaps a letter she covers it; the ones marked
// `back` sit behind the letter. Same white line as the letters: one drawing.
type Mini = { img: string; alt: string; quip: string; cls: string; back?: boolean };
const MINIS: Record<string, Mini> = {
  artist: { img: "kit-artist", alt: "Muskaan sitting cross-legged on top of the M, sketching in her notebook", quip: "v1 of 47", cls: "nm2-on-m" },
  wave: { img: "at-wave", alt: "Muskaan waving from inside the U", quip: "the U is my office now", cls: "nm2-in-u", back: true },
  peek: { img: "ld-peek", alt: "Muskaan peeking over the top of the S, fingers on the edge", quip: "that's 1px off. I can feel it.", cls: "nm2-over-s" },
  hold: { img: "ld-stretch", alt: "Muskaan standing on a stack of books, holding the second A up over her head", quip: "holding it all together", cls: "nm2-hold-a" },
  dream: { img: "ld-daydream", alt: "Muskaan leaning on top of the N, chin in her hand, daydreaming", quip: "wait. what if…", cls: "nm2-lean-n" },
};

/** a small four-point sparkle, like the diamonds tucked into Aesha's letters */
const Spark = ({ cls }: { cls: string }) => (
  <svg className={`nm2-spark ${cls}`} viewBox="0 0 10 10" aria-hidden><path d="M5 0 6.1 3.9 10 5 6.1 6.1 5 10 3.9 6.1 0 5 3.9 3.9Z" /></svg>
);

function MiniOnLetter({ m }: { m: Mini }) {
  const [said, setSaid] = useState(false);
  const [k, setK] = useState(0);
  // the bubble closes by itself after a moment; tapping her again or pressing Esc closes it sooner
  useEffect(() => {
    if (!said) return;
    const t = setTimeout(() => setSaid(false), 2600);
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setSaid(false); };
    addEventListener("keydown", esc);
    return () => { clearTimeout(t); removeEventListener("keydown", esc); };
  }, [said, k]);
  return (
    <span className={`mini ${m.cls} ${m.back ? "mini-back" : ""}`}>
      <button onClick={() => { if (said) { setSaid(false); return; } setSaid(true); setK(x => x + 1); }} aria-expanded={said} aria-label={`${m.alt}. Tap to hear her.`}>
        <span key={k} className={`mini-fig ${k ? "pop" : ""}`}><img src={`/art/${m.img}-solid.png`} alt="" /></span>
      </button>
      {said && <span className="mini-say" role="status">{m.quip}</span>}
    </span>
  );
}

function NameLetters() {
  const ch = (c: string) => <span className="nm2-ch" aria-hidden>{c}</span>;
  return (
    <h1 className="nm2 display">
      <span className="sr-only">Muskaan Dhadwal</span>
      <span className="nm2-word">
        <span className="nm2-l nm2-m">{ch("M")}<MiniOnLetter m={MINIS.artist} /></span>
        <span className="nm2-l nm2-u"><span className="nm2-ch nm2-ushape" aria-hidden /><MiniOnLetter m={MINIS.wave} /></span>
        <span className="nm2-l nm2-s">{ch("S")}<MiniOnLetter m={MINIS.peek} /></span>
        <span className="nm2-l nm2-k">{ch("K")}<Spark cls="nm2-spark-k" /></span>
        <span className="nm2-l nm2-a1">{ch("A")}<Spark cls="nm2-spark-a" /></span>
        <span className="nm2-l nm2-a2">{ch("A")}<span className="nm2-books" aria-hidden><i /><i /><i /></span><MiniOnLetter m={MINIS.hold} /></span>
        <span className="nm2-l nm2-n">{ch("N")}<MiniOnLetter m={MINIS.dream} /></span>
      </span>
    </h1>
  );
}

/** Section head, after her references: title (optionally framed) + an optional hand-lettered one-liner. */
function SecHead({ id, title, sub, framed, aside }: { id: string; title: string; sub?: ReactNode; framed?: boolean; aside?: ReactNode }) {
  return (
    <div className="sec-head">
      <div className="sec-head-main">
        <div>
          <h2 id={id} className={`display sec-title ${framed ? "sec-framed" : ""}`}>{title}</h2>
          {sub && <p className="sec-sub hand">{sub}</p>}
        </div>
      </div>
      {aside && <div className="sec-head-aside">{aside}</div>}
    </div>
  );
}

function SideName() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { // let CSS know how tall the column is, so a tall column sticks by its bottom edge
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => el.style.setProperty("--side-h", `${el.offsetHeight}px`));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  return (
    <aside ref={ref} id="top" className="name-side" data-section="top">
      <p className="kicker display">UX Engineer</p>
      <NameLetters />
      <p className="name-tagline display">I design it.<br />Then I build it.</p>
      <p className="name-intro">I design interfaces and write the code that ships them. Right now: in-cab software for truck drivers at Traxen.</p>
      <p className="name-now">Open to work · Open to relocation (USA)</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Chamfer solid onClick={() => go("#/work")}>See the work</Chamfer>
        <Chamfer onClick={() => go("#/resume")}>Resume</Chamfer>
      </div>
    </aside>
  );
}

// ── A day of shipping: four boxes, eight of her drawings, none repeated. Each box is a before → after.
const BOXES = [
  { no: "01", time: "09:00", title: "one pixel off", before: "ship-hunched", after: "kit-designer", act: "Sit up straight ↑", done: "posture fixed. back to the wireframes.",
    altB: "Muskaan hunched over her laptop, nose almost on the screen.", altA: "Muskaan sitting up straight at her laptop, smiling, sketching a wireframe beside it." },
  { no: "02", time: "11:00", title: "refuel", before: "ship-straight", after: "ship-coffee", act: "Let her have her coffee", done: "caffeine restored ✓",
    altB: "Muskaan grumpy and tired at her laptop, a scribble over her head, her mug just out of reach.", altA: "Muskaan beaming with her “UX is my passion” mug, fist pumped." },
  { no: "03", time: "16:00", title: "ship it", before: "kit-checklist", after: "kit-bugs", act: `● Deploy v${BUILD}`, done: "3 bugs. of course. on it.",
    altB: "Muskaan at her monitor, ticking off a checklist before the release.", altA: "Muskaan frowning at her laptop, pencil to her head, bugs and warnings floating around her." },
  { no: "04", time: "23:00", title: "lights out", before: "ship-deploy", after: "ship-nap", act: "Call it a day", done: "shipped. asleep. thumbs still up.",
    altB: "Muskaan with both arms up, celebrating at her laptop: it deployed.", altA: "Muskaan asleep face-down by her laptop, still giving a thumbs-up." },
];

function HowIShip() {
  const [done, setDone] = useState<boolean[]>([false, false, false, false]);
  const n = done.filter(Boolean).length;
  const flip = (i: number) => setDone(d => d.map((v, j) => (j === i ? !v : v)));
  return (
    <section id="ship" data-section="ship" className="ship-strip" aria-labelledby="ship-title">
      <SecHead id="ship-title" title="How I ship" sub="A day-in-the-life comic by a UX engineer who designs and codes." 
        aside={<span className="label" aria-live="polite">{n}/4 done{n === 4 ? " · shipped ✓" : " · any order"}</span>} />
      <div className="ship-grid">
        {BOXES.map((b, i) => (
          <figure key={b.no} className={`ship-panel ${done[i] ? "is-done" : ""}`}>
            <figcaption className="ship-cap"><b>{b.no}</b><span>{b.time}</span><span className="ship-cap-title">{b.title}</span></figcaption>
            <button className="ship-art" onClick={() => flip(i)} aria-pressed={done[i]} aria-label={done[i] ? `${b.done}. Tap to undo.` : b.act}>
              <img key={String(done[i])} src={art(done[i] ? b.after : b.before)} alt={done[i] ? b.altA : b.altB} className="pop" />
            </button>
            <div className="ship-act">
              {done[i]
                ? <><span className="label">{b.done}</span><button className="ship-undo label" onClick={() => flip(i)} aria-label={`Undo ${b.title}`}>↺</button></>
                : <button className={`ship-btn ${i === 2 ? "deploy" : ""}`} onClick={() => flip(i)}>{b.act}</button>}
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ── The work, hung on a line to dry. Slides in from the side; scroll or use the arrows. ──
function HangingPrints() {
  const track = useRef<HTMLDivElement>(null);
  const seen = useInView(track, true);
  const prints = MISSIONS.map(m => ({ code: PRINT[m.slug].code, label: m.label, meta: `${m.role} · ${m.year}`, result: PRINT[m.slug].result, shot: PRINT[m.slug].shot, href: `#/case/${m.slug}`, external: false }));
  const nudge = (dir: number) => track.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  return (
    <section id="work" data-section="work" className="prints-line" aria-labelledby="prints-title" style={{ scrollMarginTop: 80 }}>
      <SecHead id="prints-title" title="Selected prints"
        sub="Pinned work I can talk about for hours. Scroll sideways, or open one for the full teardown."
        aside={<div style={{ display: "flex", gap: 8 }}>
          <Chamfer onClick={() => nudge(-1)} ariaLabel="Previous prints">← Prev</Chamfer>
          <Chamfer onClick={() => nudge(1)} ariaLabel="More prints">Next →</Chamfer>
        </div>} />
      <div className="line-wrap">
        <svg className="line-wire" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden><path d="M0 8 Q500 34 1000 8" /></svg>
        <div ref={track} className={`line-track ${seen ? "in" : ""}`} role="list">
          {prints.map((p, i) => (
            <a key={p.code} role="listitem" href={p.href} target={p.external ? "_blank" : undefined} rel={p.external ? "noreferrer" : undefined}
              className="hang" style={{ transitionDelay: `${i * 120}ms`, ["--tilt" as string]: `${[-2, 1.5, -1, 2][i % 4]}deg` }}
              aria-label={`${p.label}${p.external ? " (opens Figma)" : " case study"}: ${p.result}`}>
              <span className="peg" aria-hidden />
              <span className="hang-code display">{p.code}</span>
              <span className="display" style={{ fontSize: 24 }}>{p.label}</span>
              <span className="label" style={{ fontSize: 10 }}>{p.meta}</span>
              <img src={p.shot} alt="" aria-hidden loading="lazy" />
              <span className="stamp" style={{ fontSize: 11, alignSelf: "flex-start" }}>{p.result}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── My story: a blueprint timeline — a dimension line across the top, one node per beat, "now" highlighted ──
const STORY: { when: string; title: string; text: string }[] = [
  { when: "2017–21", title: "Wrote code first", text: "Computer science at SRM IST taught me to think in systems and build things that work. I even published a machine-learning paper on predicting crop yields. (My houseplants remain unconvinced.)" },
  { when: "2022–24", title: "Kept fixing the interfaces", text: "Every tool I used, I wanted to redesign. So I went to the University of Michigan for an MSI in Human-Computer Interaction and learned to do it properly." },
  { when: "2023", title: "Learned users > specs", text: "Drivers hunting for parking and seniors who wanted to keep their independence taught me that the best engineering fits how people already live, so well nobody notices it." },
  { when: "2024 → now", title: "Started doing both", text: "At Traxen I design the interface and write the code that ships it. The Figma file and the Kotlin are both mine. The gap between them is where I live." },
];

function MyStory() {
  return (
    <section id="story" data-section="story" className="story-sec" aria-labelledby="story-title">
      <SecHead id="story-title" title="My story" sub="From writing code, to questioning it, to shipping both halves." />
      <div className="tl" aria-hidden>
        <span className="tl-arrow tl-arrow-l" /><span className="tl-line" /><span className="tl-arrow tl-arrow-r" />
        <span className="tl-dim label">2017 ——— 2024 → now</span>
      </div>
      <ol className="tl-beats">
        {STORY.map((b, i) => (
          <li key={b.when} className={i === STORY.length - 1 ? "now" : ""}>
            <span className="tl-node" aria-hidden />
            <span className="tl-when label">{b.when}</span>
            <h3 className="display tl-title">{b.title}</h3>
            <p>{b.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── Tools I use: one table (the old "Parts list" spec table repeated what the side column already says) ──
const TOOLS: [string, string][] = [
  ["Figma", "daily · primary design surface"],
  ["Android Studio · Kotlin", "building the real thing"],
  ["HTML · CSS · JS · Python", "prototypes"],
  ["Penpot · Miro", "mockups · workshops"],
  ["Maze · Dovetail", "user research · usability testing"],
  ["Notion · Atlassian", "keeping it all straight"],
];

function PartsList() {
  return (
    <section id="parts" data-section="parts" className="parts-sec" aria-labelledby="parts-title">
      <SecHead id="parts-title" title="Tools I use" sub="What's on the desk, and what each one is for." />
      <dl className="parts-tools">{TOOLS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </section>
  );
}

// ── Working with AI: a short teaser; the details (and ASCII Hands) live on the Lab page (#/lab) ──
const AI_ROWS: [string, string][] = [
  ["Certified", "Agents and Workflows · OpenAI Academy"],
  ["Learning now", "Model Context Protocol + the Claude API · Claude Academy"],
  ["Built with AI", "ASCII Hands, a globe you steer with your webcam"],
  ["Every day", "Claude Code + Cursor, shipping the Traxen app"],
];

function WorkingWithAI() {
  return (
    <section id="ai" data-section="ai" className="parts-sec" aria-labelledby="ai-title">
      <SecHead id="ai-title" title="Working with AI" sub="I design with it, build with it, and I'm still learning it." />
      <dl className="parts-spec">
        {AI_ROWS.map(([k, v]) => <div key={k}><dt className="label" style={{ color: "var(--accent)" }}>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
        <Chamfer solid onClick={() => go("#/lab")}>Open the Lab →</Chamfer>
      </div>
    </section>
  );
}

// ── Reviews (sort of) + say hi ─────────────────────────────────────────────
function Recommendations() {
  return (
    <section id="reviews" data-section="contact" className="recs" aria-labelledby="recs-title" style={{ scrollMarginTop: 80 }}>
      <SecHead id="recs-title" title="Reviews (sort of)" sub="Unsolicited, unverified, mostly true." />
      <div className="recs-grid">
        {TRANSMISSIONS.map((t, i) => (
          <figure key={t.sender} className="rec" style={{ ["--tilt" as string]: `${[-1.5, 1, -0.8, 1.6][i]}deg` }}>
            <blockquote>{t.text.replace(/^"|"$/g, "")}</blockquote>
            <figcaption className="label">— {t.sender.replace(/_/g, " ").toLowerCase()} · <span style={{ color: "var(--accent)" }}>{t.status.toLowerCase()}</span></figcaption>
          </figure>
        ))}
      </div>
      <WakeHerUp />
    </section>
  );
}

// ── Wake her up: she's asleep (it's 23:00 on the rail). Tap her — first she bargains, then she's up.
// The contact buttons are always there; the interaction is just for fun.
const WAKE = [
  { pose: "wkSleep" as PoseName, say: "z z z", alt: "Muskaan asleep with her head on her folded arms, a loading bar under her" },
  { pose: "wkSleep" as PoseName, say: "five more minutes…", alt: "Muskaan still asleep on her arms, mumbling" },
  { pose: "wkAwake" as PoseName, say: "I'm up! I'm up! What are we building?", alt: "A small Muskaan sprung awake, arms out, eyes wide" },
];

function WakeHerUp() {
  const [step, setStep] = useState(0);
  const w = WAKE[step], awake = step === WAKE.length - 1;
  return (
    <div className="say-hi wake">
      <div>
        <h3 className="display" style={{ fontSize: "clamp(32px, 3.4vw, 48px)", margin: 0 }}>{awake ? "She's up" : "Wake her up"}</h3>
        <p className="hand wake-copy">{awake
          ? "Hiring, building something, or need a fourth for board-game night? Say hi. She replies fast."
          : "It's the end of her day. Tap her to wake her up."}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
          <Chamfer onClick={() => go("#/about")}>Who is she?</Chamfer>
        </div>
      </div>
      <button className="wake-me" onClick={() => setStep(x => (x + 1) % WAKE.length)}
        aria-label={awake ? "She's awake. Tap to let her sleep again." : "Tap to wake her up"}>
        <span className="wake-bubble hand" aria-live="polite">{w.say}</span>
        <span key={step} className="wake-fig pop"><MiniFig pose={w.pose} label={w.alt} /></span>
      </button>
    </div>
  );
}

// ── Rail: a small Muskaan walks down the left rail as you scroll (two-frame walk cycle). ──
const RAIL: Record<string, string> = { top: "09:00 · logging on", ship: "11:00 · shipping", work: "16:00 · showing work", story: "18:00 · backstory", parts: "20:00 · tools", ai: "21:00 · learning", contact: "23:00 · say hi" };

function SideRail() {
  const reduced = useReducedMotion();
  const [sec, setSec] = useState("top");
  const [p, setP] = useState(0);
  const [step, setStep] = useState(0);
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    let stop = 0;
    const on = () => {
      let cur = "top";
      document.querySelectorAll<HTMLElement>(".home-right [data-section]").forEach(el => { if (el.getBoundingClientRect().top < innerHeight * 0.35 && scrollY > 80) cur = el.dataset.section!; });
      setSec(cur);
      const max = document.documentElement.scrollHeight - innerHeight;
      setP(max > 0 ? Math.min(1, scrollY / max) : 0);
      setStep(Math.floor(scrollY / 40) % 2); // a step every 40px scrolled
      setMoving(true); clearTimeout(stop); stop = window.setTimeout(() => setMoving(false), 160);
    };
    on(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); clearTimeout(stop); };
  }, []);
  return (
    <div className="side-rail" aria-hidden>
      <span className="side-rail-line" />
      <div className="side-rail-me" style={{ top: `calc(${p.toFixed(4)} * (100% - 210px))` }}>
        <MiniFig pose={reduced || !moving || step === 0 ? "walkA" : "walkB"} unit={0.62} />
        <span className="label">{RAIL[sec] ?? RAIL.top}</span>
      </div>
    </div>
  );
}

export function ShipHome() {
  return (
    <div className="home-v4">
      <SideRail />
      <SideName />
      <div className="home-right">
        <HowIShip />
        <HangingPrints />
        <MyStory />
        <PartsList />
        <WorkingWithAI />
        <Recommendations />
      </div>
    </div>
  );
}
