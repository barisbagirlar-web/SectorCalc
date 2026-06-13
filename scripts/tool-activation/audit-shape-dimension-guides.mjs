#!/usr/bin/env node
/**
 * P81 — audit shape & dimension input guides for target slugs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const GUIDES_FILE = path.join(ROOT, "src/lib/tool-guides/shape-dimension-guides.tsx");

const TARGET_SLUGS = [
  "paint-coverage-cost-check",
  "home-renovation-m2",
  "kwh-consumption-check",
  "plumbing-fixture-cost-check",
  "pressure-vessel-wall-thickness-calculator",
  "electrical-panel-rework-cost",
  "area-converter",
  "length-converter",
  "volume-converter",
  "weight-converter",
];

const FORBIDDEN = /\b(generic svg|fallback|dummy|placeholder|temporary|workaround|TODO|FIXME)\b/i;

function extractGuideBlocks(source) {
  const blocks = [];
  for (const slug of TARGET_SLUGS) {
    const slugIdx = source.indexOf(`slug: "${slug}"`);
    if (slugIdx === -1) {
      blocks.push({ slug, block: null });
      continue;
    }
    const svgIdx = source.lastIndexOf("function ", slugIdx);
    const nextSlugIdx = source.indexOf('\n    slug: "', slugIdx + 1);
    const end = nextSlugIdx === -1 ? source.length : nextSlugIdx;
    blocks.push({ slug, block: source.slice(Math.max(0, svgIdx - 1200), end) });
  }
  return blocks;
}

function main() {
  if (!fs.existsSync(GUIDES_FILE)) {
    console.error("FAIL: guides file missing:", GUIDES_FILE);
    process.exit(1);
  }

  const source = fs.readFileSync(GUIDES_FILE, "utf8");
  const failures = [];

  for (const slug of TARGET_SLUGS) {
    if (!source.includes(`slug: "${slug}"`)) {
      failures.push(`${slug}: missing from registry`);
    }
  }

  if (FORBIDDEN.test(source)) {
    failures.push("guides file contains forbidden token");
  }

  const svgFunctions = [
    "PaintCoverageGuideSvg",
    "HomeRenovationM2GuideSvg",
    "KwhConsumptionGuideSvg",
    "PlumbingFixtureGuideSvg",
    "PressureVesselGuideSvg",
    "ElectricalPanelGuideSvg",
    "AreaConverterGuideSvg",
    "LengthConverterGuideSvg",
    "VolumeConverterGuideSvg",
    "WeightConverterGuideSvg",
  ];

  const hasGlobalColors =
    source.includes("#1a1a1a") && source.includes("#003366") && source.includes("#ffffff");
  if (!hasGlobalColors) {
    failures.push("guides file missing required color tokens");
  }

  for (const fn of svgFunctions) {
    const fnStart = source.indexOf(`function ${fn}`);
    if (fnStart === -1) {
      failures.push(`${fn}: missing SVG component`);
      continue;
    }
    const fnEnd = source.indexOf("\nfunction ", fnStart + 1);
    const body = source.slice(fnStart, fnEnd === -1 ? source.length : fnEnd);

    for (const check of ["viewBox", "<title", "<desc"]) {
      if (!body.includes(check)) {
        failures.push(`${fn}: missing ${check}`);
      }
    }
  }

  for (const { slug, block } of extractGuideBlocks(source)) {
    if (!block) continue;
    const inputKeysMatch = block.match(/inputKeys:\s*\[([\s\S]*?)\]/);
    if (!inputKeysMatch || inputKeysMatch[1].trim().length === 0) {
      failures.push(`${slug}: inputKeys empty or missing`);
    }
  }

  if (failures.length > 0) {
    console.error("audit:shape-guides FAIL");
    for (const failure of failures) {
      console.error(" -", failure);
    }
    process.exit(1);
  }

  console.log("audit:shape-guides PASS");
  console.log(`targetSlugs: ${TARGET_SLUGS.length}`);
  console.log(`svgComponents: ${svgFunctions.length}`);
}

main();
