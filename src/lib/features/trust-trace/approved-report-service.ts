/**
 * Approved Report Service — create and retrieve approved reports in Firestore
 * Uses Firebase Admin SDK (server-side only — API routes, Cloud Functions).
 */
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import type { ApprovedReportPayload, CreateApprovedReportInput } from "./types";
import { createCalculationHash } from "./hash";
import { createReportId, createValidationStampId } from "./report-id";
import { sanitizeSnapshot } from "./snapshot";
import { buildPublicReportSummary } from "./public-summary";

const COLLECTION_NAME = "approvedReports";
const FORMULA_VERSION = "1.0.0";
const DISCLAIMER_VERSION = "1.0";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://sectorcalc.com";

/**
 * Build an approved report payload without writing to Firestore.
 */
export async function buildApprovedReportPayload(
  input: CreateApprovedReportInput
): Promise<ApprovedReportPayload> {
  const now = new Date().toISOString();
  const reportId = createReportId(input.toolSlug);
  const validationStampId = createValidationStampId(reportId);

  const safeInput = sanitizeSnapshot(input.inputSnapshot);
  const safeResult = sanitizeSnapshot(input.resultSnapshot);

  // Hash covers tool identity + formula version + sanitized snapshots
  const hashPayload = {
    reportId,
    toolSlug: input.toolSlug,
    formulaVersion: input.formulaVersion ?? FORMULA_VERSION,
    formulaContractId: input.formulaContractId ?? null,
    inputSnapshot: safeInput,
    resultSnapshot: safeResult,
  };
  const calculationHash = await createCalculationHash(hashPayload);
  const qrTargetUrl = `${BASE_URL}/verify/${calculationHash}`;

  const report: ApprovedReportPayload = {
    id: reportId,
    reportId,
    calculationHash,
    validationStampId,
    qrTargetUrl,

    toolSlug: input.toolSlug,
    toolType: input.toolType,
    locale: input.locale,
    routePath: input.routePath,

    formulaVersion: input.formulaVersion ?? FORMULA_VERSION,
    formulaContractId: input.formulaContractId,

    inputSnapshot: safeInput,
    resultSnapshot: safeResult,

    publicSummary: {
      toolSlug: input.toolSlug,
      toolType: input.toolType,
      formulaVersion: input.formulaVersion ?? FORMULA_VERSION,
      issuedAt: now,
      validationStampId,
    },

    auditTrail: [
      {
        at: now,
        event: "report_created",
        details: { toolSlug: input.toolSlug, locale: input.locale },
      },
    ],

    status: "issued",
    visibility: "public_verify",

    issuedAt: now,
    updatedAt: now,

    userId: input.userId ?? null,
    userEmail: input.userEmail ?? null,

    disclaimerVersion: DISCLAIMER_VERSION,
    appVersion: input.appVersion,
  };

  return report;
}

/**
 * Create and persist an approved report to Firestore.
 */
export async function createApprovedReport(
  input: CreateApprovedReportInput
): Promise<
  | { ok: true; report: ApprovedReportPayload }
  | { ok: false; error: "validation_error" | "auth_required" | "create_failed" }
> {
  // Basic validation
  if (!input.toolSlug || !input.locale || !input.routePath) {
    return { ok: false, error: "validation_error" };
  }

  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, error: "create_failed" };
  }

  try {
    const report = await buildApprovedReportPayload(input);

    const reportRef = db.collection(COLLECTION_NAME).doc(report.reportId);

    // Only store safe non-private fields in Firestore
    // userEmail is stored but only readable by owner/admin (see firestore.rules)
    await reportRef.set({
      ...report,
      auditTrail: [...report.auditTrail],
    });

    return { ok: true, report };
  } catch (err) {
    console.error("[approved-report-service] createApprovedReport failed:", err);
    return { ok: false, error: "create_failed" };
  }
}

/**
 * Retrieve an approved report for the public verify endpoint.
 * Returns null if not found. Private fields (userEmail, userId) are NOT returned.
 */
export async function getApprovedReportForVerify(
  reportId: string
): Promise<ApprovedReportPayload | null> {
  if (!reportId) {
    return null;
  }

  const db = getAdminFirestore();
  if (!db) return null;

  try {
    const reportRef = db.collection(COLLECTION_NAME).doc(reportId);
    const snap = await reportRef.get();

    if (!snap.exists) {
      return null;
    }

    const data = snap.data() as ApprovedReportPayload;

    // Return report with publicSummary refreshed (never expose private fields)
    const safeReport: ApprovedReportPayload = {
      ...data,
      // Ensure private user data is stripped for verify usage
      userId: null,
      userEmail: null,
      publicSummary: buildPublicReportSummary(data),
    };

    return safeReport;
  } catch (err) {
    console.error("[approved-report-service] getApprovedReportForVerify failed:", err);
    return null;
  }
}

/**
 * Retrieve an approved report by calculation hash (public verify by hash path).
 */
export async function getApprovedReportByHash(
  calculationHash: string,
): Promise<ApprovedReportPayload | null> {
  if (!calculationHash || calculationHash.length !== 64) {
    return null;
  }

  const db = getAdminFirestore();
  if (!db) {
    return null;
  }

  try {
    const snap = await db
      .collection(COLLECTION_NAME)
      .where("calculationHash", "==", calculationHash)
      .limit(1)
      .get();

    if (snap.empty) {
      return null;
    }

    const data = snap.docs[0]?.data() as ApprovedReportPayload | undefined;
    if (!data) {
      return null;
    }

    return {
      ...data,
      userId: null,
      userEmail: null,
      publicSummary: buildPublicReportSummary(data),
    };
  } catch (err) {
    console.error("[approved-report-service] getApprovedReportByHash failed:", err);
    return null;
  }
}