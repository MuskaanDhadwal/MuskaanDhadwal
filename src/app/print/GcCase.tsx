// GUARDIANCARE / AVA — the full case study, told as drawing sheets like Traxen, BuyMySpot and GM.
// Sources (the team's own): the Notion case study (copy), the SI 612 Figma reports (survey + diary study plan,
// experience-prototyping results), the persona boards, the Milestone 1 FigJam boards (20 IoT opportunities,
// ideation quotes) and her SI 612 deck. Her rules: no teammate names, every fact in one place.
// Media: public/case-studies/guardiancare/v2 (scripts/process-guardiancare-2026-10.py).
import { useEffect, useRef, useState } from "react";
import { Chamfer, Dim, useInView } from "./ui";
import { Band, LoopCard, Say, Shot } from "./TraxenCase";
import { Lightbox } from "./Lightbox";
import { go } from "./nav";

const A = (f: string) => `/case-studies/guardiancare/v2/${f}`;
function Chips<T extends string>({ items, value, onPick, label }: { items: [T, string][]; value: T; onPick: (v: T) => void; label: string }) {
  return (
    <div className="tx-toggle" role="group" aria-label={label}>
      {items.map(([k, l]) => <button key={k} className={`ct-chip ${value === k ? "on" : ""}`} aria-pressed={value === k} onClick={() => onPick(k)}>{l}</button>)}
    </div>
  );
}

/** A YouTube video that loads only when pressed (privacy-enhanced embed). */
export function Tube({ id, title, poster, caption }: { id: string; title: string; poster: string; caption: string }) {
  const [on, setOn] = useState(false);
  return (
    <figure className="gc-tube">
      <div className="gc-tube-frame">
        {on
          ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          : <button className="gc-tube-poster" onClick={() => setOn(true)} aria-label={`Play the video: ${title}`}><img src={poster} alt="" /><span className="pl-start"><span className="display">▶ Play</span><span className="label">loads YouTube</span></span></button>}
      </div>
      <figcaption className="label">{caption}</figcaption>
    </figure>
  );
}

// ── 01 OVERVIEW ─────────────────────────────────────────────────────────────
export function GcOverview() {
  return (
    <>
      <p className="tx-lede">Ava: a smart, non-intrusive personal robot for seniors who live independently.</p>
      <p>Life for seniors can sometimes feel like a fading masterpiece, the vibrant colours slowly replaced by the muted tones of routine and isolation. Ava assists and enhances their daily life while maintaining their dignity and autonomy, and keeps their loved ones assured of their safety and security.</p>
      <p>Our inspiration came from personal experience: most of our team are international students, and we wanted a system that could support our own families living far away.</p>
    </>
  );
}

// Ava, working: pick a moment of the day and watch the robot, the wristband and the caregiver's phone respond.
type Moment = "idle" | "meds" | "lonely" | "fall";
type Face = "happy" | "wink" | "joy" | "sad" | "alert";
// watch = which of her wristband screens shows (1 hello · 2 fall detected · 3 contacting emergency);
// app = which of her Ava app screens (1 sign in · 2 medication reminder + emergency contacts · 3 contacts)
const MOMENTS: Record<Moment, { label: string; steps: { face: Face; say: string; ring: string; watch: 1 | 2 | 3; app: 1 | 2 | 3; act?: string }[] }> = {
  idle: { label: "All good", steps: [{ face: "happy", say: "Good morning! How did you sleep?", ring: "#5B8CFF", watch: 1, app: 1 }] },
  meds: { label: "9:00 · medicine time", steps: [
    { face: "happy", say: "Time to take your medicine! Your blood-pressure tablet is in the drawer.", ring: "#FF4242", watch: 1, app: 2, act: "Take it" },
    { face: "joy", say: "Great job! I'll let Abbey know.", ring: "#9AE77E", watch: 1, app: 2 },
  ] },
  lonely: { label: "Feeling low", steps: [
    { face: "sad", say: "You seem a little down. Would you like to call someone?", ring: "#5B8CFF", watch: 1, app: 3, act: "Call Rita" },
    { face: "wink", say: "Calling Rita…", ring: "#5B8CFF", watch: 1, app: 3, act: "Hang up" },
    { face: "joy", say: "That was lovely. You two should talk more often!", ring: "#9AE77E", watch: 1, app: 3 },
  ] },
  fall: { label: "A fall in the bathroom", steps: [
    { face: "alert", say: "I felt a fall from your wristband. Are you okay?", ring: "#FF4242", watch: 2, app: 2, act: "No response" },
    { face: "alert", say: "Help is on the way. I've called emergency services and your daughter.", ring: "#FF4242", watch: 3, app: 2 },
    { face: "happy", say: "Stay still. I'm right here with you until help arrives.", ring: "#5B8CFF", watch: 3, app: 2 },
  ] },
};
const WATCH_ALT = ["", "Wristband screen: Ava's robot face saying hello.", "Wristband screen: a yellow warning, severe fall detected.", "Wristband screen: a red light, contacting emergency."];
const APP_ALT = ["", "Ava app: sign-in screen with the robot at the top.", "Ava app: emergency contacts and a medication reminder counting down for Azithromycin.", "Ava app: the contacts list."];
function AvaFace({ face }: { face: Face }) {
  const eye = (x: number) => face === "wink" && x > 0 ? <path d={`M${x - 14} 0 q14 -12 28 0`} /> : face === "sad" ? <path d={`M${x - 14} -4 q14 10 28 0`} /> : <circle cx={x} cy="0" r="15" />;
  return (
    <svg viewBox="-80 -50 160 100" className={`gc-face ${face}`} aria-hidden>
      <g transform="translate(0 -6)">{eye(-34)}{eye(34)}</g>
      {face === "joy" && <path d="M-16 22 q16 22 32 0 z" className="fill" />}
      {face === "happy" && <path d="M-12 24 q6 8 12 0 q6 8 12 0" />}
      {face === "wink" && <path d="M-14 22 q14 14 28 0" />}
      {face === "sad" && <path d="M-12 32 q12 -12 24 0" />}
      {face === "alert" && <><path d="M-10 26 h20" /><path d="M-52 -40 l8 10 M52 -40 l-8 10" /></>}
    </svg>
  );
}
function AvaLive() {
  const [m, setM] = useState<Moment>("idle");
  const [i, setI] = useState(0);
  const st = MOMENTS[m].steps[Math.min(i, MOMENTS[m].steps.length - 1)];
  useEffect(() => { if (m !== "fall" || i !== 1) return; const id = setTimeout(() => setI(2), 3500); return () => clearTimeout(id); }, [m, i]);
  const pick = (k: Moment) => { setM(k); setI(0); };
  return (
    <div className="gc-ava">
      <Chips label="A moment in Brandon's day" value={m} onPick={pick} items={(Object.keys(MOMENTS) as Moment[]).map(k => [k, MOMENTS[k].label])} />
      <div className="gc-ava-stage">
        <div className="gc-robot" aria-live="polite">
          <div className="gc-robot-head"><div className="gc-screen"><AvaFace face={st.face} /></div><span className="gc-ear l" /><span className="gc-ear r" /></div>
          <div className="gc-robot-body">
            <div className={`gc-drawer ${m === "meds" && i === 0 ? "open" : ""}`}><span>meds</span></div>
            <span className="gc-ring" style={{ borderColor: st.ring, boxShadow: `0 0 14px ${st.ring}` }} aria-hidden />
          </div>
          <div className="gc-wheels" aria-hidden><i /><i /></div>
          <p className="gc-say hand">{st.say}</p>
          {st.act && <Chamfer solid onClick={() => setI(v => v + 1)}>{st.act}</Chamfer>}
        </div>
        <div className="gc-devices">
          <figure className="gc-device"><img key={`w${st.watch}`} className="pop" src={A(`watch-${st.watch}.webp`)} alt={WATCH_ALT[st.watch]} /><figcaption className="label">wristband</figcaption></figure>
          <figure className="gc-device"><img key={`a${st.app}`} className="pop" src={A(`app-${st.app}.webp`)} alt={APP_ALT[st.app]} /><figcaption className="label">Ava app</figcaption></figure>
          <p className="label mid gc-devices-note">our wristband and app screens, following the scenarios we storyboarded and enacted</p>
        </div>
      </div>
    </div>
  );
}

export function GcOverviewWide() {
  return (
    <>
      <Band no="01.1" kicker="three things Ava does" title="Meet Ava">
        <div className="gc-three">
          {[["Health monitoring", "Keeps an eye on health metrics and offers gentle reminders for medication."], ["Emergency response", "Notifies designated contacts or emergency services in the event of falls and other health issues."], ["AI companionship", "Adjusts to the senior's comfort with voice assistance, for natural conversation and emotional support."]].map(([t, d], k) => (
            <article key={t} className="gc-feat"><span className="tx-loop-no display">0{k + 1}</span><h4 className="display">{t}</h4><p>{d}</p></article>
          ))}
        </div>
      </Band>
      <Band no="01.2" kicker="try a moment of the day" title="Ava, working"><AvaLive /></Band>
    </>
  );
}

// ── 02 RESEARCH ─────────────────────────────────────────────────────────────
export function GcResearch() {
  return (
    <>
      <p className="tx-lede">From twenty IoT ideas to one robot.</p>
      <p>We brainstormed twenty IoT opportunities, tested three concepts with people, and picked the one they needed most. Then a contextual inquiry, a diary study and a survey told us what seniors and their families actually struggle with.</p>
    </>
  );
}

const CONCEPTS: Record<string, { quotes: [string, string][]; picked?: boolean; note: string }> = {
  "Smart Suit": { note: "Posture correction through a pressure-sensing suit.", quotes: [["Safety is definitely a concern, especially since I'll be wearing it for extended periods. It has to be comfortable… not restrict movement.", "P1"], ["I am concerned on the comfort, especially for a suit. Also, any radiation from the tech used.", "P7"]] },
  "Senior Helper": { picked: true, note: "Support for seniors living alone, and peace of mind for their families.", quotes: [["… a report would be very good, especially making sure they take medicines and get faster help in case of emergencies.", "P2"], ["An alarm system or notification of fall would be really helpful. The numbers of immediate contact should be handy in such scenarios.", "P5"], ["[After taking a fall in the bathroom] We do not want to bother anyone, I can take local help, don't worry!", "P11"]] },
  "Smart Resume": { note: "Smarter job applications and career fairs.", quotes: [["My major issue is there is no feedback and there is no way of knowing if they have read it.", "P6"], ["At career fairs, I need more information about the companies than they need information about me.", "P12"]] },
};
function Funnel() {
  const [c, setC] = useState("Senior Helper");
  const x = CONCEPTS[c];
  return (
    <div className="tx-split" style={{ alignItems: "start" }}>
      <div>
        <svg viewBox="0 0 420 250" className="tx-diagram" role="img" aria-label="A funnel: 20 IoT opportunities, narrowed to 3 concepts, narrowed to 1">
          <path d="M10 20 H410 L290 120 H130 Z" className="bp" /><path d="M130 130 H290 L240 200 H180 Z" className="bp" /><path d="M180 210 H240 V240 H180 Z" className="bp" style={{ fill: "var(--white)" }} />
          <text x="210" y="54" textAnchor="middle" className="bp-text" fontSize="14">20 IOT OPPORTUNITIES</text>
          <text x="210" y="74" textAnchor="middle" className="bp-text" fontSize="9">AUTOMATE · AUGMENT</text>
          <text x="210" y="88" textAnchor="middle" className="bp-text" fontSize="9">INTEGRATE · INTERRUPT</text>
          <text x="210" y="170" textAnchor="middle" className="bp-text" fontSize="12">3 CONCEPTS</text>
          <text x="210" y="230" textAnchor="middle" fontSize="13" fill="var(--blueprint-dk)" style={{ fontFamily: "var(--mono)" }}>1</text>
        </svg>
        <p>Each idea came from mapping an audience, their environment and the steps of a task, then asking where IoT could automate, augment, integrate or interrupt it.</p>
      </div>
      <div>
        <Chips label="The three concepts" value={c} onPick={setC} items={Object.keys(CONCEPTS).map(k => [k, k + (CONCEPTS[k].picked ? " ✓" : "")] as [string, string])} />
        <p className="label mid">{x.picked ? "the one we built · " : ""}{x.note}</p>
        <div className="gc-quotes">{x.quotes.map(([q, who]) => <blockquote key={who} className="gc-quote"><p>“{q}”</p><cite className="label">{who}</cite></blockquote>)}</div>
      </div>
    </div>
  );
}

const SURVEY: [string, number, string][] = [["Medications", 48, "Seniors faced challenges with taking medication"], ["Alert system", 63, "Caregivers expressed a need for an enhanced alert system"], ["Emotional companionship", 73, "Family members struggled to support seniors' emotional needs"]];
function SurveyBars() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, true);
  return (
    <div ref={ref} className="gc-bars">
      {SURVEY.map(([t, v, d]) => (
        <div key={t} className="gc-bar">
          <div className="gc-bar-head"><b className="display">{t}</b><span className="display gc-bar-v">{v}%</span></div>
          <div className="gc-bar-track"><span style={{ width: seen ? `${v}%` : 0 }} /></div>
          <p>{d}</p>
        </div>
      ))}
    </div>
  );
}

const PERSONAS = {
  brandon: { name: "Brandon", tag: "82 · the senior", img: "persona-brandon.webp", line: "A widower living independently with arthritis. Loves strolls in the park and talking with family.", needs: ["Remember his medication", "Help nearby when he falls", "No cameras watching him"] },
  abbey: { name: "Abbey", tag: "45 · his daughter, a store manager", img: "persona-abbey.webp", line: "Busy, with three kids and a store to run. Her parents don't always tell her about injuries.", needs: ["Know immediately if something happens", "A simple, intuitive system", "Works with her watch and phone"] },
};

export function GcResearchWide() {
  const [p, setP] = useState<keyof typeof PERSONAS>("brandon");
  const [open, setOpen] = useState(false);
  const x = PERSONAS[p];
  return (
    <>
      <Band no="02.1" kicker="milestone 1 · ideation" title="Twenty ideas, three concepts, one pick"><Funnel /></Band>
      <Band no="02.2" kicker="contextual inquiry · 5 people" title="What we heard first">
        <div className="tx-split" style={{ alignItems: "start" }}>
          <div>
            <p>We interviewed three seniors (the primary users) and two family members or caregivers (secondary users, and the most likely buyers). Everyone liked the concept; three themes came out of it.</p>
            <Say pose="csBinoc" alt="A small Muskaan looking through binoculars">Look closer. Then closer.</Say>
          </div>
          <ol className="gc-insights">
            <li><b>Falls happen,</b> and they often need someone else's help.</li>
            <li><b>Forgetting is common,</b> especially medication.</li>
            <li><b>Keep it simple:</b> interactions need to be minimally complex.</li>
          </ol>
        </div>
      </Band>
      <Band no="02.3" kicker="diary study + survey" title="A week of diaries, 111 survey answers">
        <div className="gc-methods">
          <article className="gc-method"><span className="label">diary study · 1 week</span><h4 className="display">3 seniors</h4><p>Logged twice a day, morning and night, in Google Forms (about 5–7 minutes an entry).</p></article>
          <article className="gc-method"><span className="label">diary study · 1 week</span><h4 className="display">2 caregivers</h4><p>Logged once a day (about 3–4 minutes an entry).</p></article>
          <article className="gc-method"><span className="label">survey · Qualtrics</span><h4 className="display">111 responses</h4><p>Demographic, behavioural and attitudinal questions, to reach beyond the diary participants. Mostly India and the US.</p></article>
        </div>
        <p className="label mid" style={{ margin: "20px 0 8px" }}>what the survey said · analysed with affinity mapping</p>
        <SurveyBars />
        <div className="gc-three" style={{ marginTop: 24 }}>
          {[["Established routine", "Seniors rely heavily on consistent habits, often without modern technology."], ["Emotional well-being", "Closely tied to seniors' willingness to accept help and their sense of being valued and engaged."], ["Surprising tech proficiency", "Many seniors use tech devices well, challenging common perceptions, but benefit from recurrent instruction."]].map(([t, d], k) => (
            <article key={t} className="gc-feat"><span className="tx-loop-no display">0{k + 1}</span><h4 className="display">{t}</h4><p>{d}</p></article>
          ))}
        </div>
      </Band>
      <Band no="02.4" kicker="who we designed for" title="Brandon and Abbey">
        <Chips label="Personas" value={p} onPick={setP} items={[["brandon", "Brandon · 82"], ["abbey", "Abbey · 45"]]} />
        <div className="gc-persona">
          <button className="gc-persona-img" onClick={() => setOpen(true)} aria-label={`Open ${x.name}'s full persona board`}><img src={A(x.img)} alt="" /><span className="label">full board ↗</span></button>
          <div>
            <h4 className="display gc-persona-name">{x.name}</h4>
            <p className="label mid">{x.tag}</p>
            <p>{x.line}</p>
            <ul className="gc-needs">{x.needs.map(n => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      </Band>
      {open && <Lightbox title={`${x.name}: persona`} imgs={[{ src: A(x.img), alt: `${x.name}'s persona board: bio, personality, skills, goals, pain points and needs.` }]} start={0} onClose={() => setOpen(false)} />}
    </>
  );
}

// ── 03 DEFINE ───────────────────────────────────────────────────────────────
export function GcDefine() {
  return (
    <>
      <p className="tx-lede">The kindest feature was the one we cut.</p>
      <p>We started out planning continuous monitoring. Seniors and caregivers both called it intrusive. So the constraints below shaped everything after.</p>
      <p className="tx-hmw">How might we keep seniors <em>safe</em> without <em>watching</em> them?</p>
    </>
  );
}

const CONSTRAINTS: { t: string; was?: string; d: string }[] = [
  { t: "Reduced monitoring", was: "Continuous monitoring", d: "Focus on what matters: medicine management, emotional support and critical care, respecting privacy and autonomy." },
  { t: "A robot, not an app", d: "People form better emotional connections with robots than with mobile apps or disembodied voices." },
  { t: "User independence", d: "Empower seniors, never infantilise them: they stay in control of their lives." },
  { t: "Embedded devices", d: "Beacons, a wristband and a mobile app, for support even away from home and a familiar way to give input." },
];

export function GcDefineWide() {
  const [cut, setCut] = useState(false);
  return (
    <Band no="03.1" kicker="design constraints" title="Four rules we built to">
      <div className="gc-cons">
        {CONSTRAINTS.map((c, k) => (
          <article key={c.t} className="gc-con">
            <span className="tx-loop-no display">0{k + 1}</span>
            {c.was && <s className={`gc-was ${cut ? "cut" : ""}`}>{c.was}</s>}
            <h4 className="display">{c.t}</h4>
            <p>{c.d}</p>
            {c.was && <button className="label dimlink gm-link" onClick={() => setCut(v => !v)}>{cut ? "undo the cut" : "cut continuous monitoring"}</button>}
          </article>
        ))}
      </div>
      <Say pose="csCheck" alt="A small Muskaan ticking off a checklist">Rule one: nobody likes being watched.</Say>
    </Band>
  );
}

// ── 04 DESIGN ───────────────────────────────────────────────────────────────
export function GcDesign() {
  return (
    <>
      <p className="tx-lede">We acted it out before we built it.</p>
      <p>A cardboard robot, five scripted scenarios, three classmates with senior family members and five seniors aged 65 and older. Roughly 100 excerpts later, GuardianCare (a watchful protector) became Ava (a companion).</p>
    </>
  );
}

const UES: { no: string; t: string; d: string; kept: boolean }[] = [
  { no: "UE 1", t: "Response to falls", d: "The wristband detects a fall and alerts the robot, which comforts the senior and judges the severity. If it's serious, it notifies the emergency contact and follows the emergency procedure.", kept: true },
  { no: "UE 2", t: "A new prescription", d: "The senior tells the robot about a new morning blood-pressure tablet and empties it into the input container. Next morning the robot dispenses it and checks it was taken.", kept: true },
  { no: "UE 3", t: "Loneliness", d: "The robot senses a low mood and offers a video call with the grandkids. If the senior doesn't want to talk, it lets the family know so they can call.", kept: true },
  { no: "UE 4", t: "Groceries", d: "The robot helps build a shopping list and orders it. Users preferred buying groceries with family and caregivers, so this feature was cut.", kept: false },
  { no: "UE 5", t: "Bathroom safety check", d: "A long time in the bathroom and a loud noise trigger a check-in. No answer: the primary contact is notified, then secondary contacts. An answer: the alarm is called off.", kept: true },
];
const FOUND: [string, string][] = [
  ["Reminders", "Daily reminders and dispensing, with a gamified approach, could improve the experience."],
  ["Alerts", "Levels of emergency severity help families adjust their response."],
  ["Monitoring", "Users were uncomfortable with cameras, so beacons track location instead."],
  ["Communication", "Users prefer voice over the display, and short, concise information from the robot."],
];
const STORY: [string, string][] = [
  ["story-1.webp", "Ava's components and how they interact with the environment"],
  ["story-2.webp", "Ava reminding the senior to take their medication, and dispensing it"],
  ["story-3.webp", "Ava sensing the senior's mood and offering support"],
  ["story-4.webp", "Ava providing critical care in a medical emergency"],
];

export function GcDesignWide() {
  const [ue, setUe] = useState(0);
  const [s, setS] = useState(0);
  const u = UES[ue];
  return (
    <>
      <Band no="04.1" kicker="speed dating + user enactments" title="Five scenarios, one cardboard robot">
        <div className="tx-split" style={{ alignItems: "start" }}>
          <Shot src={A("enactments.webp")} alt="User enactments: people around a desk with the cardboard robot prototype, a person wearing the cardboard robot head, and handwritten prompt cards." caption="SPEC. G3-04.1 · enactments with the cardboard prototype" />
          <div>
            <div className="tx-toggle" role="group" aria-label="User enactment scenarios">
              {UES.map((x, k) => <button key={x.no} className={`ct-chip ${ue === k ? "on" : ""} ${x.kept ? "" : "gc-cutchip"}`} aria-pressed={ue === k} onClick={() => setUe(k)}>{x.no}</button>)}
            </div>
            <h4 className="display gc-ue-title">{u.t}{!u.kept && <span className="tx-need">cut</span>}</h4>
            <p>{u.d}</p>
            <p className="label mid">we asked: how much automation is right, what feedback is acceptable, how mobile it must be, and how far we can go beyond products like Olly and Kur</p>
          </div>
        </div>
      </Band>
      <Band no="04.2" kicker="what the enactments told us" title="Four findings">
        <div className="gc-found">{FOUND.map(([t, d]) => <article key={t} className="gc-con"><h4 className="display">{t}</h4><p>{d}</p></article>)}</div>
        <p className="tx-measure" style={{ marginTop: 16 }}>Users wanted augmentation, not full automation: the ability to override or change what the system does. That removed cameras altogether, added physical buttons to the robot and the wristband, and cut the grocery helper.</p>
      </Band>
      <Band no="04.3" kicker="storyboards" title="Ava, frame by frame">
        <div className="gc-story">
          <figure className="gc-story-frame"><img src={A(STORY[s][0])} alt={`Storyboard: ${STORY[s][1]}.`} /><figcaption className="label">{String(s + 1).padStart(2, "0")} / 04 · {STORY[s][1]}</figcaption></figure>
          <div style={{ display: "flex", gap: 8 }}>
            <Chamfer onClick={() => setS(v => (v + 3) % 4)} ariaLabel="Previous storyboard">←</Chamfer>
            <Chamfer onClick={() => setS(v => (v + 1) % 4)} ariaLabel="Next storyboard">→</Chamfer>
          </div>
        </div>
      </Band>
    </>
  );
}

// ── 05 BUILD ────────────────────────────────────────────────────────────────
export function GcBuild() {
  return (
    <>
      <p className="tx-lede">A robot, a wristband, some beacons and an app.</p>
      <p>Ava's system combines several technologies into one supportive environment. Tap a part to see what it does.</p>
    </>
  );
}

const PARTS: { k: string; t: string; d: string; img?: string; alt?: string }[] = [
  { k: "face", t: "Expressive interface", d: "A touch screen shows emotive facial expressions, mimicking human interaction for a warm, familiar presence that can reduce loneliness.", img: "face.webp", alt: "Four of Ava's faces in glowing cyan line art: happy, smiling, delighted and sad." },
  { k: "app", t: "Ava mobile app", d: "For seniors and caregivers: preferences, contacts, medication details and critical-care directions. It alerts caregivers and lets them keep an eye on loved ones.", img: "app.webp", alt: "Three phone screens of the Ava app: sign in, a medication reminder countdown for Azithromycin, and a contacts list." },
  { k: "band", t: "Wristband", d: "Works with most fitness bands and smart watches: heart rate, blood pressure and sleep, sent to Ava in real time. Its sensors and BLE detect falls.", img: "watch.webp", alt: "Three smart-watch screens: Ava saying hello, a severe fall detected warning, and contacting emergency." },
  { k: "beacon", t: "Location beacons", d: "Low-energy beacons placed around the home let Ava know which room the senior is in, without cameras." },
  { k: "drawer", t: "Medicine drawer + light ring", d: "The drawer dispenses scheduled medication; a NeoPixel ring shows whether it has been taken." },
  { k: "ai", t: "AI companionship + gestures", d: "Ava learns preferences, chats, plays music and recommends activities; gesture recognition helps her read mood and needs." },
  { k: "safety", t: "Safety + privacy", d: "Emergency alerts notify contacts and services. Data access is strictly limited to authorised people and emergency responders." },
];

export function GcBuildWide() {
  const [k, setK] = useState("face");
  const [ph, setPh] = useState<number | null>(null);
  const x = PARTS.find(p => p.k === k)!;
  const photos = Array.from({ length: 9 }, (_, i) => ({ src: A(`make-${i + 1}.webp`), alt: ["Ava's face on a tablet screen in the cardboard body, with a glowing blue ring.", "The medicine drawer open, a red light ring on its front.", "The side of the robot body with a cardboard arm.", "Ava in a long university hallway, wheels on the floor.", "Ava in a window alcove, winking.", "Ava's screen saying 'Time to take your medicines!'.", "A close-up of Ava's face: two round eyes and a small smile.", "The drawer pulled open with a green light ring: medicine taken.", "A close-up of Ava's wheels."][i] }));
  return (
    <>
      <Band no="05.1" kicker="system architecture" title="Every part, and what it does">
        <div className="gc-sys">
          <div>
            <div className="tx-toggle" role="group" aria-label="Ava's system parts">{PARTS.map(p => <button key={p.k} className={`ct-chip ${k === p.k ? "on" : ""}`} aria-pressed={k === p.k} onClick={() => setK(p.k)}>{p.t}</button>)}</div>
            <h4 className="display gc-ue-title">{x.t}</h4>
            <p>{x.d}</p>
            <Say pose="csLaptop" alt="A small Muskaan typing on a laptop">Every part has one job.</Say>
          </div>
          {x.img ? <Shot src={A(x.img)} alt={x.alt!} caption={`SPEC. G3-05 · ${x.t.toLowerCase()}`} /> : <Shot src={A("architecture.webp")} alt="Ava's system architecture: the senior, wristband, phone, app, robot and the internet, connected by labelled flows like 'user falls and the wristband detects the fall' and 'tells Ava to remind the user'." caption="SPEC. G3-05 · how the parts talk" />}
        </div>
      </Band>
      <Band no="05.2" kicker="creating Ava" title="From cardboard to hallway">
        <p className="tx-measure">We had the most fun building her: a tablet for the face, a drawer for medicine, a light ring for feedback and wheels to get around.</p>
        <div className="gc-make">
          {photos.map((p, i) => <button key={p.src} onClick={() => setPh(i)} aria-label={`Open photo ${i + 1}: ${p.alt}`}><img src={p.src} alt="" loading="lazy" /></button>)}
        </div>
      </Band>
      {ph !== null && <Lightbox title="Creating Ava" imgs={photos} start={ph} onClose={() => setPh(null)} />}
    </>
  );
}

// ── 06 IMPACT ───────────────────────────────────────────────────────────────
export function GcImpact() {
  return (
    <>
      <p className="tx-lede">Two awards at the SI 612 showcase.</p>
      <p>Ava was recognised as the idea <b>Most Likely to Attract Investors</b>, and our team won the <b>Most Convincing Demo</b> among our peers.</p>
    </>
  );
}

const TAKE: [string, string][] = [
  ["Limitations", "Adapting to seniors with very different needs, and spatial access, especially in multi-storey homes."],
  ["Next steps", "Talk to buyers and healthcare organisations, partner with senior-living communities, test with more users, and explore a hoverboard or drone for mobility."],
  ["What the videos taught us", "The real world is less forgiving than our instructors: accessibility for all seniors, energy and weight, building trust, and using existing AI."],
];

export function GcImpactWide({ next }: { next: { slug: string; label: string } }) {
  return (
    <>
      <Band no="06.1" kicker="the showcase" title="Most convincing demo">
        <div className="gc-awards">
          <Shot src={A("awards.webp")} alt="The team of four smiling and holding two award certificates." caption="SPEC. G3-06 · both certificates" />
        </div>
      </Band>
      <Band no="06.2" kicker="reflection" title="What we'd do next">
        <div className="tx-loops gc-take">{TAKE.map(([t, d], i) => <LoopCard key={t} no={`0${i + 1}`} title={t} art={<img src={A(`make-${[7, 9, 4][i]}.webp`)} alt="" />}>{d}</LoopCard>)}</div>
      </Band>
      <div className="tx-end">
        <Say pose="csTrophy" alt="A small Muskaan holding up a trophy">Two certificates. One very proud robot.</Say>
        <p className="tx-measure">Most of us were designing for our own families far away, and that kept it honest. If you work on health, IoT or anything that has to earn people's trust, I'd love to talk.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chamfer solid onClick={() => go("#/contact")}>Say hi →</Chamfer>
        </div>
      </div>
      <Dim>end of G3</Dim>
    </>
  );
}

export const GC_VIDEO = (
  <Tube id="uXC_vBCaO2k" title="Guardian Care" poster={A("make-4.webp")} caption="the project in one video · press play" />
);
