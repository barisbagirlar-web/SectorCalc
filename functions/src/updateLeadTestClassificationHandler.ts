import * as admin from "firebase-admin";
import type { Request, Response } from "express";
import { authorizeAdminWrite } from "./auth";
import { applyCors } from "./cors";
import { LEAD_INTENTS_COLLECTION } from "./constants";
import {
  buildTestLeadActivityRecord,
  computeTestClassificationChangedFields,
  LEAD_ACTIVITY_SUBCOLLECTION,
  readStoredIsTestLead,
  readStoredTestLeadReason,
} from "./leadActivity";
import { parseTestClassificationUpdateBody } from "./validateTestClassificationUpdate";

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

export async function handleUpdateLeadTestClassification(
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

  const parsed = parseTestClassificationUpdateBody(req.body);
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
    const previousIsTestLead = readStoredIsTestLead(
      existing as Record<string, unknown>
    );
    const previousTestLeadReason = readStoredTestLeadReason(
      existing as Record<string, unknown>
    );
    const nextIsTestLead = parsed.data.isTestLead;
    const nextTestLeadReason = nextIsTestLead
      ? parsed.data.testLeadReason
      : "";

    const changedFields = computeTestClassificationChangedFields({
      previousIsTestLead,
      nextIsTestLead,
      previousTestLeadReason,
      nextTestLeadReason,
    });

    const batch = db.batch();
    batch.update(ref, {
      isTestLead: nextIsTestLead,
      testLeadReason: nextTestLeadReason,
      testLeadMarkedAt: updatedAt,
      testLeadMarkedByUid: authResult.actor.uid,
      testLeadMarkedByEmail: authResult.actor.email,
      updatedAt,
    });

    const activityRef = ref.collection(LEAD_ACTIVITY_SUBCOLLECTION).doc();
    const activityRecord = buildTestLeadActivityRecord({
      leadId: parsed.data.leadId,
      createdAt: updatedAt,
      actorUid: authResult.actor.uid,
      actorEmail: authResult.actor.email,
      previousIsTestLead,
      nextIsTestLead,
      previousTestLeadReason,
      nextTestLeadReason,
      changedFields:
        changedFields.length > 0 ? changedFields : ["isTestLead"],
    });
    batch.set(activityRef, activityRecord);
    const activityId = activityRef.id;

    await batch.commit();

    sendJson(res, 200, {
      success: true,
      updatedAt,
      isTestLead: nextIsTestLead,
      testLeadReason: nextTestLeadReason,
      testLeadMarkedAt: updatedAt,
      testLeadMarkedByUid: authResult.actor.uid,
      testLeadMarkedByEmail: authResult.actor.email,
      changedFields,
      activityId,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update test classification.";
    sendJson(res, 500, { success: false, error: message });
  }
}
