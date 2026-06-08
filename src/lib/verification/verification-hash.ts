/**
 * Deterministic public hashes — no secret key; no raw PII in hash input.
 */

import type { VerificationHashInput, VerificationSealPayload } from "@/lib/verification/verification-types";

function stableSerialize(input: VerificationHashInput): string {
  return JSON.stringify({
    formulaContractSlug: input.formulaContractSlug,
    formulaVersion: input.formulaVersion,
    canonicalInputsHash: input.canonicalInputsHash,
    resultHash: input.resultHash,
    validationStatus: input.validationStatus,
    timestamp: input.timestamp,
    locale: input.locale,
    reportVersion: input.reportVersion,
    systemVersion: input.systemVersion,
  });
}

/** FNV-1a 32-bit hex — deterministic, no crypto secret. */
export function fnv1aHex(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function hashCanonicalInputs(inputs: Readonly<Record<string, number | string>>): string {
  const keys = Object.keys(inputs).sort();
  const serialized = keys.map((key) => `${key}=${String(inputs[key])}`).join("|");
  return fnv1aHex(serialized);
}

export function hashResultValues(values: Readonly<Record<string, number | string>>): string {
  return hashCanonicalInputs(values);
}

export function buildReportHash(input: VerificationHashInput): string {
  return fnv1aHex(stableSerialize(input));
}

export function buildVerificationId(reportHash: string): string {
  return `scv_${reportHash.padEnd(24, "0").slice(0, 24)}`;
}

export function buildVerificationSeal(input: VerificationHashInput): VerificationSealPayload {
  const reportHash = buildReportHash(input);
  return {
    ...input,
    reportHash,
    verificationId: buildVerificationId(reportHash),
  };
}

export function assertNoPiiInHashInput(input: VerificationHashInput): void {
  const blob = stableSerialize(input).toLowerCase();
  const piiPatterns = [/@/, /\b\d{11}\b/, /\bpassport\b/, /\bssn\b/];
  for (const pattern of piiPatterns) {
    if (pattern.test(blob)) {
      throw new Error("PII-like pattern detected in verification hash input.");
    }
  }
}
