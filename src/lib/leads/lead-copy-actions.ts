import { formatLocalDateTime } from "@/lib/format/datetime";
import {
  formatLeadIntentSummary,
  resolveNextAction,
} from "@/lib/leads/lead-pipeline";
import { resolveLeadAttribution } from "@/lib/leads/source-attribution";
import type { LeadIntent } from "@/lib/leads/types";

const UNKNOWN = "Unknown";

function greetingName(name: string): string {
  const trimmed = name.trim();
  return trimmed ? `Merhaba ${trimmed},` : "Merhaba,";
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
  return "gönderdiğiniz talep";
}

function resolveNextActionPhrase(lead: LeadIntent): string {
  if (lead.nextAction?.trim()) {
    return lead.nextAction.trim();
  }
  const suggested = resolveNextAction(lead);
  if (suggested.trim()) {
    return suggested;
  }
  return "ön değerlendirme";
}

function resolveAttributionPhrase(attributionLabel: string): string {
  return attributionLabel !== UNKNOWN ? attributionLabel : "SectorCalc";
}

function resolveIndustryPhrase(industryLabel: string): string {
  return industryLabel !== UNKNOWN ? industryLabel : "—";
}

function resolvePlanPhrase(planLabel: string): string {
  return planLabel !== UNKNOWN ? planLabel : "—";
}

function resolveSourcePagePhrase(sourcePageLabel: string): string {
  return sourcePageLabel !== UNKNOWN ? sourcePageLabel : "—";
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
    `SectorCalc üzerinden ilettiğiniz "${ctx.intentPhrase}" talebi için dönüş yapıyoruz.`,
    `Kayıt: ${ctx.attributionPhrase} · Sayfa: ${ctx.sourcePagePhrase} · Plan: ${ctx.planPhrase}`,
    "",
    `Önerilen adım: ${ctx.nextActionPhrase}. Uygun olduğunuzda kısa bir görüşme planlayabiliriz.`,
    "",
    "İyi çalışmalar,",
    "SectorCalc",
  ].join("\n");
}

export function buildLeadEmailMessage(lead: LeadIntent): string {
  const ctx = buildLeadContext(lead);
  const name = lead.name.trim() || "Yetkili";

  return [
    "Konu: SectorCalc — talebiniz hakkında",
    "",
    `Sayın ${name},`,
    "",
    `SectorCalc üzerinden ${ctx.createdLocal} tarihinde ilettiğiniz "${ctx.intentPhrase}" talebini inceledik.`,
    `Kaynak özeti: ${ctx.attributionPhrase}. Sektör: ${ctx.industryPhrase}. Plan ilgisi: ${ctx.planPhrase}.`,
    "",
    `Bir sonraki adım olarak ${ctx.nextActionPhrase} yönünde ilerleyebiliriz. Size uygun bir zaman paylaşırsanız kısa bir değerlendirme görüşmesi planlayalım.`,
    "",
    "Bu mesaj ön bilgilendirme amaçlıdır; sonuç veya getiri taahhüdü içermez.",
    "",
    "Saygılarımızla,",
    "SectorCalc",
    ctx.email ? `İletişim: ${ctx.email}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function buildLeadInternalNote(lead: LeadIntent): string {
  const ctx = buildLeadContext(lead);
  const { attribution } = ctx;

  return [
    "[SectorCalc — iç not]",
    `Lead: ${lead.name.trim() || "—"} · ${lead.company.trim() || "—"}`,
    `Tarih (yerel): ${ctx.createdLocal} · UTC: ${lead.createdAt}`,
    `Intent: ${ctx.intentPhrase}`,
    `Attribution: ${ctx.attributionPhrase}`,
    `Sayfa: ${ctx.sourcePagePhrase} · Araç: ${attribution.sourceToolLabel}`,
    `Sektör: ${ctx.industryPhrase} · Plan: ${ctx.planPhrase} · CTA: ${attribution.ctaLabel}`,
    `Next action: ${ctx.nextActionPhrase}`,
    `E-posta: ${ctx.email || "—"} · Telefon: ${ctx.phone || "—"}`,
    `Lead ID: ${lead.id}`,
  ].join("\n");
}
