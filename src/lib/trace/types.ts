import type { AssistantSuggestion } from "@/lib/assistant/types";

export type TraceConversationMessage = {
  readonly role: "user" | "assistant";
  readonly content: string;
};

export type TraceFreeRequest = {
  readonly locale: string;
  readonly message: string;
  readonly currentPath?: string;
  readonly currentToolSlug?: string;
  readonly messages?: readonly TraceConversationMessage[];
};

export type TraceFreeResponse = {
  readonly ok: true;
  readonly reply: string;
  readonly suggestions: readonly AssistantSuggestion[];
  readonly modelTier: "flash" | "router";
  readonly blocked: boolean;
};

export type TraceProRequest = {
  readonly locale: string;
  readonly message: string;
  readonly userId: string;
  readonly isPremium: boolean;
  readonly currentPath?: string;
  readonly currentToolSlug?: string;
  readonly formInputs?: Record<string, unknown>;
  readonly calculationResult?: Record<string, unknown>;
  readonly messages?: readonly TraceConversationMessage[];
};

export type TraceProResponse = {
  readonly ok: true;
  readonly reply: string;
  readonly suggestions: readonly AssistantSuggestion[];
  readonly modelTier: "pro";
  readonly modelUsed?: string;
  readonly premiumSuggestion?: string;
  readonly creditConsumed: boolean;
};

export type TraceHealthResponse = {
  readonly ok: boolean;
  readonly service: "trace";
  readonly freeEnabled: boolean;
  readonly proEnabled: boolean;
  readonly deepseekConfigured: boolean;
};
