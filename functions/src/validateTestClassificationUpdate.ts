const MAX_TEST_LEAD_REASON_LENGTH = 300;

export interface TestClassificationUpdateInput {
  leadId: string;
  isTestLead: boolean;
  testLeadReason: string;
}

export interface ValidationSuccess {
  ok: true;
  data: TestClassificationUpdateInput;
}

export interface ValidationFailure {
  ok: false;
  error: string;
}

export type ParseTestClassificationUpdateResult =
  | ValidationSuccess
  | ValidationFailure;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseTestClassificationUpdateBody(
  body: unknown
): ParseTestClassificationUpdateResult {
  if (!isPlainObject(body)) {
    return { ok: false, error: "Invalid request body." };
  }

  const keys = Object.keys(body);
  const allowedKeys = ["leadId", "isTestLead", "testLeadReason"];
  if (keys.length === 0 || keys.some((key) => !allowedKeys.includes(key))) {
    return {
      ok: false,
      error: "Only leadId, isTestLead and testLeadReason are allowed.",
    };
  }

  if (typeof body.leadId !== "string" || !body.leadId.trim()) {
    return { ok: false, error: "leadId is required." };
  }

  if (typeof body.isTestLead !== "boolean") {
    return { ok: false, error: "isTestLead must be a boolean." };
  }

  let testLeadReason = "";
  if ("testLeadReason" in body) {
    if (typeof body.testLeadReason !== "string") {
      return { ok: false, error: "testLeadReason must be a string." };
    }
    testLeadReason = body.testLeadReason;
  }

  if (testLeadReason.length > MAX_TEST_LEAD_REASON_LENGTH) {
    return {
      ok: false,
      error: `testLeadReason must be at most ${MAX_TEST_LEAD_REASON_LENGTH} characters.`,
    };
  }

  return {
    ok: true,
    data: {
      leadId: body.leadId.trim(),
      isTestLead: body.isTestLead,
      testLeadReason: testLeadReason.trim(),
    },
  };
}
