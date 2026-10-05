// ABOUT — the person, not the portfolio. A scrapbook after Andrea Da Silva's about page (adasilv2.framer.website):
// her words in one column, her photos and drawings stuck loosely around it (different sizes, overlapping,
// some running off the page), sliding in as you scroll and drifting at different speeds; and hand-made marks
// in the text itself: a circled word, a scribbled-out phrase, an underline, a highlighter pass, a word
// written in by hand. Faint engineering drawings behind every section, like the rest of the site.
// Hello → how I got here → out and about → facts nobody asked for → side hustles → say hi.
import { useEffect, useRef, type ReactNode } from "react";
import { Mini, type PoseName } from "./Minis";
import { Chamfer, SpecTable, useInView } from "./ui";
import { go } from "./nav";
import { PageDrawing } from "./PageDrawings";

/** A real photo, taped in like a polaroid (fact cards and side hustles). */
function Photo({ src, alt, caption, tilt = -2 }: { src: string; alt: string; caption?: string; tilt?: number }) {
  return (
    <figure className="ab-photo" style={{ ["--tilt" as string]: `${tilt}deg` }}>
      <img src={`/about/${src}`} alt={alt} loading="lazy" />
      {caption && <figcaption className="hand">{caption}</figcaption>}
    </figure>
  );
}

// ── the scrapbook pieces ─────────────────────────────────────────────────────
/** one thing stuck on the page. x: % gap from the text column (so it never covers the words; big x spills
 *  off the page edge), y: % down its side column (desktop); w: width in px; r: tilt;
 *  kind: tape = white border + tape, plain = white border, frame = a painting hung as it is (no border),
 *  art = one of her line drawings; speed: how much it drifts against the scroll. */
type Scrap = { src: string; alt: string; w: number; x: number; y: number; r: number; kind?: "tape" | "plain" | "frame" | "art"; speed?: number };

function Piece({ s, i }: { s: Scrap; i: number }) {
  const src = s.kind === "art" ? `/art/${s.src}-white.png` : `/about/${s.src}`;
  return (
    <figure className={`sb-scrap sb-${s.kind ?? "plain"}`} data-speed={s.speed ?? (i % 2 ? .06 : -.05)}
      style={{ ["--x" as string]: `${s.x}%`, ["--y" as string]: `${s.y}%`, ["--w" as string]: `${s.w}px`, ["--r" as string]: `${s.r}deg`, ["--d" as string]: `${i * 110}ms` }}>
      <span className="sb-in"><img src={src} alt={s.alt} loading="lazy" /></span>
    </figure>
  );
}

/** `?still` in the URL: everything already in place, no motion (for screenshots) */
const STILL = typeof location !== "undefined" && new URLSearchParams(location.search).has("still");

/** A spread: her words in the middle, things stuck on both sides. Below 1100px the pieces become one
 *  overlapping collage above the words. */
function Spread({ left, right, h, children, className = "" }: { left: Scrap[]; right: Scrap[]; h: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, true, "0px 0px -12% 0px") || STILL;
  return (
    <div ref={ref} className={`sb-row ${seen ? "in" : ""} ${STILL ? "sb-still" : ""} ${className}`} style={{ ["--h" as string]: `${h}px` }}>
      <div className="sb-side sb-l">{left.map((s, i) => <Piece key={s.src} s={s} i={i} />)}</div>
      <div className="sb-side sb-r">{right.map((s, i) => <Piece key={s.src} s={s} i={i + left.length} />)}</div>
      <div className="sb-text">{children}</div>
    </div>
  );
}

/** pieces drift at their own speed as the page scrolls (Andrea's scroll effects); off for reduced motion */
function useDrift() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = innerHeight;
      document.querySelectorAll<HTMLElement>(".sb-scrap[data-speed]").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.setProperty("--py", `${((r.top + r.height / 2 - vh / 2) * Number(el.dataset.speed)).toFixed(1)}px`);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
}

// hand-made marks in the text; each draws itself in when its spread scrolls into view
const Hl = ({ children }: { children: ReactNode }) => <mark className="sb-hl">{children}</mark>;
const Under = ({ children }: { children: ReactNode }) => <span className="sb-under">{children}</span>;
const Hand = ({ children }: { children: ReactNode }) => <span className="sb-hand hand" aria-hidden>{children}</span>;
const Circle = ({ children }: { children: ReactNode }) => (
  <span className="sb-circle">{children}<svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden><path pathLength={1} d="M54 6 C 22 2, 2 14, 4 32 C 6 52, 40 58, 70 54 C 96 50, 100 30, 92 16 C 84 4, 50 0, 30 8" /></svg></span>
);
const Strike = ({ children }: { children: ReactNode }) => (
  <span className="sb-strike"><s>{children}</s><svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden><path pathLength={1} d="M2 24 C 20 14, 30 30, 50 18 S 80 28, 98 14 M96 22 C 70 30, 40 12, 4 26" /></svg></span>
);

// ── 01 hello ────────────────────────────────────────────────────────────────
const HELLO_L: Scrap[] = [
  { src: "me-bench.webp", alt: "Muskaan smiling on a bench in a scarf and coat, in front of an old timber-framed building.", w: 240, x: 4, y: 0, r: -6, kind: "tape" },
  { src: "michigan.webp", alt: "The atrium of a University of Michigan building, with a giant yellow block M hanging from the glass roof.", w: 230, x: 16, y: 52, r: 5 },
];
const HELLO_R: Scrap[] = [
  { src: "graduation.webp", alt: "Muskaan in a white dress and a maize Michigan stole, tossing her graduation cap in front of a stone university building.", w: 270, x: 6, y: 4, r: 4, kind: "tape" },
  { src: "kit-welcome", alt: "Muskaan laughing and waving hello", w: 210, x: 22, y: 50, r: -3, kind: "art", speed: .1 },
];

function Hello() {
  return (
    <section id="ab-hello" className="sheet ab-hello tx-has-bg" aria-labelledby="ab-title" style={{ minHeight: 0 }}>
      <PageDrawing view="camera" side="right" />
      <div className="rail" aria-hidden><span className="rail-label">About · 01 hello</span><span className="rail-line" /></div>
      <Spread left={HELLO_L} right={HELLO_R} h={640}>
        <p className="label mid">About · sincere. vivid. deliberate.</p>
        <h1 id="ab-title" className="display ab-h1">Hi, I'm <Circle><span className="ab-name">Muskaan</span></Circle>.</h1>
        <p className="ab-lede">I'm a UX engineer: I design the interface, then <Under>build it myself</Under>, so nothing gets lost between the Figma file and the thing people use.</p>
        <blockquote className="ab-philo">
          <span className="label">design philosophy · rev. 1</span>
          <p>Pixel-perfect accessibility: every interface element, a bridge between people, information, and technology.</p>
        </blockquote>
        <div style={{ marginTop: 24 }}>
          <SpecTable caption="Quick facts" rows={[
            ["Based", "USA"],
            ["Day job", "UX / UI Engineer, Traxen"],
            ["Studied", "MSI in HCI, U of Michigan · B.Tech CS, SRM IST"],
            ["Off the clock", "board games, kayaking, stress-baking, drawing, plant crimes"],
          ]} />
        </div>
      </Spread>
    </section>
  );
}

// ── 02 how I got here: her own words (verbatim), with marks and the photos stuck around them ──
const STOPS: { tag: string; title: string; text: ReactNode; h: number; left: Scrap[]; right: Scrap[] }[] = [
  { tag: "start", title: "The rigid logic of code", h: 280,
    text: <>My story began in the rigid logic of <Circle>Computer Science Engineering</Circle>. I learned how systems speak, but I quickly realized I wanted to know <Hl>how they felt to the person using them</Hl>.</>,
    left: [{ src: "face-api-neutral.webp", alt: "A laptop running face-api.js on a webcam feed of Muskaan: face landmarks traced, labelled neutral (0.99).", w: 150, x: 10, y: -12, r: -7, kind: "tape" }],
    right: [{ src: "face-api-happy.webp", alt: "Code in an editor next to the same webcam test, now labelled happy (0.99) as Muskaan smiles.", w: 230, x: 0, y: 34, r: 5 }] },
  { tag: "UX", title: "Learning by doing", h: 290,
    text: <>That curiosity led me to UX and the world of entrepreneurship. I <Circle>co-founded a startup</Circle> because I believed, and still do, that <Hl>the best way to learn is by doing</Hl>.</>,
    left: [{ src: "kit-idea", alt: "Muskaan pointing up at a lightbulb idea", w: 170, x: 26, y: -8, r: 0, kind: "art", speed: .1 }],
    right: [{ src: "expo-ecoroute.webp", alt: "A selfie of Muskaan (in glasses) and two classmates at the UMSI Expo, in front of their EcoRoute poster.", w: 260, x: 10, y: -18, r: 4, kind: "tape" }] },
  { tag: "trenches", title: "In the trenches", h: 260,
    text: <>I spent my time in the trenches: building SaaS platforms, designing for the fitness sector, and <Under>mastering branding</Under> as a way to tell human stories.</>,
    left: [{ src: "coding.webp", alt: "Code open in a dark editor.", w: 250, x: 2, y: 36, r: -4 }],
    right: [{ src: "kit-notetaker", alt: "Muskaan leaning on her desk, chin in hand, taking notes on a clipboard", w: 180, x: 22, y: -4, r: 0, kind: "art", speed: .08 }] },
  { tag: "AR/VR + IoT", title: "The world went 3D", h: 280,
    text: <>I was looking for something deeper than <Strike>a flat screen</Strike><Hand>3D!</Hand>. In AR/VR and IoT I fell in love with the idea that design could be <Hl>an environment you live in</Hl>, not just an interface you touch.</>,
    left: [],
    right: [{ src: "iot-breadboard.webp", alt: "A breadboard wired to a microcontroller and a glowing green LED ring, a small sensor held in a hand.", w: 160, x: 2, y: -14, r: 7, kind: "tape" }] },
  { tag: "now", title: "Automotive", h: 270,
    text: <>Today that obsession with immersive systems has led me to automotive design, where engineering precision, digital immersion and physical movement <Hl>finally converge</Hl>.<Hand>vroom.</Hand></>,
    left: [{ src: "automotive-ux.webp", alt: "A red race car numbered 21 on a rooftop parking deck.", w: 290, x: 0, y: -4, r: -5, kind: "tape" }],
    right: [] },
];

function Journey() {
  return (
    <section id="ab-path" className="sheet tx-has-bg" aria-labelledby="ab-path-title" style={{ minHeight: 0 }}>
      <PageDrawing view="route" side="left" />
      <div className="rail" aria-hidden><span className="rail-label">About · 02 the path</span><span className="rail-line" /></div>
      <div className="sb-head">
        <h2 id="ab-path-title" className="display ab-h2">How I got here</h2>
        <span className="label mid">there is more than meets the eye</span>
      </div>
      {STOPS.map((s, k) => (
        <Spread key={s.tag} left={s.left} right={s.right} h={s.h} className="sb-stop">
          <span className="label mid">{String(k + 1).padStart(2, "0")} · {s.tag}</span>
          <h3 className="display ab-story-title">{s.title}</h3>
          <p>{s.text}</p>
        </Spread>
      ))}
    </section>
  );
}

// ── 03 out and about: travel snapshots on one side, the paintings she saw at MoMA (each hung on its own) on the other
const OUT_L: Scrap[] = [
  { src: "aurora.webp", alt: "Northern lights over a dark building: green near the horizon, rising into pink and red, with stars.", w: 220, x: 4, y: 0, r: -5 },
  { src: "chicago-bean.webp", alt: "The Cloud Gate sculpture in Chicago reflecting skyscrapers and a grey sky, people with umbrellas around it.", w: 270, x: 14, y: 30, r: 4, kind: "tape" },
  { src: "statue-of-liberty.webp", alt: "The Statue of Liberty under a cloudy sky, seen across the water with a small boat passing.", w: 170, x: 6, y: 52, r: -3 },
  { src: "bao.webp", alt: "Three bao buns with glazed chicken and a slaw salad on a long black plate.", w: 180, x: 20, y: 72, r: 6, kind: "tape" },
];
const OUT_R: Scrap[] = [
  { src: "moma-starry-night.webp", alt: "Van Gogh's The Starry Night, in its dark frame, at MoMA.", w: 260, x: 4, y: 2, r: -1.5, kind: "frame" },
  { src: "moma-roulin.webp", alt: "Van Gogh's Portrait of Joseph Roulin, a bearded postman in a blue cap against green swirling flowers, in a gold frame, at MoMA.", w: 160, x: 34, y: 26, r: 3, kind: "frame" },
  { src: "moma-soup-cans.webp", alt: "Warhol's Campbell's Soup Cans at MoMA: small canvases of soup cans hung in rows.", w: 240, x: 0, y: 50, r: -1, kind: "frame" },
  { src: "moma-abstract.webp", alt: "A huge abstract painting of soft orange, pink, yellow and blue blocks, at MoMA.", w: 170, x: 30, y: 72, r: 2, kind: "frame" },
];

function OutAndAbout() {
  return (
    <section id="ab-out" className="sheet ab-out tx-has-bg" aria-labelledby="ab-out-title" style={{ minHeight: 0 }}>
      <PageDrawing view="suitcase" side="right" />
      <div className="rail" aria-hidden><span className="rail-label">About · 03 out and about</span><span className="rail-line" /></div>
      <Spread left={OUT_L} right={OUT_R} h={820}>
        <span className="label mid">places · paintings · plates</span>
        <h2 id="ab-out-title" className="display ab-h2">Out and about</h2>
        <p>When I'm not designing, I'm out <Circle>looking at things</Circle>: the northern lights, Chicago in the rain, New York from the water.</p>
        <p>And museums. At MoMA I got to see the Van Goghs <Hl>in person</Hl>, and a whole wall of soup cans.</p>
        <p>And yes, I photograph my food before I eat it.<Hand>obviously.</Hand></p>
      </Spread>
    </section>
  );
}

// ── 04 facts nobody asked for: each one comes with its photo, no clicking needed ──
const FACTS: { pose: PoseName; title: string; line: string; evidence: string; alt: string; photo: [string, string]; more?: [string, string][] }[] = [
  { pose: "abPlant", title: "Serial plant killer", line: "I research every plant before I buy it. Light, water, soil, the works. They die anyway.", evidence: "Turns out user research doesn't work on succulents.", alt: "A small Muskaan watering a very droopy plant", photo: ["plants.webp", "A shelf of plant pots, most of them suspiciously empty."] },
  { pose: "abDice", title: "Board-game person", line: "Game night is my love language. I will absolutely read the rulebook out loud.", evidence: "I also have notes on the rulebook's information hierarchy.", alt: "A small Muskaan crouched, rolling two dice", photo: ["board-games.webp", "A cupboard stacked with board games."] },
  { pose: "abArt", title: "Illustrator", line: "The big drawings of me on this site are mine. Pen, paper, too many versions of the same bun.", evidence: "Half tiger, half mandala. Ink, no undo.", alt: "A small Muskaan painting at a tiny easel",
    photo: ["ink-tiger.webp", "An ink drawing of a tiger's head: one half fur and stripes, the other half intricate mandala patterns."],
    more: [["ink-wolf.webp", "An ink drawing of a wolf's face splitting into a skull, wrapped in flowers, bones and an arrow."], ["sketching.webp", "A pocket sketchbook with an ink drawing of a whale carrying a tiny astronaut."], ["sketch-2.webp", "An ink drawing of an astronaut in a sketchbook, next to a pair of glasses."]] },
  { pose: "abMovie", title: "Bad-movie connoisseur", line: "Will defend Cats (2019). Unironically.", evidence: "Exhibit A: the State Theatre, my kind of place.", alt: "A small Muskaan with popcorn", photo: ["state-theatre.webp", "The art deco State Theatre at golden hour: a tall red-lettered STATE tower and a marquee of films, under a deep blue sky."] },
  { pose: "abPaddle", title: "Weekend kayaker", line: "Give me a river and a paddle. It's the one place I don't check my phone.", evidence: "Photographic proof, from the back seat of my own kayak.", alt: "A small Muskaan sitting in a kayak with a paddle, grinning", photo: ["kayaking.webp", "Muskaan from behind, in a life vest and cap, paddling a green kayak on a river."] },
];

// no photos of these (yet), so they're told with a sketch instead of evidence
const SKETCHED: { pose: PoseName; title: string; line: string; aside: string; alt: string }[] = [
  { pose: "abBake", title: "Stress-baker", line: "Deadline week smells like cookies. I have strong opinions about mise en place.", aside: "Mise en place is just a design system for your kitchen.", alt: "A small Muskaan whisking a bowl, tongue out in concentration" },
  { pose: "abLabel", title: "Compulsive reorganizer", line: "I reorganize things that were already organized. I call it information architecture.", aside: "Yes, the drawers have labels. Yes, the labels have a naming convention.", alt: "A small Muskaan holding a labelled box, one finger up" },
];

function Facts() {
  return (
    <section id="ab-facts" className="sheet tx-has-bg" aria-labelledby="ab-facts-title" style={{ minHeight: 0 }}>
      <PageDrawing view="desk" side="left" />
      <div className="rail" aria-hidden><span className="rail-label">About · 04 facts</span><span className="rail-line" /></div>
      <div className="ab-head">
        <h2 id="ab-facts-title" className="display ab-h2">Facts nobody asked for</h2>
        <span className="label mid">with photographic evidence</span>
      </div>
      <div className="ab-facts">
        {FACTS.map((f, i) => (
          <article key={f.title} className="ab-fact" style={{ ["--tilt" as string]: `${[-2.6, 1.8, -1.4, 2.4, -1.9][i]}deg`, ["--dy" as string]: `${[0, 22, -8, 14, 28][i]}px` }}>
            <Photo src={f.photo[0]} alt={f.photo[1]} caption={f.evidence} tilt={[-2, 1.6, -1.2, 1.4, -1.6][i]} />
            {f.more && <div className="ab-fact-more">{f.more.map(([src, alt], k) => <img key={src} src={`/about/${src}`} alt={alt} loading="lazy" style={{ ["--t" as string]: `${[-4, 3, -2][k]}deg` }} />)}</div>}
            <div className="ab-fact-head">
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

// ── 05 side hustles: real things from the résumé, told the fun way ─────────
const HUSTLES: { pose: PoseName; art?: string; tag: string; title: string; line: string; proof: string; alt: string; photos?: [string, string, string][] }[] = [
  { pose: "abPitch", tag: "Prize money", title: "Pitch-competition winner",
    line: "Took CommunityConnect, an edtech idea, to two University of Michigan challenges in the same month and won both.",
    proof: "$7,000 · Optimize Challenge  +  $4,000 · Learning Levers (Apr 2023)", alt: "A small Muskaan holding up a giant prize cheque",
    photos: [["optimize-win.webp", "The CommunityConnect team holding a giant $7,000 optiMize cheque.", "the actual giant cheque"]] },
  { pose: "abJuggle", tag: "One summer", title: "Startup speed-runner",
    line: "At Desai Accelerator I designed MVPs for five startups at the same time: healthcare, fitness, e-commerce, and BuyMySpot.",
    proof: "5 startups · 1 summer · 0 dropped balls (mostly)", alt: "A small Muskaan juggling five balls",
    photos: [["desai-accelerator.webp", "The Desai Accelerator summer cohort posing in front of a green plant wall.", "the summer crew"]] },
  { pose: "abVR", art: "kit-vr", tag: "Teaching", title: "VR teacher",
    line: "Graduate Student Instructor for SI 559, Intro to AR/VR. I helped students prototype spatial interfaces in Bezi and Unity.",
    proof: "Jan–Apr 2024 · University of Michigan School of Information", alt: "A small Muskaan wearing a VR headset, reaching into the air",
    photos: [["vr-headset.webp", "Muskaan in a VR headset in a computer lab, controllers in hand.", "testing the lab's headsets"]] },
  { pose: "abCrop", tag: "Published", title: "Accidental agri-tech researcher",
    line: "I published a paper on predicting Indian crop production with machine learning, deployed in Streamlit. I can forecast a harvest. I cannot keep a houseplant alive.",
    proof: "Turkish Journal of Physiotherapy and Rehabilitation · May 2021", alt: "A small Muskaan reading a paper, holding a stalk of wheat" },
];

function SideHustles() {
  return (
    <section id="ab-hustles" className="sheet tx-has-bg" aria-labelledby="ab-hustle-title" style={{ minHeight: 0 }}>
      <PageDrawing view="trophy" side="right" />
      <div className="rail" aria-hidden><span className="rail-label">About · 05 side hustles</span><span className="rail-line" /></div>
      <div className="ab-head">
        <h2 id="ab-hustle-title" className="display ab-h2">Side hustles</h2>
        <span className="label mid">what I do when the day job is done</span>
      </div>
      <div className="ab-hustles">
        {HUSTLES.map((h, i) => (
          <article key={h.title} className="ab-hustle" style={{ ["--tilt" as string]: `${[-1.4, 1.1, 1.6, -1.2][i]}deg` }}>
            <div className="ab-hustle-head">
              <div className="ab-hustle-art">{h.art ? <img src={`/art/${h.art}-white.png`} alt="Muskaan in a VR headset, reaching out to touch a floating cube" /> : <Mini pose={h.pose} label={h.alt} unit={1.35} />}</div>
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
  useDrift();
  return (
    <>
      <Hello />
      <Journey />
      <OutAndAbout />
      <Facts />
      <SideHustles />
    </>
  );
}
