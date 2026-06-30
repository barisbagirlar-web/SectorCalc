import { describe, expect, test } from "vitest";
import type { BenchmarkSubmission } from "@/lib/features/benchmarks/benchmark-types";
import {
  buildAnonymizedPublicBenchmarkRows,
  getClaimReadiness,
  toAnonymizedBenchmarkPublicRow,
} from "@/lib/features/benchmarks/claim-readiness";
import { buildBenchmarkSubmission } from "@/lib/features/benchmarks/create-benchmark-submission";
import {
  isValidReportFeedbackRating,
  validateBetaPartnerInput,
  validateReportFeedbackInput,
} from "@/lib/features/benchmarks/validate-benchmark-inputs";
import { buildDefaultBetaPartnerInput } from "@/lib/features/benchmarks/create-beta-partner";

function makeSubmission(
  overrides: Partial<BenchmarkSubmission> = {}
): BenchmarkSubmission {
  return {
    ...buildBenchmarkSubmission({
      source: "premium_report_feedback",
      sectorSlug: "cnc-manufacturing",
      toolSlug: "cnc-oee-loss",
      country: "US",
      companySize: "11-50",
      inputSnapshot: { availability: 72 },
      resultSnapshot: { oeeLoss: 12000 },
      userReportedAccuracy: "medium",
      userComment: "Looks reasonable",
      permissionForAnonymizedBenchmark: true,
      permissionForCaseStudy: false,
    }),
    reviewStatus: "approved",
    reviewedByAdmin: true,
    ...overrides,
  };
}

describe("benchmark-loop", () => {
  test("beta partner required fields validation", () => {
    const errors = validateBetaPartnerInput(buildDefaultBetaPartnerInput("/beta-partner"));
    expect(errors.email).toBeTruthy();
    expect(errors.industry).toBeTruthy();
    expect(errors.mainLossArea).toBeTruthy();
    expect(errors.country).toBeTruthy();
  });

  test("invalid email fail", () => {
    const errors = validateBetaPartnerInput({
      ...buildDefaultBetaPartnerInput("/beta-partner"),
      email: "not-an-email",
      companyName: "Acme CNC",
      industry: "CNC & Manufacturing",
      mainLossArea: "Scrap drift",
      country: "US",
      companySize: "11-50",
      role: "Owner",
      currentMethod: "Spreadsheet",
      monthlyEstimatedLossRange: "5k-20k",
    });
    expect(errors.email).toBeTruthy();
  });

  test("benchmark permission false yields sample_only claim readiness", () => {
    const submissions = [
      makeSubmission({
        permissionForAnonymizedBenchmark: false,
        permissionForCaseStudy: false,
      }),
    ];
    expect(getClaimReadiness(submissions)).toBe("sample_only");
  });

  test("10 approved anonymized submissions yield benchmark_ready", () => {
    const submissions = Array.from({ length: 10 }, (_, index) =>
      makeSubmission({
        id: `benchmark_test_${index}`,
        permissionForAnonymizedBenchmark: true,
        permissionForCaseStudy: false,
      })
    );
    expect(getClaimReadiness(submissions)).toBe("benchmark_ready");
  });

  test("case study permission plus approved yields case_study_ready", () => {
    const submissions = [
      makeSubmission({
        permissionForCaseStudy: true,
        permissionForAnonymizedBenchmark: false,
      }),
    ];
    expect(getClaimReadiness(submissions)).toBe("case_study_ready");
  });

  test("personal fields do not appear in public benchmark output", () => {
    const submission = makeSubmission({
      inputSnapshot: {
        availability: 70,
        contactEmail: "ops@example.com",
        companyName: "Hidden Co",
      },
      resultSnapshot: {
        oeeLoss: 9000,
        userEmail: "hidden@example.com",
      },
    });

    const row = toAnonymizedBenchmarkPublicRow(submission);
    expect(row).not.toBeNull();
    if (!row) {
      return;
    }

    const serialized = JSON.stringify(row);
    expect(serialized).not.toMatch(/example\.com/i);
    expect(serialized).not.toMatch(/Hidden Co/);
    expect(row.inputSnapshot.availability).toBe(70);
    expect(buildAnonymizedPublicBenchmarkRows([submission])).toHaveLength(1);
  });

  test("feedback rating outside 1-5 fails validation", () => {
    const errors = validateReportFeedbackInput({
      schemaSlug: "cnc-oee-loss",
      sectorSlug: "cnc-manufacturing",
      rating: 6 as never,
      usefulness: "useful",
      formulaFit: "medium",
      missingVariable: "",
      comment: "",
      permissionForBenchmark: false,
    });
    expect(errors.rating).toBeTruthy();
    expect(isValidReportFeedbackRating(6)).toBe(false);
  });

  test("empty feedback validation does not crash", () => {
    expect(() =>
      validateReportFeedbackInput({
        schemaSlug: "",
        sectorSlug: "",
        rating: 3,
        usefulness: "",
        formulaFit: "",
        missingVariable: "",
        comment: "",
        permissionForBenchmark: false,
      })
    ).not.toThrow();

    const errors = validateReportFeedbackInput({
      schemaSlug: "",
      sectorSlug: "",
      rating: 3,
      usefulness: "",
      formulaFit: "",
      missingVariable: "",
      comment: "",
      permissionForBenchmark: false,
    });
    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });
});
