#!/usr/bin/env node
/**
 * fix-pro-all-unit-display.mjs
 *
 * Scans ALL 20 LIVE_ENGINE_READY PRO schema files and fixes display unit issues:
 * 1. discount_rate, target_margin, margin, utilization, coverage fields with base_unit="ratio"
 *    → unit_selectable=true, "percent" first in allowed_display_units
 * 2. analysis_years, equipment_life_years, life_years, period fields with base_unit="s"
 *    → unit_selectable=true, "year" first in allowed_display_units
 * 3. current_kwh_per_year, target_kwh_per_year (energy-efficiency)
 *    → base_unit="kWh", not "J"
 * 4. avg_kwh_rate (energy-efficiency)
 *    → base_unit="currency_unit_per_kWh", not "currency_unit_per_h"
 * 5. Add "energy" and "time" conversion registries where needed
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMA_DIR = join(ROOT, "src", "sectorcalc", "schemas", "pro-v531");
const FORMULA_DIR = join(ROOT, "src", "sectorcalc", "formulas", "pro-v531");

const LIVE_TOOL_KEYS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

const FIELDS_THAT_NEED_PERCENT = new Set([
  "discount_rate",
  "target_margin",
  "gross_margin",
  "margin",
  "utilization",
  "target_utilization",
  "current_utilization",
  "grant_coverage_pct",
]);

const FIELDS_THAT_NEED_YEAR_UNIT = new Set([
  "analysis_years",
  "equipment_life_years",
  "life_years",
  "payback_period",
  "payback_years",
  "planning_horizon_years",
]);

function nameContainsPercent(name) {
  const lower = (name || "").toLowerCase();
  return lower.includes("margin") || lower.includes("utilization") ||
         lower.includes("coverage") || lower.includes("discount") ||
         lower.includes("percentage");
}

function nameContainsYear(name) {
  const lower = (name || "").toLowerCase();
  return lower.includes("year") || lower.includes("period") ||
         lower.includes("annual") || lower.includes("life");
}

function hasConversionRegistry(schema, kind) {
  return schema.unit_conversion_contract?.conversion_registry?.[kind];
}

let fixedCount = 0;
let totalChanges = 0;

const files = readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"));

for (const file of files) {
  const filePath = join(SCHEMA_DIR, file);
  let raw = readFileSync(filePath, "utf8");
  const schema = JSON.parse(raw);

  if (!schema.tool_key || !LIVE_TOOL_KEYS.includes(schema.tool_key)) continue;
  if (!schema.inputs) continue;

  const toolKey = schema.tool_key;
  const registry = schema.unit_conversion_contract?.conversion_registry || {};
  let changed = false;

  // ── Ensure "energy" conversion registry exists if any field uses energy ──
  const hasEnergyField = schema.inputs.some((i) => i.quantity_kind === "energy");
  if (hasEnergyField && !registry.energy) {
    registry.energy = {
      base_unit: "kWh",
      unit_family: "ENERGY",
      units: [{ unit: "kWh", factor: 1 }, { unit: "MWh", factor: 1000 }],
    };
    console.log(`  [FIX] Added energy conversion registry to ${file}`);
    changed = true;
  }

  // ── Ensure "time" conversion registry exists if any field uses time ──
  const hasTimeField = schema.inputs.some((i) => i.quantity_kind === "time");
  if (hasTimeField && !registry.time) {
    registry.time = {
      base_unit: "year",
      unit_family: "TIME",
      units: [{ unit: "year", factor: 1 }, { unit: "s", factor: 3.1709792e-8 }],
    };
    console.log(`  [FIX] Added time conversion registry to ${file}`);
    changed = true;
  }

  for (const input of schema.inputs) {
    const id = input.id || "";
    const name = input.name || "";
    const baseUnit = input.base_unit || "";

    // ── Fix: current_kwh_per_year / target_kwh_per_year from J to kWh ──
    if ((id === "current_kwh_per_year" || id === "target_kwh_per_year") && baseUnit === "J") {
      input.base_unit = "kWh";
      input.unit_selectable = true;
      input.allowed_display_units = input.allowed_display_units.map((u) => u === "J" ? "kWh" : u);
      // Ensure kWh is in allowed list
      if (!input.allowed_display_units.includes("kWh")) {
        input.allowed_display_units.unshift("kWh");
      }
      console.log(`  [FIX] ${file}: "${id}" base_unit J→kWh`);
      changed = true;
      totalChanges++;
    }

    // ── Fix: avg_kwh_rate from currency_unit_per_h to currency_unit_per_kWh ──
    if ((id === "avg_kwh_rate") && baseUnit === "currency_unit_per_h") {
      input.base_unit = "currency_unit_per_kWh";
      input.unit_selectable = true;
      input.allowed_display_units = input.allowed_display_units.map(
        (u) => u === "currency_unit_per_h" ? "currency_unit_per_kWh" : u
      );
      console.log(`  [FIX] ${file}: "${id}" base_unit currency_unit_per_h→currency_unit_per_kWh`);
      changed = true;
      totalChanges++;
    }

    // ── Fix: discount_rate, target_margin, utilization → percent display, ratio base ──
    if (FIELDS_THAT_NEED_PERCENT.has(id) && baseUnit === "ratio") {
      input.unit_selectable = true;
      if (!input.allowed_display_units.includes("percent")) {
        input.allowed_display_units = ["percent", ...input.allowed_display_units.filter((u) => u !== "percent")];
        console.log(`  [FIX] ${file}: "${id}" added percent display unit`);
        changed = true;
        totalChanges++;
      }
      if (input.allowed_display_units[0] !== "percent") {
        const idx = input.allowed_display_units.indexOf("percent");
        if (idx > 0) {
          input.allowed_display_units.splice(idx, 1);
          input.allowed_display_units.unshift("percent");
          console.log(`  [FIX] ${file}: "${id}" moved percent to first display unit`);
          changed = true;
          totalChanges++;
        }
      }
    }

    // ── Fix: analysis_years, equipment_life_years → year display ──
    if (FIELDS_THAT_NEED_YEAR_UNIT.has(id) && baseUnit !== "year") {
      // Keep base_unit, but add "year" to allowed display units first
      input.unit_selectable = true;
      if (!input.allowed_display_units.includes("year")) {
        input.allowed_display_units = ["year", ...input.allowed_display_units.filter((u) => u !== "year")];
        console.log(`  [FIX] ${file}: "${id}" added year display unit`);
        changed = true;
        totalChanges++;
      }
      if (input.allowed_display_units[0] !== "year") {
        const idx = input.allowed_display_units.indexOf("year");
        if (idx > 0) {
          input.allowed_display_units.splice(idx, 1);
          input.allowed_display_units.unshift("year");
          console.log(`  [FIX] ${file}: "${id}" moved year to first display unit`);
          changed = true;
          totalChanges++;
        }
      }
    }

    // ── Fallback: any field with "margin"/"discount"/"utilization" in name and ratio base_unit
    if (!FIELDS_THAT_NEED_PERCENT.has(id) && baseUnit === "ratio" && nameContainsPercent(name)) {
      // Check if it already has percent
      if (!input.allowed_display_units.includes("percent")) {
        input.unit_selectable = true;
        input.allowed_display_units = ["percent", ...input.allowed_display_units];
        console.log(`  [FIX] ${file}: "${id}" (${name}) added percent display unit`);
        changed = true;
        totalChanges++;
      }
    }

    // ── Fallback: any field with "year"/"period" in name and "s" base_unit
    if (!FIELDS_THAT_NEED_YEAR_UNIT.has(id) && baseUnit === "s" && nameContainsYear(name)) {
      if (!input.allowed_display_units.includes("year")) {
        input.unit_selectable = true;
        input.allowed_display_units = ["year", ...input.allowed_display_units.filter((u) => u !== "year")];
        console.log(`  [FIX] ${file}: "${id}" (${name}) added year display unit`);
        changed = true;
        totalChanges++;
      }
    }
  }

  if (changed) {
    // Preserve JSON formatting (use same spacing as original)
    const updated = JSON.stringify(schema, null, 2) + "\n";
    writeFileSync(filePath, updated, "utf8");
    fixedCount++;
  }
}

console.log(`\n[SUMMARY] Fixed ${fixedCount} schema files with ${totalChanges} field-level changes.`);
if (totalChanges === 0) {
  console.log("[INFO] No schemas needed fixing.");
}
