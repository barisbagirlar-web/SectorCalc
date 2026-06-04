import { isLeadStatus } from "@/lib/leads/lead-pipeline";
import type { LeadStatus } from "@/lib/leads/types";

const MAX_ADMIN_NOTE_LENGTH = 500;

export interface LeadPipelineUpdateInput {
  leadId: string;
  status: LeadStatus;
  adminNote: string;
}

export interface ValidationResult {
  ok: true;
  data: LeadPipelineUpdateInput;
}

export interface ValidationError {
  ok: false;
  error: string;
}

export type ParseLeadPipelineUpdateResult = ValidationResult | ValidationError;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLeadPipelineUpdateBody(
  leadIdFromRoute: string,
  body: unknown
): ParseLeadPipelineUpdateResult {
  const leadId = leadIdFromRoute.trim();
  if (!leadId) {
    return { ok: false, error: "leadId is required." };
  }

  if (!isPlainObject(body)) {
    return { ok: false, error: "Invalid request body." };
  }

  const keys = Object.keys(body);
  const allowedKeys = ["status", "adminNote"];
  if (keys.length === 0 || keys.some((key) => !allowedKeys.includes(key))) {
    return { ok: false, error: "Only status and adminNote are allowed." };
  }

  if (typeof body.status !== "string" || !isLeadStatus(body.status.trim())) {
    return { ok: false, error: "Invalid status." };
  }

  let adminNote = "";
  if ("adminNote" in body) {
    if (typeof body.adminNote !== "string") {
      return { ok: false, error: "adminNote must be a string." };
    }
    adminNote = body.adminNote;
  }

  if (adminNote.length > MAX_ADMIN_NOTE_LENGTH) {
    return {
      ok: false,
      error: `adminNote must be at most ${MAX_ADMIN_NOTE_LENGTH} characters.`,
    };
  }

  return {
    ok: true,
    data: {
      leadId,
      status: body.status.trim() as LeadStatus,
      adminNote: adminNote.trim(),
    },
  };
}
