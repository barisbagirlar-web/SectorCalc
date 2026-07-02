import "server-only";

import { normalizeContent } from "@/lib/features/ai/content-sanitizer";

/**
 * Parsed message shape shared across all three route handlers.
 *
 * Every route that uses `parseConversationMessages` must define a type
 * that extends this base; the runtime shape is identical ({ role, content }),
 * but nominal typing prevents accidental cross-route type confusion.
 */
export type ParsedMessage = {
  readonly role: "user" | "assistant";
  readonly content: string;
};

/**
 * Parse and sanitize a conversation message array from an API body.
 *
 * - Rejects non-object entries silently.
 * - Normalises content via `normalizeContent`.
 * - Caps each message at 1200 characters.
 * - Returns the last 10 valid messages.
 *
 * The return type `ParsedMessage[]` is the canonical shared type.
 * Callers that need a nominal subtype must cast explicitly at the
 * call site via a branded wrapper - never via a lying generic.
 *
 * Used by free, pro and customer AI routes - single source of truth.
 */
export function parseConversationMessages(value: unknown): ParsedMessage[] {
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
        record.role === "assistant"
          ? "assistant"
          : record.role === "user"
            ? "user"
            : null;
      if (!role) {
        return null;
      }
      const content = normalizeContent(record.content);
      if (!content) {
        return null;
      }
      return { role, content: content.slice(0, 1200) } satisfies ParsedMessage;
    })
    .filter((entry): entry is ParsedMessage => entry !== null)
    .slice(-10);
}
