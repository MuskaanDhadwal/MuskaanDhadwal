// The MD logo. One menu only (the sticky top nav, which has Home); the old floating bottom bar was removed
// 2026-10-05 because two menus doing the same job confused people.
import { useState } from "react";
import { go } from "./nav";

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
