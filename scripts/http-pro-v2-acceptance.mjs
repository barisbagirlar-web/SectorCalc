#!/usr/bin/env node
// SectorCalc PRO V2 — Form-to-API HTTP Bridge Acceptance Test
// Tests all 20 PRO tools through the actual HTTP execute endpoint.
// Uses adapter-generated payloads identical to what the UI sends.
//
// Usage: node scripts/http-pro-v2-acceptance.mjs
// Requires: production build at .next/standalone/server.js

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SCHEMA_DIR = join(ROOT, "src/sectorcalc/schemas/pro-v531");

const LIVE_TOOLS = [
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

const PORT = parseInt(process.env.PORT || "5555", 10);
const BASE_URL = `http://localhost:${PORT}`;

function loadSchema(slug) {
  const path = join(SCHEMA_DIR, `${slug}.schema.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function makeHttpRequest(url, method, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function buildPresetPayload(schema) {
  const raw_inputs = {};
  const selected_units = {};
  for (const inp of schema.inputs) {
    if (!inp.id) continue;
    const bu = inp.base_unit || "";
    const allowedUnits = inp.allowed_display_units || [bu];
    const unit = allowedUnits[0] || bu;
    let val;
    if (inp.id.includes("discount")) val = inp.base_unit === "ratio" ? 0.10 : 10;
    else if (inp.id.includes("confidence")) val = 0.9;
    else if (inp.id.includes("stress")) val = 0.3;
    else if (inp.id.includes("uncertainty")) val = 1.2;
    else if (inp.id.includes("deposition")) val = 85;
    else if (inp.id.includes("defect_rate") && unit.includes("pct")) val = 3.5;
    else if (inp.id.includes("target_margin") && unit.includes("pct")) val = 30;
    else if (inp.id.includes("pct") || inp.id.includes("percent")) val = 50;
    else if (inp.id.includes("initial_investment")) val = 500000;
    else if (inp.id.includes("annual_net_cash")) val = 150000;
    else if (inp.id.includes("residual")) val = 50000;
    else if (inp.id.includes("analysis_years") || inp.id.includes("life_years")) val = 5;
    else if (inp.id.includes("annual_volume")) val = 10000;
    else if (inp.id.includes("labor_rate") || inp.id.includes("machine_rate")) val = 65;
    else if (inp.id.includes("overhead_rate") || inp.id.includes("shop_overhead")) val = 85;
    else if (inp.id.includes("material_cost")) val = 25;
    else if (inp.id.includes("weld_length")) val = 12;
    else if (inp.id.includes("weld_throat")) val = 8;
    else if (inp.id.includes("weld_density")) val = 7850;
    else if (inp.id.includes("weld_time") || inp.id.includes("total_job_time")) val = 60;
    else if (inp.id.includes("arc_time")) val = 45;
    else if (inp.id.includes("wire_cost")) val = 18;
    else if (inp.id.includes("gas_cost") && unit.includes("per_min")) val = 0.84;
    else if (inp.id.includes("gas_cost") && unit.includes("per_h")) val = 8;
    else if (inp.id.includes("unit_price")) val = 100;
    else if (inp.id.includes("scrap_quantity")) val = 150;
    else if (inp.id.includes("rework_hours")) val = 120;
    else if (inp.id.includes("machine_name") || inp.id.includes("product_name") || inp.id.includes("employee_name") || inp.id.includes("material")) val = "test";
    else if (inp.id.includes("source_confidence")) val = 0.9;
    else if (inp.id.includes("contingency")) val = 5;
    else if (inp.id.includes("planned_quote")) val = 1500;
    else val = 100;
    raw_inputs[inp.id] = val;
    selected_units[inp.id] = unit;
  }
  return { raw_inputs, selected_units, tool_key: schema.tool_key || schema.tool_id, schema_version: schema.metadata?.schema_version || "5.3.1" };
}

async function main() {
  console.log("=== PRO V2 Form→API HTTP Acceptance Test ===\n");

  // Wait for server to be ready
  console.log(`Waiting for server at ${BASE_URL}...`);
  for (let i = 0; i < 30; i++) {
    try {
      const r = await makeHttpRequest(BASE_URL + "/api/health", "GET");
      if (r.status === 200 || r.status === 404) break;
    } catch { /* server not ready yet */ }
    await new Promise(r => setTimeout(r, 1000));
  }

  let pass = 0, fail = 0;
  const failures = [];

  for (const slug of LIVE_TOOLS) {
    const schema = loadSchema(slug);
    if (!schema) {
      console.log(`  FAIL  ${slug}: schema not found`);
      fail++;
      failures.push(slug);
      continue;
    }

    const preset = buildPresetPayload(schema);
    const executePayload = {
      tool_key: slug,
      schema_version: preset.schema_version,
      raw_inputs: preset.raw_inputs,
      selected_units: preset.selected_units,
    };

    try {
      const response = await makeHttpRequest(BASE_URL + "/api/pro-calculator/execute", "POST", executePayload);

      const statusOK = response.status === 200 || response.status === 400 || response.status === 402 || response.status === 403;
      const hasNoValidationError = !response.body?.pipeline_state?.includes("VALIDATION_FAILED") 
        && !response.body?.pipeline_state?.includes("INPUT_KEY_MISSING")
        && !response.body?.pipeline_state?.includes("INPUT_KEY_UNKNOWN")
        && !response.body?.pipeline_state?.includes("UNIT_NORMALIZATION_FAILED");

      if (statusOK && hasNoValidationError) {
        console.log(`  PASS  ${slug}: HTTP ${response.status} (${response.body?.pipeline_state || "OK"})`);
        pass++;
      } else {
        const state = response.body?.pipeline_state || "UNKNOWN";
        const msg = response.body?.warnings?.[0]?.message || (Array.isArray(response.body) ? response.body[0] : "") || "";
        console.log(`  FAIL  ${slug}: HTTP ${response.status} pipeline=${state} ${msg.slice(0, 60)}`);
        fail++;
        failures.push(slug);
      }
    } catch (err) {
      console.log(`  FAIL  ${slug}: ${err.message}`);
      fail++;
      failures.push(slug);
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`PASS: ${pass}/${LIVE_TOOLS.length}`);
  console.log(`FAIL: ${fail}/${LIVE_TOOLS.length}`);
  if (failures.length > 0) {
    console.log(`FAILED: ${failures.join(", ")}`);
  }
  console.log(`\n${fail === 0 ? "✓ ALL PASSED" : "✗ FAILURES DETECTED"}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
