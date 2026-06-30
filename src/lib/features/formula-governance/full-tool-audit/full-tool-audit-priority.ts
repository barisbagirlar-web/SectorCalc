/**
 * Full tool audit priority and recommended action resolver — Phase 5H-J.
 */

import type {
  FullToolAuditItem,
  FullToolRecommendedAction,
  FullToolRecommendedBatches,
} from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";

export function resolveRecommendedAction(
  item: Pick<
    FullToolAuditItem,
    | "blockers"
    | "hasProductionLocator"
    | "inputDesignStatus"
    | "migrationStatus"
    | "trustTraceStatus"
    | "smartFormStatus"
    | "reportStatus"
    | "readiness"
  >,
): FullToolRecommendedAction {
  if (item.blockers.length > 0 || item.trustTraceStatus === "blocked") {
    return "blocked_manual_review";
  }

  if (!item.hasProductionLocator) {
    return "metadata_patch";
  }

  if (item.migrationStatus === "fixture_ontology") {
    return "fixture_ontology";
  }

  if (
    item.inputDesignStatus === "shallow" ||
    item.inputDesignStatus === "unsafe" ||
    item.migrationStatus === "controlled_input_patch" ||
    item.migrationStatus === "input_design_only"
  ) {
    return "input_design_patch";
  }

  if (item.migrationStatus === "smart_form_patch" || item.smartFormStatus === "batch_eligible") {
    return "smart_form_patch";
  }

  if (item.trustTraceStatus === "needs_review") {
    return "trust_trace_patch";
  }

  if (item.reportStatus !== "export_ready") {
    return "report_layer_patch";
  }

  if (item.readiness.productionSafe && item.readiness.reportReady) {
    return "no_action";
  }

  return "metadata_patch";
}

export function buildRecommendedBatches(items: readonly FullToolAuditItem[]): FullToolRecommendedBatches {
  const metadataBatch: string[] = [];
  const smartFormBatch: string[] = [];
  const reportBatch: string[] = [];
  const fixtureBatch: string[] = [];
  const manualReviewBatch: string[] = [];

  for (const item of items) {
    switch (item.recommendedAction) {
      case "metadata_patch":
        metadataBatch.push(item.slug);
        break;
      case "fixture_ontology":
        fixtureBatch.push(item.slug);
        break;
      case "smart_form_patch":
        smartFormBatch.push(item.slug);
        break;
      case "trust_trace_patch":
      case "report_layer_patch":
        reportBatch.push(item.slug);
        break;
      case "input_design_patch":
        metadataBatch.push(item.slug);
        break;
      case "blocked_manual_review":
        manualReviewBatch.push(item.slug);
        break;
      case "no_action":
      default:
        break;
    }
  }

  return {
    metadataBatch,
    smartFormBatch,
    reportBatch,
    fixtureBatch,
    manualReviewBatch,
  };
}

export function buildTop10Risks(items: readonly FullToolAuditItem[]): string[] {
  return [...items]
    .filter((item) => item.blockers.length > 0 || item.score < 50)
    .sort((left, right) => left.score - right.score)
    .slice(0, 10)
    .map(
      (item) =>
        `- ${item.slug}: score ${item.score}, action ${item.recommendedAction}, blockers ${item.blockers.length}`,
    );
}

export function buildTop10QuickWins(items: readonly FullToolAuditItem[]): string[] {
  return [...items]
    .filter(
      (item) =>
        item.blockers.length === 0 &&
        item.score >= 70 &&
        item.recommendedAction !== "no_action" &&
        item.recommendedAction !== "blocked_manual_review",
    )
    .sort((left, right) => right.score - left.score)
    .slice(0, 10)
    .map((item) => `- ${item.slug}: score ${item.score}, action ${item.recommendedAction}`);
}
