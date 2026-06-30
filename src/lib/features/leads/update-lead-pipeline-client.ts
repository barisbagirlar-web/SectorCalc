import { getAdminLeadUpdateUrl } from "@/lib/features/admin/lead-write-config";
import type { LeadStatus } from "@/lib/features/leads/types";

export interface UpdateLeadPipelineClientInput {
 leadId: string;
 status: LeadStatus;
 adminNote: string;
 idToken: string;
}

export interface UpdateLeadPipelineClientResult {
 success: boolean;
 updatedAt?: string;
 status?: LeadStatus;
 adminNote?: string;
 error?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
 return typeof value === "object" && value !== null;
}

export async function updateLeadPipelineClient(
 input: UpdateLeadPipelineClientInput
): Promise<UpdateLeadPipelineClientResult> {
 const url = getAdminLeadUpdateUrl();

 try {
 const response = await fetch(url, {
 method: "PATCH",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${input.idToken}`,
 },
 body: JSON.stringify({
 leadId: input.leadId,
 status: input.status,
 adminNote: input.adminNote,
 }),
 });

 const payload: unknown = await response.json();

 if (!isRecord(payload)) {
 return { success: false, error: "Invalid response from update service." };
 }

 if (!response.ok || payload.success !== true) {
 const error =
 typeof payload.error === "string"
 ? payload.error
 : "Update failed.";
 return { success: false, error };
 }

 return {
 success: true,
 updatedAt:
 typeof payload.updatedAt === "string" ? payload.updatedAt : undefined,
 status:
 typeof payload.status === "string"
 ? (payload.status as LeadStatus)
 : input.status,
 adminNote:
 typeof payload.adminNote === "string"
 ? payload.adminNote
 : input.adminNote,
 };
 } catch {
 return {
 success: false,
 error: "Could not reach the update service.",
 };
 }
}
