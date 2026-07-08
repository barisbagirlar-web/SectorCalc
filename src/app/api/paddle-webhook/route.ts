/**
 * SectorCalc Paddle Webhook — Legacy Route (redirects to shared handler)
 *
 * POST /api/paddle-webhook — Legacy Paddle webhook path (kept for backward compat).
 * GET  /api/paddle-webhook — Diagnostic health check.
 *
 * This route now delegates to the canonical shared handler.
 * CANONICAL: /api/paddle/webhook
 * COMPAT:    /api/webhook/paddle
 *
 * All processing logic lives in src/lib/paddle/paddle-webhook-handler.ts
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { handlePaddleWebhook } from "@/lib/paddle/paddle-webhook-handler";

export async function GET(req: NextRequest) {
  return handlePaddleWebhook(req, "api/paddle-webhook (legacy)");
}

export async function POST(req: NextRequest) {
  return handlePaddleWebhook(req, "api/paddle-webhook (legacy)");
}
