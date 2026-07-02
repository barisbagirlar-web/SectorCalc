export type LeadSource =
 | "premium_unlock"
 | "pricing"
 | "export"
 | "sample_report"
 | "unknown";

export type LeadPlan =
 | "single_report"
 | "sector_pass"
 | "pro"
 | "free"
 | "unknown";

export type LeadStatus =
 | "new"
 | "reviewed"
 | "contacted"
 | "qualified"
 | "converted"
 | "lost";

export type LeadPriority = "hot" | "warm" | "cold";

export type LeadStorageMode = "firestore" | "localStorage";

export interface LeadIntent {
 id: string;
 name: string;
 email: string;
 company: string;
 industry: string;
 toolRequested: string;
 intendedUse: string;
 message?: string;
 source: LeadSource;
 pagePath: string;
 plan?: LeadPlan;
 createdAt: string;
 status: LeadStatus;
 storageMode: LeadStorageMode;
 /** Optional pipeline score (0–100); drives priority when set */
 leadScore?: number;
 /** Optional sales follow-up note; auto-suggested in admin when absent */
 nextAction?: string;
 /** Optional alias for tool context in pipeline hints */
 sourceTool?: string;
 /** Optional contact phone for WhatsApp quick action */
 phone?: string;
 /** Admin-only follow-up note (max 500 chars) */
 adminNote?: string;
 /** UTC ISO - set on admin pipeline save only */
 updatedAt?: string;
 /** Admin manual test lead classification */
 isTestLead?: boolean;
 testLeadReason?: string;
 testLeadMarkedAt?: string;
 testLeadMarkedByUid?: string;
 testLeadMarkedByEmail?: string;
 /** Attribution: tool slug when distinct from display name */
 toolSlug?: string;
 /** Attribution: page path alias */
 sourcePath?: string;
 path?: string;
 /** Attribution: free | premium */
 tier?: string;
 /** Attribution: CTA identifier */
 cta?: string;
 /** Attribution: full referrer URL */
 referrer?: string;
 utmSource?: string;
 utmMedium?: string;
 utmCampaign?: string;
}

export interface LeadIntentInput {
 name: string;
 email: string;
 company: string;
 industry: string;
 toolRequested: string;
 intendedUse: string;
 message?: string;
 source: LeadSource;
 pagePath: string;
 plan?: LeadPlan;
}

export type LeadIntentField = keyof Pick<
 LeadIntentInput,
 | "name"
 | "email"
 | "company"
 | "industry"
 | "toolRequested"
 | "intendedUse"
 | "message"
>;

export type LeadIntentErrors = Partial<Record<LeadIntentField, string>>;

export interface LeadModalOpenContext {
 source: LeadSource;
 toolRequested?: string;
 toolSlug?: string;
 industry?: string;
 plan?: LeadPlan;
 pagePath?: string;
 /** Conversion funnel mode for free-tool unlock */
 flow?: "default" | "verdict_unlock" | "paywall";
}

export interface CreateLeadIntentResult {
 success: boolean;
 /** Mirrors success on successful validation + local save */
 ok?: boolean;
 lead?: LeadIntent;
 errors?: LeadIntentErrors;
 firestoreAttempted?: boolean;
 firestoreSaved?: boolean;
 /** Set when Firestore write failed but local save succeeded */
 firestoreWarning?: string;
 /** Client-side rate limit exceeded */
 rateLimited?: boolean;
 rateLimitMessage?: string;
}
