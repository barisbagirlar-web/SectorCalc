#!/usr/bin/env npx tsx
/**
 * Locale catalog smoke — /free-tools, /premium-tools, /categories, /industries
 * across en (root) + tr, ar, de, fr, es prefixed routes.
 */

import { buildLocaleCatalogSmokeRoutes } from "../src/lib/i18n/locale-catalog-routes";
import { SUPPORTED_LOCALES } from "../src/lib/i18n/locale-config";

const BASE_URL = process.env.LOCALE_CATALOG_QA_BASE_URL ?? process.env.CAMPAIGN_QA_BASE_URL ?? "https://sectorcalc.com";
const RUN_SMOKE = process.env.LOCALE_CATALOG_QA_SMOKE === "1";

type AuditIssue = { level: "error" | "warn"; message: string };

const issues: AuditIssue[] = [];

function record(level: AuditIssue["level"], message: string): void {
  issues.push({ level, message });
}

async function smokeRoute(path: string): Promise<void> {
  const url = `${BASE_URL.replace(/\/$/, "")}${path}`;
  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html" },
      redirect: "follow",
    });
    if (!response.ok) {
      record("error", `Smoke failed ${url} → HTTP ${response.status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    record("error", `Smoke fetch error ${url}: ${message}`);
  }
}

async function main(): Promise<void> {
  const routes = buildLocaleCatalogSmokeRoutes();

  if (routes.length !== SUPPORTED_LOCALES.length * 4) {
    record(
      "error",
      `Expected ${SUPPORTED_LOCALES.length * 4} catalog routes, found ${routes.length}`,
    );
  }

  const requiredSamples = [
    "/free-tools",
    "/tr/free-tools",
    "/ar/free-tools",
    "/de/free-tools",
    "/fr/free-tools",
    "/es/free-tools",
    "/premium-tools",
    "/tr/premium-tools",
    "/categories",
    "/tr/categories",
    "/industries",
    "/tr/industries",
  ];

  for (const sample of requiredSamples) {
    if (!routes.includes(sample)) {
      record("error", `Missing required catalog route: ${sample}`);
    }
  }

  if (RUN_SMOKE) {
    for (const route of routes) {
      await smokeRoute(route);
    }
  }

  const errors = issues.filter((item) => item.level === "error");
  const warnings = issues.filter((item) => item.level === "warn");

  console.log("Locale catalog smoke audit");
  console.log(`Locales: ${SUPPORTED_LOCALES.join(", ")}`);
  console.log(`Routes: ${routes.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  if (RUN_SMOKE) {
    console.log(`Smoke base: ${BASE_URL}`);
  } else {
    console.log("Smoke skipped — set LOCALE_CATALOG_QA_SMOKE=1 to hit production");
  }

  for (const issue of issues) {
    console.log(`${issue.level.toUpperCase()}: ${issue.message}`);
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
