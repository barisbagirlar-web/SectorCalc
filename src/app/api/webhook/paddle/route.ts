/**
 * SectorCalc Paddle Webhook — Compatibility Alias Route
 *
 * POST /api/webhook/paddle — CURRENT Paddle notification destination.
 *     Temporary alias that delegates to the canonical handler.
 * GET  /api/webhook/paddle — Diagnostic health check.
 *
 * CANONICAL: /api/paddle/webhook
 * After all Paddle notification destinations are updated, this file may be removed.
 *
 * All processing logic is in the shared handler at src/lib/paddle/paddle-webhook-handler.ts
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { handlePaddleWebhook } from "@/lib/paddle/paddle-webhook-handler";

export async function GET(req: NextRequest) {
  return handlePaddleWebhook(req, "api/webhook/paddle (compat)");
}

export async function POST(req: NextRequest) {
  return handlePaddleWebhook(req, "api/webhook/paddle (compat)");
}
