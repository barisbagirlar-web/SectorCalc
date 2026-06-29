/**
 * Generate logo PNGs from the new SVG logos.
 * Usage: node scripts/generate-logo-pngs.mjs
 */
import { readFileSync } from "fs";
import sharp from "sharp";

async function main() {
  // Light logo – 340×100 → scale to 1024×301 (maintain 340:100 ≈ 3.4:1 ratio)
  const lightSvg = readFileSync("public/img/brand/sectorcalc-logo.svg", "utf-8");
  await sharp(Buffer.from(lightSvg))
    .resize(1024, 301)
    .png()
    .toFile("public/img/brand/sectorcalc-logo.png");
  console.log("✓ public/img/brand/sectorcalc-logo.png");

  // Dark logo
  const darkSvg = readFileSync("public/img/brand/sectorcalc-logo-on-dark.svg", "utf-8");
  await sharp(Buffer.from(darkSvg))
    .resize(1024, 301)
    .png()
    .toFile("public/img/brand/sectorcalc-logo-on-dark.png");
  console.log("✓ public/img/brand/sectorcalc-logo-on-dark.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
