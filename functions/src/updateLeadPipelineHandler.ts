import * as admin from "firebase-admin";
import type { Request, Response } from "express";
import { authorizeAdminWrite } from "./auth";
import { applyCors } from "./cors";
import { LEAD_INTENTS_COLLECTION } from "./constants";
import {
  buildLeadActivityRecord,
  computeChangedFields,
  LEAD_ACTIVITY_SUBCOLLECTION,
  readStoredAdminNote,
  readStoredStatus,
} from "./leadActivity";
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
  const db = admin.firestore();
  const ref = db.collection(LEAD_INTENTS_COLLECTION).doc(parsed.data.leadId);

  try {
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      sendJson(res, 404, { success: false, error: "Lead not found." });
      return;
    }

    const existing = snapshot.data() ?? {};
    const previousStatus = readStoredStatus(existing as Record<string, unknown>);
    const previousAdminNote = readStoredAdminNote(
      existing as Record<string, unknown>
    );
    const nextStatus = parsed.data.status;
    const nextAdminNote = parsed.data.adminNote;

    const changedFields = computeChangedFields({
      previousStatus,
      nextStatus,
      previousAdminNote,
      nextAdminNote,
    });

    const batch = db.batch();
    batch.update(ref, {
      status: nextStatus,
      adminNote: nextAdminNote,
      updatedAt,
    });

    let activityId: string | null = null;

    if (changedFields.length > 0) {
      const activityRef = ref.collection(LEAD_ACTIVITY_SUBCOLLECTION).doc();
      const activityRecord = buildLeadActivityRecord({
        leadId: parsed.data.leadId,
        createdAt: updatedAt,
        actorUid: authResult.actor.uid,
        actorEmail: authResult.actor.email,
        previousStatus,
        nextStatus,
        previousAdminNote,
        nextAdminNote,
        changedFields,
      });
      batch.set(activityRef, activityRecord);
      activityId = activityRef.id;
    }

    await batch.commit();

    sendJson(res, 200, {
      success: true,
      updatedAt,
      status: nextStatus,
      adminNote: nextAdminNote,
      changedFields,
      activityId,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update lead.";
    sendJson(res, 500, { success: false, error: message });
  }
}
