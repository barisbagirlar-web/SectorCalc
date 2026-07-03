// Test: Deterministic execution — same inputs produce same results

import { describe, it, expect } from "vitest";
import { computeHash, createAuditSeal } from "../audit-seal-service";

describe("Deterministic execution", () => {
  it("computeHash produces consistent results", () => {
    const hash1 = computeHash("test-data");
    const hash2 = computeHash("test-data");
    expect(hash1).toBe(hash2);
  });

  it("computeHash produces different results for different data", () => {
    const hash1 = computeHash("data-a");
    const hash2 = computeHash("data-b");
    expect(hash1).not.toBe(hash2);
  });

  it("createAuditSeal returns deterministic seal for same inputs", () => {
    const sealInput = {
      inputHash: "hash-i-abc",
      outputHash: "hash-o-xyz",
      schemaHash: "hash-s-123",
      formulaVersion: "1.0.0",
      schemaVersion: "1.0.0",
      runtimeVersion: "test-1.0.0",
    };
    const seal1 = createAuditSeal(sealInput);
    const seal2 = createAuditSeal(sealInput);
    // Deterministic: same seal_status and hash fields
    expect(seal1.seal_status).toBe(seal2.seal_status);
    expect(seal1.input_hash).toBe(seal2.input_hash);
    expect(seal1.output_hash).toBe(seal2.output_hash);
  });
});
