// ABOUT — the person, not the portfolio (after Andrea Da Silva's about page: read it, don't hunt for it).
// Hello (snapshots floating beside it) → how I got here (her story as one column, photos in the
// margin) → facts nobody asked for (each with its photo) → side hustles → say hi.
// Every small her on this page is a different pose (Minis.tsx).
import { useRef } from "react";
import { Mini, type PoseName } from "./Minis";
import { Chamfer, SpecTable, useInView } from "./ui";
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
// A few snapshots simply floating beside the hello (after Andrea Da Silva's about page): nothing to click.
// Different photos from the ones that pop out of the MD logo. Positions are % of the photo area.
const FLOATS: { src: string; alt: string; cap: string; x: number; y: number; r: number; w: number }[] = [
  { src: "me-bench.webp", alt: "Muskaan smiling on a bench in a scarf and coat, in front of an old timber-framed building.", cap: "hi, it's me", x: 4, y: 0, r: -5, w: 52 },
  { src: "graduation.webp", alt: "Muskaan in a white dress and a maize Michigan stole, tossing her graduation cap in front of a stone university building.", cap: "cap toss. Go Blue", x: 44, y: 18, r: 4, w: 52 },
  { src: "michigan.webp", alt: "The atrium of a University of Michigan building, with a giant yellow block M hanging from the glass roof.", cap: "the big M", x: 2, y: 58, r: -3, w: 44 },
];

function Hello() {
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
          <div className="ab-floats">
            {FLOATS.map((p, i) => (
              <figure key={p.src} className="ab-float" style={{ ["--x" as string]: `${p.x}%`, ["--y" as string]: `${p.y}%`, ["--r" as string]: `${p.r}deg`, ["--w" as string]: `${p.w}%`, animationDelay: `${i * -2.1}s` }}>
                <img src={`/about/${p.src}`} alt={p.alt} />
                <figcaption className="hand">{p.cap}</figcaption>
              </figure>
            ))}
            <div className="ab-float-me"><Mini pose="abWave" label="A small Muskaan holding a tablet and waving hello" unit="var(--ab-u)" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 02 how I got here: her own story as one readable column, photos in the margin ──
// (after Andrea Da Silva's about page: no buttons to find it, just scroll and read)
const STOPS: { tag: string; title: string; text: string; mark: string; walk?: boolean; photos?: [string, string, string][] }[] = [
  { tag: "start", title: "The rigid logic of code", mark: "how they felt to the person using them", text: "My story began in the rigid logic of Computer Science Engineering. I learned how systems speak, but I quickly realized I wanted to know how they felt to the person using them.",
    photos: [["face-api-neutral.webp", "A laptop running face-api.js on a webcam feed of Muskaan: face landmarks traced, labelled neutral (0.99).", "face-api.js, reading me: neutral (0.99)"],
      ["face-api-happy.webp", "Code in an editor next to the same webcam test, now labelled happy (0.99) as Muskaan smiles.", "…then: happy (0.99)"]] },
  { tag: "UX", title: "Learning by doing", mark: "the best way to learn is by doing", walk: true, text: "That curiosity led me to UX and the world of entrepreneurship. I co-founded a startup because I believed, and still do, that the best way to learn is by doing." },
  { tag: "trenches", title: "In the trenches", mark: "a way to tell human stories", text: "I spent my time in the trenches: building SaaS platforms, designing for the fitness sector, and mastering branding as a way to tell human stories.",
    photos: [["coding.webp", "Code open in a dark editor.", "building, building, building"]] },
  { tag: "AR/VR + IoT", title: "The world went 3D", mark: "an environment you live in", text: "I was looking for something deeper than a flat screen. In AR/VR and IoT I fell in love with the idea that design could be an environment you live in, not just an interface you touch." },
  { tag: "now", title: "Automotive", mark: "finally converge", text: "Today that obsession with immersive systems has led me to automotive design, where engineering precision, digital immersion and physical movement finally converge.",
    photos: [["automotive-ux.webp", "A red race car numbered 21 on a rooftop parking deck.", "now: automotive UX"]] },
];

/** the text with one phrase marked like a highlighter pass */
function Marked({ text, mark }: { text: string; mark: string }) {
  const i = text.indexOf(mark);
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark className="ab-mark">{mark}</mark>{text.slice(i + mark.length)}</>;
}

function StoryStop({ s, n }: { s: (typeof STOPS)[number]; n: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, true, "0px 0px -15% 0px");
  return (
    <div ref={ref} className={`ab-story-row ${seen ? "in" : ""}`}>
      <div className="ab-story-text">
        <span className="label mid">{String(n).padStart(2, "0")} · {s.tag}</span>
        <h3 className="display ab-story-title">{s.title}</h3>
        <p><Marked text={s.text} mark={s.mark} /></p>
      </div>
      <div className="ab-story-side">
        {s.photos && s.photos.map(([src, alt, cap], k) => <Photo key={src} src={src} alt={alt} caption={cap} tilt={k ? 3 : -2.4} />)}
        {s.walk && <div className="ab-story-walk"><Mini pose="abTrek" label="A small Muskaan walking with a backpack" unit={1.3} /></div>}
      </div>
    </div>
  );
}

function Journey() {
  return (
    <section className="sheet" aria-labelledby="ab-path-title" style={{ minHeight: 0 }}>
      <div className="rail" aria-hidden><span className="rail-label">About · 02 the path</span><span className="rail-line" /></div>
      <div className="ab-head">
        <h2 id="ab-path-title" className="display ab-h2">How I got here</h2>
        <span className="label mid">there is more than meets the eye</span>
      </div>
      <div className="ab-story-col">
        {STOPS.map((s, k) => <StoryStop key={s.tag} s={s} n={k + 1} />)}
      </div>
    </section>
  );
}

// ── 03 facts nobody asked for: each one comes with its photo, no clicking needed ──
const FACTS: { pose: PoseName; title: string; line: string; evidence: string; alt: string; photo: [string, string]; more?: [string, string][] }[] = [
  { pose: "abPlant", title: "Serial plant killer", line: "I research every plant before I buy it. Light, water, soil, the works. They die anyway.", evidence: "Turns out user research doesn't work on succulents.", alt: "A small Muskaan watering a very droopy plant", photo: ["plants.webp", "A shelf of plant pots, most of them suspiciously empty."] },
  { pose: "abDice", title: "Board-game person", line: "Game night is my love language. I will absolutely read the rulebook out loud.", evidence: "I also have notes on the rulebook's information hierarchy.", alt: "A small Muskaan crouched, rolling two dice", photo: ["board-games.webp", "A cupboard stacked with board games."] },
  { pose: "abArt", title: "Illustrator", line: "The big drawings of me on this site are mine. Pen, paper, too many versions of the same bun.", evidence: "Half tiger, half mandala. Ink, no undo.", alt: "A small Muskaan painting at a tiny easel",
    photo: ["ink-tiger.webp", "An ink drawing of a tiger's head: one half fur and stripes, the other half intricate mandala patterns."],
    more: [["ink-wolf.webp", "An ink drawing of a wolf's face splitting into a skull, wrapped in flowers, bones and an arrow."], ["sketching.webp", "A pocket sketchbook with an ink drawing of a whale carrying a tiny astronaut."], ["sketch-2.webp", "An ink drawing of an astronaut in a sketchbook, next to a pair of glasses."]] },
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
          <article key={f.title} className="ab-fact" style={{ ["--tilt" as string]: `${[-1.2, 0.8, -0.6, 1][i]}deg` }}>
            <Photo src={f.photo[0]} alt={f.photo[1]} caption={f.evidence} tilt={[-2, 1.6, -1.2, 1.4][i]} />
            {f.more && <div className="ab-fact-more">{f.more.map(([src, alt], k) => <img key={src} src={`/about/${src}`} alt={alt} loading="lazy" style={{ ["--t" as string]: `${[-4, 3, -2][k]}deg` }} />)}</div>}
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
