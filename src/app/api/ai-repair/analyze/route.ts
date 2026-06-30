import { NextResponse } from "next/server";
import { analyzeRepairRequest } from "@/lib/features/ai-repair/repair-router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const scope = String(body.scope || "unknown");
    const command = String(body.command || "");
    const output = String(body.output || "");

    if (!command || !output) {
      return NextResponse.json(
        { ok: false, error: "command and output are required" },
        { status: 400 },
      );
    }

    const retryCount =
      typeof body.retryCount === "number" && Number.isFinite(body.retryCount)
        ? body.retryCount
        : 0;

    const result = await analyzeRepairRequest({
      scope,
      command,
      output,
      changedFiles: Array.isArray(body.changedFiles) ? body.changedFiles : [],
      retryCount,
    });

    return NextResponse.json({
      ok: true,
      provider: process.env.AI_REPAIR_PROVIDER || "openai",
      repairId: result.repairId,
      fingerprint: result.fingerprint,
      suggestion: result.suggestion,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown AI repair error",
      },
      { status: 502 },
    );
  }
}
