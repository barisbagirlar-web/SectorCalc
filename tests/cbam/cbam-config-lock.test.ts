// CBAM config lock tests.
// Verifies the CBAM_CONFIG_VERIFICATION_STATUS mechanism works correctly.
import { describe, it, expect } from "vitest";
import {
  getCbamConfigVerification,
  isCbamPaidReportAllowed,
} from "@/sectorcalc/cbam/cbam-verified-config";
import { readFileSync } from "fs";
import { join } from "path";

describe("CBAM config lock", () => {
  it("placeholder config cannot produce paid report", () => {
    const verification = getCbamConfigVerification();
    // In the current state (source lock file exists with partial data),
    // the config should return BLOCKED_SOURCE_LOCK_MISSING because
    // not all required sources are fully verified
    expect([
      "ILLUSTRATIVE_PLACEHOLDER_DO_NOT_SHIP",
      "BLOCKED_SOURCE_LOCK_MISSING",
    ]).toContain(verification.status);
    expect(verification.blocker_reason).toBeTruthy();
  });

  it("isCbamPaidReportAllowed returns false for placeholder config", () => {
    const result = isCbamPaidReportAllowed();
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it("getCbamConfigVerification returns proper structure", () => {
    const v = getCbamConfigVerification();
    expect(v).toHaveProperty("status");
    expect(v).toHaveProperty("blocker_reason");
    expect(v).toHaveProperty("source_lock_exists");
    expect(v).toHaveProperty("required_sources_locked");
    expect(v).toHaveProperty("binding_source_locked");
    expect(v).toHaveProperty("source_hashes_present");
    expect(v).toHaveProperty("golden_fixture_exists");
    expect(v).toHaveProperty("audit_seal_stable");
    expect(v).toHaveProperty("certificate_price_policy_exists");
  });

  it("blocker_reason is non-empty when blocked", () => {
    const result = isCbamPaidReportAllowed();
    if (!result.allowed) {
      expect(result.reason).toBeTruthy();
      expect(typeof result.reason).toBe("string");
      expect(result.reason!.length).toBeGreaterThan(0);
    }
  });

  it("status is never VERIFIED_OFFICIAL_SOURCE_LOCKED without all requirements", () => {
    const v = getCbamConfigVerification();
    // If it IS verified, all requirements must be met
    if (v.status === "VERIFIED_OFFICIAL_SOURCE_LOCKED") {
      expect(v.source_lock_exists).toBe(true);
      expect(v.required_sources_locked).toBe(true);
      expect(v.binding_source_locked).toBe(true);
      expect(v.source_hashes_present).toBe(true);
      expect(v.golden_fixture_exists).toBe(true);
      expect(v.audit_seal_stable).toBe(true);
      expect(v.certificate_price_policy_exists).toBe(true);
    }
  });

  it("source registry contains required unlock sources", () => {
    // Read the file directly to verify structure
    const registryPath = join(
      process.cwd(),
      "src/sectorcalc/cbam/cbam-official-source-registry.ts"
    );
    const content = readFileSync(registryPath, "utf-8");
    expect(content).toContain("REQUIRED_UNLOCK_SOURCE_IDS");
    expect(content).toContain("eur-lex-2025-2621");
    expect(content).toContain("required_for_unlock");
  });

  it("blocker reason explains what is missing", () => {
    const v = getCbamConfigVerification();
    if (v.status !== "VERIFIED_OFFICIAL_SOURCE_LOCKED") {
      expect(v.blocker_reason).toMatch(/CBAM|source|lock|verify|certificate|fixture|seal/i);
    }
  });
});
