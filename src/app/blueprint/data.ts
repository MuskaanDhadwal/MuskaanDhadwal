// Portfolio content — carried over verbatim from the earlier build.
export type MissionSlug = "traxen" | "buymyspot" | "guardiancare" | "gm" | "ecoroute";

export interface Mission {
  slug: MissionSlug; num: string; codename: string; label: string;
  role: string; year: string; clearance: string; brief: string;
  tags: string[]; stats: { label: string; val: string }[];
  img: string; shipName: string; shipClass: string; color: string;
  challenge: string; process: string[]; outcome: string;
}

export const MISSIONS: Mission[] = [
  {
    slug: "traxen", num: "01", codename: "PHANTOM", label: "TRAXEN AI",
    role: "UX Engineer · Project Owner", year: "1 month · 2024", clearance: "TOP SECRET",
    brief: "Truck drivers juggle multiple in-cabin apps — navigation, hours-of-service clocks, fleet tablets. Every context switch pulls attention from the road; the stakes are human lives and fleet compliance data. I designed AND built a non-intrusive floating overlay that lives on top of all apps, delivering the right alert at the right moment.",
    challenge: "Every switch between apps pulled drivers away from Traxen, so safety alerts got missed and drivers engaged less with the system. Any mental effort spent managing apps is attention taken away from driving safely.",
    process: ["Analyzed driver workflows and user needs to define the core pain points", "Interviewed drivers and stakeholders: met Roger, 54, the skeptical adopter", "Ranked every alert by safety priority with a risk-assessment matrix", "Iterated high-fidelity prototypes through stakeholder design critiques", "Built the full-stack MVP and tested it in-vehicle and in simulation"],
    outcome: "Launched a production-ready product to the customer. Adoption went up 94%, with a higher retention rate, lower cognitive load, and happier fleets and drivers.",
    tags: ["Interaction Design", "Android UX", "Safety-Critical", "Full-Stack"],
    stats: [{ label: "ADOPTION", val: "+94%" }, { label: "PLATFORM", val: "ANDROID TABLET" }],
    img: "", shipName: "SR-P1 PHANTOM", shipClass: "STEALTH INTERCEPTOR", color: "#1A52D4",
  },
  {
    slug: "buymyspot", num: "02", codename: "SPECTER", label: "BUYMYSPOT",
    role: "UX Researcher & Designer", year: "Jun–Aug 2023", clearance: "CLASSIFIED",
    brief: "Finding the perfect parking spot should be as simple as booking an Airbnb. Redesigned the buyer-side experience for a peer-to-peer parking marketplace during a Desai Accelerator internship.",
    challenge: "The existing product was a one-column grid with no filters, no event-based booking, and no listing detail page. A 30-participant survey ranking 20 parking attributes surfaced price, proximity, and security as the deciding factors — with a real price/proximity trade-off between two distinct user segments.",
    process: ["30-participant survey ranking 20 parking attributes", "Personas: The Budget Commuter vs. The Convenience Seeker", "Competitive teardown of Airbnb-style booking patterns", "Iterative usability testing that shifted the model toward a map + list hybrid", "Edge cases mapped to Nielsen Norman heuristics — full cancellation & refund flow"],
    outcome: "Shipped a map + list split view, event-based booking, full listing detail pages, and a filter system aligned to real user priorities — replacing a one-column grid with no filters and no listing detail.",
    tags: ["UX Research", "UI Design", "Internship"],
    stats: [{ label: "RESEARCH PARTICIPANTS", val: "30" }, { label: "LAYOUT", val: "MAP + LIST SPLIT" }, { label: "BOOKING MODEL", val: "AIRBNB-STYLE" }, { label: "TEAM", val: "3 + DEV/PM" }],
    img: "", shipName: "GX-S2 SPECTER", shipClass: "RECON VESSEL", color: "#0E7C86",
  },
  {
    slug: "guardiancare", num: "03", codename: "WRAITH", label: "GUARDIANCARE",
    role: "UX Designer & Researcher", year: "Aug–Dec 2023", clearance: "RESTRICTED",
    brief: "Introducing Ava, a personal robot companion for seniors living independently. Designed by a team of four for UMich's SI 612, keeping loved ones assured of safety without sacrificing dignity or autonomy.",
    challenge: "Seniors need support without feeling surveilled or infantilized. Research across 111 survey respondents and contextual inquiries showed falls and missed medication as the top risks — and that continuous monitoring felt intrusive rather than reassuring.",
    process: ["Contextual inquiry across 5 people, 3 categories", "1-week diary studies, twice daily", "111-response survey", "Speed-dating / user enactments — ~100 excerpts", "Co-design workshops shaping Ava's form and interaction model"],
    outcome: "Won Most Likely to Attract Investors and Most Convincing Demo. Ava supports medication management, fall detection via BLE wristband sensors, and real-time caregiver alerts — while preserving seniors' dignity and independence.",
    tags: ["UX Research", "IoT", "Product Design", "Award Winner"],
    stats: [{ label: "SURVEY RESPONSES", val: "111" }, { label: "AWARDS WON", val: "2" }, { label: "TEAM SIZE", val: "4" }, { label: "TYPE", val: "IoT ECOSYSTEM" }],
    img: "", shipName: "VX-W3 WRAITH", shipClass: "LONG-RANGE RECON", color: "#C2410C",
  },
  {
    // Facts only from the SI 594 final presentation (Figma bdSDqOQTI8Ow6KchbINTqS). No teammate names.
    slug: "gm", num: "04", codename: "", label: "LUXURY VEHICLE × GM",
    role: "Product designer · team of 2", year: "Mar – Apr 2024", clearance: "",
    brief: "An in-vehicle experience for GM's luxury customer segment, across four connected surfaces: the central console, the driver display, the front console and a companion phone app.",
    challenge: "", process: [], outcome: "",
    tags: ["Automotive HMI", "In-vehicle UX", "Design system"],
    stats: [], img: "", shipName: "", shipClass: "", color: "#1463FD",
  },
];

export const MISSION_DETAIL: Record<string, {
  painPoints: string; sample: string; constraints: string; regulatory: string;
  context: string; researchSample: string; framework: string;
  designSystem: string; pattern: string; keyInteractions: string;
  legacy: string; platform: string;
}> = {
  traxen: {
    painPoints: "Truck drivers juggle multiple in-cabin apps — navigation, federally required hours-of-service clocks, and sometimes fleet-mandated third-party tablets. Every switch pulled them away from Traxen's interface, risking missed safety alerts and reduced engagement. \"I often struggle to open different apps while driving,\" one driver told me — by the time he switched back, he'd already missed the alert.",
    sample: "Drivers + stakeholders", constraints: "The stakes cut both ways. For the driver: any mental effort spent managing apps is attention taken from the primary task of driving safely. For the business: drivers who forget to open Traxen log less data, limiting fleet insights. Real estate on the tablet was limited but the information was critical, so every feature ran through a risk-assessment matrix balancing functionality against road safety — 76px minimum touch targets, 2-second glanceability, WCAG 4.5:1 contrast in direct sunlight, and never blocking navigation or HOS data.",
    regulatory: "Safety-Critical", context: "the cab of a long-haul truck mid-route", researchSample: "Drivers + stakeholders", framework: "Risk-Assessment Matrix",
    designSystem: "Since the automotive industry offered no direct benchmark, I drew inspiration from non-traditional sources — video recorders and Google Maps. As solo designer, the interface went through real stages of evolution: V1 anchored top bar (too wide, obscured navigation), V2 corner pill (smaller, expand/minimize toggle), and the FINAL draggable floating window — priority-aware and Material 3 compliant.",
    pattern: "Priority-Aware Alerts", keyInteractions: "a 3-tier alert priority system — P1 CRITICAL (ADAS collision warnings via Time-to-Collision data, sound + visual pulse, always visible, must interrupt), P2 HIGH (auto-expanding speed/curve alerts), and P3 AMBIENT (minimized cruise info, single glance, zero interaction). A low-friction Text-to-Speech feedback tool replaced visual menus so drivers stayed heads-up, and a Material 3 dynamic theming system auto-switched light/dark by time of day for glare and night driving.",
    legacy: "Launched a production-ready product to the customer. Adoption went up 94%.", platform: "Android Tablet",
  },
  buymyspot: {
    painPoints: "Our client's objective was a comprehensive buyer experience for their parking startup, plus a revamp of existing screens for intuitiveness — with one hard requirement: identify which search filters users actually rely on when hunting for a spot, and figure out how to surface them. The product buyers actually had was a one-column grid with no filters, no event-based booking, and no listing detail page.",
    sample: "30 Participants", constraints: "We separated asset files from the design folder to keep prototyping fast, and built a style guide + grid rules (many size constants pulled from Google Material Design) so the developer never had to guess. Every edge case — a full cancellation & refund flow, no-results states, minimum-lease errors — was mapped upfront against Nielsen Norman heuristics before he ever had to ad-hoc it.",
    regulatory: "Standard", context: "a 30-participant survey ranking 20 parking attributes, plus driver + host interviews", researchSample: "30 Participants", framework: "Weighted Attribute Ranking",
    designSystem: "Our designs drew heavy inspiration from Airbnb at first. User testing on our initial sketches showed a blend with the Google Maps experience fit our audience better — landing on a map + list split view as the dominant pattern, with desktop and mobile prototypes built in parallel (e.g. a centered filter panel on desktop collapsing to a hamburger on mobile).",
    pattern: "Map + List Split", keyInteractions: "a live map that syncs with a scrollable listing list, a hotel-style calendar date-range picker, event-based spot booking tied to game/event dates, and a full listing detail + profile page with save, reviews, and a sticky Reserve action.",
    legacy: "Shipped a map + list split view, event-based booking, and a filter system aligned to real user priorities during a Desai Accelerator internship, working alongside another designer and the startup's developer + PM. Working with a developer meant learning that a structured style guide and flow chart are non-negotiable — and that testing with real users after each pass caught things heuristics alone would have missed.", platform: "iOS + Web",
  },
  guardiancare: {
    painPoints: "\"Life for seniors can sometimes feel like a fading masterpiece\" — the vibrant colors slowly replaced by the muted tones of routine and isolation. Contextual inquiry (3 seniors, 2 caregivers) plus a 111-response survey surfaced falls and missed medication as the top risks for independently living seniors — and that continuous monitoring felt intrusive rather than reassuring. \"I don't need someone watching me all the time,\" one participant said. \"I just need to know someone is there if I fall.\"",
    sample: "111 Respondents", constraints: "Initial plans for continuous monitoring were deemed intrusive by seniors and caregivers alike, so we narrowed to essential functions: medication, emotional support, critical care. Studies showed people form better emotional connections with robots than with apps or disembodied voices, so Ava took a physical form — and had to empower independence, never infantilize, while integrating an ecosystem of beacons, wristbands, and a mobile app.",
    regulatory: "Care & Privacy", context: "seniors' homes, diary studies, and speed-dating style user enactments (~100 excerpts)", researchSample: "111 Respondents", framework: "Contextual Inquiry + Affinity Mapping",
    designSystem: "This phase is where \"GuardianCare\" — a watchful protector — became \"Ava,\" a warmer, more companionate identity: an expressive touchscreen face mimicking human expression, gesture recognition via computer vision, and a mobile companion app for caregivers.",
    pattern: "Companion-First Ecosystem", keyInteractions: "medication management (scan a prescription, Ava handles the rest), personalized companionship that learns preferences, fall detection through BLE wristband sensors monitoring heart rate and sleep, beacon-based location tracking within the home, and real-time caregiver alerts — designed to preserve dignity and autonomy rather than replace them.",
    legacy: "Won Most Likely to Attract Investors and Most Convincing Demo at UMich's SI 612 showcase, designed by a team of four, most of us international students designing for their own families living far away.", platform: "IoT Ecosystem",
  },
  ecoroute: {
    painPoints: "A single passenger vehicle emits ~4.6 tons of CO₂/year, and sustainable transport could cut that up to 45% — but a car-centric world makes the eco choice the harder one. People wanted to commute sustainably; the friction, not the willingness, was the problem.",
    sample: "87 Respondents", constraints: "Solo-owned 0→1 build on a 4.5-month capstone timeline — every decision, from research to visual system, had to be made and validated without a team to split the load.",
    regulatory: "Standard", context: "in-depth and guerrilla interviews alongside an 87-response Qualtrics survey", researchSample: "87 Respondents", framework: "Competitive + Persona Analysis",
    designSystem: "Built a green-and-black, WCAG-compliant visual system on Material Design grids, replacing a confusing \"Saved Places\" flow and a cluttered pop-up with a clear, grid-aligned UI.",
    pattern: "Multi-Modal Dashboard", keyInteractions: "a dynamic multi-modal dashboard combining cost, time, and weather, location-specific eco tips, a points-based incentive system tied to employer benefits, and dedicated carpooling with a female-only filter for safety.",
    legacy: "Delivered as a complete 0→1 capstone product for SI 699 — researched, designed, and tested solo end to end.", platform: "Mobile App",
  },
};

export const MISSION_IMAGES: Record<string, string[][]> = {
  traxen: [
    ["/case-studies/traxen/hero-overview.png"],
    [],
    ["/case-studies/traxen/storyboard-1.gif", "/case-studies/traxen/storyboard-2.gif"],
    ["/case-studies/traxen/design-evolution.png", "/case-studies/traxen/anatomy-final.png", "/case-studies/traxen/feature-square-1.png", "/case-studies/traxen/feature-square-2.png"],
    ["/case-studies/traxen/dev-cycle-strip.png"],
  ],
  buymyspot: [
    ["/case-studies/buymyspot/before-after.png"],
    ["/case-studies/buymyspot/research-board-2.jpg"],
    ["/case-studies/buymyspot/research-board.png"],
    ["/case-studies/buymyspot/lofi-map-list.png", "/case-studies/buymyspot/split-view-price.jpg", "/case-studies/buymyspot/screen-1.png", "/case-studies/buymyspot/profile-page.png"],
    [],
  ],
  guardiancare: [
    ["/case-studies/guardiancare/hero.png"],
    [],
    ["/case-studies/guardiancare/team-behind-scenes.jpeg"],
    ["/case-studies/guardiancare/screen-app.png", "/case-studies/guardiancare/screen-expressive.png", "/case-studies/guardiancare/screen-wristband.png", "/case-studies/guardiancare/screen-safety.png", "/case-studies/guardiancare/system-architecture.png"],
    [],
  ],
};

export const TRANSMISSIONS = [
  { sender: "RECRUITER_7", cls: "Corporate Drone Class", text: "\"After careful consideration, we've decided to move forward with other candidates. Your portfolio was too fun. It made ours look bad. 📎\"", stardate: "STARDATE 2025.03", status: "SEEN ✓✓", color: "#0E7C86" },
  { sender: "BEST_FRIEND", cls: "Civilian Class", text: "\"I love you but if you explain why that button's affordance is wrong ONE more time I am filing a restraining order. The checkout IS fine.\"", stardate: "STARDATE 2025.01", status: "LEFT ON READ", color: "#4A5878" },
  { sender: "HIRING_MANAGER_404", cls: "Unknown Class", text: "\"Can you make it pop more? Add a carousel? 47 items. Can it load faster? The carousel should also be the homepage. And the about page.\"", stardate: "STARDATE 2024.11", status: "BLOCKED", color: "#D9381E" },
  { sender: "RUBBER_DUCK", cls: "Debug Companion", text: "\"You explained the whole problem to me again. You already knew the answer. You always know the answer. I am a duck.\"", stardate: "STARDATE 2025.02", status: "QUACK", color: "#B7791F" },
];

export const ARCHIVED_PROJECTS: Mission[] = [
  {
    slug: "ecoroute", num: "04", codename: "GREENLINE", label: "ECOROUTE",
    role: "UX Designer & Researcher (Full Ownership)", year: "SI 699 Capstone · 4.5 Months", clearance: "DECLASSIFIED",
    tags: ["Sustainability", "0→1", "Mobile App", "Capstone"],
    color: "#2E7D32",
    brief: "A map-centric sustainable transportation app combining real-time multi-modal routing, carpooling, ticketing, and rewards — built solo end-to-end for my SI 699 capstone, from 0 to a tested product.",
    challenge: "A single passenger vehicle emits ~4.6 tons of CO₂/year, and sustainable transport could cut that up to 45% — but a car-centric world makes the eco choice the harder choice. 87 survey responses plus interviews showed people wanted to commute sustainably; the friction, not the willingness, was the problem.",
    process: ["87-response Qualtrics survey + in-depth and guerrilla interviews", "Competitive analysis of 5 transportation apps", "Persona: The Intentional Commuter — 28, urban professional", "Dynamic multi-modal dashboard + incentive system design", "WCAG-compliant Material Design system, green-and-black visual language"],
    outcome: "Shipped a dynamic multi-modal dashboard, location-specific eco tips, a points-based incentive system, and dedicated carpooling with a female-only filter — replacing a confusing \"Saved Places\" flow and cluttered pop-ups with a clear, grid-aligned UI.",
    stats: [{ label: "SURVEY RESPONSES", val: "87" }, { label: "CO2 CUT POTENTIAL", val: "UP TO 45%" }, { label: "COMPETITORS ANALYZED", val: "5" }, { label: "TYPE", val: "0→1 CAPSTONE" }],
    img: "", shipName: "GL-04 GREENLINE", shipClass: "TRANSIT SCOUT",
  },
];

export const SIDE_QUESTS: { title: string; org: string; year: string; desc: string }[] = [
  { title: "BETA PLATFORM REDESIGN", org: "The Orbit Lab · University of Michigan", year: "2023", desc: "Contextual inquiry + Figma redesign." },
  { title: "EGI WEBSITE + COURSE RESTRUCTURE", org: "Economic Growth Institute · University of Michigan", year: "2023", desc: "Heuristic evaluation + usability improvements." },
  { title: "BASTION — VISUAL & MARKETING", org: "Bastion LLC", year: "2021–2023", desc: "Visual design & marketing collateral in Canva." },
  { title: "ML CROP PREDICTION", org: "Published · TJPR Journal", year: "2021", desc: "Machine learning crop-yield prediction, built in Streamlit." },
];

// ── Case study, deconstructed: one "component" per phase ───────────────────
export interface Phase { num: string; key: string; title: string; caption: string; paragraphs: string[]; facts: { label: string; val: string }[]; images: string[] }

export const PHASE_KEYS = ["Brief", "Challenge", "Process", "Solution", "Impact"];

export function phases(m: Mission): Phase[] {
  const d = MISSION_DETAIL[m.slug];
  const img = MISSION_IMAGES[m.slug] ?? [[], [], [], [], []];
  const team = m.slug === "buymyspot" ? "3 + Dev/PM" : m.slug === "guardiancare" ? "Team of 4" : "Solo";
  return [
    { num: "01", key: "Brief", title: m.label, caption: "where it started", images: img[0],
      paragraphs: [m.brief, `As ${m.role}, I owned the work from early research through the final build.`],
      facts: [{ label: "Role", val: m.role }, { label: "Timeline", val: m.year }, { label: "Platform", val: d.platform }, { label: "Team", val: team }] },
    { num: "02", key: "Challenge", title: "The challenge", caption: "what was broken", images: img[1],
      paragraphs: [m.challenge, d.painPoints, d.constraints],
      facts: [{ label: "Research sample", val: d.sample }, { label: "Context", val: d.regulatory }] },
    { num: "03", key: "Process", title: "The process", caption: "how I found out", images: img[2],
      paragraphs: [`Grounded in ${d.context} — to understand the friction from the inside.`, `Framework: ${d.framework}.`],
      facts: m.process.map((p, i) => ({ label: `Step ${String(i + 1).padStart(2, "0")}`, val: p })) },
    { num: "04", key: "Solution", title: "The solution", caption: "what I built", images: img[3],
      paragraphs: [d.designSystem, `The defining pattern: ${d.keyInteractions}`],
      facts: [{ label: "Core pattern", val: d.pattern }] },
    { num: "05", key: "Impact", title: "The impact", caption: "what changed", images: img[4],
      paragraphs: [m.outcome, d.legacy],
      facts: m.stats.map(s => ({ label: s.label, val: s.val })) },
  ];
}

// ── About ───────────────────────────────────────────────────────────────────
export const BIO = [
  "Hi, I'm Muskaan. I'm a UX Engineer — which means I design AND build my own work. At Traxen AI I lead end-to-end product design for safety-critical trucking software. I believe the best UX is the kind users never notice — because it just works.",
  "I finished my MSI in Human-Computer Interaction at the University of Michigan in 2024, and I've been chasing the seam between design and engineering ever since — from BuyMySpot's buyer marketplace to Traxen's floating in-cab overlay, shipped Figma → Kotlin → Production.",
];
export const SKILLS = [
  { name: "Interaction Design", pct: 92 }, { name: "Systems Thinking", pct: 91 }, { name: "UX Research", pct: 88 },
  { name: "Prototyping", pct: 87 }, { name: "Facilitation", pct: 82 }, { name: "Front-End Dev", pct: 78 },
];
export const TIMELINE = [
  { year: "Oct 2024 – now", role: "UX Engineer", co: "Traxen AI", desc: "Plymouth, MI. Full-stack UX for a safety-critical Android tablet app: floating overlay, ADAS alerts, Figma → Kotlin → Production." },
  { year: "Jun – Aug 2023", role: "UX Researcher & Designer", co: "BuyMySpot", desc: "Desai Accelerator internship, Ann Arbor, MI. Buyer-side UX from scratch — map+list split, event parking, filters." },
  { year: "2022 – 2024", role: "MSI — Human-Computer Interaction", co: "University of Michigan", desc: "School of Information, Ann Arbor. GuardianCare (Ava) won Most Likely to Attract Investors + Most Convincing Demo." },
];
export const SIDE_LIFE = [
  { key: "chef", title: "Amateur chef", text: "Stress-bakes at 11pm. Treats recipes like a design system." },
  { key: "boxes", title: "Compulsive reorganizer", text: "Calls it information architecture. A Notion template for everything." },
  { key: "movie", title: "Bad movie connoisseur", text: "Defends Cats (2019). Unironically." },
  { key: "plant", title: "Plant mom", text: "The snake plant is named Gerald. He's thriving." },
];
export const TOOLS = { design: "Figma, Penpot, Miro, Framer", build: "Android Studio, Kotlin, Claude Code, Cursor", research: "Maze, Dovetail, Notion" };
export const LINKS = [
  { label: "Email", val: "mdhadwal@umich.edu", href: "mailto:mdhadwal@umich.edu" },
  { label: "LinkedIn", val: "/in/muskaan-dhadwal", href: "https://www.linkedin.com/in/muskaan-dhadwal/" },
  { label: "GitHub", val: "/MuskaanDhadwal", href: "https://github.com/MuskaanDhadwal" },
];
