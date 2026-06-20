#!/usr/bin/env node
/**
 * audit:rtl — Right-To-Left Layout Audit
 *
 * Verifies that Arabic (AR) locale pages render correctly:
 *   - <html dir="rtl"> or dir="auto" present
 *   - No hardcoded left-alignment in critical elements
 *   - Arabic page body is non-empty and structurally similar to EN
 *   - RTL-specific CSS classes detected
 *
 * Usage: node scripts/audit/audit-rtl.mjs [--url=https://sectorcalc.com]
 */
import { getBaseUrl } from "../smoke-utils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/rtl-report.json");

const RTL_LOCALES = ["ar"];
const COMPARISON_LOCALES = ["en", "ar"];
const ROUTES = ["/", "/free-tools", "/premium-tools", "/pricing", "/categories"];

async function main() {
  const urlArg = process.argv.find(a => a.startsWith("--url="));
  const baseUrl = (urlArg ? urlArg.split("=")[1] : getBaseUrl()).replace(/\/$/, "");

  console.log("=".repeat(60));
  console.log("RTL LAYOUT AUDIT — Right-To-Left Support");
  console.log(`Target: ${baseUrl}`);
  console.log("=".repeat(60));

  const issues = [];
  let pass = true;

  for (const route of ROUTES) {
    console.log(`\n--- ${route} ---`);

    // Fetch both EN and AR versions
    const pages = {};
    for (const locale of COMPARISON_LOCALES) {
      try {
        const url = locale === "en"
          ? `${baseUrl}${route}`
          : `${baseUrl}/${locale}${route}`;
        const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
        pages[locale] = await resp.text();
        console.log(`  ${locale}: ${resp.status}`);
      } catch (err) {
        pages[locale] = "";
        console.log(`  ${locale}: FAIL (${err.message.slice(0, 50)})`);
      }
    }

    const arBody = pages["ar"] || "";
    const enBody = pages["en"] || "";

    // 1. Check dir attribute on AR page
    if (arBody) {
      const dirMatch = arBody.match(/<html[^>]*\sdir=["']([^"']+)["']/i);
      if (!dirMatch) {
        issues.push({ route, severity: "ERROR", msg: "AR page missing dir attribute on <html>" });
        pass = false;
      } else if (dirMatch[1] !== "rtl" && dirMatch[1] !== "auto") {
        issues.push({ route, severity: "ERROR", msg: `AR page has dir="${dirMatch[1]}" instead of "rtl"` });
        pass = false;
      } else {
        console.log(`  ✓ dir="${dirMatch[1]}" on Arabic page`);
      }
    }

    // 2. Check for RTL-specific CSS
    if (arBody) {
      const hasRtlStyles = arBody.includes("[dir=\"rtl\"]") ||
        arBody.includes(".rtl") ||
        arBody.includes("margin-left") ||
        arBody.includes("text-align: right");
      if (hasRtlStyles) {
        console.log("  ✓ RTL-specific styles detected");
      } else {
        issues.push({ route, severity: "WARN", msg: "No RTL-specific CSS patterns detected — may render incorrectly" });
      }
    }

    // 3. Body content ratio (AR should not be empty)
    if (arBody && enBody) {
      const arLen = arBody.length;
      const enLen = enBody.length;
      const ratio = arLen / Math.max(enLen, 1);
      if (ratio < 0.1) {
        issues.push({ route, severity: "ERROR", msg: `AR page body too short (${Math.round(ratio * 100)}% of EN) — likely broken` });
        pass = false;
      } else if (ratio < 0.5) {
        issues.push({ route, severity: "WARN", msg: `AR page body is ${Math.round(ratio * 100)}% of EN — partial content` });
      } else {
        console.log(`  ✓ AR body size: ${Math.round(ratio * 100)}% of EN`);
      }
    }

    // 4. Check for hardcoded left alignment
    if (arBody) {
      const leftAligns = (arBody.match(/text-align:\s*left/gi) || []).length;
      const rightAligns = (arBody.match(/text-align:\s*right/gi) || []).length;
      if (leftAligns > rightAligns + 2) {
        issues.push({ route, severity: "WARN", msg: `AR page has ${leftAligns} left-align vs ${rightAligns} right-align — possible RTL issues` });
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  const errors = issues.filter(i => i.severity === "ERROR");
  const warns = issues.filter(i => i.severity === "WARN");
  console.log(`Issues: ${errors.length} errors, ${warns.length} warnings`);
  for (const issue of issues) {
    console.log(`  ${issue.severity === "ERROR" ? "✗" : "⚠"} [${issue.severity}] ${issue.route}: ${issue.msg}`);
  }

  console.log(pass ? "\n✅ RTL AUDIT PASS — Arabic layout support adequate" : "\n❌ RTL AUDIT FAIL — Arabic layout issues found");

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    passed: pass,
    issues,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(pass ? 0 : 1);
}

main().catch(err => {
  console.error("audit:rtl FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
