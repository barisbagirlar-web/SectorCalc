import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type QueryConstraint,
} from "firebase/firestore";
import {
  checkCalculatorFeedbackRateLimit,
  recordCalculatorFeedbackSubmission,
} from "@/lib/feedback/calculator-feedback-validation";
import {
  TOOL_FEEDBACK_COLLECTION,
  type FeedbackKind,
  type FeedbackSeverity,
  type FeedbackSource,
  type FeedbackStatus,
  type FeedbackToolType,
  type ToolFeedbackDocument,
  type ToolFeedbackFieldErrors,
  type ToolFeedbackSubmitInput,
  type ToolFeedbackSubmitResult,
} from "@/lib/feedback/types";
import {
  buildFeedbackPayload,
  getFeedbackSeverity,
  sanitizeFeedbackText,
  validateFeedbackPayload,
} from "@/lib/feedback/validation";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { isBrowser } from "@/lib/leads/storage";

const SESSION_STORAGE_KEY = "sectorcalc:tool-feedback-session";

function createFeedbackId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `tfb_${crypto.randomUUID()}`;
  }
  return `tfb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getOrCreateFeedbackSessionId(): string {
  if (!isBrowser()) {
    return "server";
  }
  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && existing.length >= 8) {
      return existing;
    }
    const next = createFeedbackId();
    localStorage.setItem(SESSION_STORAGE_KEY, next);
    return next;
  } catch {
    return createFeedbackId();
  }
}

function normalizeRoutePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function toFirestoreDocument(
  input: Omit<ToolFeedbackSubmitInput, "companyWebsiteHidden"> & { kind: FeedbackKind },
): ToolFeedbackDocument {
  const now = new Date().toISOString();
  const severity = getFeedbackSeverity(input.kind);
  const base: ToolFeedbackDocument = {
    id: createFeedbackId(),
    kind: input.kind,
    status: "new",
    severity,
    source: input.source,
    toolSlug: input.toolSlug,
    toolType: input.toolType,
    locale: input.locale,
    routePath: normalizeRoutePath(input.routePath),
    message: input.message,
    userId: input.userId ?? null,
    userEmail: input.userEmail ?? null,
    sessionId: input.sessionId ?? null,
    userAgent: isBrowser() ? navigator.userAgent.slice(0, 256) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  const optionalFields: Array<
    keyof Pick<
      ToolFeedbackDocument,
      | "expectedBehavior"
      | "actualBehavior"
      | "sectorContext"
      | "suggestedFormulaChange"
      | "suggestedInput"
      | "dataSourceUrl"
      | "formulaVersion"
      | "formulaContractId"
      | "calculationHash"
      | "reportId"
      | "inputSnapshot"
      | "resultSnapshot"
    >
  > = [
    "expectedBehavior",
    "actualBehavior",
    "sectorContext",
    "suggestedFormulaChange",
    "suggestedInput",
    "dataSourceUrl",
    "formulaVersion",
    "formulaContractId",
    "calculationHash",
    "reportId",
    "inputSnapshot",
    "resultSnapshot",
  ];

  let docPayload: ToolFeedbackDocument = { ...base };
  for (const field of optionalFields) {
    const value = input[field];
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object" && Object.keys(value).length === 0) {
        continue;
      }
      docPayload = { ...docPayload, [field]: value };
    }
  }

  return docPayload;
}

async function writeToolFeedbackToFirestore(
  feedback: ToolFeedbackDocument,
): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  const db = getFirestoreDb();
  if (!db) {
    return false;
  }
  await setDoc(doc(db, TOOL_FEEDBACK_COLLECTION, feedback.id), feedback);
  return true;
}

export async function submitToolFeedback(
  input: ToolFeedbackSubmitInput,
): Promise<ToolFeedbackSubmitResult> {
  const errors = validateFeedbackPayload(input);
  if (errors.form === "honeypot") {
    return { ok: true, honeypot: true, firestoreSaved: false };
  }
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const rateLimit = checkCalculatorFeedbackRateLimit(input.toolSlug);
  if (!rateLimit.allowed) {
    return {
      ok: false,
      rateLimited: true,
      errors: { form: "rateLimited" },
    };
  }

  const payload = buildFeedbackPayload(input);
  if (!payload || !payload.kind) {
    return { ok: false, errors: { form: "invalid" } };
  }

  const feedback = toFirestoreDocument(payload);
  recordCalculatorFeedbackSubmission(input.toolSlug);

  try {
    const firestoreSaved = await writeToolFeedbackToFirestore(feedback);
    if (!firestoreSaved) {
      return { ok: false, errors: { form: "submitFailed" } };
    }
    return { ok: true, id: feedback.id, firestoreSaved: true };
  } catch {
    return { ok: false, errors: { form: "submitFailed" } };
  }
}

export type ToolFeedbackListFilters = {
  readonly kind?: FeedbackKind | "";
  readonly locale?: string;
  readonly toolSlug?: string;
  readonly severity?: FeedbackSeverity | "";
  readonly status?: FeedbackStatus | "";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeToolFeedbackDocument(data: unknown): ToolFeedbackDocument | null {
  if (!isRecord(data) || typeof data.id !== "string") {
    return null;
  }
  const kind = data.kind;
  const status = data.status;
  const severity = data.severity;
  if (typeof kind !== "string" || typeof status !== "string" || typeof severity !== "string") {
    return null;
  }
  return {
    id: data.id,
    kind: kind as ToolFeedbackDocument["kind"],
    status: status as ToolFeedbackDocument["status"],
    severity: severity as ToolFeedbackDocument["severity"],
    source: (typeof data.source === "string" ? data.source : "unknown") as FeedbackSource,
    toolSlug: typeof data.toolSlug === "string" ? data.toolSlug : "",
    toolType: (typeof data.toolType === "string" ? data.toolType : "unknown") as FeedbackToolType,
    locale: typeof data.locale === "string" ? data.locale : "en",
    routePath: typeof data.routePath === "string" ? data.routePath : "/",
    message: typeof data.message === "string" ? data.message : "",
    expectedBehavior: typeof data.expectedBehavior === "string" ? data.expectedBehavior : undefined,
    actualBehavior: typeof data.actualBehavior === "string" ? data.actualBehavior : undefined,
    sectorContext: typeof data.sectorContext === "string" ? data.sectorContext : undefined,
    suggestedFormulaChange:
      typeof data.suggestedFormulaChange === "string" ? data.suggestedFormulaChange : undefined,
    suggestedInput: typeof data.suggestedInput === "string" ? data.suggestedInput : undefined,
    dataSourceUrl: typeof data.dataSourceUrl === "string" ? data.dataSourceUrl : undefined,
    formulaVersion: typeof data.formulaVersion === "string" ? data.formulaVersion : undefined,
    formulaContractId:
      typeof data.formulaContractId === "string" ? data.formulaContractId : undefined,
    calculationHash: typeof data.calculationHash === "string" ? data.calculationHash : undefined,
    reportId: typeof data.reportId === "string" ? data.reportId : undefined,
    inputSnapshot: isRecord(data.inputSnapshot)
      ? (data.inputSnapshot as ToolFeedbackDocument["inputSnapshot"])
      : undefined,
    resultSnapshot: isRecord(data.resultSnapshot)
      ? (data.resultSnapshot as ToolFeedbackDocument["resultSnapshot"])
      : undefined,
    userId: typeof data.userId === "string" ? data.userId : null,
    userEmail: typeof data.userEmail === "string" ? data.userEmail : null,
    sessionId: typeof data.sessionId === "string" ? data.sessionId : null,
    userAgent: typeof data.userAgent === "string" ? data.userAgent : undefined,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
  };
}

export async function listToolFeedbackForAdmin(
  filters: ToolFeedbackListFilters = {},
): Promise<ToolFeedbackDocument[]> {
  if (!isFirebaseConfigured) {
    return [];
  }
  const db = getFirestoreDb();
  if (!db) {
    return [];
  }

  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(50)];
  const snapshot = await getDocs(
    query(collection(db, TOOL_FEEDBACK_COLLECTION), ...constraints),
  );

  let items = snapshot.docs
    .map((entry) => normalizeToolFeedbackDocument(entry.data()))
    .filter((entry): entry is ToolFeedbackDocument => entry !== null);

  if (filters.kind) {
    items = items.filter((entry) => entry.kind === filters.kind);
  }
  if (filters.locale) {
    items = items.filter((entry) => entry.locale === filters.locale);
  }
  if (filters.toolSlug) {
    items = items.filter((entry) => entry.toolSlug === filters.toolSlug);
  }
  if (filters.severity) {
    items = items.filter((entry) => entry.severity === filters.severity);
  }
  if (filters.status) {
    items = items.filter((entry) => entry.status === filters.status);
  }

  return items;
}

export async function updateToolFeedbackStatus(
  feedbackId: string,
  status: FeedbackStatus,
): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }
  const db = getFirestoreDb();
  if (!db) {
    return false;
  }
  await updateDoc(doc(db, TOOL_FEEDBACK_COLLECTION, feedbackId), {
    status,
    updatedAt: new Date().toISOString(),
  });
  return true;
}
