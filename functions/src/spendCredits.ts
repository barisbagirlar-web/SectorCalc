import type { Request, Response } from "express";
import { authorizeSignedInUser } from "./userAuth";
import { applyCors } from "./cors";
import { deductUserCredits } from "./creditPersistence";

interface SpendCreditsRequestBody {
  amount?: number;
  toolSlug?: string;
}

function sendJson(res: Response, status: number, body: Record<string, unknown>): void {
  res.status(status).json(body);
}

export async function handleSpendCredits(req: Request, res: Response): Promise<void> {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, error: "Method not allowed." });
    return;
  }

  const authResult = await authorizeSignedInUser(req);
  if (!authResult.ok) {
    sendJson(res, authResult.status, { success: false, error: authResult.error });
    return;
  }

  const body = (req.body ?? {}) as SpendCreditsRequestBody;
  const amount =
    typeof body.amount === "number" && Number.isFinite(body.amount)
      ? Math.floor(body.amount)
      : 1;

  if (amount <= 0) {
    sendJson(res, 400, { success: false, error: "Invalid credit amount." });
    return;
  }

  const toolSlug =
    typeof body.toolSlug === "string" && body.toolSlug.trim().length > 0
      ? body.toolSlug.trim()
      : undefined;

  try {
    const deducted = await deductUserCredits(authResult.uid, amount, { toolSlug });
    if (!deducted) {
      sendJson(res, 402, {
        success: false,
        error: "Insufficient credits.",
        code: "INSUFFICIENT_CREDITS",
      });
      return;
    }

    sendJson(res, 200, { success: true, spent: amount });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to spend credits.";
    sendJson(res, 500, { success: false, error: message });
  }
}
