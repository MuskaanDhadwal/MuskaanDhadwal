// LUXURY VEHICLE × GM — the cabin simulator: the proposal's three key decisions, rebuilt in code so they
// stay crisp at any size and can actually be driven. Everything shown comes from the SI 594 deck
// (layouts, labels, colours #111111 / #1463FD / #59C1FA / #FF4242 / #9AE77E, Karla); the behaviour is a
// working sketch of what the deck describes, not a claim about a shipped product.
//   · Driver display: default / navigation / voice modes, ADAS "Brake!" alert, speed while driving
//   · Central console: home cards + the sky-theme picker (Default, Sunrise, Cloudy, Sunset, Constellation)
//   · Front console: driver/passenger climate sliders + sync
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

// ── driver display (SVG, 1000 × 400) ───────────────────────────────────────
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
function DriverDisplay({ mode, speed, brake, listening, heard }: { mode: Mode; speed: number; brake: boolean; listening: boolean; heard: string }) {
  const sp = Math.min(1, speed / 140);
  return (
    <svg viewBox="0 0 1000 400" className="sim-dd" role="img" aria-label={`Driver display, ${mode} mode, ${Math.round(speed)} miles per hour${brake ? ", brake warning" : ""}`}>
      <defs><clipPath id="dd-clip"><path d="M40 330 Q20 70 230 50 L770 50 Q980 70 960 330 Q760 380 500 380 Q240 380 40 330 Z" /></clipPath></defs>
      <path d="M40 330 Q20 70 230 50 L770 50 Q980 70 960 330 Q760 380 500 380 Q240 380 40 330 Z" fill="#0D0F14" stroke="#2A2F3A" strokeWidth="2" />
      <g clipPath="url(#dd-clip)">
        {/* top strip */}
        <text x="500" y="84" textAnchor="middle" className="dd-t" fill="#6B7280" fontSize="18" letterSpacing="6">P R N <tspan fill="#fff">D</tspan></text>
        <text x="760" y="96" textAnchor="end" className="dd-t" fill="#C9CED8" fontSize="16">87 miles   65°F   9:41 PM</text>
        {/* warning lights live in the corners the wheel never covers */}
        <circle cx="120" cy="96" r="11" fill="none" stroke={brake ? C.red : "#3A3F4A"} strokeWidth="3" />
        <text x="120" y="102" textAnchor="middle" fontSize="14" fill={brake ? C.red : "#3A3F4A"} fontWeight="700">!</text>
        <path d="M868 88 h16 a8 8 0 0 1 0 16 h-16 z M860 92 h-8 M860 100 h-8" fill="none" stroke={C.lime} strokeWidth="2.4" />
        {mode === "default" ? (
          <>
            <circle cx="230" cy="215" r="122" fill="#111622" />
            <path d={arc(230, 215, 112, 130, 410)} stroke="#262C38" strokeWidth="16" fill="none" />
            <path d={arc(230, 215, 112, 130, 130 + 280 * sp)} stroke={sp > .8 ? C.red : C.azure} strokeWidth="16" fill="none" strokeLinecap="round" className="dd-anim" />
            <text x="230" y="232" textAnchor="middle" fontSize="64" fill="#fff" fontWeight="700" className="dd-t">{Math.round(speed)}</text>
            <text x="230" y="262" textAnchor="middle" fontSize="15" fill="#9AA3B2" className="dd-t">miles/hr</text>
            <circle cx="230" cy="296" r="15" fill="#fff" stroke={C.red} strokeWidth="4" /><text x="230" y="301" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111" className="dd-t">30</text>
            <circle cx="500" cy="215" r="74" fill="none" stroke="#262C38" strokeWidth="1.5" />
            {Array.from({ length: 24 }).map((_, i) => { const a = (i / 24) * Math.PI * 2; return <path key={i} d={`M${500 + Math.cos(a) * 62} ${215 + Math.sin(a) * 62} L${500 + Math.cos(a) * (i % 6 ? 68 : 74)} ${215 + Math.sin(a) * (i % 6 ? 68 : 74)}`} stroke="#9AA3B2" strokeWidth="2" />; })}
            <text x="500" y="212" textAnchor="middle" fontSize="20" fill="#fff" className="dd-t">NW</text>
            <text x="500" y="236" textAnchor="middle" fontSize="15" fill={C.red} className="dd-t">335°</text>
            <circle cx="770" cy="215" r="122" fill="#111622" />
            <path d={arc(770, 215, 112, 20, 160)} stroke="#262C38" strokeWidth="16" fill="none" transform="rotate(180 770 215)" />
            <path d={arc(770, 215, 112, 20, 20 + 140 * 0.65)} stroke={C.azure} strokeWidth="16" fill="none" strokeLinecap="round" transform="rotate(180 770 215)" />
            <text x="770" y="214" textAnchor="middle" fontSize="40" fill="#fff" fontWeight="700" className="dd-t">65 %</text>
            <text x="770" y="246" textAnchor="middle" fontSize="18" fill="#C9CED8" className="dd-t">31 miles</text>
          </>
        ) : (
          <>
            {/* map */}
            <rect x="40" y="110" width="330" height="270" fill="#151924" />
            {[150, 200, 250, 300, 350].map(y => <path key={y} d={`M40 ${y} Q200 ${y - 30} 370 ${y + 10}`} stroke="#262C38" strokeWidth="6" fill="none" />)}
            {[90, 160, 230, 300].map(x => <path key={x} d={`M${x} 110 L${x + 40} 380`} stroke="#262C38" strokeWidth="6" fill="none" />)}
            <path d="M120 380 C140 300 210 290 230 230 S300 140 330 112" stroke={C.azure} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M120 330 l14 -26 l14 26 l-14 -8 z" fill="#fff" />
            <text x="62" y="140" fontSize="16" fill="#fff" className="dd-t">Turn left onto Clay St</text>
            <text x="62" y="162" fontSize="15" fill="#fff" fontWeight="700" className="dd-t">500 m</text>
            {/* lane view */}
            <path d="M420 380 L480 130 M580 130 L640 380" stroke={brake ? C.red : C.azure} strokeWidth="5" fill="none" />
            <path d="M440 380 L490 150 L570 150 L620 380 Z" fill={brake ? "rgba(255,66,66,.16)" : "rgba(20,99,253,.18)"} />
            <text x="530" y="168" textAnchor="middle" fontSize="44" fill="#fff" fontWeight="700" className="dd-t">{Math.round(speed)}</text>
            <text x="530" y="190" textAnchor="middle" fontSize="13" fill="#9AA3B2" className="dd-t">miles/hr</text>
            <rect x="506" y="276" width="48" height="56" rx="12" fill="#E8EAEE" />
            <rect x="514" y="286" width="32" height="14" rx="4" fill="#2A2F3A" />
            {brake && <ellipse cx="530" cy="318" rx="70" ry="22" fill="none" stroke={C.red} strokeWidth="5" className="dd-pulse" />}
            <rect x="476" y="212" width="34" height="38" rx="8" fill="#9AA3B2" /><rect x="560" y="196" width="30" height="34" rx="8" fill="#6B7280" />
            {/* right: music or voice */}
            {mode === "nav" ? (
              <>
                <circle cx="800" cy="215" r="58" fill="none" stroke={C.azure} strokeWidth="3" />
                <circle cx="800" cy="215" r="34" fill="none" stroke={C.azure} strokeWidth="2" opacity=".6" />
                <circle cx="800" cy="215" r="10" fill={C.azure} />
                <text x="800" y="306" textAnchor="middle" fontSize="20" fill="#fff" className="dd-t">Cold Water</text>
                <text x="800" y="328" textAnchor="middle" fontSize="14" fill="#9AA3B2" className="dd-t">Justin Bieber</text>
              </>
            ) : (
              <>
                <g className={listening ? "dd-glow on" : "dd-glow"}>
                  <ellipse cx="800" cy="210" rx="92" ry="70" fill={C.lime} opacity=".28" />
                  <ellipse cx="790" cy="214" rx="66" ry="50" fill={C.sky} opacity=".4" />
                  <ellipse cx="808" cy="222" rx="44" ry="34" fill="#7B4DFF" opacity=".5" />
                </g>
                <text x="800" y="220" textAnchor="middle" fontSize="20" fill="#fff" className="dd-t">{listening ? "Listening" : heard ? "Got it" : "Say a command"}</text>
                {heard && <text x="800" y="318" textAnchor="middle" fontSize="15" fill="#C9CED8" className="dd-t">“{heard.slice(0, 26)}”</text>}
              </>
            )}
          </>
        )}
        {brake && <text x="500" y={mode === "default" ? 330 : 120} textAnchor="middle" fontSize="30" fontWeight="700" fill={C.red} className="dd-t dd-pulse">Brake !</text>}
        <text x="500" y="364" textAnchor="middle" fontSize="15" fill="#C9CED8" className="dd-t">Sport</text>
      </g>
    </svg>
  );
}

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

// ── front console: climate ─────────────────────────────────────────────────
function Climate({ front, rear, setFront, setRear, sync, setSync, unit }: { front: number; rear: number; setFront: (v: number) => void; setRear: (v: number) => void; sync: boolean; setSync: (v: boolean) => void; unit: "C" | "F" }) {
  const show = (c: number) => (unit === "C" ? `${c.toFixed(0)} °C` : `${Math.round(c * 9 / 5 + 32)} °F`);
  const Slider = ({ v, set, label }: { v: number; set: (n: number) => void; label: string }) => (
    <label className="sim-slider">
      <span className="sim-temp">{show(v)}</span>
      <input type="range" min={16} max={28} step={1} value={v} onChange={e => set(+e.target.value)} aria-label={`${label} temperature`} aria-valuetext={show(v)} />
      <span className="sim-cap">{label}</span>
    </label>
  );
  return (
    <div className="sim-fc" role="group" aria-label="Front console climate panel">
      <div className="sim-fc-tabs"><span className="on">A/C</span><span className="on">AUTO</span><span>ON</span><span>OFF</span></div>
      <div className="sim-fc-row">
        <Slider v={front} set={setFront} label="Front" />
        <button className={`sim-sync ${sync ? "on" : ""}`} onClick={() => setSync(!sync)} aria-pressed={sync}>SYNC</button>
        <Slider v={rear} set={setRear} label="Rear" />
      </div>
      <svg viewBox="0 0 200 90" className="sim-seats" aria-hidden>
        {[50, 150].map((x, i) => <g key={x}><path d={`M${x - 16} 80 h32 l3 -18 h-38 z M${x - 12} 62 l-3 -40 a5 5 0 0 1 5 -5 h20 a5 5 0 0 1 5 5 l-3 40 M${x - 6} 12 h12 v-6 h-12 z`} fill="none" stroke="#E8EAEE" strokeWidth="2" strokeLinejoin="round" /><circle cx={x + (i ? -34 : 34)} cy="40" r="11" fill="none" stroke="#9AA3B2" strokeWidth="1.5" /><text x={x + (i ? -34 : 34)} y="43" textAnchor="middle" fontSize="7" fill="#9AA3B2">AUTO</text></g>)}
      </svg>
    </div>
  );
}

// ── voice + typed commands ─────────────────────────────────────────────────
type Cmd = { mode?: Mode; sky?: Sky; page?: "home" | "themes"; temp?: number; unit?: "C" | "F"; sync?: boolean; brake?: boolean; drive?: boolean; reply: string };
export function parseCommand(raw: string): Cmd | null {
  const t = raw.toLowerCase();
  const num = t.match(/(\d{2})(?:\.\d)?/);
  if (num && (/(temp|degree|warm|cool|°|fahrenheit|celsius|climate|heat)/.test(t) || /^\s*\d{2}(\.\d)?\s*$/.test(t))) {
    const n = +num[1]; const f = /fahrenheit|°f|\bf\b/.test(t) || n > 40;
    const c = f ? Math.round((n - 32) * 5 / 9) : n;
    if (c < 16 || c > 28) return { reply: "Try between 16 and 28 °C (60–82 °F)." };
    return { temp: c, unit: f ? "F" : "C", reply: `Cabin set to ${n}°${f ? "F" : "C"}.` };
  }
  if (/sync/.test(t)) return { sync: !/off|un/.test(t), reply: /off|un/.test(t) ? "Zones split." : "Front and rear synced." };
  for (const [s, l] of SKIES) if (t.includes(l.toLowerCase()) && s !== "default") return { sky: s, reply: `${l} sky, coming up.` };
  if (/(theme|sky).*(off|default|none)|default (theme|sky)|no (theme|sky)/.test(t)) return { sky: "default", reply: "Plain sky. Got it." };
  if (/theme|sky/.test(t)) return { page: "themes", reply: "Here are the skies." };
  if (/(voice|assistant|listen)/.test(t)) return { mode: "voice", reply: "Voice assistant on. Tap the mic and talk." };
  if (/(navigat|map|route|direction)/.test(t)) return { mode: "nav", reply: "Navigation on." };
  if (/(music|song|play)/.test(t)) return { mode: "nav", reply: "Playing Cold Water." };
  if (/(home|default|cluster|gauge|speed)/.test(t)) return { mode: "default", page: "home", reply: "Back to the default display." };
  if (/(brake|stop|danger)/.test(t)) return { brake: true, reply: "Demo: the car ahead brakes." };
  if (/(drive|go|start)/.test(t)) return { drive: true, reply: "Off we go." };
  if (/(park|stop driving)/.test(t)) return { drive: false, reply: "Parked." };
  return null;
}
type SR = { start: () => void; stop: () => void; abort: () => void; lang: string; interimResults: boolean; maxAlternatives: number; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null };
const getSR = (): (new () => SR) | null => (window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition ?? null;

// ── the simulator ──────────────────────────────────────────────────────────
export function CabinSim() {
  const [mode, setMode] = useState<Mode>("default");
  const [sel, setSel] = useState(0);
  const [sky, setSky] = useState<Sky>("constellation");
  const [page, setPage] = useState<"home" | "themes">("home");
  const [front, setFrontRaw] = useState(21);
  const [rear, setRearRaw] = useState(21);
  const [sync, setSync] = useState(true);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [brake, setBrake] = useState(false);
  const [driving, setDriving] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("Try the wheel, the mic, or type “set temperature to 22”.");
  const [typed, setTyped] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const srRef = useRef<SR | null>(null);
  const supported = typeof window !== "undefined" && !!getSR();

  const setFront = (v: number) => { setFrontRaw(v); if (sync) setRearRaw(v); };
  const setRear = (v: number) => { setRearRaw(v); if (sync) setFrontRaw(v); };
  const note = (s: string) => setLog(l => [s, ...l].slice(0, 4));

  // speed eases toward 0 or 65 mph while "driving"
  useEffect(() => {
    const target = driving ? (brake ? 18 : 65) : 0;
    const id = setInterval(() => setSpeed(s => (Math.abs(s - target) < 1 ? target : s + (target - s) * 0.12)), 60);
    return () => clearInterval(id);
  }, [driving, brake]);
  useEffect(() => { if (!brake) return; const id = setTimeout(() => setBrake(false), 3200); return () => clearTimeout(id); }, [brake]);

  const run = useCallback((c: Cmd, via: string) => {
    if (c.mode) { setMode(c.mode); setSel(MODES.findIndex(m => m[0] === c.mode)); }
    if (c.sky) { setSky(c.sky); setPage("themes"); }
    if (c.page) setPage(c.page);
    if (c.temp !== undefined) { setFrontRaw(c.temp); if (sync) setRearRaw(c.temp); }
    if (c.unit) setUnit(c.unit);
    if (c.sync !== undefined) setSync(c.sync);
    if (c.brake) { setBrake(true); setDriving(true); }
    if (c.drive !== undefined) setDriving(c.drive);
    setReply(c.reply); note(`${via}: ${c.reply}`);
  }, [sync]);

  const command = (text: string, via: string) => {
    setHeard(text);
    const c = parseCommand(text);
    if (c) run(c, via); else { setReply(`Didn't catch that. Try “navigation”, “sunset sky” or “22 degrees”.`); note(`${via}: “${text}” (no match)`); }
  };

  const listen = () => {
    const Ctor = getSR();
    if (!Ctor) { setReply("This browser has no speech recognition. Type a command below instead (Chrome, Edge and Safari support voice)."); return; }
    if (listening) { srRef.current?.stop(); return; }
    const r = new Ctor(); srRef.current = r;
    r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = e => { const t = e.results[0][0].transcript; setListening(false); command(t, "voice"); };
    r.onerror = e => { setListening(false); setReply(e.error === "not-allowed" || e.error === "service-not-allowed" ? "The microphone is blocked. Allow it in the address bar, or type a command below." : e.error === "no-speech" ? "I didn't hear anything. Tap the mic and speak right away." : `Voice error (${e.error}). Typing works too.`); };
    r.onend = () => setListening(false);
    setMode("voice"); setSel(2); setHeard(""); setReply("Listening…"); setListening(true);
    try { r.start(); } catch { setListening(false); }
  };
  useEffect(() => () => srRef.current?.abort(), []);

  const wheel = (k: "up" | "down" | "prev" | "next" | "ok") => {
    if (k === "up") setSel(v => (v + MODES.length - 1) % MODES.length);
    if (k === "down") setSel(v => (v + 1) % MODES.length);
    if (k === "prev" || k === "next") { const i = (MODES.findIndex(m => m[0] === mode) + (k === "next" ? 1 : MODES.length - 1)) % MODES.length; setMode(MODES[i][0]); setSel(i); note(`wheel: ${MODES[i][1]}`); setReply(`${MODES[i][1]} mode.`); }
    if (k === "ok") { setMode(MODES[sel][0]); note(`wheel: OK → ${MODES[sel][1]}`); setReply(`${MODES[sel][1]} mode.`); if (MODES[sel][0] === "voice") listen(); }
  };

  const tempLabel = unit === "C" ? `${front} °C` : `${Math.round(front * 9 / 5 + 32)} °F`;
  return (
    <div className="sim">
      <div className="sim-dash">
        <div className="sim-dd-wrap"><span className="sim-label label">driver display · 4" × 10"</span><DriverDisplay mode={mode} speed={speed} brake={brake} listening={listening} heard={heard} /></div>
        <div className="sim-cc-wrap"><span className="sim-label label">central console · 7" × 14"</span><Console sky={sky} setSky={s => { setSky(s); note(`touch: ${s} sky`); }} page={page} setPage={setPage} temp={tempLabel} /></div>
        <div className="sim-fc-wrap"><span className="sim-label label">front console · 7" × 5"</span><Climate front={front} rear={rear} setFront={setFront} setRear={setRear} sync={sync} setSync={setSync} unit={unit} /></div>
        <div className="sim-ctrl">
          <span className="sim-label label">your controls</span>
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
          <form className="sim-type" onSubmit={e => { e.preventDefault(); if (typed.trim()) { command(typed.trim(), "typed"); setTyped(""); } }}>
            <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="or type: sunset sky · 22 degrees · navigation" aria-label="Type a command" />
            <button type="submit">Go</button>
          </form>
          <div className="sim-quick">
            <button onClick={() => { setDriving(d => !d); note(driving ? "parked" : "driving"); }} aria-pressed={driving}>{driving ? "■ Park" : "▶ Drive"}</button>
            <button onClick={() => run({ brake: true, reply: "Demo: the car ahead brakes." }, "demo")}>Car ahead brakes</button>
          </div>
          <p className="sim-reply" aria-live="polite">{reply}</p>
          {log.length > 0 && <ul className="sim-log" aria-label="What just happened">{log.map((l, i) => <li key={i + l}>{l}</li>)}</ul>}
        </div>
      </div>
    </div>
  );
}
