// LUXURY VEHICLE × GM — the cabin simulator. Her ORIGINAL screens from the SI 594 deck do the showing:
// the driver display swaps between her default / navigation / voice designs, and the front console is her
// climate panel. Only the central console is rebuilt in code, so the sky theme (Default, Sunrise, Cloudy,
// Sunset, Constellation) can really change; she liked that part (2026-10-05).
//   · Inputs: steering-wheel menu, real voice (Web Speech API, Chrome/Edge/Safari) or typed commands, touch
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

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
    <div className="sim-cc" role="group" aria-label={`Central console, ${page === "home" ? "home" : "theme picker"}, ${sky} sky`}>
      <SkyBackdrop k={sky} />
      <div className="sim-cc-ui">
        <div className="sim-status"><span>{temp}</span><span>3:42 PM</span></div>
        {page === "home" ? (
          <div className="sim-home">
            <div className="sim-greet"><span>Welcome back,</span><b>Linda!</b><small>Get started</small>
              <div className="sim-card sim-cal"><span className="sim-cap">CALENDAR</span><b>Tuesday, Apr 2</b><i>Team Goals · 3:00 PM</i><i>Team Goals · 4:15 PM</i></div>
            </div>
            <div className="sim-card sim-map"><span className="sim-cap">MAP</span><b>Resume Route</b><span className="sim-big">24 <small>km</small> 13 <small>mins</small></span><svg viewBox="0 0 60 60" aria-hidden><circle cx="30" cy="30" r="22" fill="none" stroke={C.azure} strokeWidth="3" /><path d="M30 14 L40 40 L30 34 L20 40 Z" fill="#fff" /></svg></div>
            <div className="sim-card sim-music"><span className="sim-cap">MUSIC</span><b>Cold Water</b><small>Justin Bieber</small><span className="sim-play" aria-hidden><i /><i /><i /></span></div>
          </div>
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

// ── voice + typed commands ─────────────────────────────────────────────────
type Cmd = { mode?: Mode; sky?: Sky; page?: "home" | "themes"; temp?: number; unit?: "C" | "F"; reply: string };
export function parseCommand(raw: string): Cmd | null {
  const t = raw.toLowerCase();
  const num = t.match(/(\d{2})(?:\.\d)?/);
  if (num && (/(temp|degree|warm|cool|°|fahrenheit|celsius|climate|heat)/.test(t) || /^\s*\d{2}(\.\d)?\s*$/.test(t))) {
    const n = +num[1]; const f = /fahrenheit|°f|\bf\b/.test(t) || n > 40;
    const c = f ? Math.round((n - 32) * 5 / 9) : n;
    if (c < 16 || c > 28) return { reply: "Try between 16 and 28 °C (60–82 °F)." };
    return { temp: c, unit: f ? "F" : "C", reply: `Cabin set to ${n}°${f ? "F" : "C"}.` };
  }
  for (const [s, l] of SKIES) if (t.includes(l.toLowerCase()) && s !== "default") return { sky: s, reply: `${l} sky, coming up.` };
  if (/(theme|sky).*(off|default|none)|default (theme|sky)|no (theme|sky)/.test(t)) return { sky: "default", reply: "Plain sky. Got it." };
  if (/theme|sky/.test(t)) return { page: "themes", reply: "Here are the skies." };
  if (/(voice|assistant|listen)/.test(t)) return { mode: "voice", reply: "Voice assistant on. Tap the mic and talk." };
  if (/(navigat|map|route|direction)/.test(t)) return { mode: "nav", reply: "Navigation on." };
  if (/(music|song|play)/.test(t)) return { mode: "nav", reply: "Playing Cold Water." };
  if (/(home|default|cluster|gauge|speed)/.test(t)) return { mode: "default", page: "home", reply: "Back to the default display." };
  return null;
}
type SR = { start: () => void; stop: () => void; abort: () => void; lang: string; interimResults: boolean; maxAlternatives: number; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null };
const getSR = (): (new () => SR) | null => (window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition ?? null;

// ── the simulator ──────────────────────────────────────────────────────────
const DD: Record<Mode, [string, string]> = {
  default: ["dd-default-hi.webp", "Driver display, default mode: a speed dial at left, a compass in the centre, 65% battery and 31 miles of range at right."],
  nav: ["dd-nav-small.webp", "Driver display, navigation mode: a map with 'Turn left onto Clay St, 500 m', speed in the lane view, music on the right."],
  voice: ["dd-voice.webp", "Driver display with the voice assistant listening: the map, the speed, and a glowing 'Listening' shape on the right."],
};
const G = (f: string) => `/case-studies/gm/${f}`;

export function CabinSim() {
  const [mode, setMode] = useState<Mode>("default");
  const [sel, setSel] = useState(0);
  const [sky, setSky] = useState<Sky>("constellation");
  const [page, setPage] = useState<"home" | "themes">("home");
  const [temp, setTemp] = useState(21);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("Try the wheel, the mic, or type “sunset sky”.");
  const [typed, setTyped] = useState("");
  const srRef = useRef<SR | null>(null);
  const supported = typeof window !== "undefined" && !!getSR();

  const run = useCallback((c: Cmd) => {
    if (c.mode) { setMode(c.mode); setSel(MODES.findIndex(m => m[0] === c.mode)); }
    if (c.sky) { setSky(c.sky); setPage("themes"); }
    if (c.page) setPage(c.page);
    if (c.temp !== undefined) setTemp(c.temp);
    if (c.unit) setUnit(c.unit);
    setReply(c.reply);
  }, []);

  const command = (text: string) => {
    setHeard(text);
    const c = parseCommand(text);
    if (c) run(c); else setReply(`Didn't catch “${text}”. Try “navigation”, “sunset sky” or “22 degrees”.`);
  };

  const listen = () => {
    const Ctor = getSR();
    if (!Ctor) { setReply("This browser has no speech recognition. Type a command instead (Chrome, Edge and Safari support voice)."); return; }
    if (listening) { srRef.current?.stop(); return; }
    const r = new Ctor(); srRef.current = r;
    r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = e => { const t = e.results[0][0].transcript; setListening(false); command(t); };
    r.onerror = e => { setListening(false); setReply(e.error === "not-allowed" || e.error === "service-not-allowed" ? "The microphone is blocked. Allow it in the address bar, or type a command instead." : e.error === "no-speech" ? "I didn't hear anything. Tap the mic and speak right away." : `Voice error (${e.error}). Typing works too.`); };
    r.onend = () => setListening(false);
    setMode("voice"); setSel(2); setHeard(""); setReply("Listening…"); setListening(true);
    try { r.start(); } catch { setListening(false); }
  };
  useEffect(() => () => srRef.current?.abort(), []);

  const wheel = (k: "up" | "down" | "prev" | "next" | "ok") => {
    if (k === "up") setSel(v => (v + MODES.length - 1) % MODES.length);
    if (k === "down") setSel(v => (v + 1) % MODES.length);
    if (k === "prev" || k === "next") { const i = (MODES.findIndex(m => m[0] === mode) + (k === "next" ? 1 : MODES.length - 1)) % MODES.length; setMode(MODES[i][0]); setSel(i); setReply(`${MODES[i][1]} mode.`); }
    if (k === "ok") { setMode(MODES[sel][0]); setReply(`${MODES[sel][1]} mode.`); if (MODES[sel][0] === "voice") listen(); }
  };

  const tempLabel = unit === "C" ? `${temp} °C` : `${Math.round(temp * 9 / 5 + 32)} °F`;
  const [src, alt] = DD[mode];
  return (
    <div className="sim">
      <div className="sim-dash">
        <div className="sim-dd-wrap">
          <span className="sim-label label">driver display · 4" × 10" · {MODES.find(m => m[0] === mode)![1].toLowerCase()} mode</span>
          <img key={src} className="sim-dd-img" src={G(src)} alt={alt} />
          {mode === "voice" && heard && <span className="sim-heard">“{heard.slice(0, 40)}”</span>}
        </div>
        <div className="sim-cc-wrap"><span className="sim-label label">central console · 7" × 14" · live: change the sky</span><Console sky={sky} setSky={setSky} page={page} setPage={setPage} temp={tempLabel} /></div>
        <div className="sim-ctrl">
          <span className="sim-label label">the steering wheel · your controls</span>
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
          <button className={`sim-mic ${listening ? "on" : ""}`} onClick={listen} aria-pressed={listening}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M12 3 a3 3 0 0 1 3 3 v6 a3 3 0 0 1 -6 0 v-6 a3 3 0 0 1 3 -3 M6 11 a6 6 0 0 0 12 0 M12 17 v4 M9 21 h6" /></svg>
            {listening ? "Listening… tap to stop" : supported ? "Tap and say a command" : "Voice isn't supported in this browser"}
          </button>
          <form className="sim-type" onSubmit={e => { e.preventDefault(); if (typed.trim()) { command(typed.trim()); setTyped(""); } }}>
            <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="or type: sunset sky · navigation · 22 degrees" aria-label="Type a command" />
            <button type="submit">Go</button>
          </form>
          <p className="sim-reply" aria-live="polite">{reply}</p>
        </div>
        <div className="sim-fc-wrap">
          <span className="sim-label label">front console · 7" × 5"</span>
          <img className="sim-fc-img" src={G("fc-climate-hi.webp")} alt="Front console climate panel: A/C, Auto, On, Off along the top; front and rear temperature sliders at 21°C; sync; two seats with auto buttons; fan and seat-heat controls." />
        </div>
      </div>
    </div>
  );
}
