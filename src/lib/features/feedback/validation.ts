import {
  FEEDBACK_KINDS,
  FEEDBACK_MESSAGE_MAX_LENGTH,
  FEEDBACK_MESSAGE_MIN_LENGTH,
  FEEDBACK_SNAPSHOT_MAX_KEYS,
  type FeedbackKind,
  type FeedbackSeverity,
  type FeedbackSource,
  type FeedbackToolType,
  type ToolFeedbackFieldErrors,
  type ToolFeedbackSubmitInput,
} from "@/lib/features/feedback/types";

const VALID_SOURCES: FeedbackSource[] = [
  "premium_tool",
  "free_tool",
  "smart_form",
  "report",
  "verify",
  "unknown",
];

const VALID_TOOL_TYPES: FeedbackToolType[] = ["free", "premium", "unknown"];

const HTML_TAG_PATTERN = /<[^>]*>/g;

export function sanitizeFeedbackText(value: string): string {
  return value.replace(HTML_TAG_PATTERN, "").replace(/\0/g, "").trim();
}

export function normalizeFeedbackKind(kind: string): FeedbackKind | null {
  const normalized = kind.trim() as FeedbackKind;
  return (FEEDBACK_KINDS as readonly string[]).includes(normalized) ? normalized : null;
}

export function getFeedbackSeverity(kind: FeedbackKind): FeedbackSeverity {
  switch (kind) {
    case "formula_objection":
    case "wrong_result":
      return "high";
    case "missing_input":
    case "improvement_request":
    case "sector_adjustment":
    case "data_source_suggestion":
      return "medium";
    case "usability_issue":
    case "other":
      return "low";
    default:
      return "medium";
  }
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeRoutePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function validateOptionalText(
  value: string | undefined,
  maxLength: number,
  field: keyof ToolFeedbackFieldErrors,
  errors: ToolFeedbackFieldErrors,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const sanitized = sanitizeFeedbackText(value);
  if (sanitized.length > maxLength) {
    errors[field] = "tooLong";
    return undefined;
  }
  return sanitized.length > 0 ? sanitized : undefined;
}

function validateSnapshot(
  snapshot: Readonly<Record<string, unknown>> | undefined,
  field: "inputSnapshot" | "resultSnapshot",
  errors: ToolFeedbackFieldErrors,
): void {
  if (snapshot === undefined) {
    return;
  }
  if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) {
    errors[field] = "invalid";
    return;
  }
  const keys = Object.keys(snapshot);
  if (keys.length > FEEDBACK_SNAPSHOT_MAX_KEYS) {
    errors[field] = "tooManyKeys";
    return;
  }
  for (const key of keys) {
    const value = snapshot[key];
    if (
      typeof value !== "number" &&
      typeof value !== "string" &&
      typeof value !== "boolean"
    ) {
      errors[field] = "invalid";
      return;
    }
  }
}

export function validateFeedbackPayload(
  input: ToolFeedbackSubmitInput,
): ToolFeedbackFieldErrors {
  const errors: ToolFeedbackFieldErrors = {};

  if (input.companyWebsiteHidden && input.companyWebsiteHidden.trim().length > 0) {
    errors.form = "honeypot";
    return errors;
  }

  const kind = normalizeFeedbackKind(String(input.kind));
  if (!kind) {
    errors.kind = "required";
  }

  const message = sanitizeFeedbackText(input.message);
  if (message.length < FEEDBACK_MESSAGE_MIN_LENGTH) {
    errors.message = "tooShort";
  }
  if (message.length > FEEDBACK_MESSAGE_MAX_LENGTH) {
    errors.message = "tooLong";
  }

  const toolSlug = sanitizeFeedbackText(input.toolSlug);
  if (toolSlug.length < 2 || toolSlug.length > 80) {
    errors.toolSlug = "required";
  }

  const locale = sanitizeFeedbackText(input.locale);
  if (locale.length < 2 || locale.length > 8) {
    errors.locale = "required";
  }

  const routePath = normalizeRoutePath(input.routePath);
  if (routePath.length < 1 || routePath.length > 256) {
    errors.routePath = "required";
  }

  if (!VALID_TOOL_TYPES.includes(input.toolType)) {
    errors.form = "invalidToolType";
  }

  if (!VALID_SOURCES.includes(input.source)) {
    errors.form = "invalidSource";
  }

  validateOptionalText(input.expectedBehavior, 1000, "expectedBehavior", errors);
  validateOptionalText(input.actualBehavior, 1000, "actualBehavior", errors);
  validateOptionalText(input.sectorContext, 500, "sectorContext", errors);
  validateOptionalText(input.suggestedFormulaChange, 1500, "suggestedFormulaChange", errors);
  validateOptionalText(input.suggestedInput, 500, "suggestedInput", errors);

  const dataSourceUrl = input.dataSourceUrl ? sanitizeFeedbackText(input.dataSourceUrl) : "";
  if (dataSourceUrl.length > 0 && !isValidUrl(dataSourceUrl)) {
    errors.dataSourceUrl = "invalidUrl";
  }

  validateSnapshot(input.inputSnapshot, "inputSnapshot", errors);
  validateSnapshot(input.resultSnapshot, "resultSnapshot", errors);

  return errors;
}

export function buildFeedbackPayload(
  input: ToolFeedbackSubmitInput,
): Omit<ToolFeedbackSubmitInput, "companyWebsiteHidden" | "kind"> & { kind: FeedbackKind } | null {
  const errors = validateFeedbackPayload(input);
  if (Object.keys(errors).length > 0) {
    return null;
  }

  const kind = normalizeFeedbackKind(String(input.kind));
  if (!kind) {
    return null;
  }

  const optional = (value: string | undefined, max: number): string | undefined => {
    if (!value) {
      return undefined;
    }
    const sanitized = sanitizeFeedbackText(value);
    return sanitized.length > 0 && sanitized.length <= max ? sanitized : undefined;
  };

  const dataSourceUrl = input.dataSourceUrl ? sanitizeFeedbackText(input.dataSourceUrl) : "";

  return {
    kind,
    message: sanitizeFeedbackText(input.message),
    expectedBehavior: optional(input.expectedBehavior, 1000),
    actualBehavior: optional(input.actualBehavior, 1000),
    sectorContext: optional(input.sectorContext, 500),
    suggestedFormulaChange: optional(input.suggestedFormulaChange, 1500),
    suggestedInput: optional(input.suggestedInput, 500),
    dataSourceUrl: dataSourceUrl.length > 0 ? dataSourceUrl : undefined,
    toolSlug: sanitizeFeedbackText(input.toolSlug),
    toolType: input.toolType,
    locale: sanitizeFeedbackText(input.locale),
    routePath: normalizeRoutePath(input.routePath),
    source: input.source,
    formulaVersion: optional(input.formulaVersion, 80),
    formulaContractId: optional(input.formulaContractId, 120),
    calculationHash: optional(input.calculationHash, 128),
    reportId: optional(input.reportId, 80),
    inputSnapshot: input.inputSnapshot,
    resultSnapshot: input.resultSnapshot,
    userId: input.userId ?? null,
    userEmail: input.userEmail ?? null,
    sessionId: input.sessionId ?? null,
  };
}
