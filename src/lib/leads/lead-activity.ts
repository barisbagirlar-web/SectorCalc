import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { getLeadStatusLabel, isLeadStatus } from "@/lib/leads/lead-pipeline";
import type { LeadStatus } from "@/lib/leads/types";

const ACTIVITY_SUBCOLLECTION = "activity";
const LEAD_INTENTS_COLLECTION = "leadIntents";

export interface LeadActivityEntry {
  id: string;
  leadId: string;
  createdAt: string;
  type: "pipeline_update";
  actorUid: string | null;
  actorEmail: string | null;
  previousStatus: LeadStatus;
  nextStatus: LeadStatus;
  previousAdminNote: string;
  nextAdminNote: string;
  changedFields: string[];
}

function normalizeStatus(value: unknown): LeadStatus {
  if (typeof value === "string" && isLeadStatus(value.trim())) {
    return value.trim() as LeadStatus;
  }
  return "new";
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeChangedFields(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeActivityEntry(
  leadId: string,
  id: string,
  data: Record<string, unknown>
): LeadActivityEntry | null {
  if (typeof data.createdAt !== "string" || !data.createdAt.trim()) {
    return null;
  }

  const activityType =
    data.type === "pipeline_update" || data.action === "pipeline_update"
      ? "pipeline_update"
      : null;

  if (!activityType) {
    return null;
  }

  const nextStatusRaw = data.nextStatus ?? data.newStatus;
  const nextAdminNoteRaw = data.nextAdminNote ?? data.newAdminNote;

  return {
    id,
    leadId,
    createdAt: data.createdAt,
    type: activityType,
    actorUid: normalizeOptionalString(data.actorUid),
    actorEmail: normalizeOptionalString(data.actorEmail),
    previousStatus: normalizeStatus(data.previousStatus),
    nextStatus: normalizeStatus(nextStatusRaw),
    previousAdminNote:
      typeof data.previousAdminNote === "string" ? data.previousAdminNote : "",
    nextAdminNote:
      typeof nextAdminNoteRaw === "string" ? nextAdminNoteRaw : "",
    changedFields: normalizeChangedFields(data.changedFields),
  };
}

export async function listLeadActivity(
  leadId: string,
  maxEntries = 5
): Promise<LeadActivityEntry[]> {
  if (!isFirebaseConfigured || !leadId.trim()) {
    return [];
  }

  const db = getFirestoreDb();
  if (!db) {
    return [];
  }

  try {
    const activityQuery = query(
      collection(db, LEAD_INTENTS_COLLECTION, leadId, ACTIVITY_SUBCOLLECTION),
      orderBy("createdAt", "desc"),
      limit(maxEntries)
    );
    const snapshot = await getDocs(activityQuery);
    const entries: LeadActivityEntry[] = [];

    for (const document of snapshot.docs) {
      const raw = document.data();
      if (typeof raw !== "object" || raw === null) {
        continue;
      }
      const normalized = normalizeActivityEntry(
        leadId,
        document.id,
        raw as Record<string, unknown>
      );
      if (normalized) {
        entries.push(normalized);
      }
    }

    return entries;
  } catch {
    return [];
  }
}

function resolveChangedFields(entry: LeadActivityEntry): string[] {
  if (entry.changedFields.length > 0) {
    return entry.changedFields;
  }

  const inferred: string[] = [];
  if (entry.previousStatus !== entry.nextStatus) {
    inferred.push("status");
  }
  if (entry.previousAdminNote !== entry.nextAdminNote) {
    inferred.push("adminNote");
  }
  return inferred;
}

export function formatActivitySummary(entry: LeadActivityEntry): string {
  const changedFields = resolveChangedFields(entry);
  const parts: string[] = [];

  if (changedFields.includes("status")) {
    parts.push(
      `Durum: ${getLeadStatusLabel(entry.previousStatus)} → ${getLeadStatusLabel(entry.nextStatus)}`
    );
  }

  if (changedFields.includes("adminNote")) {
    parts.push("Admin notu güncellendi");
  }

  if (parts.length === 0) {
    parts.push("Pipeline güncellendi");
  }

  return parts.join(" · ");
}

export function formatChangedFieldsLabel(changedFields: string[]): string {
  if (changedFields.length === 0) {
    return "—";
  }

  const labels: Record<string, string> = {
    status: "Durum",
    adminNote: "Admin notu",
  };

  return changedFields.map((field) => labels[field] ?? field).join(", ");
}
