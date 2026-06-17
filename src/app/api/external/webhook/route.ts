import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_TIMEOUT_MS = 15_000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      userId?: string;
      toolSlug?: string;
      result?: unknown;
      webhookUrl?: string;
    };

    const { userId, toolSlug, result, webhookUrl } = body;

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json({ error: "webhookUrl gerekli" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(webhookUrl);
    } catch {
      return NextResponse.json({ error: "Geçersiz webhookUrl" }, { status: 400 });
    }

    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      return NextResponse.json({ error: "Webhook yalnızca http/https olabilir" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: toolSlug ?? null,
        result: result ?? null,
        timestamp: new Date().toISOString(),
        userId: userId ?? null,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    return NextResponse.json({ success: true, status: response.status });
  } catch {
    return NextResponse.json({ error: "Webhook gönderilemedi" }, { status: 500 });
  }
}
