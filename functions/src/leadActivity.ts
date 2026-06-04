export const LEAD_ACTIVITY_SUBCOLLECTION = "activity";

export type LeadActivityType = "pipeline_update";

export interface LeadActivityRecord {
  type: LeadActivityType;
  leadId: string;
  actorUid: string | null;
  actorEmail: string | null;
  previousStatus: string;
  nextStatus: string;
  previousAdminNote: string;
  nextAdminNote: string;
  changedFields: string[];
  createdAt: string;
}

export interface LeadActivityInput {
  leadId: string;
  createdAt: string;
  actorUid: string | null;
  actorEmail: string | null;
  previousStatus: string;
  nextStatus: string;
  previousAdminNote: string;
  nextAdminNote: string;
  changedFields: string[];
}

export function computeChangedFields(input: {
  previousStatus: string;
  nextStatus: string;
  previousAdminNote: string;
  nextAdminNote: string;
}): string[] {
  const changed: string[] = [];

  if (input.previousStatus !== input.nextStatus) {
    changed.push("status");
  }

  if (input.previousAdminNote !== input.nextAdminNote) {
    changed.push("adminNote");
  }

  return changed;
}

export function buildLeadActivityRecord(
  input: LeadActivityInput
): LeadActivityRecord {
  return {
    type: "pipeline_update",
    leadId: input.leadId,
    actorUid: input.actorUid,
    actorEmail: input.actorEmail,
    previousStatus: input.previousStatus,
    nextStatus: input.nextStatus,
    previousAdminNote: input.previousAdminNote,
    nextAdminNote: input.nextAdminNote,
    changedFields: input.changedFields,
    createdAt: input.createdAt,
  };
}

export function readStoredStatus(data: Record<string, unknown>): string {
  const raw = data.status;
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }
  return "new";
}

export function readStoredAdminNote(data: Record<string, unknown>): string {
  const raw = data.adminNote;
  if (typeof raw === "string") {
    return raw;
  }
  return "";
}
