/**
 * Report verification / digital seal types.
 */

export type VerificationStatus = "valid_format" | "invalid_id" | "lookup_pending" | "not_found";

export type VerificationHashInput = {
  readonly formulaContractSlug: string;
  readonly formulaVersion: string;
  readonly canonicalInputsHash: string;
  readonly resultHash: string;
  readonly validationStatus: string;
  readonly timestamp: string;
  readonly locale: string;
  readonly reportVersion: string;
  readonly systemVersion: string;
};

export type VerificationSealPayload = VerificationHashInput & {
  readonly verificationId: string;
  readonly reportHash: string;
};

export type PublicVerificationDisplay = {
  readonly verificationId: string;
  readonly status: VerificationStatus;
  readonly reportHash: string;
  readonly formulaContractSlug: string;
  readonly generatedAt: string;
  readonly validationStatus: string;
  readonly disclaimer: string;
};

export const VERIFICATION_DISCLAIMER =
  "This verification confirms that the report structure and calculation trace match a SectorCalc-generated record when a matching record exists. It is not a substitute for official documents or licensed professional sign-off.";

export const VERIFICATION_ID_PATTERN = /^scv_[a-f0-9]{24}$/;
