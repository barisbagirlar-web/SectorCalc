const LEAD_STATUSES = [
  "new",
  "reviewed",
  "contacted",
  "qualified",
  "converted",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

const MAX_ADMIN_NOTE_LENGTH = 500;

export interface LeadPipelineUpdateInput {
  leadId: string;
  status: LeadStatus;
  adminNote: string;
}

export interface ValidationSuccess {
  ok: true;
  data: LeadPipelineUpdateInput;
}

export interface ValidationFailure {
  ok: false;
  error: string;
}

export type ParseLeadPipelineUpdateResult = ValidationSuccess | ValidationFailure;

function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLeadPipelineUpdateBody(
  body: unknown
): ParseLeadPipelineUpdateResult {
  if (!isPlainObject(body)) {
    return { ok: false, error: "Invalid request body." };
  }

  const keys = Object.keys(body);
  const allowedKeys = ["leadId", "status", "adminNote"];
  if (keys.length === 0 || keys.some((key) => !allowedKeys.includes(key))) {
    return { ok: false, error: "Only leadId, status and adminNote are allowed." };
  }

  if (typeof body.leadId !== "string" || !body.leadId.trim()) {
    return { ok: false, error: "leadId is required." };
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
      leadId: body.leadId.trim(),
      status: body.status.trim() as LeadStatus,
      adminNote: adminNote.trim(),
    },
  };
}
