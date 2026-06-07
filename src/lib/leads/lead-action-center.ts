import {
 getLeadStatusLabel,
 resolveLeadStatus,
 resolveNextAction,
} from "@/lib/leads/lead-pipeline";
import { resolveLeadFollowUpSla } from "@/lib/leads/follow-up-sla";
import {
 computeLeadQualityScore,
 type LeadQualityScore,
} from "@/lib/leads/lead-quality-score";
import { resolveLeadAttribution } from "@/lib/leads/source-attribution";
import type { LeadIntent, LeadStatus } from "@/lib/leads/types";

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
 return quality.warnings.some((warning) => warning.includes("Mesaj"));
}

function buildChecklist(
 items: string[],
 suggestedMessageType: SuggestedMessageType
): string[] {
 const messageStep =
 suggestedMessageType === "whatsapp"
 ? "WhatsApp metnini kopyala ve manuel gönder"
 : suggestedMessageType === "email"
 ? "E-posta metnini kopyala ve manuel gönder"
 : "İç notu kopyala ve CRM/not alanına yapıştır";

 return [...items, messageStep, "Pipeline durumunu güncelle ve kaydet"];
}

function closedRecommendation(status: LeadStatus): LeadActionRecommendation {
 return {
 recommendedActionLabel: "Kapalı kayıt",
 recommendedActionReason:
 status === "converted"
 ? "Lead dönüşüm tamamladı — yeni satış aksiyonu gerekmiyor."
 : "Lead kayıp olarak işaretlendi — kapalı kayıt olarak bırakın.",
 recommendedStatus: status,
 priorityLevel: "low",
 actionChecklist: buildChecklist(
 ["Kayıt durumunu doğrula", "Kayıp/dönüşüm sebebini not al"],
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
 "Lead kalitesi düşük ve mesaj/veri zayıf görünüyor.",
 quality.warnings.length > 0 ? quality.warnings.join(" · ") : null,
 ].filter((part): part is string => Boolean(part));

 return {
 recommendedActionLabel: "Ek bilgi iste",
 recommendedActionReason: reasonParts.join(" "),
 recommendedStatus: "reviewed",
 priorityLevel: "normal",
 actionChecklist: buildChecklist(
 [
 "Eksik şirket, mesaj veya niyet bilgisini kontrol et",
 "Ek bilgi isteyen kısa mesaj hazırla",
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
 recommendedActionLabel: "Bugün dönüş yap",
 recommendedActionReason: `SLA gecikti (${slaLabel}) ve lead kalitesi ${quality.label.toLowerCase()} (${quality.score}/100).`,
 recommendedStatus: "contacted",
 priorityLevel: "urgent",
 actionChecklist: buildChecklist(
 [
 "Attribution ve intent özetini gözden geçir",
 "Bugün mutlaka iletişime geç",
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
 recommendedActionLabel: "Öncelikli ilk temas",
 recommendedActionReason: `Yeni yüksek kalite lead (${quality.score}/100). Kaynak: ${attributionLabel}.`,
 recommendedStatus: "contacted",
 priorityLevel: "high",
 actionChecklist: buildChecklist(
 ["Lead özetini oku", "İlk temas mesajını hazırla"],
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
 recommendedActionLabel: "Uygunluk görüşmesi yap",
 recommendedActionReason: `Lead incelendi ve ${quality.label.toLowerCase()} (${quality.score}/100) — uygunluk değerlendirmesi zamanı.`,
 recommendedStatus: "qualified",
 priorityLevel: "high",
 actionChecklist: buildChecklist(
 ["İhtiyaç ve bütçe uygunluğunu netleştir", "Görüşme notunu iç nota kaydet"],
 "whatsapp"
 ),
 suggestedMessageType: "whatsapp",
 shouldContactToday: true,
 };
}

function closingFollowUpRecommendation(): LeadActionRecommendation {
 return {
 recommendedActionLabel: "Teklif / kapanış takibi yap",
 recommendedActionReason:
 "Lead uygun olarak işaretlendi — teklif veya kapanış adımına geçilmeli.",
 recommendedStatus: "converted",
 priorityLevel: "normal",
 actionChecklist: buildChecklist(
 ["Son teklif veya karar durumunu kontrol et", "Kapanış takibi mesajı hazırla"],
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
 recommendedActionLabel: "Takip mesajı gönder",
 recommendedActionReason: `Temas kuruldu (${slaLabel}). ${nextAction}.`,
 recommendedStatus: "contacted",
 priorityLevel: slaLabel === "Takip zamanı" ? "high" : "normal",
 actionChecklist: buildChecklist(
 ["Son iletişim zamanını kontrol et", "Takip mesajı hazırla"],
 "whatsapp"
 ),
 suggestedMessageType: "whatsapp",
 shouldContactToday: slaLabel === "Takip zamanı" || slaLabel === "Gecikti",
 };
 }

 if (status === "new") {
 return {
 recommendedActionLabel: "İlk inceleme yap",
 recommendedActionReason: `Yeni lead — ${quality.label.toLowerCase()} (${quality.score}/100). Kaynak: ${attribution.attributionLabel}.`,
 recommendedStatus: "reviewed",
 priorityLevel: "normal",
 actionChecklist: buildChecklist(
 ["Lead formunu incele", "Durumu İncelendi olarak güncelle"],
 "internal_note"
 ),
 suggestedMessageType: "internal_note",
 shouldContactToday: false,
 };
 }

 if (status === "reviewed") {
 return {
 recommendedActionLabel: "İletişime geç",
 recommendedActionReason: `${nextAction}. Kalite: ${quality.score}/100.`,
 recommendedStatus: "contacted",
 priorityLevel: "normal",
 actionChecklist: buildChecklist(
 ["İnceleme notunu kontrol et", "İletişim mesajı hazırla"],
 "whatsapp"
 ),
 suggestedMessageType: "whatsapp",
 shouldContactToday: false,
 };
 }

 return {
 recommendedActionLabel: nextAction,
 recommendedActionReason: `Mevcut durum: ${getLeadStatusLabel(status)}. SLA: ${slaLabel}.`,
 recommendedStatus: status,
 priorityLevel: "normal",
 actionChecklist: buildChecklist(
 ["Lead kaydını gözden geçir", "Sonraki adımı planla"],
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
