/**
 * Approved Reports & Validation Stamp types - P4
 * End-user facing approved report with calculation hash and public verification support.
 */

export type ApprovedReportStatus = "draft" | "issued" | "verified" | "revoked";

export type ApprovedReportVisibility = "private" | "public_verify";

export type ApprovedReportPayload = {
  readonly id: string;
  readonly reportId: string;
  readonly calculationHash: string;
  readonly validationStampId: string;
  readonly qrTargetUrl: string;

  readonly toolSlug: string;
  readonly toolType: "free" | "premium" | "unknown";
  readonly locale: string;
  readonly routePath: string;

  readonly formulaVersion: string;
  readonly formulaContractId?: string;

  readonly inputSnapshot: Record<string, unknown>;
  readonly resultSnapshot: Record<string, unknown>;

  readonly publicSummary: {
    readonly toolSlug: string;
    readonly toolType: "free" | "premium" | "unknown";
    readonly formulaVersion: string;
    readonly issuedAt: string;
    readonly validationStampId: string;
  };

  readonly auditTrail: Array<{
    readonly at: string;
    readonly event: string;
    readonly details?: Record<string, unknown>;
  }>;

  readonly status: ApprovedReportStatus;
  readonly visibility: ApprovedReportVisibility;

  readonly issuedAt: string;
  readonly updatedAt: string;

  readonly userId?: string | null;
  readonly userEmail?: string | null;

  readonly disclaimerVersion: string;
  readonly appVersion?: string;
};

export type CreateApprovedReportInput = {
  readonly toolSlug: string;
  readonly toolType: "free" | "premium" | "unknown";
  readonly locale: string;
  readonly routePath: string;
  readonly formulaVersion: string;
  readonly formulaContractId?: string;
  readonly inputSnapshot: Record<string, unknown>;
  readonly resultSnapshot: Record<string, unknown>;
  readonly userId?: string | null;
  readonly userEmail?: string | null;
  readonly appVersion?: string;
};

export type VerifyReportPublicResult = {
  readonly ok: true;
  readonly status: "verified" | "hash_mismatch" | "revoked" | "not_found";
  readonly reportId: string;
  readonly toolSlug?: string;
  readonly formulaVersion?: string;
  readonly issuedAt?: string;
  readonly validationStampId?: string;
  readonly publicSummary?: ApprovedReportPayload["publicSummary"];
  readonly hashMatches: boolean;
};

export type VerifyReportErrorResult = {
  readonly ok: false;
  readonly error:
    | "missing_params"
    | "invalid_params"
    | "not_found"
    | "lookup_failed";
};

export type VerifyReportResult = VerifyReportPublicResult | VerifyReportErrorResult;