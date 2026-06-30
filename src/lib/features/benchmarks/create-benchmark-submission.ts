import type {
  BenchmarkSubmission,
  BenchmarkSubmissionSource,
  UserReportedAccuracy,
} from "@/lib/features/benchmarks/benchmark-types";
import type { BetaPartner } from "@/lib/features/benchmarks/benchmark-types";
import type { ReportFeedbackInput } from "@/lib/features/benchmarks/benchmark-types";
import { formulaFitToAccuracy } from "@/lib/features/benchmarks/claim-readiness";

function createBenchmarkId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `benchmark_${crypto.randomUUID()}`;
  }
  return `benchmark_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface BuildBenchmarkSubmissionParams {
  source: BenchmarkSubmissionSource;
  sectorSlug: string;
  toolSlug: string;
  country: string;
  currency?: string;
  companySize?: string;
  inputSnapshot: Readonly<Record<string, string | number | boolean>>;
  resultSnapshot: Readonly<Record<string, string | number | boolean>>;
  userReportedAccuracy: UserReportedAccuracy;
  userComment: string;
  permissionForAnonymizedBenchmark: boolean;
  permissionForCaseStudy: boolean;
}

export function buildBenchmarkSubmission(
  params: BuildBenchmarkSubmissionParams
): BenchmarkSubmission {
  const now = new Date().toISOString();
  return {
    id: createBenchmarkId(),
    createdAt: now,
    updatedAt: now,
    source: params.source,
    sectorSlug: params.sectorSlug.trim(),
    toolSlug: params.toolSlug.trim(),
    country: params.country.trim() || "unknown",
    currency: params.currency?.trim() || "USD",
    companySize: params.companySize?.trim() || "unknown",
    inputSnapshot: params.inputSnapshot,
    resultSnapshot: params.resultSnapshot,
    userReportedAccuracy: params.userReportedAccuracy,
    userComment: params.userComment.trim(),
    permissionForAnonymizedBenchmark: params.permissionForAnonymizedBenchmark,
    permissionForCaseStudy: params.permissionForCaseStudy,
    reviewedByAdmin: false,
    reviewStatus: "pending",
  };
}

export function benchmarkSubmissionFromReportFeedback(
  feedback: ReportFeedbackInput
): BenchmarkSubmission | null {
  if (!feedback.permissionForBenchmark) {
    return null;
  }

  return buildBenchmarkSubmission({
    source: "premium_report_feedback",
    sectorSlug: feedback.sectorSlug,
    toolSlug: feedback.reportSlug?.trim() || feedback.schemaSlug,
    country: feedback.country?.trim() || "unknown",
    currency: feedback.currency?.trim() || "USD",
    companySize: feedback.companySize?.trim() || "unknown",
    inputSnapshot: feedback.inputSnapshot ?? {},
    resultSnapshot: feedback.resultSnapshot ?? {},
    userReportedAccuracy: formulaFitToAccuracy(feedback.formulaFit),
    userComment: feedback.comment.trim(),
    permissionForAnonymizedBenchmark: true,
    permissionForCaseStudy: false,
  });
}

export function benchmarkSubmissionFromBetaPartner(
  partner: BetaPartner
): BenchmarkSubmission {
  return buildBenchmarkSubmission({
    source: "beta_partner",
    sectorSlug: partner.industry.toLowerCase().replace(/\s+/g, "-").slice(0, 80),
    toolSlug: "beta-partner-intake",
    country: partner.country,
    currency: "USD",
    companySize: partner.companySize,
    inputSnapshot: {
      mainLossArea: partner.mainLossArea,
      currentMethod: partner.currentMethod,
      monthlyEstimatedLossRange: partner.monthlyEstimatedLossRange,
    },
    resultSnapshot: {},
    userReportedAccuracy: "medium",
    userComment: partner.notes,
    permissionForAnonymizedBenchmark: false,
    permissionForCaseStudy: partner.wantsCaseStudyPermission,
  });
}
