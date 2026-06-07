import type {
  AnonymizedBenchmarkPublicRow,
  BenchmarkSubmission,
  ClaimReadiness,
  UserReportedAccuracy,
} from "@/lib/benchmarks/benchmark-types";

const PII_FIELD_PATTERN =
  /email|company|contact|name|phone|address|user|uid|account/i;

const BENCHMARK_READY_MIN_APPROVED = 10;

export function getClaimReadiness(submissions: readonly BenchmarkSubmission[]): ClaimReadiness {
  const approved = submissions.filter((item) => item.reviewStatus === "approved");

  const hasApprovedCaseStudy = approved.some((item) => item.permissionForCaseStudy);
  if (hasApprovedCaseStudy) {
    return "case_study_ready";
  }

  const approvedAnonymized = approved.filter(
    (item) => item.permissionForAnonymizedBenchmark
  );
  if (approvedAnonymized.length >= BENCHMARK_READY_MIN_APPROVED) {
    return "benchmark_ready";
  }

  return "sample_only";
}

function stripPiiFromSnapshot(
  snapshot: Readonly<Record<string, string | number | boolean>>
): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    if (PII_FIELD_PATTERN.test(key)) {
      continue;
    }
    if (typeof value === "string" && EMAILLike(value)) {
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

function EMAILLike(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function toAnonymizedBenchmarkPublicRow(
  submission: BenchmarkSubmission
): AnonymizedBenchmarkPublicRow | null {
  if (
    submission.reviewStatus !== "approved" ||
    !submission.permissionForAnonymizedBenchmark
  ) {
    return null;
  }

  return {
    sectorSlug: submission.sectorSlug,
    toolSlug: submission.toolSlug,
    country: submission.country,
    currency: submission.currency,
    companySize: submission.companySize,
    inputSnapshot: stripPiiFromSnapshot(submission.inputSnapshot),
    resultSnapshot: stripPiiFromSnapshot(submission.resultSnapshot),
    userReportedAccuracy: submission.userReportedAccuracy,
  };
}

export function formulaFitToAccuracy(formulaFit: string): UserReportedAccuracy {
  const normalized = formulaFit.toLowerCase();
  if (normalized.includes("low") || normalized.includes("poor")) {
    return "low";
  }
  if (normalized.includes("high") || normalized.includes("strong")) {
    return "high";
  }
  return "medium";
}

export function buildAnonymizedPublicBenchmarkRows(
  submissions: readonly BenchmarkSubmission[]
): AnonymizedBenchmarkPublicRow[] {
  return submissions
    .map(toAnonymizedBenchmarkPublicRow)
    .filter((row): row is AnonymizedBenchmarkPublicRow => row !== null);
}
