/**
 * Replay Service — Unit Tests
 *
 * Tests for the replay/reproducibility service.
 * canReplayJob and createReplayJob are Firestore-dependent — tested via integration tests.
 */
import { describe, it, expect } from "vitest";
import { verifyReproducibility } from "@/lib/document-intelligence/contracts/replay-service";
import type { DocumentFingerprint } from "@/lib/document-intelligence/contracts/document-fingerprint";

const SAMPLE_FINGERPRINT: DocumentFingerprint = {
  sourceDocumentSha256: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  sourceDocumentSize: 1024,
  sourcePageCount: 10,
  sourceMimeValidated: true,
  sourceFingerprintVersion: "1.0.0",
};

describe("Replay Service", () => {
  describe("verifyReproducibility", () => {
    it("returns reproducible when fingerprints match and versions match", () => {
      const result = verifyReproducibility(SAMPLE_FINGERPRINT, SAMPLE_FINGERPRINT, "1.0.0", "1.0.0");
      expect(result.reproducible).toBe(true);
    });

    it("returns not reproducible when SHA differs", () => {
      const different: DocumentFingerprint = {
        ...SAMPLE_FINGERPRINT,
        sourceDocumentSha256: "0000000000000000000000000000000000000000000000000000000000000000",
      };
      const result = verifyReproducibility(SAMPLE_FINGERPRINT, different, "1.0.0", "1.0.0");
      expect(result.reproducible).toBe(false);
      expect(result.reason).toBeTruthy();
    });

    it("returns not reproducible when page count differs", () => {
      const different: DocumentFingerprint = { ...SAMPLE_FINGERPRINT, sourcePageCount: 20 };
      const result = verifyReproducibility(SAMPLE_FINGERPRINT, different, "1.0.0", "1.0.0");
      expect(result.reproducible).toBe(false);
      expect(result.reason).toBeTruthy();
    });

    it("returns not reproducible when engine versions differ", () => {
      const result = verifyReproducibility(SAMPLE_FINGERPRINT, SAMPLE_FINGERPRINT, "1.0.0", "2.0.0");
      expect(result.reproducible).toBe(false);
      expect(result.reason).toBeTruthy();
      // The actual message starts with uppercase
      expect(result.reason!.toLowerCase()).toContain("engine");
    });

    it("handles null original fingerprint", () => {
      const result = verifyReproducibility(null as unknown as DocumentFingerprint, SAMPLE_FINGERPRINT, "1.0.0", "1.0.0");
      expect(result.reproducible).toBe(false);
    });
  });
});
