import {
 collection,
 getDocs,
 limit,
 orderBy,
 query,
} from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/infrastructure/firebase/client";
import { getLeadStatusLabel, isLeadStatus } from "@/lib/features/leads/lead-pipeline";
import type { LeadStatus } from "@/lib/features/leads/types";

const ACTIVITY_SUBCOLLECTION = "activity";
const LEAD_INTENTS_COLLECTION = "leadIntents";

export type LeadActivityType =
 | "pipeline_update"
 | "test_lead_marked"
 | "test_lead_unmarked";

interface LeadActivityBase {
 id: string;
 leadId: string;
 createdAt: string;
 type: LeadActivityType;
 actorUid: string | null;
 actorEmail: string | null;
 changedFields: string[];
}

export interface PipelineActivityEntry extends LeadActivityBase {
 type: "pipeline_update";
 previousStatus: LeadStatus;
 nextStatus: LeadStatus;
 previousAdminNote: string;
 nextAdminNote: string;
}

export interface TestLeadActivityEntry extends LeadActivityBase {
 type: "test_lead_marked" | "test_lead_unmarked";
 previousIsTestLead: boolean;
 nextIsTestLead: boolean;
 previousTestLeadReason: string;
 nextTestLeadReason: string;
}

export type LeadActivityEntry = PipelineActivityEntry | TestLeadActivityEntry;

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

function normalizeBoolean(value: unknown): boolean {
 return value === true;
}

function normalizePipelineActivityEntry(
 leadId: string,
 id: string,
 data: Record<string, unknown>
): PipelineActivityEntry | null {
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
 createdAt: String(data.createdAt),
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

function normalizeTestLeadActivityEntry(
 leadId: string,
 id: string,
 data: Record<string, unknown>
): TestLeadActivityEntry | null {
 if (data.type !== "test_lead_marked" && data.type !== "test_lead_unmarked") {
 return null;
 }

 if (typeof data.createdAt !== "string" || !data.createdAt.trim()) {
 return null;
 }

 return {
 id,
 leadId,
 createdAt: data.createdAt,
 type: data.type,
 actorUid: normalizeOptionalString(data.actorUid),
 actorEmail: normalizeOptionalString(data.actorEmail),
 previousIsTestLead: normalizeBoolean(data.previousIsTestLead),
 nextIsTestLead: normalizeBoolean(data.nextIsTestLead),
 previousTestLeadReason:
 typeof data.previousTestLeadReason === "string"
 ? data.previousTestLeadReason
 : "",
 nextTestLeadReason:
 typeof data.nextTestLeadReason === "string" ? data.nextTestLeadReason : "",
 changedFields: normalizeChangedFields(data.changedFields),
 };
}

function normalizeActivityEntry(
 leadId: string,
 id: string,
 data: Record<string, unknown>
): LeadActivityEntry | null {
 if (typeof data.createdAt !== "string" || !data.createdAt.trim()) {
 return null;
 }

 const pipeline = normalizePipelineActivityEntry(leadId, id, data);
 if (pipeline) {
 return pipeline;
 }

 return normalizeTestLeadActivityEntry(leadId, id, data);
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

function isPipelineActivity(
 entry: LeadActivityEntry
): entry is PipelineActivityEntry {
 return entry.type === "pipeline_update";
}

function isTestLeadActivity(
 entry: LeadActivityEntry
): entry is TestLeadActivityEntry {
 return entry.type === "test_lead_marked" || entry.type === "test_lead_unmarked";
}

export function formatActivitySummary(entry: LeadActivityEntry): string {
 if (isTestLeadActivity(entry)) {
 if (entry.type === "test_lead_marked") {
   return "Marked as test lead";
 }
   return "Test lead mark removed";
 }

 const changedFields =
 entry.changedFields.length > 0 ? entry.changedFields : inferPipelineChangedFields(entry);
 const parts: string[] = [];

 if (changedFields.includes("status")) {
   parts.push(
    `Status: ${getLeadStatusLabel(entry.previousStatus)} → ${getLeadStatusLabel(entry.nextStatus)}`
   );
 }

  if (changedFields.includes("adminNote")) {
   parts.push("Admin note updated");
  }

  if (parts.length === 0) {
   parts.push("Pipeline updated");
  }

 return parts.join(" · ");
}

function inferPipelineChangedFields(entry: PipelineActivityEntry): string[] {
 const inferred: string[] = [];
 if (entry.previousStatus !== entry.nextStatus) {
 inferred.push("status");
 }
 if (entry.previousAdminNote !== entry.nextAdminNote) {
 inferred.push("adminNote");
 }
 return inferred;
}

export function formatChangedFieldsLabel(changedFields: string[]): string {
 if (changedFields.length === 0) {
 return "—";
 }

 const labels: Record<string, string> = {
  status: "Status",
  adminNote: "Admin Note",
  isTestLead: "Test Lead",
  testLeadReason: "Test Lead Reason",
 };

 return changedFields.map((field) => labels[field] ?? field).join(", ");
}

export function getActivityDetailLine(entry: LeadActivityEntry): string | null {
 if (isTestLeadActivity(entry)) {
 const parts: string[] = [];
 if (entry.previousIsTestLead !== entry.nextIsTestLead) {
   parts.push(
    entry.nextIsTestLead ? "Test lead: Yes" : "Test lead: No"
   );
  }
  if (entry.nextTestLeadReason.trim()) {
   parts.push(`Reason: ${entry.nextTestLeadReason.trim()}`);
 }
 return parts.length > 0 ? parts.join(" · ") : null;
 }

 if (entry.changedFields.includes("status")) {
 return `${getLeadStatusLabel(entry.previousStatus)} → ${getLeadStatusLabel(entry.nextStatus)}`;
 }

 return null;
}

export function entryShowsAdminNote(entry: LeadActivityEntry): boolean {
 return (
 isPipelineActivity(entry) &&
 entry.changedFields.includes("adminNote") &&
 entry.nextAdminNote.trim().length > 0
 );
}

export function getEntryAdminNote(entry: LeadActivityEntry): string {
 return isPipelineActivity(entry) ? entry.nextAdminNote.trim() : "";
}
