// Full-size image viewer shared by the Garage and the BuyMySpot persona boards.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Chamfer } from "./ui";

/** Full-size image viewer (also used for the BuyMySpot persona boards). Esc closes, ←/→ step, focus returns. */
export function Lightbox({ title, imgs, start = 0, onClose, wide }: { title: string; imgs: { src: string; alt: string }[]; start?: number; onClose: () => void; wide?: boolean }) {
  const [i, setI] = useState(start);
  const close = useRef<HTMLButtonElement>(null);
  const done = useRef(onClose); done.current = onClose;
  const n = imgs.length;
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    close.current?.focus();
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") done.current();
      if (e.key === "ArrowRight") setI(v => (v + 1) % n);
      if (e.key === "ArrowLeft") setI(v => (v - 1 + n) % n);
    };
    addEventListener("keydown", on);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", on); document.body.style.overflow = ""; prev?.focus(); };
  }, [n]);
  const img = imgs[i];
  // rendered on <body>, above the sticky nav (inside <main> it sat under the nav and hid the close button)
  return createPortal(
    <div className="rs-lb" role="dialog" aria-modal="true" aria-label={`${title}, image ${i + 1} of ${n}`} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`rs-lb-frame ${wide ? "wide" : ""}`}>
        <div className="rs-lb-bar">
          <span className="label">{title}{n > 1 ? ` · ${i + 1}/${n}` : ""}</span>
          <button ref={close} className="rs-lb-x" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="rs-lb-img"><img src={img.src} alt={img.alt} /></div>
        <p className="rs-lb-cap">{img.alt}</p>
        {n > 1 && (
          <div className="rs-lb-nav">
            <Chamfer onClick={() => setI(v => (v - 1 + n) % n)} ariaLabel="Previous image">←</Chamfer>
            <Chamfer onClick={() => setI(v => (v + 1) % n)} ariaLabel="Next image">→</Chamfer>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
