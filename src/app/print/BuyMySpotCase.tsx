// BUYMYSPOT — the full case study, told as drawing sheets like Traxen.
// Sources: Muskaan's own case study (muskaandhadwal.com/copy-of-ui-ux-case-study-1), a teammate's write-up of
// the same project, the team's Figma file (Webapp Buyer side) and her research boards.
// Her calls: no teammates named, no numbers from her résumé (no +60% / +84%).
// Pattern on every sheet: broken down (a blueprint diagram) → live (the real screens) → comic (a small her).
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mini } from "./Minis";
import { Chamfer, Dim, SpecTable, useInView, useReducedMotion } from "./ui";
import { Band, Feature, LoopCard, Say, Shot } from "./TraxenCase";
import { go } from "./nav";
import { Lightbox } from "./Lightbox";

const A = (f: string) => `/case-studies/buymyspot/v2/${f}`;
type Box = [number, number, number, number]; // x, y, w, h in % of the screen

// ── building blocks ─────────────────────────────────────────────────────────
/** A real desktop screen in a thin browser frame; optional highlight boxes drawn on top. */
function Browser({ src, alt, boxes = [], children, caption }: { src: string; alt: string; boxes?: Box[]; children?: ReactNode; caption?: string }) {
  return (
    <figure className="bm-browser">
      <div className="bm-browser-bar" aria-hidden><i /><i /><i /><span>buymyspot.com</span></div>
      <div className="bm-browser-screen">
        <img src={src} alt={alt} loading="lazy" />
        {boxes.map((b, i) => <span key={i} className="bm-hi" style={{ left: `${b[0]}%`, top: `${b[1]}%`, width: `${b[2]}%`, height: `${b[3]}%` }} aria-hidden />)}
        {children}
      </div>
      {caption && <figcaption className="label">{caption}</figcaption>}
    </figure>
  );
}

/** A phone. Long screens scroll inside it, like the real thing. */
function Phone({ src, alt, caption, scroll }: { src: string; alt: string; caption?: string; scroll?: boolean }) {
  return (
    <figure className="bm-phone">
      <div className={`bm-phone-body ${scroll ? "scroll" : ""}`} tabIndex={scroll ? 0 : undefined} aria-label={scroll ? `${alt} (scrollable)` : undefined}>
        <img src={src} alt={alt} loading="lazy" />
      </div>
      {caption && <figcaption className="label">{caption}{scroll && <span className="mid"> · scroll inside ↕</span>}</figcaption>}
    </figure>
  );
}

/** Chip row used by every interactive band. */
function Chips<T extends string | number>({ items, value, onPick, label }: { items: [T, string][]; value: T; onPick: (v: T) => void; label: string }) {
  return (
    <div className="tx-toggle" role="group" aria-label={label}>
      {items.map(([k, l]) => <button key={String(k)} className={`ct-chip ${value === k ? "on" : ""}`} aria-pressed={value === k} onClick={() => onPick(k)}>{l}</button>)}
    </div>
  );
}

// ── 01 OVERVIEW ─────────────────────────────────────────────────────────────
// Role / team / timeline / tools live in the hero's spec table only (not repeated here).
export function BmOverview() {
  return (
    <>
      <p className="tx-lede">Finding a parking spot should be as simple as booking an Airbnb.</p>
      <p>BuyMySpot is a peer-to-peer parking marketplace in Ann Arbor: people with an empty driveway, lot or garage spot lease it to people who need one. During my summer at the Desai Accelerator, the founders asked us to design the buyer side of their web app. Their four asks, and what we designed for each, are in 01.2.</p>
    </>
  );
}

/** The real screens, auto-playing like a screen recording (a cursor finds each hotspot and clicks), with the
 *  phone showing the same step on mobile. Click the highlighted box to drive it yourself. Pauses off screen
 *  and for reduced motion. */
function AutoDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const on = useInView(ref);
  const [play, setPlay] = useState(!reduced);
  const [s, setS] = useState(0); // PROTO.length = "reserved" end card
  const [phase, setPhase] = useState<"start" | "move" | "click">("start");
  const n = PROTO.length;
  const running = play && on && !reduced && s < n;
  useEffect(() => {
    if (!running) return;
    setPhase("start");
    const t1 = setTimeout(() => setPhase("move"), 60);
    const t2 = setTimeout(() => setPhase("click"), 1500);
    const t3 = setTimeout(() => setS(v => (v + 1) % n), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [s, running, n]);
  const done = s >= n;
  const scr = PROTO[Math.min(s, n - 1)];
  const hot = scr.hot ?? [50, 50, 0, 0];
  const at = phase === "start" || !play ? [hot[0] + hot[2] / 2, hot[1] + hot[3] / 2 + 18] : [hot[0] + hot[2] / 2, hot[1] + hot[3] / 2];
  const drive = () => { setPlay(false); setS(v => v + 1); };
  return (
    <div ref={ref} className="bm-duo">
      <figure className="bm-browser bm-demo">
        <div className="bm-browser-bar" aria-hidden><i /><i /><i /><span>buymyspot.com</span></div>
        <div className="bm-browser-screen">
          {PROTO.map((x, k) => <img key={x.src} src={A(x.src)} alt={k === Math.min(s, n - 1) ? x.alt : ""} aria-hidden={k !== Math.min(s, n - 1)} className={k === Math.min(s, n - 1) ? "on" : ""} />)}
          {!done && scr.hot && (
            <button className={`bm-hot ${play && !reduced ? "quiet" : ""}`} style={{ left: `${scr.hot[0]}%`, top: `${scr.hot[1]}%`, width: `${scr.hot[2]}%`, height: `${scr.hot[3]}%` }} onClick={drive} aria-label={scr.hint}>
              {!(play && !reduced) && <span className="bm-hot-tip label">{scr.hint}</span>}
            </button>
          )}
          {!reduced && play && !done && <span className={`bm-cursor ${phase}`} style={{ left: `${at[0]}%`, top: `${at[1]}%` }} aria-hidden><svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 2 L3 19 L8 14 L11.5 21 L14 20 L10.6 13 L17 13 Z" fill="#fff" stroke="#12275E" strokeWidth="1.6" strokeLinejoin="round" /></svg></span>}
          {done && (
            <div className="bm-done">
              <div className="bm-done-card">
                <span className="display" style={{ fontSize: 40 }}>Spot reserved</span>
                <span>1843 Pointe Crossing St · see you there</span>
                <Chamfer solid onClick={() => setS(0)}>Book another</Chamfer>
              </div>
            </div>
          )}
        </div>
        <figcaption className="bm-demo-bar">
          <span className="label" aria-live="polite">{done ? "Reserved ✓" : `${String(s + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")} · ${scr.title}`}</span>
          <span style={{ display: "flex", gap: 8 }}>
            <Chamfer onClick={() => { setPlay(false); setS(v => Math.max(0, Math.min(v, n) - 1)); }} ariaLabel="Previous screen">←</Chamfer>
            <Chamfer onClick={() => { if (done) setS(0); setPlay(v => !v); }} ariaLabel={play ? "Pause the demo" : "Play the demo"}>{play && !reduced ? "❚❚ pause" : "▶ play"}</Chamfer>
            <Chamfer onClick={() => { setPlay(false); setS(v => Math.min(n, v + 1)); }} ariaLabel="Next screen">→</Chamfer>
          </span>
        </figcaption>
      </figure>
      <div className="bm-duo-phone">
        <div className="bm-states-phone bm-demo-phone">
          {PROTO.map((x, k) => <img key={x.m} src={A(x.m)} alt={k === Math.min(s, n - 1) ? `The same step on mobile: ${x.title.toLowerCase()}` : ""} aria-hidden={k !== Math.min(s, n - 1)} className={k === Math.min(s, n - 1) ? "on" : ""} draggable={false} />)}
        </div>
        <p className="label" style={{ textAlign: "center", marginTop: 8 }}>same step · mobile</p>
      </div>
    </div>
  );
}

const ASKS: [string, string, string, string][] = [
  ["Make finding a spot intuitive", "A map + list split view, so price and distance read together", "d-results.webp", "The results screen: a list of spots beside a map with price pins."],
  ["Find the filters people actually use", "Filters ranked by 30 parkers, revealed in three steps", "d-filters.webp", "The filters panel: price range, walk distance, spot type."],
  ["Present each spot's amenities", "A detail page: lot specs, amenities, dates, save and reserve", "d-details.webp", "The listing detail page for 1843 Pointe Crossing St."],
  ["Match people with the right spots", "A personal search, plus event-based booking for game day", "d-events-find.webp", "Event search: Michigan vs. Ohio State selected, with nearby spots on the map."],
];

export function BmOverviewWide() {
  const [i, setI] = useState(0);
  const [, d, img, alt] = ASKS[i];
  return (
    <>
      <Band no="01.1" kicker="the real screens, desktop + mobile · watch it, or click the box to drive" title="Book a spot in five screens">
        <AutoDemo />
        <Say pose="bmsPhone" alt="A small Muskaan holding up a phone with a map pin on it" side="right">Same spots, same filters. At your desk, or on the walk to your car.</Say>
      </Band>
      <Band no="01.2" kicker="the brief, answered" title="What they asked → what we designed">
        <div className="bm-ba">
          <ol className="bm-ba-list" aria-label="What they asked and what we designed">
            {ASKS.map(([ask, des], k) => (
              <li key={ask}>
                <button className={`bm-ba-row ${i === k ? "on" : ""}`} aria-pressed={i === k} onClick={() => setI(k)}>
                  <span className="bm-ba-before"><span className="label">they asked</span>{ask}</span>
                  <span className="bm-ba-arrow" aria-hidden>→</span>
                  <span className="bm-ba-after"><span className="label">we designed</span>{des}</span>
                </button>
              </li>
            ))}
          </ol>
          <div aria-live="polite">
            <Browser src={A(img)} alt={alt} caption={`SPEC. B2-01-${String.fromCharCode(65 + i)} · ${d.split(",")[0].toLowerCase()}`} />
          </div>
        </div>
      </Band>
    </>
  );
}

// ── 02 RESEARCH ─────────────────────────────────────────────────────────────
export function BmResearch() {
  return (
    <>
      <p className="tx-lede">Finding parking is painful and slow.</p>
      <p>Before BuyMySpot, students and commuters hunted for spots on Facebook Marketplace and GroupMe. Two things kept going wrong:</p>
      <ul className="bm-bullets">
        <li><b>Listings went fast.</b> By the time someone saw a post, the comments were already full of people asking if it was still available.</li>
        <li><b>Every price was a conversation.</b> Nearly every seller had to be messaged just to learn the price, so people wasted time on spots they could never afford.</li>
      </ul>
    </>
  );
}

/** Broken down: the old way of finding a spot was a loop with no exit. */
function OldLoop() {
  const steps: [number, number, string, string][] = [
    [20, 20, "1 · SPOT A POST", "on Marketplace or GroupMe"],
    [200, 20, "2 · “STILL AVAILABLE?”", "join the comment queue"],
    [200, 130, "3 · DM FOR THE PRICE", "wait for a reply"],
    [20, 130, "4 · PRICEY OR TAKEN", "back to scrolling"],
  ];
  return (
    <svg viewBox="0 0 370 200" className="scene tx-diagram" role="img" aria-label="The old loop: 1, spot a post on Facebook Marketplace or GroupMe. 2, ask if it's still available. 3, message the seller for the price and wait. 4, it's too expensive or already taken, so back to scrolling. Repeat.">
      {steps.map(([x, y, t, d]) => (
        <g key={t}>
          <rect x={x} y={y} width="150" height="50" rx="8" className="bp fill" />
          <text x={x + 10} y={y + 21} fontSize="9.5" className="bp-text">{t}</text>
          <text x={x + 10} y={y + 37} className="bp-text" style={{ fontFamily: "var(--hand)", fontSize: 12, letterSpacing: 0 }}>{d}</text>
        </g>
      ))}
      <path d="M170 45 H200 m-7 -5 l7 5 l-7 5" className="bp" />
      <path d="M275 70 V130 m-5 -7 l5 7 l5 -7" className="bp" />
      <path d="M200 155 H170 m7 -5 l-7 5 l7 5" className="bp" />
      <path d="M95 130 V70 m-5 7 l5 -7 l5 7" className="bp" />
      <text x="185" y="104" fontSize="9" textAnchor="middle" className="bp-text">REPEAT</text>
      <path d="M150 96 h70" className="bp" stroke="var(--accent)" strokeWidth="3" />
    </svg>
  );
}

const METHODS: [string, string, string][] = [
  ["01", "Unveil the attributes", "We listed 20 parking attributes and conveniences that could become search filters: price, distance, covered, valet, max vehicle size, in & out, security camera and more."],
  ["02", "Ask a wider crowd", "A Google Form asked people to rate every attribute, from “most important” to “doesn't apply to me”."],
  ["03", "Add it all up", "We scored each answer (4 points for most important, down from there) and ranked the attributes across 30 parkers."],
];

type Tier = { k: string; ranks: string; items: string[]; lives: string; src: string; box: Box; alt: string };
const TIERS: Tier[] = [
  { k: "Everyone agreed", ranks: "#1 – 2", items: ["Price", "Walkable to destination"], lives: "So they sit right under the search bar, always visible.", src: "d-results.webp", box: [0.5, 17.6, 27, 9.4], alt: "The results screen with the price range and walk-distance controls highlighted." },
  { k: "Split: convenience or security", ranks: "#3 – 7", items: ["Duration to park", "General area around", "Security camera on site", "In & out allowed", "Other people see where I park"], lives: "So the yes/no ones became one-tap chips across the map.", src: "d-results.webp", box: [28.7, 9.2, 54.5, 6], alt: "The results screen with the quick filter chips across the top of the map highlighted." },
  { k: "Only one or two people cared", ranks: "#8 – 20", items: ["12 more attributes"], lives: "So they're folded into All filters, out of the way until you want them.", src: "d-filters.webp", box: [0, 7.6, 27.8, 92], alt: "The All filters panel highlighted: price range, walk distance, spot type and more." },
];

function RankTiers() {
  const [t, setT] = useState(0);
  const tier = TIERS[t];
  return (
    <div className="bm-tiers">
      <div>
        <ol className="bm-tier-list">
          {TIERS.map((x, k) => (
            <li key={x.k}>
              <button className={`bm-tier ${t === k ? "on" : ""}`} aria-pressed={t === k} onClick={() => setT(k)}>
                <span className="label">{x.ranks}</span>
                <span className="display bm-tier-name">{x.k}</span>
                <span className="bm-tier-items">{x.items.join(" · ")}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="hand bm-note" aria-live="polite">{tier.lives}</p>
      </div>
      <Browser src={A(tier.src)} alt={tier.alt} boxes={[tier.box]} caption={`SPEC. B2-02-R${t + 1} · where ranks ${tier.ranks.replace(/\s/g, "")} live in the UI`} />
    </div>
  );
}

const PRICE_QUOTES = ["I'll park far from campus and take the blue bus to class if I have to.", "I'll step through a pile of snow to get to my parking spot if I have to.", "I love walking. I don't mind walking any distance."];
const CLOSE_QUOTES = ["I need to look professional, so I prefer not to walk far in humid or moist weather.", "In the winter, it's cold, it sucks, I don't want to walk in the cold.", "I have a child. My arrival time to places should be reliable and accurate.", "Return on time is most important for me. I don't even look at the price."];

/** Interactive: drag between the two camps and hear from each. */
function TradeOff() {
  const [v, setV] = useState(25);
  const close = v >= 50;
  const quotes = close ? CLOSE_QUOTES : PRICE_QUOTES;
  const strength = Math.abs(v - 50) / 50;
  const q = quotes[Math.min(quotes.length - 1, Math.floor(strength * quotes.length))];
  return (
    <div className="bm-trade">
      <div className="bm-trade-ctrl">
        <span className="label">$ cheapest</span>
        <input type="range" min={0} max={100} value={v} onChange={e => setV(+e.target.value)} aria-label="Slide between cheapest and closest" />
        <span className="label">closest →</span>
      </div>
      <div className="bm-trade-card" aria-live="polite">
        <span className="label mid">{close ? "Rationale 2 · convenience is king" : "Rationale 1 · price is king"}</span>
        <p className="bm-quote">“{q}”</p>
        <p className="label">{close ? "walk time and a guaranteed spot > price" : "will trade distance for a lower price"} · {Math.round(strength * 100)}% {close ? "close" : "cheap"}</p>
      </div>
    </div>
  );
}

const PERSONAS = [
  { name: "Oslo", tag: "The local commuter", img: "avatar-oslo.webp", board: "persona-oslo.webp",
    rows: [["Age", "20 · non-binary"], ["Life", "Full-time student, Ann Arbor"], ["Drives", "Only for groceries, long errands, bad weather"], ["Trade-off", "Price over convenience"]] as [string, string][],
    safety: "Worried about the car: theft, broken windows, flat tires. Feels safe with clear signage, a low-crime area, and a camera.",
    quote: "What if something happens to my car????" },
  { name: "Geneva", tag: "The commuting professional", img: "avatar-geneva.webp", board: "persona-geneva.webp",
    rows: [["Age", "30 · female"], ["Life", "Tech consultant, lives in Canton, MI"], ["Drives", "Daily, to a city she doesn't live in"], ["Trade-off", "Convenience over price"]] as [string, string][],
    safety: "Worried about herself, walking to the car every day, often late. Feels safe when the spot is visible, well-lit, in a busy or residential area.",
    quote: "What if something happens to me??? I have to go get my car every day." },
];

export function BmResearchWide() {
  const [board, setBoard] = useState<number | null>(null);
  return (
    <>
      <Band no="02.1" kicker="broken down" title="The old way: a loop with no exit">
        <div className="tx-split">
          <OldLoop />
          <div>
            <p>Every step waited on a stranger replying. So the job was to put the answers (price, availability, distance) on screen before anyone has to send a message.</p>
            <Say pose="csMagnify" alt="A small Muskaan looking through a magnifying glass">Ten comments on one post, all asking “is this still available?” Noted.</Say>
          </div>
        </div>
      </Band>
      <Band no="02.2" kicker="interviews, then numbers" title="Twenty attributes, thirty parkers">
        <p className="tx-measure">We interviewed parkers, grouped what they said into an affinity map (why parking is a pain, how I find parking, what's important to me), then put every attribute in front of a wider group to rank.</p>
        <ol className="bm-methods">
          {METHODS.map(([n, t, d]) => <li key={n}><span className="display bm-method-no">{n}</span><b className="display">{t}</b><span>{d}</span></li>)}
        </ol>
        <div className="tx-pair" style={{ marginTop: 24 }}>
          <Shot src={A("thematic-analysis.webp")} alt="Affinity diagram from the interviews, under four headings: why is parking a pain, how I find parking, what's important to me, and other data. Sticky notes are colour-coded by Gen Z and Millennial interviewees." caption="SPEC. B2-02-A · affinity map + thematic analysis" />
          <Shot src={A("survey.webp")} alt="The ranking survey: 'Personally, what do you prioritize when choosing a parking spot?' with rows for price, duration available, maximum vehicle size and valet, rated from doesn't apply to most important." caption="SPEC. B2-02-B · the ranking survey" />
        </div>
      </Band>
      <Band no="02.3" kicker="tap a tier: see where it ended up" title="What people actually ranked">
        <p className="tx-measure">Price and proximity were near-unanimous. Ranks 3 to 7 split people into those who wanted convenience and those who wanted security. Below 8th place, only one or two people cared. That shape became the shape of the search, and it gave the PM and developer a clear order of what to build first.</p>
        <RankTiers />
      </Band>
      <Band no="02.4" kicker="the big finding" title="Price vs. proximity is a trade-off">
        <p className="tx-measure">Everyone we interviewed cared about the same three things: <b>price, proximity and security</b>, whatever they drove or earned. But they weighed them differently. People who wanted it cheap would walk; people who wanted it close would pay. Slide to hear both camps:</p>
        <div className="tx-split">
          <TradeOff />
          <Say pose="bmsSlider" alt="A small Muskaan pushing a giant slider knob from the dollar sign toward 'close'" side="right">Two kinds of parkers. One counts dollars, one counts minutes.</Say>
        </div>
        <div className="bm-security">
          <div><span className="label">and security?</span><h4 className="display">It means two different things.</h4>
            <p>For some it's the car: theft, break-ins, a flat tire. For others it's their own safety, walking to the car every day. <b>Women and people new to the area raised personal safety first; men and locals rarely brought it up unprompted.</b></p>
            <p>So “safe” couldn't be one vague badge. It had to be specific things you can filter on, like a security camera on site or a covered lot. That gave the PM and developer concrete attributes to build, instead of a “safety score” nobody could define.</p></div>
          <Shot src={A("security-synopsis.webp")} alt="Research synopsis, two boards: 'I'm concerned about monetary damages to my car' (signage, low-crime area, camera) and 'I'm concerned about my safety' (visible, other cars around, stores or houses, well-lit, university-affiliated)." caption="SPEC. B2-02-C · two kinds of safe" />
        </div>
      </Band>
      <Band no="02.5" kicker="from the interviews" title="Meet Oslo and Geneva">
        <div className="bm-personas">
          {PERSONAS.map(p => (
            <article key={p.name} className="tx-persona-card bm-persona">
              <img src={A(p.img)} alt={`Illustrated persona: ${p.name}.`} />
              <h4 className="display" style={{ fontSize: 34, margin: 0, textAlign: "center" }}>{p.name}</h4>
              <p className="label" style={{ textAlign: "center", margin: "0 0 10px" }}>{p.tag}</p>
              <SpecTable caption={p.name} rows={p.rows} />
              <p className="bm-persona-safe"><b className="label">Safe means:</b> {p.safety}</p>
              <p className="hand bm-persona-quote">“{p.quote}”</p>
              <button className="bm-board-btn" onClick={() => setBoard(PERSONAS.indexOf(p))}>
                <img src={A(p.board)} alt="" loading="lazy" />
                <span className="label">open the full persona board ↗</span>
              </button>
            </article>
          ))}
        </div>
        {board !== null && <Lightbox wide title={`${PERSONAS[board].name} · persona board`} start={board} onClose={() => setBoard(null)}
          imgs={PERSONAS.map(x => ({ src: A(x.board), alt: `${x.name}'s full persona board: bio, parking-attitude sliders (time vs budget, intermittent vs long-term, tech-reliant vs traditional, safety-conscious vs indifferent, specific needs vs flexible, planner vs show up) and research notes.` }))} />}
      </Band>
    </>
  );
}

// ── 03 DEFINE ───────────────────────────────────────────────────────────────
export function BmDefine() {
  return (
    <>
      <p className="tx-lede">One search, two kinds of parkers.</p>
      <blockquote className="tx-hmw">
        How might we create a <em>personalized</em> search experience that matches each buyer with the spots most likely to meet their preferences
        <span className="tx-need">user need</span>, so the marketplace wins on precise matching instead of endless messaging
        <span className="tx-need">business need</span>?
      </blockquote>
    </>
  );
}

const STEPS_UI: { k: string; t: string; d: string; src: string; box: Box; alt: string }[] = [
  { k: "Step 1", t: "Must-haves", d: "Where and when. The two things every parker needs before anything else is useful.", src: "d-setdates.webp", box: [0.6, 9.6, 26.6, 52.6], alt: "Search with Ann Arbor entered and a calendar open to pick the date of entry." },
  { k: "Step 2", t: "Non-negotiables", d: "Price range and walk distance, in miles or in minutes. Minutes came from testing: not everyone thinks in miles.", src: "d-results.webp", box: [0.5, 17.6, 27, 9.4], alt: "Results with the price range and walk-distance controls highlighted." },
  { k: "Step 3", t: "Preferences", d: "Optional. Everything else lives under All filters: spot type, size, amenities.", src: "d-filters.webp", box: [0, 7.6, 27.8, 92], alt: "The All filters panel open over the list." },
  { k: "Step 4", t: "Spots that fit", d: "The split view: scan the list by price, the map by distance, both at once.", src: "d-results.webp", box: [0, 32.6, 27.8, 67], alt: "Results with the list of matching spots highlighted." },
];

function Disclosure() {
  const [s, setS] = useState(0);
  const step = STEPS_UI[s];
  return (
    <div className="bm-disc">
      <ol className="bm-disc-steps">
        {STEPS_UI.map((x, k) => (
          <li key={x.k}>
            <button className={`bm-disc-step ${s === k ? "on" : ""} ${k < s ? "past" : ""}`} aria-pressed={s === k} onClick={() => setS(k)}>
              <span className="label">{x.k}</span><span className="display">{x.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="bm-disc-text" aria-live="polite">{step.d}</p>
      <Browser src={A(step.src)} alt={step.alt} boxes={[step.box]} caption={`SPEC. B2-03-${s + 1} · ${step.t.toLowerCase()}`} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Chamfer onClick={() => setS(v => Math.max(0, v - 1))} ariaLabel="Previous step">←</Chamfer>
        <Chamfer onClick={() => setS(v => Math.min(STEPS_UI.length - 1, v + 1))} ariaLabel="Next step">→</Chamfer>
      </div>
    </div>
  );
}

const CONSTRAINTS = [
  ["C-01", "Budget parkers will walk far to save money", "make price comparable at a glance, in the list and on the map", "P1"],
  ["C-02", "Convenience parkers pay to park close", "show walk time on every card and distance on the map", "P1"],
  ["C-03", "Not everyone thinks in miles", "let walk distance be set in miles or minutes", "P1"],
  ["C-04", "“Safe” means the car to some, the person to others", "make the specific security attributes filterable", "P1"],
  ["C-05", "Game days fill Ann Arbor", "let people search by event, not only by date", "P2"],
  ["C-06", "Plans change", "design the full cancellation + refund flow up front", "P2"],
  ["C-07", "A developer builds straight from the file", "ship a style guide and a screen flow with the designs", "P1"],
];

export function BmDefineWide() {
  return (
    <>
      <Band no="03.1" kicker="progressive disclosure, step by step" title="From 20 attributes to 3 steps">
        <p className="tx-measure">Instead of a wall of 20 filters, the search asks for things in the order people rank them. Each step is optional after the first, so a parker who only cares about price never sees the rest.</p>
        <Disclosure />
      </Band>
      <Band no="03.2" kicker="written down before any pixels" title="Constraints → requirements">
        <div style={{ overflowX: "auto" }}>
          <table className="spec-table" style={{ minWidth: 560 }}>
            <caption className="sr-only">Constraints and requirements</caption>
            <thead><tr><th>ID</th><th>Constraint</th><th>So the UI must…</th><th>Priority</th></tr></thead>
            <tbody>{CONSTRAINTS.map(c => <tr key={c[0]}>{c.map((v, i) => <td key={i}>{v}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </Band>
      <Band no="03.3" kicker="competitive audit" title="Airbnb, or Google Maps?">
        <p className="tx-measure">We started from the Airbnb booking experience: browse a grid, open a listing, book. Testing our first sketches showed parkers think <b>distance first</b>. A hybrid of Google Maps and Airbnb fit their mental model better, so the map moved to the centre.</p>
        <div className="bm-audit">
          <Shot src={A("audit-grid.webp")} alt="Audit of grid listings: Airbnb-style pages with photo grids and a listing detail page, next to an early BuyMySpot grid." caption="SPEC. B2-03-A · audit: grid listings (where we started)" />
          <Shot src={A("audit-split.webp")} alt="Audit of split views: list-and-map layouts from several booking and map products." caption="SPEC. B2-03-B · audit: split view (where we went)" />
          <Shot src={A("audit-map.webp")} alt="Audit of map styles: several map treatments compared side by side." caption="SPEC. B2-03-C · audit: map styles" />
        </div>
      </Band>
    </>
  );
}

// ── 04 DESIGN ───────────────────────────────────────────────────────────────
export function BmDesign() {
  return (
    <>
      <p className="tx-lede">Unified, lucid, cost-effective.</p>
      <p>The goal was to build on mental models people already had (booking a stay, reading a map) and add clarity, not novelty. Information is grouped by meaning, so related things sit together and the eye has less to sort.</p>
      <p>We took it from paper to hi-fi, on desktop and mobile.</p>
    </>
  );
}

const REVS: { rev: string; img: string; changed: string; next: string; alt: string }[] = [
  { rev: "A", img: "sketch-notes.webp", alt: "Pencil notes from the kickoff: search fields, dates, filters, price slider, ratings, deliverables and first screen sketches.",
    changed: "Kickoff notes with the client: which filters, how price is shown, what we'd deliver.", next: "Turn the filter list into a page structure." },
  { rev: "B", img: "sketch-sitemap.webp", alt: "A pencil site map: home, info for sellers, capabilities, find parking, lease, login and account.",
    changed: "A paper site map: home, find parking, lease, log-in and account.", next: "Pick a search layout: a grid like Airbnb, or a map?" },
  { rev: "C", img: "lofi-map-list.webp", alt: "Lo-fi split view in greys: search, min and max price, walk distance, and empty listing cards beside a map.",
    changed: "Lo-fi split view: search, min/max price and walk distance up top, list beside the map.", next: "Make price and distance editable in place." },
  { rev: "D", img: "lofi-split.webp", alt: "Lo-fi iteration with purple annotations: click to edit price and proximity, sliders shown within dotted lines, switch to miles.",
    changed: "Click-to-edit price and distance with sliders, plus a switch between minutes and miles.", next: "Go hi-fi on a design system; add dates and prices on the pins." },
  { rev: "FINAL", img: "d-results.webp", alt: "Final results screen: list of spots, price and walk controls, filter chips, price pins on the map.",
    changed: "Map + list, dates in the search, quick chips over the map, a price on every pin.", next: "Handed to the developer with a style guide and a screen flow." },
];

function Revisions() {
  const track = useRef<HTMLOListElement>(null);
  const nudge = (d: number) => track.current?.scrollBy({ left: d * 340, behavior: "smooth" });
  return (
    <div>
      <div className="tx-revs-bar">
        <span className="label mid">REV A → FINAL · scroll sideways</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Chamfer onClick={() => nudge(-1)} ariaLabel="Earlier revisions">←</Chamfer>
          <Chamfer onClick={() => nudge(1)} ariaLabel="Later revisions">→</Chamfer>
        </div>
      </div>
      <ol ref={track} className="tx-revs">
        {REVS.map((r, i) => (
          <li key={r.rev} className={`tx-rev ${r.rev === "FINAL" ? "final" : ""}`}>
            <div className="tx-rev-head"><span className="tx-rev-tag">REV {r.rev}</span><span className="label">{String(i + 1).padStart(2, "0")} / {String(REVS.length).padStart(2, "0")}</span></div>
            <div className="tx-rev-img"><img src={A(r.img)} alt={r.alt} loading="lazy" /></div>
            <dl className="tx-rev-notes">
              <dt className="label">What changed</dt><dd>{r.changed}</dd>
              <dt className="label">{r.rev === "FINAL" ? "Result" : "Improved next"}</dt><dd className="hand">{r.next}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}

const PARTS: { n: number; x: number; y: number; t: string; d: string }[] = [
  { n: 1, x: 49.7, y: 12, t: "Quick chips", d: "The mid-ranked yes/no needs (covered, security camera, in & out) one tap away, without opening All filters." },
  { n: 2, x: 8.3, y: 43.1, t: "Listing card", d: "Price, rating, walk time and amenities, readable in one pass." },
  { n: 3, x: 25.3, y: 37, t: "Save", d: "Bookmark straight from the card, no detour through the detail page." },
  { n: 4, x: 64, y: 41.6, t: "Price on the map", d: "Every pin carries its price, so the price-vs-distance trade-off is visible at a glance." },
  { n: 5, x: 25.3, y: 29.3, t: "Notify me", d: "No match yet? Get told when a new spot opens in this area." },
];

function Anatomy() {
  const [on, setOn] = useState<number | null>(null);
  return (
    <div className="tx-anatomy bm-anatomy">
      <div className="tx-anatomy-img" style={{ padding: 0 }}>
        <img src={A("d-results.webp")} alt="The results screen with seven numbered parts." />
        {PARTS.map(p => (
          <button key={p.n} className={`tx-pin ${on === p.n ? "on" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => setOn(p.n)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(p.n)} onBlur={() => setOn(null)} aria-label={`${p.n}. ${p.t}: ${p.d}`}>{p.n}</button>
        ))}
      </div>
      <ol className="tx-anatomy-list">
        {PARTS.map(p => (
          <li key={p.n} className={on === p.n ? "on" : ""} onMouseEnter={() => setOn(p.n)} onMouseLeave={() => setOn(null)}>
            <span className="tx-pin static" aria-hidden>{p.n}</span><span><b className="display">{p.t}</b><br />{p.d}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A click-through of the real screens: the happy path from search to reserved. */
const PROTO: { src: string; m: string; title: string; hot?: Box; hint?: string; alt: string }[] = [
  { src: "d-default.webp", m: "m-default.webp", title: "Land on the map", hot: [14, 9.9, 13.2, 6.8], hint: "Tap the dates field", alt: "The default search screen: an empty search with price and walk controls beside a map of Ann Arbor." },
  { src: "d-setdates.webp", m: "m-setdates.webp", title: "Pick your dates", hot: [17.4, 50.6, 4.4, 5.2], hint: "Pick July 27", alt: "The date picker open on July 2023." },
  { src: "d-results.webp", m: "m-list.webp", title: "Compare spots", hot: [0.3, 51.8, 27.6, 18.4], hint: "Open 1843 Pointe Crossing St", alt: "Results: three spots listed beside the map." },
  { src: "d-details.webp", m: "m-details.webp", title: "Check the details", hot: [28.9, 88.2, 12.2, 5.2], hint: "Tap Reserve spot", alt: "The detail page for 1843 Pointe Crossing St with a Reserve spot button." },
  { src: "d-pay.webp", m: "m-pay.webp", title: "Reserve + pay", hot: [11.8, 68.5, 36.2, 6.2], hint: "Submit the reservation", alt: "Checkout: saved cards on the left, the spot, dates and price breakdown on the right." },
];

const PHONE_STATES: [string, string, string][] = [
  ["Map", "m-map-hide.webp", "Mobile, map only: price pins over Ann Arbor, the list hidden."],
  ["Peek", "m-map-peek.webp", "Mobile, map with the list peeking up from the bottom."],
  ["List", "m-list.webp", "Mobile, list only: spots near Mason Hall with chips for covered and free cancellation."],
];

/** Interactive: the half-map / half-list sheet on mobile. Swipe it, or use the buttons. */
function PhoneStates() {
  const [s, setS] = useState(1);
  const start = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => { start.current = e.clientY; };
  const onUp = (e: React.PointerEvent) => {
    if (start.current === null) return;
    const d = e.clientY - start.current; start.current = null;
    if (d < -30) setS(v => Math.min(2, v + 1)); else if (d > 30) setS(v => Math.max(0, v - 1));
  };
  return (
    <div className="bm-states">
      <div className="bm-states-phone" onPointerDown={onDown} onPointerUp={onUp}>
        {PHONE_STATES.map(([k, src, alt], i) => <img key={k} src={A(src)} alt={i === s ? alt : ""} aria-hidden={i !== s} className={i === s ? "on" : ""} draggable={false} />)}
      </div>
      <div className="bm-states-side">
        <Chips label="Sheet state" items={PHONE_STATES.map(([k], i) => [i, k] as [number, string])} value={s} onPick={setS} />
        <div style={{ display: "flex", gap: 8 }}>
          <Chamfer onClick={() => setS(v => Math.min(2, v + 1))} ariaLabel="Swipe up: more list">↑ swipe up</Chamfer>
          <Chamfer onClick={() => setS(v => Math.max(0, v - 1))} ariaLabel="Swipe down: more map">↓ swipe down</Chamfer>
        </div>
        <p>On a phone there's no room for a side-by-side split, so the split becomes a sheet. It opens half map, half list. Swipe up and the list takes over; swipe down and the map does. (Try it on the phone, or with the buttons.)</p>
      </div>
    </div>
  );
}

const MOBILE_MORE: [string, string, string, boolean][] = [
  ["m-events.webp", "Events: search, today / this week / this month, then the games and fairs.", "events", true],
  ["m-saved.webp", "Saved spots, filtered by the dates you need.", "saved", false],
  ["m-filters.webp", "All filters: price range, walk distance, spot type, vehicle size.", "filters", false],
];

/** Small diagrams for the features. */
function FlowDiagram({ steps, label }: { steps: string[]; label: string }) {
  const w = 300;
  return (
    <svg viewBox={`0 0 ${w} ${steps.length * 44 + 8}`} className="scene tx-diagram" role="img" aria-label={label}>
      {steps.map((s, i) => (
        <g key={s}>
          <rect x="8" y={6 + i * 44} width={w - 16} height="30" rx="6" className={`bp ${i === steps.length - 1 ? "" : "fill"}`} style={i === steps.length - 1 ? { fill: "var(--white)" } : undefined} />
          <text x={w / 2} y={25 + i * 44} fontSize="10" textAnchor="middle" className="bp-text" style={{ textTransform: "uppercase", fill: i === steps.length - 1 ? "var(--blueprint-dk)" : undefined }}>{s}</text>
          {i < steps.length - 1 && <path d={`M${w / 2} ${36 + i * 44} v14 m-5 -6 l5 6 l5 -6`} className="bp" />}
        </g>
      ))}
    </svg>
  );
}

const BREAKS: { k: string; what: string; how: string; desk: string; phone: string; box?: Box; alt: string; phoneAlt: string }[] = [
  { k: "Search for something that doesn't exist", what: "No spots match.", how: "Instead of an empty page, the list says no spots were found and names the four things you can change: dates, price range, distance, filters. The map stays, so you can pan to a nearby area.",
    desk: "d-noresults.webp", phone: "m-noresults.webp", box: [0, 31, 27.8, 18], alt: "No results: an empty-state message under the search controls, the map still visible.", phoneAlt: "No results on mobile: the map with no price pins." },
  { k: "Book less than the minimum stay", what: "Dates shorter than the host's minimum lease.", how: "Caught right at the date field, in red, with the rule spelled out. The chevrons fix the dates in place, so you never lose the listing.",
    desk: "d-details-error.webp", phone: "m-error.webp", box: [24.6, 51.6, 26, 16.6], alt: "Detail page with dates 07/31 to 08/30 in red and the message: date range cannot be less than the minimum lease range.", phoneAlt: "The same minimum-lease error on mobile." },
  { k: "Pay with an expired card", what: "A saved card has expired.", how: "Flagged in the list with an Update link next to it, before you hit Submit, not after.",
    desk: "d-pay.webp", phone: "m-pay.webp", box: [11.8, 37.8, 36.6, 6.4], alt: "Checkout with a Mastercard ending 5372 flagged Expired with an Update link.", phoneAlt: "Checkout on mobile with saved cards." },
];

function BreakIt() {
  const [b, setB] = useState(0);
  const x = BREAKS[b];
  return (
    <div>
      <Chips label="Pick a way to break it" items={BREAKS.map((y, i) => [i, y.k] as [number, string])} value={b} onPick={setB} />
      <div className="bm-break">
        <div>
          <span className="label mid">what goes wrong</span>
          <h4 className="display bm-break-what">{x.what}</h4>
          <p aria-live="polite">{x.how}</p>
          <Say pose="bmsOops" alt="A small Muskaan shrugging next to a warning sign">We listed every way a parker could hit a wall. Then designed the wall.</Say>
        </div>
        <div className="bm-break-media">
          <Browser src={A(x.desk)} alt={x.alt} boxes={x.box ? [x.box] : []} caption={`SPEC. B2-04-E${b + 1} · desktop`} />
          <div className="bm-break-phone"><Phone src={A(x.phone)} alt={x.phoneAlt} /></div>
        </div>
      </div>
    </div>
  );
}

const CANCEL: { t: string; d: string; desk: string; phone?: string; alt: string; tall?: boolean }[] = [
  { t: "Leasing details", d: "Everything about an active booking in one place: confirmation, the cancellation policy, change dates, entry instructions, every payment, and the host.", desk: "d-leasing.webp", alt: "Leasing details: reservation details, entry instructions with a map, payments past and future, and the host, Alejandro.", tall: true },
  { t: "Why cancel?", d: "A short, optional note to the host by name. Back is always one tap away, and the refund amount stays on screen.", desk: "d-cancel-why.webp", phone: "m-cancel-why.webp", alt: "Cancel step 1: 'Tell Alejandro why you need to cancel' with a text box, Back and Continue, and the refund summary on the right." },
  { t: "Choose your refund", d: "Pick how the money comes back: as parking credit or to the original card. The policy and the full refund amount sit right beside the choice.", desk: "d-cancel-refund.webp", phone: "m-cancel-refund.webp", alt: "Cancel step 2: choose how to receive the refund, parking reservation credit or the Discover card, then Cancel reservation." },
];

function CancelFlow() {
  const [c, setC] = useState(0);
  const x = CANCEL[c];
  return (
    <div>
      <ol className="bm-disc-steps">
        {CANCEL.map((y, k) => (
          <li key={y.t}><button className={`bm-disc-step ${c === k ? "on" : ""} ${k < c ? "past" : ""}`} aria-pressed={c === k} onClick={() => setC(k)}><span className="label">Step {k + 1}</span><span className="display">{y.t}</span></button></li>
        ))}
      </ol>
      <p className="bm-disc-text" aria-live="polite">{x.d}</p>
      <div className="bm-break-media">
        {x.tall
          ? <figure className="bm-browser"><div className="bm-browser-bar" aria-hidden><i /><i /><i /><span>buymyspot.com/reservations</span></div><div className="bm-browser-screen bm-scrollshot" tabIndex={0} aria-label={`${x.alt} (scrollable)`}><img src={A(x.desk)} alt={x.alt} loading="lazy" /></div><figcaption className="label">SPEC. B2-04-C1 · scroll inside ↕</figcaption></figure>
          : <Browser src={A(x.desk)} alt={x.alt} caption={`SPEC. B2-04-C${c + 1} · desktop`} />}
        {x.phone && <div className="bm-break-phone"><Phone src={A(x.phone)} alt={`${x.t} on mobile`} /></div>}
      </div>
    </div>
  );
}

export function BmDesignWide() {
  return (
    <>
      <Band no="04.1" kicker="from the first sketch to the last" title="Revision history">
        <Revisions />
        <Say pose="csPencil" alt="A small Muskaan drawing with a pencil taller than she is" side="right">Version one never survives the first test. That's what it's for.</Say>
      </Band>
      <Band no="04.2" kicker="the parts the search steps don't cover · hover or tab" title="Anatomy of the results screen">
        <Anatomy />
      </Band>
      <Band no="04.3" kicker="one-to-one with desktop" title="The same app in your pocket">
        <PhoneStates />
        <div className="bm-phones" role="list" aria-label="More mobile screens">
          {MOBILE_MORE.map(([src, alt, cap, scroll], i) => (
            <div role="listitem" key={src}><Phone src={A(src)} alt={alt} scroll={scroll} caption={`SPEC. B2-04-M${i + 1} · ${cap}`} /></div>
          ))}
        </div>
      </Band>
      <Band no="04.4" kicker="the features, broken down then live" title="What it does for a parker">
        <div className="tx-features">
          <Feature no="F-01 · game day" title="Search by event, not just by date"
            diagram={<FlowDiagram label="Event search: pick an event, its date fills in, the map centres on the venue, spots nearby." steps={["Pick an event", "Its date fills in", "Map centres on the venue", "Spots near the stadium"]} />}
            media={<Browser src={A("d-events-find.webp")} alt="Event search: Michigan vs. Ohio State at Michigan Stadium selected, with spots listed beside the map." caption="SPEC. B2-04-F1 · Michigan vs. Ohio State" />}>
            <p>Game days in Ann Arbor are their own parking problem, and before, there was no way to book for one. Now you can start from the event: browse what's on today, this week or this month, pick one, and the search fills in the date and shows spots near the venue.</p>
          </Feature>
          <Feature no="F-02 · trust" title="A detail page that answers before you ask"
            diagram={<FlowDiagram label="The detail page, top to bottom: photo and price, your dates, lot specs, amenities, a sticky subtotal with reserve." steps={["Photo + price", "Your dates", "Lot type · height · in & out", "Amenities", "Subtotal + Reserve"]} />}
            media={<Browser src={A("d-details.webp")} alt="Detail page: photo with a $100 price, address, rating, dates, standard lot, 8 foot 8 height, 1 month minimum, in and out, amenities, and a sticky subtotal with Reserve spot." caption="SPEC. B2-04-F2 · listing detail" />}>
            <p>Every spot gets its own page: price, rating and walk time, your dates, lot type, clearance height, in-and-out, amenities, and a subtotal that stays on screen with Reserve. Similar spots sit alongside, so a bad fit is never a dead end.</p>
          </Feature>
          <Feature no="F-03 · come back later" title="Saved, and filtered by your dates"
            diagram={<FlowDiagram label="Saved: bookmark any card, open Saved, set your dates, see which saved spots are free." steps={["Bookmark any card", "Open Saved", "Set your dates", "See what's free"]} />}
            media={<Browser src={A("d-saved.webp")} alt="Saved spots with a 'show spots available on these dates' filter, listed beside the map." caption="SPEC. B2-04-F3 · saved" />}>
            <p>Bookmark from any card or detail page. Saved spots can be filtered by the dates you need, so a list you made last month still answers “what's free now?”</p>
          </Feature>
          <Feature no="F-04 · no surprises" title="Reserve, with every line of the price"
            diagram={<FlowDiagram label="Checkout: the spot, the duration, monthly rent plus service fee, due monthly, total." steps={["The spot", "Duration", "Rent + service fee", "Due monthly", "Total"]} />}
            media={<Browser src={A("d-pay.webp")} alt="Checkout: saved cards with one selected, the spot, duration and pricing details: monthly rent, service fee, due monthly and total." caption="SPEC. B2-04-F4 · reserve + pay" />}>
            <p>Price was the thing people cared about most, so checkout hides nothing: monthly rent, the service fee, what's due each month, and the total, next to the spot and the dates. Saved cards are one tap.</p>
          </Feature>
        </div>
      </Band>
      <Band no="04.5" kicker="Nielsen Norman heuristics, applied early" title="Try to break it">
        <p className="tx-measure">We sat down with the developer and listed every edge case and error a parker could hit, then designed those states up front. It matched usability standards, sped up the build, and meant nobody had to improvise error handling later.</p>
        <BreakIt />
      </Band>
      <Band no="04.6" kicker="plans change" title="Cancellation + refund, designed end to end">
        <CancelFlow />
      </Band>
    </>
  );
}

// ── 05 HANDOFF ──────────────────────────────────────────────────────────────
export function BmHandoff() {
  return (
    <>
      <p className="tx-lede">Then we handed it to a developer.</p>
      <p>The startup's developer (who was also the PM) built straight from our file. That shaped how we designed: everything had to be new enough to matter and simple enough to ship in the time we had. So the designs came with two things a developer can't guess: <b>a style guide</b> and <b>a flow of every screen</b>.</p>
    </>
  );
}

type Node = { id: string; t: string; x: number; y: number; src?: string; note: string };
const NODES: Node[] = [
  { id: "home", t: "Default recommended", x: 20, y: 70, src: "d-default.webp", note: "Where everyone lands: the map, the search, the quick controls." },
  { id: "dates", t: "Search / set dates", x: 200, y: 70, src: "d-setdates.webp", note: "Location typed, now the calendar." },
  { id: "filters", t: "Filters", x: 200, y: 120, src: "d-filters.webp", note: "Optional preferences, behind All filters." },
  { id: "none", t: "Search / no results", x: 380, y: 20, src: "d-noresults.webp", note: "The empty state, with what to change." },
  { id: "results", t: "Search / results", x: 380, y: 70, src: "d-results.webp", note: "The split view: list + map." },
  { id: "details", t: "Details", x: 560, y: 70, src: "d-details.webp", note: "One spot, everything about it." },
  { id: "error", t: "Error: min. lease", x: 560, y: 120, src: "d-details-error.webp", note: "Dates too short: fix them with the chevrons, right there." },
  { id: "pay", t: "Reserve spot (payment)", x: 740, y: 70, src: "d-pay.webp", note: "Checkout with the full price breakdown." },
  { id: "nav", t: "Navigation bar", x: 20, y: 250, note: "Recommended · Events · Saved · Messages · profile. It's on every screen, so it gets a node, not a screenshot." },
  { id: "events", t: "Events", x: 200, y: 200, src: "d-events.webp", note: "Pick an event; it feeds the results." },
  { id: "saved", t: "Saved", x: 200, y: 250, src: "d-saved.webp", note: "Bookmarks, filtered by dates." },
  { id: "profile", t: "My profile", x: 200, y: 300, src: "d-profile.webp", note: "Reservations, payment methods, log-in and security, all on one page." },
  { id: "res", t: "Reservations", x: 380, y: 300, src: "d-profile.webp", note: "Active, upcoming, past and cancelled bookings (part of the profile page)." },
  { id: "lease", t: "Leasing details", x: 560, y: 300, src: "d-leasing.webp", note: "An active booking: entry, payments, the host, cancel." },
];
const EDGES: [string, string, "h" | "v"][] = [
  ["home", "dates", "h"], ["home", "filters", "h"], ["dates", "none", "h"], ["dates", "results", "h"], ["filters", "results", "h"],
  ["results", "details", "h"], ["details", "pay", "h"], ["details", "error", "v"], ["home", "nav", "v"],
  ["nav", "events", "h"], ["nav", "saved", "h"], ["nav", "profile", "h"], ["events", "results", "h"], ["profile", "res", "h"], ["res", "lease", "h"],
];

function FlowMap() {
  const [sel, setSel] = useState("results");
  const by = Object.fromEntries(NODES.map(n => [n.id, n]));
  const W = 150, H = 30;
  const node = by[sel];
  return (
    <div className="bm-flow">
      <div className="bm-flow-scroll">
        <svg viewBox="0 0 910 340" className="scene tx-diagram bm-flow-svg" role="group" aria-label="Screen flow. Pick a screen to preview it.">
          {EDGES.map(([a, b, dir]) => {
            const p = by[a], q = by[b];
            const d = dir === "v"
              ? `M${p.x + 30} ${p.y + H} V${q.y}`
              : (() => { const x1 = p.x + W, y1 = p.y + H / 2, x2 = q.x, y2 = q.y + H / 2, mx = x1 + 12; return `M${x1} ${y1} H${mx} V${y2} H${x2}`; })();
            return <path key={a + b} d={d} className="bp" markerEnd="url(#bm-arrow)" />;
          })}
          <defs><marker id="bm-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#fff" /></marker></defs>
          {NODES.map(n => (
            <g key={n.id} className={`bm-node ${sel === n.id ? "on" : ""}`} role="button" tabIndex={0} aria-pressed={sel === n.id} aria-label={n.t}
              onClick={() => setSel(n.id)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(n.id); } }}>
              <rect x={n.x} y={n.y} width={W} height={H} rx="4" />
              <text x={n.x + W / 2} y={n.y + 19} fontSize="10" textAnchor="middle">{n.t}</text>
            </g>
          ))}
          <text x="380" y="190" fontSize="9" className="bp-text">CHOOSE AN EVENT →</text>
          <text x="20" y="20" fontSize="10" className="bp-text">FLOW BY SCREEN NAMES · DESKTOP</text>
        </svg>
      </div>
      <div className="bm-flow-preview" aria-live="polite">
        <span className="label mid">selected</span>
        <h4 className="display" style={{ fontSize: 28, margin: "4px 0 6px" }}>{node.t}</h4>
        <p style={{ margin: "0 0 12px" }}>{node.note}</p>
        {node.src
          ? <div className={`bm-flow-shot ${["d-events.webp", "d-leasing.webp", "d-profile.webp"].includes(node.src) ? "tall" : ""}`} tabIndex={0} aria-label={`${node.t} screen preview`}><img src={A(node.src)} alt={`${node.t} screen`} loading="lazy" /></div>
          : <div className="bm-flow-shot empty"><span className="label">on every screen</span><span>Recommended · Events · Saved · Messages · profile</span></div>}
        {node.src && ["d-events.webp", "d-leasing.webp", "d-profile.webp"].includes(node.src) && <span className="label mid">long page · scroll inside ↕</span>}
      </div>
    </div>
  );
}

// The style guide, rebuilt as live tokens from the Figma file's variables (get_variable_defs on "README for Coders").
const GREYS: [string, string][] = [["50", "#FEFEFE"], ["100", "#F8F8F8"], ["200", "#F1F2F3"], ["300", "#D9D9D9"], ["400", "#B0B0B7"], ["500", "#747476"], ["700", "#5B5D61"], ["900", "#202226"]];
const BRAND: [string, string][] = [["blue-200", "#E9F5FC"], ["blue-300", "#CAE4FF"], ["brand-500", "#007BFF"], ["red", "#EC222E"], ["yellow-500", "#FBBC04"]];
const ROLES: [string, string][] = [["text/primary", "#202226"], ["text/secondary", "#5B5D61"], ["text/tertiary", "#747476"], ["text/inverted", "#FEFEFE"], ["fill/cta", "#007BFF"], ["fill/selected", "#F1F2F3"], ["border/regular", "#D9D9D9"], ["border/bold", "#202226"]];
const TYPE: [string, number, number, number, string][] = [
  ["Heading 1", 24, 600, 1.2, "to be decided (reserved)"], ["Heading 2", 20, 600, 1.5, "page title"], ["Heading 3", 18, 600, 1.5, "listing title + price on details, section titles"],
  ["Large", 16, 400, 1.5, "floating tab title, unselected nav link, emphasised text"], ["Large Semibold", 16, 600, 1.5, "listing title in results, selected nav, CTA, search input"], ["Large Bold", 16, 700, 1.5, "listing title in the payment summary"],
  ["Regular", 14, 400, 1.5, "filter names, listing description, secondary button"], ["Regular Semibold", 14, 600, 1.5, "selected filter names"], ["Regular Bold", 14, 700, 1.5, "sub-section title"],
  ["Petite", 12, 400, 1.2, "date-picker months and years, filters in results"], ["Petite Bold", 12, 700, 1.2, "date-picker numbered dates"],
];
const SHADOWS: [string, string][] = [["ds-floating-tab", "0 4px 20px #14135B1A"], ["ds-floating-tab-selected", "0 4px 4px #14135B26"], ["ds-nav-searchbox", "0 4px 6px #14135B1A"], ["ds-subnav", "0 4px 6px #14135B0A"], ["ds-small-tag", "0 2px 4px #14135B33"], ["ds-upside-down", "0 -2px 4px #14135B1A"]];

const lum = (hex: string) => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

function Swatch({ name, hex }: { name: string; hex: string }) {
  const r = contrast(hex, "#FEFEFE");
  return (
    <li className="bm-sw">
      <span className="bm-sw-chip" style={{ background: hex }} />
      <b>{name}</b><span>{hex}</span>
      <span className={`bm-sw-aa ${r >= 4.5 ? "pass" : ""}`}>{r.toFixed(1)}:1 {r >= 4.5 ? "AA ✓" : "on 50"}</span>
    </li>
  );
}

function StyleGuide() {
  const [k, setK] = useState<"Colour" | "Type" | "Spacing" | "Elevation">("Colour");
  return (
    <div>
      <Chips label="Style guide chapter" items={(["Colour", "Type", "Spacing", "Elevation"] as const).map(x => [x, x] as [typeof x, string])} value={k} onPick={setK} />
      <div className="bm-guide" aria-live="polite">
        {k === "Colour" && (
          <div className="bm-guide-cols">
            <div>
              <p className="bm-guide-h">Greys · Material Design's 10-step scale, 500 as the base</p>
              <ul className="bm-sws">{GREYS.map(([n, h]) => <Swatch key={n} name={n} hex={h} />)}</ul>
              <p className="bm-guide-h">Brand + utility</p>
              <ul className="bm-sws">{BRAND.map(([n, h]) => <Swatch key={n} name={n} hex={h} />)}</ul>
              <p className="bm-guide-note">Every grey from 500 up passes WCAG 4.5:1 on the lightest (50), so 900, 700 and 500 became primary, secondary and tertiary text. Red is for errors only.</p>
            </div>
            <div>
              <p className="bm-guide-h">Variables by role (what a developer reaches for)</p>
              <table className="bm-roles"><tbody>{ROLES.map(([n, h]) => <tr key={n}><td><span className="bm-sw-chip sm" style={{ background: h }} /></td><td><code>*{n}</code></td><td>{h}</td></tr>)}</tbody></table>
            </div>
          </div>
        )}
        {k === "Type" && (
          <table className="bm-type"><tbody>
            {TYPE.map(([n, size, w, lh, use]) => (
              <tr key={n}>
                <td><span style={{ fontSize: size, fontWeight: w, lineHeight: lh }}>{n}</span></td>
                <td><code>Inter {w === 400 ? "Regular" : w === 600 ? "Semi Bold" : "Bold"} · {size}px / {Math.round(lh * 100)}%</code></td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody></table>
        )}
        {k === "Spacing" && (
          <div className="bm-guide-cols">
            <div>
              <p className="bm-guide-h">Row gaps: multiples of 8, in halves and quarters</p>
              <ul className="bm-space">{[2, 4, 8, 12, 16, 20, 24, 32].map(v => <li key={v}><span style={{ width: v * 6 }} /><code>{v}px</code></li>)}</ul>
              <p className="bm-guide-note">Margins: 10px around big components (400px-wide columns), 6–20px for small ones depending on mobile or desktop.</p>
            </div>
            <div>
              <p className="bm-guide-h">A listing card, with its real padding</p>
              <div className="bm-card-spec">
                <div className="bm-card">
                  <div><b>1843 Pointe Crossing St</b><span>4.8 ★★★★★ (23) · 3 min walk</span><span>Overground lot</span><span className="bm-card-tag">Covered</span></div>
                  <div className="bm-card-img">$100</div>
                </div>
                <span className="bm-pad lr">20px</span><span className="bm-pad tb">12px</span>
              </div>
              <p className="bm-guide-note">Desktop listing: 20px left and right, 12px top and bottom. Mobile listing: 6px. Search box on desktop: 10px.</p>
            </div>
          </div>
        )}
        {k === "Elevation" && (
          <div>
            <p className="bm-guide-h">Shadow tokens: soft, blue-tinted, one per job</p>
            <ul className="bm-shadows">{SHADOWS.map(([n, v]) => <li key={n}><span style={{ boxShadow: v }} /><code>{n}</code><small>{v}</small></li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function BmHandoffWide() {
  return (
    <>
      <Band no="05.1" kicker="tap a screen" title="Every screen, and how they connect">
        <p className="tx-measure">The developer's questions were nearly always “what happens after this?”. So we drew it: every screen by name, every path between them. Tap one to see it.</p>
        <FlowMap />
      </Band>
      <Band no="05.2" kicker="a README, in the design file" title="A style guide the developer could build from">
        <p className="tx-measure">Asset files lived apart from design files, built up from atoms, so every screen pulled from one source. Grid rules came from Google's Material Design. Below is that system, rebuilt from the Figma file's own variables: these swatches, type and shadows are live code, not screenshots.</p>
        <StyleGuide />
        <Say pose="csBox" alt="A small Muskaan carrying a box of parts" side="right">Assets in one file, screens in another. Nobody had to guess which button was the real one.</Say>
      </Band>
    </>
  );
}

// ── 06 IMPACT ───────────────────────────────────────────────────────────────
const TAKEAWAYS: [string, string][] = [
  ["Let the people tell you what to build", "We talked to parkers every week. Those conversations produced more ideas than we could have come up with ourselves, and every big pivot (map first, minutes as well as miles) came from them."],
  ["Feasible beats fancy", "Working with a developer taught me to keep designs new enough to matter but buildable in the time we had. Figma variables were brand new then, hard, and worth learning."],
  ["Test after every pass", "Peer testing after each iteration caught usability errors a heuristic review alone would have missed. A three-month timeline meant fast loops, not big reveals."],
];
const TAKEAWAY_ART = [
  <Mini key="talk" pose="bmsTalk" label="A small Muskaan mid-story with two speech bubbles above her" tone="paper" />,
  <Mini key="guide" pose="bmsGuide" label="A small Muskaan holding open a style guide with a grid on it" tone="paper" />,
  <Mini key="loop" pose="bmsLoop" label="A small Muskaan jogging inside a loop of arrows" tone="paper" />,
];

export function BmImpact() {
  return (
    <>
      <p className="tx-lede">So, did it work?</p>
      <p>A complete buyer web app, from the first interview to the developer's last question: search, filters, events, details, checkout and cancellation, on desktop and mobile.</p>
    </>
  );
}

export function BmImpactWide({ next }: { next: { slug: string; label: string } }) {
  return (
    <>
      <Band no="06.1" kicker="the impact, in one line each" title="What changed">
        <div className="tx-loops">
          <LoopCard no="01" title="A search built on what 30 parkers ranked, not on guesses" art={<Mini pose="bmsTapApp" label="A small Muskaan pressing a giant app icon with a P on it" tone="paper" />} />
          <LoopCard no="02" title="Plans change, the money comes back: a full cancel + refund flow" art={<Mini pose="bmsBoomerang" label="A small Muskaan catching a boomerang that came back" tone="paper" />} />
          <LoopCard no="03" title="One design system for desktop and mobile, ready to build" art={<Mini pose="bmsSwatch" label="A small Muskaan fanning out a deck of colour swatches" tone="paper" />} />
        </div>
      </Band>
      <Band no="06.2" kicker="key takeaways" title="What I'm keeping">
        <div className="tx-loops">
          {TAKEAWAYS.map(([t, b], i) => <LoopCard key={t} no={`0${i + 1}`} title={t} art={TAKEAWAY_ART[i]}>{b}</LoopCard>)}
        </div>
      </Band>
      <div className="tx-end">
        <Say pose="csFlag" alt="A small Muskaan planting a flag">Spot found. Flag planted.</Say>
        <p className="tx-measure">This was one of the biggest challenges of my summer: a whole buyer experience, from the first interview to the developer's last question. If you want to talk marketplaces, search, or design systems that developers actually use, I'd love to hear from you.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
          <Chamfer onClick={() => go(`#/case/${next.slug}`)}>Next print → {next.label}</Chamfer>
        </div>
      </div>
      <Dim>end of B2</Dim>
    </>
  );
}

