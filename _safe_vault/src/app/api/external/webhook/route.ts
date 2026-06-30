import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

function isAllowedWebhookUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.has(hostname)) {
      return false;
    }
    if (
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      toolSlug?: string;
      result?: unknown;
      webhookUrl?: string;
    };

    const webhookUrl = typeof body.webhookUrl === "string" ? body.webhookUrl.trim() : "";
    if (!webhookUrl) {
      return NextResponse.json({ error: "webhookUrl gerekli" }, { status: 400 });
    }
    if (!isAllowedWebhookUrl(webhookUrl)) {
      return NextResponse.json({ error: "Geçersiz webhook URL" }, { status: 400 });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: body.toolSlug ?? null,
        result: body.result ?? null,
        timestamp: new Date().toISOString(),
        userId: body.userId ?? null,
        source: "sectorcalc",
      }),
    });

    return NextResponse.json({ success: true, status: response.status });
  } catch {
    return NextResponse.json({ error: "Webhook gönderilemedi" }, { status: 500 });
  }
}
