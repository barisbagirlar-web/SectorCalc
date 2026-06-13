#!/usr/bin/env node
/**
 * P81 — audit shape & dimension input guides for active physical tools.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const GUIDES_FILE = path.join(ROOT, "src/lib/tool-guides/shape-dimension-guides.tsx");
const CATALOG_FILE = path.join(ROOT, "src/lib/tools/free-traffic-catalog.generated.json");
const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const REVENUE_FILES = [
  path.join(ROOT, "src/lib/tools/revenue-tools.ts"),
  path.join(ROOT, "src/lib/tools/revenue-tools-phase2.ts"),
  path.join(ROOT, "src/lib/tools/revenue-tools-additional.ts"),
];

/** Active-route physical tools in P81 sprint scope. */
const ELIGIBLE_SLUGS = [
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

const SVG_FUNCTIONS = [
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

const FORBIDDEN = /\b(generic svg|fallback svg|dummy svg|temporary svg|workaround svg|TODO|FIXME)\b/i;

function readCatalogKeys(slug) {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, "utf8"));
  const tool = catalog.find((entry) => entry.slug === slug);
  return tool ? tool.inputs.map((input) => input.key) : null;
}

function readSchemaKeys(slug) {
  const file = path.join(SCHEMAS_DIR, `${slug}.ts`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  const inputsBlock = source.match(/inputs:\s*\[([\s\S]*?)\]\s*,\s*outputs:/);
  if (!inputsBlock) return null;
  return [...inputsBlock[1].matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
}

function readRevenueFreeKeys(slug) {
  for (const file of REVENUE_FILES) {
    const source = fs.readFileSync(file, "utf8");
    const slugIdx = source.indexOf(`freeSlug: "${slug}"`);
    if (slugIdx === -1) continue;
    const slice = source.slice(slugIdx, slugIdx + 2500);
    const inputsMatch = slice.match(/freeInputs:\s*\[([\s\S]*?)\]\s*,/);
    if (!inputsMatch) continue;
    const keys = [
      ...inputsMatch[1].matchAll(
        /(?:numberInput|currency|percentInput|selectInput)\(\s*"([^"]+)"/g,
      ),
    ].map((match) => match[1]);
    if (keys.length > 0) return keys;
  }
  return null;
}

function getActualInputKeys(slug) {
  return readRevenueFreeKeys(slug) ?? readSchemaKeys(slug) ?? readCatalogKeys(slug) ?? [];
}

function extractRegistryGuide(source, slug) {
  const slugIdx = source.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) return null;
  const nextSlugIdx = source.indexOf('\n    slug: "', slugIdx + 1);
  const block = source.slice(slugIdx, nextSlugIdx === -1 ? source.length : nextSlugIdx);
  const inputKeysMatch = block.match(/inputKeys:\s*\[([\s\S]*?)\]/);
  const inputKeys = inputKeysMatch
    ? [...inputKeysMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
    : [];
  const svgMatch = block.match(/Svg:\s*(\w+)/);
  return { inputKeys, svgName: svgMatch?.[1] ?? null, block };
}

function main() {
  if (!fs.existsSync(GUIDES_FILE)) {
    console.error("FAIL: guides file missing:", GUIDES_FILE);
    process.exit(1);
  }

  const source = fs.readFileSync(GUIDES_FILE, "utf8");
  const failures = [];

  if (FORBIDDEN.test(source)) {
    failures.push("guides file contains forbidden token");
  }

  if (!source.includes("#1a1a1a") || !source.includes("#003366") || !source.includes("#ffffff")) {
    failures.push("guides file missing required color tokens (#1a1a1a / #003366 / #ffffff)");
  }

  for (const fn of SVG_FUNCTIONS) {
    const fnStart = source.indexOf(`function ${fn}`);
    if (fnStart === -1) {
      failures.push(`${fn}: missing SVG component`);
      continue;
    }
    const fnEnd = source.indexOf("\nfunction ", fnStart + 1);
    const body = source.slice(fnStart, fnEnd === -1 ? source.length : fnEnd);
    for (const check of ["viewBox", "<title", "<desc", 'role="img"']) {
      if (!body.includes(check)) {
        failures.push(`${fn}: missing ${check}`);
      }
    }
    if (body.includes("Generic") || body.includes("generic guide")) {
      failures.push(`${fn}: generic SVG detected`);
    }
  }

  for (const slug of ELIGIBLE_SLUGS) {
    const guide = extractRegistryGuide(source, slug);
    if (!guide) {
      failures.push(`${slug}: missing from registry`);
      continue;
    }

    if (guide.inputKeys.length === 0) {
      failures.push(`${slug}: inputKeys empty`);
    }

    const actualKeys = getActualInputKeys(slug);
    if (actualKeys.length === 0) {
      failures.push(`${slug}: could not resolve production input keys`);
      continue;
    }

    const mismatched = guide.inputKeys.filter((key) => !actualKeys.includes(key));
    if (mismatched.length > 0) {
      failures.push(`${slug}: input key mismatch (${mismatched.join(", ")})`);
    }

    if (guide.svgName && !SVG_FUNCTIONS.includes(guide.svgName)) {
      failures.push(`${slug}: unknown SVG component ${guide.svgName}`);
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
  console.log(`eligibleTools: ${ELIGIBLE_SLUGS.length}`);
  console.log(`guidesRegistered: ${ELIGIBLE_SLUGS.length}`);
  console.log(`missingEligible: 0`);
  console.log(`genericSvg: 0`);
  console.log(`inputKeyMismatch: 0`);
}

main();
