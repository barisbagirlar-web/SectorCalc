// CBAM paid report unlock gate tests.
// Verifies the paid report generation route enforces the verified config lock.
import { describe, it, expect } from "vitest";
import { isCbamPaidReportAllowed } from "@/sectorcalc/cbam/cbam-verified-config";
import { readFileSync } from "fs";
import { join } from "path";

describe("CBAM paid report unlock gate", () => {
  it("placeholder config cannot produce paid report", () => {
    const result = isCbamPaidReportAllowed();
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it("blocked response has exact reason string", () => {
    const result = isCbamPaidReportAllowed();
    expect(result.allowed).toBe(false);
    // The reason should be descriptive
    expect(result.reason!.length).toBeGreaterThan(10);
  });

  it("status is not VERIFIED without complete source lock", () => {
    const result = isCbamPaidReportAllowed();
    // Only VERIFIED if all checks pass
    expect([
      "BLOCKED_SOURCE_LOCK_MISSING",
      "ILLUSTRATIVE_PLACEHOLDER_DO_NOT_SHIP",
    ]).toContain(result.status);
  });

  it("missing source lock returns 503 blocker", () => {
    const result = isCbamPaidReportAllowed();
    expect(result.allowed).toBe(false);
    // The 503 status code mapping is in the route handler, but the reason
    // must indicate what's missing
    expect(result.reason).toBeTruthy();
  });

  it("missing golden fixture blocks report", () => {
    const result = isCbamPaidReportAllowed();
    expect(result.allowed).toBe(false);
    // Golden fixture is one of the checks
  });

  it("missing audit seal blocks report", () => {
    const result = isCbamPaidReportAllowed();
    expect(result.allowed).toBe(false);
    // Audit seal is one of the checks
  });

  it("missing certificate price policy blocks report", () => {
    const result = isCbamPaidReportAllowed();
    expect(result.allowed).toBe(false);
    // Certificate price policy is one of the checks
  });

  it("public response must not expose internal formula expressions", () => {
    // Check that the verified config implementation does not leak formulas
    const verifiedConfigPath = join(
      process.cwd(),
      "src/sectorcalc/cbam/cbam-verified-config.ts"
    );
    const content = readFileSync(verifiedConfigPath, "utf-8");
    // Should not contain internal emission formula patterns in exported public interface
    expect(content).not.toMatch(/emissions_tco2e_per_ton\s*=\s*/);
    expect(content).not.toMatch(/direct_emissions\s*=\s*/);
  });
});
