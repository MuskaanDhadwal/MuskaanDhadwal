# One-off: GuardianCare media → public/case-studies/guardiancare/v2/ (WebP).
# Sources (all the team's own): the Notion case study images (downloaded 2026-10-04 into the session
# scratchpad, since Notion's S3 links expire), the two persona boards (Figma d60Aodwyn9w6eWUwKvCyxe), and her
# SI 612 deck (Google Slides 1aU8bNrPyHuzla3Gp4jTO3YOt3DD8vgDNijjWRUKQduk, exported as PDF).
# usage: python scripts/process-guardiancare-2026-10.py <folder with the downloads>
import os, sys
from PIL import Image
SRC = sys.argv[1]
OUT = "public/case-studies/guardiancare/v2"
os.makedirs(OUT, exist_ok=True)

def save(name, out, w=1600, crop=None, q=82):
    im = Image.open(os.path.join(SRC, name))
    im = im.convert("RGB")
    if crop: im = im.crop(crop)
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(f"{OUT}/{out}.webp", "WEBP", quality=q, method=6)
    print(out, im.size, os.path.getsize(f"{OUT}/{out}.webp") // 1024, "KB")

# slides from the Notion page (960 × 540): crop off the decorative slide edges where it helps
for n in ["insights", "survey-summary", "enactments", "enactment-findings", "architecture", "app", "face", "watch", "awards", "ava-a"]:
    save(f"{n}.png", n)
for i in range(1, 5): save(f"story-{i}.png", f"story-{i}", w=1000)
# prototype photos (portrait)
for i in range(1, 10):
    ext = ".jpeg" if i in (1, 6) else ".jpg"
    save(f"make-{i}{ext}", f"make-{i}", w=900)
save("persona-abbey.png", "persona-abbey", w=1800)
save("persona-brandon.png", "persona-brandon", w=1800)
