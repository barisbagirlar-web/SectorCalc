// Test: Audit seal service

import { describe, it, expect } from "vitest";
import { createAuditSeal, computeHash } from "../audit-seal-service";

describe("Audit seal service", () => {
  it("creates seal with all required fields", () => {
    const seal = createAuditSeal({
      inputHash: "in-hash",
      outputHash: "out-hash",
      schemaHash: "schema-hash",
      formulaVersion: "1.0.0",
      schemaVersion: "2.0.0",
      runtimeVersion: "test-1.0.0",
    });

    expect(seal.seal_status).toBe("UNSEALED");
    expect(seal.hash_algorithm).toBe("SHA-256");
    expect(seal.input_hash).toBe("in-hash");
    expect(seal.output_hash).toBe("out-hash");
    expect(seal.schema_hash).toBe("schema-hash");
    expect(seal.formula_version).toBe("1.0.0");
    expect(seal.schema_version).toBe("2.0.0");
    expect(seal.runtime_version).toBe("test-1.0.0");
    expect(seal.executed_at).toBeTruthy();
    expect(seal.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
    expect(seal.signature_status).toBe("UNSIGNED");
  });

  it("computeHash produces deterministic results", () => {
    const hash1 = computeHash("test-data");
    const hash2 = computeHash("test-data");
    expect(hash1).toBe(hash2);
  });

  it("computeHash produces different results for different data", () => {
    const hash1 = computeHash("data-a");
    const hash2 = computeHash("data-b");
    expect(hash1).not.toBe(hash2);
  });
});
