"use client";

import type { TraceChatMessage, TraceChatSendContext } from "@/components/trace/trace-chat-shared";
import {
  buildConversationPayload,
  extractToolSlug,
} from "@/components/trace/trace-chat-shared";
import type { AssistantSuggestion } from "@/lib/assistant/types";

type FreeTraceApiResponse = {
  readonly ok?: boolean;
  readonly reply?: string;
  readonly suggestions?: readonly AssistantSuggestion[];
  readonly message?: string;
};

export async function sendFreeTraceMessage(
  message: string,
  context: TraceChatSendContext,
  nextId: () => number,
): Promise<TraceChatMessage | null> {
  const conversation = [
    ...buildConversationPayload(context.messages),
    { role: "user" as const, content: message },
  ];

  const res = await fetch("/api/trace/free", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale: context.locale,
      message,
      currentPath: context.pathname,
      currentToolSlug: extractToolSlug(context.pathname),
      messages: conversation.slice(0, -1),
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as FreeTraceApiResponse;
  const reply = data.reply ?? data.message;
  if (!reply) {
    return null;
  }

  return {
    id: nextId(),
    role: "assistant",
    text: reply,
    suggestions: data.suggestions,
  };
}

type ProTraceApiResponse = {
  readonly ok?: boolean;
  readonly reply?: string;
  readonly suggestions?: readonly AssistantSuggestion[];
  readonly error?: string;
};

export async function sendProTraceMessage(
  message: string,
  context: TraceChatSendContext,
  nextId: () => number,
): Promise<{ message: TraceChatMessage | null; errorText?: string }> {
  if (!context.idToken) {
    return { message: null, errorText: "auth_required" };
  }

  const conversation = [
    ...buildConversationPayload(context.messages),
    { role: "user" as const, content: message },
  ];

  const res = await fetch("/api/trace/pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${context.idToken}`,
    },
    body: JSON.stringify({
      locale: context.locale,
      message,
      isPremium: context.isPremium,
      currentPath: context.pathname,
      currentToolSlug: extractToolSlug(context.pathname),
      messages: conversation.slice(0, -1),
    }),
  });

  if (!res.ok) {
    const data = (await res.json()) as ProTraceApiResponse;
    return { message: null, errorText: data.error ?? "request_failed" };
  }

  const data = (await res.json()) as ProTraceApiResponse;
  if (!data.reply) {
    return { message: null };
  }

  return {
    message: {
      id: nextId(),
      role: "assistant",
      text: data.reply,
      suggestions: data.suggestions,
    },
  };
}
