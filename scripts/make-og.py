#!/usr/bin/env python3
"""產生 Open Graph 分享圖（assets/og.png，1200×630）。

配色與 App Icon 一致：金色漸層底 ＋ 深褐色金幣線條。
只用拉丁字母，避免相依 CJK 字型。改圖後重跑：

    python3 scripts/make-og.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
GOLD_TL, GOLD_TR = (251, 209, 119), (240, 178, 66)
GOLD_BL, GOLD_BR = (238, 173, 63), (222, 143, 34)
INK = (59, 42, 24)
ROOT = Path(__file__).resolve().parent.parent


def load_font(size, bold=False):
    """SF 是可變字型，取不到粗體變體時退回 Helvetica 的粗體 face。"""
    try:
        font = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", size)
        if bold:
            font.set_variation_by_name("Bold")
        return font
    except Exception:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size, index=1 if bold else 0)


def gradient():
    """四角插值：先做 2×2 再放大，比逐像素迴圈快且夠平滑。"""
    small = Image.new("RGB", (2, 2))
    small.putdata([GOLD_TL, GOLD_TR, GOLD_BL, GOLD_BR])
    return small.resize((W, H), Image.BICUBIC)


def draw_coin(draw, cx, cy, r):
    """與 docs/brand/hooji-coin.svg 相同比例的金幣：外圈、內圈、中央 H。"""
    outer_w = r * 0.15
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=INK, width=int(outer_w))
    inner = r * 0.78
    draw.ellipse([cx - inner, cy - inner, cx + inner, cy + inner], outline=INK, width=int(r * 0.068))
    h_h = inner * 1.05
    h_w = h_h * 0.72
    left, right = cx - h_w / 2, cx + h_w / 2
    top, bottom = cy - h_h / 2, cy + h_h / 2
    bar = int(outer_w)
    for a, b in (((left, top), (left, bottom)), ((right, top), (right, bottom)), ((left, cy), (right, cy))):
        draw.line([a, b], fill=INK, width=bar, joint="curve")


def main():
    img = gradient()
    draw = ImageDraw.Draw(img)

    draw_coin(draw, 250, H // 2, 148)

    x = 470
    draw.text((x, 214), "Hooji", font=load_font(104, bold=True), fill=INK)
    draw.text((x, 340), "Say it once. It is logged.", font=load_font(46, bold=True), fill=INK)
    draw.text((x, 404), "AI expense logging for iPhone and Apple Watch.", font=load_font(30), fill=(96, 71, 40))
    draw.text((x, 444), "Your expenses never leave your device.", font=load_font(30), fill=(96, 71, 40))

    out = ROOT / "assets" / "og.png"
    img.save(out, optimize=True)
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
