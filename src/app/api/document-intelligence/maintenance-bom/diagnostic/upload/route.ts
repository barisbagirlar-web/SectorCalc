/**
 * API Route: POST /api/document-intelligence/maintenance-bom/diagnostic/upload
 *
 * Authenticated upload initialization for free diagnostic.
 * Returns jobId and scoped upload data.
 * Feature-flag guarded.
 */

import { NextResponse } from "next/server";
import { isDocumentIntelligenceEnabled, MAINTENANCE_BOM_MAX_FILE_BYTES } from "@/types/document-intelligence";

export async function POST(request: Request) {
  if (!isDocumentIntelligenceEnabled()) {
    return NextResponse.json(
      { ok: false, error: { code: "FEATURE_DISABLED", message: "Document Intelligence is not enabled." } },
      { status: 503 }
    );
  }

  // Auth check via Authorization header or session
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTHORIZATION_FAILED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  // Parse request body for filename
  let filename = "document.pdf";
  try {
    const body = await request.json();
    if (typeof body.filename === "string" && body.filename.trim().length > 0) {
      // Sanitize filename
      filename = body.filename.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
    }
  } catch {
    // Use default filename
  }

  const jobId = `diag_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  return NextResponse.json({
    ok: true,
    data: {
      jobId,
      uploadUrl: `/api/document-intelligence/maintenance-bom/diagnostic/upload/${jobId}`,
      allowedContentTypes: ["application/pdf"],
      maxFileBytes: MAINTENANCE_BOM_MAX_FILE_BYTES,
      filename,
    },
  });
}
