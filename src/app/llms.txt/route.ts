import { buildAiToolIndexDocument } from "@/lib/ai/build-ai-index-export";
import { buildLlmsTxt } from "@/lib/ai/build-llms-txt";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
