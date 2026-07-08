/**
 * SectorCalc Paddle Webhook — Canonical Route
 *
 * POST /api/paddle/webhook — Paddle notification destination.
 * GET  /api/paddle/webhook — Diagnostic health check.
 *
 * All processing logic is in the shared handler at src/lib/paddle/paddle-webhook-handler.ts
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { handlePaddleWebhook } from "@/lib/paddle/paddle-webhook-handler";

export async function GET(req: NextRequest) {
  return handlePaddleWebhook(req, "api/paddle/webhook");
}

export async function POST(req: NextRequest) {
  return handlePaddleWebhook(req, "api/paddle/webhook");
}
