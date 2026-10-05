// LUXURY VEHICLE × GM — the cabin simulator. Her ORIGINAL screens from the SI 594 deck do the showing:
// the driver display swaps between her default / navigation / voice designs, and the front console is her
// climate panel. Only the central console is rebuilt in code, so the sky theme (Default, Sunrise, Cloudy,
// Sunset, Constellation) can really change; she liked that part (2026-10-05).
//   · Inputs: steering-wheel menu and touch
import { useState, type ReactNode } from "react";

export type Sky = "default" | "sunrise" | "cloudy" | "sunset" | "constellation";
export const SKIES: [Sky, string][] = [["default", "Default"], ["sunrise", "Sunrise"], ["cloudy", "Cloudy"], ["sunset", "Sunset"], ["constellation", "Constellation"]];
type Mode = "default" | "nav" | "voice";
const MODES: [Mode, string][] = [["default", "Default"], ["nav", "Navigation"], ["voice", "Voice"]];
const C = { bg: "#111111", azure: "#1463FD", sky: "#59C1FA", red: "#FF4242", lime: "#9AE77E" };

// ── sky backdrops (shared with the theme picker) ───────────────────────────
export function SkyBackdrop({ k }: { k: Sky }) {
  const stars = [[60, 40], [120, 90], [210, 30], [300, 70], [380, 24], [460, 96], [540, 44], [600, 120], [90, 150], [500, 160], [250, 140], [170, 60]];
  return (
    <svg className="sim-sky" viewBox="0 0 640 320" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {k === "constellation" && <><rect width="640" height="320" fill="#0B1236" />{stars.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 1.4 : 2.2} fill="#fff" opacity=".8" />)}<path d="M420 70 L470 96 L520 84 L548 120 M470 96 L480 140" stroke={C.sky} strokeWidth="1.2" fill="none" opacity=".9" /></>}
      {(k === "sunrise" || k === "sunset") && <><rect width="640" height="320" fill={k === "sunrise" ? "#2A1C2E" : "#2E1430"} /><rect y="140" width="640" height="180" fill={k === "sunrise" ? "#6B3A3C" : "#7A2E52"} /><circle cx="320" cy={k === "sunrise" ? 230 : 262} r="70" fill={k === "sunrise" ? "#E8A04E" : "#E36A8E"} opacity=".55" /><path d="M0 260 L40 200 L80 260 L120 190 L170 260 L520 260 L560 196 L600 260 L640 210 V320 H0 Z" fill="#120E16" /></>}
      {k === "cloudy" && <><rect width="640" height="320" fill="#26303E" /><path d="M80 120 h120 a30 30 0 0 0 0 -60 a46 46 0 0 0 -88 12 a26 26 0 0 0 -32 48 z M400 170 h150 a34 34 0 0 0 0 -68 a52 52 0 0 0 -100 14 a30 30 0 0 0 -50 54 z" fill="#3B4656" /></>}
      {k === "default" && <rect width="640" height="320" fill={C.bg} />}
    </svg>
  );
}
export const SkyIcon = ({ k }: { k: Sky }) => {
  if (k === "cloudy") return <path d="M7 17 h11 a4 4 0 0 0 0 -8 a6 6 0 0 0 -11.4 1.6 A3.4 3.4 0 0 0 7 17 z" />;
  if (k === "constellation") return <path d="M12 4 L13.6 10.4 L20 12 L13.6 13.6 L12 20 L10.4 13.6 L4 12 L10.4 10.4 Z M19 3 l.8 2.2 l2.2 .8 l-2.2 .8 L19 9 l-.8 -2.2 L16 6 l2.2 -.8 z" />;
  if (k === "default") return <path d="M5 19 l9 -9 M12 6 l6 6 M14 4 l1 2 M18 8 l2 1 M16 3 v2" />;
  return <g><path d="M5 18 h14 M8 18 a4 4 0 0 1 8 0" /><path d={k === "sunrise" ? "M12 6 v6 M9.6 8.4 L12 6 l2.4 2.4" : "M12 6 v6 M9.6 9.6 L12 12 l2.4 -2.4"} /></g>;
};

// ── central console (HTML, 2:1) ─────────────────────────────────────────────
function Console({ sky, setSky, page, setPage, temp }: { sky: Sky; setSky: (s: Sky) => void; page: "home" | "themes"; setPage: (p: "home" | "themes") => void; temp: string }) {
  const warm = sky === "sunrise" || sky === "sunset";
  return (
    <div className={`sim-cc ${page === "home" ? "is-original" : ""}`} role="group" aria-label={`Central console, ${page === "home" ? "home" : "theme picker"}, ${sky} sky`}>
      {page !== "home" && <SkyBackdrop k={sky} />}
      <div className="sim-cc-ui">
        {page !== "home" && <div className="sim-status"><span>{temp}</span><span>3:42 PM</span></div>}
        {page === "home" ? (
          <img className="sim-cc-original" src="/case-studies/gm/cc-home-big.webp" alt="Her central console home screen: Welcome back, Linda!, a calendar, Resume Route on the map, and Cold Water playing." />
        ) : (
          <div className="sim-themes">
            <button className={`sim-default ${sky === "default" ? "on" : ""}`} onClick={() => setSky("default")}><svg viewBox="0 0 24 24" aria-hidden><SkyIcon k="default" /></svg>Default</button>
            <div className="sim-tiles">
              {SKIES.slice(1).map(([s, l]) => (
                <button key={s} className={`sim-tile ${sky === s ? "on" : ""} ${sky === s && warm ? "warm" : ""}`} onClick={() => setSky(s)} aria-pressed={sky === s}>
                  <span className="sim-ico"><svg viewBox="0 0 24 24" aria-hidden><SkyIcon k={s} /></svg></span>{l}
                </button>
              ))}
            </div>
          </div>
        )}
        <nav className="sim-nav" aria-label="Console navigation">
          {[["car", "Car"], ["home", "Home"], ["music", "Music"], ["apps", "Themes"], ["nav", "Navigation"], ["phone", "Phone"], ["vol", "Volume"]].map(([k, l]) => {
            const on = (k === "home" && page === "home") || (k === "apps" && page === "themes");
            const act = k === "home" ? () => setPage("home") : k === "apps" ? () => setPage("themes") : undefined;
            return <button key={k} className={`sim-nav-i ${on ? "on" : ""}`} onClick={act} disabled={!act} aria-label={l} aria-current={on ? "page" : undefined}><NavIcon k={k} /></button>;
          })}
        </nav>
      </div>
    </div>
  );
}
function NavIcon({ k }: { k: string }) {
  const d: Record<string, ReactNode> = {
    car: <path d="M4 15 l2 -5 h12 l2 5 v3 h-16 z M7 18 v2 M17 18 v2 M6 13 h12" />,
    home: <path d="M4 11 L12 4 L20 11 V20 H4 Z" />,
    music: <path d="M9 18 a2 2 0 1 1 0 -.1 V6 l9 -2 v12 M18 16 a2 2 0 1 1 0 -.1" />,
    apps: <path d="M5 5 h5 v5 h-5 z M14 5 h5 v5 h-5 z M5 14 h5 v5 h-5 z M14 14 h5 v5 h-5 z" />,
    nav: <path d="M12 3 L19 20 L12 16 L5 20 Z" />,
    phone: <path d="M6 4 h3 l2 5 l-2 1 a10 10 0 0 0 5 5 l1 -2 l5 2 v3 a2 2 0 0 1 -2 2 A15 15 0 0 1 4 6 a2 2 0 0 1 2 -2" />,
    vol: <path d="M4 10 h4 l5 -4 v12 l-5 -4 h-4 z M16 9 a4 4 0 0 1 0 6 M18.5 6.5 a8 8 0 0 1 0 11" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden>{d[k]}</svg>;
}

// ── the simulator ──────────────────────────────────────────────────────────
// Her original screens do the showing; only the console's sky-theme page is rebuilt in code so the sky
// can really change. No voice input (she said it isn't needed, 2026-10-05): the wheel and touch drive it.
const DD: Record<Mode, [string, string]> = {
  default: ["dd-default-hi.webp", "Driver display, default mode: a speed dial at left, a compass in the centre, 65% battery and 31 miles of range at right."],
  nav: ["dd-nav-small.webp", "Driver display, navigation mode: a map with 'Turn left onto Clay St, 500 m', speed in the lane view, music on the right."],
  voice: ["dd-voice.webp", "Driver display with the voice assistant activated: the map, the speed, and a glowing 'Listening' shape on the right."],
};
const G = (f: string) => `/case-studies/gm/${f}`;

export function CabinSim() {
  const [mode, setMode] = useState<Mode>("default");
  const [sel, setSel] = useState(0);
  const [sky, setSky] = useState<Sky>("constellation");
  const [page, setPage] = useState<"home" | "themes">("home");

  const wheel = (k: "up" | "down" | "prev" | "next" | "ok") => {
    if (k === "up") setSel(v => (v + MODES.length - 1) % MODES.length);
    if (k === "down") setSel(v => (v + 1) % MODES.length);
    if (k === "prev" || k === "next") { const i = (MODES.findIndex(m => m[0] === mode) + (k === "next" ? 1 : MODES.length - 1)) % MODES.length; setMode(MODES[i][0]); setSel(i); }
    if (k === "ok") setMode(MODES[sel][0]);
  };

  const [src, alt] = DD[mode];
  return (
    <div className="sim">
      <div className="sim-dash">
        <div className="sim-col">
          <div className="sim-dd-wrap">
            <span className="sim-label label">driver display · 4" × 10" · {MODES.find(m => m[0] === mode)![1].toLowerCase()} mode</span>
            <img key={src} className="sim-dd-img" src={G(src)} alt={alt} />
          </div>
          <div className="sim-ctrl">
            <span className="sim-label label">the steering wheel · press ◀ ▶, or pick with ▲ ▼ and OK</span>
            <div className="sim-wheel-row">
              <div className="gm-pad" role="group" aria-label="Steering-wheel selection menu">
                <button className="up" onClick={() => wheel("up")} aria-label="Menu up">▲</button>
                <button className="prev" onClick={() => wheel("prev")} aria-label="Previous mode">◀</button>
                <button className="ok" onClick={() => wheel("ok")}>OK</button>
                <button className="next" onClick={() => wheel("next")} aria-label="Next mode">▶</button>
                <button className="down" onClick={() => wheel("down")} aria-label="Menu down">▼</button>
              </div>
              <ol className="sim-menu" aria-label="Wheel menu">{MODES.map(([k, l], i) => <li key={k} className={`${i === sel ? "sel" : ""} ${k === mode ? "on" : ""}`}>{l}</li>)}</ol>
            </div>
          </div>
        </div>
        <div className="sim-col">
          <div className="sim-cc-wrap">
            <span className="sim-label label">central console · 7" × 14"</span>
            <div className="tx-toggle sim-cc-tabs" role="group" aria-label="Central console page">
              <button className={`ct-chip ${page === "home" ? "on" : ""}`} aria-pressed={page === "home"} onClick={() => setPage("home")}>Home</button>
              <button className={`ct-chip ${page === "themes" ? "on" : ""}`} aria-pressed={page === "themes"} onClick={() => setPage("themes")}>Sky themes · try them</button>
            </div>
            <Console sky={sky} setSky={setSky} page={page} setPage={setPage} temp="21 °C" />
          </div>
        </div>
      </div>
      <div className="sim-fc-full">
        <span className="sim-label label">front console · 7" × 5" · the climate (HVAC) screen, its own surface</span>
        <img className="sim-fc-img" src={G("fc-climate-hi.webp")} alt="Front console climate panel: A/C, Auto, On, Off along the top; front and rear temperature sliders at 21°C; sync; two seats with auto buttons; fan and seat-heat controls." />
      </div>
    </div>
  );
}
