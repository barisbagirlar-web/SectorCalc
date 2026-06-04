import { LEAD_INDUSTRY_OPTIONS } from "@/data/lead-options";
import { resolveLeadStatus } from "@/lib/leads/lead-pipeline";
import { resolveLeadFollowUpSla } from "@/lib/leads/follow-up-sla";
import { resolveLeadAttribution } from "@/lib/leads/source-attribution";
import type { LeadIntent, LeadPlan } from "@/lib/leads/types";

export type LeadQualityLevel = "high" | "medium" | "low";

export interface LeadQualityScore {
  score: number;
  level: LeadQualityLevel;
  label: string;
  reasons: string[];
  warnings: string[];
}

export interface LeadQualitySummary {
  highCount: number;
  mediumCount: number;
  lowCount: number;
  averageScore: number;
}

const LEVEL_LABELS: Record<LeadQualityLevel, string> = {
  high: "Yüksek kalite",
  medium: "Orta kalite",
  low: "Düşük kalite",
};

const WEAK_COMPANY_PATTERNS = ["deneme", "test", "dfdf", "asdf", "123"];
const WEAK_MESSAGE_PATTERNS = ["test", "deneme", "123", "dddd", "dfdf"];

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "yahoo.co.uk",
  "icloud.com",
]);

const KNOWN_INDUSTRY_VALUES = new Set(
  LEAD_INDUSTRY_OPTIONS.map((option) => option.value.toLowerCase())
);

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeText(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function containsWeakPattern(value: string, patterns: string[]): boolean {
  const normalized = normalizeText(value);
  if (!normalized) {
    return false;
  }
  return patterns.some(
    (pattern) => normalized === pattern || normalized.includes(pattern)
  );
}

function resolvePagePath(lead: LeadIntent): string {
  return (lead.sourcePath ?? lead.path ?? lead.pagePath ?? "").trim().toLowerCase();
}

function scorePlan(plan: LeadPlan | undefined): {
  points: number;
  reason?: string;
} {
  switch (plan) {
    case "single_report":
    case "sector_pass":
      return { points: 25, reason: "Premium plan seçimi" };
    case "pro":
      return { points: 18, reason: "Pro plan seçimi" };
    case "free":
      return { points: 5, reason: "Free plan seçimi" };
    default:
      return { points: 0 };
  }
}

function scoreSourceAttribution(lead: LeadIntent): {
  points: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let points = 0;
  const pagePath = resolvePagePath(lead);
  const attribution = resolveLeadAttribution(lead);

  if (lead.source === "pricing" || pagePath.includes("/pricing")) {
    points += 15;
    reasons.push("Pricing sayfası kaynağı");
  }

  if (
    attribution.toolTierLabel === "Premium Tool" ||
    pagePath.includes("/tools/premium/")
  ) {
    points += 15;
    reasons.push("Premium araç kaynağı");
  }

  if (pagePath.includes("/for-consultants")) {
    points += 12;
    reasons.push("Consultant sayfası kaynağı");
  }

  if (
    attribution.toolTierLabel === "Free Tool" ||
    pagePath.includes("/tools/free/")
  ) {
    points += 5;
    reasons.push("Free araç kaynağı");
  }

  return { points, reasons };
}

function scoreCompany(company: string): {
  points: number;
  reason?: string;
  warning?: string;
} {
  const trimmed = company.trim();
  if (!trimmed) {
    return { points: 0 };
  }
  if (containsWeakPattern(trimmed, WEAK_COMPANY_PATTERNS)) {
    return {
      points: 0,
      warning: "Şirket adı zayıf veya test görünüyor",
    };
  }
  return { points: 10, reason: "Geçerli şirket adı" };
}

function extractEmailDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return null;
  }
  return trimmed.slice(atIndex + 1);
}

function isInvalidEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) {
    return true;
  }

  const [local, domain] = trimmed.split("@");
  if (!local || !domain || !domain.includes(".")) {
    return true;
  }

  if (local === "test" && (domain === "test.com" || domain.startsWith("test."))) {
    return true;
  }

  return domain === "example.com" || domain === "test.com";
}

function scoreEmail(email: string): {
  points: number;
  reason?: string;
  warning?: string;
} {
  const trimmed = email.trim();
  if (!trimmed) {
    return { points: 0, warning: "E-posta eksik" };
  }

  if (isInvalidEmail(trimmed)) {
    return {
      points: 0,
      warning: "E-posta geçersiz veya test görünüyor",
    };
  }

  const domain = extractEmailDomain(trimmed);
  if (!domain) {
    return {
      points: 0,
      warning: "E-posta geçersiz veya test görünüyor",
    };
  }

  if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return { points: 5, reason: "Kişisel e-posta domaini" };
  }

  return { points: 15, reason: "Kurumsal e-posta domaini" };
}

function scoreIntendedUse(intendedUse: string): {
  points: number;
  reason?: string;
} {
  const normalized = normalizeText(intendedUse);
  if (!normalized) {
    return { points: 0 };
  }

  if (normalized.includes("prepare a client report")) {
    return { points: 15, reason: "Müşteri raporu hazırlama niyeti" };
  }
  if (normalized.includes("price a job")) {
    return { points: 12, reason: "İş fiyatlama niyeti" };
  }
  if (normalized.includes("check margin risk")) {
    return { points: 10, reason: "Marj riski kontrolü niyeti" };
  }

  return { points: 0 };
}

function scoreMessage(message: string | undefined): {
  points: number;
  reason?: string;
  warning?: string;
} {
  const trimmed = message?.trim() ?? "";
  if (!trimmed) {
    return { points: 0 };
  }

  if (containsWeakPattern(trimmed, WEAK_MESSAGE_PATTERNS)) {
    return {
      points: 0,
      warning: "Mesaj zayıf veya test görünüyor",
    };
  }

  if (trimmed.length >= 20) {
    return { points: 10, reason: "Anlamlı mesaj içeriği" };
  }
  if (trimmed.length >= 5) {
    return { points: 3, reason: "Kısa mesaj içeriği" };
  }

  return { points: 0 };
}

function scoreIndustry(industry: string): {
  points: number;
  reason?: string;
} {
  const normalized = normalizeText(industry);
  if (!normalized || normalized === "unknown") {
    return { points: 0 };
  }

  if (KNOWN_INDUSTRY_VALUES.has(normalized)) {
    return { points: 5, reason: "Bilinen sektör seçimi" };
  }

  return { points: 5, reason: "Sektör bilgisi mevcut" };
}

function scoreSla(
  lead: LeadIntent,
  referenceDate: Date
): {
  points: number;
  reason?: string;
  warning?: string;
} {
  const status = resolveLeadStatus(lead);
  const sla = resolveLeadFollowUpSla(lead, referenceDate);

  if (status === "converted" || status === "lost") {
    return {
      points: 0,
      warning: "Lead kapanmış — aktif öncelik skoru düşük önem taşır",
    };
  }

  if (sla.slaLevel === "urgent") {
    return { points: 5, reason: "Geciken açık lead — acil takip" };
  }

  return { points: 0 };
}

function resolveQualityLevel(score: number): LeadQualityLevel {
  if (score >= 80) {
    return "high";
  }
  if (score >= 50) {
    return "medium";
  }
  return "low";
}

export function computeLeadQualityScore(
  lead: LeadIntent,
  referenceDate: Date = new Date()
): LeadQualityScore {
  const reasons: string[] = [];
  const warnings: string[] = [];
  let total = 0;

  const plan = scorePlan(lead.plan);
  total += plan.points;
  if (plan.reason) reasons.push(plan.reason);

  const source = scoreSourceAttribution(lead);
  total += source.points;
  reasons.push(...source.reasons);

  const company = scoreCompany(lead.company);
  total += company.points;
  if (company.reason) reasons.push(company.reason);
  if (company.warning) warnings.push(company.warning);

  const email = scoreEmail(lead.email);
  total += email.points;
  if (email.reason) reasons.push(email.reason);
  if (email.warning) warnings.push(email.warning);

  const intendedUse = scoreIntendedUse(lead.intendedUse);
  total += intendedUse.points;
  if (intendedUse.reason) reasons.push(intendedUse.reason);

  const message = scoreMessage(lead.message);
  total += message.points;
  if (message.reason) reasons.push(message.reason);
  if (message.warning) warnings.push(message.warning);

  const industry = scoreIndustry(lead.industry);
  total += industry.points;
  if (industry.reason) reasons.push(industry.reason);

  const sla = scoreSla(lead, referenceDate);
  total += sla.points;
  if (sla.reason) reasons.push(sla.reason);
  if (sla.warning) warnings.push(sla.warning);

  const score = clampScore(total);
  const level = resolveQualityLevel(score);

  return {
    score,
    level,
    label: LEVEL_LABELS[level],
    reasons,
    warnings,
  };
}

export function computeLeadQualitySummary(
  leads: LeadIntent[],
  referenceDate: Date = new Date()
): LeadQualitySummary {
  if (leads.length === 0) {
    return {
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      averageScore: 0,
    };
  }

  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let scoreSum = 0;

  for (const lead of leads) {
    const quality = computeLeadQualityScore(lead, referenceDate);
    scoreSum += quality.score;

    switch (quality.level) {
      case "high":
        highCount += 1;
        break;
      case "medium":
        mediumCount += 1;
        break;
      case "low":
        lowCount += 1;
        break;
      default:
        break;
    }
  }

  const averageScore = clampScore(scoreSum / leads.length);

  return {
    highCount,
    mediumCount,
    lowCount,
    averageScore,
  };
}
