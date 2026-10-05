// <Art> — one of Muskaan's drawings by slot name. Looks for /art/<slot>-white.png (or -ink on paper);
// if that file doesn't exist yet, it shows the fallback drawing instead. Drop a new drawing in and it just appears.
import { useEffect, useState, type CSSProperties } from "react";

export function Art({ slot, fallback, alt, tone = "white", className, style }: {
  slot: string; fallback: string; alt: string; tone?: "white" | "ink"; className?: string; style?: CSSProperties;
}) {
  const want = `/art/${slot}-${tone}.png`;
  const backup = `/art/${fallback}-${tone}.png`;
  const [src, setSrc] = useState(want);
  useEffect(() => setSrc(want), [want]);
  return <img src={src} alt={alt} className={className} style={style} onError={() => src !== backup && setSrc(backup)} draggable={false} />;
}
