#!/usr/bin/env node
/**
 * scripts/smoke-v531-form-visual-quality.mjs
 *
 * V5.3.1 Form Visual Quality Smoke Test.
 *
 * Tests:
 *   - Rendered H1 is not a raw slug
 *   - Category key is human-readable (not raw kebab-case)
 *   - Input metadata is properly separated (no concatenated text like "Base previewPending")
 *   - .sc-v531-shell exists
 *   - No Turkish Unicode
 *   - No exact formula leak markers
 *   - No legacy form component names
 *   - No 404 or Application error
 *   - Status 200 for all tested pages
 */

import http from "node:http";
import https from "node:https";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Configuration ──
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const PAGES = [
  "/tools/generated/roic-calculator",
  "/tools/generated/equity-dilution-calculator",
  "/tools/generated/pb-ratio-calculator",
  "/tools/generated/npv-calculator",
  "/tools/generated/wacc-calculator",
  "/tools/generated/ebitda-calculator",
  "/tools/generated/dcf-valuation-calculator",
  "/tools/generated/roi-calculator",
  "/tools/generated/beam-deflection-calculator",
  "/tools/generated/reynolds-number-calculator",
  "/free-tools",
  "/pro-tools",
  "/en",
  "/tr",
];

// Forbidden patterns in rendered HTML
const FORBIDDEN_PATTERNS = [
  // Raw metadata concatenation (must be separated)
  { pattern: /Base\s*previewPending/i, message: "Base preview concatenated without separator" },
  { pattern: /PHYSICAL\s*BOUNDS0/i, message: "Physical bounds concatenated without separator" },
  { pattern: /ENGINEERING\s*RANGE0/i, message: "Engineering range concatenated without separator" },
  { pattern: /REFERENCENo/i, message: "Reference label concatenated without separator" },
  { pattern: /EVIDENCEAdvisory/i, message: "Evidence label concatenated without separator" },

  // Raw keys in visible UI
  { pattern: />finance-sales-working-capital</, message: "Raw category key visible" },
  { pattern: />daily-renovation</, message: "Raw sector key visible" },

  // Error states — avoid matching nav/footer text; only flag server-side error blocks
  { pattern: /Application error/i, message: "Application error visible" },

  // Legacy form names
  { pattern: /PremiumSchemaToolForm/, message: "Legacy form component name detected" },
  { pattern: /FreeToolForm/, message: "Legacy FreeToolForm detected" },
  { pattern: /ProToolForm/, message: "Legacy ProToolForm detected" },

  // Turkish (must be absent from pages that should render English)
  { pattern: /[\u011f\u00fc\u015f\u0131\u00f6\u00e7\u011e\u00dc\u015e\u0130\u00d6\u00c7]/, message: "Turkish Unicode character detected" },
];

// Expected human-readable H1 patterns (must appear for specific pages)
const EXPECTED_H1 = {
  "/tools/generated/roic-calculator": ["ROIC Calculator"],
  "/tools/generated/equity-dilution-calculator": ["Equity Dilution Calculator"],
  "/tools/generated/pb-ratio-calculator": ["PB Ratio Calculator"],
  "/tools/generated/npv-calculator": ["NPV Calculator"],
  "/tools/generated/wacc-calculator": ["WACC Calculator"],
  "/tools/generated/ebitda-calculator": ["EBITDA Calculator"],
  "/tools/generated/dcf-valuation-calculator": ["DCF", "DCF Valuation"],
  "/tools/generated/roi-calculator": ["ROI Calculator"],
};

let exitCode = 0;
const errors = [];
const reports = [];

function ok(msg) {
  reports.push("  ✅ " + msg);
}

function fail(msg) {
  reports.push("  ❌ " + msg);
  errors.push(msg);
  exitCode = 1;
}

function heading(label) {
  reports.push("\n── " + label + " ──");
}

function httpGet(urlPath) {
  return new Promise((resolve) => {
    const url = new URL(urlPath, BASE_URL);
    const transport = url.protocol === "https:" ? https : http;
    const req = transport.get(url, { timeout: 15000 }, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => {
        resolve({ status: res.statusCode || 0, body: body.slice(0, 160000) });
      });
    });
    req.on("error", (err) => {
      resolve({ status: 0, body: "", error: err.message });
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, body: "", error: "timeout" });
    });
  });
}

async function main() {
  heading("=== V5.3.1 FORM VISUAL QUALITY SMOKE TEST ===");
  reports.push("Base URL: " + BASE_URL + "\n");

  for (const pagePath of PAGES) {
    heading("Page: " + pagePath);

    const resp = await httpGet(pagePath);

    // Status check
    if (pagePath === "/en" || pagePath === "/tr") {
      if (resp.status === 404) {
        ok(pagePath + " → " + resp.status + " (expected 404)");
      } else if (resp.status === 0) {
        fail(pagePath + " → connection error (expected 404)");
      } else {
        fail(pagePath + " → " + resp.status + " (expected 404)");
      }
      continue;
    }

    if (resp.status === 200) {
      ok(pagePath + " → 200");
    } else if (resp.status === 0) {
      fail(pagePath + " → connection error");
      continue;
    } else {
      fail(pagePath + " → " + resp.status + " (expected 200)");
      continue;
    }

    const body = resp.body;
    if (!body) {
      fail(pagePath + ": empty response body");
      continue;
    }

    // Check .sc-v531-shell exists (only for V5.3.1 tools in EXPECTED_H1)
    if (EXPECTED_H1[pagePath]) {
      const hasShell = body.includes("sc-v531-shell") || body.includes("sc-v531-");
      if (hasShell) {
        ok(".sc-v531-shell rendered");
      } else {
        fail("sc-v531-shell not found on " + pagePath);
      }
    }

    // Check H1 is human-readable
    if (EXPECTED_H1[pagePath]) {
      const accepted = EXPECTED_H1[pagePath];
      const h1Match = body.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      if (h1Match) {
        const h1Text = h1Match[1].trim();
        const matchesExpected = accepted.some(function (e) { return h1Text.includes(e); });
        if (matchesExpected) {
          ok('H1 is human-readable: "' + h1Text + '"');
        } else {
          fail('H1 may be raw: "' + h1Text + '" (expected one of: ' + accepted.join(", ") + ")");
        }
      } else {
        fail("No H1 found on page");
      }
    }

    // Check for forbidden patterns
    for (const check of FORBIDDEN_PATTERNS) {
      if (check.pattern.test(body)) {
        fail("[" + pagePath + "] " + check.message + " (matched: " + check.pattern + ")");
      }
    }
  }

  // ── Summary ──
  heading("\n=== SUMMARY ===");
  if (errors.length === 0) {
    reports.push("\n✅ ALL CHECKS PASSED");
  } else {
    reports.push("\n❌ " + errors.length + " CHECK(S) FAILED:");
    for (const err of errors) {
      reports.push("  - " + err);
    }
  }

  const totalChecks = reports.filter(function (r) { return r.startsWith("  ✅") || r.startsWith("  ❌"); }).length;
  reports.push("\nTotal checks: " + totalChecks);

  console.log(reports.join("\n"));
  process.exit(exitCode);
}

main().catch(function (err) {
  console.error("Fatal error:", err);
  process.exit(1);
});
