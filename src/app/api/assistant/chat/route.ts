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

function getDeepSeekClient(): OpenAI {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });
}

export async function POST(req: Request) {
  try {
    const idToken = parseBearerToken(req);
    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signedInUser = await verifySignedInUser(idToken);
    if (!signedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = checkAssistantRateLimit(`chat:${signedInUser.uid}`);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait and try again." },
        { status: 429 },
      );
    }

    let body: AssistantChatRequestBody;
    try {
      body = (await req.json()) as AssistantChatRequestBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const messages = parseMessages(body.messages);
    if (messages.length === 0) {
      return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
    }

    const role = parseRole(body.role);
    const locale = parseLocale(body.locale);
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Assistant chat failed." },
      { status: 502 },
    );
  }
}
