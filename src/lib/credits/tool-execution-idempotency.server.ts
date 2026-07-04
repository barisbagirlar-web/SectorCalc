import "server-only";

import { createHash, randomUUID } from "node:crypto";

export function createExecutionIdempotencyKey(input: {
  userId: string;
  toolKey: string;
  usageSessionId: string;
  clientRequestId?: string | null;
  rawInputs: unknown;
  selectedUnits: unknown;
}): string {
  if (input.clientRequestId && input.clientRequestId.trim()) {
    return [
      "tool-exec",
      input.userId,
      input.toolKey,
      input.usageSessionId,
      input.clientRequestId.trim(),
    ].join(":");
  }

  const hash = createHash("sha256")
    .update(
      JSON.stringify({
        userId: input.userId,
        toolKey: input.toolKey,
        usageSessionId: input.usageSessionId,
        rawInputs: input.rawInputs,
        selectedUnits: input.selectedUnits,
      }),
    )
    .digest("hex");

  return ["tool-exec", input.userId, input.toolKey, input.usageSessionId, hash].join(":");
}

export function createClientRequestId(): string {
  return randomUUID();
}
