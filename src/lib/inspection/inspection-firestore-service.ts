/**
 * Inspection Firestore Service
 *
 * Persists engineering diagnostic reports and verify metadata to Firestore.
 *
 * Collections:
 *   inspections/{report_id}     — full DiagnosticReport (owner_uid protected)
 *   inspection_verify/{hash}    — minimal verify metadata (public)
 *
 * STRICT:
 *   - inspection_verify NEVER contains problem_context, measurement rows,
 *     cost rows, customer name, photo, API keys, or user private data.
 *   - inspections documents are only readable by the owner (owner_uid matches).
 */

import { getFirebaseAdminApp, getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import type { DiagnosticReport } from "@/sectorcalc/diagnostics/report/diagnostic-report-types";
import { createDiagnosticReportHash } from "@/sectorcalc/diagnostics/report/diagnostic-report-canonicalize";

/* ── Collection names ── */

const INSPECTIONS_COLLECTION = "inspections";
const INSPECTION_VERIFY_COLLECTION = "inspection_verify";

/* ── Verify metadata type (only non-sensitive fields) ── */

export interface InspectionVerifyDoc {
  document_hash: string;
  report_type: string;
  decision: string;
  risk_score: number;
  issued_at: string;
  engine_version: string;
  schema_version: string;
  methodology_version: string;
  report_id: string;
}

export interface InspectionDoc {
  report_type: string;
  schema_version: string;
  engine_version: string;
  methodology_version: string;
  report_id: string;
  report_hash: string;
  domain_section: Record<string, unknown>;
  problem_section: Record<string, unknown>;
  measurement_section: Record<string, unknown>;
  cost_section: Record<string, unknown>;
  decision_section: Record<string, unknown>;
  action_plan_section: Record<string, unknown>;
  related_tools_section: Record<string, unknown>;
  methodology_section: Record<string, unknown>;
  limitation_section: Record<string, unknown>;
  evidence_section: Record<string, unknown>;
  audit_log: Array<Record<string, unknown>>;
  created_at: string;
  owner_uid: string | null;
}

/* ── Auth helper ── */

/**
 * Verify a Firebase ID token from the Authorization header.
 * Returns the user's UID or null if invalid/missing.
 */
export async function getUidFromRequest(
  request: Request
): Promise<string | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1]?.trim();
  if (!token) return null;

  const app = getFirebaseAdminApp();
  if (!app) return null;

  try {
    const decoded = await getAuth(app).verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

/* ── Write operations ── */

/**
 * Save a diagnostic report to the inspections collection.
 * Also writes minimal verify metadata to inspection_verify collection.
 *
 * Returns the document hash on success, null on failure.
 */
export async function saveDiagnosticReport(
  report: DiagnosticReport,
  ownerUid: string | null
): Promise<string | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  const reportHash = createDiagnosticReportHash(report);

  try {
    // ── inspections/{report_id} ──
    const inspectionDoc: InspectionDoc = {
      report_type: report.report_type,
      schema_version: report.schema_version,
      engine_version: report.engine_version,
      methodology_version: report.methodology_version,
      report_id: report.report_id,
      report_hash: reportHash,
      domain_section: report.domain_section as unknown as Record<string, unknown>,
      problem_section: report.problem_section as unknown as Record<string, unknown>,
      measurement_section: report.measurement_section as unknown as Record<string, unknown>,
      cost_section: report.cost_section as unknown as Record<string, unknown>,
      decision_section: report.decision_section as unknown as Record<string, unknown>,
      action_plan_section: report.action_plan_section as unknown as Record<string, unknown>,
      related_tools_section: report.related_tools_section as unknown as Record<string, unknown>,
      methodology_section: report.methodology_section as unknown as Record<string, unknown>,
      limitation_section: report.limitation_section as unknown as Record<string, unknown>,
      evidence_section: report.evidence_section as unknown as Record<string, unknown>,
      audit_log: report.audit_log as unknown as Array<Record<string, unknown>>,
      created_at: report.created_at,
      owner_uid: ownerUid,
    };

    await db.collection(INSPECTIONS_COLLECTION).doc(report.report_id).set(inspectionDoc);

    // ── inspection_verify/{report_hash} ── (only non-sensitive fields)
    const verifyDoc: InspectionVerifyDoc = {
      document_hash: reportHash,
      report_type: report.report_type,
      decision: report.decision_section.decision,
      risk_score: report.decision_section.total_risk_score,
      issued_at: report.created_at,
      engine_version: report.engine_version,
      schema_version: report.schema_version,
      methodology_version: report.methodology_version,
      report_id: report.report_id,
    };

    await db.collection(INSPECTION_VERIFY_COLLECTION).doc(reportHash).set(verifyDoc);

    return reportHash;
  } catch (err) {
    console.error("[inspection-firestore] saveDiagnosticReport failed:", err);
    return null;
  }
}

/* ── Read operations ── */

/**
 * Get a diagnostic report by report_id.
 * Only returns the report if the requesting user is the owner (or no owner set).
 * Returns null if not found or not authorized.
 */
export async function getDiagnosticReport(
  reportId: string,
  requestingUid: string | null
): Promise<InspectionDoc | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  try {
    const snap = await db.collection(INSPECTIONS_COLLECTION).doc(reportId).get();
    if (!snap.exists) return null;

    const data = snap.data() as InspectionDoc;

    // Owner check: if owner_uid is set, only that user can read
    if (data.owner_uid && data.owner_uid !== requestingUid) {
      return null;
    }

    return data;
  } catch (err) {
    console.error("[inspection-firestore] getDiagnosticReport failed:", err);
    return null;
  }
}

/**
 * List diagnostic reports for a given user.
 */
export async function listDiagnosticReports(
  ownerUid: string,
  limitCount = 50
): Promise<InspectionDoc[]> {
  const db = getAdminFirestore();
  if (!db) return [];

  try {
    const snap = await db
      .collection(INSPECTIONS_COLLECTION)
      .where("owner_uid", "==", ownerUid)
      .orderBy("created_at", "desc")
      .limit(limitCount)
      .get();

    return snap.docs.map((d) => d.data() as InspectionDoc);
  } catch (err) {
    console.error("[inspection-firestore] listDiagnosticReports failed:", err);
    return [];
  }
}

/**
 * Get verify metadata by document hash from inspection_verify collection.
 * Returns null if not found.
 */
export async function getInspectionVerifyByHash(
  hash: string
): Promise<InspectionVerifyDoc | null> {
  const db = getAdminFirestore();
  if (!db) return null;

  try {
    const snap = await db.collection(INSPECTION_VERIFY_COLLECTION).doc(hash).get();
    if (!snap.exists) return null;
    return snap.data() as InspectionVerifyDoc;
  } catch (err) {
    console.error("[inspection-firestore] getInspectionVerifyByHash failed:", err);
    return null;
  }
}
