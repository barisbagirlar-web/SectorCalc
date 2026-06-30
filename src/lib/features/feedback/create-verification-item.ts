import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import type {
  VerificationQueueItem,
  VerificationQueueSubmitInput,
  VerificationQueueTier,
} from "@/lib/features/feedback/feedback-types";
import {
  VERIFICATION_MESSAGE_MAX_LENGTH,
  VERIFICATION_MESSAGE_MIN_LENGTH,
  VERIFICATION_QUEUE_COLLECTION,
  VERIFICATION_SNAPSHOT_MAX_KEYS,
  VERIFICATION_SNAPSHOT_VALUE_MAX_LENGTH,
} from "@/lib/features/feedback/feedback-types";

const MAX_EMAIL_LENGTH = 120;
const HTML_TAG_PATTERN = /<[^>]*>/g;

const SECRET_KEY_PATTERN =
  /password|secret|token|api[_-]?key|authorization|private[_-]?key|credential/i;

const SECRET_VALUE_PATTERN = /BEGIN (?:RSA )?PRIVATE KEY|sk_live_|sk_test_/i;

export type CreateVerificationItemResult =
  | { readonly ok: true; readonly id: string }
  | { readonly ok: false; readonly error: string };

export function sanitizeVerificationMessage(value: string): string {
  return value.replace(HTML_TAG_PATTERN, "").replace(/\0/g, "").trim().slice(0, VERIFICATION_MESSAGE_MAX_LENGTH);
}

function normalizeTier(value: unknown): VerificationQueueTier {
  if (value === "free" || value === "premium") {
    return value;
  }
  return "unknown";
}

function sanitizeSnapshotValue(value: unknown): string | number | boolean | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.replace(HTML_TAG_PATTERN, "").replace(/\0/g, "").trim();
    if (trimmed.length === 0) {
      return null;
    }
    if (SECRET_VALUE_PATTERN.test(trimmed)) {
      return null;
    }
    return trimmed.slice(0, VERIFICATION_SNAPSHOT_VALUE_MAX_LENGTH);
  }
  return null;
}

export function sanitizeVerificationSnapshot(
  snapshot: Record<string, unknown> | undefined,
): Record<string, string | number | boolean> | undefined {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return undefined;
  }

  const entries = Object.entries(snapshot).slice(0, VERIFICATION_SNAPSHOT_MAX_KEYS);
  const sanitized: Record<string, string | number | boolean> = {};

  for (const [rawKey, rawValue] of entries) {
    const key = rawKey.trim().slice(0, 80);
    if (key.length < 1 || SECRET_KEY_PATTERN.test(key)) {
      continue;
    }
    const value = sanitizeSnapshotValue(rawValue);
    if (value !== null) {
      sanitized[key] = value;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

export function validateVerificationQueueInput(
  input: VerificationQueueSubmitInput,
): CreateVerificationItemResult | { readonly ok: true; readonly item: VerificationQueueItem } {
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: false, error: "rejected" };
  }

  const toolSlug = input.toolSlug.trim();
  if (toolSlug.length < 2 || toolSlug.length > 80) {
    return { ok: false, error: "toolSlug required" };
  }

  const locale = input.locale.trim();
  if (locale.length < 2 || locale.length > 8) {
    return { ok: false, error: "locale required" };
  }

  const message = sanitizeVerificationMessage(input.message);
  if (message.length < VERIFICATION_MESSAGE_MIN_LENGTH) {
    return { ok: false, error: "message too short" };
  }

  if (input.email && input.email.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: "email too long" };
  }

  const userId =
    typeof input.userId === "string" && input.userId.trim().length >= 8
      ? input.userId.trim().slice(0, 128)
      : undefined;

  const item: VerificationQueueItem = {
    toolSlug,
    locale,
    tier: normalizeTier(input.tier),
    region: input.region?.trim().slice(0, 80) || undefined,
    issueType: input.issueType,
    message,
    email: input.email?.trim().slice(0, MAX_EMAIL_LENGTH) || undefined,
    userId,
    inputSnapshot: sanitizeVerificationSnapshot(input.inputSnapshot),
    resultSnapshot: sanitizeVerificationSnapshot(input.resultSnapshot),
    status: "open",
    createdAt: new Date().toISOString(),
    pageUrl: input.pageUrl.trim().slice(0, 256) || "/",
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
