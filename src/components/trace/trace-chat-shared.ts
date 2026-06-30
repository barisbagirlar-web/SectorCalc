"use client";

import type { AssistantSuggestion } from "@/lib/features/assistant/types";

export type TraceChatMessage = {
  readonly id: number;
  readonly role: "user" | "assistant";
  readonly text: string;
  readonly suggestions?: readonly AssistantSuggestion[];
};

export type TraceChatSendContext = {
  readonly locale: string;
  readonly pathname: string;
  readonly messages: readonly TraceChatMessage[];
  readonly idToken?: string | null;
  readonly isPremium: boolean;
};

export function extractToolSlug(pathname: string): string {
  const match = pathname.match(/\/tools\/(?:free|premium|generated)\/([^/]+)/);
  return match?.[1] ?? "";
}

export function buildConversationPayload(messages: readonly TraceChatMessage[]) {
  return messages.map((entry) => ({
    role: entry.role,
    content: entry.text,
  }));
}
