#!/usr/bin/env node
/**
 * ERT-0.1 — Hard assert for the problem slug live trust surface.
 *
 * Usage:
 *   BASE_URL=https://www.sectorcalc.com node scripts/assert-problem-slug-trust.mjs
 */
import { getBaseUrl, localePath } from "./smoke-utils.mjs";

const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";
const LOCALE = "tr";

const FORBIDDEN_PATTERNS = [
  { id: "formula_gate_approved_tr", pattern: /\bFormula Gate Onaylı\b/ },
  { id: "formula_gate_approved_en", pattern: /\bFormula Gate Approved\b/ },
  { id: "mixed_label_aylik_fee", pattern: /\bAylık fee\b/i },
  { id: "mixed_label_subscription_fee", pattern: /\bAylık subscription fee\b/i },
  { id: "mixed_label_ay_value", pattern: /\bAy\s*[\*×x]?\s*value\b/i },
  { id: "free_faq_on_premium", pattern: /\bBu hesaplama aracı ücretsiz mi\?\s*Evet/i },
];

function stripScripts(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function hasActiveCalculateCta(visible) {
  if (!/data-calculation-form="true"/.test(visible)) {
    return false;
  }
  return /<button[^>]*type="submit"[^>]*>[\s\S]*?(Hesapla|Calculate)/i.test(visible);
}

async function main() {
  const baseUrl = getBaseUrl();
  const path = localePath(LOCALE, `/tools/premium/${PROBLEM_SLUG}`);
  const url = `${baseUrl}${path}`;
  const failures = [];

  console.log(`=== assert-problem-slug-trust (${baseUrl}) ===`);
  console.log(`url: ${url}\n`);

  let html = "";
  let status = 0;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SectorCalc-ProblemSlugAssert/1.0" },
    });
    status = res.status;
    html = await res.text();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`fetch_error:${message}`);
  }

  if (status !== 200) {
    failures.push(`http_${status}`);
  }

  const visible = stripScripts(html);
  const hasSafeState =
    html.includes('data-runtime-trust-safe-state="true"') ||
    html.includes('data-runtime-readiness-safe-state="true"') ||
    /Hesaplama kalite kontrolünde/i.test(visible);

  if (!hasSafeState) {
    failures.push("missing_safe_review_state");
  }

  for (const { id, pattern } of FORBIDDEN_PATTERNS) {
    if (pattern.test(visible)) {
      failures.push(id);
    }
  }

  if (hasSafeState && hasActiveCalculateCta(visible)) {
    failures.push("active_calculate_cta_with_safe_state");
  }

  if (failures.length > 0) {
    console.error("FAIL");
    for (const failure of failures) {
      console.error(` - ${failure}`);
    }
    process.exit(1);
  }

  console.log("PASS");
  console.log(` - HTTP ${status}`);
  console.log(" - safe review state present");
  console.log(" - no Formula Gate approved badge");
  console.log(" - no mixed labels / free FAQ mismatch");
  console.log(" - no active calculate CTA");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
