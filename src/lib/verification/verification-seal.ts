import {
  buildVerificationSeal,
  hashCanonicalInputs,
  hashResultValues,
} from "@/lib/verification/verification-hash";
import {
  VERIFICATION_DISCLAIMER,
  VERIFICATION_ID_PATTERN,
  type PublicVerificationDisplay,
  type VerificationHashInput,
  type VerificationStatus,
} from "@/lib/verification/verification-types";

export function createVerificationSealFromLoop(input: {
  readonly formulaContractSlug: string;
  readonly formulaVersion: string;
  readonly canonicalInputs: Readonly<Record<string, number | string>>;
  readonly resultValues: Readonly<Record<string, number | string>>;
  readonly validationStatus: string;
  readonly timestamp: string;
  readonly locale: string;
  readonly reportVersion?: string;
  readonly systemVersion?: string;
}) {
  const hashInput: VerificationHashInput = {
    formulaContractSlug: input.formulaContractSlug,
    formulaVersion: input.formulaVersion,
    canonicalInputsHash: hashCanonicalInputs(input.canonicalInputs),
    resultHash: hashResultValues(input.resultValues),
    validationStatus: input.validationStatus,
    timestamp: input.timestamp,
    locale: input.locale,
    reportVersion: input.reportVersion ?? "1",
    systemVersion: input.systemVersion ?? "sectorcalc-local",
  };
  return buildVerificationSeal(hashInput);
}

export function parseVerificationId(id: string): VerificationStatus {
  if (!VERIFICATION_ID_PATTERN.test(id)) {
    return "invalid_id";
  }
  return "lookup_pending";
}

export function buildPublicVerificationDisplay(input: {
  readonly verificationId: string;
  readonly formulaContractSlug: string;
  readonly generatedAt: string;
  readonly validationStatus: string;
  readonly reportHash?: string;
}): PublicVerificationDisplay {
  const status = parseVerificationId(input.verificationId);
  return {
    verificationId: input.verificationId,
    status,
    reportHash: input.reportHash ?? "—",
    formulaContractSlug: input.formulaContractSlug,
    generatedAt: input.generatedAt,
    validationStatus: input.validationStatus,
    disclaimer: VERIFICATION_DISCLAIMER,
  };
}

export { VERIFICATION_DISCLAIMER };
