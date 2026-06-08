import { describe, expect, test } from "vitest";
import {
  buildReportHash,
  buildVerificationId,
  buildVerificationSeal,
  hashCanonicalInputs,
} from "@/lib/verification/verification-hash";
import { parseVerificationId } from "@/lib/verification/verification-seal";
import type { VerificationHashInput } from "@/lib/verification/verification-types";

const BASE_INPUT: VerificationHashInput = {
  formulaContractSlug: "loan-payment-calculator",
  formulaVersion: "revenue-free.loan-payment-calculator",
  canonicalInputsHash: hashCanonicalInputs({ principal: 100_000, rate: 5 }),
  resultHash: hashCanonicalInputs({ payment: 1200 }),
  validationStatus: "SUCCESS",
  timestamp: "2026-06-09T00:00:00.000Z",
  locale: "en",
  reportVersion: "1",
  systemVersion: "sectorcalc-local",
};

describe("verification hash", () => {
  test("same input produces same hash", () => {
    expect(buildReportHash(BASE_INPUT)).toBe(buildReportHash(BASE_INPUT));
  });

  test("changed input produces different hash", () => {
    const changed = {
      ...BASE_INPUT,
      resultHash: hashCanonicalInputs({ payment: 1300 }),
    };
    expect(buildReportHash(changed)).not.toBe(buildReportHash(BASE_INPUT));
  });

  test("verification id format", () => {
    const seal = buildVerificationSeal(BASE_INPUT);
    expect(seal.verificationId).toMatch(/^scv_[a-f0-9]{24}$/);
    expect(parseVerificationId(seal.verificationId)).toBe("lookup_pending");
  });

  test("invalid verification id rejected", () => {
    expect(parseVerificationId("bad-id")).toBe("invalid_id");
  });

  test("hash input does not embed raw email-like PII", () => {
    const blob = JSON.stringify(BASE_INPUT);
    expect(blob).not.toContain("@");
  });
});
