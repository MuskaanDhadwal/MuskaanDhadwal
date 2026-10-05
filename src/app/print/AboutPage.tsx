// ABOUT — the person, not the portfolio. Hello (tap the name for snaps) → how I got here (her own story,
// a little her walks it) → facts nobody asked for → side hustles → say hi.
// Every small her on this page is a different pose (Minis.tsx).
import { useEffect, useRef, useState } from "react";
import { Mini, type PoseName } from "./Minis";
import { Chamfer, SpecTable, useInView, useReducedMotion } from "./ui";
import { go } from "./nav";

/** A real photo, taped in like a polaroid. */
function Photo({ src, alt, caption, tilt = -2 }: { src: string; alt: string; caption?: string; tilt?: number }) {
  return (
    <figure className="ab-photo" style={{ ["--tilt" as string]: `${tilt}deg` }}>
      <img src={`/about/${src}`} alt={alt} loading="lazy" />
      {caption && <figcaption className="hand">{caption}</figcaption>}
    </figure>
  );
}

// ── 01 hello ────────────────────────────────────────────────────────────────
// Tap her name and a few snapshots fan out of it (after Andrea Da Silva's about page). Add more by adding
// photos to public/about/ and a row here; positions are px from the name at desktop size (scaled on phones).
const SNAPS: { src: string; alt: string; cap: string; x: number; y: number; r: number }[] = [
  { src: "me-bench.webp", alt: "Muskaan smiling on a bench in a scarf and coat, in front of an old timber-framed building.", cap: "hi, it's me", x: -60, y: 0, r: -7 },
  { src: "coding.webp", alt: "Code open in a dark editor.", cap: "where it started: code", x: 100, y: 46, r: 4 },
  { src: "michigan.webp", alt: "The atrium of a University of Michigan building, with a giant yellow block M hanging from the glass roof.", cap: "Go Blue", x: 250, y: -6, r: -3 },
  { src: "automotive-ux.webp", alt: "A red race car numbered 21 on a rooftop parking deck.", cap: "now: automotive UX", x: 400, y: 40, r: 6 },
];

function Hello() {
  const [snap, setSnap] = useState(false);
  useEffect(() => {
    if (!snap) return;
    const on = (e: KeyboardEvent) => { if (e.key === "Escape") setSnap(false); };
    addEventListener("keydown", on); return () => removeEventListener("keydown", on);
  }, [snap]);
  return (
    <section className="sheet ab-hello" aria-labelledby="ab-title" style={{ minHeight: "min(86vh, 760px)" }}>
      <div className="rail" aria-hidden><span className="rail-label">About · 01 hello</span><span className="rail-line" /></div>
      <div className="ab-hello-grid">
        <div>
          <p className="label mid">About · sincere. vivid. deliberate.</p>
          <h1 id="ab-title" className="display ab-h1">Hi, I'm{" "}
            <button className={`ab-name ${snap ? "on" : ""}`} onClick={() => setSnap(v => !v)} aria-expanded={snap} aria-controls="ab-snaps">
              Muskaan<span className="ab-name-hint label" aria-hidden>{snap ? "tap to tidy up" : "tap me"}</span>
            </button>.</h1>
          <div id="ab-snaps" className={`ab-snaps ${snap ? "open" : ""}`} aria-hidden={!snap}>
            {SNAPS.map((p, i) => (
              <figure key={p.src} className="ab-snap" onClick={() => setSnap(false)}
                style={{ ["--x" as string]: `${p.x}px`, ["--y" as string]: `${p.y}px`, ["--r" as string]: `${p.r}deg`, transitionDelay: snap ? `${i * 70}ms` : "0ms" }}>
                <img src={`/about/${p.src}`} alt={snap ? p.alt : ""} loading="lazy" />
                <figcaption className="hand">{p.cap}</figcaption>
              </figure>
            ))}
          </div>
          <p className="ab-lede">I'm a UX engineer: I design the interface, then build it myself, so nothing gets lost between the Figma file and the thing people use.</p>
          <blockquote className="ab-philo">
            <span className="label">design philosophy · rev. 1</span>
            <p>Pixel-perfect accessibility: every interface element, a bridge between people, information, and technology.</p>
          </blockquote>
          <div style={{ maxWidth: 560, marginTop: 24 }}>
            <SpecTable caption="Quick facts" rows={[
              ["Based", "Ann Arbor, Michigan"],
              ["Day job", "UX / UI Engineer, Traxen"],
              ["Studied", "MSI in HCI, U of Michigan · B.Tech CS, SRM IST"],
              ["Off the clock", "board games, kayaking, stress-baking, drawing, plant crimes"],
            ]} />
          </div>
        </div>
        <div className="ab-hello-me">
          <span className="ab-bubble hand">hello! you found the fun page.</span>
          <Mini pose="abWave" label="A small Muskaan waving hello" unit="var(--ab-u)" />
        </div>
      </div>
    </section>
  );
}

// ── 02 how I got here: her own story, one stop at a time, a small her walks the path ──
const STOPS: { tag: string; title: string; text: string }[] = [
  { tag: "start", title: "The rigid logic of code", text: "My story began in the rigid logic of Computer Science Engineering. I learned how systems speak, but I quickly realized I wanted to know how they felt to the person using them." },
  { tag: "UX", title: "Learning by doing", text: "That curiosity led me to UX and the world of entrepreneurship. I co-founded a startup because I believed, and still do, that the best way to learn is by doing." },
  { tag: "trenches", title: "In the trenches", text: "I spent my time in the trenches: building SaaS platforms, designing for the fitness sector, and mastering branding as a way to tell human stories." },
  { tag: "AR/VR + IoT", title: "The world went 3D", text: "I was looking for something deeper than a flat screen. In AR/VR and IoT I fell in love with the idea that design could be an environment you live in, not just an interface you touch." },
  { tag: "now", title: "Automotive", text: "Today that obsession with immersive systems has led me to automotive design, where engineering precision, digital immersion and physical movement finally converge." },
];
function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, true);
  const [i, setI] = useState(0);
  useEffect(() => { // the first time it scrolls into view, walk the whole path once
    if (!seen || reduced) return;
    let n = 0; const id = setInterval(() => { n++; setI(n); if (n >= STOPS.length - 1) clearInterval(id); }, 1500);
    return () => clearInterval(id);
  }, [seen, reduced]);
  const xs = [8, 29, 50, 71, 92];
  const s = STOPS[i];
  return (
    <section className="sheet" aria-labelledby="ab-path-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">About · 02 the path</span><span className="rail-line" /></div>
      <div className="ab-head">
        <h2 id="ab-path-title" className="display ab-h2">How I got here</h2>
        <span className="label mid">there is more than meets the eye · five stops</span>
      </div>
      <div ref={ref} className="ab-path">
        <svg className="ab-path-line" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden><path d="M0 16 C20 4 30 18 50 10 S80 4 100 12" /></svg>
        <div className="ab-walker" style={{ left: `${xs[i]}%` }} aria-hidden><Mini pose="abTrek" unit={1.2} /></div>
        <ol className="ab-stops">
          {STOPS.map((b, k) => (
            <li key={b.tag} style={{ left: `${xs[k]}%` }}>
              <button className={`ab-stop ${k === i ? "on" : ""} ${k < i ? "past" : ""}`} onClick={() => setI(k)} aria-current={k === i ? "step" : undefined}>
                <span className="label">{b.tag}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="ab-beat" aria-live="polite">
        <span className="label">{String(i + 1).padStart(2, "0")} / 05 · {s.tag}</span>
        <span className="display" style={{ fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.05 }}>{s.title}</span>
        <p style={{ margin: 0 }}>{s.text}</p>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Chamfer onClick={() => setI(v => Math.max(0, v - 1))} ariaLabel="Previous stop">←</Chamfer>
        <Chamfer onClick={() => setI(v => Math.min(STOPS.length - 1, v + 1))} ariaLabel="Next stop">→</Chamfer>
      </div>
    </section>
  );
}

// ── 03 facts nobody asked for ──────────────────────────────────────────────
const FACTS: { pose: PoseName; title: string; line: string; evidence: string; alt: string; photo?: [string, string] }[] = [
  { pose: "abPlant", title: "Serial plant killer", line: "I research every plant before I buy it. Light, water, soil, the works. They die anyway.", evidence: "Turns out user research doesn't work on succulents.", alt: "A small Muskaan holding a very droopy plant, looking guilty", photo: ["plants.webp", "A shelf of plant pots, most of them suspiciously empty."] },
  { pose: "abDice", title: "Board-game person", line: "Game night is my love language. I will absolutely read the rulebook out loud.", evidence: "I also have notes on the rulebook's information hierarchy.", alt: "A small Muskaan rolling two dice", photo: ["board-games.webp", "A cupboard stacked with board games."] },
  { pose: "abBake", title: "Stress-baker", line: "Deadline week smells like cookies. I have strong opinions about mise en place.", evidence: "Mise en place is just a design system for your kitchen.", alt: "A small Muskaan whisking a bowl, tongue out in concentration" },
  { pose: "abLabel", title: "Compulsive reorganizer", line: "I reorganize things that were already organized. I call it information architecture.", evidence: "Yes, the drawers have labels. Yes, the labels have a naming convention.", alt: "A small Muskaan labelling a cardboard box" },
  { pose: "abPaddle", title: "Weekend kayaker", line: "Give me a river and a paddle. It's the one place I don't check my phone.", evidence: "Photographic proof, from the back seat of my own kayak.", alt: "A small Muskaan holding a kayak paddle, grinning", photo: ["kayaking.webp", "Muskaan from behind, in a life vest and cap, paddling a green kayak on a river."] },
  { pose: "abMovie", title: "Bad-movie connoisseur", line: "Will defend Cats (2019). Unironically.", evidence: "Taking recommendations. The worse, the better.", alt: "A small Muskaan sitting with popcorn, wide-eyed at a screen" },
];

function Facts() {
  const [open, setOpen] = useState<boolean[]>(FACTS.map(() => false));
  const n = open.filter(Boolean).length;
  return (
    <section className="sheet" aria-labelledby="ab-facts-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">About · 03 facts</span><span className="rail-line" /></div>
      <div className="ab-head">
        <h2 id="ab-facts-title" className="display ab-h2">Facts nobody asked for</h2>
        <span className="label" aria-live="polite">{n}/{FACTS.length} pieces of evidence found{n === FACTS.length ? " · case closed ✓" : " · tap a card"}</span>
      </div>
      <div className="ab-facts">
        {FACTS.map((f, i) => (
          <button key={f.title} className={`ab-fact ${open[i] ? "open" : ""}`} aria-expanded={open[i]} onClick={() => setOpen(o => o.map((v, j) => (j === i ? !v : v)))}
            style={{ ["--tilt" as string]: `${[-1.2, 0.8, -0.6, 1.1, -0.9, 0.7][i]}deg` }}>
            <span className="ab-fact-art"><Mini pose={f.pose} label={f.alt} unit={1.25} /></span>
            <span className="display ab-fact-title">{f.title}</span>
            <span className="ab-fact-line">{f.line}</span>
            <span className="ab-fact-ev">{open[i] ? <><b className="label">Evidence:</b> <span className="hand">{f.evidence}</span></> : <span className="label">tap for evidence ↓</span>}</span>
            {open[i] && f.photo && <img className="ab-fact-photo" src={`/about/${f.photo[0]}`} alt={f.photo[1]} loading="lazy" />}
          </button>
        ))}
      </div>
    </section>
  );
}

// ── 04 side hustles: real things from the résumé, told the fun way ─────────
const HUSTLES: { pose: PoseName; tag: string; title: string; line: string; proof: string; alt: string; photos?: [string, string, string][] }[] = [
  { pose: "abPitch", tag: "Prize money", title: "Pitch-competition winner",
    line: "Took CommunityConnect, an edtech idea, to two University of Michigan challenges in the same month and won both.",
    proof: "$7,000 · Optimize Challenge  +  $4,000 · Learning Levers (Apr 2023)", alt: "A small Muskaan holding up a giant prize cheque",
    photos: [["optimize-win.webp", "The CommunityConnect team holding a giant $7,000 optiMize cheque.", "the actual giant cheque"]] },
  { pose: "abJuggle", tag: "One summer", title: "Startup speed-runner",
    line: "At Desai Accelerator I designed MVPs for five startups at the same time: healthcare, fitness, e-commerce, and BuyMySpot.",
    proof: "5 startups · 1 summer · 0 dropped balls (mostly)", alt: "A small Muskaan juggling five balls",
    photos: [["desai-accelerator.webp", "The Desai Accelerator summer cohort posing in front of a green plant wall.", "the summer crew"]] },
  { pose: "abVR", tag: "Teaching", title: "VR teacher",
    line: "Graduate Student Instructor for SI 559, Intro to AR/VR. I helped students prototype spatial interfaces in Bezi and Unity.",
    proof: "Jan–Apr 2024 · University of Michigan School of Information", alt: "A small Muskaan wearing a VR headset, reaching into the air",
    photos: [["vr-headset.webp", "Muskaan in a VR headset in a computer lab, controllers in hand.", "testing the lab's headsets"]] },
  { pose: "abCrop", tag: "Published", title: "Accidental agri-tech researcher",
    line: "I published a paper on predicting Indian crop production with machine learning, deployed in Streamlit. I can forecast a harvest. I cannot keep a houseplant alive.",
    proof: "Turkish Journal of Physiotherapy and Rehabilitation · May 2021", alt: "A small Muskaan reading a paper, holding a stalk of wheat" },
  { pose: "abArt", tag: "Sketchbook", title: "Illustrator",
    line: "The big drawings of me on this site are mine. Pen, paper, too many versions of the same bun.",
    proof: "see: every box on the homepage", alt: "A small Muskaan painting at a tiny easel",
    photos: [["sketching.webp", "A pocket sketchbook with an ink drawing of a whale carrying a tiny astronaut.", "pocket sketchbook"], ["sketch-2.webp", "An ink drawing of an astronaut in a sketchbook, next to a pair of glasses.", "ink, glasses for scale"]] },
];

function SideHustles() {
  return (
    <section className="sheet" aria-labelledby="ab-hustle-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">About · 04 side hustles</span><span className="rail-line" /></div>
      <div className="ab-head">
        <h2 id="ab-hustle-title" className="display ab-h2">Side hustles</h2>
        <span className="label mid">what I do when the day job is done</span>
      </div>
      <div className="ab-hustles">
        {HUSTLES.map((h, i) => (
          <article key={h.title} className="ab-hustle">
            <div className="ab-hustle-head">
              <div className="ab-hustle-art"><Mini pose={h.pose} label={h.alt} unit={1.35} /></div>
              <div>
                <span className="label mid">0{i + 1} · {h.tag}</span>
                <h3 className="display ab-h3">{h.title}</h3>
              </div>
            </div>
            <p>{h.line}</p>
            {h.photos && <div className="ab-photos">{h.photos.map(([src, alt, cap], k) => <Photo key={src} src={src} alt={alt} caption={cap} tilt={k % 2 ? 2.2 : -1.8} />)}</div>}
            <p className="ab-proof label">{h.proof}</p>
          </article>
        ))}
      </div>
      <div className="ab-end">
        <h2 className="display ab-h2">Now you know too much.</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
          <Chamfer onClick={() => go("#/work")}>See the work</Chamfer>
        </div>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <>
      <Hello />
      <Journey />
      <Facts />
      <SideHustles />
    </>
  );
}
