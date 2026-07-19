import { buildLlmsFullTxt } from "@/lib/features/ai/build-llms-full-txt";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(): Response {
  const body = buildLlmsFullTxt();

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
      "x-generated-at": new Date().toISOString(),
    },
  });
}
