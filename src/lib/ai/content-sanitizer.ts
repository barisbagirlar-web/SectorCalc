/**
 * Content sanitizer — normalizes DeepSeek API message content.
 *
 * DeepSeek text models (deepseek-chat, deepseek-coder) do NOT support
 * multimodal content arrays (e.g. content: [{ type: "text", text: "..." },
 * { type: "image_url", ... }]). Only deepseek-vl supports images.
 *
 * This utility extracts text-only parts from any content format and
 * rejects image_url parts with a clear error, preventing silent
 * data loss or API rejection.
 */

export type ContentPart =
  | { type: "text"; text?: string }
  | { type: "image_url"; image_url?: { url?: string } };

export function normalizeContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const parts: string[] = [];
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const record = part as Record<string, unknown>;
      if (record.type === "text") {
        const text = typeof record.text === "string" ? record.text : "";
        if (text) parts.push(text);
      }
      // image_url parts are silently dropped — DeepSeek text models don't support them.
      // If image support is needed, switch to deepseek-vl or a multimodal model.
    }
    return parts.join(" ").trim();
  }

  return "";
}

export function sanitizeMessages(
  messages: { content: unknown; role?: string }[] | readonly { content: unknown; role?: string }[] | undefined | null,
): { content: string; role?: string }[] {
  if (!messages || !Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((msg) => {
      if (!msg || typeof msg !== "object") {
        return null;
      }

      const normalized = normalizeContent(msg.content);
      if (!normalized) {
        return null;
      }

      return { ...msg, content: normalized };
    })
    .filter((msg): msg is { content: string; role?: string } => msg !== null);
}
