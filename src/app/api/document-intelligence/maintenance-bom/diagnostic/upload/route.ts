/**
 * API Route: POST /api/document-intelligence/maintenance-bom/diagnostic/upload
 *
 * Authenticated diagnostic intake. Creates a persistent job record in
 * Firestore (`documentIntelligenceJobs/{jobId}`) in `diagnostic_eligible`
 * state so it can subsequently be checked out and processed.
 *
 * NOTE: Real byte-level PDF eligibility scanning is performed by the
 * extraction provider once configured. Until then the diagnostic accepts
 * native-PDF metadata (type + size) and records an eligible job. The feature
 * flag gates public exposure.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import {
  isDocumentIntelligenceEnabled,
  MAINTENANCE_BOM_MAX_FILE_BYTES,
  MAINTENANCE_BOM_PRICE_CREDITS,
  getProductVersion,
} from "@/types/document-intelligence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isDocumentIntelligenceEnabled()) {
    return NextResponse.json(
      { ok: false, error: { code: "FEATURE_DISABLED", message: "Document Intelligence is not enabled." } },
      { status: 503 },
    );
  }

  // ── Authenticate ───────────────────────────────────────────────
  const token = parseBearerToken(request);
  if (!token) {
    return NextResponse.json({ ok: false, error: { code: "AUTHORIZATION_FAILED", message: "Authentication required." } }, { status: 401 });
  }
  const user = await verifySignedInUser(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: "AUTHORIZATION_FAILED", message: "Authentication required." } }, { status: 401 });
  }

  // ── Parse + validate input metadata ────────────────────────────
  let filename = "document.pdf";
  let fileSizeBytes = 0;
  let mimeType = "application/pdf";
  try {
    const body = await request.json();
    if (typeof body.filename === "string" && body.filename.trim().length > 0) {
      filename = body.filename.trim();
    }
    if (typeof body.fileSizeBytes === "number" && Number.isFinite(body.fileSizeBytes)) {
      fileSizeBytes = Math.max(0, Math.floor(body.fileSizeBytes));
    }
    if (typeof body.mimeType === "string" && body.mimeType.trim().length > 0) {
      mimeType = body.mimeType.trim();
    }
  } catch {
    /* defaults */
  }

  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);

  const rejectionReasons: string[] = [];
  if (mimeType !== "application/pdf") {
    rejectionReasons.push("Only native digital PDF documents are supported (v1).");
  }
  if (fileSizeBytes > MAINTENANCE_BOM_MAX_FILE_BYTES) {
    rejectionReasons.push(`File exceeds the ${Math.round(MAINTENANCE_BOM_MAX_FILE_BYTES / (1024 * 1024))} MB limit.`);
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Infrastructure not available" } }, { status: 500 });
  }

  const jobId = `mbom_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const nowIso = new Date().toISOString();
  const eligible = rejectionReasons.length === 0;
  const status = eligible ? "diagnostic_eligible" : "diagnostic_rejected";
  const diagnosticStatus = eligible ? "eligible" : "rejected";

  const jobRef = db.collection("documentIntelligenceJobs").doc(jobId);
  await jobRef.set({
    jobId,
    userId: user.uid,
    status,
    diagnosticStatus,
    paymentStatus: "unpaid",
    entitlementStatus: "none",
    originalFilename: filename,
    originalFilenameSanitized: sanitizedFilename,
    mimeType,
    fileSizeBytes,
    priceCredits: MAINTENANCE_BOM_PRICE_CREDITS,
    engineVersion: getProductVersion(),
    rejectionReasons,
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  await jobRef.collection("events").add({
    type: "diagnostic_completed",
    toStatus: status,
    actor: "diagnostic",
    timestamp: nowIso,
    eligible,
  });

  return NextResponse.json({
    ok: true,
    data: {
      jobId,
      status,
      diagnosticStatus,
      eligible,
      rejectionReasons,
      priceCredits: MAINTENANCE_BOM_PRICE_CREDITS,
      maxFileBytes: MAINTENANCE_BOM_MAX_FILE_BYTES,
      filename: sanitizedFilename,
    },
  });
}
