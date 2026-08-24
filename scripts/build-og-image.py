#!/usr/bin/env python3
"""
Generates public/og-image.jpg — the card every share of this site renders.

Run it after `npm run build`, and re-run it whenever the copy below changes:

    python3 scripts/build-og-image.py

WHY A COMMITTED IMAGE RATHER THAN next/og's ImageResponse
---------------------------------------------------------
ImageResponse needs font binaries at request time. The site's faces come from
next/font/google, which lands them in .next/static/media under content-hashed
names that no source file can reference. Every published workaround is a fetch
to fonts.gstatic.com during the build, and this repo does not call third parties
to render its own advertising. A committed JPEG has no runtime cost, no network
dependency, and can be looked at before it ships — which matters, because
tests/compliance.test.tsx renders pages and cannot see an image.

WHY public/ RATHER THAN THE app/opengraph-image FILE CONVENTION
---------------------------------------------------------------
The convention gives the file a content-hashed URL and merges it into the
segment's own metadata — so any page declaring `openGraph` drops it, exactly the
way those pages used to drop og:url. Only the home page kept its image. A stable
path under public/ can be named by lib/seo.ts, so every route carries it.

FONTS
-----
Read out of .next/static/media and instantiated from their weight axis, so the
card uses the same Cormorant Garamond and Libre Franklin the site does rather
than a lookalike. Nothing is downloaded.

COMPLIANCE (CLAUDE.md §7)
-------------------------
The card is advertising by a licensed broker, and no test can read it. It
therefore carries brokerage identification, both license numbers, the REALTOR®
mark with its symbol, and the Follow Up Boss tracking number. It states no
dollar figure, so no results disclaimer is required — if that ever changes, the
disclaimer has to appear here too, and it will not fit. Keep figures off it.
"""

import glob
import io
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

SURFACE = (252, 250, 246)      # --color-surface
INK = (27, 34, 48)             # --color-ink
INK_MUTED = (78, 87, 104)      # --color-ink-muted
ACCENT = (138, 106, 47)        # --color-accent
ACCENT_SOFT = (201, 169, 106)  # --color-accent-soft
BORDER = (229, 223, 211)       # --color-border

EYEBROW = "BROKER / REALTOR®"
HEADLINE = [
    "The other side of the table",
    "does this for a living.",
    "They know what’s askable.",
    "Now you do too.",
]
NAME = "Jasmine Garcia"
BROKERAGE = "Stone Realty Group  ·  NC 334700  ·  SC 125546"
CONTACT = "jasminegarcia.com  ·  (704) 200-9360"


def load_face(family_fragment: str, weight: float) -> bytes:
    """The widest-coverage subset for a family, frozen at one weight."""
    best = None
    for path in glob.glob(".next/static/media/*.woff2"):
        font = TTFont(path)
        family = {r.nameID: r.toUnicode() for r in font["name"].names}.get(1, "")
        if family_fragment not in family or "fvar" not in font:
            continue
        cmap = font.getBestCmap()
        if not all(ord(c) in cmap for c in "AZaz0.,'’®·"):
            continue
        if best is None or len(cmap) > best[0]:
            best = (len(cmap), path)
    if best is None:
        sys.exit(
            f"No {family_fragment} subset found in .next/static/media.\n"
            "Run `npm run build` first — the fonts only exist after a build."
        )
    font = instancer.instantiateVariableFont(TTFont(best[1]), {"wght": weight})
    font.flavor = None  # drop the woff2 wrapper; FreeType reads sfnt, not woff2
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()


def sized(face: bytes, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(io.BytesIO(face), size)


def tracked(draw, xy, text, font, fill, tracking):
    """PIL has no letter-spacing. The eyebrow needs 0.18em, so it is drawn by hand."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def main() -> None:
    display = load_face("Cormorant", 500)
    text_face = load_face("Libre Franklin", 500)

    card = Image.new("RGB", (W, H), SURFACE)
    draw = ImageDraw.Draw(card)

    # ---------------------------------------------------------------- PORTRAIT
    # Right third. Cropped to fill, never squashed. A hairline on its left edge
    # only — components/brand-photo.tsx is explicit that gold never frames a
    # photograph, so the rule stays structural.
    col = 430
    photo = Image.open("assets/images/jasmine-portrait-warm.jpg").convert("RGB")
    scale = max(col / photo.width, H / photo.height)
    photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    left = (photo.width - col) // 2
    card.paste(photo.crop((left, 0, left + col, H)), (W - col, 0))
    draw.line([(W - col, 0), (W - col, H)], fill=BORDER, width=1)

    # -------------------------------------------------------------------- TEXT
    x = 72
    eyebrow_font = sized(text_face, 19)
    tracked(draw, (x, 74), EYEBROW, eyebrow_font, ACCENT, 3.4)

    draw.line([(x, 124), (x + 64, 124)], fill=ACCENT_SOFT, width=1)

    y = 158
    headline_font = sized(display, 60)
    for i, line in enumerate(HEADLINE):
        draw.text((x, y), line, font=headline_font, fill=INK if i < 3 else ACCENT)
        y += 66

    name_font = sized(display, 36)
    small = sized(text_face, 19)
    draw.text((x, H - 148), NAME, font=name_font, fill=INK)
    draw.text((x, H - 96), BROKERAGE, font=small, fill=INK_MUTED)
    draw.text((x, H - 66), CONTACT, font=small, fill=INK)

    out = Path("public/og-image.jpg")
    card.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"wrote {out} — {out.stat().st_size:,} bytes, {W}x{H}")


if __name__ == "__main__":
    main()
