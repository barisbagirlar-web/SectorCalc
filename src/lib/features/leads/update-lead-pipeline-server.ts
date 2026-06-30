import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import type { LeadPipelineUpdateInput } from "@/lib/features/leads/validate-pipeline-update";

const COLLECTION_NAME = "leadIntents";

export interface UpdateLeadPipelineResult {
 ok: boolean;
 error?: string;
 updatedAt?: string;
}

export async function updateLeadPipelineOnServer(
 input: LeadPipelineUpdateInput
): Promise<UpdateLeadPipelineResult> {
 const db = getAdminFirestore();
 if (!db) {
 return {
 ok: false,
 error:
 "Server Firestore is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON.",
 };
 }

 const updatedAt = new Date().toISOString();
 const ref = db.collection(COLLECTION_NAME).doc(input.leadId);

 try {
 const snapshot = await ref.get();
 if (!snapshot.exists) {
 return { ok: false, error: "Lead not found." };
 }

 await ref.update({
 status: input.status,
 adminNote: input.adminNote,
 updatedAt,
 });

 return { ok: true, updatedAt };
 } catch (err) {
 const message =
 err instanceof Error ? err.message : "Failed to update lead.";
 return { ok: false, error: message };
 }
}
