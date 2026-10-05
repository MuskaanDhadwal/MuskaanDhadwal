"""Convert Muskaan's drawings (blue ink on off-white paper) into the transparent PNGs the site uses.

Usage:  put drawings in ./art-src named after their slot (e.g. walk-01.jpg, loader-03.png, name-peek.jpg)
        then run:  python scripts/convert-art.py
Output: public/art/<slot>-white.png (for blue sheets) and public/art/<slot>-ink.png (for paper).
"""
import os, sys
from PIL import Image

SRC, OUT = "art-src", os.path.join("public", "art")
os.makedirs(OUT, exist_ok=True)

def convert(path, slot):
    im = Image.open(path).convert("RGB")
    r = im.getchannel("R"); w, h = im.size
    # paper colour = median of a few edge samples; blue ink is darkest in the red channel
    samples = sorted(r.getpixel(p) for p in [(4, 4), (w - 5, 4), (4, h - 5), (w - 5, h - 5), (w // 2, 4), (4, h // 2)])
    paper = samples[len(samples) // 2] - 6
    alpha = r.point(lambda v: int(max(0, min(1, (paper - v) / 150)) ** 0.85 * 255))
    box = alpha.point(lambda a: 255 if a > 50 else 0).getbbox()
    if not box:
        print(f"skip {slot}: no ink found"); return
    alpha = alpha.crop(box)
    for tone, col in (("white", (255, 255, 255)), ("ink", (30, 70, 176))):
        out = Image.new("RGBA", alpha.size, col + (0,)); out.putalpha(alpha)
        out.thumbnail((900, 900), Image.LANCZOS)
        out.save(os.path.join(OUT, f"{slot}-{tone}.png"), optimize=True)
    print(f"ok   {slot}")

if not os.path.isdir(SRC):
    sys.exit(f"Put drawings in ./{SRC} first.")
for f in sorted(os.listdir(SRC)):
    name, ext = os.path.splitext(f)
    if ext.lower() in (".png", ".jpg", ".jpeg", ".webp"):
        convert(os.path.join(SRC, f), name)
