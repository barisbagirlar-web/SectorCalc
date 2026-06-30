import { isBrowser } from "@/lib/leads/storage";
import {
  CALCULATOR_FEEDBACK_CATEGORIES,
  CALCULATOR_FEEDBACK_COMMENT_MAX_LENGTH,
  CALCULATOR_FEEDBACK_SNAPSHOT_MAX_KEYS,
  type CalculatorFeedbackCategory,
  type CalculatorFeedbackFieldErrors,
  type CalculatorFeedbackInput,
  type CalculatorFeedbackTier,
} from "@/lib/feedback/calculator-feedback-types";

const COOLDOWN_STORAGE_KEY = "sectorcalc:calculator-feedback-cooldown";
const COOLDOWN_MS = 2 * 60 * 1000;

export const CALCULATOR_FEEDBACK_RATE_LIMIT_MESSAGE =
  "Please wait before sending another feedback report for this tool.";

const VALID_TIERS: CalculatorFeedbackTier[] = ["free", "premium", "traffic"];

interface CooldownState {
  byTool: Record<string, number>;
}

function readCooldownState(): CooldownState {
  if (!isBrowser()) {
    return { byTool: {} };
  }

  try {
    const raw = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!raw) {
      return { byTool: {} };
    }
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("byTool" in parsed) ||
      typeof (parsed as CooldownState).byTool !== "object"
    ) {
      return { byTool: {} };
    }
    return { byTool: (parsed as CooldownState).byTool };
  } catch {
    return { byTool: {} };
  }
}

function writeCooldownState(state: CooldownState): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(state));
}

function isValidCategory(value: string): value is CalculatorFeedbackCategory {
  return (CALCULATOR_FEEDBACK_CATEGORIES as readonly string[]).includes(value);
}

function isValidTier(value: string): value is CalculatorFeedbackTier {
  return VALID_TIERS.includes(value as CalculatorFeedbackTier);
}

function normalizePagePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function validateSnapshot(
  snapshot: Readonly<Record<string, unknown>> | undefined,
  field: "inputSnapshot" | "resultSnapshot",
  errors: CalculatorFeedbackFieldErrors
): void {
  if (snapshot === undefined) {
    return;
  }

  if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) {
    errors[field] = "Snapshot must be an object.";
    return;
  }

  const keys = Object.keys(snapshot);
  if (keys.length > CALCULATOR_FEEDBACK_SNAPSHOT_MAX_KEYS) {
    errors[field] = `Snapshot may include at most ${CALCULATOR_FEEDBACK_SNAPSHOT_MAX_KEYS} keys.`;
    return;
  }

  for (const key of keys) {
    const value = snapshot[key];
    if (
      typeof value !== "number" &&
      typeof value !== "string" &&
      typeof value !== "boolean"
    ) {
      errors[field] = "Snapshot values must be numbers, strings, or booleans.";
      return;
    }
  }
}

export function validateCalculatorFeedbackInput(
  input: CalculatorFeedbackInput
): CalculatorFeedbackFieldErrors {
  const errors: CalculatorFeedbackFieldErrors = {};

  const toolSlug = input.toolSlug.trim();
  if (toolSlug.length < 2 || toolSlug.length > 80) {
    errors.toolSlug = "Tool slug is required.";
  }

  if (!isValidTier(input.tier)) {
    errors.tier = "Select a valid tool tier.";
  }

  const category = input.category.trim();
  if (!category || !isValidCategory(category)) {
    errors.category = "Select a feedback category.";
  }

  const comment = input.comment.trim();
  if (category === "other" && comment.length < 4) {
    errors.comment = "Describe the issue in at least 4 characters.";
  }
  if (comment.length > CALCULATOR_FEEDBACK_COMMENT_MAX_LENGTH) {
    errors.comment = `Comment must be ${CALCULATOR_FEEDBACK_COMMENT_MAX_LENGTH} characters or fewer.`;
  }

  const pagePath = normalizePagePath(input.pagePath);
  if (pagePath.length < 1 || pagePath.length > 256 || !pagePath.startsWith("/")) {
    errors.pagePath = "Page path is invalid.";
  }

  validateSnapshot(input.inputSnapshot, "inputSnapshot", errors);
  validateSnapshot(input.resultSnapshot, "resultSnapshot", errors);

  return errors;
}

export interface CalculatorFeedbackRateLimitCheck {
  allowed: boolean;
  message?: string;
}

export function checkCalculatorFeedbackRateLimit(
  toolSlug: string,
  now = Date.now()
): CalculatorFeedbackRateLimitCheck {
  if (!isBrowser()) {
    return { allowed: true };
  }

  const normalizedSlug = toolSlug.trim();
  if (!normalizedSlug) {
    return { allowed: true };
  }

  const state = readCooldownState();
  const lastSubmitted = state.byTool[normalizedSlug];
  if (typeof lastSubmitted === "number" && now - lastSubmitted < COOLDOWN_MS) {
    return {
      allowed: false,
      message: CALCULATOR_FEEDBACK_RATE_LIMIT_MESSAGE,
    };
  }

  return { allowed: true };
}

export function recordCalculatorFeedbackSubmission(
  toolSlug: string,
  now = Date.now()
): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedSlug = toolSlug.trim();
  if (!normalizedSlug) {
    return;
  }

  const state = readCooldownState();
  state.byTool[normalizedSlug] = now;
  writeCooldownState(state);
}
