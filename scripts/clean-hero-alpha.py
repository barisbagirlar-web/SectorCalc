from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

# Hero asset used by HeroDeviceMockup.tsx
HERO_IMAGE_PATH = Path("public/images/sectorcalc-devices-hero.png")
SOURCE_IMAGE_PATH = Path(
    "/Users/macair1/.cursor/projects/Users-macair1-projects-SectorCalc/assets/"
    "ChatGPT_Image_5_Haz_2026_20_23_55-21001d76-edf9-450d-9b17-2cc4d954183a.png"
)
TARGET_SIZE = (1672, 941)

RGB_NEAR_WHITE_THRESHOLD = 238
ALPHA_VISIBLE_THRESHOLD = 8


def is_studio_backdrop(r: int, g: int, b: int) -> bool:
    spread = max(r, g, b) - min(r, g, b)
    avg = (r + g + b) / 3
    return spread <= 16 and avg >= 230


def is_background_candidate(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel

    if a <= ALPHA_VISIBLE_THRESHOLD:
        return True

    if (
        r >= RGB_NEAR_WHITE_THRESHOLD
        and g >= RGB_NEAR_WHITE_THRESHOLD
        and b >= RGB_NEAR_WHITE_THRESHOLD
    ):
        return True

    if abs(r - g) <= 10 and abs(g - b) <= 10 and r >= 225 and g >= 225 and b >= 225:
        return True

    # Edge-connected light gray fringe / soft shadow tail (outside device bodies)
    spread = max(r, g, b) - min(r, g, b)
    avg = (r + g + b) / 3
    if spread <= 18 and avg >= 200:
        return True

    return False


def load_base_rgba() -> Image.Image:
    if SOURCE_IMAGE_PATH.exists():
        image = Image.open(SOURCE_IMAGE_PATH).convert("RGBA")
        width, height = image.size
        pixels = image.load()

        visited: set[tuple[int, int]] = set()
        queue: deque[tuple[int, int]] = deque()

        def enqueue_studio(x: int, y: int) -> None:
            if (x, y) in visited:
                return
            r, g, b, _a = pixels[x, y]
            if is_studio_backdrop(r, g, b):
                visited.add((x, y))
                queue.append((x, y))

        for x in range(width):
            enqueue_studio(x, 0)
            enqueue_studio(x, height - 1)
        for y in range(height):
            enqueue_studio(0, y)
            enqueue_studio(width - 1, y)

        while queue:
            x, y = queue.popleft()
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if nx < 0 or ny < 0 or nx >= width or ny >= height:
                    continue
                if (nx, ny) in visited:
                    continue
                r, g, b, _a = pixels[nx, ny]
                if is_studio_backdrop(r, g, b):
                    visited.add((nx, ny))
                    queue.append((nx, ny))

        for x, y in visited:
            pixels[x, y] = (0, 0, 0, 0)

        return image

    return Image.open(HERO_IMAGE_PATH).convert("RGBA")


def trim_bottom_fringe_rows(image: Image.Image) -> Image.Image:
    pixels = image.load()
    width, height = image.size
    h = height

    while h > 0:
        row_has_opaque = False
        light_count = 0
        opaque_count = 0

        for x in range(width):
            _r, _g, _b, a = pixels[x, h - 1]
            if a <= ALPHA_VISIBLE_THRESHOLD:
                continue
            row_has_opaque = True
            opaque_count += 1
            if is_background_candidate(pixels[x, h - 1]):
                light_count += 1

        if not row_has_opaque:
            h -= 1
            continue

        if opaque_count > 0 and (light_count / opaque_count) > 0.88:
            for x in range(width):
                pixels[x, h - 1] = (0, 0, 0, 0)
            h -= 1
            continue

        break

    return image.crop((0, 0, width, h))


def clean_connected_background(image: Image.Image) -> Image.Image:
    width, height = image.size
    pixels = image.load()

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    def enqueue_if_candidate(x: int, y: int) -> None:
        if (x, y) in visited:
            return
        if is_background_candidate(pixels[x, y]):
            visited.add((x, y))
            queue.append((x, y))

    for x in range(width):
        enqueue_if_candidate(x, 0)
        enqueue_if_candidate(x, height - 1)

    for y in range(height):
        enqueue_if_candidate(0, y)
        enqueue_if_candidate(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            if (nx, ny) in visited:
                continue
            if is_background_candidate(pixels[nx, ny]):
                visited.add((nx, ny))
                queue.append((nx, ny))

    for x, y in visited:
        pixels[x, y] = (0, 0, 0, 0)

    print(f"Transparent pixels updated: {len(visited)}")
    return image


def crop_to_content(image: Image.Image, pad: int = 4) -> Image.Image:
    bbox = image.getbbox()
    if not bbox:
        return image
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(image.width, right + pad)
    bottom = min(image.height, bottom + pad)
    return image.crop((left, top, right, bottom))


def upscale_binary_alpha(image: Image.Image, target: tuple[int, int]) -> Image.Image:
    tw, th = target
    cw, ch = image.size
    scale = min(tw / cw, th / ch)
    nw, nh = int(round(cw * scale)), int(round(ch * scale))

    rgb = image.convert("RGB").resize((nw, nh), Image.Resampling.LANCZOS)
    alpha = image.getchannel("A").resize((nw, nh), Image.Resampling.NEAREST)
    alpha = alpha.point(lambda p: 255 if p > 127 else 0)

    canvas = Image.new("RGBA", target, (0, 0, 0, 0))
    ox = (tw - nw) // 2
    oy = (th - nh) // 2
    canvas.paste(rgb, (ox, oy))
    canvas.paste(alpha, (ox, oy), alpha)
    return canvas


def clean_exposed_fringe(image: Image.Image) -> Image.Image:
    """Remove background-candidate pixels touching fully transparent neighbors."""
    width, height = image.size
    pixels = image.load()
    removed = 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a <= ALPHA_VISIBLE_THRESHOLD:
                continue
            if not is_background_candidate((r, g, b, a)):
                continue

            touches_transparent = False
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if nx < 0 or ny < 0 or nx >= width or ny >= height:
                    touches_transparent = True
                    break
                if pixels[nx, ny][3] <= ALPHA_VISIBLE_THRESHOLD:
                    touches_transparent = True
                    break

            if touches_transparent:
                pixels[x, y] = (0, 0, 0, 0)
                removed += 1

    print(f"Exposed fringe pixels removed: {removed}")
    return image


def verify_screen_pixels(image: Image.Image) -> None:
    checks = {
        "tablet_white": (int(image.width * 0.27), int(image.height * 0.34)),
        "laptop_ui": (int(image.width * 0.76), int(image.height * 0.30)),
        "dark_phone": (int(image.width * 0.51), int(image.height * 0.58)),
    }
    px = image.load()
    for name, (x, y) in checks.items():
        r, g, b, a = px[x, y]
        print(f"  {name} @ ({x},{y}): alpha={a} rgb=({r},{g},{b})")


def main() -> None:
    if not HERO_IMAGE_PATH.parent.exists():
        raise FileNotFoundError(f"Hero directory missing: {HERO_IMAGE_PATH.parent}")

    backup_path = HERO_IMAGE_PATH.with_name(
        f"{HERO_IMAGE_PATH.stem}.original{HERO_IMAGE_PATH.suffix}"
    )
    if HERO_IMAGE_PATH.exists() and not backup_path.exists():
        backup_path.write_bytes(HERO_IMAGE_PATH.read_bytes())
        print(f"Backup:  {backup_path}")

    image = load_base_rgba()
    image = clean_connected_background(image)
    image = trim_bottom_fringe_rows(image)
    image = crop_to_content(image)
    image = upscale_binary_alpha(image, TARGET_SIZE)
    image = clean_exposed_fringe(image)

    print("Verification:")
    verify_screen_pixels(image)

    image.save(HERO_IMAGE_PATH)
    print(f"Cleaned: {HERO_IMAGE_PATH} ({image.size[0]}x{image.size[1]})")


if __name__ == "__main__":
    main()
