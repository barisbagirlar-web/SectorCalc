import type { AiToolIndexDocument } from "@/lib/ai/tool-retrieval-types";
import {
  buildAiToolIndexDocument,
} from "@/lib/ai/build-ai-index-export";
import type { AiToolIndexRecord } from "@/lib/ai/tool-retrieval-types";

let cachedDocument: AiToolIndexDocument | null = null;

export function getAiToolIndexDocument(): AiToolIndexDocument {
  if (!cachedDocument) {
    cachedDocument = buildAiToolIndexDocument();
  }
  return cachedDocument;
}

export function listAiToolIndexRecords(): readonly AiToolIndexRecord[] {
  return getAiToolIndexDocument().tools;
}

export function getAiToolIndexRecord(slug: string): AiToolIndexRecord | undefined {
  return listAiToolIndexRecords().find((tool) => tool.slug === slug);
}

export function resetAiToolIndexCache(): void {
  cachedDocument = null;
}
