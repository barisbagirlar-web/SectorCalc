import { doc, setDoc } from "firebase/firestore";
import {
  CALCULATOR_FEEDBACK_COLLECTION,
  type CalculatorFeedback,
  type CalculatorFeedbackInput,
  type CalculatorFeedbackSubmitResult,
} from "@/lib/features/feedback/calculator-feedback-types";
import {
  checkCalculatorFeedbackRateLimit,
  CALCULATOR_FEEDBACK_RATE_LIMIT_MESSAGE,
  recordCalculatorFeedbackSubmission,
  validateCalculatorFeedbackInput,
} from "@/lib/features/feedback/calculator-feedback-validation";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/infrastructure/firebase/client";

function createCalculatorFeedbackId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `calcfb_${crypto.randomUUID()}`;
  }
  return `calcfb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizePagePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function toFirestorePayload(input: CalculatorFeedbackInput): CalculatorFeedback {
  const payload: CalculatorFeedback = {
    id: createCalculatorFeedbackId(),
    createdAt: new Date().toISOString(),
    toolSlug: input.toolSlug.trim(),
    tier: input.tier,
    category: input.category as CalculatorFeedback["category"],
    comment: input.comment.trim(),
    pagePath: normalizePagePath(input.pagePath),
  };

  const hasInputSnapshot =
    input.inputSnapshot !== undefined && Object.keys(input.inputSnapshot).length > 0;
  const hasResultSnapshot =
    input.resultSnapshot !== undefined && Object.keys(input.resultSnapshot).length > 0;

  if (hasInputSnapshot || hasResultSnapshot) {
    return {
      ...payload,
      ...(hasInputSnapshot ? { inputSnapshot: input.inputSnapshot } : {}),
      ...(hasResultSnapshot ? { resultSnapshot: input.resultSnapshot } : {}),
    };
  }

  return payload;
}

async function writeCalculatorFeedbackToFirestore(
  feedback: CalculatorFeedback
): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }

  const db = getFirestoreDb();
  if (!db) {
    return false;
  }

  await setDoc(doc(db, CALCULATOR_FEEDBACK_COLLECTION, feedback.id), feedback);
  return true;
}

export async function submitCalculatorFeedback(
  input: CalculatorFeedbackInput
): Promise<CalculatorFeedbackSubmitResult> {
  const errors = validateCalculatorFeedbackInput(input);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const rateLimit = checkCalculatorFeedbackRateLimit(input.toolSlug);
  if (!rateLimit.allowed) {
    return {
      success: false,
      rateLimited: true,
      errors: { form: rateLimit.message ?? CALCULATOR_FEEDBACK_RATE_LIMIT_MESSAGE },
    };
  }

  const feedback = toFirestorePayload(input);
  recordCalculatorFeedbackSubmission(input.toolSlug);

  let firestoreSaved = false;
  try {
    firestoreSaved = await writeCalculatorFeedbackToFirestore(feedback);
  } catch {
    firestoreSaved = false;
  }

  return {
    success: true,
    firestoreSaved,
  };
}
