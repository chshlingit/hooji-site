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


def draw_coin(draw, cx, cy, outer_radius_px):
    """金幣：外圈、內圈刻線、中央 $。

    座標直接沿用 docs/brand/hooji-coin.svg 的 100×100 格線（外圈半徑 46.5），
    最後乘上一個比例換算成像素——這樣兩邊的數字可以逐項對照，改一邊就知道要改哪裡。
    這裡畫的是**大尺寸版本**（有內圈，$ 的 s = 2.30、線寬 7）。
    """
    unit = outer_radius_px / 46.5

    def px(value):
        return value * unit

    def at(x, y):
        return cx + px(x - 50), cy + px(y - 50)

    def box(center_x, center_y, radius, width):
        """PIL 的 ellipse／arc 是**往內**畫線寬（外緣貼齊 bounding box），
        直接用半徑當 box 會讓圓弧的中心線比直線短半個線寬、接縫對不齊。
        這裡把 box 外擴半個線寬，讓中心線落在指定半徑上，和 SVG 的 stroke 行為一致。"""
        cx0, cy0 = at(center_x, center_y)
        r = px(radius) + width / 2
        return [cx0 - r, cy0 - r, cx0 + r, cy0 + r]

    def dot(x, y, width):
        """補圓角端點——PIL 的線與弧沒有 round cap，接縫處會出現缺口。"""
        cx0, cy0 = at(x, y)
        r = width / 2
        draw.ellipse([cx0 - r, cy0 - r, cx0 + r, cy0 + r], fill=INK)

    outer_w = max(1, round(px(7)))
    glyph_w = max(1, round(px(7)))

    draw.ellipse(box(50, 50, 46.5, outer_w), outline=INK, width=outer_w)
    inner_w = max(1, round(px(2.4)))
    draw.ellipse(box(50, 50, 35.5, inner_w), outline=INK, width=inner_w)

    # $ 的貫穿豎線
    draw.line([at(50, 24.7), at(50, 75.3)], fill=INK, width=glyph_w)
    dot(50, 24.7, glyph_w)
    dot(50, 75.3, glyph_w)

    # $ 的 S：三段水平線 ＋ 兩個半圓（角度自 3 點鐘起、順時針增加）
    s_radius = 8.05
    left, right = 44.25, 55.75
    top, bottom = 33.9, 66.1
    draw.line([at(61.5, top), at(left, top)], fill=INK, width=glyph_w)
    draw.arc(box(left, (top + 50) / 2, s_radius, glyph_w), 90, 270, fill=INK, width=glyph_w)
    draw.line([at(left, 50), at(right, 50)], fill=INK, width=glyph_w)
    draw.arc(box(right, (50 + bottom) / 2, s_radius, glyph_w), 270, 90, fill=INK, width=glyph_w)
    draw.line([at(right, bottom), at(36.2, bottom)], fill=INK, width=glyph_w)
    for x, y in ((61.5, top), (left, top), (left, 50), (right, 50), (right, bottom), (36.2, bottom)):
        dot(x, y, glyph_w)


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
