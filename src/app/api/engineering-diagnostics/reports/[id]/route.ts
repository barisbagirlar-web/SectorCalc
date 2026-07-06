/**
 * GET /api/engineering-diagnostics/reports/[id]
 *
 * Returns a single diagnostic report by report_id.
 * Auth: Bearer <Firebase ID token> (required for owner-protected reports)
 *
 * Response: { ok: true, report: InspectionDoc }
 *            { ok: false, error: "not_found" | "forbidden" }
 */

import { NextResponse } from "next/server";
import {
  getDiagnosticReport,
  getUidFromRequest,
} from "@/lib/inspection/inspection-firestore-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const uid = await getUidFromRequest(req);
    const report = await getDiagnosticReport(id, uid);

    if (!report) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, report });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
