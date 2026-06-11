/**
 * POST /api/assistant
 * Deterministic, guardrailed SectorCalc assistant (P10).
 *
 * No external AI, no calculation, no secrets. Returns structured topic +
 * suggestions; the client renders localized copy.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { respond } from "@/lib/assistant/respond";
import type { AssistantRequestBody } from "@/lib/assistant/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1000;

export async function POST(request: NextRequest) {
  let body: AssistantRequestBody;
  try {
    body = (await request.json()) as AssistantRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Request body must be JSON." },
      { status: 400 }
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { ok: false, error: "empty_message", message: "A non-empty message is required." },
      { status: 400 }
    );
  }

  const safeMessage = message.slice(0, MAX_MESSAGE_LENGTH);
  const result = respond(safeMessage);

  return NextResponse.json({ ok: true, result }, { status: 200 });
}
