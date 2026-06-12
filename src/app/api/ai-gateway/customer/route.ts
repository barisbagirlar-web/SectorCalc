import { NextResponse } from "next/server";
import { handleCustomerAiRequest } from "@/lib/ai-gateway/customer-ai-router";
import { checkCustomerAiRateLimit } from "@/lib/ai-gateway/customer-ai-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (process.env.AI_CUSTOMER_ASSISTANT_ENABLED === "false") {
      return NextResponse.json(
        { ok: false, error: "Customer assistant is disabled." },
        { status: 403 },
      );
    }

    const body = await req.json();

    const message = String(body.message || "").trim();
    const locale = String(body.locale || "tr").trim();

    if (!message || message.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Message is required." },
        { status: 400 },
      );
    }

    const maxChars = Number(process.env.AI_CUSTOMER_MAX_INPUT_CHARS || 2000);

    if (message.length > maxChars) {
      return NextResponse.json(
        { ok: false, error: "Message is too long." },
        { status: 400 },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "local";

    const rateLimit = checkCustomerAiRateLimit(ip);

    if (!rateLimit.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            locale === "tr"
              ? "Bugünkü AI yardım hakkınız doldu."
              : "Your AI assistant limit for today has been reached.",
        },
        { status: 429 },
      );
    }

    const result = await handleCustomerAiRequest({
      locale,
      message,
      currentPath: typeof body.currentPath === "string" ? body.currentPath : "",
      currentToolSlug:
        typeof body.currentToolSlug === "string" ? body.currentToolSlug : "",
      formInputs:
        body.formInputs && typeof body.formInputs === "object" ? body.formInputs : {},
      calculationResult:
        body.calculationResult && typeof body.calculationResult === "object"
          ? body.calculationResult
          : undefined,
    });

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown customer AI error",
      },
      { status: 502 },
    );
  }
}
