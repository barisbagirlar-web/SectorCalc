export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string };

export type SanitizableMessage = {
  role: "user" | "assistant";
  content: string | ContentBlock[];
};

export function sanitizeHistory(
  messages: SanitizableMessage[]
): SanitizableMessage[] {
  const cleaned: SanitizableMessage[] = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const hasToolUse =
      msg.role === "assistant" &&
      Array.isArray(msg.content) &&
      msg.content.some((b) => b.type === "tool_use");
    if (hasToolUse) {
      const next = messages[i + 1];
      const hasToolResult =
        next?.role === "user" &&
        Array.isArray(next.content) &&
        next.content.some((b) => b.type === "tool_result");
      if (!hasToolResult) continue;
    }
    cleaned.push(msg);
  }
  return cleaned;
}

export function stripAllToolBlocks(
  messages: SanitizableMessage[]
): SanitizableMessage[] {
  return messages
    .map((msg) => {
      if (
        msg.role === "assistant" &&
        Array.isArray(msg.content) &&
        msg.content.every((b) => b.type === "tool_use")
      ) {
        return null;
      }
      if (
        msg.role === "assistant" &&
        Array.isArray(msg.content) &&
        msg.content.some((b) => b.type === "tool_use")
      ) {
        const textOnly = msg.content.filter((b) => b.type !== "tool_use");
        if (textOnly.length === 0) return null;
        return { ...msg, content: textOnly };
      }
      if (
        msg.role === "user" &&
        Array.isArray(msg.content) &&
        msg.content.some((b) => b.type === "tool_result")
      ) {
        const nonTool = msg.content.filter((b) => b.type !== "tool_result");
        if (nonTool.length === 0) return null;
        return { ...msg, content: nonTool };
      }
      return msg;
    })
    .filter(Boolean) as SanitizableMessage[];
}
