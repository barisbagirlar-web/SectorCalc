#!/usr/bin/env node
/**
 * ERT-0.1 — Live premium tool HTML smoke (fetch + regex).
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
const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";

const MIXED_LABEL_PATTERNS = [
  /\bAylık fee\b/i,
  /\bAylık subscription fee\b/i,
  /\bAy\s*[\*×x]?\s*value\b/i,
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
  const slugs = new Set([PROBLEM_SLUG]);
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

function hasActiveCalculateCta(visible) {
  if (!/data-calculation-form="true"/.test(visible)) {
    return false;
  }
  return /<button[^>]*type="submit"[^>]*>[\s\S]*?(Hesapla|Calculate)/i.test(visible);
}

function analyzeProblemSlug({ status, html }) {
  const visible = stripScripts(html);
  const failures = [];

  if (status !== 200) {
    failures.push(`http_${status}`);
  }

  const hasSafeState =
    html.includes('data-runtime-trust-safe-state="true"') ||
    html.includes('data-runtime-readiness-safe-state="true"') ||
    /Hesaplama kalite kontrolünde/i.test(visible);

  if (!hasSafeState) {
    failures.push("missing_safe_review_state");
  }

  for (const pattern of APPROVED_BADGE_PATTERNS) {
    if (pattern.test(visible)) {
      failures.push(`formula_gate_approved:${pattern.source}`);
      break;
    }
  }

  for (const pattern of MIXED_LABEL_PATTERNS) {
    if (pattern.test(visible)) {
      failures.push(`mixed_label:${pattern.source}`);
      break;
    }
  }

  for (const pattern of FREE_FAQ_PATTERNS) {
    if (pattern.test(visible)) {
      failures.push(`free_faq_on_premium:${pattern.source}`);
      break;
    }
  }

  if (hasSafeState && hasActiveCalculateCta(visible)) {
    failures.push("active_calculate_cta_with_safe_state");
  }

  return {
    slug: PROBLEM_SLUG,
    locale: "tr",
    path: localePath("tr", `/tools/premium/${PROBLEM_SLUG}`),
    status,
    severity: failures.length > 0 ? "critical" : "ok",
    hasForm: /<form[\s>]/i.test(html),
    hasSafeState,
    hasApprovedBadge: APPROVED_BADGE_PATTERNS.some((pattern) => pattern.test(visible)),
    findings: failures,
  };
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
    html.includes('data-runtime-readiness-safe-state="true"') ||
    /Hesaplama kalite kontrolünde/i.test(visible);

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
    severity = "critical";
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

  if (hasSafeState && hasActiveCalculateCta(visible)) {
    findings.push("active_calculate_cta_with_safe_state");
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

  let problem;
  try {
    const problemPath = localePath("tr", `/tools/premium/${PROBLEM_SLUG}`);
    const { status, html } = await fetchPage(problemPath);
    problem = analyzeProblemSlug({ status, html });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    problem = {
      slug: PROBLEM_SLUG,
      locale: "tr",
      path: localePath("tr", `/tools/premium/${PROBLEM_SLUG}`),
      status: 0,
      severity: "critical",
      hasForm: false,
      hasSafeState: false,
      hasApprovedBadge: false,
      findings: [`fetch_error:${message}`],
    };
  }

  if (problem.severity === "critical") {
    const alreadyLogged = items.some(
      (item) => item.slug === PROBLEM_SLUG && item.locale === "tr" && item.severity === "critical",
    );
    if (!alreadyLogged) {
      criticalCount += 1;
    }
    console.log(`CRITICAL problem-slug → ${problem.findings.join(", ")}`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: getBaseUrl(),
    totalChecked: items.length,
    critical: criticalCount,
    items,
    problemSlug: problem,
  };

  mkdirSync(join(ROOT, "scripts/.cache"), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`\ncritical: ${criticalCount}`);
  console.log(`output: ${REPORT_PATH}`);
  console.log(
    `\nProblem slug (tr): severity=${problem.severity}, approvedBadge=${problem.hasApprovedBadge}, safeState=${problem.hasSafeState}`,
  );

  if (criticalCount > 0 || problem.severity === "critical") {
    console.error("\nsmoke:live-premium-tools FAILED (critical findings)");
    process.exit(1);
  }

  console.log("\nsmoke:live-premium-tools PASS");
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
