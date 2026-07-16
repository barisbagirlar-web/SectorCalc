/**
 * Admin — Document Intelligence Health & Status
 *
 * GET /api/document-intelligence/admin/health
 *
 * Returns system status, provider health, queue depth, and job counts.
 * Admin-only. Requires authenticated admin role.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function assertAdminRole(uid: string): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;
  const userDoc = await db.collection("users").doc(uid).get();
  const data = userDoc.data();
  return data?.role === "admin" || data?.role === "owner";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = parseBearerToken(request);
  if (!token) {
    return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
  }

  const user = await verifySignedInUser(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
  }

  const isAdmin = await assertAdminRole(user.uid);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Admin role required" } }, { status: 403 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Infrastructure not available" } }, { status: 500 });
  }

  try {
    // Count jobs by status
    const statusCounts: Record<string, number> = {};
    const snapshot = await db.collection("documentIntelligenceJobs").get();
    snapshot.forEach((doc) => {
      const status = doc.data().status || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Stuck jobs: in a processing state for > 30 minutes
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const stuckSnapshot = await db
      .collection("documentIntelligenceJobs")
      .where("status", "in", ["extracting", "normalizing", "validating", "generating_outputs", "queued"])
      .where("updatedAt", "<", thirtyMinAgo)
      .limit(20)
      .get();

    return NextResponse.json({
      ok: true,
      data: {
        featureEnabled: process.env.DOCUMENT_INTELLIGENCE_ENABLED === "true",
        engineVersion: process.env.MAINTENANCE_BOM_ENGINE_VERSION || "1.0.0",
        jobCounts: statusCounts,
        stuckJobCount: stuckSnapshot.size,
        stuckJobIds: stuckSnapshot.docs.map((d) => d.id),
        provider: process.env.DOCUMENT_PROCESSOR_PROVIDER || "mock",
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to query health" } }, { status: 500 });
  }
}
