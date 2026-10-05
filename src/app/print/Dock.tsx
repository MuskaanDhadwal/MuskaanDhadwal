// The way back: a small floating bar at the bottom of every page except Home (after Andrea Da Silva's
// site). Needed because the MD logo opens About instead of Home.
import { useState } from "react";
import { go } from "./nav";

const ICONS: Record<string, string> = {
  home: "M4 11 L12 4 L20 11 M6 9.5 V20 H18 V9.5 M10 20 V15 H14 V20",
  work: "M4 8 H20 V19 H4 Z M9 8 V5 H15 V8 M4 13 H20",
  about: "M12 4.5 a3.5 3.5 0 1 1 0 7 a3.5 3.5 0 1 1 0 -7 M5 20 C6 15.5 9 14 12 14 S18 15.5 19 20",
  contact: "M3 6 H21 V18 H3 Z M3 6 L12 13 L21 6",
};

export function Dock({ page }: { page: string }) {
  const items: [string, string, string, boolean][] = [
    ["home", "Home", "#/", false],
    ["work", "Work", "#/work", page === "case"],
    ["about", "About", "#/about", page === "about"],
    ["contact", "Contact", "#/contact", page === "contact"],
  ];
  return (
    <nav className="dock" aria-label="Quick links">
      {items.map(([icon, label, hash, on]) => (
        <button key={icon} className="dock-btn" onClick={() => go(hash)} aria-label={label} aria-current={on ? "page" : undefined}>
          <svg viewBox="0 0 24 24" aria-hidden><path d={ICONS[icon]} /></svg>
          <span className="dock-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

/** The MD logo (after Andrea Da Silva's site): hover or focus it and three small snapshots pop out from
 * behind it with a "learn about me" tag; click opens About. On About it leads back home instead.
 * Touch screens can't hover, so a tap plays the pop-out for a moment first, then goes. */
const LOGO_SNAPS = ["kayaking.webp", "ink-tiger.webp", "face-api-happy.webp"]; // teasers from further down About (not its top photos)
export function LogoMD({ page }: { page: string }) {
  const onAbout = page === "about";
  const [peek, setPeek] = useState(false);
  const open = () => {
    const to = onAbout ? "#/" : "#/about";
    const touch = matchMedia("(hover: none)").matches, still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || still || peek) { go(to); return; }
    setPeek(true);
    setTimeout(() => { setPeek(false); go(to); }, 900);
  };
  return (
    <button className={`logo-md ${peek ? "peek" : ""}`} onClick={open} aria-label={onAbout ? "Muskaan Dhadwal: back home" : "Learn about Muskaan"}>
      <span className="logo-md-snaps" aria-hidden>
        {LOGO_SNAPS.map((src, i) => <img key={src} className={`logo-md-snap s${i}`} src={`/about/${src}`} alt="" />)}
      </span>
      <span className="logo-stamp" aria-hidden>MD</span>
      <span className="logo-md-tag hand" aria-hidden>{onAbout ? "back home" : "learn about me →"}</span>
    </button>
  );
}
