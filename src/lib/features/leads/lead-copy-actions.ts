import { formatLocalDateTime } from "@/lib/core/format/datetime";
import {
 formatLeadIntentSummary,
 resolveNextAction,
} from "@/lib/features/leads/lead-pipeline";
import { resolveLeadAttribution } from "@/lib/features/leads/source-attribution";
import type { LeadIntent } from "@/lib/features/leads/types";

const UNKNOWN = "Unknown";

function greetingName(name: string): string {
 const trimmed = name.trim();
  return trimmed ? `Hello ${trimmed},` : "Hello,";
}

function resolveIntentPhrase(
 lead: LeadIntent,
 sourceToolLabel: string
): string {
 const intent = formatLeadIntentSummary(lead).trim();
 if (intent) {
 return intent;
 }
 if (sourceToolLabel !== UNKNOWN) {
 return sourceToolLabel;
 }
  return "your submitted request";
}

function resolveNextActionPhrase(lead: LeadIntent): string {
 if (lead.nextAction?.trim()) {
 return lead.nextAction.trim();
 }
 const suggested = resolveNextAction(lead);
 if (suggested.trim()) {
 return suggested;
 }
  return "preliminary assessment";
}

function resolveAttributionPhrase(attributionLabel: string): string {
 return attributionLabel !== UNKNOWN ? attributionLabel : "SectorCalc";
}

function resolveIndustryPhrase(industryLabel: string): string {
 return industryLabel !== UNKNOWN ? industryLabel : "-";
}

function resolvePlanPhrase(planLabel: string): string {
 return planLabel !== UNKNOWN ? planLabel : "-";
}

function resolveSourcePagePhrase(sourcePageLabel: string): string {
 return sourcePageLabel !== UNKNOWN ? sourcePageLabel : "-";
}

function buildLeadContext(lead: LeadIntent) {
 const attribution = resolveLeadAttribution(lead);
 const createdLocal = formatLocalDateTime(lead.createdAt);
 const intentPhrase = resolveIntentPhrase(lead, attribution.sourceToolLabel);
 const nextActionPhrase = resolveNextActionPhrase(lead);
 const attributionPhrase = resolveAttributionPhrase(
 attribution.attributionLabel
 );

 return {
 attribution,
 createdLocal,
 intentPhrase,
 nextActionPhrase,
 attributionPhrase,
 industryPhrase: resolveIndustryPhrase(attribution.industryLabel),
 planPhrase: resolvePlanPhrase(attribution.planLabel),
 sourcePagePhrase: resolveSourcePagePhrase(attribution.sourcePageLabel),
 greeting: greetingName(lead.name),
 email: lead.email.trim(),
 phone: lead.phone?.trim() ?? "",
 };
}

export function buildLeadWhatsappMessage(lead: LeadIntent): string {
 const ctx = buildLeadContext(lead);

  return [
   ctx.greeting,
   "",
   `We are following up on your "${ctx.intentPhrase}" request submitted via SectorCalc.`,
   `Record: ${ctx.attributionPhrase} · Page: ${ctx.sourcePagePhrase} · Plan: ${ctx.planPhrase}`,
   "",
   `Suggested next step: ${ctx.nextActionPhrase}. We can schedule a brief call when convenient.`,
   "",
   "Best regards,",
   "SectorCalc",
  ].join("\n");
}

export function buildLeadEmailMessage(lead: LeadIntent): string {
 const ctx = buildLeadContext(lead);
 const name = lead.name.trim() || "Yetkili";

  return [
   "Subject: SectorCalc - Regarding Your Request",
   "",
   `Dear ${name},`,
   "",
   `We have reviewed your "${ctx.intentPhrase}" request submitted via SectorCalc on ${ctx.createdLocal}.`,
   `Source summary: ${ctx.attributionPhrase}. Sector: ${ctx.industryPhrase}. Plan interest: ${ctx.planPhrase}.`,
   "",
   `As a next step, we can proceed with ${ctx.nextActionPhrase}. Please share a suitable time and we will schedule a brief assessment call.`,
   "",
   "This message is for preliminary information only; it does not constitute a commitment of results or returns.",
   "",
   "Sincerely,",
   "SectorCalc",
   ctx.email ? `Contact: ${ctx.email}` : "",
 ]
 .filter((line) => line !== "")
 .join("\n");
}

export function buildLeadInternalNote(lead: LeadIntent): string {
 const ctx = buildLeadContext(lead);
 const { attribution } = ctx;

  return [
   "[SectorCalc - internal note]",
   `Lead: ${lead.name.trim() || "-"} · ${lead.company.trim() || "-"}`,
   `Date (local): ${ctx.createdLocal} · UTC: ${lead.createdAt}`,
   `Intent: ${ctx.intentPhrase}`,
   `Attribution: ${ctx.attributionPhrase}`,
   `Page: ${ctx.sourcePagePhrase} · Tool: ${attribution.sourceToolLabel}`,
   `Sector: ${ctx.industryPhrase} · Plan: ${ctx.planPhrase} · CTA: ${attribution.ctaLabel}`,
   `Next action: ${ctx.nextActionPhrase}`,
   `Email: ${ctx.email || "-"} · Phone: ${ctx.phone || "-"}`,
   `Lead ID: ${lead.id}`,
  ].join("\n");
}
