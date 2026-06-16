import { getAdminFirestore } from "@/lib/firebase/admin";
import type { LeadIntent, LeadIntentInput } from "@/lib/leads/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createLeadId(): string {
  return `lead_${crypto.randomUUID()}`;
}

function deriveNameFromEmail(email: string): string {
  const localPart = email.split("@")[0]?.replace(/[^a-zA-Z0-9._-]/g, " ") ?? "";
  return localPart.length >= 2 ? localPart : "PDF Lead";
}

export function buildPdfExportLeadInput(input: {
  readonly email: string;
  readonly toolName: string;
  readonly toolSlug: string;
  readonly locale: string;
  readonly pagePath: string;
  readonly industry?: string;
}): LeadIntentInput {
  const trimmedEmail = input.email.trim().toLowerCase();

  return {
    name: deriveNameFromEmail(trimmedEmail),
    email: trimmedEmail,
    company: "Not provided",
    industry: input.industry?.trim() || "Other",
    toolRequested: input.toolName.trim(),
    intendedUse: "Receive free calculation PDF report",
    source: "export",
    pagePath: input.pagePath,
    plan: "free",
    message: `PDF export lead · slug=${input.toolSlug} · locale=${input.locale}`,
  };
}

export function isValidPdfExportEmail(email: string): boolean {
  const trimmed = email.trim();
  return trimmed.length > 0 && trimmed.length <= 120 && EMAIL_PATTERN.test(trimmed);
}

function toFirestoreLeadDocument(base: Omit<LeadIntent, "storageMode">): LeadIntent {
  const document: LeadIntent = {
    id: base.id,
    name: base.name,
    email: base.email,
    company: base.company,
    industry: base.industry,
    toolRequested: base.toolRequested,
    intendedUse: base.intendedUse,
    source: base.source,
    pagePath: base.pagePath,
    createdAt: base.createdAt,
    status: "new",
    storageMode: "firestore",
    toolSlug: base.toolSlug,
    tier: "free",
    cta: "pdf_export",
  };

  if (base.message) {
    document.message = base.message;
  }
  if (base.plan) {
    document.plan = base.plan;
  }

  return document;
}

export async function savePdfExportLeadServer(
  input: LeadIntentInput & { readonly toolSlug: string },
): Promise<{ ok: boolean; leadId?: string }> {
  const db = getAdminFirestore();
  if (!db) {
    return { ok: false };
  }

  const id = createLeadId();
  const payload = toFirestoreLeadDocument({
    id,
    name: input.name,
    email: input.email,
    company: input.company,
    industry: input.industry,
    toolRequested: input.toolRequested,
    intendedUse: input.intendedUse,
    source: input.source,
    pagePath: input.pagePath,
    createdAt: new Date().toISOString(),
    status: "new",
    message: input.message,
    plan: input.plan,
    toolSlug: input.toolSlug,
  });

  try {
    await db.collection("leadIntents").doc(id).set(payload);
    return { ok: true, leadId: id };
  } catch {
    return { ok: false };
  }
}
