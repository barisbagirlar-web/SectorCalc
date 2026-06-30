import type {
  ReportFeedback,
  ReportFeedbackInput,
  ReportFeedbackSubmitResult,
} from "@/lib/features/benchmarks/benchmark-types";
import {
  writeBenchmarkSubmissionToFirestore,
  writeReportFeedbackToFirestore,
} from "@/lib/features/benchmarks/benchmark-firestore-write";
import { benchmarkSubmissionFromReportFeedback } from "@/lib/features/benchmarks/create-benchmark-submission";
import { validateReportFeedbackInput } from "@/lib/features/benchmarks/validate-benchmark-inputs";
import {
  checkLeadRateLimit,
  LEAD_RATE_LIMIT_MESSAGE,
  recordLeadSubmission,
} from "@/lib/features/leads/rate-limit";

function createFeedbackId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `feedback_${crypto.randomUUID()}`;
  }
  return `feedback_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function createReportFeedback(
  input: ReportFeedbackInput
): Promise<ReportFeedbackSubmitResult> {
  const errors = validateReportFeedbackInput(input);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const rateLimit = checkLeadRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      rateLimited: true,
      errors: { form: rateLimit.message ?? LEAD_RATE_LIMIT_MESSAGE },
    };
  }

  const feedback: ReportFeedback = {
    id: createFeedbackId(),
    createdAt: new Date().toISOString(),
    schemaSlug: input.schemaSlug.trim(),
    sectorSlug: input.sectorSlug.trim(),
    reportSlug: input.reportSlug?.trim() || undefined,
    rating: input.rating,
    usefulness: input.usefulness.trim(),
    formulaFit: input.formulaFit.trim(),
    missingVariable: input.missingVariable.trim(),
    comment: input.comment.trim(),
    permissionForBenchmark: input.permissionForBenchmark,
  };

  recordLeadSubmission();

  let firestoreSaved = false;
  try {
    firestoreSaved = await writeReportFeedbackToFirestore(feedback);
    const benchmark = benchmarkSubmissionFromReportFeedback(input);
    if (benchmark && firestoreSaved) {
      await writeBenchmarkSubmissionToFirestore(benchmark);
    }
  } catch {
    firestoreSaved = false;
  }

  return {
    success: true,
    firestoreSaved,
  };
}
