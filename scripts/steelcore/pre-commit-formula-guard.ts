#!/usr/bin/env npx tsx
/**
 * Pre-Commit Formula Guard
 *
 * Blocks NEW cross-domain contamination in formula schemas while allowing
 * EXISTING known debt tracked in generated/.known-patterns.json.
 *
 * Cross-domain contamination = formula using variables from unrelated domains
 * (e.g., a labor-cost formula referencing material inputs). These produce
 * numerically valid but semantically WRONG results.
 *
 * Rules:
 *   - ERROR severity → always BLOCK (exit 1)
 *   - NEW schema (slug not in cache) with cross-domain WARNs → BLOCK
 *   - EXISTING schema with SAME cross-domain issues → ALLOW (known debt)
 *   - EXISTING schema with NEW/different cross-domain issues → BLOCK (regression)
 *   - Non-cross-domain WARNs (e.g., * 1) → always ALLOW (non-blocking)
 *
 * Usage:
 *   npx tsx scripts/steelcore/pre-commit-formula-guard.ts
 *   npx tsx scripts/steelcore/pre-commit-formula-guard.ts --update-cache
 */

import path from "node:path";
import fs from "node:fs";
import { verifySchemaSemantics } from "@/lib/generated-tools/semantic-formula-verifier";
import type { SemanticFormulaIssue } from "@/lib/generated-tools/semantic-formula-verifier";

/* ── Constants ───────────────────────────────────────────────────── */

const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const CACHE_FILE = path.join(process.cwd(), "generated/.known-patterns.json");

type KnownPatternsCache = Record<string, Record<string, string>>;

/* ── Cache IO ─────────────────────────────────────────────────────── */

function loadCache(): KnownPatternsCache {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8")) as KnownPatternsCache;
  } catch {
    return {};
  }
}

function saveCache(cache: KnownPatternsCache): void {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + "\n", "utf-8");
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/-schema\.json$/, "");
}

/* ── Issue classification ────────────────────────────────────────── */

function isCrossDomainIssue(issue: SemanticFormulaIssue): boolean {
  return issue.message.includes("Cross-domain contamination");
}

function formatIssue(issue: SemanticFormulaIssue): string {
  return `[${issue.severity}] ${issue.formulaKey}: ${issue.message}`;
}

/* ── Per-schema check ────────────────────────────────────────────── */

interface SchemaGuardResult {
  readonly slug: string;
  readonly errors: readonly SemanticFormulaIssue[];
  readonly crossDomainIssues: readonly SemanticFormulaIssue[];
  readonly otherWarnings: readonly SemanticFormulaIssue[];
  readonly blocked: boolean;
  readonly blockedReason: string | null;
}

function checkSchema(
  slug: string,
  issues: readonly SemanticFormulaIssue[],
  cache: KnownPatternsCache,
): SchemaGuardResult {
  const errors = issues.filter((i) => i.severity === "ERROR");
  const crossDomainIssues = issues.filter(isCrossDomainIssue);
  const otherWarnings = issues.filter(
    (i) => i.severity !== "ERROR" && !isCrossDomainIssue(i),
  );

  // 1. ERRORs always block
  if (errors.length > 0) {
    const reasons = errors.map((e) => `  ${formatIssue(e)}`).join("\n");
    return {
      slug,
      errors,
      crossDomainIssues,
      otherWarnings,
      blocked: true,
      blockedReason: `BLOCKED [${slug}]: ${errors.length} error(s) found:\n${reasons}`,
    };
  }

  // 2. No cross-domain issues → pass
  if (crossDomainIssues.length === 0) {
    return {
      slug,
      errors,
      crossDomainIssues,
      otherWarnings,
      blocked: false,
      blockedReason: null,
    };
  }

  // 3. Cross-domain issues found — apply cache logic
  const isKnown = slug in cache;

  if (!isKnown) {
    // NEW schema with cross-domain → BLOCK
    const reasons = crossDomainIssues
      .map((i) => `  NEW cross-domain contamination: ${formatIssue(i)}`)
      .join("\n");
    return {
      slug,
      errors,
      crossDomainIssues,
      otherWarnings,
      blocked: true,
      blockedReason:
        `BLOCKED [${slug}]: NEW schema has ${crossDomainIssues.length} cross-domain contamination(s):\n${reasons}\n` +
        `  Either fix the formulas or run with --update-cache after review to acknowledge.`,
    };
  }

  // EXISTING schema — check for regression vs known debt
  const cached = cache[slug];
  let hasRegression = false;
  const regressionReasons: string[] = [];
  const knownDebt: string[] = [];

  for (const iss of crossDomainIssues) {
    const cachedMessage = cached[iss.formulaKey];
    if (cachedMessage === undefined) {
      hasRegression = true;
      regressionReasons.push(
        `  REGRESSION: new cross-domain contamination in "${iss.formulaKey}": ${formatIssue(iss)}`,
      );
    } else if (cachedMessage !== iss.message) {
      hasRegression = true;
      regressionReasons.push(
        `  REGRESSION: changed cross-domain contamination in "${iss.formulaKey}":\n` +
        `    was: ${cachedMessage}\n    now: ${iss.message}`,
      );
    } else {
      knownDebt.push(
        `  (known debt) ${formatIssue(iss)}`,
      );
    }
  }

  if (hasRegression) {
    return {
      slug,
      errors,
      crossDomainIssues,
      otherWarnings,
      blocked: true,
      blockedReason:
        `BLOCKED [${slug}]: ${regressionReasons.length} regression(s) detected:\n${regressionReasons.join("\n")}`,
    };
  }

  // All cross-domain issues are known debt → ALLOW with WARN
  return {
    slug,
    errors,
    crossDomainIssues,
    otherWarnings,
    blocked: false,
    blockedReason: knownDebt.length > 0
      ? `ALLOWED (known debt) [${slug}]: ${knownDebt.length} known cross-domain issue(s):\n${knownDebt.join("\n")}`
      : null,
  };
}

/* ── Main ─────────────────────────────────────────────────────────── */

async function main(): Promise<{ exitCode: number }> {
  const isUpdateCache = process.argv.includes("--update-cache");

  // Validate directory exists
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`ERROR: Schema directory not found: ${SCHEMAS_DIR}`);
    return { exitCode: 1 };
  }

  const schemaFiles = fs
    .readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith("-schema.json"))
    .sort();

  if (schemaFiles.length === 0) {
    console.log("No schema files found — nothing to check.");
    return { exitCode: 0 };
  }

  // Phase A: --update-cache (silent cache refresh)
  if (isUpdateCache) {
    const newCache: KnownPatternsCache = {};
    for (const file of schemaFiles) {
      const slug = getSlugFromFilename(file);
      try {
        const raw = JSON.parse(
          fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"),
        ) as Record<string, unknown>;
        const formulas = (raw.formulas ?? {}) as Record<string, string>;
        const inputs = ((raw.inputs ?? []) as Array<Record<string, unknown>>).map(
          (i: Record<string, unknown>) => String(i.id),
        );
        const issues = verifySchemaSemantics(formulas, inputs);
        const crossDomainIssues = issues.filter(
          (i: SemanticFormulaIssue) =>
            i.severity !== "ERROR" && isCrossDomainIssue(i),
        );
        if (crossDomainIssues.length > 0) {
          newCache[slug] = {};
          for (const iss of crossDomainIssues) {
            newCache[slug][iss.formulaKey] = iss.message;
          }
        }
      } catch {
        // Skip unparseable schemas
      }
    }
    saveCache(newCache);
    console.log(`Cache updated: ${Object.keys(newCache).length} schemas tracked in ${CACHE_FILE}`);
  }

  // Phase B: Enforcement check
  const cache = isUpdateCache ? {} : loadCache();
  // If we just updated the cache, load fresh for enforcement
  const enforcementCache = isUpdateCache ? loadCache() : cache;

  let totalBlocked = 0;
  let totalErrors = 0;
  let totalCrossDomain = 0;

  const allResults: SchemaGuardResult[] = [];

  for (const file of schemaFiles) {
    const slug = getSlugFromFilename(file);
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"),
      ) as Record<string, unknown>;
      const formulas = (raw.formulas ?? {}) as Record<string, string>;
      const inputs = ((raw.inputs ?? []) as Array<Record<string, unknown>>).map(
        (i: Record<string, unknown>) => String(i.id),
      );
      const issues = verifySchemaSemantics(formulas, inputs);
      const result = checkSchema(slug, issues, enforcementCache);
      allResults.push(result);
      totalErrors += result.errors.length;
      totalCrossDomain += result.crossDomainIssues.length;
      if (result.blocked) totalBlocked++;
    } catch (err) {
      console.error(`ERROR: Failed to parse schema ${file}:`, err instanceof Error ? err.message : String(err));
      totalBlocked++;
    }
  }

  // Print report
  console.log("\n" + "=".repeat(60));
  console.log("PRE-COMMIT FORMULA GUARD REPORT");
  console.log("=".repeat(60));
  console.log(`Schemas scanned:  ${schemaFiles.length}`);
  console.log(`Errors found:     ${totalErrors}`);
  console.log(`Cross-domain:     ${totalCrossDomain}`);
  console.log(`Blocked schemas:  ${totalBlocked}`);
  console.log("");

  for (const result of allResults) {
    if (result.blockedReason) {
      console.log(result.blockedReason);
      console.log("");
    } else if (result.otherWarnings.length > 0) {
      for (const w of result.otherWarnings) {
        console.log(`  (non-blocking) ${formatIssue(w)}`);
      }
      console.log("");
    }
  }

  if (totalBlocked > 0) {
    console.log(`\n❌ FAILED: ${totalBlocked} schema(s) blocked. Fix issues or run with --update-cache to acknowledge known patterns.`);
    return { exitCode: 1 };
  }

  console.log("\n✅ All checks passed — no blocking issues found.");
  return { exitCode: 0 };
}

main()
  .then((result) => {
    process.exit(result.exitCode);
  })
  .catch((err: unknown) => {
    console.error("FATAL:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
