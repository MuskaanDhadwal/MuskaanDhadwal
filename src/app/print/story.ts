// Content for the prompt-kit v3 layout. Facts come from the case-study copy (blueprint/data.ts)
// and Muskaan's resume (src/imports/resume.html). Anything unknown is left out, not invented.
import { MISSION_DETAIL, MISSION_IMAGES, MISSIONS, type Mission } from "../blueprint/data";
export { MISSIONS, ARCHIVED_PROJECTS, SIDE_QUESTS, TRANSMISSIONS, LINKS, TOOLS } from "../blueprint/data";

// ── Home: sheet 02 whiteboard — four beats of the story ────────────────────
export const BEATS = [
  { when: "2017–21", text: "B.Tech in Computer Science, SRM IST", doodle: "code" },
  { when: "2022–24", text: "kept redesigning the tools → MSI in HCI, U of Michigan", doodle: "loop" },
  { when: "2023", text: "parkers + seniors taught me: users > specs", doodle: "people" },
  { when: "2024 → now", text: "now I design AND build — Traxen, Figma → Kotlin", doodle: "both" },
];

// ── Home: sheet 03 coffee break ─────────────────────────────────────────────
// READING / LEARNING are left blank on purpose — fill them in and they appear.
export const NOW: [string, string][] = [
  ["Building", "Traxen's in-cab iQ-Cruise tablet app — Figma → Kotlin → production"],
  ["Reading", ""],
  ["Learning", ""],
  ["Open to", "UX engineer / design-technologist roles"],
];

export const PARTS = [
  { no: "01", name: "Figma", use: "daily", icon: "frame" },
  { no: "02", name: "Penpot", use: "mockups", icon: "frame" },
  { no: "03", name: "Android Studio + Kotlin", use: "daily", icon: "phone" },
  { no: "04", name: "Claude · Cursor", use: "AI-assisted builds", icon: "spark" },
  { no: "05", name: "Miro", use: "workshops", icon: "sticky" },
  { no: "06", name: "Maze · Dovetail", use: "research", icon: "magnifier" },
  { no: "07", name: "HTML / CSS / JS · Python", use: "prototypes", icon: "brackets" },
  { no: "08", name: "Notion · Atlassian", use: "keeping it all straight", icon: "list" },
];

// ── Prints (case-study cards) ───────────────────────────────────────────────
export const PRINT: Record<string, { code: string; nick: string; team: string; result: string; shot: string }> = {
  traxen: { code: "T1", nick: "The Cab", team: "solo design + build", result: "+94% adoption", shot: "/case-studies/traxen/hero-overview.png" },
  buymyspot: { code: "B2", nick: "The Block", team: "2 designers + dev/PM", result: "Desktop + mobile", shot: "/case-studies/buymyspot/v2/d-results.webp" },
  guardiancare: { code: "G3", nick: "The Robot", team: "team of 4", result: "2 awards", shot: "/case-studies/guardiancare/v2/ava-a.webp" },
  gm: { code: "V4", nick: "The Cabin", team: "2 designers", result: "4 screens · 1 system", shot: "/case-studies/gm/cc-home-big.webp" },
};

// ── Case studies: exploded drawing = table of contents ─────────────────────
export interface Layer { no: string; part: string; section: string; hook: string }
export interface Brief {
  code: string; object: string; axis: "vertical" | "horizontal";
  layers: Layer[];              // 5 parts (01–05) → sections 02–06; section 01 is the whole object
  bubble: string;               // what the machine says (tail = leader line)
  cameo: string;                // character slot inside the drawing
  constraints: { id: string; constraint: string; must: string; priority: string }[];
  internals: string[];          // schematic nodes for BUILD
  overviewShot: string;         // mapped onto the screen layer
  trace?: [string, string];     // sketch ↔ shipped pair (real assets only)
  gauges: { label: string; from?: string; to: string }[];
  lessons: string[];
  icons: string[];
}

export const BRIEFS: Record<string, Brief> = {
  traxen: {
    code: "T1", object: "the cab", axis: "vertical",
    layers: [
      { no: "01", part: "The driver", section: "Research", hook: "Roger, 54, needs the tablet for his hours and his route. Everything else is noise." },
      { no: "02", part: "The mount", section: "Define", hook: "Limited real estate, critical information: every alert ranked by safety." },
      { no: "03", part: "The tablet", section: "Design", hook: "Top bar → corner pill → a floating window that gets out of the way." },
      { no: "04", part: "The internals", section: "Build", hook: "I built it myself: XML front end, Kotlin, data layer, text-to-speech." },
      { no: "05", part: "The road", section: "Impact", hook: "Adoption up 94%, launched to the customer." },
    ],
    bubble: "curve ahead — ease off",
    cameo: "wrench",
    constraints: [
      { id: "C-01", constraint: "Driver can only glance, never read", must: "make sense at a glance", priority: "P1" },
      { id: "C-02", constraint: "Gloves, vibration, a moving cab", must: "use ≥ 76px touch targets", priority: "P1" },
      { id: "C-03", constraint: "Direct sunlight on the screen", must: "keep ≥ 4.5:1 contrast (WCAG)", priority: "P1" },
      { id: "C-04", constraint: "Navigation + HOS clocks are federally required", must: "never block navigation or HOS data", priority: "P1" },
      { id: "C-05", constraint: "Night and day driving", must: "switch light/dark theme by time of day", priority: "P2" },
    ],
    internals: ["Traxen app data", "Alert priority logic", "Kotlin floating window", "Text-to-speech", "Voice feedback", "Analytics team"],
    overviewShot: "/case-studies/traxen/hero-overview.png",
    gauges: [{ label: "Adoption", to: "+94%" }, { label: "Launched to the customer", to: "Shipped" }, { label: "Design + build", to: "Solo" }],
    lessons: ["Design for the glance, not the stare.", "Owning the build kept the design honest — no fidelity lost in handoff."],
    icons: ["tablet", "truck", "cloud", "voice"],
  },
  buymyspot: {
    code: "B2", object: "the block", axis: "vertical",
    layers: [
      { no: "01", part: "The people", section: "Research", hook: "Two kinds of parkers: one counts dollars, one counts minutes." },
      { no: "02", part: "The spot", section: "Define", hook: "20 attributes, 30 parkers, 3 that mattered: price, proximity, security." },
      { no: "03", part: "The phone", section: "Design", hook: "Airbnb-style first; testing moved us to a map + list hybrid." },
      { no: "04", part: "The plumbing", section: "Handoff", hook: "A style guide and a screen flow, so the developer never had to guess." },
      { no: "05", part: "The street", section: "Impact", hook: "A full buyer web app, handed to the developer for desktop and mobile." },
    ],
    bubble: "spot free from 6pm",
    cameo: "sign",
    constraints: [
      { id: "C-01", constraint: "Budget commuters will walk far to save money", must: "make price comparable at a glance", priority: "P1" },
      { id: "C-02", constraint: "Convenience seekers pay to park close", must: "show distance on the map and in the list", priority: "P1" },
      { id: "C-03", constraint: "Women + non-locals raised personal safety first", must: "treat security as a first-class filter", priority: "P1" },
      { id: "C-04", constraint: "Bookings tied to game and event dates", must: "support event-date search", priority: "P2" },
      { id: "C-05", constraint: "Plans change", must: "include a full cancellation & refund flow", priority: "P2" },
    ],
    internals: ["Search + filters", "Map", "Listing detail", "Booking", "Cancellation + refund", "Messaging"],
    overviewShot: "/case-studies/buymyspot/v2/m-map-peek.webp",
    trace: ["/case-studies/buymyspot/lofi-map-list.png", "/case-studies/buymyspot/split-view-price.jpg"],
    gauges: [{ label: "Parkers surveyed", to: "30" }, { label: "Attributes ranked", to: "20" }, { label: "Desktop + mobile", to: "Handed off" }],
    lessons: ["A clear style guide + flowchart is non-negotiable with a developer.", "Testing after every pass caught what heuristics alone missed."],
    icons: ["phone", "pin", "calendar", "card"],
  },
  guardiancare: {
    code: "G3", object: "the robot", axis: "horizontal",
    layers: [
      { no: "01", part: "The people", section: "Research", hook: "20 IoT ideas, 3 concepts, then a diary study and 111 survey answers." },
      { no: "02", part: "The shell", section: "Define", hook: "Keep them safe without watching them: the monitoring we cut." },
      { no: "03", part: "The face", section: "Design", hook: "A cardboard robot, five enactments, and GuardianCare became Ava." },
      { no: "04", part: "The internals", section: "Build", hook: "Face, drawer, light ring, wristband, beacons and an app." },
      { no: "05", part: "The outcome", section: "Impact", hook: "Two awards at the SI 612 showcase." },
    ],
    bubble: "time for your morning meds",
    cameo: "tape",
    constraints: [
      { id: "C-01", constraint: "Continuous monitoring felt intrusive", must: "only act on meds, falls and emotional support", priority: "P1" },
      { id: "C-02", constraint: "People bond with robots more than apps", must: "have a physical, expressive form", priority: "P1" },
      { id: "C-03", constraint: "Seniors want independence", must: "empower, never infantilise", priority: "P1" },
      { id: "C-04", constraint: "Caregivers live far away", must: "send real-time alerts to a caregiver app", priority: "P2" },
    ],
    internals: ["Expressive touchscreen face", "Gesture recognition (camera)", "BLE wristband", "Home beacons", "Caregiver app", "Medication scanner"],
    overviewShot: "/case-studies/guardiancare/v2/face.webp",
    gauges: [{ label: "Survey responses", to: "111" }, { label: "Awards", to: "2" }, { label: "Team", to: "4" }],
    lessons: ["The most respectful feature was the one we removed: constant monitoring.", "Most of us were designing for our own families far away — that kept it honest."],
    icons: ["robot", "watch", "beacon", "phone"],
  },
  // Luxury Vehicle × GM: only the deck's own facts (SI 594 final presentation). Sheets live in GmCase.tsx.
  gm: {
    code: "V4", object: "the cabin", axis: "vertical",
    layers: [
      { no: "01", part: "The driver", section: "Research", hook: "Millennials at the wheel: personalization drives luxury loyalty." },
      { no: "02", part: "The dashboard", section: "Define", hook: "Comfort, features, convenience, and a theme that's yours." },
      { no: "03", part: "The screens", section: "Design", hook: "Three key decisions: a sky theme, a calmer cluster, a dedicated climate panel." },
      { no: "04", part: "The system", section: "System", hook: "One dark system: five colours, Karla in three sizes, 44px touch targets." },
      { no: "05", part: "The road", section: "Outcome", hook: "Four surfaces that work as one cabin." },
    ],
    bubble: "welcome back, Linda!",
    cameo: "wheel",
    constraints: [],
    internals: [],
    overviewShot: "/case-studies/gm/cc-home-big.webp",
    gauges: [],
    lessons: [],
    icons: ["central console", "driver display", "front console", "phone"],
  },
};

export function sectionText(m: Mission) {
  const d = MISSION_DETAIL[m.slug] ?? ({} as (typeof MISSION_DETAIL)[string]); // GM has its own sheets (GmCase.tsx)
  const img = MISSION_IMAGES[m.slug] ?? [[], [], [], [], []];
  return {
    overview: [m.brief],
    research: [d.painPoints],
    researchSteps: m.process,
    define: [m.challenge, d.constraints],
    design: [d.designSystem, `The defining pattern: ${d.keyInteractions}`],
    build: d.platform,
    impact: [m.outcome, d.legacy],
    images: { overview: img[0], research: img[2].length ? img[2] : img[1], design: img[3], build: img[4] },
  };
}

export const missionBySlug = (slug?: string) => MISSIONS.find(m => m.slug === slug);
