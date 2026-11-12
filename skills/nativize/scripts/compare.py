#!/usr/bin/env python3
"""nativize compare: builds a before/after image from two capture folders.

Usage: python3 compare.py <before-dir> <after-dir> [out.png]

Each folder holds the PNGs written by capture.sh (default.png, largest-text.png, dark.png).
Shots with the same name are placed side by side, one row per condition. Needs Pillow
(pip install pillow); without it an HTML page with the same layout is written instead.
"""
import html
import os
import sys

ORDER = ["default.png", "largest-text.png", "dark.png"]
LABELS = {"default.png": "Default", "largest-text.png": "Largest text", "dark.png": "Dark mode"}


def pairs(before, after):
    names = [n for n in ORDER if os.path.exists(os.path.join(before, n)) and os.path.exists(os.path.join(after, n))]
    extra = sorted(
        n for n in os.listdir(before)
        if n.endswith(".png") and n not in ORDER and os.path.exists(os.path.join(after, n))
    )
    return names + extra


def build_png(before, after, names, out):
    from PIL import Image, ImageDraw, ImageFont

    shot_w = 520
    pad, head, gap = 48, 72, 40
    rows = []
    for n in names:
        a = Image.open(os.path.join(before, n)).convert("RGB")
        b = Image.open(os.path.join(after, n)).convert("RGB")
        scale = shot_w / a.width
        a = a.resize((shot_w, round(a.height * scale)))
        b = b.resize((shot_w, round(b.height * scale)))
        rows.append((n, a, b))
    width = pad * 2 + shot_w * 2 + gap
    height = pad + sum(head + max(a.height, b.height) + gap for _, a, b in rows) + pad - gap
    canvas = Image.new("RGB", (width, height), (246, 246, 244))
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", 30)
    except OSError:
        font = ImageFont.load_default()
    y = pad
    for n, a, b in rows:
        label = LABELS.get(n, n[:-4])
        draw.text((pad, y + 18), f"Before · {label}", fill=(110, 110, 110), font=font)
        draw.text((pad + shot_w + gap, y + 18), f"After · {label}", fill=(20, 20, 20), font=font)
        y += head
        canvas.paste(a, (pad, y))
        canvas.paste(b, (pad + shot_w + gap, y))
        y += max(a.height, b.height) + gap
    canvas.save(out)
    return out


def build_html(before, after, names, out):
    out = os.path.splitext(out)[0] + ".html"
    rows = "".join(
        f"<h2>{html.escape(LABELS.get(n, n))}</h2><div class=row>"
        f"<figure><figcaption>Before</figcaption><img src='{html.escape(os.path.relpath(os.path.join(before, n), os.path.dirname(out) or '.'))}'></figure>"
        f"<figure><figcaption>After</figcaption><img src='{html.escape(os.path.relpath(os.path.join(after, n), os.path.dirname(out) or '.'))}'></figure></div>"
        for n in names
    )
    page = (
        "<!doctype html><meta charset=utf-8><title>nativize before and after</title>"
        "<style>body{font:16px -apple-system,system-ui;background:#f6f6f4;margin:32px}"
        ".row{display:flex;gap:32px}figure{margin:0}img{width:360px;border-radius:24px}"
        "figcaption{color:#666;margin:8px 0}</style>" + rows
    )
    with open(out, "w", encoding="utf-8") as f:
        f.write(page)
    return out


def main(argv):
    if len(argv) < 3:
        print(__doc__.strip(), file=sys.stderr)
        return 1
    before, after = argv[1], argv[2]
    out = argv[3] if len(argv) > 3 else os.path.join(os.path.dirname(os.path.abspath(before)), "before-after.png")
    names = pairs(before, after)
    if not names:
        print("No matching screenshots in both folders.", file=sys.stderr)
        return 1
    try:
        path = build_png(before, after, names, out)
    except ImportError:
        path = build_html(before, after, names, out)
        print("Pillow is not installed; wrote an HTML page instead.", file=sys.stderr)
    print(path)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
