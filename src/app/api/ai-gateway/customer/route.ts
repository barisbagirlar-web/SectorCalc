import { NextResponse } from "next/server";
import { handleCustomerAiRequest } from "@/lib/ai-gateway/customer-ai-router";
import { checkCustomerAiRateLimit } from "@/lib/ai-gateway/customer-ai-rate-limit";
import type { CustomerAiConversationMessage } from "@/lib/ai-gateway/customer-ai-types";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/firebase/verify-signed-in-user";

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

    const idToken = parseBearerToken(req);
    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const signedInUser = await verifySignedInUser(idToken);
    if (!signedInUser) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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

    const rateLimit = checkCustomerAiRateLimit(signedInUser.uid);

    if (!rateLimit.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Your AI assistant limit for today has been reached.",
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
      isPremium: body.isPremium === true,
      messages: parseConversationMessages(body.messages),
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

function parseConversationMessages(value: unknown): CustomerAiConversationMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const role = record.role === "assistant" ? "assistant" : record.role === "user" ? "user" : null;
      const content = typeof record.content === "string" ? record.content.trim() : "";
      if (!role || !content) {
        return null;
      }
      return { role, content: content.slice(0, 1200) };
    })
    .filter((entry): entry is CustomerAiConversationMessage => entry !== null)
    .slice(-10);
}
