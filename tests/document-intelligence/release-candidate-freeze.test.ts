/**
 * Release Candidate Freeze — Unit Tests
 */
import { describe, it, expect } from "vitest";
import {
  createFreeze,
  validateFreeze,
  isFrozen,
  assertShaMatch,
} from "@/lib/document-intelligence/release/release-candidate-freeze";

describe("Release Candidate Freeze", () => {
  const SAMPLE_VERSIONS = {
    version: "rc-1.0.0",
    gitSha: "abcdef1234567890abcdef1234567890abcdef12",
    buildTimestamp: "2026-07-14T22:00:00.000Z",
    frozenBy: "admin@test.com",
    productVersion: "1.0.0",
    engineVersion: "1.0.0",
    validatorVersion: "1.0.0",
    schemaVersion: "1.0.0",
    importProfileVersion: "1.0.0",
    disclaimerVersion: "1.0.0",
    legalTextVersion: "1.0.0",
    sampleOutputVersion: "1.0.0",
  };

  describe("createFreeze", () => {
    it("returns a valid freeze object", () => {
      const freeze = createFreeze(SAMPLE_VERSIONS);
      expect(freeze.version).toBe("rc-1.0.0");
      expect(freeze.frozenAt).toBeTruthy();
      expect(freeze.status).toBe("frozen");
    });

    it("includes all version fields", () => {
      const freeze = createFreeze(SAMPLE_VERSIONS);
      expect(freeze.engineVersion).toBe("1.0.0");
      expect(freeze.validatorVersion).toBe("1.0.0");
      expect(freeze.schemaVersion).toBe("1.0.0");
      expect(freeze.disclaimerVersion).toBe("1.0.0");
    });
  });

  describe("validateFreeze", () => {
    it("returns valid for a complete freeze", () => {
      const freeze = createFreeze(SAMPLE_VERSIONS);
      const result = validateFreeze(freeze);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("isFrozen", () => {
    it("returns true for frozen status", () => {
      const freeze = createFreeze(SAMPLE_VERSIONS);
      expect(isFrozen(freeze)).toBe(true);
    });

    it("returns false for rolled_back status", () => {
      const freeze = createFreeze(SAMPLE_VERSIONS);
      freeze.status = "rolled_back";
      expect(isFrozen(freeze)).toBe(false);
    });

    it("returns false for null freeze", () => {
      expect(isFrozen(null)).toBe(false);
    });
  });

  describe("assertShaMatch", () => {
    it("returns true when SHAs match", () => {
      expect(assertShaMatch("abc123", "abc123")).toBe(true);
    });

    it("returns false when SHAs differ", () => {
      expect(assertShaMatch("abc123", "def456")).toBe(false);
    });
  });
});
