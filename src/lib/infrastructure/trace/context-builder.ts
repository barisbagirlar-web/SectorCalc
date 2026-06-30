import "server-only";

import type { TraceConversationMessage, TraceFreeRequest, TraceProRequest } from "@/lib/infrastructure/trace/types";

export type TraceRequestContext = {
  readonly locale: string;
  readonly message: string;
  readonly currentPath: string;
  readonly currentToolSlug: string;
  readonly recentMessages: readonly TraceConversationMessage[];
};

export function buildTraceContextFromFreeRequest(
  request: TraceFreeRequest,
): TraceRequestContext {
  return {
    locale: request.locale,
    message: request.message.trim(),
    currentPath: request.currentPath?.trim() ?? "",
    currentToolSlug: request.currentToolSlug?.trim() ?? "",
    recentMessages: sanitizeMessages(request.messages),
  };
}

export function buildTraceContextFromProRequest(
  request: TraceProRequest,
): TraceRequestContext {
  return {
    locale: request.locale,
    message: request.message.trim(),
    currentPath: request.currentPath?.trim() ?? "",
    currentToolSlug: request.currentToolSlug?.trim() ?? "",
    recentMessages: sanitizeMessages(request.messages),
  };
}

function sanitizeMessages(
  messages: readonly TraceConversationMessage[] | undefined,
): readonly TraceConversationMessage[] {
  if (!messages?.length) {
    return [];
  }

  return messages
    .filter(
      (entry) =>
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string" &&
        entry.content.trim().length > 0,
    )
    .map((entry) => ({
      role: entry.role,
      content: entry.content.trim().slice(0, 1200),
    }))
    .slice(-10);
}

export function serializeTraceContext(context: TraceRequestContext): string {
  return JSON.stringify(
    {
      locale: context.locale,
      currentPath: context.currentPath,
      currentToolSlug: context.currentToolSlug,
      recentTurns: context.recentMessages,
    },
    null,
    2,
  );
}
