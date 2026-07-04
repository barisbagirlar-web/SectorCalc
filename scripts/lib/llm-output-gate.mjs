/**
 * P38-EMERGENCY-GATE — shared banned public LLM output checks.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const LLMS_BANNED_PATTERNS = [
  "Free tool slugs",
  "Premium analyzer slugs",
  "Count: 230",
  "Count: 50",
  "230 browser-side calculators",
  "50 premium decision analyzers",
  "280+",
  "300+",
  "352+",
  "AI & LLM Source Guide",
  "## Free calculators",
  "## Premium analyzers",
];

export const LLMS_REQUIRED_PATTERNS = [
  "/ai-tool-index.json",
  "/ai-categories.json",
  "/ai-search-manifest.json",
  "categorySlug",
  "keywords",
  "intent",
  "routeStatus",
];

export const EMERGENCY_GATE_MIGRATED_FREE_SLUGS = [
  "oee-calculator",
  "laser-cutting-time-check",
  "3d-print-cost-check",
  "cbam-exposure-quick-check",
  "rent-vs-buy-calculator",
  "sample-size-calculator",
  "linear-regression-calculator",
  "kdv-tevkifati-calculation",
  "sgk-prim-calculation-isci-plus-isveren",
  "ic-efficiency-ratio-irr-calculation",
  "basincli-kap-cidar-kalinligi-hesabi",
  "istatistiksel-process-control-spc-limit-hesabi",
  "alti-sigma-dpmo-sigma-level-cevirici",
  "navlun-cost-hesaplayici",
];

export function auditLlmsTxtContent(llms, { labelPrefix = "llms.txt" } = {}) {
  const failures = [];
  for (const token of LLMS_BANNED_PATTERNS) {
    if (llms.includes(token)) {
      failures.push(`${labelPrefix} contains banned pattern: ${token}`);
    }
  }
  for (const token of LLMS_REQUIRED_PATTERNS) {
    if (!llms.includes(token)) {
      failures.push(`${labelPrefix} missing required pattern: ${token}`);
    }
  }
  return failures;
}

export function auditAiToolIndexDocument(data) {
  const failures = [];
  if (data.totalTools !== data.tools?.length) {
    failures.push(
      `ai-tool-index totalTools mismatch (${data.totalTools} vs ${data.tools?.length ?? 0})`,
    );
  }
  if (data.categories?.length !== 20) {
    failures.push(`ai-tool-index categories.length expected 20, got ${data.categories?.length ?? 0}`);
  }
  const missingCanonical = data.tools?.filter((tool) => !tool.canonicalUrl) ?? [];
  if (missingCanonical.length > 0) {
    failures.push(`${missingCanonical.length} tools missing canonicalUrl`);
  }
  const missingCategory = data.tools?.filter((tool) => !tool.categorySlug) ?? [];
  if (missingCategory.length > 0) {
    failures.push(`${missingCategory.length} tools missing categorySlug`);
  }
  const missingRouteStatus = data.tools?.filter((tool) => !tool.routeStatus) ?? [];
  if (missingRouteStatus.length > 0) {
    failures.push(`${missingRouteStatus.length} tools missing routeStatus`);
  }
  return failures;
}

export function auditEmergencyGateMigratedSlugs(root) {
  const failures = [];
  try {
    const output = execSync("npx tsx scripts/audit-llm-emergency-gate-runner.ts", {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const result = JSON.parse(output.trim().split("\n").at(-1) ?? "{}");
    if (result.stillInFreeIndex?.length) {
      failures.push(
        `P36-REV2 migrated slugs still in free categorized index: ${result.stillInFreeIndex.join(", ")}`,
      );
    }
    if (result.stillInPublicFree?.length) {
      failures.push(
        `P36-REV2 migrated slugs still in public free traffic list: ${result.stillInPublicFree.join(", ")}`,
      );
    }
  } catch (error) {
    failures.push(
      `free-to-premium emergency gate check failed: ${String(error.stderr ?? error.message ?? error)}`,
    );
  }
  return failures;
}

export function readPublicLlmsTxt(root) {
  return readFileSync(join(root, "public", "llms.txt"), "utf8");
}

export function readPublicAiToolIndex(root) {
  return JSON.parse(readFileSync(join(root, "public", "ai-tool-index.json"), "utf8"));
}
