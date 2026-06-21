#!/usr/bin/env npx tsx
/**
 * PART 1: Tool definitions + Schema generator entry point
 * This file defines ALL 359 tools and generates schema JSON files + free-slugs.json
 *
 * Usage: npx tsx scripts/deepseek/generate-359-free-tools-p1.ts
 * Then:  npm run generate:all && npm run generate:registry
 */

import fs from "node:fs";
import path from "node:path";
import type { ToolDef, InputDef } from "./lib/359-types";


/* ── Re-export types ────────────────────────────── */

export { type ToolDef, type InputDef };

/* ── Constants ────────────────────────────────────── */

const PROJECT_ROOT = process.cwd();
const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const FREE_SLUGS_PATH = path.join(PROJECT_ROOT, "free-slugs.json");

/* ── i18n helpers ────────────────────────────────── */

function i18n(tr: string, en: string): Record<string, string> {
  return { en, tr, de: en, fr: en, es: en, ar: en };
}

/* ── Schema builder ──────────────────────────────── */

function buildSchema(tool: ToolDef): Record<string, unknown> {
  const inputs = tool.inputs.map((inp: InputDef) => ({
    id: inp.id,
    label: inp.lt,
    label_i18n: i18n(inp.lt, inp.le ?? inp.lt),
    type: "number",
    unit: inp.u,
    default: inp.d ?? 1,
    min: inp.mn ?? 0,
    ...(inp.mx !== undefined ? { max: inp.mx } : {}),
    businessContext: inp.ct,
    businessContext_i18n: i18n(inp.ct, inp.ce ?? inp.ct),
  }));

  const bkeys = tool.ok;
  const breakdown: Record<string, string> = {};
  const breakdown_i18n: Record<string, Record<string, string>> = {};
  const breakdownUnits: Record<string, string> = {};
  for (const k of bkeys) {
    const label = tool.ol?.[k] ?? k;
    breakdown[k] = label;
    breakdown_i18n[k] = { en: label, tr: label, de: label, fr: label, es: label, ar: label };
    breakdownUnits[k] = tool.ou;
  }

  return {
    toolName: tool.slug,
    catalogCategory: tool.cat,
    categorySlug: tool.cat,
    sector: tool.st,
    sectorId: tool.cat,
    inputs,
    validation: { rules: ["All numeric inputs must be positive numbers."], thresholds: {} },
    formulas: tool.f,
    outputs: {
      primary: tool.op,
      unit: tool.ou,
      breakdown,
      breakdown_i18n,
      breakdownUnits,
      hiddenLossDrivers: tool.ld ?? [],
      suggestedActions: tool.sa ?? [
        "Verify your inputs before making decisions.",
        "Consult with a licensed professional for personalized advice.",
      ],
      dataConfidenceAdjusted: `${tool.op}`,
    },
    premiumRequired: false,
    premiumFeatures: [],
    about: {
      description: {
        short: tool.de,
        long: tool.de,
        short_i18n: i18n(tool.dt, tool.de),
        long_i18n: i18n(tool.dt, tool.de),
      },
    },
  };
}

/* ── Writers ──────────────────────────────────────── */

function ensureDir(dir: string) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function writeSchema(tool: ToolDef) {
  ensureDir(SCHEMAS_DIR);
  const filePath = path.join(SCHEMAS_DIR, `${tool.slug}-schema.json`);
  fs.writeFileSync(filePath, JSON.stringify(buildSchema(tool), null, 2), "utf-8");
}

function updateFreeSlugs(toolDefs: ToolDef[]) {
  const slugs = [...new Set(toolDefs.map((t) => t.slug))];
  slugs.sort();
  fs.writeFileSync(FREE_SLUGS_PATH, JSON.stringify(slugs, null, 2), "utf-8");
  console.log(`free-slugs.json: ${slugs.length} slug yazıldı (önceki tüm slug'lar SİLİNDİ).`);
}

/* ── Tool definitions entry ──────────────────────── */
/* Import all sections and merge into one array       */

import { section1 } from "./lib/359-section1";
import { section2 } from "./lib/359-section2";
import { section3 } from "./lib/359-section3";
import { section4 } from "./lib/359-section4";
import { section5 } from "./lib/359-section5";
import { section6 } from "./lib/359-section6";
import { section7 } from "./lib/359-section7";
import { section8 } from "./lib/359-section8";
import { section9 } from "./lib/359-section9";
import { section10 } from "./lib/359-section10";
import { section11 } from "./lib/359-section11";
import { section12 } from "./lib/359-section12";
import { section13 } from "./lib/359-section13";
import { section14 } from "./lib/359-section14";
import { section15 } from "./lib/359-section15";
import { section16 } from "./lib/359-section16";
import { section17 } from "./lib/359-section17";
import { section18 } from "./lib/359-section18";
import { section19 } from "./lib/359-section19";
import { section20 } from "./lib/359-section20";
import { section21 } from "./lib/359-section21";
import { section22 } from "./lib/359-section22";

const ALL_TOOLS: ToolDef[] = [
  ...section1, ...section2, ...section3, ...section4, ...section5,
  ...section6, ...section7, ...section8, ...section9, ...section10,
  ...section11, ...section12, ...section13, ...section14, ...section15,
  ...section16, ...section17, ...section18, ...section19, ...section20,
  ...section21, ...section22,
];

/* ── Main ─────────────────────────────────────────── */

function main() {
  console.log(`Toplam ${ALL_TOOLS.length} tool tanımı yüklendi.`);
  let count = 0;
  for (const tool of ALL_TOOLS) { writeSchema(tool); count++; }
  console.log(`${count} schema JSON dosyası oluşturuldu.`);
  updateFreeSlugs(ALL_TOOLS);
  console.log("✅ Tüm schema dosyaları hazır.");
  console.log("Sonraki adımlar:");
  console.log("  npm run generate:all");
  console.log("  npm run generate:registry");
  console.log("  npm run lint && npx tsc --noEmit && npm run build");
}

main();
