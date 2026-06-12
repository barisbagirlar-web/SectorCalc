import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import { QUALITY_DIR } from "./quality-backfill-scan-lib.mjs";
import { QUALITY_BACKFILL_PLAN_PATH } from "./quality-backfill-plan-lib.mjs";

export const QUALITY_WORKORDERS_PATH = path.join(
  QUALITY_DIR,
  "quality-workorders.json",
);

const PILOT_SKIP_SLUG =
  /auto-repair|compliance-risk|compliance-verdict|legal|interest-fee|pressure-vessel|electrical|break-even-safety|regulated|faiz|safety-critical/i;

const WORKORDER_LIMITS = {
  A1: 5,
  A2: 3,
  B1: 3,
  humanReview: 5,
  quarantineReview: 10,
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hasBackingSource(item) {
  const evidence = item.evidence ?? {};
  return Boolean(
    evidence.schemaMatched ||
      evidence.formulaRegistryMatched ||
      evidence.formulaContractMatched ||
      evidence.locatorMatched,
  );
}

function hasUiShell(item) {
  const evidence = item.evidence ?? {};
  return Boolean(
    evidence.quickResultMatched && evidence.deepReportMatched && evidence.i18nMatched,
  );
}

function isPilotSafe(item) {
  if (item.risk === "regulated" || item.risk === "safety-critical") {
    return false;
  }
  if (PILOT_SKIP_SLUG.test(item.slug)) {
    return false;
  }
  return true;
}

function pilotSkipReason(item) {
  if (item.risk === "regulated" || item.risk === "safety-critical") {
    return `${item.slug} skipped: ${item.risk} risk`;
  }
  if (PILOT_SKIP_SLUG.test(item.slug)) {
    return `${item.slug} skipped: legal/safety/compliance/automotive review risk pattern`;
  }
  if (!hasBackingSource(item)) {
    return `${item.slug} skipped: no schema/formula/registry backing source`;
  }
  return null;
}

function selectPilot(a1Items) {
  const skipped = [];

  for (const item of a1Items) {
    const skipReason = pilotSkipReason(item);
    if (skipReason) {
      skipped.push(skipReason);
      continue;
    }

    const uiShell = hasUiShell(item);
    const missingCore = item.missing?.filter((entry) =>
      ["FormulaContract", "Validation", "Tests"].includes(entry),
    );

    return {
      selectedSlug: item.slug,
      batch: "A1",
      reason: [
        "First safe A1 candidate after pilot filters.",
        uiShell
          ? "Active premium-schema shell with quick/deep/i18n present; core contract/validation/tests missing."
          : "Active-route A1 candidate with deterministic schema backing.",
        missingCore?.length
          ? `Missing core stack: ${missingCore.join(", ")}.`
          : "Core upgrade stack incomplete.",
        skipped.length > 0 ? `Skipped before selection: ${skipped.join(" | ")}` : null,
      ]
        .filter(Boolean)
        .join(" "),
      risk: item.risk ?? "medium",
      recommendedMode: "ONE_TOOL_PILOT",
      evidence: item.evidence ?? {},
      evidencePaths: item.evidencePaths ?? {},
    };
  }

  throw new Error("No safe A1 pilot candidate found in batch plan.");
}

function buildA1Scope(item) {
  return {
    maxFilesPerStep: 3,
    requiresFormulaContract: item.missing?.includes("FormulaContract") ?? true,
    requiresValidation: item.missing?.includes("Validation") ?? true,
    requiresTests: item.missing?.includes("Tests") ?? true,
    requiresUi: false,
    requiresI18n: false,
  };
}

function buildA2Scope(item) {
  return {
    maxFilesPerStep: 3,
    requiresFormulaContract: false,
    requiresValidation: false,
    requiresTests: false,
    requiresUi: true,
    requiresI18n: true,
  };
}

function buildB1Scope(item) {
  return {
    maxFilesPerStep: 3,
    requiresFormulaContract: item.missing?.includes("FormulaContract") ?? false,
    requiresValidation: item.missing?.includes("Validation") ?? false,
    requiresTests: item.missing?.includes("Tests") ?? false,
    requiresUi: false,
    requiresI18n: item.missing?.includes("I18n") ?? false,
  };
}

function buildReviewScope() {
  return {
    maxFilesPerStep: 0,
    requiresFormulaContract: false,
    requiresValidation: false,
    requiresTests: false,
    requiresUi: false,
    requiresI18n: false,
  };
}

function buildP54Mapping(batch, item) {
  if (batch === "A1") {
    return {
      inputStandard: "required",
      validationStandard: "required",
      formulaContractStandard: "required",
      exactOracleTests: "required",
      quickSummary: hasUiShell(item) ? "already_present" : "later_if_missing",
      deepReport: hasUiShell(item) ? "already_present" : "later_if_missing",
    };
  }

  if (batch === "A2") {
    return {
      inputStandard: "already_present",
      validationStandard: "already_present",
      formulaContractStandard: "already_present",
      exactOracleTests: "already_present",
      quickSummary: item.missing?.includes("QuickResult") ? "required" : "already_present",
      deepReport: item.missing?.includes("DeepReport") ? "required" : "already_present",
    };
  }

  if (batch === "B1") {
    return {
      inputStandard: "required",
      validationStandard: item.missing?.includes("Validation") ? "required" : "already_present",
      formulaContractStandard: item.missing?.includes("FormulaContract")
        ? "required"
        : "already_present",
      exactOracleTests: item.missing?.includes("Tests") ? "required" : "already_present",
      quickSummary: "not_required_for_class",
      deepReport: "not_required_for_class",
    };
  }

  return {
    inputStandard: "review_only",
    validationStandard: "review_only",
    formulaContractStandard: "review_only",
    exactOracleTests: "review_only",
    quickSummary: "review_only",
    deepReport: "review_only",
  };
}

function buildAcceptanceCriteria(batch) {
  if (batch === "A1" || batch === "A2" || batch === "B1") {
    return [
      "npx tsc --noEmit PASS",
      "tool-specific vitest PASS",
      "npm run scan:quality-backfill PASS",
      "reference P54 remains PASS",
    ];
  }

  return [
    "human review checklist completed",
    "risk category documented",
    "no automatic patch until approved",
  ];
}

function buildBlockedIf(batch, item) {
  const common = [
    "legal/regulatory/safety-critical risk detected",
    "no route",
    "no backing source",
    "formula cannot be determined deterministically",
  ];

  if (batch === "humanReview" || batch === "quarantineReview") {
    return [...common, "automatic upgrade execution blocked by policy"];
  }

  if (!hasBackingSource(item)) {
    return common;
  }

  return common;
}

function buildExecutionWorkorder(item, batch, options = {}) {
  const reviewOnly = options.reviewOnly === true;

  return {
    slug: item.slug,
    batch,
    toolClass: item.toolClass,
    priority: item.priority,
    missing: item.missing ?? [],
    recommendedAction: reviewOnly
      ? item.recommendedAction
      : item.recommendedAction,
    implementationScope: reviewOnly
      ? buildReviewScope()
      : batch === "A1"
        ? buildA1Scope(item)
        : batch === "A2"
          ? buildA2Scope(item)
          : batch === "B1"
            ? buildB1Scope(item)
            : buildReviewScope(),
    p54BlueprintMapping: buildP54Mapping(reviewOnly ? "review" : batch, item),
    acceptanceCriteria: buildAcceptanceCriteria(reviewOnly ? "review" : batch),
    blockedIf: buildBlockedIf(batch, item),
    evidence: item.evidence ?? {},
    evidencePaths: item.evidencePaths ?? {},
    reviewNote: options.reviewNote ?? undefined,
  };
}

function takeBatchItems(items, limit) {
  return items.slice(0, limit);
}

export function buildQualityWorkorders(plan) {
  const batches = plan.batches ?? {};
  const a1Items = batches.batchA1PremiumDecisionUpgrades ?? [];
  const a2Items = batches.batchA2PremiumDecisionUiI18nUpgrades ?? [];
  const b1Items = batches.batchB1AdvancedCalculatorUpgrades ?? [];
  const humanItems = batches.humanReviewQueue ?? [];
  const quarantineItems = batches.quarantineReviewQueue ?? [];

  const a1Selected = takeBatchItems(a1Items, WORKORDER_LIMITS.A1);
  const a2Selected = takeBatchItems(a2Items, WORKORDER_LIMITS.A2);
  const b1Selected = takeBatchItems(b1Items, WORKORDER_LIMITS.B1);
  const humanSelected = takeBatchItems(humanItems, WORKORDER_LIMITS.humanReview);
  const quarantineSelected = takeBatchItems(
    quarantineItems,
    WORKORDER_LIMITS.quarantineReview,
  );

  const pilotSelection = selectPilot(a1Items);

  const workordersByBatch = {
    A1: a1Selected.map((item) => buildExecutionWorkorder(item, "A1")),
    A2: a2Selected.map((item) => buildExecutionWorkorder(item, "A2")),
    B1: b1Selected.map((item) => buildExecutionWorkorder(item, "B1")),
    humanReview: humanSelected.map((item) =>
      buildExecutionWorkorder(item, "humanReview", {
        reviewOnly: true,
        reviewNote: item.reviewCategory ?? item.whyThisBatch,
      }),
    ),
    quarantineReview: quarantineSelected.map((item) =>
      buildExecutionWorkorder(item, "quarantineReview", {
        reviewOnly: true,
        reviewNote: item.whyThisBatch,
      }),
    ),
  };

  const workorders = [
    ...workordersByBatch.A1,
    ...workordersByBatch.A2,
    ...workordersByBatch.B1,
    ...workordersByBatch.humanReview,
    ...workordersByBatch.quarantineReview,
  ];

  return {
    generatedAt: new Date().toISOString(),
    sourcePlan: path.relative(ROOT, QUALITY_BACKFILL_PLAN_PATH),
    pilotSelection,
    workordersByBatch,
    workorders,
  };
}

export function loadQualityBackfillPlanInput() {
  if (!fs.existsSync(QUALITY_BACKFILL_PLAN_PATH)) {
    throw new Error(
      `Quality backfill plan missing. Run npm run plan:quality-backfill first: ${QUALITY_BACKFILL_PLAN_PATH}`,
    );
  }

  return readJson(QUALITY_BACKFILL_PLAN_PATH);
}

export function formatQualityWorkordersStdout(report) {
  return [
    "P55 Quality Backfill Workorders",
    `Pilot: ${report.pilotSelection.selectedSlug}`,
    `A1 workorders: ${report.workordersByBatch.A1.length}`,
    `A2 workorders: ${report.workordersByBatch.A2.length}`,
    `B1 workorders: ${report.workordersByBatch.B1.length}`,
    `Human review orders: ${report.workordersByBatch.humanReview.length}`,
    `Quarantine review orders: ${report.workordersByBatch.quarantineReview.length}`,
    `Output: ${path.relative(ROOT, QUALITY_WORKORDERS_PATH)}`,
  ].join("\n");
}
