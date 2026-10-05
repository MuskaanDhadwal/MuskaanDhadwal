"""Make a solid silhouette of one of her white line drawings, for the homepage name.

    python scripts/make-solid.py ld-stretch at-wave ...

Reads public/art/<name>-white.png and writes public/art/<name>-solid.png: the same white line, with
everything the line encloses filled in page blue (#2B5CD6), so where she overlaps a letter she covers it.
Small gaps in the line are closed first so an almost-closed outline still counts as inside.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ART = Path(__file__).resolve().parent.parent / "public" / "art"
BLUE = np.array([0x2B, 0x5C, 0xD6], dtype=np.float32)


def seal(mask: np.ndarray, line: np.ndarray) -> None:
    """Draw a line across the bottom of the figure, at the lowest row her lines reach."""
    rows = np.nonzero(line.any(1))[0]
    if not rows.size: return
    r = rows.max()
    cols = np.nonzero(line[max(0, r - 12):r + 1].any(0))[0]
    mask[max(0, r - 1):r + 1, cols.min():cols.max() + 1] = True
    for c in (cols.min(), cols.max()):  # carry the outermost lines down to the seal so no corner stays open
        last = np.nonzero(line[:, c])[0].max()
        mask[last:r + 1, max(0, c - 1):c + 2] = True


def solid(name: str, close: int = 3, seal_bottom: bool = True, blob: int = 0) -> None:
    im = np.asarray(Image.open(ART / f"{name}-white.png").convert("RGBA")).astype(np.float32)
    a = im[..., 3] / 255.0
    line = a > 0.25
    # pad so the flood from the border always reaches around the figure
    pad = close + 2
    closed = ndimage.binary_closing(np.pad(line, pad), structure=np.ones((3, 3)), iterations=close)[pad:-pad, pad:-pad]
    if seal_bottom:  # her poses are cut off at the waist: the bottom edge closes the body
        seal(closed, line)
        low = int(closed.shape[0] * 0.55)  # ...and where the shirt runs off the sides, so do the side edges
        for col in (0, -1):
            hit = np.nonzero(line[low:, col if col == 0 else -1] | line[low:, 1 if col == 0 else -2])[0]
            if hit.size: closed[low + hit.min():, col] = True
    lab, _ = ndimage.label(~closed)
    edge = set(np.unique(np.concatenate([lab[0], lab[:, 0], lab[:, -1]] + ([] if seal_bottom else [lab[-1]])))) - {0}
    outside = np.isin(lab, list(edge))
    inside = ~outside  # enclosed areas + the line itself
    # fill only the figure itself (the biggest enclosed shape), not the small sparkles around her
    filled = inside & ~line
    flab, n = ndimage.label(filled)
    if n > 1:
        sizes = ndimage.sum(filled, flab, range(1, n + 1))
        keep = np.isin(flab, [i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * 0.04])
        inside = keep | (line & ndimage.binary_dilation(keep, iterations=3))

    if blob:  # outline too broken to flood: close it hard and fill every hole instead
        big = ndimage.binary_closing(np.pad(line, 20), structure=np.ones((3, 3)), iterations=blob)[20:-20, 20:-20]
        if seal_bottom:
            seal(big, line)
        big = ndimage.binary_fill_holes(big)
        lab2, n2 = ndimage.label(big)
        if n2 > 1:
            sizes = ndimage.sum(big, lab2, range(1, n2 + 1))
            big = lab2 == (int(np.argmax(sizes)) + 1)
        inside = big | inside

    rgb = im[..., :3]
    out = np.zeros_like(im)
    # inside: white line composited over blue, fully opaque
    comp = rgb * a[..., None] + BLUE * (1 - a[..., None])
    out[..., :3] = np.where(inside[..., None], comp, rgb)
    out[..., 3] = np.where(inside, 255, im[..., 3])
    Image.fromarray(out.clip(0, 255).astype(np.uint8), "RGBA").save(ART / f"{name}-solid.png", optimize=True)
    print(name, out.shape[1], "x", out.shape[0], f"{inside.mean():.0%} filled")


if __name__ == "__main__":
    for n in sys.argv[1:]:
        # name~ = leave the bottom open; name:12 = close gaps up to ~12px and fill every hole
        name, _, blob = n.rstrip("~").partition(":")
        solid(name, seal_bottom=not n.endswith("~"), blob=int(blob or 0))
