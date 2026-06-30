import { describe, expect, test } from "vitest";
import { isAuthRequiredPath } from "@/lib/features/auth/auth-required-path";

describe("isAuthRequiredPath", () => {
  test("matches account and login across locales", () => {
    expect(isAuthRequiredPath("/account")).toBe(true);
    expect(isAuthRequiredPath("/tr/account")).toBe(true);
    expect(isAuthRequiredPath("/de/login")).toBe(true);
    expect(isAuthRequiredPath("/ar/pricing")).toBe(true);
  });

  test("matches premium tool routes", () => {
    expect(isAuthRequiredPath("/tools/premium/margin-leak")).toBe(true);
    expect(isAuthRequiredPath("/fr/tools/premium-schema/bid-risk")).toBe(true);
  });

  test("does not match marketing homepages", () => {
    expect(isAuthRequiredPath("/")).toBe(false);
    expect(isAuthRequiredPath("/tr")).toBe(false);
    expect(isAuthRequiredPath("/de/free-tools")).toBe(false);
    expect(isAuthRequiredPath("/es/tools/generated/absenteeism-cost-calculator")).toBe(false);
  });
});
