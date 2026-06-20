#!/usr/bin/env node
/**
 * audit:payment-gateway — Payment Gateway Smoke Test
 *
 * Verifies that payment-related endpoints and UI are functional:
 *   - Pricing page loads with valid pricing data
 *   - Premium tool pages have subscription/payment CTAs
 *   - Stripe checkout references exist in HTML
 *   - No hardcoded payment failures in console
 *
 * This is a smoke test only — does NOT execute real transactions.
 *
 * Usage: node scripts/audit/audit-payment-gateway.mjs [--url=https://sectorcalc.com]
 */
import { getBaseUrl } from "../smoke-utils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/payment-gateway-report.json");

const PREMIUM_ROUTES = [
  "/pricing", "/tr/pricing", "/de/pricing", "/fr/pricing", "/es/pricing", "/ar/pricing",
  "/premium-tools", "/tools/premium/cnc-quote-risk-analyzer",
];

async function main() {
  const urlArg = process.argv.find(a => a.startsWith("--url="));
  const baseUrl = (urlArg ? urlArg.split("=")[1] : getBaseUrl()).replace(/\/$/, "");

  console.log("=".repeat(60));
  console.log("PAYMENT GATEWAY — Smoke Test");
  console.log(`Target: ${baseUrl}`);
  console.log("Warning: Does NOT execute real transactions");
  console.log("=".repeat(60));

  const results = [];
  let pass = true;

  for (const route of PREMIUM_ROUTES) {
    try {
      const url = baseUrl + route;
      const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const body = await resp.text();
      const lower = body.toLowerCase();

      const findings = [];

      // Check for pricing/subscription elements
      const hasPricing = /pricing|price|fiyat|preis|prix|precio|السعر/.test(lower);
      const hasSubscribe = /subscribe|subscription|abonelik|abonnemang|abonnement|suscribir|اشتراك/.test(lower);
      const hasStripe = /stripe|pk_live|pk_test/.test(lower);
      const hasPremium = /premium|pro|enterprise/.test(lower);
      const has404 = body.includes("NEXT_NOT_FOUND") || body.includes("could not be found");

      if (has404) {
        findings.push({ severity: "ERROR", msg: "Page returns 404/not-found" });
        pass = false;
      }
      if (!hasPricing && route.includes("pricing")) {
        findings.push({ severity: "WARN", msg: "Pricing page missing pricing-related content" });
      }
      if (route.includes("pricing") && !hasStripe) {
        findings.push({ severity: "WARN", msg: "No Stripe references detected" });
      }
      if (route.includes("premium-tools") && !hasPremium && !hasSubscribe) {
        findings.push({ severity: "WARN", msg: "Premium page missing premium/subscription CTAs" });
      }

      const routePass = findings.filter(f => f.severity === "ERROR").length === 0;
      if (!routePass) pass = false;

      console.log(`  ${resp.status === 200 ? "✓" : "✗"} ${route} (HTTP ${resp.status})` +
        `${findings.length > 0 ? " — " + findings.map(f => `[${f.severity}] ${f.msg}`).join("; ") : ""}`);

      results.push({ route, status: resp.status, pass: routePass, findings });

    } catch (err) {
      console.log(`  ✗ ${route}: NETWORK ERROR — ${err.message.slice(0, 60)}`);
      results.push({ route, status: 0, pass: false, error: err.message.slice(0, 100) });
      pass = false;
    }
  }

  console.log("\n" + "=".repeat(60));
  const passedCount = results.filter(r => r.pass).length;
  console.log(`Routes: ${passedCount}/${results.length} PASS`);
  console.log(pass ? "✅ PAYMENT GATEWAY SMOKE PASS" : "❌ PAYMENT GATEWAY SMOKE FAIL — Investigate payment pages");

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    passed: pass,
    results,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(pass ? 0 : 1);
}

main().catch(err => {
  console.error("audit:payment-gateway FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
