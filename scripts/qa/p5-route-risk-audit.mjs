#!/usr/bin/env node
/**
 * P5A — Route risk audit (report only; no code changes).
 * Checks critical routes in build artifacts + trust/payment surface risks.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_PATH = path.join(ROOT, "scripts/.cache/p5-route-risk-audit-report.json");
const NEXT_DIR = path.join(ROOT, ".next");
const TRUST_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");

const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";

const CRITICAL_ROUTES = [
  "/tr",
  "/en",
  "/tr/free-tools",
  "/tr/premium-tools",
  "/tr/pricing",
  "/tr/trust",
  "/tr/reports/sample-decision-report",
  "/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi",
  "/tr/tools/premium/3d-print-job-margin-tool",
  "/tr/tools/premium-schema/cnc-oee-loss",
  "/tr/tools/premium-schema/7-israf-muda-avcisi-parasal-karsilik-calculator",
  "/tr/tools/free/machine-time-calculator",
  "/tr/tools/free/project-cost-calculator",
];

const HEAVY_ROUTE_PATTERNS = [
  { route: "/tr/premium-tools", note: "large catalog grid; watch LCP and hydration" },
  { route: "/tr/tools/premium/[slug]", note: "dynamic premium tool pages; form + result bundle" },
  { route: "/tr/tools/premium-schema/[slug]", note: "schema-driven premium pages; heavier metadata" },
  { route: "/tr/tools/free/[slug]", note: "dynamic free tool pages; SEO + form surface" },
];

const LOCALE_PAGE_PATTERNS = {
  "/tr/trust": "/[locale]/trust",
  "/en/trust": "/[locale]/trust",
  "/tr/reports/sample-decision-report": "/[locale]/reports/sample-decision-report",
  "/en/reports/sample-decision-report": "/[locale]/reports/sample-decision-report",
};

const blockers = [];
const warnings = [];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function routeToStaticHtml(route) {
  const relative = route === "/en" ? "en.html" : `${route.slice(1)}.html`;
  return path.join(NEXT_DIR, "server", "app", relative);
}

function routeToLocalePageJs(route) {
  const segments = route.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }
  const [, ...rest] = segments;
  return path.join(NEXT_DIR, "server", "app", "[locale]", ...rest, "page.js");
}

function checkBuildArtifacts() {
  const checks = [
    path.join(NEXT_DIR, "BUILD_ID"),
    path.join(NEXT_DIR, "server", "app"),
    path.join(NEXT_DIR, "prerender-manifest.json"),
    path.join(NEXT_DIR, "app-path-routes-manifest.json"),
  ];
  const missing = checks.filter((filePath) => !fs.existsSync(filePath));
  if (missing.length > 0) {
    for (const filePath of missing) {
      blockers.push(`build_artifact_missing:${path.relative(ROOT, filePath)}`);
    }
    return false;
  }
  return true;
}

function resolveRoute(route, prerenderRoutes, appPathValues) {
  const methods = [];

  if (prerenderRoutes.has(route)) {
    methods.push("prerender-manifest");
  }

  const staticHtml = routeToStaticHtml(route);
  if (fs.existsSync(staticHtml)) {
    methods.push("static-html");
  }

  const pagePattern = LOCALE_PAGE_PATTERNS[route];
  if (pagePattern && appPathValues.has(pagePattern)) {
    methods.push("app-path-manifest");
    const pageJs = routeToLocalePageJs(route);
    if (pageJs && fs.existsSync(pageJs)) {
      methods.push("locale-page-js");
    }
  }

  if (methods.length === 0) {
    const dynamicTool =
      /^\/tr\/tools\/premium\/[^/]+$/.test(route) ||
      /^\/tr\/tools\/free\/[^/]+$/.test(route) ||
      /^\/tr\/tools\/premium-schema\/[^/]+$/.test(route);
    if (dynamicTool && prerenderRoutes.has(route)) {
      methods.push("dynamic-prerender");
    }
  }

  return methods;
}

function isPremiumRoute(route) {
  return (
    route.includes("/tools/premium/") ||
    route.includes("/tools/premium-schema/") ||
    route === "/tr/premium-tools"
  );
}

function auditTrustSurface() {
  const trustReport = readJson(TRUST_REPORT_PATH);
  if (!trustReport) {
    warnings.push("trust_report_missing:run audit:runtime-trust-engine for full payment audit");
    return {
      problemSlugSafe: null,
      freePaymentRisk: { count: null, slugs: [], safe: null },
    };
  }

  const freePaymentItems = (trustReport.items ?? []).filter(
    (item) => item.paymentEligible && item.tier === "free",
  );
  const freePaymentRisk = {
    count: freePaymentItems.length,
    slugs: freePaymentItems.map((item) => item.slug),
    safe: freePaymentItems.length === 0,
  };

  if (!freePaymentRisk.safe) {
    blockers.push(`free_payment_eligible:${freePaymentRisk.count}`);
  }

  const problem = (trustReport.items ?? []).find((item) => item.slug === PROBLEM_SLUG);
  let problemSlugSafe = false;

  if (!problem) {
    blockers.push(`problem_slug_missing:${PROBLEM_SLUG}`);
  } else if (problem.paymentEligible || problem.formulaGateEligible) {
    if (problem.paymentEligible) {
      blockers.push(`problem_slug_payment_eligible:${PROBLEM_SLUG}`);
    }
    if (problem.formulaGateEligible) {
      blockers.push(`problem_slug_formula_gate_eligible:${PROBLEM_SLUG}`);
    }
  } else {
    problemSlugSafe = true;
  }

  return { problemSlugSafe, freePaymentRisk };
}

function main() {
  console.log("=== audit:p5-route-risk ===\n");

  if (CRITICAL_ROUTES.length === 0) {
    blockers.push("critical_route_list_empty");
  }

  const buildArtifactOk = checkBuildArtifacts();
  const prerenderManifest = readJson(path.join(NEXT_DIR, "prerender-manifest.json"));
  const appPathManifest = readJson(path.join(NEXT_DIR, "app-path-routes-manifest.json"));
  const prerenderRoutes = new Set(Object.keys(prerenderManifest?.routes ?? {}));
  const appPathValues = new Set(Object.values(appPathManifest ?? {}));

  const checkedRoutes = [];
  const suspectedMissingRoutes = [];

  for (const route of CRITICAL_ROUTES) {
    const methods = resolveRoute(route, prerenderRoutes, appPathValues);
    const ok = methods.length > 0;
    checkedRoutes.push({ route, ok, methods, premium: isPremiumRoute(route) });
    if (!ok) {
      suspectedMissingRoutes.push(route);
      if (isPremiumRoute(route)) {
        blockers.push(`premium_route_missing:${route}`);
      } else {
        warnings.push(`route_not_in_build:${route}`);
      }
    }
  }

  const heavyRoutes = HEAVY_ROUTE_PATTERNS.map((entry) => {
    const sampleRoute = CRITICAL_ROUTES.find(
      (route) =>
        (entry.route.includes("[slug]") &&
          ((entry.route.includes("premium-schema") && route.includes("/tools/premium-schema/")) ||
            (entry.route.includes("/tools/premium/") && route.includes("/tools/premium/")) ||
            (entry.route.includes("/tools/free/") && route.includes("/tools/free/")))) ||
        route === entry.route,
    );
    return {
      pattern: entry.route,
      note: entry.note,
      sampleChecked: sampleRoute ?? null,
      sampleOk: sampleRoute
        ? checkedRoutes.find((item) => item.route === sampleRoute)?.ok ?? false
        : null,
    };
  });

  const { problemSlugSafe, freePaymentRisk } = auditTrustSurface();

  let verdict = "PASS";
  if (blockers.length > 0) {
    verdict = "FAIL";
  } else if (warnings.length > 0 || !buildArtifactOk) {
    verdict = "REVIEW";
  }

  const report = {
    generatedAt: new Date().toISOString(),
    checkedRoutes,
    suspectedMissingRoutes,
    problemSlugSafe,
    freePaymentRisk,
    heavyRoutes,
    warnings,
    blockers,
    verdict,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`buildArtifactOk: ${buildArtifactOk}`);
  console.log(`routes checked: ${CRITICAL_ROUTES.length}`);
  console.log(`suspectedMissingRoutes: ${suspectedMissingRoutes.length}`);
  console.log(`problemSlugSafe: ${problemSlugSafe}`);
  console.log(`freePaymentRisk.count: ${freePaymentRisk.count}`);
  console.log(`verdict: ${verdict}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);

  for (const entry of checkedRoutes) {
    const label = entry.ok ? "✓" : "✗";
    console.log(` ${label} ${entry.route} → ${entry.methods.join(", ") || "none"}`);
  }

  if (warnings.length > 0) {
    console.warn("\nWarnings:");
    for (const warning of warnings) {
      console.warn(` - ${warning}`);
    }
  }

  if (blockers.length > 0) {
    console.error("\nBlockers:");
    for (const blocker of blockers) {
      console.error(` - ${blocker}`);
    }
    process.exit(1);
  }

  console.log("\naudit:p5-route-risk PASS");
}

main();
