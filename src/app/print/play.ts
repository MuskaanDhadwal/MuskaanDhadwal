// PLAY — the toy shelf. To add a toy, add an entry here; the Play page renders them in order.
//   kind "embed": another site/app shown inside the page (only loads when the visitor presses Start).
//                 url = the app, poster = an image in /public/play, allow = iframe permissions it needs.
//                 video (optional) = a promo clip; the stage then gets "Watch the promo" / "Try it live" tabs.
//   kind "game":  a toy built into this site; `game` picks the component in PlayPage.tsx (GAMES).
//   kind "link":  just opens somewhere else (for things that can't be embedded).
// Each toy lives here only: its story, video and the live thing together (the AI page just links to it).
export type Toy = {
  id: string; title: string; tag: string; blurb: string; how?: string[]; credit?: string;
  kind: "embed" | "game" | "link";
  url?: string; poster?: string; allow?: string; game?: "pixel"; more?: [string, string];
  video?: { src: string; poster: string; label: string; length: string };
};

export const TOYS: Toy[] = [
  {
    id: "ascii-hands", kind: "embed", title: "ASCII Hands", tag: "built entirely with AI · uses your webcam",
    blurb: "Your hands become the interface: a globe you summon, steer and blow up in the browser. Your webcam does the tracking; nothing to install.",
    how: ["Show your hands: crosshairs track your fingers", "Point both index fingers: summon the globe", "Open your right palm: grab and move it", "Make two fists: detonate"],
    credit: "I built it entirely with AI, on Replit.",
    url: "https://gesture-map-viewer--mdhadwal.replit.app", poster: "/play/ascii-hands.webp", allow: "camera; fullscreen",
    video: { src: "/ai/ascii-hands-promo.mp4", poster: "/ai/ascii-hands-poster.webp", length: "32s · with sound", label: "Promo video for ASCII Hands: your hands become the interface. Summon a globe, steer it, detonate it." },
  },
  {
    id: "pixel", kind: "game", game: "pixel", title: "One pixel off", tag: "a tiny game for detail people",
    blurb: "Six cards. One of them is off. It starts at 8 pixels and ends at 1. My eye twitches at all of them.",
    how: ["Tap the card that's different", "Four rounds: 8px, 4px, 2px, 1px", "Fewer misses, better title"],
  },
];
