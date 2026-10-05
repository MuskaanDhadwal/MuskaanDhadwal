// ABOUT — the person, not the portfolio. Hello (a wall of her snapshots) → how I got here (her own story,
// a little her walks it) → facts nobody asked for (each with its photo) → side hustles → say hi.
// Every small her on this page is a different pose (Minis.tsx).
import { useCallback, useEffect, useRef, useState } from "react";
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
// A wall of her snapshots that fly out of the MD logo when the page opens (the logo leads here, after
// Andrea Da Silva's site; on About, clicking MD replays it via the "md-snaps" event). Tap a photo to bring
// it to the front. Positions are % of the wall.
type P2 = [number, number];
const SNAPS: { src: string; alt: string; cap: string; x: number; y: number; r: number }[] = [
  { src: "me-bench.webp", alt: "Muskaan smiling on a bench in a scarf and coat, in front of an old timber-framed building.", cap: "hi, it's me", x: 0, y: 3, r: -6 },
  { src: "graduation.webp", alt: "Muskaan in a white dress and a maize Michigan stole, tossing her graduation cap in front of a stone university building.", cap: "cap toss. Go Blue", x: 50, y: 0, r: 5 },
  { src: "coding.webp", alt: "Code open in a dark editor.", cap: "where it started: code", x: 5, y: 50, r: 4 },
  { src: "automotive-ux.webp", alt: "A red race car numbered 21 on a rooftop parking deck.", cap: "now: automotive UX", x: 50, y: 47, r: -4 },
];

function Hello() {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState<number | null>(null);
  const [from, setFrom] = useState<P2[]>([]);
  const wall = useRef<HTMLDivElement>(null);
  const play = useCallback(() => { // start each photo on top of the MD logo, then let it fly to its spot
    setOpen(false); setTop(null);
    const logo = document.querySelector(".logo-stamp")?.getBoundingClientRect(), w = wall.current;
    if (logo && w) {
      const r = w.getBoundingClientRect();
      setFrom([...w.querySelectorAll<HTMLElement>(".ab-wsnap")].map(el => [
        logo.left + logo.width / 2 - (r.left + el.offsetLeft + el.offsetWidth / 2),
        logo.top + logo.height / 2 - (r.top + el.offsetTop + el.offsetHeight / 2)]));
    }
    setTimeout(() => setOpen(true), 40); // after the reset has painted
  }, []);
  useEffect(() => {
    const id = setTimeout(play, 160);
    addEventListener("md-snaps", play);
    return () => { clearTimeout(id); removeEventListener("md-snaps", play); };
  }, [play]);
  return (
    <section className="sheet ab-hello" aria-labelledby="ab-title" style={{ minHeight: "min(86vh, 760px)" }}>
      <div className="rail" aria-hidden><span className="rail-label">About · 01 hello</span><span className="rail-line" /></div>
      <div className="ab-hello-grid">
        <div>
          <p className="label mid">About · sincere. vivid. deliberate.</p>
          <h1 id="ab-title" className="display ab-h1">Hi, I'm <span className="ab-name">Muskaan</span>.</h1>
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
          <div ref={wall} className={`ab-wall ${open ? "open" : ""}`} role="group" aria-label="Snapshots of Muskaan">
            {SNAPS.map((p, i) => (
              <button key={p.src} className={`ab-wsnap ${top === i ? "top" : ""}`} onClick={() => setTop(t => (t === i ? null : i))} aria-pressed={top === i}
                style={{ ["--x" as string]: `${p.x}%`, ["--y" as string]: `${p.y}%`, ["--r" as string]: `${p.r}deg`, ["--fx" as string]: `${from[i]?.[0] ?? 0}px`, ["--fy" as string]: `${from[i]?.[1] ?? -40}px`, transitionDelay: open && top === null ? `${i * 110}ms` : "0ms" }}>
                <img src={`/about/${p.src}`} alt={p.alt} />
                <span className="hand">{p.cap}</span>
              </button>
            ))}
          </div>
          <div className="ab-hello-wave">
            <span className="ab-bubble hand">hello! you found the fun page.</span>
            <Mini pose="abWave" label="A small Muskaan holding a tablet and waving hello" unit="var(--ab-u)" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 02 how I got here: her own story, one stop at a time, a small her walks the path ──
const STOPS: { tag: string; title: string; text: string; photos?: [string, string, string][] }[] = [
  { tag: "start", title: "The rigid logic of code", text: "My story began in the rigid logic of Computer Science Engineering. I learned how systems speak, but I quickly realized I wanted to know how they felt to the person using them.",
    photos: [["face-api-neutral.webp", "A laptop running face-api.js on a webcam feed of Muskaan: face landmarks traced, labelled neutral (0.99).", "face-api.js, reading me: neutral (0.99)"],
      ["face-api-happy.webp", "Code in an editor next to the same webcam test, now labelled happy (0.99) as Muskaan smiles.", "…then: happy (0.99)"]] },
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
      <div className="ab-beat-row">
        <div className="ab-beat" aria-live="polite">
          <span className="label">{String(i + 1).padStart(2, "0")} / 05 · {s.tag}</span>
          <span className="display" style={{ fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.05 }}>{s.title}</span>
          <p style={{ margin: 0 }}>{s.text}</p>
        </div>
        {s.photos && <div className="ab-photos" key={s.tag}>{s.photos.map(([src, alt, cap], k) => <Photo key={src} src={src} alt={alt} caption={cap} tilt={k ? 2.4 : -2} />)}</div>}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Chamfer onClick={() => setI(v => Math.max(0, v - 1))} ariaLabel="Previous stop">←</Chamfer>
        <Chamfer onClick={() => setI(v => Math.min(STOPS.length - 1, v + 1))} ariaLabel="Next stop">→</Chamfer>
      </div>
    </section>
  );
}

// ── 03 facts nobody asked for: each one comes with its photo, no clicking needed ──
const FACTS: { pose: PoseName; title: string; line: string; evidence: string; alt: string; photo: [string, string] }[] = [
  { pose: "abPlant", title: "Serial plant killer", line: "I research every plant before I buy it. Light, water, soil, the works. They die anyway.", evidence: "Turns out user research doesn't work on succulents.", alt: "A small Muskaan watering a very droopy plant", photo: ["plants.webp", "A shelf of plant pots, most of them suspiciously empty."] },
  { pose: "abDice", title: "Board-game person", line: "Game night is my love language. I will absolutely read the rulebook out loud.", evidence: "I also have notes on the rulebook's information hierarchy.", alt: "A small Muskaan crouched, rolling two dice", photo: ["board-games.webp", "A cupboard stacked with board games."] },
  { pose: "abPaddle", title: "Weekend kayaker", line: "Give me a river and a paddle. It's the one place I don't check my phone.", evidence: "Photographic proof, from the back seat of my own kayak.", alt: "A small Muskaan sitting in a kayak with a paddle, grinning", photo: ["kayaking.webp", "Muskaan from behind, in a life vest and cap, paddling a green kayak on a river."] },
];

// no photos of these (yet), so they're told with a sketch instead of evidence
const SKETCHED: { pose: PoseName; title: string; line: string; aside: string; alt: string }[] = [
  { pose: "abBake", title: "Stress-baker", line: "Deadline week smells like cookies. I have strong opinions about mise en place.", aside: "Mise en place is just a design system for your kitchen.", alt: "A small Muskaan whisking a bowl, tongue out in concentration" },
  { pose: "abLabel", title: "Compulsive reorganizer", line: "I reorganize things that were already organized. I call it information architecture.", aside: "Yes, the drawers have labels. Yes, the labels have a naming convention.", alt: "A small Muskaan holding a labelled box, one finger up" },
  { pose: "abMovie", title: "Bad-movie connoisseur", line: "Will defend Cats (2019). Unironically.", aside: "Taking recommendations. The worse, the better.", alt: "A small Muskaan sitting cross-legged with popcorn, wide-eyed at a screen" },
];

function Facts() {
  return (
    <section className="sheet" aria-labelledby="ab-facts-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">About · 03 facts</span><span className="rail-line" /></div>
      <div className="ab-head">
        <h2 id="ab-facts-title" className="display ab-h2">Facts nobody asked for</h2>
        <span className="label mid">with photographic evidence</span>
      </div>
      <div className="ab-facts">
        {FACTS.map((f, i) => (
          <article key={f.title} className="ab-fact" style={{ ["--tilt" as string]: `${[-1.2, 0.8, -0.6][i]}deg` }}>
            <Photo src={f.photo[0]} alt={f.photo[1]} caption={f.evidence} tilt={[-2, 1.6, -1.2][i]} />
            <div className="ab-fact-head">
              <span className="ab-fact-art"><Mini pose={f.pose} label={f.alt} unit={1} /></span>
              <h3 className="display ab-fact-title">{f.title}</h3>
            </div>
            <p className="ab-fact-line">{f.line}</p>
          </article>
        ))}
      </div>
      <div className="ab-more">
        <span className="label mid">also true · sketched from memory</span>
        <ul className="ab-more-list">
          {SKETCHED.map(f => (
            <li key={f.title} className="ab-more-item">
              <span className="ab-more-art"><Mini pose={f.pose} label={f.alt} unit={1} /></span>
              <span>
                <span className="display ab-more-title">{f.title}</span>
                <span className="ab-more-line">{f.line}</span>
                <span className="hand ab-more-aside">{f.aside}</span>
              </span>
            </li>
          ))}
        </ul>
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
    photos: [["ink-tiger.webp", "An ink drawing of a tiger's head: one half fur and stripes, the other half intricate mandala patterns.", "half tiger, half mandala"], ["ink-wolf.webp", "An ink drawing of a wolf's face splitting into a skull, wrapped in flowers, bones and an arrow.", "wolf, skull, flowers"],
      ["sketching.webp", "A pocket sketchbook with an ink drawing of a whale carrying a tiny astronaut.", "pocket sketchbook"], ["sketch-2.webp", "An ink drawing of an astronaut in a sketchbook, next to a pair of glasses.", "ink, glasses for scale"]] },
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
