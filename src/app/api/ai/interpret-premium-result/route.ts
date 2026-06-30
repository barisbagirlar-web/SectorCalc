import { NextResponse } from "next/server";
import { generateEngineeringInterpretation } from "@/lib/features/ai/engineering-interpretation/client";
import type { InterpretPremiumResultRequest } from "@/lib/features/ai/engineering-interpretation/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_INPUTS = 50;
const MAX_OUTPUTS = 30;
const MAX_TOOL_NAME_LENGTH = 200;

export async function POST(req: Request) {
  try {
    if (process.env.DEEPSEEK_API_KEY === undefined || process.env.DEEPSEEK_API_KEY === "") {
      return NextResponse.json(
        {
          ok: false,
          error: "AI interpretation is not configured.",
          fallbackMessage: "Engineering interpretation is not available at this time.",
        },
        { status: 503 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON body.", fallbackMessage: "Request error." },
        { status: 400 },
      );
    }

    const raw = body as Record<string, unknown>;

    if (typeof raw.toolId !== "string" || !raw.toolId.trim()) {
      return NextResponse.json(
        { ok: false, error: "Missing toolId.", fallbackMessage: "Request error." },
        { status: 400 },
      );
    }

    const request: InterpretPremiumResultRequest = {
      toolId: raw.toolId.trim(),
      toolName:
        typeof raw.toolName === "string"
          ? raw.toolName.trim().slice(0, MAX_TOOL_NAME_LENGTH)
          : raw.toolId.trim(),
      sectorSlug: typeof raw.sectorSlug === "string" ? raw.sectorSlug.trim() : "general",
      locale: typeof raw.locale === "string" ? raw.locale.trim() : "en",
      inputs: sanitizeInputs(raw.inputs),
      outputs: sanitizeOutputs(raw.outputs),
      verdict: typeof raw.verdict === "string" ? raw.verdict.trim() : undefined,
      bigNumber: sanitizeBigNumber(raw.bigNumber),
    };

    const result = await generateEngineeringInterpretation(request);

    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        fallbackMessage: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}

function sanitizeInputs(inputs: unknown): Record<string, string | number | boolean> {
  if (!inputs || typeof inputs !== "object") return {};
  const record: Record<string, string | number | boolean> = {};
  const raw = inputs as Record<string, unknown>;
  let count = 0;
  for (const [key, value] of Object.entries(raw)) {
    if (count >= MAX_INPUTS) break;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      record[key] = value;
      count += 1;
    } else if (value !== null && value !== undefined) {
      record[key] = String(value);
      count += 1;
    }
  }
  return record;
}

function sanitizeOutputs(
  outputs: unknown,
): Array<{ id: string; label: string; value: string; unit?: string }> {
  if (!Array.isArray(outputs)) return [];
  return outputs.slice(0, MAX_OUTPUTS).map((item: unknown) => {
    const raw = item as Record<string, unknown>;
    return {
      id: String(raw.id ?? ""),
      label: String(raw.label ?? ""),
      value: String(raw.value ?? ""),
      unit: typeof raw.unit === "string" ? raw.unit : undefined,
    };
  });
}

function sanitizeBigNumber(
  bigNumber: unknown,
): { label: string; value: string } | undefined {
  if (!bigNumber || typeof bigNumber !== "object") return undefined;
  const raw = bigNumber as Record<string, unknown>;
  const label = String(raw.label ?? "").trim();
  const value = String(raw.value ?? "").trim();
  if (!label || !value) return undefined;
  return { label, value };
}
