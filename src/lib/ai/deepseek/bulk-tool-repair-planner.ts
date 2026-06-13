import fs from "node:fs";
import path from "node:path";
import type {
  BulkRepairDecision,
  BulkRepairPatchPlan,
  BulkRepairRiskLevel,
  BulkToolRepairItem,
  P24ToolRow,
} from "@/lib/ai/deepseek/bulk-tool-repair-types";
import {
  buildBulkRepairContext,
  hasPremiumSchemaI18nEntry,
  loadControlPlaneMap,
} from "@/lib/ai/deepseek/bulk-tool-repair-collector";

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
  { pattern: /unit:\s*"people"/g, replacement: 'unit: "count"' },
  { pattern: /unit:\s*"machines"/g, replacement: 'unit: "count"' },
  { pattern: /unit:\s*"trips"/g, replacement: 'unit: "count"' },
  { pattern: /unit:\s*"weeks"/g, replacement: 'unit: "days"' },
  { pattern: /unit:\s*"years"/g, replacement: 'unit: "days"' },
];

function findingIds(row: P24ToolRow): Set<string> {
  return new Set(
    (row.findings ?? [])
      .filter((f) => f.severity === "warn" || f.severity === "fail")
      .map((f) => f.checkId),
  );
}

function hasFailFinding(row: P24ToolRow, checkId: string): boolean {
  return (row.findings ?? []).some((f) => f.checkId === checkId && f.severity === "fail");
}

function globalSanityTestExists(schemaId: string): boolean {
  const testPath = path.join(
    ROOT,
    `src/lib/premium-schema/__tests__/${schemaId}-global-sanity.test.ts`,
  );
  return fs.existsSync(testPath);
}

function schemaHasFixableUnits(schemaPath: string | null): boolean {
  if (!schemaPath) {
    return false;
  }
  const absolute = path.join(ROOT, schemaPath);
  if (!fs.existsSync(absolute)) {
    return false;
  }
  const content = fs.readFileSync(absolute, "utf8");
  return UNIT_REPLACEMENTS.some((rule) => rule.pattern.test(content));
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
  if (hasFailFinding(row, "formulaContractAlignment") || hasFailFinding(row, "requiredInputs")) {
    const msg = (row.findings ?? []).find((f) => f.checkId === "requiredInputs")?.message ?? "";
    if (/no calculator/i.test(msg)) {
      return "high";
    }
  }
  if (patches.some((patch) => patch.type === "schema_fix" || patch.type === "validation_fix")) {
    return patches.every((p) => p.safeToApply && !p.requiresHumanApproval) ? "medium" : "medium";
  }
  if (patches.some((patch) => patch.type === "validation_fix")) {
    return "medium";
  }
  if (patches.every((patch) => patch.type === "unit_fix" || patch.type === "i18n_fix")) {
    return "low";
  }
  if (patches.every((patch) => patch.type === "route_wiring")) {
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
  const allSafeAuto = patches.every((patch) => patch.safeToApply && !patch.requiresHumanApproval);
  if (allSafeAuto) {
    return "auto_apply";
  }
  const hasCandidate = patches.some((patch) => patch.targetFile || patch.targetFileHint);
  if (hasCandidate) {
    return "auto_apply_candidate";
  }
  return "manual_review";
}

function defaultSchemaPath(schemaId: string): string {
  return `src/lib/premium-schema/schemas/${schemaId}.ts`;
}

function defaultValidationPath(schemaId: string): string {
  return `src/lib/premium-schema/calculators/${schemaId}-validation.ts`;
}

export function planBulkRepairItem(row: P24ToolRow): BulkToolRepairItem {
  const context = buildBulkRepairContext(row);
  const controlPlane = loadControlPlaneMap().get(row.slug);
  const ids = findingIds(row);
  const patches: BulkRepairPatchPlan[] = [];
  const isPremiumTier = row.tier === "premium-schema" || row.tier === "premium";

  if (
    (ids.has("canonicalUnit") || ids.has("unitMapping") || context.unitIssues.length > 0) &&
    context.schemaPath &&
    schemaHasFixableUnits(context.schemaPath)
  ) {
    patches.push({
      type: "unit_fix",
      targetFile: context.schemaPath,
      description: "Normalize schema unit strings to catalog vocabulary.",
      safeToApply: true,
      metadata: { replacements: UNIT_REPLACEMENTS.map((r) => r.pattern.source).join("|") },
    });
  } else if (
    (ids.has("canonicalUnit") || ids.has("unitMapping") || context.unitIssues.length > 0) &&
    context.schemaPath
  ) {
    patches.push({
      type: "unit_fix",
      targetFile: context.schemaPath,
      targetFileHint: context.schemaPath,
      description: "Map non-catalog unit strings to canonical vocabulary.",
      safeToApply: false,
      requiresHumanApproval: true,
    });
  }

  if (ids.has("localeKeys") || ids.has("arRtl") || controlPlane?.i18n?.complete === false) {
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

    if (!sourceSlug && context.schemaPath) {
      for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
        if (!context.localeCoverage[locale]) {
          patches.push({
            type: "i18n_fix",
            targetFile: `messages/${locale}.json`,
            description: `Scaffold freeToolInputs for ${context.slug} from schema labels.`,
            safeToApply: true,
            metadata: {
              targetSlug: context.slug,
              schemaPath: context.schemaPath,
              locale,
              scaffoldFromSchema: "true",
            },
          });
        }
      }
    }
  }

  if (ids.has("globalSanityTests") && !globalSanityTestExists(context.schemaId)) {
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

  if (
    isPremiumTier &&
    !context.validationExists &&
    !hasFailFinding(row, "formulaContractAlignment") &&
    !/^\d/.test(context.schemaId)
  ) {
    const validationPath = defaultValidationPath(context.schemaId);
    if (!fs.existsSync(path.join(ROOT, validationPath))) {
      patches.push({
        type: "validation_fix",
        targetFile: validationPath,
        targetFileHint: validationPath,
        description: `Scaffold validation module for ${context.schemaId}.`,
        safeToApply: context.schemaPath ? true : false,
        requiresHumanApproval: !context.schemaPath,
        metadata: { schemaId: context.schemaId, schemaPath: context.schemaPath ?? "" },
      });
    }
  }

  if (isPremiumTier && !context.formSchemaExists) {
    const schemaPath = defaultSchemaPath(context.schemaId);
    patches.push({
      type: "schema_fix",
      targetFile: fs.existsSync(path.join(ROOT, schemaPath)) ? schemaPath : "",
      targetFileHint: schemaPath,
      description: `Scaffold or wire premium schema for ${context.slug}.`,
      safeToApply: false,
      requiresHumanApproval: true,
    });
  }

  if (isPremiumTier && !context.resultRendererExists) {
    patches.push({
      type: "result_renderer",
      targetFile: "",
      targetFileHint: `src/components/premium-schema/results/${context.schemaId}Result.tsx`,
      description: `Wire or scaffold result renderer for ${context.slug}.`,
      safeToApply: false,
      requiresHumanApproval: true,
    });
  }

  if (isPremiumTier && !context.submitHandlerExists) {
    patches.push({
      type: "submit_handler",
      targetFile: "",
      targetFileHint: `src/lib/premium-schema/submit-handlers/${context.schemaId}.ts`,
      description: `Wire or scaffold submit handler for ${context.slug}.`,
      safeToApply: false,
      requiresHumanApproval: true,
    });
  }

  if (ids.has("freePremiumSplit") || controlPlane?.formulaContract?.aligned === false) {
    patches.push({
      type: "contract_alignment",
      targetFile: "",
      targetFileHint: "src/data/revenue-tools.ts",
      description: "Align free/premium pair or contract required inputs.",
      safeToApply: false,
      requiresHumanApproval: true,
    });
  }

  if (
    context.knownFormulaAuditFindings.some((f) => /boundary/i.test(f)) ||
    ids.has("boundaryTests")
  ) {
    const validationPath = defaultValidationPath(context.schemaId);
    patches.push({
      type: "validation_fix",
      targetFile: fs.existsSync(path.join(ROOT, validationPath)) ? validationPath : "",
      targetFileHint: validationPath,
      description: "Add boundary scenario coverage to validation or contract.",
      safeToApply: false,
      requiresHumanApproval: true,
    });
  }

  if (context.guideStatus === "generic" || controlPlane?.guide?.genericGuideBlocked) {
    patches.push({
      type: "guide_hide",
      targetFile: "src/lib/tools/guide/tool-guide-blocklist.ts",
      targetFileHint: "src/lib/tools/guide/tool-guide-blocklist.ts",
      description: "Hide generic guide until approved spec exists.",
      safeToApply: true,
      requiresHumanApproval: false,
      metadata: { slug: context.slug, targetSlug: context.slug },
    });
  }

  const riskLevel = inferRisk(row, patches);
  const repairDecision = inferDecision(riskLevel, patches);
  const expectedAuditAfterPatch =
    patches.length > 0 &&
    (repairDecision === "auto_apply" || repairDecision === "auto_apply_candidate")
      ? "PASS"
      : row.verdict === "FAIL"
        ? "WARN"
        : "WARN";

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
    whyNotPatchable: patches.length === 0 ? context.findings.join("; ") || "No local patch plan inferred." : undefined,
    expectedAuditAfterPatch,
    testCommands: ["npm run lint", "npx tsc --noEmit"],
  };
}

export function planBulkRepairBatch(rows: P24ToolRow[]): BulkToolRepairItem[] {
  return rows.map((row) => planBulkRepairItem(row));
}
