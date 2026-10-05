// Component kit — names match the Style Bible: Sheet · Sheet Rail · Title Block · Dimension Divider ·
// Callout · Paper Panel · Specimen Frame · Revision Stamp · Spec Table · Chamfered Button · Hotspot.
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

// ── Hooks ───────────────────────────────────────────────────────────────────
export function useReducedMotion() {
  const [r, setR] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

/** True while the element is on screen (`once` keeps it true after the first sighting). */
export function useInView<T extends Element>(ref: RefObject<T>, once = false, margin = "0px") {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); if (once) io.disconnect(); }
      else if (!once) setV(false);
    }, { rootMargin: margin, threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, margin]);
  return v;
}

// ── DRAW: lines draw in once when scrolled into view ───────────────────────
export function Draw({ children, className = "", ...rest }: { children: ReactNode; className?: string } & React.SVGProps<SVGSVGElement>) {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, true);
  return <svg ref={ref} className={`draw ${seen ? "drawn" : ""} ${className}`} {...rest}>{children}</svg>;
}

// ── Character slot (BOIL) ────────────────────────────────────────────────────
// Loads /char/<name>.svg. If <name>-2.svg and <name>-3.svg exist, cycles them at 8fps while on screen.
const variantCache = new Map<string, string[]>();
function useBoilFrames(name: string) {
  const [frames, setFrames] = useState<string[]>(() => variantCache.get(name) ?? [`/char/${name}.svg`]);
  useEffect(() => {
    if (variantCache.has(name)) { setFrames(variantCache.get(name)!); return; }
    const base = `/char/${name}.svg`;
    const tries = [2, 3].map(n => `/char/${name}-${n}.svg`);
    Promise.all(tries.map(src => new Promise<string | null>(res => {
      const img = new Image(); img.onload = () => res(src); img.onerror = () => res(null); img.src = src;
    }))).then(found => {
      const list = [base, ...found.filter(Boolean) as string[]];
      variantCache.set(name, list); setFrames(list);
    });
  }, [name]);
  return frames;
}

export function Character({ name, alt, ink = "white", height = 220, className = "", style }: {
  name: string; alt: string; ink?: "white" | "dark"; height?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const onScreen = useInView(ref);
  const reduced = useReducedMotion();
  const frames = useBoilFrames(name);
  const [f, setF] = useState(0);
  useEffect(() => {
    if (!onScreen || reduced || frames.length < 2) return;
    const id = setInterval(() => setF(x => (x + 1) % frames.length), 125);
    return () => clearInterval(id);
  }, [onScreen, reduced, frames.length]);
  return <img ref={ref} src={frames[f % frames.length]} alt={alt} className={`char ${ink === "dark" ? "ink-dark" : ""} ${className}`} style={{ height, width: "auto", ...style }} draggable={false} />;
}

// ── Sheet scaffolding ───────────────────────────────────────────────────────
export function Sheet({ id, rail, no, time, tone = "blue", title, guides, children, labelledBy }: {
  id?: string; rail: string; no: string; time?: string; tone?: "blue" | "paper" | "night"; guides?: boolean;
  title?: [string, string][]; children: ReactNode; labelledBy?: string;
}) {
  return (
    <section id={id} className={`sheet ${tone === "paper" ? "paper on-paper" : tone === "night" ? "night" : ""}`} aria-labelledby={labelledBy} style={{ scrollMarginTop: 60 }}>
      {guides && <div className="guides" aria-hidden>{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div>}
      <div className="rail" aria-hidden><span className="rail-label">{rail}</span><span className="rail-line" /></div>
      <div className="sheet-no label" aria-hidden>{time && <span className="sheet-time" style={{ marginRight: 14 }}>{time}</span>}SHEET {no}</div>
      <div style={{ position: "relative" }}>{children}</div>
      {title && <TitleBlock rows={title} />}
    </section>
  );
}

export function TitleBlock({ rows }: { rows: [string, string][] }) {
  return <div className="title-block" aria-label="Title block">{rows.flatMap(([k, v]) => [<span key={k} className="mid" style={{ color: "inherit", opacity: .7 }}>{k}</span>, <span key={k + "v"}>{v}</span>])}</div>;
}

export function Dim({ children }: { children: ReactNode }) {
  return <div className="dim" role="separator"><span>{children}</span></div>;
}

export function Callout({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <span className="callout" style={style}>{children}</span>;
}

export function Specimen({ src, alt, caption, style }: { src: string; alt: string; caption: string; style?: React.CSSProperties }) {
  return (
    <figure className="specimen" style={style}>
      <img src={src} alt={alt} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function SpecTable({ rows, caption }: { rows: [string, ReactNode][]; caption?: string }) {
  return (
    <table className="spec-table">
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>{rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
    </table>
  );
}

export function Stamp({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return <span className={`stamp ${accent ? "accent" : ""}`}>{children}</span>;
}

export function Chamfer({ children, onClick, href, solid, external, ariaLabel }: {
  children: ReactNode; onClick?: () => void; href?: string; solid?: boolean; external?: boolean; ariaLabel?: string;
}) {
  const cls = `chamfer ${solid ? "solid" : ""}`;
  if (href) return <a className={cls} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label={ariaLabel}><span>{children}</span></a>;
  return <button className={cls} onClick={onClick} aria-label={ariaLabel}><span>{children}</span></button>;
}

// ── Crosshair "TAP" cursor over illustrations ──────────────────────────────
// Any element with data-tap gets a crosshair + mono label; data-tap="xy" also shows live coordinates.
export function TapCursor() {
  const [s, setS] = useState<{ x: number; y: number; label: string } | null>(null);
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const on = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.("[data-tap]") as HTMLElement | null;
      if (!el) return setS(null);
      const r = el.getBoundingClientRect();
      const xy = el.dataset.tap === "xy" ? ` · X${String(Math.round(e.clientX - r.left)).padStart(3, "0")} Y${String(Math.round(e.clientY - r.top)).padStart(3, "0")}` : "";
      setS({ x: e.clientX, y: e.clientY, label: `TAP${xy}` });
    };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, []);
  if (!s) return null;
  return <div className="tap-cursor" style={{ left: s.x, top: s.y }} aria-hidden>{s.label}</div>;
}

// ── Case-study walker: the same walking her as the homepage rail, with the sheet you're on ──
export function CaseWalker({ figure }: { figure: (step: 0 | 1) => ReactNode }) {
  const reduced = useReducedMotion();
  const [p, setP] = useState(0);
  const [step, setStep] = useState<0 | 1>(0);
  const [moving, setMoving] = useState(false);
  const [label, setLabel] = useState("");
  useEffect(() => {
    let stop = 0;
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setP(max > 0 ? Math.min(1, scrollY / max) : 0);
      setStep((Math.floor(scrollY / 40) % 2) as 0 | 1);
      let cur = "";
      document.querySelectorAll<HTMLElement>("main section.sheet").forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight * 0.35) cur = el.querySelector(".rail-label")?.textContent ?? cur;
      });
      setLabel(cur);
      setMoving(true); clearTimeout(stop); stop = window.setTimeout(() => setMoving(false), 160);
    };
    on(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); clearTimeout(stop); };
  }, []);
  return (
    <>
      <div className="side-rail case-rail" aria-hidden>
        <span className="side-rail-line" />
        <div className="side-rail-me" style={{ top: `calc(${p.toFixed(4)} * (100% - 210px))` }}>
          {figure(reduced || !moving ? 0 : step)}
          {label && <span className="label">{label}</span>}
        </div>
      </div>
      <div className="progress-bar" aria-hidden style={{ width: "100%", transform: `scaleX(${p})` }} />
    </>
  );
}

// ── Rail walker (reading progress) ─────────────────────────────────────────
export function RailWalker({ children }: { children?: ReactNode }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return (
    <>
      <div className="walker" aria-hidden style={{ top: `calc(80px + ${p} * (100vh - 150px))` }}>{children}</div>
      <div className="progress-bar" aria-hidden style={{ width: "100%", transform: `scaleX(${p})` }} />
    </>
  );
}
