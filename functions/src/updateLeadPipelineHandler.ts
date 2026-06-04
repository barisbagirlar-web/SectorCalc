import * as admin from "firebase-admin";
import type { Request, Response } from "express";
import { authorizeAdminWrite } from "./auth";
import { applyCors } from "./cors";
import { LEAD_INTENTS_COLLECTION } from "./constants";
import { parseLeadPipelineUpdateBody } from "./validatePipelineUpdate";

if (!admin.apps.length) {
  admin.initializeApp();
}

function sendJson(
  res: Response,
  status: number,
  body: Record<string, unknown>
): void {
  res.status(status).json(body);
}

export async function handleUpdateLeadPipeline(
  req: Request,
  res: Response
): Promise<void> {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== "PATCH" && req.method !== "POST") {
    sendJson(res, 405, { success: false, error: "Method not allowed." });
    return;
  }

  const authResult = await authorizeAdminWrite(req);
  if (!authResult.ok) {
    sendJson(res, authResult.status, {
      success: false,
      error: authResult.error,
    });
    return;
  }

  const parsed = parseLeadPipelineUpdateBody(req.body);
  if (!parsed.ok) {
    sendJson(res, 400, { success: false, error: parsed.error });
    return;
  }

  const updatedAt = new Date().toISOString();
  const ref = admin
    .firestore()
    .collection(LEAD_INTENTS_COLLECTION)
    .doc(parsed.data.leadId);

  try {
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      sendJson(res, 404, { success: false, error: "Lead not found." });
      return;
    }

    await ref.update({
      status: parsed.data.status,
      adminNote: parsed.data.adminNote,
      updatedAt,
    });

    sendJson(res, 200, {
      success: true,
      updatedAt,
      status: parsed.data.status,
      adminNote: parsed.data.adminNote,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update lead.";
    sendJson(res, 500, { success: false, error: message });
  }
}
