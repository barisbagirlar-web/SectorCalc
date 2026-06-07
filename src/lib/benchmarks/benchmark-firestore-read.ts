import { collection, getDocs, orderBy, query } from "firebase/firestore";
import {
  BETA_PARTNER_COLLECTION,
  BENCHMARK_SUBMISSIONS_COLLECTION,
  REPORT_FEEDBACK_COLLECTION,
  type BetaPartner,
  type BenchmarkSubmission,
  type ReportFeedback,
  type ReportFeedbackRating,
  type BetaPartnerStatus,
  type BenchmarkReviewStatus,
  type BenchmarkSubmissionSource,
  type UserReportedAccuracy,
} from "@/lib/benchmarks/benchmark-types";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asRating(value: unknown): ReportFeedbackRating {
  const num = typeof value === "number" ? value : Number(value);
  if (num >= 1 && num <= 5) {
    return num as ReportFeedbackRating;
  }
  return 3;
}

function asSnapshot(value: unknown): Record<string, string | number | boolean> {
  if (!isRecord(value)) {
    return {};
  }
  const snapshot: Record<string, string | number | boolean> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean"
    ) {
      snapshot[key] = entry;
    }
  }
  return snapshot;
}

function normalizeBetaPartner(data: unknown): BetaPartner | null {
  if (!isRecord(data) || typeof data.id !== "string") {
    return null;
  }
  const status = asString(data.status, "new") as BetaPartnerStatus;
  return {
    id: data.id,
    createdAt: asString(data.createdAt),
    updatedAt: asString(data.updatedAt, asString(data.createdAt)),
    status,
    companyName: asString(data.companyName),
    contactName: asString(data.contactName),
    email: asString(data.email),
    country: asString(data.country),
    industry: asString(data.industry),
    companySize: asString(data.companySize),
    role: asString(data.role),
    mainLossArea: asString(data.mainLossArea),
    currentMethod: asString(data.currentMethod),
    monthlyEstimatedLossRange: asString(data.monthlyEstimatedLossRange),
    wantsCaseStudyPermission: asBoolean(data.wantsCaseStudyPermission),
    notes: asString(data.notes),
  };
}

function normalizeBenchmarkSubmission(data: unknown): BenchmarkSubmission | null {
  if (!isRecord(data) || typeof data.id !== "string") {
    return null;
  }
  return {
    id: data.id,
    createdAt: asString(data.createdAt),
    updatedAt: asString(data.updatedAt, asString(data.createdAt)),
    source: asString(data.source, "manual_admin") as BenchmarkSubmissionSource,
    sectorSlug: asString(data.sectorSlug),
    toolSlug: asString(data.toolSlug),
    country: asString(data.country),
    currency: asString(data.currency, "USD"),
    companySize: asString(data.companySize),
    inputSnapshot: asSnapshot(data.inputSnapshot),
    resultSnapshot: asSnapshot(data.resultSnapshot),
    userReportedAccuracy: asString(data.userReportedAccuracy, "medium") as UserReportedAccuracy,
    userComment: asString(data.userComment),
    permissionForAnonymizedBenchmark: asBoolean(data.permissionForAnonymizedBenchmark),
    permissionForCaseStudy: asBoolean(data.permissionForCaseStudy),
    reviewedByAdmin: asBoolean(data.reviewedByAdmin),
    reviewStatus: asString(data.reviewStatus, "pending") as BenchmarkReviewStatus,
  };
}

function normalizeReportFeedback(data: unknown): ReportFeedback | null {
  if (!isRecord(data) || typeof data.id !== "string") {
    return null;
  }
  const reportSlug = asString(data.reportSlug);
  return {
    id: data.id,
    createdAt: asString(data.createdAt),
    reportSlug: reportSlug || undefined,
    schemaSlug: asString(data.schemaSlug),
    sectorSlug: asString(data.sectorSlug),
    rating: asRating(data.rating),
    usefulness: asString(data.usefulness),
    formulaFit: asString(data.formulaFit),
    missingVariable: asString(data.missingVariable),
    comment: asString(data.comment),
    permissionForBenchmark: asBoolean(data.permissionForBenchmark),
  };
}

async function listCollection<T>(
  collectionName: string,
  normalize: (data: unknown) => T | null
): Promise<T[]> {
  if (!isFirebaseConfigured) {
    return [];
  }
  const db = getFirestoreDb();
  if (!db) {
    return [];
  }

  try {
    const snapshot = await getDocs(
      query(collection(db, collectionName), orderBy("createdAt", "desc"))
    );
    const rows: T[] = [];
    for (const document of snapshot.docs) {
      const normalized = normalize(document.data());
      if (normalized) {
        rows.push(normalized);
      }
    }
    return rows;
  } catch {
    return [];
  }
}

export async function listBetaPartnersFromFirestore(): Promise<BetaPartner[]> {
  return listCollection(BETA_PARTNER_COLLECTION, normalizeBetaPartner);
}

export async function listBenchmarkSubmissionsFromFirestore(): Promise<
  BenchmarkSubmission[]
> {
  return listCollection(BENCHMARK_SUBMISSIONS_COLLECTION, normalizeBenchmarkSubmission);
}

export async function listReportFeedbackFromFirestore(): Promise<ReportFeedback[]> {
  return listCollection(REPORT_FEEDBACK_COLLECTION, normalizeReportFeedback);
}

export interface BenchmarkAdminData {
  betaPartners: BetaPartner[];
  benchmarkSubmissions: BenchmarkSubmission[];
  reportFeedback: ReportFeedback[];
}

export async function listBenchmarkAdminData(): Promise<BenchmarkAdminData> {
  const [betaPartners, benchmarkSubmissions, reportFeedback] = await Promise.all([
    listBetaPartnersFromFirestore(),
    listBenchmarkSubmissionsFromFirestore(),
    listReportFeedbackFromFirestore(),
  ]);
  return { betaPartners, benchmarkSubmissions, reportFeedback };
}
