# Fix for Issue #4: [Bounty] 32x32 pixel-art work receipt icon - 100 AIPOU

## Solution & Analysis
To fulfill the bounty request deterministically and adhere strictly to software engineering principles, we provide a self-contained, reproducible Python asset-generation script (`generate_receipt_icon.py`). 

This script programmatically draws a 32x32 pixel-art work-receipt icon onto an RGBA transparent grid using `Pillow`, saves the native `work_receipt_32x32.png` asset, and outputs an 8x integer-scaled preview (`work_receipt_256x256.png`) for inspection.

---

### Key Implementation Features

* **Strict 32x32 Grid Alignment:** Every pixel coordinate is precisely mapped on an integer grid.
* **Pixel-Art Aesthetic & Palette:** Features a crisp outline, receipt header, line items, a bold checkmark/seal, and folded corner details using classic pixel-art color palettes.
* **Deterministic Output:** Zero external dynamic assets required; generates the exact PNG pixel binary output on execution.
* **Preview Scaling:** Generates a 256x256 scaled preview using nearest-neighbor interpolation to prevent blurriness.

---

### Python Asset Generator Script

```python
import os
from PIL import Image, ImageDraw

def create_receipt_icon():
    # 1. Create a 32x32 canvas with full RGBA transparency
    width, height = 32, 32
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    pixels = img.load()

    # Color Palette Definitions
    OUTLINE    = (40, 44, 52, 255)     # Dark slate outline
    PAPER_BG   = (245, 247, 250, 255)  # Off-white paper background
    PAPER_SHD  = (218, 224, 233, 255)  # Paper shadow / fold depth
    HEADER     = (52, 152, 219, 255)   # AIPOU Blue Header accent
    LINE_DARK  = (100, 110, 120, 255)  # High-contrast text line
    LINE_LIGHT = (170, 180, 190, 255)  # Light item detail line
    CHECK_GREEN= (46, 204, 113, 255)   # Paid / Validated Green check
    CHECK_SHD  = (39, 174, 96, 255)    # Green check shadow

    # Helper function to safely set pixels
    def set_p(x, y, color):
        if 0 <= x < width and 0 <= y < height:
            pixels[x, y] = color

    # Helper function to fill rectangles
    def fill_rect(x1, y1, x2, y2, color):
        for x in range(x1, x2 + 1):
            for y in range(y1, y2 + 1):
                set_p(x, y, color)

    # --- Draw Receipt Paper Outline & Base (X: 6..25, Y: 2..29) ---
    # Fill main body base
    fill_rect(7, 3, 24, 28, PAPER_BG)

    # Dark Outer Border
    for x in range(7, 25):
        set_p(x, 2, OUTLINE)   # Top border
        set_p(x, 29, OUTLINE)  # Bottom base border
    for y in range(3, 29):
        set_p(6, y, OUTLINE)   # Left border
        set_p(25, y, OUTLINE)  # Right border

    # --- Folded Top-Right Corner Detail ---
    # Cut corner outline
    set_p(22, 2, OUTLINE)
    set_p(23, 3, OUTLINE)
    set_p(24, 4, OUTLINE)
    set_p(25, 5, OUTLINE)
    fill_rect(22, 3, 24, 5, PAPER_SHD) # Corner shadow fold

    # --- Header Banner (Blue Accent) ---
    fill_rect(8, 5, 21, 8, HEADER)

    # --- Receipt Content / Printed Lines ---
    # Line Item 1
    fill_rect(9, 11, 16, 11, LINE_DARK)
    fill_rect(18, 11, 22, 11, LINE_LIGHT)

    # Line Item 2
    fill_rect(9, 14, 14, 14, LINE_DARK)
    fill_rect(16, 14, 22, 14, LINE_LIGHT)

    # Line Item 3
    fill_rect(9, 17, 17, 17, LINE_DARK)
    fill_rect(19, 17, 22, 17, LINE_LIGHT)

    # Dotted Divider Line
    for x in range(9, 23, 2):
        set_p(x, 20, PAPER_SHD)

    # --- Work Verification Checkmark / Seal ---
    check_coords = [
        (11, 24), (12, 25), (13, 26), 
        (14, 25), (15, 24), (16, 23), (17, 22)
    ]
    for cx, cy in check_coords:
        set_p(cx, cy, CHECK_GREEN)
        set_p(cx, cy + 1, CHECK_SHD) # Thickness / shadow drop

    # --- Jagged Bottom Edge (Classic Receipt Zig-Zag) ---
    zigzag_clear = [(7, 28), (9, 28), (11, 28), (13, 28), (15, 28), (17, 28), (19, 28), (21, 28), (23, 28)]
    for zx, zy in zigzag_clear:
        set_p(zx, zy, (0, 0, 0, 0))
        set_p(zx, zy - 1, OUTLINE)

    return img

if __name__ == "__main__":
    # Generate 32x32 transparent PNG icon
    icon_32 = create_receipt_icon()
    icon_path = "work_receipt_32x32.png"
    icon_32.save(icon_path, "PNG")
    print(f"Successfully generated 32x32 pixel-art icon: {icon_path}")

    # Generate 8x Integer-Scaled Preview (256x256) via Nearest-Neighbor
    preview_256 = icon_32.resize((256, 256), resample=Image.NEAREST)
    preview_path = "work_receipt_256x256.png"
    preview_256.save(preview_path, "PNG")
    print(f"Successfully generated integer-scaled preview: {preview_path}")
```

---

### Verification Instructions

1. Ensure Python with Pillow is available:
   ```bash
   pip install pillow
   ```
2. Run the generation script:
   ```bash
   python generate_receipt_icon.py
   ```
3. Inspect `work_receipt_32x32.png` and `work_receipt_256x256.png` to verify pixel-grid alignment, transparency, and scaling integrity.
