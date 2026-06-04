import { getAdminTestClassificationUrl } from "@/lib/admin/lead-write-config";

export interface UpdateTestLeadClassificationClientInput {
  leadId: string;
  isTestLead: boolean;
  testLeadReason?: string;
  idToken: string;
}

export interface UpdateTestLeadClassificationClientResult {
  success: boolean;
  updatedAt?: string;
  isTestLead?: boolean;
  testLeadReason?: string;
  testLeadMarkedAt?: string;
  testLeadMarkedByUid?: string;
  testLeadMarkedByEmail?: string;
  error?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function updateTestLeadClassificationClient(
  input: UpdateTestLeadClassificationClientInput
): Promise<UpdateTestLeadClassificationClientResult> {
  const url = getAdminTestClassificationUrl();
  if (!url) {
    return {
      success: false,
      error: "Test classification update URL is not configured.",
    };
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.idToken}`,
      },
      body: JSON.stringify({
        leadId: input.leadId,
        isTestLead: input.isTestLead,
        testLeadReason: input.testLeadReason ?? "",
      }),
    });

    const payload: unknown = await response.json();

    if (!isRecord(payload)) {
      return { success: false, error: "Invalid response from update service." };
    }

    if (!response.ok || payload.success !== true) {
      const error =
        typeof payload.error === "string"
          ? payload.error
          : "Update failed.";
      return { success: false, error };
    }

    return {
      success: true,
      updatedAt:
        typeof payload.updatedAt === "string" ? payload.updatedAt : undefined,
      isTestLead:
        typeof payload.isTestLead === "boolean"
          ? payload.isTestLead
          : input.isTestLead,
      testLeadReason:
        typeof payload.testLeadReason === "string"
          ? payload.testLeadReason
          : input.testLeadReason,
      testLeadMarkedAt:
        typeof payload.testLeadMarkedAt === "string"
          ? payload.testLeadMarkedAt
          : undefined,
      testLeadMarkedByUid:
        typeof payload.testLeadMarkedByUid === "string"
          ? payload.testLeadMarkedByUid
          : undefined,
      testLeadMarkedByEmail:
        typeof payload.testLeadMarkedByEmail === "string"
          ? payload.testLeadMarkedByEmail
          : undefined,
    };
  } catch {
    return {
      success: false,
      error: "Could not reach the update service.",
    };
  }
}
