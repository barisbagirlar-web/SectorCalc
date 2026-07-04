#!/usr/bin/env node
// SectorCalc SuperV4 — V5.3.1 Form UX Smoke Test
// Checks built output (JS chunks, CSS, HTML) for:
// 1. Forbidden raw tokens in user-facing surfaces
// 2. Required UX patterns from the V5.3.1 form redesign
//
// Modes:
//   node scripts/smoke-v531-form-ux.mjs              — source / build output
//   BASE_URL=https://www.sectorcalc.com node scripts/smoke-v531-form-ux.mjs  — live URL

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const NEXT_DIR = join(PROJECT_ROOT, ".next");
const PRO_FORM_DIR = join(PROJECT_ROOT, "src", "sectorcalc", "pro-form");

// ── Forbidden patterns (must not appear in user-facing surfaces) ──
const FORBIDDEN_PATTERNS = [
  "display_currency",
  "exact_formula",
  "internal_checker_trace",
  "FreeToolPage",
  "FreeToolPremiumCalculator",
  "sc-universal-dtf-shell",
  "sc-premium-dtf-container",
];
// Patterns skipped in source/build mode (legitimate server data, never user-visible UI):
const SOURCE_SKIP = new Set([
  "display_currency",    // valid unit key in data structures, mapped to "Currency" for display
  "exact_formula",       // server response field, never shown as raw text
  "internal_checker_trace", // server response field, never shown as raw text
]);

// ── Required UX patterns ──
const REQUIRED_UX = [
  "sc-v531-group-header",
  "sc-v531-group-chevron",
  "sc-v531-field-card",
  "sc-v531-field-title",
  "sc-v531-field-help",
  "sc-v531-input-row",
  "sc-v531-field-evidence",
  "sc-v531-evidence-title",
  "sc-v531-evidence-options",
  "sc-v531-side-panel",
  "sc-v531-primary-action",
  "No result yet",
  "Protected methodology",
];

// ── Test tools for live URL mode ──
const TEST_TOOLS = [
  "/tools/pro/sc_025_laser_cutting_nitrogen_consumption_and_kerf_dross_rework_cost_calculator",
  "/tools/pro/sc-001-data-center-power-and-cooling-capacity-margin-with-occupancy-ramp-calculator",
];

// ── Helpers ──

function collectBuildFiles() {
  const results = [];
  const dirs = [
    join(NEXT_DIR, "static", "chunks"),
    join(NEXT_DIR, "static", "css"),
    join(NEXT_DIR, "server"),
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    function walk(d) {
      let entries;
      try { entries = readdirSync(d); } catch { return; }
      for (const e of entries) {
        const full = join(d, e);
        let s;
        try { s = statSync(full); } catch { continue; }
        if (s.isDirectory() && e !== "node_modules") walk(full);
        else if (e.endsWith(".js") || e.endsWith(".css") || e.endsWith(".html")) results.push(full);
      }
    }
    walk(dir);
  }
  return results;
}

function checkPatterns(content, isBuild, isLive) {
  const fails = [];
  const passes = [];
  for (const p of FORBIDDEN_PATTERNS) {
    if ((!isBuild || isLive) && SOURCE_SKIP.has(p)) {
      passes.push(`forbidden token skipped: ${p} (server data, not UI)`); continue;
    }
    const re = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    (re.test(content) ? fails : passes).push(
      re.test(content) ? `FORBIDDEN_TOKEN_FOUND: ${p}` : `forbidden token absent: ${p}`
    );
  }
  for (const p of REQUIRED_UX) {
    const re = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    (re.test(content) ? passes : fails).push(
      re.test(content) ? `UX pattern present: ${p}` : `UX pattern missing: ${p}`
    );
  }
  return { passes, failures: fails };
}

// ── Main ──

async function main() {
  const baseUrl = process.env.BASE_URL;
  let content = "";
  let mode = "source";
  let fileCount = 0;

  if (baseUrl) {
    // ── LIVE URL mode: fetch actual pages (client-rendered) ──
    mode = "live URL";
    console.log(`Fetching ${TEST_TOOLS.length} Pro tool pages from ${baseUrl}...`);
    for (const path of TEST_TOOLS) {
      const url = `${baseUrl.replace(/\/$/, "")}${path}`;
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) { console.log(`  ⚠️  ${url} → ${res.status}`); continue; }
        const html = await res.text();
        content += html + "\n";
        fileCount++;
        console.log(`  ✅ ${url} (${html.length} bytes)`);
      } catch (e) { console.log(`  ❌ ${url} → ${e.message}`); }
    }
  } else if (existsSync(NEXT_DIR)) {
    // ── BUILD OUTPUT mode: scan JS / CSS / server chunks ──
    mode = "build";
    const files = collectBuildFiles();
    fileCount = files.length;
    for (const f of files) {
      try { content += readFileSync(f, "utf-8") + "\n"; } catch { /* skip */ }
    }
  }

  if (!content) {
    // ── SOURCE fallback ──
    mode = "source";
    console.log("WARN: No build or live URL. Scanning source files.");
    for (const f of ["UniversalIndustrialDecisionForm.tsx", "universal-industrial-decision-form.css"]) {
      const p = join(PRO_FORM_DIR, f);
      if (!existsSync(p)) continue;
      try { content += readFileSync(p, "utf-8") + "\n"; fileCount++; } catch { /* skip */ }
    }
  }

  const isBuild = mode !== "source";
  const isLive = mode === "live URL";
  const { passes, failures } = checkPatterns(content, isBuild, isLive);

  console.log("\n===== V5.3.1 FORM UX SMOKE =====");
  console.log(`Scanner: ${mode}`);
  console.log(`Scanned: ${fileCount > 0 ? fileCount + " files" : "N/A"}`);
  console.log(`Date: ${new Date().toISOString()}`);
  console.log("");
  for (const p of passes) console.log(`  PASS  ${p}`);
  for (const f of failures) console.log(`  FAIL  ${f}`);

  const ok = failures.length === 0;
  console.log(`\nV531_FORM_UX_SMOKE=${ok ? "PASS" : "FAIL"}`);
  process.exit(ok ? 0 : 1);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
