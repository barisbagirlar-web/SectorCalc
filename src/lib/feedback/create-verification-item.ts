import { getAdminFirestore } from "@/lib/firebase/admin";
import type {
  VerificationQueueItem,
  VerificationQueueSubmitInput,
} from "@/lib/feedback/feedback-types";
import { VERIFICATION_QUEUE_COLLECTION } from "@/lib/feedback/feedback-types";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_EMAIL_LENGTH = 120;

export type CreateVerificationItemResult =
  | { readonly ok: true; readonly id: string }
  | { readonly ok: false; readonly error: string };

function sanitizeMessage(value: string): string {
  return value.trim().slice(0, MAX_MESSAGE_LENGTH);
}

export function validateVerificationQueueInput(
  input: VerificationQueueSubmitInput,
): CreateVerificationItemResult | { readonly ok: true; readonly item: VerificationQueueItem } {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: false, error: "rejected" };
  }

  if (!input.toolSlug.trim()) {
    return { ok: false, error: "toolSlug required" };
  }
  if (!input.locale.trim()) {
    return { ok: false, error: "locale required" };
  }
  if (!input.message.trim()) {
    return { ok: false, error: "message required" };
  }
  if (input.email && input.email.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: "email too long" };
  }

  const item: VerificationQueueItem = {
    toolSlug: input.toolSlug.trim(),
    locale: input.locale.trim(),
    region: input.region?.trim(),
    issueType: input.issueType,
    message: sanitizeMessage(input.message),
    email: input.email?.trim() || undefined,
    inputSnapshot: input.inputSnapshot,
    resultSnapshot: input.resultSnapshot,
    status: "open",
    createdAt: new Date().toISOString(),
    pageUrl: input.pageUrl.trim(),
    userAgent: input.userAgent?.slice(0, 300),
  };

  return { ok: true, item };
}

export async function persistVerificationQueueItem(
  item: VerificationQueueItem,
): Promise<CreateVerificationItemResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, error: "admin_unavailable" };
  }

  const id = `vq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await db.collection(VERIFICATION_QUEUE_COLLECTION).doc(id).set({
    ...item,
    id,
  });

  return { ok: true, id };
}

export async function createVerificationQueueItem(
  input: VerificationQueueSubmitInput,
): Promise<CreateVerificationItemResult> {
  const validated = validateVerificationQueueInput(input);
  if (!validated.ok) {
    return validated;
  }
  if ("item" in validated) {
    return persistVerificationQueueItem(validated.item);
  }
  return validated;
}
