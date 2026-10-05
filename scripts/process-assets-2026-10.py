# One-off: resize + convert BuyMySpot (Figma exports + her folder), résumés, extra projects and About photos.
import os, shutil
from PIL import Image, ImageSequence
Image.MAX_IMAGE_PIXELS = None
FIG = r"C:/Users/muska/AppData/Local/Temp/claude/C--Users-muska-Downloads-Create-UX-Design-Portfolio/8d2678f4-c73e-4cb1-8a8e-3efe8d66689f/scratchpad/fig"
SRC = r"C:/Users/muska/Downloads/portfolio assests"
PUB = "public"

def save(src, dst, w=1600, q=82, crop=None, maxh=None):
    im = Image.open(src)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if crop: im = im.crop(crop)
    if maxh and im.height > maxh * im.width / w: pass
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    if im.mode == "RGBA":
        bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.split()[3]); im = bg
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, "WEBP", quality=q, method=6)
    print(dst, im.size, os.path.getsize(dst) // 1024, "KB")

B = f"{PUB}/case-studies/buymyspot/v2"
# desktop screens (1440 wide; d-details has a dark scroll overflow below 789)
for n in ["default", "setdates", "results", "noresults", "filters", "events-find", "saved", "cancel-why", "cancel-refund"]:
    save(f"{FIG}/d-{n}.png", f"{B}/d-{n}.webp", w=1440)
save(f"{FIG}/d-details.png", f"{B}/d-details.webp", w=1440, crop=(0, 0, 1452, 800))
save(f"{FIG}/d-events-default.png", f"{B}/d-events.webp", w=1200)
save(f"{FIG}/d-pay-saved.png", f"{B}/d-pay.webp", w=1440)
save(f"{FIG}/d-leasing.png", f"{B}/d-leasing.webp", w=1015)
save(f"{FIG}/d-profile.png", f"{B}/d-profile.webp", w=1245)
save(f"{FIG}/d-error-minlease.png", f"{B}/d-error.webp", w=412)
# mobile screens: 2x where we have it
for n in ["default", "map-peek", "list", "pay", "events", "details"]:
    save(f"{FIG}/m2-{n}.png", f"{B}/m-{n}.webp", w=780)
for n in ["map-hide", "noresults", "error", "setdates", "saved", "cancel-why", "cancel-refund"]:
    save(f"{FIG}/m-{n}.png", f"{B}/m-{n}.webp", w=390, q=88)
save(f"{FIG}/m-filters.png", f"{B}/m-filters.webp", w=573, crop=(0, 0, 330, 1300))
# process boards from Figma
for n in ["sg-color", "sg-text", "sg-rowgap", "audit-split", "audit-grid", "audit-map", "sketches", "ds-colors"]:
    save(f"{FIG}/{n}.png", f"{B}/{n}.webp", w=1400)
# her folder
F = f"{SRC}/BuyMySpot"
save(f"{F}/persona 1.png", f"{B}/persona-oslo.webp", w=1800)
save(f"{F}/persona 2.jpg", f"{B}/persona-geneva.webp", w=1800)
save(f"{F}/research synopsis.jpg", f"{B}/security-synopsis.webp", w=1600)
save(f"{F}/buyer research board (2).jpg", f"{B}/price-vs-convenience.webp", w=1600)
save(f"{F}/thematic analysis.png", f"{B}/thematic-analysis.webp", w=1920)
save(f"{F}/buyer research board-sketches.png", f"{B}/sketch-notes.webp", w=1200)
save(f"{F}/buyer research board_edited-sketch.jpg", f"{B}/sketch-sitemap.webp", w=1600)
save(f"{F}/Split view List + Map _ adjusting price and proximity_iteration.jpg", f"{B}/lofi-split.webp", w=1400)
save(f"{F}/old website.png", f"{B}/old-website.webp", w=1011)
save(f"{PUB}/case-studies/buymyspot/before-after.png", f"{B}/survey.webp", w=1600, crop=(260, 250, 3620, 1650))
# persona avatars, cropped from her persona boards
p1 = Image.open(f"{F}/persona 1.png"); s1 = p1.width / 1400
save(f"{F}/persona 1.png", f"{B}/avatar-oslo.webp", w=320, crop=tuple(round(v * s1) for v in (42, 42, 160, 160)))
p2 = Image.open(f"{F}/persona 2.jpg"); s2 = p2.width / 1400
save(f"{F}/persona 2.jpg", f"{B}/avatar-geneva.webp", w=320, crop=tuple(round(v * s2) for v in (44, 38, 198, 192)))

# résumés
R = f"{PUB}/resume"; os.makedirs(R, exist_ok=True)
for a, b in [("Muskaan_Dhadwal_UX_Engineer_Resume_1Page_1.pdf", "Muskaan_Dhadwal_UX_Engineer_Resume.pdf"),
             ("Muskaan_Dhadwal_Product_Designer_Resume_1Page_1.pdf", "Muskaan_Dhadwal_Product_Designer_Resume.pdf"),
             ("Muskaan_Dhadwal_UX_Engineer_Resume_2Page_1.pdf", "Muskaan_Dhadwal_Resume_Full.pdf")]:
    shutil.copy(f"{SRC}/resume/{a}", f"{R}/{b}")

# extra projects
X = f"{SRC}/Extra project"; E = f"{PUB}/extra"
pairs = {
  "automotie hmi/Driver - default.png": "gm-driver.webp", "automotie hmi/Front Console.png": "gm-console.webp",
  "Sochi/poster design.jpg": "sochi-ia-day.webp", "Sochi/Poster design (1).png": "sochi-ia.webp", "Sochi/Poster design.png": "sochi-wiad.webp",
  "Sochi/informational poster.png": "sochi-watch-party.webp", "Sochi/Instagram post - 1.png": "sochi-insta.webp",
  "graphic design/Final Project 520_Page_2.png": "gd-mango.webp", "graphic design/graphic design.png": "gd-mammalogy.webp", "graphic design/poster design.jpg": "gd-villains.webp",
  "print-marketing/brandguidelineheroimage-orbaid.png": "orbaid-hero.webp", "print-marketing/brandguidelines -orbaid.png": "orbaid-logo.webp",
  "print-marketing/brandguidelinescolors-orbaid.png": "orbaid-colors.webp", "print-marketing/brandguidelinetypo-orbaid.png": "orbaid-type.webp",
  "print-marketing/icon design -orbaid.png": "orbaid-icon.webp", "print-marketing/Moodboard-orbAid.png": "orbaid-moodboard.webp",
  "print-marketing/business card designs.png": "orbaid-cards.webp",
  "print-marketing/social media marketing - bastion (2).png": "bastion-1.webp", "print-marketing/social media marketing - bastion.png": "bastion-2.webp",
  "print-marketing/social media marketing -bastion.png": "bastion-3.webp", "print-marketing/social media marketting -bastion.png": "bastion-4.webp",
  "print-marketing/surveys.png": "bastion-survey.webp",
  "print-marketing/tshirt design (2).png": "mv-tee.webp", "print-marketing/tshirt print design.jpg": "mv-tees.webp", "print-marketing/tshirt design.png": "mv-print.webp",
  "print-marketing/tshirt back.png": "mv-back.webp", "print-marketing/cup.png": "mv-mug.webp",
}
for a, b in pairs.items():
    save(f"{X}/{a}", f"{E}/{b}", w=1600, q=80)
    save(f"{X}/{a}", f"{E}/thumb/{b}", w=640, q=74)
# VR GIFs → animated WebP (+ still)
for a, b in [("story-book.gif", "vr-1"), ("storybook -2.gif", "vr-2"), ("storybook 3.gif", "vr-3")]:
    g = Image.open(f"{X}/VR project/{a}")
    frames = [fr.convert("RGB") for fr in ImageSequence.Iterator(g)]
    d = g.info.get("duration", 40)
    os.makedirs(f"{E}/thumb", exist_ok=True)
    frames[0].save(f"{E}/{b}.webp", "WEBP", save_all=True, append_images=frames[1:], duration=d, loop=0, quality=70, method=4)
    frames[min(20, len(frames) - 1)].save(f"{E}/thumb/{b}-still.webp", "WEBP", quality=80)
    shutil.copy(f"{E}/{b}.webp", f"{E}/thumb/{b}.webp")
    print(b, len(frames), os.path.getsize(f"{E}/{b}.webp") // 1024, "KB")

# about photos
A = f"{SRC}/about me"; P = f"{PUB}/about"
for a in os.listdir(A):
    save(f"{A}/{a}", f"{P}/{os.path.splitext(a)[0].lower().replace(' ', '-')}.webp", w=1000, q=78)
save(f"{X}/awards won/optimize community connect.jpeg", f"{P}/optimize-win.webp", w=1000, q=78)

# trim the 4–6px canvas border Figma's renderer adds around some desktop frames
save(f"{FIG}/d-results.png", f"{B}/d-results.webp", w=1440, crop=(4, 2, 1444, 791))
save(f"{FIG}/d-filters.png", f"{B}/d-filters.webp", w=1440, crop=(6, 1, 1446, 790))
save(f"{FIG}/d-details.png", f"{B}/d-details.webp", w=1440, crop=(6, 2, 1446, 791))
save(f"{FIG}/d-pay-saved.png", f"{B}/d-pay.webp", w=1440, crop=(0, 0, 1440, 789))
save(f"{FIG}/d-events-default.png", f"{B}/d-events.webp", w=1200, crop=(6, 0, 1446, 1917))
