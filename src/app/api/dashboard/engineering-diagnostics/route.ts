/**
 * GET /api/dashboard/engineering-diagnostics
 *
 * Returns the authenticated user's diagnostic reports list.
 * Auth: Bearer <Firebase ID token> (required)
 *
 * Response: { ok: true, reports: InspectionDoc[] }
 */

import { NextResponse } from "next/server";
import {
  listDiagnosticReports,
  getUidFromRequest,
} from "@/lib/inspection/inspection-firestore-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const uid = await getUidFromRequest(req);

    if (!uid) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const reports = await listDiagnosticReports(uid);

    return NextResponse.json({
      ok: true,
      reports: reports.map((r) => ({
        report_id: r.report_id,
        domain: (r.domain_section as { label?: string }).label ?? "",
        decision: (r.decision_section as { decision?: string }).decision ?? "",
        risk_score: (r.decision_section as { total_risk_score?: number }).total_risk_score ?? 0,
        created_at: r.created_at,
        report_hash: r.report_hash,
      })),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
