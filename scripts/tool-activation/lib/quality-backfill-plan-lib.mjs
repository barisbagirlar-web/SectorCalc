import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import {
  MISSING_SCHEMA_QUARANTINE_REASON,
  QUALITY_DIR,
  QUALITY_SCAN_REPORT_PATH,
  RISK_EXCLUDED_UPGRADE_REASON,
} from "./quality-backfill-scan-lib.mjs";

export const QUALITY_BACKFILL_PLAN_PATH = path.join(
  QUALITY_DIR,
  "quality-backfill-plan.json",
);

const MISSING_LABELS = {
  formulaContract: "FormulaContract",
  validation: "Validation",
  tests: "Tests",
  quickResult: "QuickResult",
  deepReport: "DeepReport",
  i18n: "I18n",
  route: "Route",
};

const HUMAN_REVIEW_REASONS = {
  "break-even-safety-margin-calculator": {
    category: "safety-critical",
    reason: "Safety margin interpretation affects bid/no-bid decisions; formula liability risk.",
  },
  "electrical-labor-estimator": {
    category: "engineering-critical",
    reason: "Electrical labor estimation touches regulated installation assumptions.",
  },
  "electrical-panel-rework-cost": {
    category: "legal/regulatory",
    reason: "Electrical rework cost model needs field-verified compliance assumptions.",
  },
  "legal-interest-fee-calculator-pro": {
    category: "legal/regulatory",
    reason: "Legal interest and fee calculations require jurisdiction-specific manual review.",
  },
  "pressure-vessel-wall-thickness-calculator": {
    category: "engineering-critical",
    reason: "Pressure vessel thickness is safety-critical engineering; high formula liability risk.",
  },
  "cbam-compliance-verdict": {
    category: "legal/regulatory",
    reason: "CBAM compliance verdict requires manual regulatory review before automation.",
  },
  "cbam-exposure-quick-check": {
    category: "legal/regulatory",
    reason: "CBAM exposure checks are compliance-adjacent and blocked from factory backfill.",
  },
  "auto-repair-comeback-cost": {
    category: "legal/regulatory",
    reason: "Auto-repair comeback cost models require manual liability review.",
  },
  "carbon-footprint-compliance-risk": {
    category: "legal/regulatory",
    reason: "Carbon footprint compliance risk is regulatory-adjacent and blocked from automation.",
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function shortClass(toolClass) {
  if (toolClass === "A CLASS") return "A";
  if (toolClass === "B CLASS") return "B";
  if (toolClass === "C CLASS") return "C";
  return "Unknown";
}

function listMissingCore(tool) {
  const missing = [];
  if (!tool.hasFormulaContract) missing.push(MISSING_LABELS.formulaContract);
  if (!tool.hasValidation) missing.push(MISSING_LABELS.validation);
  if (!tool.hasTests) missing.push(MISSING_LABELS.tests);
  return missing;
}

function listMissingUi(tool) {
  const missing = [];
  if (!tool.hasQuickResult) missing.push(MISSING_LABELS.quickResult);
  if (!tool.hasDeepReport) missing.push(MISSING_LABELS.deepReport);
  if (!tool.hasI18n) missing.push(MISSING_LABELS.i18n);
  return missing;
}

function listMissingAdvanced(tool) {
  const missing = listMissingCore(tool);
  if (!tool.hasRoute) missing.push(MISSING_LABELS.route);
  return missing;
}

function uiReadinessScore(tool) {
  return (
    Number(tool.hasQuickResult) + Number(tool.hasDeepReport) + Number(tool.hasI18n)
  );
}

function compareA1Priority(left, right) {
  if (left.hasRoute !== right.hasRoute) {
    return left.hasRoute ? -1 : 1;
  }

  const uiDelta = uiReadinessScore(right) - uiReadinessScore(left);
  if (uiDelta !== 0) {
    return uiDelta;
  }

  return left.slug.localeCompare(right.slug);
}

function compareSlug(left, right) {
  return left.slug.localeCompare(right.slug);
}

function buildBatchItem(tool, options) {
  return {
    slug: tool.slug,
    toolClass: shortClass(tool.toolClass),
    upgradeDecision: tool.upgradeDecision,
    priority: options.priority,
    recommendedAction: options.recommendedAction,
    missing: options.missing,
    risk: tool.riskLevel ?? "medium",
    whyThisBatch: options.whyThisBatch,
    evidence: tool.evidence ?? {},
    evidencePaths: tool.evidencePaths ?? {},
  };
}

function isBatchA1Candidate(tool) {
  return (
    tool.toolClass === "A CLASS" &&
    tool.upgradeDecision === "UPGRADE" &&
    (!tool.hasFormulaContract || !tool.hasValidation || !tool.hasTests)
  );
}

function isBatchA2Candidate(tool) {
  return (
    tool.toolClass === "A CLASS" &&
    tool.upgradeDecision === "UPGRADE" &&
    tool.hasFormulaContract &&
    tool.hasValidation &&
    tool.hasTests &&
    (!tool.hasQuickResult || !tool.hasDeepReport || !tool.hasI18n)
  );
}

function isBatchB1Candidate(tool) {
  return tool.toolClass === "B CLASS" && tool.upgradeDecision === "UPGRADE";
}

function isBatchC1Candidate(tool) {
  return (
    tool.toolClass === "C CLASS" &&
    tool.upgradeDecision === "QUARANTINE" &&
    tool.routeStatus === "active-route" &&
    !tool.hasFormulaContract &&
    (tool.hasSchema || tool.hasFormulaRegistryEntry)
  );
}

function resolveQuarantineReason(tool) {
  if (tool.upgradeReason === MISSING_SCHEMA_QUARANTINE_REASON) {
    return "missing-schema";
  }
  if (tool.routeStatus === "category-only") {
    return "category-only";
  }
  if (tool.routeStatus === "missing-route" || !tool.hasRoute) {
    return "missing route";
  }
  if (
    tool.routeStatus === "active-route" &&
    !tool.hasSchema &&
    !tool.hasFormulaContract &&
    !tool.hasFormulaRegistryEntry &&
    !tool.hasLocator
  ) {
    return "no backing";
  }
  return "missing schema/contract/registry";
}

function buildBatchA1(tools) {
  return tools
    .filter(isBatchA1Candidate)
    .sort(compareA1Priority)
    .map((tool, index) =>
      buildBatchItem(tool, {
        priority: index + 1,
        recommendedAction: "ADD_CONTRACT_VALIDATION_TESTS",
        missing: listMissingCore(tool),
        whyThisBatch:
          "Premium decision tool with active route/UI shell but missing FormulaContract, validation, or slug-level tests.",
      }),
    );
}

function buildBatchA2(tools) {
  return tools
    .filter(isBatchA2Candidate)
    .sort(compareSlug)
    .map((tool, index) =>
      buildBatchItem(tool, {
        priority: index + 1,
        recommendedAction: "ADD_DECISION_UI_I18N",
        missing: listMissingUi(tool),
        whyThisBatch:
          "Premium decision core exists; quick result, deep report, or i18n decision surfaces still missing.",
      }),
    );
}

function buildBatchB1(tools) {
  return tools
    .filter(isBatchB1Candidate)
    .sort(compareSlug)
    .map((tool, index) =>
      buildBatchItem(tool, {
        priority: index + 1,
        recommendedAction: "ADD_ADVANCED_CALCULATOR_GOVERNANCE",
        missing: listMissingAdvanced(tool),
        whyThisBatch:
          "Advanced calculator route is active but contract, validation, test, or route governance gaps remain.",
      }),
    );
}

function buildBatchC1(tools) {
  return tools
    .filter(isBatchC1Candidate)
    .sort(compareSlug)
    .map((tool, index) =>
      buildBatchItem(tool, {
        priority: index + 1,
        recommendedAction: "ADD_SIMPLE_CALCULATOR_CONTRACT",
        missing: [MISSING_LABELS.formulaContract],
        whyThisBatch:
          "Simple calculator has route plus schema or formula registry backing; recoverable with FormulaContract.",
      }),
    );
}

function buildHumanReviewQueue(tools) {
  return tools
    .filter((tool) => tool.upgradeDecision === "HUMAN_REVIEW")
    .sort(compareSlug)
    .map((tool, index) => {
      const reviewMeta = HUMAN_REVIEW_REASONS[tool.slug] ?? {
        category:
          tool.upgradeReason === RISK_EXCLUDED_UPGRADE_REASON
            ? "risk-excluded"
            : "formula liability risk",
        reason:
          tool.upgradeReason === RISK_EXCLUDED_UPGRADE_REASON
            ? "Risk-excluded safety, legal, compliance, or regulatory domain requires manual review."
            : "Regulated or high-interpretation domain requires manual formula review.",
      };

      return {
        ...buildBatchItem(tool, {
          priority: index + 1,
          recommendedAction: "MANUAL_FORMULA_REVIEW",
          missing: listMissingCore(tool).concat(listMissingUi(tool)),
          whyThisBatch: reviewMeta.reason,
        }),
        reviewCategory: reviewMeta.category,
      };
    });
}

function buildClassificationBuckets(tools) {
  return {
    pass: tools.filter((tool) => tool.upgradeDecision === "PASS").map((tool) => tool.slug),
    upgrade: tools.filter((tool) => tool.upgradeDecision === "UPGRADE").map((tool) => tool.slug),
    humanReview: tools
      .filter((tool) => tool.upgradeDecision === "HUMAN_REVIEW")
      .map((tool) => tool.slug),
    quarantine: tools
      .filter((tool) => tool.upgradeDecision === "QUARANTINE")
      .map((tool) => tool.slug),
    riskExcluded: tools
      .filter((tool) => tool.upgradeReason === RISK_EXCLUDED_UPGRADE_REASON)
      .map((tool) => tool.slug),
    missingSchema: tools
      .filter((tool) => tool.upgradeReason === MISSING_SCHEMA_QUARANTINE_REASON)
      .map((tool) => tool.slug),
  };
}

function buildQuarantineReviewQueue(tools) {
  return tools
    .filter((tool) => tool.upgradeDecision === "QUARANTINE")
    .sort(compareSlug)
    .slice(0, 25)
    .map((tool, index) =>
      buildBatchItem(tool, {
        priority: index + 1,
        recommendedAction: "REVIEW_QUARANTINE_DECISION",
        missing: listMissingCore(tool)
          .concat(listMissingUi(tool))
          .concat(!tool.hasRoute ? [MISSING_LABELS.route] : []),
        whyThisBatch: resolveQuarantineReason(tool),
      }),
    );
}

export function buildQualityBackfillPlan(qualityReport) {
  const tools = [...(qualityReport.tools ?? [])].sort((left, right) =>
    left.slug.localeCompare(right.slug),
  );
  const summarySource = qualityReport.summary ?? {};
  const decisionSource = summarySource.upgradeDecision ?? {};

  const batches = {
    batchA1PremiumDecisionUpgrades: buildBatchA1(tools),
    batchA2PremiumDecisionUiI18nUpgrades: buildBatchA2(tools),
    batchB1AdvancedCalculatorUpgrades: buildBatchB1(tools),
    batchC1SimpleCalculatorRecovery: buildBatchC1(tools),
    humanReviewQueue: buildHumanReviewQueue(tools),
    quarantineReviewQueue: buildQuarantineReviewQueue(tools),
  };
  const classification = buildClassificationBuckets(tools);

  return {
    generatedAt: new Date().toISOString(),
    sourceQualityReport: path.relative(ROOT, QUALITY_SCAN_REPORT_PATH),
    summary: {
      totalTools: summarySource.totalTools ?? tools.length,
      pass: decisionSource.PASS ?? 0,
      upgrade: decisionSource.UPGRADE ?? 0,
      humanReview: decisionSource.HUMAN_REVIEW ?? 0,
      quarantine: decisionSource.QUARANTINE ?? 0,
    },
    classification: {
      pass: classification.pass.length,
      upgrade: classification.upgrade.length,
      humanReview: classification.humanReview.length,
      quarantine: classification.quarantine.length,
      riskExcluded: classification.riskExcluded.length,
      missingSchema: classification.missingSchema.length,
      slugs: classification,
    },
    batches,
  };
}

export function loadQualityBackfillPlanInput() {
  if (!fs.existsSync(QUALITY_SCAN_REPORT_PATH)) {
    throw new Error(
      `Quality scan report missing. Run npm run scan:quality-backfill first: ${QUALITY_SCAN_REPORT_PATH}`,
    );
  }

  return readJson(QUALITY_SCAN_REPORT_PATH);
}

export function formatQualityBackfillPlanStdout(plan) {
  return [
    "P55 Quality Backfill Plan",
    `Total tools: ${plan.summary.totalTools}`,
    `Batch A1 Premium Decision Core Upgrades: ${plan.batches.batchA1PremiumDecisionUpgrades.length}`,
    `Batch A2 Premium Decision UI/i18n Upgrades: ${plan.batches.batchA2PremiumDecisionUiI18nUpgrades.length}`,
    `Batch B1 Advanced Calculator Upgrades: ${plan.batches.batchB1AdvancedCalculatorUpgrades.length}`,
    `Batch C1 Simple Calculator Recovery: ${plan.batches.batchC1SimpleCalculatorRecovery.length}`,
    `Human Review Queue: ${plan.batches.humanReviewQueue.length}`,
    `Quarantine Review Queue: ${plan.batches.quarantineReviewQueue.length}`,
    `Classification pass/upgrade/humanReview/quarantine: ${plan.classification.pass}/${plan.classification.upgrade}/${plan.classification.humanReview}/${plan.classification.quarantine}`,
    `Risk excluded: ${plan.classification.riskExcluded} | Missing schema: ${plan.classification.missingSchema}`,
    `Output: ${path.relative(ROOT, QUALITY_BACKFILL_PLAN_PATH)}`,
  ].join("\n");
}
