/**
 * API Route: GET /api/document-intelligence/health
 *
 * Feature-flag aware health check for Document Intelligence.
 */

import { NextResponse } from "next/server";
import { isDocumentIntelligenceEnabled } from "@/types/document-intelligence";

export async function GET() {
  if (!isDocumentIntelligenceEnabled()) {
    return NextResponse.json(
      { ok: false, error: { code: "FEATURE_DISABLED", message: "Document Intelligence is not enabled." } },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      enabled: true,
      product: "maintenance_bom_recovery_v1",
      version: process.env.MAINTENANCE_BOM_ENGINE_VERSION ?? "1.0.0",
    },
  });
}
