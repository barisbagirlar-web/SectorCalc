#!/usr/bin/env node
/**
 * P4 — Runtime smoke (build artifact + static/manifest route checks).
 * No local server start; no Playwright. Desktop/mobile UI remains manual.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_PATH = path.join(ROOT, "scripts/.cache/p4-runtime-smoke-report.json");
const NEXT_DIR = path.join(ROOT, ".next");

const CRITICAL_ROUTES = [
  "/tr",
  "/en",
  "/tr/free-tools",
  "/tr/premium-tools",
  "/tr/pricing",
  "/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi",
  "/tr/tools/premium-schema/cnc-oee-loss",
  "/tr/tools/free/machine-time-calculator",
  "/tr/reports/sample-decision-report",
  "/tr/trust",
];

const LOCALE_PAGE_PATTERNS = {
  "/tr/trust": "/[locale]/trust",
  "/en/trust": "/[locale]/trust",
  "/tr/reports/sample-decision-report": "/[locale]/reports/sample-decision-report",
  "/en/reports/sample-decision-report": "/[locale]/reports/sample-decision-report",
};

const blockers = [];
const checkedRoutes = [];
const missingRoutes = [];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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
    const dynamicPremium =
      /^\/tr\/tools\/premium\/[^/]+$/.test(route) ||
      /^\/tr\/tools\/free\/[^/]+$/.test(route) ||
      /^\/tr\/tools\/premium-schema\/[^/]+$/.test(route);
    if (dynamicPremium && prerenderRoutes.has(route)) {
      methods.push("dynamic-prerender");
    }
  }

  return methods;
}

function main() {
  console.log("=== test:p4-runtime-smoke ===\n");

  const buildArtifactOk = checkBuildArtifacts();
  const prerenderManifest = readJson(path.join(NEXT_DIR, "prerender-manifest.json"));
  const appPathManifest = readJson(path.join(NEXT_DIR, "app-path-routes-manifest.json"));
  const prerenderRoutes = new Set(Object.keys(prerenderManifest?.routes ?? {}));
  const appPathValues = new Set(Object.values(appPathManifest ?? {}));

  for (const route of CRITICAL_ROUTES) {
    const methods = resolveRoute(route, prerenderRoutes, appPathValues);
    const ok = methods.length > 0;
    checkedRoutes.push({ route, ok, methods });
    if (!ok) {
      missingRoutes.push(route);
      blockers.push(`route_missing:${route}`);
    }
  }

  const verdict = blockers.length === 0 ? "PASS" : "FAIL";

  const report = {
    generatedAt: new Date().toISOString(),
    checkedRoutes,
    missingRoutes,
    buildArtifactOk,
    verdict,
    blockers,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`buildArtifactOk: ${buildArtifactOk}`);
  console.log(`routes checked: ${CRITICAL_ROUTES.length}`);
  console.log(`missingRoutes: ${missingRoutes.length}`);
  console.log(`verdict: ${verdict}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);

  for (const entry of checkedRoutes) {
    const label = entry.ok ? "✓" : "✗";
    console.log(` ${label} ${entry.route} → ${entry.methods.join(", ") || "none"}`);
  }

  if (blockers.length > 0) {
    console.error("\nBlockers:");
    for (const blocker of blockers) {
      console.error(` - ${blocker}`);
    }
    process.exit(1);
  }

  console.log("\ntest:p4-runtime-smoke PASS");
}

main();
