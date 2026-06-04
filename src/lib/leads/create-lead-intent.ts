import { doc, setDoc } from "firebase/firestore";
import {
  getFirebaseProjectId,
  getFirestoreDb,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import {
  checkLeadRateLimit,
  LEAD_RATE_LIMIT_MESSAGE,
  recordLeadSubmission,
} from "@/lib/leads/rate-limit";
import { appendStoredLeadIntent } from "@/lib/leads/storage";
import type {
  CreateLeadIntentResult,
  LeadIntent,
  LeadIntentInput,
  LeadIntentErrors,
  LeadPlan,
  LeadSource,
} from "@/lib/leads/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX_LENGTH = 500;

const VALID_LEAD_PLANS: LeadPlan[] = [
  "single_report",
  "sector_pass",
  "pro",
  "free",
  "unknown",
];

type LeadIntentBase = Omit<LeadIntent, "storageMode">;

function createLeadId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `lead_${crypto.randomUUID()}`;
  }
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizePagePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function resolvePlan(plan: LeadPlan | undefined): LeadPlan | undefined {
  if (!plan) return undefined;
  return VALID_LEAD_PLANS.includes(plan) ? plan : undefined;
}

/** Firestore rules allow only these keys on create */
function toFirestoreWritePayload(baseLead: LeadIntentBase): LeadIntent {
  const payload: LeadIntent = {
    id: baseLead.id,
    name: baseLead.name,
    email: baseLead.email,
    company: baseLead.company,
    industry: baseLead.industry,
    toolRequested: baseLead.toolRequested,
    intendedUse: baseLead.intendedUse,
    source: baseLead.source,
    pagePath: baseLead.pagePath,
    createdAt: baseLead.createdAt,
    status: "new",
    storageMode: "firestore",
  };

  if (baseLead.message) {
    payload.message = baseLead.message;
  }

  if (baseLead.plan) {
    payload.plan = baseLead.plan;
  }

  return payload;
}

export function validateLeadIntentInput(
  input: LeadIntentInput
): LeadIntentErrors {
  const errors: LeadIntentErrors = {};

  const name = input.name.trim();
  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const email = input.email.trim();
  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const company = input.company.trim();
  if (company.length < 2) {
    errors.company = "Company name must be at least 2 characters.";
  }

  if (!input.industry.trim()) {
    errors.industry = "Select an industry.";
  }

  if (!input.toolRequested.trim()) {
    errors.toolRequested = "Select a tool or report.";
  }

  if (!input.intendedUse.trim()) {
    errors.intendedUse = "Select how you intend to use this report.";
  }

  const message = input.message?.trim() ?? "";
  if (message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

/**
 * Validates and persists a lead intent to localStorage, then Firestore via direct setDoc.
 */
export async function createLeadIntent(
  input: LeadIntentInput
): Promise<CreateLeadIntentResult> {
  console.info("[SectorCalc] Lead form submit started");

  const errors = validateLeadIntentInput(input);
  if (Object.keys(errors).length > 0) {
    return { success: false, ok: false, errors };
  }

  const rateLimit = checkLeadRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      ok: false,
      rateLimited: true,
      rateLimitMessage: rateLimit.message ?? LEAD_RATE_LIMIT_MESSAGE,
    };
  }

  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim().toLowerCase();
  const trimmedCompany = input.company.trim();
  const industry = input.industry.trim();
  const toolRequested = input.toolRequested.trim();
  const intendedUse = input.intendedUse.trim();
  const trimmedMessage = input.message?.trim();
  const source: LeadSource = input.source;
  const pagePath = normalizePagePath(input.pagePath);
  const validPlan = resolvePlan(input.plan);

  const id = createLeadId();

  const baseLead: LeadIntentBase = {
    id,
    name: trimmedName,
    email: trimmedEmail,
    company: trimmedCompany,
    industry,
    toolRequested,
    intendedUse,
    source,
    pagePath,
    createdAt: new Date().toISOString(),
    status: "new",
    ...(trimmedMessage ? { message: trimmedMessage } : {}),
    ...(validPlan ? { plan: validPlan } : {}),
  };

  const localLead: LeadIntent = {
    ...baseLead,
    storageMode: "localStorage",
  };

  appendStoredLeadIntent(localLead);
  recordLeadSubmission();

  let firestoreAttempted = false;
  let firestoreSaved = false;
  let firestoreWarning: string | undefined;

  if (isFirebaseConfigured) {
    firestoreAttempted = true;

    try {
      const db = getFirestoreDb();

      if (!db) {
        firestoreWarning = "Firestore DB is not available.";
      } else {
        const firestorePayload = toFirestoreWritePayload(baseLead);

        console.info("[SectorCalc] Normal lead Firestore write start", {
          configured: isFirebaseConfigured,
          projectId: getFirebaseProjectId(),
          id: firestorePayload.id,
          storageMode: firestorePayload.storageMode,
          payload: firestorePayload,
        });

        await setDoc(doc(db, "leadIntents", firestorePayload.id), firestorePayload);

        firestoreSaved = true;

        console.info(
          "[SectorCalc] Normal lead Firestore write success",
          firestorePayload.id
        );
      }
    } catch (error) {
      firestoreWarning =
        error instanceof Error ? error.message : String(error);

      console.error("[SectorCalc] Normal lead Firestore write failed", error);
    }
  } else {
    firestoreWarning = "Firebase is not configured.";
  }

  const result: CreateLeadIntentResult = {
    success: true,
    ok: true,
    lead: localLead,
    firestoreAttempted,
    firestoreSaved,
    firestoreWarning,
  };

  console.info("[SectorCalc] createLeadIntent result", result);

  return result;
}
