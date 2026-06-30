import {
 getLeadStatusLabel,
 resolveLeadStatus,
 resolveNextAction,
} from "@/lib/features/leads/lead-pipeline";
import { resolveLeadFollowUpSla } from "@/lib/features/leads/follow-up-sla";
import {
 computeLeadQualityScore,
 type LeadQualityScore,
} from "@/lib/features/leads/lead-quality-score";
import { resolveLeadAttribution } from "@/lib/features/leads/source-attribution";
import type { LeadIntent, LeadStatus } from "@/lib/features/leads/types";

export type ActionPriorityLevel = "urgent" | "high" | "normal" | "low";

export type SuggestedMessageType = "whatsapp" | "email" | "internal_note";

export interface LeadActionRecommendation {
 recommendedActionLabel: string;
 recommendedActionReason: string;
 recommendedStatus: LeadStatus;
 priorityLevel: ActionPriorityLevel;
 actionChecklist: string[];
 suggestedMessageType: SuggestedMessageType;
 shouldContactToday: boolean;
}

const WEAK_MESSAGE_PATTERNS = ["test", "deneme", "123", "dddd", "dfdf"];

function hasWeakMessage(lead: LeadIntent): boolean {
 const message = lead.message?.trim() ?? "";
 if (!message) {
 return true;
 }

 const normalized = message.toLowerCase();
 return WEAK_MESSAGE_PATTERNS.some(
 (pattern) => normalized === pattern || normalized.includes(pattern)
 );
}

function hasWeakMessageSignal(lead: LeadIntent, quality: LeadQualityScore): boolean {
 if (hasWeakMessage(lead)) {
 return true;
 }
  return quality.warnings.some((warning) => warning.includes("Message"));
}

function buildChecklist(
 items: string[],
 suggestedMessageType: SuggestedMessageType
): string[] {
 const messageStep =
 suggestedMessageType === "whatsapp"
 ? "Copy WhatsApp text and send manually"
 : suggestedMessageType === "email"
 ? "Copy email text and send manually"
 : "Copy internal note and paste to CRM/notes field";

 return [...items, messageStep, "Update and save pipeline status"];
}

function closedRecommendation(status: LeadStatus): LeadActionRecommendation {
 return {
  recommendedActionLabel: "Closed Record",
  recommendedActionReason:
   status === "converted"
   ? "Lead completed conversion — no further sales action needed."
   : "Lead marked as lost — leave as closed record.",
 recommendedStatus: status,
 priorityLevel: "low",
  actionChecklist: buildChecklist(
   ["Verify record status", "Note loss/conversion reason"],
   "internal_note"
  ),
 suggestedMessageType: "internal_note",
 shouldContactToday: false,
 };
}

function requestMoreInfoRecommendation(
 quality: LeadQualityScore
): LeadActionRecommendation {
  const reasonParts = [
   "Lead quality is low and message/data appears weak.",
   quality.warnings.length > 0 ? quality.warnings.join(" · ") : null,
  ].filter((part): part is string => Boolean(part));

  return {
   recommendedActionLabel: "Request More Info",
   recommendedActionReason: reasonParts.join(" "),
   recommendedStatus: "reviewed",
   priorityLevel: "normal",
   actionChecklist: buildChecklist(
    [
     "Check missing company, message or intent info",
     "Prepare short message requesting more info",
    ],
    "email"
   ),
 suggestedMessageType: "email",
 shouldContactToday: false,
 };
}

function urgentFollowUpRecommendation(
 slaLabel: string,
 quality: LeadQualityScore
): LeadActionRecommendation {
 return {
  recommendedActionLabel: "Respond Today",
  recommendedActionReason: `SLA overdue (${slaLabel}) and lead quality ${quality.label.toLowerCase()} (${quality.score}/100).`,
  recommendedStatus: "contacted",
  priorityLevel: "urgent",
  actionChecklist: buildChecklist(
   [
    "Review attribution and intent summary",
    "Contact today without fail",
   ],
   "whatsapp"
  ),
 suggestedMessageType: "whatsapp",
 shouldContactToday: true,
 };
}

function priorityFirstContactRecommendation(
 quality: LeadQualityScore,
 attributionLabel: string
): LeadActionRecommendation {
 return {
  recommendedActionLabel: "Priority First Contact",
  recommendedActionReason: `New high-quality lead (${quality.score}/100). Source: ${attributionLabel}.`,
 recommendedStatus: "contacted",
 priorityLevel: "high",
  actionChecklist: buildChecklist(
   ["Read lead summary", "Prepare initial contact message"],
   "whatsapp"
  ),
 suggestedMessageType: "whatsapp",
 shouldContactToday: true,
 };
}

function qualificationCallRecommendation(
 quality: LeadQualityScore
): LeadActionRecommendation {
 return {
  recommendedActionLabel: "Qualification Call",
  recommendedActionReason: `Lead reviewed and ${quality.label.toLowerCase()} (${quality.score}/100) — time for qualification assessment.`,
 recommendedStatus: "qualified",
 priorityLevel: "high",
  actionChecklist: buildChecklist(
   ["Clarify need and budget fit", "Save meeting notes to internal note"],
   "whatsapp"
  ),
 suggestedMessageType: "whatsapp",
 shouldContactToday: true,
 };
}

function closingFollowUpRecommendation(): LeadActionRecommendation {
 return {
  recommendedActionLabel: "Quote / Closing Follow-up",
  recommendedActionReason:
   "Lead marked as qualified — proceed to quote or closing step.",
 recommendedStatus: "converted",
 priorityLevel: "normal",
  actionChecklist: buildChecklist(
   ["Check latest quote or decision status", "Prepare closing follow-up message"],
   "email"
  ),
 suggestedMessageType: "email",
 shouldContactToday: false,
 };
}

function defaultActiveRecommendation(
 lead: LeadIntent,
 status: LeadStatus,
 slaLabel: string,
 quality: LeadQualityScore
): LeadActionRecommendation {
 const nextAction = resolveNextAction(lead);
 const attribution = resolveLeadAttribution(lead);

 if (status === "contacted") {
 return {
   recommendedActionLabel: "Send Follow-up Message",
   recommendedActionReason: `Contact established (${slaLabel}). ${nextAction}.`,
 recommendedStatus: "contacted",
   priorityLevel: slaLabel === "Follow-up due" ? "high" : "normal",
   actionChecklist: buildChecklist(
    ["Check last contact time", "Prepare follow-up message"],
    "whatsapp"
   ),
   suggestedMessageType: "whatsapp",
   shouldContactToday: slaLabel === "Follow-up due" || slaLabel === "Overdue",
 };
 }

 if (status === "new") {
 return {
   recommendedActionLabel: "Initial Review",
   recommendedActionReason: `New lead — ${quality.label.toLowerCase()} (${quality.score}/100). Source: ${attribution.attributionLabel}.`,
 recommendedStatus: "reviewed",
 priorityLevel: "normal",
  actionChecklist: buildChecklist(
   ["Review lead form", "Update status to Reviewed"],
   "internal_note"
  ),
 suggestedMessageType: "internal_note",
 shouldContactToday: false,
 };
 }

 if (status === "reviewed") {
 return {
   recommendedActionLabel: "Contact",
   recommendedActionReason: `${nextAction}. Quality: ${quality.score}/100.`,
 recommendedStatus: "contacted",
 priorityLevel: "normal",
  actionChecklist: buildChecklist(
   ["Check review notes", "Prepare contact message"],
   "whatsapp"
  ),
 suggestedMessageType: "whatsapp",
 shouldContactToday: false,
 };
 }

 return {
 recommendedActionLabel: nextAction,
  recommendedActionReason: `Current status: ${getLeadStatusLabel(status)}. SLA: ${slaLabel}.`,
 recommendedStatus: status,
 priorityLevel: "normal",
  actionChecklist: buildChecklist(
   ["Review lead record", "Plan next step"],
   "internal_note"
  ),
 suggestedMessageType: "internal_note",
 shouldContactToday: false,
 };
}

export function resolveLeadActionRecommendation(
 lead: LeadIntent,
 referenceDate: Date = new Date()
): LeadActionRecommendation {
 const status = resolveLeadStatus(lead);
 const sla = resolveLeadFollowUpSla(lead, referenceDate);
 const quality = computeLeadQualityScore(lead, referenceDate);
 const attribution = resolveLeadAttribution(lead);

 if (status === "converted" || status === "lost") {
 return closedRecommendation(status);
 }

 if (quality.level === "low" && hasWeakMessageSignal(lead, quality)) {
 return requestMoreInfoRecommendation(quality);
 }

 if (
 sla.slaLevel === "urgent" &&
 (quality.level === "high" || quality.level === "medium")
 ) {
 return urgentFollowUpRecommendation(sla.slaLabel, quality);
 }

 if (status === "new" && quality.level === "high") {
 return priorityFirstContactRecommendation(
 quality,
 attribution.attributionLabel
 );
 }

 if (
 status === "reviewed" &&
 (quality.level === "high" || quality.level === "medium")
 ) {
 return qualificationCallRecommendation(quality);
 }

 if (status === "qualified") {
 return closingFollowUpRecommendation();
 }

 return defaultActiveRecommendation(lead, status, sla.slaLabel, quality);
}

export function getRecommendedStatusLabel(recommendation: LeadActionRecommendation): string {
 return getLeadStatusLabel(recommendation.recommendedStatus);
}
