import type {
  BetaPartner,
  BetaPartnerInput,
  BetaPartnerSubmitResult,
} from "@/lib/features/benchmarks/benchmark-types";
import {
  writeBetaPartnerToFirestore,
  writeBenchmarkSubmissionToFirestore,
} from "@/lib/features/benchmarks/benchmark-firestore-write";
import { benchmarkSubmissionFromBetaPartner } from "@/lib/features/benchmarks/create-benchmark-submission";
import { validateBetaPartnerInput } from "@/lib/features/benchmarks/validate-benchmark-inputs";
import {
  checkLeadRateLimit,
  LEAD_RATE_LIMIT_MESSAGE,
  recordLeadSubmission,
} from "@/lib/features/leads/rate-limit";

function createBetaPartnerId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `beta_${crypto.randomUUID()}`;
  }
  return `beta_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizePagePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/beta-partner";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export async function createBetaPartnerLead(
  input: BetaPartnerInput
): Promise<BetaPartnerSubmitResult> {
  const errors = validateBetaPartnerInput(input);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const rateLimit = checkLeadRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      rateLimited: true,
      errors: { form: rateLimit.message ?? LEAD_RATE_LIMIT_MESSAGE },
    };
  }

  const now = new Date().toISOString();
  const partner: BetaPartner = {
    id: createBetaPartnerId(),
    createdAt: now,
    updatedAt: now,
    status: "new",
    companyName: input.companyName.trim(),
    contactName: input.contactName.trim(),
    email: input.email.trim().toLowerCase(),
    country: input.country.trim(),
    industry: input.industry.trim(),
    companySize: input.companySize.trim(),
    role: input.role.trim(),
    mainLossArea: input.mainLossArea.trim(),
    currentMethod: input.currentMethod.trim(),
    monthlyEstimatedLossRange: input.monthlyEstimatedLossRange.trim(),
    wantsCaseStudyPermission: input.wantsCaseStudyPermission,
    notes: input.notes.trim(),
  };

  recordLeadSubmission();

  let firestoreSaved = false;
  try {
    firestoreSaved = await writeBetaPartnerToFirestore(partner);
    if (firestoreSaved) {
      const intakeSubmission = benchmarkSubmissionFromBetaPartner(partner);
      await writeBenchmarkSubmissionToFirestore(intakeSubmission);
    }
  } catch {
    firestoreSaved = false;
  }

  return {
    success: true,
    firestoreSaved,
  };
}

export function buildDefaultBetaPartnerInput(pagePath: string): BetaPartnerInput {
  return {
    companyName: "",
    contactName: "",
    email: "",
    country: "",
    industry: "",
    companySize: "",
    role: "",
    mainLossArea: "",
    currentMethod: "",
    monthlyEstimatedLossRange: "",
    wantsCaseStudyPermission: false,
    notes: "",
    pagePath: normalizePagePath(pagePath),
  };
}
