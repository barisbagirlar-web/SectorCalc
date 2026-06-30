import { isLeadStatus, resolveLeadStatus } from "@/lib/features/leads/lead-pipeline";
import type {
 LeadIntent,
 LeadPlan,
 LeadSource,
 LeadStorageMode,
} from "@/lib/features/leads/types";

const LEAD_SOURCES: LeadSource[] = [
 "premium_unlock",
 "pricing",
 "export",
 "sample_report",
 "unknown",
];

const LEAD_PLANS: LeadPlan[] = [
 "single_report",
 "sector_pass",
 "pro",
 "free",
 "unknown",
];

const STORAGE_MODES: LeadStorageMode[] = ["firestore", "localStorage"];

function isNonEmptyString(value: unknown): value is string {
 return typeof value === "string" && value.trim().length > 0;
}

function isLeadSource(value: unknown): value is LeadSource {
 return (
 typeof value === "string" &&
 (LEAD_SOURCES as string[]).includes(value)
 );
}

function isLeadPlan(value: unknown): value is LeadPlan {
 return typeof value === "string" && (LEAD_PLANS as string[]).includes(value);
}

function isStorageMode(value: unknown): value is LeadStorageMode {
 return (
 typeof value === "string" && (STORAGE_MODES as string[]).includes(value)
 );
}

export function normalizeLeadIntent(raw: unknown): LeadIntent | null {
 if (!raw || typeof raw !== "object") return null;

 const record = raw as Record<string, unknown>;

 if (
 !isNonEmptyString(record.id) ||
 !isNonEmptyString(record.name) ||
 !isNonEmptyString(record.email) ||
 !isNonEmptyString(record.company) ||
 !isNonEmptyString(record.industry) ||
 !isNonEmptyString(record.toolRequested) ||
 !isNonEmptyString(record.intendedUse) ||
 !isLeadSource(record.source) ||
 !isNonEmptyString(record.pagePath) ||
 !isNonEmptyString(record.createdAt)
 ) {
 return null;
 }

 const lead: LeadIntent = {
 id: record.id.trim(),
 name: record.name.trim(),
 email: record.email.trim().toLowerCase(),
 company: record.company.trim(),
 industry: record.industry.trim(),
 toolRequested: record.toolRequested.trim(),
 intendedUse: record.intendedUse.trim(),
 source: record.source,
 pagePath: record.pagePath.trim(),
 createdAt: record.createdAt.trim(),
 status: "new",
 storageMode: isStorageMode(record.storageMode)
 ? record.storageMode
 : "localStorage",
 };

 if (isNonEmptyString(record.message)) {
 lead.message = record.message.trim();
 }

 if (isLeadPlan(record.plan)) {
 lead.plan = record.plan;
 }

 if (typeof record.status === "string") {
 const trimmed = record.status.trim();
 if (trimmed === "closed") {
 lead.status = "lost";
 } else if (isLeadStatus(trimmed)) {
 lead.status = trimmed;
 }
 }

 if (typeof record.leadScore === "number" && !Number.isNaN(record.leadScore)) {
 lead.leadScore = record.leadScore;
 }

 if (isNonEmptyString(record.nextAction)) {
 lead.nextAction = record.nextAction.trim();
 }

 if (isNonEmptyString(record.sourceTool)) {
 lead.sourceTool = record.sourceTool.trim();
 }

 if (isNonEmptyString(record.phone)) {
 lead.phone = record.phone.trim();
 }

 if (typeof record.adminNote === "string") {
 lead.adminNote = record.adminNote.trim();
 }

 if (isNonEmptyString(record.updatedAt)) {
 lead.updatedAt = record.updatedAt.trim();
 }

 if (typeof record.isTestLead === "boolean") {
 lead.isTestLead = record.isTestLead;
 }

 if (typeof record.testLeadReason === "string") {
 lead.testLeadReason = record.testLeadReason.trim();
 }

 if (isNonEmptyString(record.testLeadMarkedAt)) {
 lead.testLeadMarkedAt = record.testLeadMarkedAt.trim();
 }

 if (isNonEmptyString(record.testLeadMarkedByUid)) {
 lead.testLeadMarkedByUid = record.testLeadMarkedByUid.trim();
 }

 if (isNonEmptyString(record.testLeadMarkedByEmail)) {
 lead.testLeadMarkedByEmail = record.testLeadMarkedByEmail.trim();
 }

 if (isNonEmptyString(record.toolSlug)) {
 lead.toolSlug = record.toolSlug.trim();
 } else if (isNonEmptyString(record.tool_slug)) {
 lead.toolSlug = String(record.tool_slug).trim();
 }

 if (isNonEmptyString(record.sourcePath)) {
 lead.sourcePath = record.sourcePath.trim();
 } else if (isNonEmptyString(record.source_path)) {
 lead.sourcePath = String(record.source_path).trim();
 }

 if (isNonEmptyString(record.path)) {
 lead.path = record.path.trim();
 }

 if (isNonEmptyString(record.tier)) {
 lead.tier = record.tier.trim();
 } else if (isNonEmptyString(record.toolTier)) {
 lead.tier = String(record.toolTier).trim();
 }

 if (isNonEmptyString(record.cta)) {
 lead.cta = record.cta.trim();
 } else if (isNonEmptyString(record.ctaSource)) {
 lead.cta = String(record.ctaSource).trim();
 }

 if (isNonEmptyString(record.referrer)) {
 lead.referrer = record.referrer.trim();
 }

 if (isNonEmptyString(record.utmSource)) {
 lead.utmSource = record.utmSource.trim();
 } else if (isNonEmptyString(record.utm_source)) {
 lead.utmSource = String(record.utm_source).trim();
 }

 if (isNonEmptyString(record.utmMedium)) {
 lead.utmMedium = record.utmMedium.trim();
 } else if (isNonEmptyString(record.utm_medium)) {
 lead.utmMedium = String(record.utm_medium).trim();
 }

 if (isNonEmptyString(record.utmCampaign)) {
 lead.utmCampaign = record.utmCampaign.trim();
 } else if (isNonEmptyString(record.utm_campaign)) {
 lead.utmCampaign = String(record.utm_campaign).trim();
 }

 lead.status = resolveLeadStatus(lead);

 return lead;
}
