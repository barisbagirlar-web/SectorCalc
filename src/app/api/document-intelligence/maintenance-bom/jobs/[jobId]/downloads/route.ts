/**
 * Maintenance BOM Recovery — Downloads API
 *
 * GET /api/document-intelligence/maintenance-bom/jobs/{jobId}/downloads
 *
 * Returns short-lived signed download URLs for completed jobs.
 * Owner-only access. Never exposes source URLs directly.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getAdminFirestore, getAdminStorage } from "@/lib/infrastructure/firebase/admin";
import { MAINTENANCE_BOM_SIGNED_URL_TTL_SECONDS } from "@/types/document-intelligence";
import {
  OUTPUT_ARTIFACT_SPECS,
  artifactFilename,
  artifactStoragePath,
} from "@/lib/document-intelligence/pipeline/output-artifacts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<NextResponse> {
  try {
    // ── Authenticate ─────────────────────────────────────────────
    const token = parseBearerToken(request);
    if (!token) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
    }

    const { jobId } = await params;

    // ── Get job and verify ownership ─────────────────────────────
    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Infrastructure not available" } }, { status: 500 });
    }

    const jobRef = db.collection("documentIntelligenceJobs").doc(jobId);
    const jobSnap = await jobRef.get();

    if (!jobSnap.exists) {
      return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Job not found" } }, { status: 404 });
    }

    const job = jobSnap.data()!;

    if (job.userId !== user.uid) {
      return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 });
    }

    // ── Must be completed ────────────────────────────────────────
    if (job.status !== "completed") {
      return NextResponse.json({ ok: false, error: { code: "NOT_COMPLETED", message: `Job is in status: ${job.status}. Downloads available only when completed.` } }, { status: 400 });
    }

    // ── Check expiration ─────────────────────────────────────────
    if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
      return NextResponse.json({ ok: false, error: { code: "EXPIRED", message: "Job outputs have expired and are no longer available for download." } }, { status: 410 });
    }

    // ── Generate signed URLs ────────────────────────────────────
    const storage = getAdminStorage();
    if (!storage) {
      return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Storage not available" } }, { status: 500 });
    }

    const bucket = storage.bucket();
    const ttlSeconds = MAINTENANCE_BOM_SIGNED_URL_TTL_SECONDS;

    const downloadUrls: Array<{ filename: string; description: string; contentType: string; url: string; expiresInSeconds: number }> = [];

    for (const spec of OUTPUT_ARTIFACT_SPECS) {
      const file = bucket.file(artifactStoragePath(user.uid, jobId, spec));

      const [exists] = await file.exists();
      if (!exists) continue;

      const resolvedFilename = artifactFilename(spec, jobId);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + ttlSeconds * 1000,
        responseDisposition: `attachment; filename="${resolvedFilename}"`,
        responseType: spec.contentType,
      });

      downloadUrls.push({
        filename: resolvedFilename,
        description: spec.description,
        contentType: spec.contentType,
        url,
        expiresInSeconds: ttlSeconds,
      });
    }

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        artifacts: downloadUrls,
        expiresAt: job.expiresAt,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } }, { status: 500 });
  }
}
