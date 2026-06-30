import { resolveLeadStatus } from "@/lib/features/leads/lead-pipeline";
import type { LeadIntent, LeadStatus } from "@/lib/features/leads/types";

export type FollowUpSlaLevel = "ok" | "watch" | "urgent" | "done";

export interface LeadFollowUpSla {
 status: LeadStatus;
 baseDate: string | null;
 ageHours: number;
 ageLabel: string;
 slaLevel: FollowUpSlaLevel;
 slaLabel: string;
 recommendedAction: string;
}

export interface FollowUpSlaSummary {
 overdueCount: number;
 dueTodayCount: number;
 inProgressCount: number;
 completedCount: number;
}

function parseIsoDate(value: string | undefined): Date | null {
 if (!value?.trim()) {
 return null;
 }
 const parsed = new Date(value);
 if (Number.isNaN(parsed.getTime())) {
 return null;
 }
 return parsed;
}

function resolveBaseDate(lead: LeadIntent): Date | null {
 return parseIsoDate(lead.updatedAt) ?? parseIsoDate(lead.createdAt);
}

function computeAgeHours(baseDate: Date, referenceDate: Date): number {
 const diffMs = referenceDate.getTime() - baseDate.getTime();
 if (!Number.isFinite(diffMs) || diffMs < 0) {
 return 0;
 }
 return diffMs / (1000 * 60 * 60);
}

export function formatFollowUpAgeLabel(ageHours: number): string {
 if (!Number.isFinite(ageHours) || ageHours < 0) {
 return "—";
 }

 if (ageHours < 24) {
 const hours = Math.max(1, Math.round(ageHours));
    return `${hours} hours`;
 }

 const days = Math.max(1, Math.floor(ageHours / 24));
    return `${days} days`;
}

interface SlaResolution {
 slaLevel: FollowUpSlaLevel;
 slaLabel: string;
 recommendedAction: string;
}

function resolveNewSla(ageHours: number): SlaResolution {
 if (ageHours < 4) {
 return {
 slaLevel: "ok",
    slaLabel: "New",
    recommendedAction: "Review lead and update status",
 };
 }
 if (ageHours < 24) {
 return {
 slaLevel: "watch",
    slaLabel: "Due today",
    recommendedAction: "Respond today",
 };
 }
 return {
 slaLevel: "urgent",
    slaLabel: "Overdue",
    recommendedAction: "Urgent response needed",
 };
}

function resolveReviewedSla(ageHours: number): SlaResolution {
 if (ageHours < 12) {
 return {
 slaLevel: "ok",
    slaLabel: "In Review",
    recommendedAction: "Send preliminary review message",
 };
 }
 if (ageHours < 24) {
 return {
 slaLevel: "watch",
    slaLabel: "Follow-up pending",
    recommendedAction: "Send follow-up message",
 };
 }
 return {
 slaLevel: "urgent",
    slaLabel: "Overdue",
    recommendedAction: "Overdue follow-up — respond immediately",
 };
}

function resolveContactedSla(ageHours: number): SlaResolution {
 if (ageHours >= 48) {
 return {
 slaLevel: "watch",
    slaLabel: "Follow-up due",
    recommendedAction: "Perform contact follow-up",
 };
 }
 return {
 slaLevel: "ok",
    slaLabel: "Contacted",
    recommendedAction: "Wait for reply or schedule follow-up",
 };
}

function resolveQualifiedSla(ageHours: number): SlaResolution {
 if (ageHours >= 72) {
 return {
 slaLevel: "watch",
    slaLabel: "Quote / closing follow-up",
    recommendedAction: "Perform quote/closing follow-up",
 };
 }
 return {
 slaLevel: "ok",
    slaLabel: "Qualified lead",
    recommendedAction: "Plan quote or next step",
 };
}

function resolveStatusSla(status: LeadStatus, ageHours: number): SlaResolution {
 switch (status) {
 case "new":
 return resolveNewSla(ageHours);
 case "reviewed":
 return resolveReviewedSla(ageHours);
 case "contacted":
 return resolveContactedSla(ageHours);
 case "qualified":
 return resolveQualifiedSla(ageHours);
 case "converted":
 return {
 slaLevel: "done",
    slaLabel: "Completed",
    recommendedAction: "Lead conversion completed",
 };
 case "lost":
 return {
 slaLevel: "done",
    slaLabel: "Lost",
    recommendedAction: "Check loss reason",
 };
 default:
 return {
 slaLevel: "ok",
    slaLabel: "In Progress",
    recommendedAction: "Check status",
 };
 }
}

export function resolveLeadFollowUpSla(
 lead: LeadIntent,
 referenceDate: Date = new Date()
): LeadFollowUpSla {
 const status = resolveLeadStatus(lead);
 const base = resolveBaseDate(lead);

 if (!base) {
 return {
 status,
 baseDate: null,
 ageHours: 0,
 ageLabel: "—",
 slaLevel: "ok",
    slaLabel: "In Progress",
    recommendedAction: "Missing date info — check manually",
 };
 }

 const ageHours = computeAgeHours(base, referenceDate);
 const resolution = resolveStatusSla(status, ageHours);

 return {
 status,
 baseDate: base.toISOString(),
 ageHours,
 ageLabel: formatFollowUpAgeLabel(ageHours),
 slaLevel: resolution.slaLevel,
 slaLabel: resolution.slaLabel,
 recommendedAction: resolution.recommendedAction,
 };
}

export function computeFollowUpSlaSummary(
 leads: LeadIntent[],
 referenceDate: Date = new Date()
): FollowUpSlaSummary {
 let overdueCount = 0;
 let dueTodayCount = 0;
 let inProgressCount = 0;
 let completedCount = 0;

 for (const lead of leads) {
 const sla = resolveLeadFollowUpSla(lead, referenceDate);
 switch (sla.slaLevel) {
 case "urgent":
 overdueCount += 1;
 break;
 case "watch":
 dueTodayCount += 1;
 break;
 case "ok":
 inProgressCount += 1;
 break;
 case "done":
 completedCount += 1;
 break;
 default:
 break;
 }
 }

 return {
 overdueCount,
 dueTodayCount,
 inProgressCount,
 completedCount,
 };
}
