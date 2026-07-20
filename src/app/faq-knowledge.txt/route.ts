import { getFaqEntries } from "@/lib/features/ai/ai-knowledge-base";
import { SITE_URL } from "@/lib/features/semantic/site-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildFaqTxt(): string {
  const lines: string[] = [];
  lines.push("# SectorCalc - FAQ Knowledge Base");
  lines.push(`# Site: ${SITE_URL}`);
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push("# Language: English (en)");
  lines.push("");

  for (const entry of getFaqEntries()) {
    lines.push(`## ${entry.question}`);
    lines.push(entry.answer);
    lines.push("");
  }

  lines.push("## Disclaimer");
  lines.push(
    "SectorCalc outputs are technical estimates based on stated assumptions and are not financial, legal, medical or engineering advice. Verify before business decisions.",
  );

  return lines.join("\n");
}

export async function GET(): Promise<Response> {
  const body = buildFaqTxt();

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, must-revalidate",
    },
  });
}
