/**
 * DISABLED — not under src/app/api (avoids Firebase Hosting Cloud Function deploy).
 * Re-enable: copy to src/app/api/admin/leads/[leadId]/route.ts when Functions API is on.
 */
import { NextResponse } from "next/server";
import {
 isAdminServerUpdatesEnabled,
 verifyAdminLeadUpdateSecret,
} from "@/lib/admin/server-guard";
import { updateLeadPipelineOnServer } from "@/lib/leads/update-lead-pipeline-server";
import { parseLeadPipelineUpdateBody } from "@/lib/leads/validate-pipeline-update";

interface RouteContext {
 params: Promise<{ leadId: string }>;
}

export async function PATCH(
 request: Request,
 context: RouteContext
): Promise<NextResponse> {
 if (!isAdminServerUpdatesEnabled()) {
 return NextResponse.json(
 { ok: false, error: "Admin updates are disabled." },
 { status: 403 }
 );
 }

 if (!verifyAdminLeadUpdateSecret(request)) {
 return NextResponse.json(
 { ok: false, error: "Unauthorized." },
 { status: 401 }
 );
 }

 const { leadId } = await context.params;

 let body: unknown;
 try {
 body = await request.json();
 } catch {
 return NextResponse.json(
 { ok: false, error: "Invalid JSON body." },
 { status: 400 }
 );
 }

 const parsed = parseLeadPipelineUpdateBody(leadId, body);
 if (!parsed.ok) {
 return NextResponse.json(
 { ok: false, error: parsed.error },
 { status: 400 }
 );
 }

 const result = await updateLeadPipelineOnServer(parsed.data);
 if (!result.ok) {
 const status = result.error === "Lead not found." ? 404 : 503;
 return NextResponse.json(
 { ok: false, error: result.error ?? "Update failed." },
 { status }
 );
 }

 return NextResponse.json({
 ok: true,
 updatedAt: result.updatedAt,
 status: parsed.data.status,
 adminNote: parsed.data.adminNote,
 });
}
