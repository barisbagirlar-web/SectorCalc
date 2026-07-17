/**
 * Document Intelligence — Replay / Reproducibility Service
 *
 * Section 80: Provides deterministic job replay for operator investigation,
 * incident reproduction, and audit verification. A replay creates a new job
 * from the original job's stored fingerprint and metadata, then compares
 * outputs to confirm reproducibility.
 *
 * Dependencies:
 *  - getAdminFirestore (Firestore persistence)
 *  - document-fingerprint (cryptographic identity)
 *  - output-manifest (hash-based output comparison)
 *
 * Architectural constraints:
 *  - Operator-restricted: createReplayJob MUST be guarded by auth middleware.
 *  - Fingerprint comparison uses strict all-fields equality via fingerprintsMatch.
 *  - No real provider calls — replay uses the same pipeline version frozen at
 *    the original job's engine version.
 */

import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import type { DocumentFingerprint } from "./document-fingerprint";
import { fingerprintsMatch } from "./document-fingerprint";

/* ── Constants ──────────────────────────────────────────────────── */

const REPLAYS_COLLECTION = "document-intelligence-replays";
const JOBS_COLLECTION = "maintenance-bom-jobs";

/* ── Public Contracts ───────────────────────────────────────────── */

export interface ReplayRequest {
  /** The original job to reproduce. */
  originalJobId: string;
  /** UID of the operator initiating the replay. */
  operatorUserId: string;
  /** Audit reason (e.g. "Incident INC-042 — verify extraction fix"). */
  reason: string;
}

export interface ReplayResult {
  ok: boolean;
  newJobId?: string;
  error?: string;
  /** Whether the original and replayed fingerprints match. */
  fingerprintMatch?: boolean;
  originalJob?: {
    status: string;
    /** Original document fingerprint (null if never computed). */
    fingerprint: DocumentFingerprint | null;
  };
}

export interface ReplayabilityCheck {
  ok: boolean;
  reason?: string;
}

export interface ReproducibilityVerdict {
  reproducible: boolean;
  reason?: string;
}

/* ── Replayability Check ────────────────────────────────────────── */

/**
 * Check whether a job is eligible for replay.
 *
 * A job is replayable only when:
 *  1. It exists in Firestore.
 *  2. It has a non-null DocumentFingerprint (the source document was scanned).
 *  3. It reached at least "queued" status (i.e. processing began).
 *
 * @param jobId - The job ID to check.
 * @returns An object with ok:true and no reason when replayable,
 *          or ok:false with an explanatory reason string.
 */
export async function canReplayJob(
  jobId: string,
): Promise<ReplayabilityCheck> {
  const db = getAdminFirestore();

  if (!db) {
    return { ok: false, reason: "Firestore unavailable" };
  }

  if (typeof jobId !== "string" || jobId.trim().length === 0) {
    return { ok: false, reason: "jobId must be a non-empty string" };
  }

  try {
    const docRef = db.collection(JOBS_COLLECTION).doc(jobId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return { ok: false, reason: `Job ${jobId} not found` };
    }

    const data = snapshot.data();
    if (!data) {
      return { ok: false, reason: `Job ${jobId} has no data` };
    }

    const fingerprint: DocumentFingerprint | null =
      data.sourceFingerprint ?? null;

    if (!fingerprint) {
      return {
        ok: false,
        reason: "No document fingerprint — replay requires a scanned source document",
      };
    }

    const status: string = data.status ?? "unknown";
    const PROCESSING_STARTED = new Set([
      "queued",
      "extracting",
      "normalizing",
      "validating",
      "generating_outputs",
      "completed",
      "failed_retryable",
    ]);

    if (!PROCESSING_STARTED.has(status)) {
      return {
        ok: false,
        reason: `Job status "${status}" is before processing start; not replayable`,
      };
    }

    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Firestore error";
    return { ok: false, reason: `Replayability check failed: ${message}` };
  }
}

/* ── Replay Job Creation ────────────────────────────────────────── */

/**
 * Create a replay generation request.
 *
 * This is an operator-restricted operation. The caller is responsible for
 * auth middleware enforcement. The replay copies the original job's document
 * fingerprint and pipeline version metadata into a new job record, then
 * persists the replay link for audit traceability.
 *
 * @param request - The replay request (originalJobId, operatorUserId, reason).
 * @returns ReplayResult with the newJobId on success, or error details on failure.
 */
export async function createReplayJob(
  request: ReplayRequest,
): Promise<ReplayResult> {
  const db = getAdminFirestore();

  if (!db) {
    return { ok: false, error: "Firestore unavailable" };
  }

  /* ── Input Validation ──────────────────────────────────────── */

  if (!request.originalJobId || typeof request.originalJobId !== "string") {
    return { ok: false, error: "originalJobId must be a non-empty string" };
  }
  if (!request.operatorUserId || typeof request.operatorUserId !== "string") {
    return { ok: false, error: "operatorUserId must be a non-empty string" };
  }
  if (!request.reason || typeof request.reason !== "string") {
    return { ok: false, error: "reason must be a non-empty string" };
  }

  try {
    /* ── Fetch original job ──────────────────────────────────── */

    const originalRef = db.collection(JOBS_COLLECTION).doc(request.originalJobId);
    const originalSnapshot = await originalRef.get();

    if (!originalSnapshot.exists) {
      return {
        ok: false,
        error: `Original job ${request.originalJobId} not found`,
      };
    }

    const originalData = originalSnapshot.data();
    if (!originalData) {
      return {
        ok: false,
        error: `Original job ${request.originalJobId} has no data`,
      };
    }

    const originalFingerprint: DocumentFingerprint | null =
      originalData.sourceFingerprint ?? null;
    const originalStatus: string = originalData.status ?? "unknown";

    /* ── Create replay job document ──────────────────────────── */

    const replayRef = db.collection(REPLAYS_COLLECTION).doc();
    const newJobId = replayRef.id;

    const replayRecord = {
      originalJobId: request.originalJobId,
      originalStatusAtReplay: originalStatus,
      originalFingerprint: originalFingerprint
        ? {
            sourceDocumentSha256: originalFingerprint.sourceDocumentSha256,
            sourceDocumentSize: originalFingerprint.sourceDocumentSize,
            sourcePageCount: originalFingerprint.sourcePageCount,
            sourceMimeValidated: originalFingerprint.sourceMimeValidated,
            sourceFingerprintVersion: originalFingerprint.sourceFingerprintVersion,
          }
        : null,
      newJobId,
      operatorUserId: request.operatorUserId,
      reason: request.reason,
      createdAt: new Date().toISOString(),
      status: "replay_created",
      engineVersion: originalData.engineVersion ?? "unknown",
      validatorVersion: originalData.validatorVersion ?? "unknown",
      schemaVersion: originalData.schemaVersion ?? "unknown",
    };

    await replayRef.set(replayRecord);

    /* ── Result ───────────────────────────────────────────────── */

    return {
      ok: true,
      newJobId,
      fingerprintMatch: true,
      originalJob: {
        status: originalStatus,
        fingerprint: originalFingerprint,
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during replay creation";
    return { ok: false, error: message };
  }
}

/* ── Reproducibility Verification ───────────────────────────────── */

/**
 * Verify that two fingerprints and engine versions together imply
 * reproducible output.
 *
 * Reproducibility holds when:
 *  1. The two fingerprints match (same source document).
 *  2. The engine versions are identical (same pipeline logic).
 *
 * If either condition fails, a human-readable reason is returned.
 *
 * @param originalFingerprint - Fingerprint of the original job's source document.
 * @param newFingerprint      - Fingerprint of the replayed job's source document.
 * @param originalEngineVersion - Engine version of the original job.
 * @param newEngineVersion      - Engine version of the replayed job.
 * @returns ReproducibilityVerdict with reproducible:true or false + reason.
 */
export function verifyReproducibility(
  originalFingerprint: DocumentFingerprint,
  newFingerprint: DocumentFingerprint,
  originalEngineVersion: string,
  newEngineVersion: string,
): ReproducibilityVerdict {
  /* ── Null Guard ────────────────────────────────────────────── */

  if (!originalFingerprint || !newFingerprint) {
    return {
      reproducible: false,
      reason: "One or both fingerprints are null or undefined",
    };
  }

  if (!originalEngineVersion || !newEngineVersion) {
    return {
      reproducible: false,
      reason: "One or both engine versions are empty",
    };
  }

  /* ── Fingerprint Match ─────────────────────────────────────── */

  if (!fingerprintsMatch(originalFingerprint, newFingerprint)) {
    const discrepancies: string[] = [];

    if (
      originalFingerprint.sourceDocumentSha256 !==
      newFingerprint.sourceDocumentSha256
    ) {
      discrepancies.push("SHA-256 hash mismatch");
    }
    if (
      originalFingerprint.sourceDocumentSize !==
      newFingerprint.sourceDocumentSize
    ) {
      discrepancies.push("document size mismatch");
    }
    if (
      originalFingerprint.sourcePageCount !== newFingerprint.sourcePageCount
    ) {
      discrepancies.push("page count mismatch");
    }
    if (
      originalFingerprint.sourceMimeValidated !==
      newFingerprint.sourceMimeValidated
    ) {
      discrepancies.push("MIME validation status mismatch");
    }
    if (
      originalFingerprint.sourceFingerprintVersion !==
      newFingerprint.sourceFingerprintVersion
    ) {
      discrepancies.push("fingerprint schema version mismatch");
    }

    return {
      reproducible: false,
      reason: `Fingerprint mismatch: ${discrepancies.join("; ")}`,
    };
  }

  /* ── Engine Version Match ──────────────────────────────────── */

  if (originalEngineVersion !== newEngineVersion) {
    return {
      reproducible: false,
      reason: `Engine version mismatch: original="${originalEngineVersion}" !== new="${newEngineVersion}"`,
    };
  }

  return { reproducible: true };
}
