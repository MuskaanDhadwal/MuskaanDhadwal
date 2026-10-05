# One-off: cut the GM / luxury-vehicle screens out of the SI 594 slide renders (Figma, 1600x900 = 0.833 of 1920)
# and save them as WebP in public/case-studies/gm/. Source renders live in the session scratchpad (re-export from
# Figma file bdSDqOQTI8Ow6KchbINTqS if they're gone); the driver display + front console come from her own folder.
import os, sys
from PIL import Image
SRC = sys.argv[1] if len(sys.argv) > 1 else "."
HMI = r"C:/Users/muska/Downloads/portfolio assests/Extra project/automotie hmi"
OUT = "public/case-studies/gm"
os.makedirs(OUT, exist_ok=True)

def save(src, name, crop=None, w=1600, q=86):
    im = Image.open(src)
    # slide crops are written in the 1600-wide render's coordinates; scale them for 2x exports (3840 wide)
    if crop and os.path.basename(src).lower().startswith(("s0", "s1", "slide")) or (crop and im.width >= 1900 and im.width / im.height > 1.7):
        f = im.width / 1600
        crop = tuple(round(c * f) for c in crop)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA"); bg = Image.new("RGB", im.size, "#0b0c14"); bg.paste(im, mask=im.split()[3]); im = bg
    im = im.convert("RGB")
    if crop: im = im.crop(crop)
    if w and im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(f"{OUT}/{name}.webp", "WEBP", quality=q, method=6)
    print(name, im.size, os.path.getsize(f"{OUT}/{name}.webp") // 1024, "KB")

# accepts the 1600-wide renders (s04.png …) or her Figma exports at 2x, named like the frames ("4.png", "01.png")
FRAME = {"04": "4", "05": "5", "06": "6", "07": "7", "08": "8", "09": "9", "01b": "01", "01": "1", "02": "2", "03": "3"}
def S(n):
    for cand in (f"{FRAME.get(n, n)}.png", f"{FRAME.get(n, n)}@2x.png", f"s{n}.png"):
        if os.path.exists(os.path.join(SRC, cand)): return os.path.join(SRC, cand)
    return os.path.join(SRC, f"s{n}.png")
# overview (slide 04): the whole cabin, the phone, each surface
save(S("04"), "cabin", (180, 112, 1525, 788))
save(S("04"), "m-welcome", (186, 156, 460, 750))
save(S("04"), "cc-home", (962, 142, 1508, 416))
save(S("04"), "dd-nav-small", (541, 261, 932, 418))
# key decision 1 (slides 01b + 05): sky themes
save(S("01b"), "cc-theme-constellation", (862, 90, 1540, 428))
save(S("01b"), "cc-theme-sunrise", (862, 472, 1540, 810))
save(S("05"), "cc-home-big", (857, 39, 1514, 367))
save(S("05"), "m-settings-constellation", (74, 466, 273, 900))
save(S("05"), "m-settings-sunset", (293, 466, 493, 900))
# key decision 2 (slides 06 + 07): driver display
save(S("06"), "dd-default", (898, 60, 1499, 301))
save(S("06"), "dd-voice", (898, 601, 1499, 842))
save(S("06"), "wheel-menu", (896, 378, 1042, 528))
save(S("06"), "wheel-line", (1268, 335, 1494, 566))
save(S("07"), "dd-alerts", (757, 84, 1526, 444))
save(S("07"), "m-windows", (523, 467, 717, 887))
save(S("07"), "m-messages", (726, 467, 919, 887))
save(S("07"), "adas-clear", (968, 556, 1221, 784))
save(S("07"), "adas-brake", (1256, 559, 1500, 781))
# key decision 3 (slide 08): climate
save(S("08"), "fc-climate", (1020, 41, 1409, 586))
save(S("08"), "m-temp-f", (99, 502, 272, 878))
save(S("08"), "m-temp-c", (289, 502, 462, 878))
save(S("08"), "cc-volume", (1098, 640, 1318, 848))
# design system (slide 09)
save(S("09"), "ds-components", (76, 128, 1504, 412))
save(S("09"), "ds-icons", (72, 466, 800, 830))
# her own exports (higher resolution)
save(f"{HMI}/Driver - default.png", "dd-default-hi")
save(f"{HMI}/Front Console.png", "fc-climate-hi")
