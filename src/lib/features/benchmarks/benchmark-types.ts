/**
 * Benchmark / beta partner data loop - types only.
 * No fake claims; data feeds future verified benchmarks.
 */

export type BetaPartnerStatus = "new" | "reviewing" | "accepted" | "rejected";

export interface BetaPartner {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly status: BetaPartnerStatus;
  readonly companyName: string;
  readonly contactName: string;
  readonly email: string;
  readonly country: string;
  readonly industry: string;
  readonly companySize: string;
  readonly role: string;
  readonly mainLossArea: string;
  readonly currentMethod: string;
  readonly monthlyEstimatedLossRange: string;
  readonly wantsCaseStudyPermission: boolean;
  readonly notes: string;
}

export type BenchmarkSubmissionSource =
  | "beta_partner"
  | "premium_report_feedback"
  | "manual_admin";

export type UserReportedAccuracy = "low" | "medium" | "high";

export type BenchmarkReviewStatus = "pending" | "approved" | "rejected";

export type BenchmarkSnapshotValue = number | string | boolean;

export interface BenchmarkSubmission {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly source: BenchmarkSubmissionSource;
  readonly sectorSlug: string;
  readonly toolSlug: string;
  readonly country: string;
  readonly currency: string;
  readonly companySize: string;
  readonly inputSnapshot: Readonly<Record<string, BenchmarkSnapshotValue>>;
  readonly resultSnapshot: Readonly<Record<string, BenchmarkSnapshotValue>>;
  readonly userReportedAccuracy: UserReportedAccuracy;
  readonly userComment: string;
  readonly permissionForAnonymizedBenchmark: boolean;
  readonly permissionForCaseStudy: boolean;
  readonly reviewedByAdmin: boolean;
  readonly reviewStatus: BenchmarkReviewStatus;
}

export type ReportFeedbackRating = 1 | 2 | 3 | 4 | 5;

export interface ReportFeedback {
  readonly id: string;
  readonly createdAt: string;
  readonly reportSlug?: string;
  readonly schemaSlug: string;
  readonly sectorSlug: string;
  readonly rating: ReportFeedbackRating;
  readonly usefulness: string;
  readonly formulaFit: string;
  readonly missingVariable: string;
  readonly comment: string;
  readonly permissionForBenchmark: boolean;
}

export interface BetaPartnerInput {
  companyName: string;
  contactName: string;
  email: string;
  country: string;
  industry: string;
  companySize: string;
  role: string;
  mainLossArea: string;
  currentMethod: string;
  monthlyEstimatedLossRange: string;
  wantsCaseStudyPermission: boolean;
  notes: string;
  pagePath: string;
}

export interface ReportFeedbackInput {
  schemaSlug: string;
  sectorSlug: string;
  reportSlug?: string;
  rating: ReportFeedbackRating;
  usefulness: string;
  formulaFit: string;
  missingVariable: string;
  comment: string;
  permissionForBenchmark: boolean;
  inputSnapshot?: Readonly<Record<string, BenchmarkSnapshotValue>>;
  resultSnapshot?: Readonly<Record<string, BenchmarkSnapshotValue>>;
  country?: string;
  currency?: string;
  companySize?: string;
}

export type BetaPartnerFieldErrors = Partial<
  Record<keyof BetaPartnerInput | "form", string>
>;

export type ReportFeedbackFieldErrors = Partial<
  Record<keyof ReportFeedbackInput | "form", string>
>;

export interface BetaPartnerSubmitResult {
  success: boolean;
  errors?: BetaPartnerFieldErrors;
  rateLimited?: boolean;
  firestoreSaved?: boolean;
}

export interface ReportFeedbackSubmitResult {
  success: boolean;
  errors?: ReportFeedbackFieldErrors;
  rateLimited?: boolean;
  firestoreSaved?: boolean;
}

/** Public-safe benchmark row - no PII fields. */
export interface AnonymizedBenchmarkPublicRow {
  readonly sectorSlug: string;
  readonly toolSlug: string;
  readonly country: string;
  readonly currency: string;
  readonly companySize: string;
  readonly inputSnapshot: Readonly<Record<string, BenchmarkSnapshotValue>>;
  readonly resultSnapshot: Readonly<Record<string, BenchmarkSnapshotValue>>;
  readonly userReportedAccuracy: UserReportedAccuracy;
}

export type ClaimReadiness = "sample_only" | "benchmark_ready" | "case_study_ready";

export const BETA_PARTNER_COLLECTION = "betaPartners";
export const BENCHMARK_SUBMISSIONS_COLLECTION = "benchmarkSubmissions";
export const REPORT_FEEDBACK_COLLECTION = "reportFeedback";

export const NOTES_MAX_LENGTH = 1000;
export const FEEDBACK_COMMENT_MAX_LENGTH = 800;
