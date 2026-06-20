/**
 * POST /api/assistant/chat
 * DeepSeek conversational proxy (Firebase auth required).
 *
 * Guardrailed structured AI lives at POST /api/ai-gateway/customer.
 * Slug routing fallback lives at POST /api/assistant.
 */
import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildAssistantChatSystemPrompt,
  type AssistantChatRole,
} from "@/lib/assistant/chat-system-prompts";
import { checkAssistantRateLimit } from "@/lib/assistant/assistant-rate-limit";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/firebase/verify-signed-in-user";
import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

type ChatMessageInput = {
  readonly role: "user" | "assistant";
  readonly content: string;
};

type AssistantChatRequestBody = {
  readonly messages?: unknown;
  readonly role?: unknown;
  readonly locale?: unknown;
  readonly isTrace?: unknown;
};

function parseRole(value: unknown): AssistantChatRole {
  return value === "premium" ? "premium" : "free";
}

function parseLocale(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  return raw.length > 0 ? raw : "en";
}

function parseMessages(value: unknown): ChatMessageInput[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const role =
        record.role === "assistant" ? "assistant" : record.role === "user" ? "user" : null;
      const content = typeof record.content === "string" ? record.content.trim() : "";
      if (!role || !content) {
        return null;
      }
      return {
        role,
        content: content.slice(0, MAX_CONTENT_LENGTH),
      };
    })
    .filter((entry): entry is ChatMessageInput => entry !== null)
    .slice(-MAX_MESSAGES);
}

const AI_TIMEOUT_MS = 8_000;

function getDeepSeekClient(): OpenAI {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
    timeout: AI_TIMEOUT_MS,
    maxRetries: 1,
  });
}

const FALLBACK_MESSAGE: Record<SupportedLocale, string> = {
  en: "System is currently busy. Please describe your calculation need using the sector tools directly.",
  tr: "Sistem şu anda yoğun. Lütfen hesaplama ihtiyacınızı sektör araçlarıyla doğrudan tanımlayın.",
  de: "Das System ist derzeit ausgelastet. Bitte beschreiben Sie Ihren Berechnungsbedarf direkt mit den Branchentools.",
  fr: "Le système est actuellement occupé. Veuillez décrire votre besoin de calcul à l'aide des outils sectoriels.",
  es: "El sistema está ocupado actualmente. Describa su necesidad de cálculo usando las herramientas del sector directamente.",
  ar: "النظام مشغول حالياً. يرجى وصف احتياجك الحسابي باستخدام أدوات القطاع مباشرة.",
};

function fallbackResponse(locale: string): NextResponse {
  const resolved = isSupportedLocale(locale) ? locale : "en";
  return NextResponse.json({ reply: FALLBACK_MESSAGE[resolved] }, { status: 200 });
}

export async function POST(req: Request) {
  let isTrace = false;
  let locale = "en";

  try {
    let body: AssistantChatRequestBody;
    try {
      body = (await req.json()) as AssistantChatRequestBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    // ── Trace/public bypass: isTrace=true → skip Firebase auth ──
    isTrace = body.isTrace === true;
    locale = parseLocale(body.locale);
    let signedInUser: { uid: string } | null = null;

    if (isTrace) {
      if (!process.env.DEEPSEEK_API_KEY?.trim()) {
        return NextResponse.json(
          { reply: "System is currently busy; please describe your calculation need." },
          { status: 200 },
        );
      }
    } else {
      const idToken = parseBearerToken(req);
      if (!idToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      signedInUser = await verifySignedInUser(idToken);
      if (!signedInUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!isTrace && signedInUser) {
      const rateLimit = checkAssistantRateLimit(`chat:${(signedInUser as { uid: string }).uid}`);
      if (!rateLimit.ok) {
        return NextResponse.json(
          { error: "Too many requests. Please wait and try again." },
          { status: 429 },
        );
      }
    }

    const messages = parseMessages(body.messages);
    if (messages.length === 0) {
      return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
    }

    const role = parseRole(body.role);
    locale = parseLocale(body.locale);
    const client = getDeepSeekClient();
    const model = process.env.AI_ASSISTANT_CHAT_MODEL?.trim() || "deepseek-chat";

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: buildAssistantChatSystemPrompt(role, locale) },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    }

    return NextResponse.json({ reply: reply.slice(0, MAX_CONTENT_LENGTH) });
  } catch (error) {
    if (isTrace) {
      console.warn("DeepSeek trace fallback:", error instanceof Error ? error.message : "unknown");
      return fallbackResponse(locale);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Assistant chat failed." },
      { status: 502 },
    );
  }
}
