// GARAGE — "jack of all trades" (her phrase, from her Framer page): the side projects that show her range.
// A tool wall of disciplines (each tool is a filter) over one grid: picture projects open in the lightbox,
// notebook projects (no pictures yet) are text cards under Research.
import { useState } from "react";
import { Chamfer } from "./ui";
import { Lightbox } from "./Lightbox";
import { go } from "./nav";
import { PageDrawing } from "./PageDrawings";

type Cat = "Branding" | "Social" | "Posters" | "Infographics" | "Merch" | "AR/VR" | "Research";
type Img = { f: string; alt: string; anim?: boolean };
type Proj = { t: string; cat: Cat; ctx: string; d: string; skills: string[]; imgs: Img[] };
const X = (f: string) => `/extra/${f}`;
const T = (f: string) => `/extra/thumb/${f}`;

const PROJECTS: Proj[] = [
  { t: "OrbAid brand guidelines", cat: "Branding", ctx: "Desai Accelerator · 2023", skills: ["Logo", "Colour", "Type", "App icon"],
    d: "A brand identity for OrbAid, one of the startups I designed for at the Desai Accelerator: moodboard, logo lockups, colour palette, typography, app icon and business cards.",
    imgs: [{ f: "orbaid-hero.webp", alt: "OrbAid brand guidelines cover: a white C-shaped logo with a green leaf on a deep green gradient." }, { f: "orbaid-moodboard.webp", alt: "Moodboard: forest photos, greens and yellows, Outfit typeface, app screens." },
      { f: "orbaid-logo.webp", alt: "Logo page: horizontal and vertical OrbAid lockups, clear space and scalability." }, { f: "orbaid-colors.webp", alt: "Colour page: deep forest, spring green and white as primaries, with secondary accents and usage proportions." },
      { f: "orbaid-type.webp", alt: "Typography page: heading and body styles with sizes and usage." }, { f: "orbaid-icon.webp", alt: "App icon page: the OrbAid mark on green, construction grid, icon variants." },
      { f: "orbaid-cards.webp", alt: "Business cards in green and yellow, stacked and fanned out." }] },
  { t: "Bastion social campaign", cat: "Social", ctx: "Desai Accelerator · 2023", skills: ["Social posts", "Copy", "Survey"],
    d: "Social posts for Bastion, a fitness-coaching startup (“your coach has your back”), plus the customer-discovery survey behind them.",
    imgs: [{ f: "bastion-1.webp", alt: "Post: 'Anywhere, at anytime. Your coach has your back.' with workout photos and a phone." }, { f: "bastion-2.webp", alt: "Post: 'Match with a personalized coach. Start your fitness journey. Become your best self.'" },
      { f: "bastion-3.webp", alt: "Post: 'Can't make it to the gym? Sweat it out at home.'" }, { f: "bastion-4.webp", alt: "Post: 'Ready to take control of your fitness?' with a phone showing a Bastion reminder." },
      { f: "bastion-survey.webp", alt: "The Bastion customer discovery survey in a form builder." }] },
  { t: "World IA Day 2024", cat: "Posters", ctx: "SOCHI, University of Michigan · 2024", skills: ["Poster series", "Event"],
    d: "As Design & Social Media Officer for SOCHI, UMich's student HCI organisation: posters and posts for World Information Architecture Day 2024 and its watch party.",
    imgs: [{ f: "sochi-ia-day.webp", alt: "Poster: 'World IA Day '24' over a grid of circular icons." }, { f: "sochi-ia.webp", alt: "Poster: 'World Information Architecture Day '24' with overlapping circles around 'IA'." },
      { f: "sochi-wiad.webp", alt: "Poster: 'WIAD '24' repeated in large type under a blue and yellow shape, University of Michigan." }, { f: "sochi-watch-party.webp", alt: "Poster: 'Join us for the watch party at 2435 North Quad, March 02 2024, 1–4 PM' with a QR code." },
      { f: "sochi-insta.webp", alt: "Instagram post for the WIAD 2024 watch party." }] },
  { t: "“Put your money where your mouse is”", cat: "Merch", ctx: "modernvivo · merch", skills: ["Apparel", "Print", "Type"],
    d: "Tee and mug designs for modernvivo.",
    imgs: [{ f: "mv-tee.webp", alt: "Black tee: 'Put your money where your mouse is' in stacked type with coloured letter tiles." }, { f: "mv-tees.webp", alt: "Two people wearing the black tees, front and back." },
      { f: "mv-print.webp", alt: "Print artwork: 'modernvivo' repeated in a colour gradient, 'put your money where your mouse is'." }, { f: "mv-back.webp", alt: "The back of the tee with the modernvivo print." },
      { f: "mv-mug.webp", alt: "A black mug with the 'Put your money where your mouse is' design, held in two hands." }] },
  { t: "Course + fan posters", cat: "Posters", ctx: "Graphic design", skills: ["Illustration", "Layout"],
    d: "A course poster for the University of Michigan Biological Station (EEB 453 Field Mammalogy) and a poster of Scooby-Doo's villains.",
    imgs: [{ f: "gd-mammalogy.webp", alt: "Poster: a fox, 'EEB 453 Field Mammalogy, come to UMBS to learn about the natural world', Spring/Summer 23." },
      { f: "gd-villains.webp", alt: "Poster: a grid of Scooby-Doo villains on yellow circles, titled 'Villains/Monsters of Scooby-Doo'." }] },
  { t: "Anatomy of a mango", cat: "Infographics", ctx: "Graphic design", skills: ["Information design", "Illustration"],
    d: "A mango nutrition infographic: its anatomy, nutrition facts, digestive elements and benefits.",
    imgs: [{ f: "gd-mango.webp", alt: "Infographic: the anatomy, nutrition facts, digestive elements and benefits of a mango." }] },
  { t: "VR storybook", cat: "AR/VR", ctx: "", skills: ["3D scenes", "Animation"],
    d: "Scenes from a VR storybook project.",
    imgs: [{ f: "vr-1.webp", alt: "Animation: a storybook scene framed by a stone archway, opening onto a colourful world.", anim: true }, { f: "vr-2.webp", alt: "Animation: another scene inside the stone archway frame.", anim: true }, { f: "vr-3.webp", alt: "Animation: a dim tavern room with a round table under a chandelier.", anim: true }] },
];

// from the notebook: research-heavy projects with no pictures (yet)
const NOTES: { t: string; ctx: string; d: string; skills: string[] }[] = [
  { t: "EcoRoute", ctx: "SI 699 capstone · University of Michigan", skills: ["0 → 1", "Survey", "Interviews"], d: "A map-centric sustainable-transport app: multi-modal routing, carpooling with a women-only filter, ticketing and rewards. Built solo from zero to a tested product, from an 87-response survey and interviews." },
  { t: "Beta platform redesign", ctx: "The Orbit Lab · University of Michigan · 2023", skills: ["Contextual interviews", "Competitive analysis"], d: "Revamped Beta, a research-partner matching platform, from contextual interviews and competitive analysis: new profiles and communication features." },
  { t: "EGI website + course restructure", ctx: "Economic Growth Institute · University of Michigan · 2023", skills: ["Heuristic evaluation"], d: "A heuristic evaluation of the institute's site and courses, then usability fixes." },
];

const count = (c: Cat) => (c === "Research" ? NOTES.length : PROJECTS.filter(p => p.cat === c).length);

// ── the tool wall: one line-drawn tool per discipline, hanging on a pegboard; each is a filter ──
const TOOLS: { c: Cat; tool: string; icon: JSX.Element }[] = [
  { c: "Branding", tool: "pen nib", icon: <path d="M24 6 L36 22 L28 40 H20 L12 22 Z M24 6 V26 M24 30 a3 3 0 1 0 .1 0 M20 40 h8 v4 h-8 z" /> },
  { c: "Social", tool: "megaphone", icon: <path d="M10 20 h8 l18 -10 v28 l-18 -10 h-8 z M14 28 l3 12 h5 l-2 -12 M40 18 q4 6 0 12" /> },
  { c: "Posters", tool: "poster roll", icon: <path d="M10 10 h24 v30 h-24 z M34 10 a4 4 0 0 1 4 4 v28 a4 4 0 0 1 -4 -2 M15 16 h14 M15 21 h10 M15 34 h14" /> },
  { c: "Infographics", tool: "chart", icon: <path d="M8 40 h32 M12 40 v-10 h6 v10 M21 40 v-18 h6 v18 M30 40 v-26 h6 v26 M10 18 l10 -6 l8 4 l10 -8" /> },
  { c: "Merch", tool: "tee", icon: <path d="M16 8 l-10 6 l4 8 l5 -2 v20 h18 v-20 l5 2 l4 -8 l-10 -6 q-4 5 -8 5 q-4 0 -8 -5 z" /> },
  { c: "AR/VR", tool: "headset", icon: <path d="M6 18 h36 v14 h-12 l-4 -5 h-4 l-4 5 h-12 z M14 25 a3 3 0 1 0 .1 0 M34 25 a3 3 0 1 0 .1 0 M6 22 h-3 M42 22 h3" /> },
  { c: "Research", tool: "magnifier", icon: <path d="M20 8 a12 12 0 1 0 .1 0 M29 29 l11 11 M14 20 h12 M20 14 v12" /> },
];

function ToolWall({ cat, setCat }: { cat: "All" | Cat; setCat: (c: "All" | Cat) => void }) {
  return (
    <div className="gr-wall" role="group" aria-label="Filter by discipline">
      <button className={`gr-tool gr-all ${cat === "All" ? "on" : ""}`} aria-pressed={cat === "All"} onClick={() => setCat("All")}>
        <span className="display">All</span><span className="label">{PROJECTS.length + NOTES.length} projects</span>
      </button>
      {TOOLS.map(({ c, tool, icon }, i) => (
        <button key={c} className={`gr-tool ${cat === c ? "on" : ""}`} aria-pressed={cat === c} onClick={() => setCat(cat === c ? "All" : c)}
          style={{ ["--tilt" as string]: `${[-3, 2, -1.5, 3, -2, 1.5, -2.5][i]}deg` }} aria-label={`${c}: ${count(c)} ${count(c) === 1 ? "project" : "projects"}`}>
          <span className="gr-peg" aria-hidden />
          <svg viewBox="0 0 48 48" className="gr-ico" aria-hidden><g>{icon}</g></svg>
          <span className="gr-tool-name">{c}</span>
          <span className="label mid">{tool} · {count(c)}</span>
        </button>
      ))}
    </div>
  );
}

export function GaragePage() {
  const [cat, setCat] = useState<"All" | Cat>("All");
  const [open, setOpen] = useState<{ p: Proj; i: number } | null>(null);
  const list = PROJECTS.filter(p => cat === "All" || p.cat === cat);
  const notes = cat === "All" || cat === "Research" ? NOTES : [];
  return (
    <section className="sheet tx-has-bg" aria-labelledby="gr-title" style={{ minHeight: 0 }}>
      <PageDrawing view="garage" side="right" />
      <div className="rail" aria-hidden><span className="rail-label">Garage · jack of all trades</span><span className="rail-line" /></div>
      <div className="rs-head">
        <div>
          <p className="label mid">Garage · jack of all trades</p>
          <h1 id="gr-title" className="display ab-h1">The garage</h1>
          <p className="ab-lede">Branding, posters, merch, a little VR and a lot of research: the side projects that show the range behind the case studies. Pick a tool off the wall to filter.</p>
        </div>
        <div className="rs-me">
          <span className="ab-bubble hand">mind the paint.</span>
          <img className="kit-hero" src="/art/ld-focused-white.png" alt="Muskaan sitting cross-legged with her laptop, working" />
        </div>
      </div>

      <ToolWall cat={cat} setCat={setCat} />

      <p className="label mid gr-showing" aria-live="polite">{cat === "All" ? "showing everything" : `showing ${cat.toLowerCase()} · ${count(cat)}`}</p>
      <div className="rs-projects gr-prints">
        {list.map(p => {
          const cover = p.imgs[0];
          const n = PROJECTS.indexOf(p) + 1;
          return (
            <article key={p.t} className="rs-proj gr-proj" style={{ ["--tilt" as string]: `${[-1.4, 1.1, -0.8, 1.5, -1.2, 0.9, -1.6][n % 7]}deg` }}>
              <span className="gr-tape" aria-hidden />
              <button className="rs-proj-cover" onClick={() => setOpen({ p, i: 0 })} aria-label={`Open ${p.t}: ${p.imgs.length} ${p.imgs.length === 1 ? "image" : "images"}`}>
                <img src={cover.anim ? T(cover.f.replace(".webp", "-still.webp")) : T(cover.f)} alt="" loading="lazy" />
                <span className="rs-proj-count label">{p.imgs.length} {p.imgs.length === 1 ? "image" : "images"}{cover.anim ? " · animated" : ""}</span>
              </button>
              <div className="rs-proj-body">
                <span className="label gr-spec">SPEC. GR-{String(n).padStart(2, "0")} · {p.cat}{p.ctx && ` · ${p.ctx}`}</span>
                <h3 className="display rs-proj-title">{p.t}</h3>
                <p>{p.d}</p>
                <ul className="gr-skills" aria-label="Skills">{p.skills.map(s => <li key={s}>{s}</li>)}</ul>
                {p.imgs.length > 1 && (
                  <div className="rs-strip">
                    {p.imgs.slice(1, 5).map((im, j) => (
                      <button key={im.f} onClick={() => setOpen({ p, i: j + 1 })} aria-label={`Open image ${j + 2}: ${im.alt}`}>
                        <img src={im.anim ? T(im.f.replace(".webp", "-still.webp")) : T(im.f)} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
        {notes.map(n => (
          <article key={n.t} className="gr-note">
            <span className="label mid">Research · {n.ctx}</span>
            <h3 className="display rs-proj-title">{n.t}</h3>
            <p>{n.d}</p>
            <ul className="gr-skills" aria-label="Skills">{n.skills.map(s => <li key={s}>{s}</li>)}</ul>
            <span className="label mid gr-note-foot">from the notebook · no pictures (yet)</span>
          </article>
        ))}
      </div>

      <div className="ab-end">
        <h2 className="display ab-h2">Like what's parked here?</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
          <Chamfer onClick={() => go("#/work")}>See the case studies</Chamfer>
        </div>
      </div>
      {open && <Lightbox title={open.p.t} imgs={open.p.imgs.map(im => ({ src: X(im.f), alt: im.alt }))} start={open.i} onClose={() => setOpen(null)} />}
    </section>
  );
}
