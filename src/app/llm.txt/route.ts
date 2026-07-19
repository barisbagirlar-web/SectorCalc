import { buildAiToolIndexDocument } from "@/lib/features/ai/build-ai-index-export";
import { buildLlmsTxt } from "@/lib/features/ai/build-llms-txt";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Alias of /llms.txt for AI agents that probe the singular filename. */
export async function GET(): Promise<Response> {
  const index = buildAiToolIndexDocument();
  const body = buildLlmsTxt(index);

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
      "x-generated-at": index.generatedAt,
    },
  });
}
