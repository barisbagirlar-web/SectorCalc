import fs from "node:fs";
import path from "node:path";
import type {
  BulkRepairDecision,
  BulkRepairPatchPlan,
  BulkRepairRiskLevel,
  BulkToolRepairItem,
  P24ToolRow,
} from "@/lib/ai/deepseek/bulk-tool-repair-types";
import { buildBulkRepairContext, hasPremiumSchemaI18nEntry } from "@/lib/ai/deepseek/bulk-tool-repair-collector";

const ROOT = process.cwd();

const UNIT_REPLACEMENTS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /unit:\s*"h"/g, replacement: 'unit: "hours"' },
  { pattern: /unit:\s*'h'/g, replacement: "unit: 'hours'" },
  { pattern: /unit:\s*"\$\/h"/g, replacement: 'unit: "USD/hour"' },
  { pattern: /unit:\s*"\$"/g, replacement: 'unit: "USD"' },
  { pattern: /unit:\s*"kg\/m2"/g, replacement: 'unit: "kg/m²"' },
  { pattern: /unit:\s*"m2"/g, replacement: 'unit: "m²"' },
  { pattern: /unit:\s*"ha"/g, replacement: 'unit: "hectare"' },
  { pattern: /unit:\s*"liters"/g, replacement: 'unit: "L"' },
  { pattern: /unit:\s*"calls"/g, replacement: 'unit: "count"' },
];

function findingIds(row: P24ToolRow): Set<string> {
  return new Set(
    (row.findings ?? [])
      .filter((f) => f.severity === "warn" || f.severity === "fail")
      .map((f) => f.checkId),
  );
}

function resolveI18nSourceSlug(context: ReturnType<typeof buildBulkRepairContext>): string | null {
  if (context.localeCoverage.en && context.localeCoverage.tr) {
    return null;
  }

  const candidates = [context.schemaId, context.paidSlug].filter(Boolean) as string[];
  for (const candidate of candidates) {
    if (candidate === context.slug) {
      continue;
    }
    const enPath = path.join(ROOT, "messages/en.json");
    const payload = JSON.parse(fs.readFileSync(enPath, "utf8")) as {
      freeToolInputs?: Record<string, unknown>;
    };
    if (payload.freeToolInputs?.[candidate]) {
      return candidate;
    }
  }

  return context.schemaId !== context.slug ? context.schemaId : null;
}

function resolveDedicatedTestFile(context: ReturnType<typeof buildBulkRepairContext>): string | null {
  const preferred = context.dedicatedTests.find((file) =>
    file.includes("__tests__") && file.endsWith(".test.ts"),
  );
  return preferred ?? context.dedicatedTests[0] ?? null;
}

function inferRisk(row: P24ToolRow, patches: BulkRepairPatchPlan[]): BulkRepairRiskLevel {
  const ids = findingIds(row);
  if (ids.has("formulaContractAlignment") || ids.has("requiredInputs")) {
    return "high";
  }
  if (patches.some((patch) => patch.type === "validation_fix")) {
    return "medium";
  }
  if (patches.every((patch) => patch.type === "unit_fix" || patch.type === "i18n_fix")) {
    return "low";
  }
  return "medium";
}

function inferDecision(
  risk: BulkRepairRiskLevel,
  patches: BulkRepairPatchPlan[],
): BulkRepairDecision {
  if (patches.length === 0) {
    return "keep_safe_state";
  }
  if (risk === "high" || risk === "critical") {
    return "manual_review";
  }
  if (patches.every((patch) => patch.safeToApply)) {
    return "auto_apply";
  }
  return "manual_review";
}

export function planBulkRepairItem(row: P24ToolRow): BulkToolRepairItem {
  const context = buildBulkRepairContext(row);
  const ids = findingIds(row);
  const patches: BulkRepairPatchPlan[] = [];

  if ((ids.has("canonicalUnit") || ids.has("unitMapping")) && context.schemaPath) {
    patches.push({
      type: "unit_fix",
      targetFile: context.schemaPath,
      description: "Normalize schema unit strings to catalog vocabulary.",
      safeToApply: true,
      metadata: { replacements: UNIT_REPLACEMENTS.map((r) => r.pattern.source).join("|") },
    });
  }

  if (ids.has("localeKeys") || ids.has("arRtl")) {
    const sourceSlug = resolveI18nSourceSlug(context);
    if (sourceSlug) {
      for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
        if (!context.localeCoverage[locale]) {
          patches.push({
            type: "i18n_fix",
            targetFile: `messages/${locale}.json`,
            description: `Add freeToolInputs alias ${context.slug} from ${sourceSlug}.`,
            safeToApply: true,
            metadata: { targetSlug: context.slug, sourceSlug, locale },
          });
        }
      }
    }

    if (!hasPremiumSchemaI18nEntry(context.slug) && context.schemaId) {
      patches.push({
        type: "i18n_fix",
        targetFile: "src/data/premium-schema-i18n.ts",
        description: `Ensure premium-schema-i18n entry for ${context.slug}.`,
        safeToApply: true,
        metadata: { targetSlug: context.slug, sourceSchemaId: context.schemaId },
      });
    }
  }

  if (ids.has("globalSanityTests")) {
    const paidSlug = context.paidSlug ?? context.slug;
    const testFile = resolveDedicatedTestFile(context);
    if (testFile && paidSlug) {
      const testContent = fs.readFileSync(path.join(ROOT, testFile), "utf8");
      if (!testContent.includes(`"${context.slug}"`) && !testContent.includes("PAID_ROUTE_SLUG")) {
        patches.push({
          type: "route_wiring",
          targetFile: testFile,
          description: `Add PAID_ROUTE_SLUG constant for ${paidSlug}.`,
          safeToApply: true,
          metadata: { paidSlug, schemaId: context.schemaId },
        });
      }
    } else if (paidSlug) {
      patches.push({
        type: "route_wiring",
        targetFile: `src/lib/premium-schema/__tests__/${context.schemaId}-global-sanity.test.ts`,
        description: `Scaffold dedicated global sanity test for ${context.slug}.`,
        safeToApply: true,
        metadata: {
          paidSlug,
          schemaId: context.schemaId,
          slug: context.slug,
          scaffold: "true",
        },
      });
    }
  }

  if (ids.has("validation") && !ids.has("formulaContractAlignment") && row.tier === "premium-schema") {
    const validationPath = `src/lib/premium-schema/calculators/${context.schemaId}-validation.ts`;
    if (!fs.existsSync(path.join(ROOT, validationPath))) {
      patches.push({
        type: "validation_fix",
        targetFile: validationPath,
        description: `Scaffold validation module for ${context.schemaId}.`,
        safeToApply: true,
        metadata: { schemaId: context.schemaId, schemaPath: context.schemaPath ?? "" },
      });
    }
  }

  const riskLevel = inferRisk(row, patches);
  const repairDecision = inferDecision(riskLevel, patches);
  const expectedAuditAfterPatch =
    patches.length > 0 && repairDecision === "auto_apply" ? "PASS" : row.verdict === "FAIL" ? "WARN" : "WARN";

  return {
    slug: context.slug,
    tier: context.tier,
    route: context.route,
    p24Status: context.p24Status,
    runtimeTrustStatus: context.runtimeTrustStatus,
    findings: context.findings,
    formulaContractExists: context.formulaContractExists,
    validationExists: context.validationExists,
    formSchemaExists: context.formSchemaExists,
    submitHandlerExists: context.submitHandlerExists,
    resultRendererExists: context.resultRendererExists,
    localeCoverage: context.localeCoverage,
    unitIssues: context.unitIssues,
    guideStatus: context.guideStatus,
    knownFormulaAuditFindings: context.knownFormulaAuditFindings,
    riskLevel,
    repairDecision,
    rootCause: context.findings[0] ?? "No automated root cause inferred.",
    patches,
    expectedAuditAfterPatch,
    testCommands: ["npm run lint", "npx tsc --noEmit"],
  };
}

export function planBulkRepairBatch(rows: P24ToolRow[]): BulkToolRepairItem[] {
  return rows.map((row) => planBulkRepairItem(row));
}
