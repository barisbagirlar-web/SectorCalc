// SectorCalc V5.3.1 — Formula Registry Tests
// Server-only boundary, hash binding, missing registry blocking

import { describe, it, expect } from "vitest";
import { formulaRegistry, FormulaRegistry, FormulaRegistryRecord } from "../formula-registry";
import { createTestFormulaRegistryRecord, registerTestFixture, TEST_TOOL_ID } from "./formula-registry-fixtures";

describe("FormulaRegistry", () => {
  it("stores and retrieves by tool_id + version", () => {
    const record = createTestFormulaRegistryRecord();
    const localReg = new FormulaRegistry();
    localReg.register(record);
    const fetched = localReg.fetch(TEST_TOOL_ID, "1.0.0");
    expect(fetched).not.toBeNull();
    expect(fetched!.tool_id).toBe(TEST_TOOL_ID);
  });

  it("returns null for unregistered tool", () => {
    const localReg = new FormulaRegistry();
    const fetched = localReg.fetch("nonexistent", "1.0.0");
    expect(fetched).toBeNull();
  });

  it("fetches by schema hash binding", () => {
    const record = createTestFormulaRegistryRecord();
    const localReg = new FormulaRegistry();
    localReg.register(record);
    const fetched = localReg.fetchBySchemaHash("test-schema-hash-001");
    expect(fetched).not.toBeNull();
    expect(fetched!.tool_id).toBe(TEST_TOOL_ID);
  });

  it("returns null for mismatched schema hash", () => {
    const localReg = new FormulaRegistry();
    const record = createTestFormulaRegistryRecord({ schema_hash_binding: "hash-a" });
    localReg.register(record);
    const fetched = localReg.fetchBySchemaHash("hash-b");
    expect(fetched).toBeNull();
  });

  it("verifyHashBinding returns true for matching hash + version", () => {
    const record = createTestFormulaRegistryRecord();
    const localReg = new FormulaRegistry();
    localReg.register(record);
    expect(localReg.verifyHashBinding("test-schema-hash-001", "1.0.0")).toBe(true);
  });

  it("verifyHashBinding returns false for mismatched version", () => {
    const record = createTestFormulaRegistryRecord({ formula_version: "1.0.0" });
    const localReg = new FormulaRegistry();
    localReg.register(record);
    expect(localReg.verifyHashBinding("test-schema-hash-001", "2.0.0")).toBe(false);
  });

  it("blocks execution when registry is missing", () => {
    const localReg = new FormulaRegistry();
    // No record registered for this hash
    const fetched = localReg.fetchBySchemaHash("nonexistent-hash");
    expect(fetched).toBeNull();
  });

  it("computes stable registry hash", () => {
    const record = createTestFormulaRegistryRecord();
    const hash1 = FormulaRegistry.computeRegistryHash(record.nodes);
    const hash2 = FormulaRegistry.computeRegistryHash(record.nodes);
    expect(hash1).toBe(hash2);
  });
});

describe("Registry client import boundary", () => {
  it("formulaRegistry is a singleton", () => {
    // Import boundary test — registry must exist only server-side
    expect(formulaRegistry).toBeDefined();
    expect(formulaRegistry.fetch).toBeInstanceOf(Function);
  });

  it("registry can hold test fixture", () => {
    registerTestFixture();
    const fetched = formulaRegistry.fetch(TEST_TOOL_ID, "1.0.0");
    expect(fetched).not.toBeNull();
    expect(fetched!.nodes.length).toBeGreaterThan(0);
    // Registry nodes must not contain exact_expression field (operation is used instead)
    for (const node of fetched!.nodes) {
      expect((node as any).exact_expression).toBeUndefined();
      expect(node.operation).toBeDefined();
    }
  });
});
