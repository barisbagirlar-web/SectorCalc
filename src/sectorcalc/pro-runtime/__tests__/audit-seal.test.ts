// Test: Audit seal service

import { describe, it, expect } from "vitest";
import { createAuditSeal, computeHash } from "../audit-seal-service";

describe("Audit seal service", () => {
  it("creates seal with all required fields", () => {
    const inputHash = computeHash("input");
    const outputHash = computeHash("output");
    const schemaHash = computeHash("schema");
    const seal = createAuditSeal({
      inputHash,
      outputHash,
      schemaHash,
      formulaVersion: "1.0.0",
      schemaVersion: "2.0.0",
      runtimeVersion: "test-1.0.0",
    });

    expect(seal.seal_status).toBe("SEALED");
    expect(seal.hash_algorithm).toBe("SHA-256");
    expect(seal.input_hash).toBe(inputHash);
    expect(seal.output_hash).toBe(outputHash);
    expect(seal.schema_hash).toBe(schemaHash);
    expect(seal.formula_version).toBe("1.0.0");
    expect(seal.schema_version).toBe("2.0.0");
    expect(seal.runtime_version).toBe("test-1.0.0");
    expect(seal.executed_at).toBeTruthy();
    expect(seal.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
    expect(seal.signature_status).toBe("SERVER_SIGNATURE_OPTIONAL");
    expect(seal.tamper_warning).toContain("non-repudiation");
  });

  it("fails closed when a caller supplies a non-canonical hash", () => {
    const seal = createAuditSeal({
      inputHash: "not-a-hash",
      outputHash: computeHash("output"),
      schemaHash: computeHash("schema"),
      formulaVersion: "1.0.0",
      schemaVersion: "2.0.0",
      runtimeVersion: "test-1.0.0",
    });

    expect(seal.seal_status).toBe("FAILED");
    expect(seal.signature_status).toBe("FAILED");
    expect(seal.tamper_warning).toContain("rejected");
  });

  it("computeHash produces deterministic results", () => {
    const hash1 = computeHash("test-data");
    const hash2 = computeHash("test-data");
    expect(hash1).toBe(hash2);
  });

  it("matches the published SHA-256 known-answer vector", () => {
    expect(computeHash("abc")).toBe(
      "sha256:ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("computeHash produces different results for different data", () => {
    const hash1 = computeHash("data-a");
    const hash2 = computeHash("data-b");
    expect(hash1).not.toBe(hash2);
  });
});
