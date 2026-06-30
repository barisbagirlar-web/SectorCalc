/**
 * GET /api/trace/health
 */
import { NextResponse } from "next/server";
import type { TraceHealthResponse } from "@/lib/trace/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const payload: TraceHealthResponse = {
    ok: true,
    service: "trace",
    freeEnabled: process.env.TRACE_FREE_ENABLED !== "false",
    proEnabled: process.env.TRACE_PRO_ENABLED !== "false",
    deepseekConfigured: Boolean(process.env.DEEPSEEK_API_KEY?.trim()),
  };

  return NextResponse.json(payload, { status: 200 });
}
