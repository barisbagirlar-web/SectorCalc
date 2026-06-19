#!/usr/bin/env node
/**
 * Static + smoke audit for Revenue Flow 27-sector catalog.
 * No npm dependencies — reads TS source and optionally smoke-tests live routes.
 *
 * Env:
 *   SECTORCALC_AUDIT_BASE_URL=https://sectorcalc.com  (default)
 *   CATALOG_QA_BASE_URL=...                           (legacy alias)
 *   CATALOG_QA_LOCALE=en|tr|...                       (default: en = no prefix)
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assertNoEnPrefix,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
} from "./smoke-utils.mjs";

const ROOT = process.cwd();
const LOCALE = (process.env.CATALOG_QA_LOCALE ?? "en").toLowerCase();

const EXPECTED_SECTORS = [
  "cnc-manufacturing",
  "construction",
  "cleaning",
  "restaurant",
  "ecommerce",
  "welding-fabrication",
  "hvac",
  "electrical-contracting",
  "landscaping-lawn-care",
  "auto-repair-shop",
  "printing-signage",
  "plumbing",
  "carpentry-millwork",
  "roofing",
  "painting",
  "sheet-metal",
  "3d-printing-service",
  "logistics-transport",
  "agriculture-crops",
  "agriculture-irrigation",
  "agriculture-feed",
  "agriculture-dairy",
  "energy-consumption",
  "energy-carbon",
  "daily-renovation",
  "daily-fuel",
  "daily-meals",
];

function read(relPath) {
  return readFileSync(resolve(ROOT, relPath), "utf8");
}

function localizedPath(path) {
  return localePath(LOCALE, path);
}

function extractArraySection(source, marker) {
  const start = source.indexOf(marker);
  if (start === -1) {
    return "";
  }
  const slice = source.slice(start);
  const end = slice.indexOf("];");
  return end === -1 ? slice : slice.slice(0, end);
}

function extractQuotedFieldValues(section, field) {
  const re = new RegExp(`${field}:\\s*"([^"]+)"`, "g");
  const values = [];
  let match = re.exec(section);
  while (match) {
    values.push(match[1]);
    match = re.exec(section);
  }
  return values;
}

function splitToolBlocks(section) {
  if (section.includes("buildTool(")) {
    return section.split(/(?=buildTool\(\{)/).filter((block) => block.includes('freeSlug: "'));
  }
  if (section.includes("build({")) {
    return section.split(/(?=build\(\{)/).filter((block) => block.includes('freeSlug: "'));
  }
  const blocks = [];
  const toolStart = /(?:^|\n)\s*(?:\/\*\*[\s\S]*?\*\/\s*)?\{/g;
  let match = toolStart.exec(section);
  while (match) {
    const start = match.index + match[0].lastIndexOf("{");
    let depth = 0;
    let end = start;
    for (let i = start; i < section.length; i += 1) {
      if (section[i] === "{") depth += 1;
      if (section[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    const block = section.slice(start, end);
    if (block.includes('sector: "') && block.includes('freeSlug: "')) {
      blocks.push(block);
    }
    match = toolStart.exec(section);
  }
  return blocks;
}

function findMatchingBracketEnd(text, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < text.length; i += 1) {
    if (text[i] === "[") depth += 1;
    if (text[i] === "]") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function countInputsInBlock(block, fieldName) {
  const fieldStart = block.indexOf(`${fieldName}:`);
  if (fieldStart === -1) {
    return 0;
  }
  const slice = block.slice(fieldStart);
  const arrayStart = slice.indexOf("[");
  const arrayEnd = findMatchingBracketEnd(slice, arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return 0;
  }
  const arrayBody = slice.slice(arrayStart, arrayEnd);
  const explicitKeys = (arrayBody.match(/\bkey:\s*"/g) ?? []).length;
  const helperInputs = (
    arrayBody.match(
      /(?:currency|numberInput|percentInput|yesNoSelect|qualitySelect)\(/g
    ) ?? []
  ).length;
  const refInputs = (arrayBody.match(/\benergySelect\b/g) ?? []).length;
  return explicitKeys + helperInputs + refInputs;
}

function hasLegalDisclaimer(block, additionalSource) {
  if (block.includes("legalDisclaimer")) {
    return true;
  }
  if (block.includes("buildTool(") && additionalSource.includes("legalDisclaimer: LEGAL_DISCLAIMER")) {
    return true;
  }
  if (block.includes("build({") && additionalSource.includes("legalDisclaimer: LEGAL")) {
    return true;
  }
  return false;
}

function findDuplicates(values) {
  const seen = new Set();
  const dupes = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      dupes.add(value);
    }
    seen.add(value);
  }
  return [...dupes];
}

function check(name, pass, detail = "") {
  return { name, pass, detail };
}

function buildToolsFromSections(sections) {
  const tools = [];
  for (const section of sections) {
    const blocks = splitToolBlocks(section);
    for (const block of blocks) {
      const sector = block.match(/sector:\s*"([^"]+)"/)?.[1];
      const freeSlug = block.match(/freeSlug:\s*"([^"]+)"/)?.[1];
      const paidSlug = block.match(/paidSlug:\s*"([^"]+)"/)?.[1];
      if (sector && freeSlug && paidSlug) {
        tools.push({ sector, freeSlug, paidSlug, block });
      }
    }
  }
  return tools;
}

async function smokeRoute(path) {
  try {
    assertNoEnPrefix(path);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { path, ok: false, status: 0, error: message, auditBug: true };
  }

  const result = await fetchRouteWithRetry(path);
  return {
    path,
    ok: result.ok,
    status: result.status,
    error: result.error,
    attempts: result.attempts,
    durationMs: result.durationMs,
  };
}

async function main() {
  const baseUrl = getBaseUrl();
  const revenueCore = read("src/lib/tools/revenue-tools.ts");
  const revenueAdditional = read("src/lib/tools/revenue-tools-additional.ts");
  const revenuePhase2 = read("src/lib/tools/revenue-tools-phase2.ts");
  const industryRegistry = read("src/lib/tools/industry-registry.ts");

  const coreSection = extractArraySection(revenueCore, "const revenueToolsCore");
  const additionalSection = extractArraySection(
    revenueAdditional,
    "export const additionalRevenueTools"
  );
  const phase2Section = extractArraySection(revenuePhase2, "export const phase2RevenueTools");
  const tools = buildToolsFromSections([coreSection, additionalSection, phase2Section]);

  const registryBlock =
    industryRegistry.match(/export const industryRegistry[\s\S]*?\] as const/)?.[0] ?? "";
  const registrySlugs = [...new Set(extractQuotedFieldValues(registryBlock, "slug"))];

  const freeSlugs = tools.map((t) => t.freeSlug);
  const paidSlugs = tools.map((t) => t.paidSlug);
  const sectors = tools.map((t) => t.sector);

  const checks = [];

  checks.push(check("revenueTools export present", revenueCore.includes("export const revenueTools")));
  checks.push(check("industry registry present", industryRegistry.includes("export const industryRegistry")));
  checks.push(check("tool count === 27", tools.length === 27, `found ${tools.length}`));
  checks.push(check("registry count === 27", registrySlugs.length === 27, `found ${registrySlugs.length}`));
  checks.push(check("no duplicate freeSlug", findDuplicates(freeSlugs).length === 0, findDuplicates(freeSlugs).join(", ")));
  checks.push(check("no duplicate paidSlug", findDuplicates(paidSlugs).length === 0, findDuplicates(paidSlugs).join(", ")));
  checks.push(check("no duplicate sector", findDuplicates(sectors).length === 0, findDuplicates(sectors).join(", ")));

  for (const sector of EXPECTED_SECTORS) {
    checks.push(check(`sector registered: ${sector}`, sectors.includes(sector)));
  }

  for (const tool of tools) {
    const freeInputCount = countInputsInBlock(tool.block, "freeInputs");
    const paidInputCount = countInputsInBlock(tool.block, "paidInputs");
    checks.push(check(`${tool.freeSlug}: freeInputs >= 3`, freeInputCount >= 3, `count=${freeInputCount}`));
    checks.push(check(`${tool.paidSlug}: paidInputs >= 5`, paidInputCount >= 5, `count=${paidInputCount}`));
    checks.push(
      check(
        `${tool.sector}: legalDisclaimer`,
        hasLegalDisclaimer(tool.block, revenueAdditional) ||
          hasLegalDisclaimer(tool.block, revenuePhase2)
      )
    );
    checks.push(check(`${tool.sector}: seoKeywords`, tool.block.includes("seoKeywords")));
    checks.push(check(`${tool.sector}: verdictLabels`, tool.block.includes("verdictLabels")));

    for (const inputField of ["freeInputs", "paidInputs"]) {
      const fieldStart = tool.block.indexOf(`${inputField}:`);
      if (fieldStart === -1) continue;
      const slice = tool.block.slice(fieldStart);
      const labelMatches = slice.match(/label:\s*"([^"]+)"/g) ?? [];
      const emptyLabel = labelMatches.some((m) => m === 'label: ""');
      checks.push(check(`${tool.sector}: ${inputField} labels non-empty`, !emptyLabel));
    }
  }

  checks.push(
    check(
      "free results module avoids paid verdict strings",
      !/DO NOT ACCEPT UNDER/i.test(read("src/lib/tools/free-tool-results.ts"))
    )
  );
  checks.push(check("PDF legal disclaimer constant", read("src/lib/reports/verdict-report.ts").includes("VERDICT_REPORT_LEGAL_DISCLAIMER")));
  checks.push(check("legal disclaimer constant exists", read("src/lib/tools/revenue-legal-disclaimer.ts").includes("revenueLegalDisclaimer")));
  checks.push(check("checkout helper intact", read("src/lib/billing/create-checkout-session.ts").includes("createStripeCheckout")));
  checks.push(check("webhook handler present", read("functions/src/stripeWebhook.ts").includes("constructEvent")));

  console.log("=== Revenue Tools Registry Audit ===\n");
  let failed = 0;
  for (const item of checks) {
    console.log(`${item.pass ? "✓" : "✗"} ${item.name}${item.detail ? ` (${item.detail})` : ""}`);
    if (!item.pass) failed += 1;
  }

  const industryRoutes = EXPECTED_SECTORS.map((s) => localizedPath(`/industries/${s}`));
  const freeRoutes = freeSlugs.map((s) => localizedPath(`/tools/free/${s}`));
  const premiumRoutes = paidSlugs.map((s) => localizedPath(`/tools/premium/${s}`));
  const extraRoutes = [
    localizedPath("/industries"),
    localizedPath("/pricing"),
    localizedPath("/account"),
    "/admin/leads",
  ];
  const allRoutes = [...industryRoutes, ...freeRoutes, ...premiumRoutes, ...extraRoutes];

  console.log(`\n=== Route Smoke (${baseUrl}, locale=${LOCALE}) ===\n`);
  const smokeResults = [];
  for (const path of allRoutes) {
    const result = await smokeRoute(path);
    smokeResults.push(result);
    const label = result.ok && result.status === 200 ? "✓" : "✗";
    const timing = result.durationMs ? ` ${result.durationMs}ms` : "";
    const attempts = result.attempts > 1 ? ` (${result.attempts} attempts)` : "";
    const bug = result.auditBug ? " [AUDIT BUG]" : "";
    console.log(
      `${label} ${path} → ${result.status || result.error}${timing}${attempts}${bug}`
    );
    if (!result.ok || result.status !== 200 || result.auditBug) failed += 1;
  }

  const LOCALE_PATH_PREFIX = /^\/[a-z]{2}(\/|$)/;

  function pathWithoutLocale(path) {
    if (path === "/en" || path.startsWith("/en/")) {
      return path.replace(/^\/en/, "") || "/";
    }
    return path.replace(LOCALE_PATH_PREFIX, "/");
  }

  const industryPassed = smokeResults.filter(
    (r) => pathWithoutLocale(r.path).startsWith("/industries/") && r.ok && r.status === 200
  ).length;
  const freePassed = smokeResults.filter(
    (r) => pathWithoutLocale(r.path).startsWith("/tools/free/") && r.ok && r.status === 200
  ).length;
  const premiumPassed = smokeResults.filter(
    (r) => pathWithoutLocale(r.path).startsWith("/tools/premium/") && r.ok && r.status === 200
  ).length;

  const expectedIndustryCount = industryRoutes.length;
  const expectedFreeCount = freeRoutes.length;
  const expectedPremiumCount = premiumRoutes.length;

  console.log("\n=== Summary ===");
  console.log(`Registry checks: ${checks.filter((c) => c.pass).length}/${checks.length} passed`);
  console.log(`Industry routes: ${industryPassed}/${expectedIndustryCount}`);
  console.log(`Free tools: ${freePassed}/${expectedFreeCount}`);
  console.log(`Premium analyzers: ${premiumPassed}/${expectedPremiumCount}`);

  if (failed > 0) {
    console.error(`\nCatalog audit failed: ${failed} issue(s).`);
    process.exit(1);
  }

  console.log("\nCatalog audit passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
