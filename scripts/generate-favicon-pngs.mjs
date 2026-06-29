/**
 * Generate icon.png (32×32) and apple-icon.png (180×180) from the favicon SVG.
 * Usage: node scripts/generate-favicon-pngs.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import sharp from "sharp";

const svg = readFileSync("public/img/brand/sectorcalc-favicon.svg", "utf-8");

async function main() {
  // icon.png – 32×32
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .png()
    .toFile("src/app/icon.png");
  console.log("✓ src/app/icon.png (32×32)");

  // apple-icon.png – 180×180
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile("src/app/apple-icon.png");
  console.log("✓ src/app/apple-icon.png (180×180)");

  // Also generate PNG versions for the brand assets
  // favicon-32.png (same as icon.png)
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .png()
    .toFile("public/img/brand/sectorcalc-favicon-32.png");
  console.log("✓ public/img/brand/sectorcalc-favicon-32.png");

  // favicon master - 512×512
  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .png()
    .toFile("public/img/brand/sectorcalc-favicon.png");
  console.log("✓ public/img/brand/sectorcalc-favicon.png");

  // apple touch - 180×180
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile("public/img/brand/sectorcalc-favicon-180.png");
  console.log("✓ public/img/brand/sectorcalc-favicon-180.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
