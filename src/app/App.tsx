// Muskaan Dhadwal — Engineering Blueprint × Comic Illustration portfolio (prompt kit v3).
// Earlier versions are kept, unused, in src/app/_cockpit and src/app/blueprint.
import { useCallback, useEffect, useState } from "react";
import "../styles/print.css";
import "../styles/pages.css";
import "../styles/case.css";
import "../styles/buymyspot.css";
import "../styles/resume.css";
import "../styles/extras.css";
import "../styles/gm.css";
import "../styles/gm-sim.css";
import "../styles/gc.css";
import "../styles/about-spec.css";
import { CrayonDefs } from "./print/Character";
import { Mini } from "./print/Minis";
import { CharSheet } from "./print/CharSheet";
import { Home } from "./print/Home";
import { AboutPage } from "./print/AboutPage";
import { ContactPage } from "./print/ContactPage";
import { ResumePage } from "./print/ResumePage";
import { CaseStudy } from "./print/CaseStudy";
import { Loader } from "./print/Loader";
import { GaragePage } from "./print/GaragePage";
import { LabPage } from "./print/LabPage";
import { CaseWalker, TapCursor } from "./print/ui";
import { missionBySlug } from "./print/story";
import { go } from "./print/nav";
import { LogoMD } from "./print/Dock";

type Route = { page: string; slug?: string; anchor?: string };
function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  if (h.startsWith("case/")) return { page: "case", slug: h.slice(5) };
  if (h === "work") return { page: "home", anchor: h };
  if (h === "play" || h === "ai") return { page: "lab" }; // Play + AI became one page, the Lab (old links still work)
  return { page: h || "home" };
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  const [booted, setBooted] = useState(() => // the loader plays once per session, on the way into the homepage (deep links skip it)
    sessionStorage.getItem("md_loaded") === "1" || new URLSearchParams(location.search).has("skiploader") || parse(location.hash).page !== "home");
  const [sheetKey, setSheetKey] = useState(0);
  const [menu, setMenu] = useState(false); // the nav collapses into a menu on narrow screens

  useEffect(() => {
    const on = () => { setRoute(parse(location.hash)); setSheetKey(k => k + 1); setMenu(false); };
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    if (!booted) return;
    if (route.anchor) requestAnimationFrame(() => document.getElementById(route.anchor!)?.scrollIntoView({ behavior: "smooth" }));
    else scrollTo(0, 0);
  }, [route.page, route.slug, route.anchor, booted]);

  const boot = useCallback(() => { sessionStorage.setItem("md_loaded", "1"); setBooted(true); }, []);
  const mission = route.page === "case" ? missionBySlug(route.slug) : undefined;
  const isWork = route.page === "case" || route.anchor === "work";

  return (
    <>
      <CrayonDefs />
      <TapCursor />
      {!booted && <Loader onDone={boot} />}
      <header className="nav">
        <LogoMD page={route.page} />
        <button className="nav-menu-btn label" aria-expanded={menu} aria-controls="main-nav" onClick={() => setMenu(v => !v)}>{menu ? "Close ✕" : "Menu ☰"}</button>
        <nav id="main-nav" className={`nav-links ${menu ? "open" : ""}`} aria-label="Main">
          {([["Home", "#/", route.page === "home" && !route.anchor], ["Work", "#/work", isWork], ["Lab", "#/lab", route.page === "lab"], ["Garage", "#/garage", route.page === "garage"], ["About", "#/about", route.page === "about"], ["Contact", "#/contact", route.page === "contact"], ["Resume", "#/resume", route.page === "resume"]] as [string, string, boolean][]).map(([l, h, on]) => (
            <button key={l} className="nav-link dimlink" aria-current={on ? "page" : undefined} onClick={() => { setMenu(false); go(h); }}>{l}</button>
          ))}
        </nav>
      </header>
      {route.page === "case" && <CaseWalker figure={st => <Mini pose={st ? "walkB" : "walkA"} unit={0.62} />} />}
      {/* debug: ?only=<sheet id> shows just that sheet (for screenshots of long pages) */}
      {new URLSearchParams(location.search).get("only") && <style>{`main section.sheet:not(#${new URLSearchParams(location.search).get("only")}) { display: none; }`}</style>}
      <main key={sheetKey} className="sheet-in">
        {route.page === "home" && <Home />}
        {route.page === "case" && (mission ? <CaseStudy mission={mission} /> : <Home />)}
        {route.page === "garage" && <GaragePage />}
        {route.page === "lab" && <LabPage />}
        {route.page === "about" && <AboutPage />}
        {route.page === "contact" && <ContactPage />}
        {route.page === "resume" && <ResumePage />}
        {route.page === "char" && <CharSheet />}
        {!["home", "case", "lab", "garage", "char", "about", "contact", "resume"].includes(route.page) && <Home />}
      </main>
    </>
  );
}
