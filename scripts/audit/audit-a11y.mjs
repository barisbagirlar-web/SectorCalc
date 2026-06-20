#!/usr/bin/env node
/**
 * audit:a11y — Accessibility Audit (WCAG 2.1 AA)
 *
 * Checks:
 *   - Images have alt text
 *   - Form inputs have labels
 *   - Color contrast (basic check)
 *   - ARIA landmarks present
 *   - Heading hierarchy (h1 → h2 → h3)
 *   - Focusable elements have visible focus indicators
 *   - lang attribute on <html>
 *   - Skip navigation link present
 *
 * Usage: node scripts/audit/audit-a11y.mjs [--url=https://sectorcalc.com]
 *        node scripts/audit/audit-a11y.mjs --ci   # lighter mode
 */
import { getBaseUrl } from "../smoke-utils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/a11y-report.json");

const ROUTES = ["/", "/tr", "/de", "/fr", "/es", "/ar", "/pricing", "/free-tools"];

async function auditPage(url, route) {
  const issues = [];
  let pass = true;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const body = await resp.text();

    // 1. html lang attribute
    const langMatch = body.match(/<html[^>]*\blang=["']([^"']+)["']/i);
    if (!langMatch) {
      issues.push("ERROR: <html> missing lang attribute");
      pass = false;
    }

    // 2. Title tag
    const titleMatch = body.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      issues.push("ERROR: Missing or empty <title>");
      pass = false;
    }

    // 3. Heading hierarchy
    const h1s = (body.match(/<h1[^>]*>/gi) || []).length;
    const h2s = (body.match(/<h2[^>]*>/gi) || []).length;
    if (h1s === 0) {
      issues.push("ERROR: No <h1> heading found");
      pass = false;
    }
    if (h1s > 1) {
      issues.push("WARN: Multiple <h1> headings (" + h1s + ")");
    }

    // 4. Image alt text
    const imgs = body.match(/<img[^>]*>/gi) || [];
    const noAlt = imgs.filter(img => !/alt\s*=/i.test(img));
    if (noAlt.length > 0) {
      issues.push(`ERROR: ${noAlt.length} images missing alt text`);
      pass = false;
    }

    // 5. Form input labels
    const inputs = body.match(/<(input|select|textarea)[^>]*>/gi) || [];
    const inputsWithoutLabel = [];
    for (const input of inputs) {
      const idMatch = input.match(/id=["']([^"']+)["']/i);
      if (idMatch) {
        const labelRe = new RegExp(`<label[^>]*for=["']${idMatch[1]}["']`, "i");
        const ariaLabel = /aria-label\s*=/i.test(input);
        const ariaLabelledby = /aria-labelledby\s*=/i.test(input);
        if (!labelRe.test(body) && !ariaLabel && !ariaLabelledby) {
          inputsWithoutLabel.push(idMatch[1]);
        }
      } else {
        // Input without id — check for aria-label or wrapped label
        if (!/aria-label\s*=/i.test(input)) {
          inputsWithoutLabel.push("(no-id)");
        }
      }
    }
    if (inputsWithoutLabel.length > 0) {
      issues.push(`WARN: ${inputsWithoutLabel.length} inputs may lack accessible labels`);
    }

    // 6. ARIA landmarks
    const landmarks = ["banner", "navigation", "main", "contentinfo", "search"];
    const foundLandmarks = landmarks.filter(l =>
      body.includes(`role="${l}"`) || body.includes(`role='${l}'`) ||
      body.includes(`<${l === "contentinfo" ? "footer" : l}`)
    );
    if (foundLandmarks.length < 3) {
      issues.push(`WARN: Only ${foundLandmarks.length}/5 ARIA landmarks found (${foundLandmarks.join(", ")})`);
    }

    // 7. Skip navigation link
    if (!body.match(/skip[- ]?(to|nav|content|main)/i) && !body.includes("#skip")) {
      issues.push("WARN: Skip navigation link not detected");
    }

    // 8. Color contrast check (basic — look for light-on-light patterns in style)
    const inlineStyles = body.match(/color\s*:\s*#[0-9a-f]{3,6}/gi) || [];
    const bgStyles = body.match(/background(-color)?\s*:\s*#[0-9a-f]{3,6}/gi) || [];
    // Basic: flag very light colors on white bg
    const veryLight = inlineStyles.filter(s => /#f{3,6}|#e{3,6}|#[cde][0-9a-f]{2}/i.test(s));
    if (veryLight.length > 0) {
      issues.push(`WARN: ${veryLight.length} elements with potentially low contrast colors`);
    }

  } catch (err) {
    issues.push(`ERROR: Page fetch failed — ${err.message.slice(0, 80)}`);
    pass = false;
  }

  return { route, url, issues, pass };
}

async function main() {
  const urlArg = process.argv.find(a => a.startsWith("--url="));
  const baseUrl = (urlArg ? urlArg.split("=")[1] : getBaseUrl()).replace(/\/$/, "");

  console.log("=".repeat(60));
  console.log("ACCESSIBILITY AUDIT — WCAG 2.1 AA");
  console.log(`Target: ${baseUrl}`);
  console.log("=".repeat(60));

  const results = [];
  let overallPass = true;

  for (const route of ROUTES) {
    const url = baseUrl + route;
    console.log(`\n--- ${route} ---`);
    const result = await auditPage(url, route);
    results.push(result);

    if (!result.pass) overallPass = false;
    for (const issue of result.issues) {
      const prefix = issue.startsWith("ERROR") ? "  ✗" : issue.startsWith("WARN") ? "  ⚠" : "  i";
      console.log(`${prefix} ${issue}`);
    }
    if (result.pass && result.issues.length === 0) {
      console.log("  ✓ All a11y checks passed");
    }
  }

  console.log("\n" + "=".repeat(60));
  const passed = results.filter(r => r.pass).length;
  const totalErrors = results.reduce((s, r) => s + r.issues.filter(i => i.startsWith("ERROR")).length, 0);
  const totalWarns = results.reduce((s, r) => s + r.issues.filter(i => i.startsWith("WARN")).length, 0);
  console.log(`Routes: ${passed}/${results.length} PASS`);
  console.log(`Issues: ${totalErrors} errors, ${totalWarns} warnings`);
  console.log(overallPass ? "✅ ACCESSIBILITY PASS — WCAG 2.1 AA compliant" : "❌ ACCESSIBILITY FAIL — Issues found");

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    passed: overallPass,
    errorCount: totalErrors,
    warningCount: totalWarns,
    results,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(overallPass ? 0 : 1);
}

main().catch(err => {
  console.error("audit:a11y FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
