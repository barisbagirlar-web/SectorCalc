#!/usr/bin/env node
/**
 * ERT-0 — Live premium tool HTML smoke (fetch + regex).
 *
 * Usage:
 *   BASE_URL=https://www.sectorcalc.com node scripts/smoke-live-premium-tools.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getBaseUrl, localePath } from "./smoke-utils.mjs";

const ROOT = join(import.meta.dirname, "..");
const REPORT_PATH = join(ROOT, "scripts/.cache/live-premium-smoke-report.json");
const MAX_PAGES = Number(process.env.LIVE_PREMIUM_SMOKE_MAX ?? 100);
const LOCALES = (process.env.LIVE_PREMIUM_SMOKE_LOCALES ?? "tr,en").split(",").map((v) => v.trim());

const MIXED_LABEL_PATTERNS = [
  /\bAylık fee\b/i,
  /\bsubscription fee\b/i,
  /\bAy value\b/i,
  /\bamount value\b/i,
  /\binput value\b/i,
];

const FREE_FAQ_PATTERNS = [
  /\bBu hesaplama aracı ücretsiz mi\?\s*Evet/i,
  /\bFree calculator\b/i,
  /\bÜcretsiz hesaplama\b/i,
];

const APPROVED_BADGE_PATTERNS = [
  /\bFormula Gate Onaylı\b/,
  /\bFormula Gate Approved\b/,
];

function loadPremiumSlugs() {
  const routesPath = join(ROOT, "public/ai-tool-routes.json");
  if (!existsSync(routesPath)) {
    return [];
  }
  const doc = JSON.parse(readFileSync(routesPath, "utf8"));
  const rows = doc.activeRoutes ?? doc.routes ?? doc.tools ?? [];
  const slugs = new Set();
  for (const row of rows) {
    const pathValue = row.routePath ?? row.path ?? "";
    const match = String(pathValue).match(/\/tools\/premium\/([^/]+)/);
    if (match?.[1]) {
      slugs.add(match[1]);
    }
  }
  return [...slugs].sort((a, b) => a.localeCompare(b)).slice(0, MAX_PAGES);
}

function stripScripts(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function analyzePage({ slug, locale, path, status, html }) {
  const visible = stripScripts(html);
  const findings = [];
  let severity = "ok";

  if (status !== 200) {
    findings.push(`http_${status}`);
    severity = "critical";
  }

  const hasForm = /<form[\s>]/i.test(html);
  const hasSafeState =
    html.includes('data-runtime-trust-safe-state="true"') ||
    html.includes('data-runtime-readiness-safe-state="true"');

  if (!hasForm && !hasSafeState && status === 200) {
    findings.push("missing_form_or_safe_state");
    severity = "critical";
  }

  for (const pattern of MIXED_LABEL_PATTERNS) {
    if (pattern.test(visible)) {
      findings.push(`mixed_label:${pattern.source}`);
      severity = "critical";
      break;
    }
  }

  for (const pattern of FREE_FAQ_PATTERNS) {
    if (pattern.test(visible)) {
      findings.push(`free_faq_on_premium:${pattern.source}`);
      severity = "critical";
      break;
    }
  }

  const hasApprovedBadge = APPROVED_BADGE_PATTERNS.some((pattern) => pattern.test(visible));
  if (hasApprovedBadge) {
    findings.push("formula_gate_approved_visible");
  }

  const placeholderOnly =
    /Değerleri girin/i.test(visible) &&
    !hasSafeState &&
    !/verdict|karar|sonuç|result/i.test(visible);
  if (placeholderOnly) {
    findings.push("placeholder_only_result");
    severity = "critical";
  }

  const paymentActive =
    /credit|kredi|checkout|subscribe|pro plan/i.test(visible) &&
    /(sc-cta-primary|checkout|consume|kredi tüket)/i.test(html) &&
    !/data-runtime-trust-safe-state="true"/.test(html);

  if (paymentActive && hasSafeState) {
    findings.push("payment_cta_with_safe_state");
    severity = "critical";
  }

  return {
    slug,
    locale,
    path,
    status,
    severity,
    hasForm,
    hasSafeState,
    hasApprovedBadge,
    findings,
  };
}

async function fetchPage(path) {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "SectorCalc-RuntimeTrustSmoke/1.0" },
  });
  const html = await res.text();
  return { status: res.status, html };
}

async function main() {
  const slugs = loadPremiumSlugs();
  const items = [];
  let criticalCount = 0;

  console.log(`=== Live Premium Tools Smoke (${getBaseUrl()}) ===`);
  console.log(`slugs: ${slugs.length}, locales: ${LOCALES.join(", ")}\n`);

  for (const locale of LOCALES) {
    for (const slug of slugs) {
      const path = localePath(locale, `/tools/premium/${slug}`);
      try {
        const { status, html } = await fetchPage(path);
        const item = analyzePage({ slug, locale, path, status, html });
        items.push(item);
        if (item.severity === "critical") {
          criticalCount += 1;
          console.log(`CRITICAL ${locale} ${slug} → ${item.findings.join(", ")}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        items.push({
          slug,
          locale,
          path,
          status: 0,
          severity: "critical",
          hasForm: false,
          hasSafeState: false,
          hasApprovedBadge: false,
          findings: [`fetch_error:${message}`],
        });
        criticalCount += 1;
        console.log(`CRITICAL ${locale} ${slug} → fetch_error`);
      }
    }
  }

  const problem = items.find(
    (item) => item.slug === "abonelik-yazilim-cloud-yillik-maliyet-hesabi" && item.locale === "tr",
  );

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: getBaseUrl(),
    totalChecked: items.length,
    critical: criticalCount,
    items,
    problemSlug: problem ?? null,
  };

  mkdirSync(join(ROOT, "scripts/.cache"), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`\ncritical: ${criticalCount}`);
  console.log(`output: ${REPORT_PATH}`);
  if (problem) {
    console.log(
      `\nProblem slug (tr): severity=${problem.severity}, approvedBadge=${problem.hasApprovedBadge}, safeState=${problem.hasSafeState}`,
    );
  }
  console.log("\nsmoke:live-premium-tools complete (exit 0 — fail policy deferred to CI batch)");
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
