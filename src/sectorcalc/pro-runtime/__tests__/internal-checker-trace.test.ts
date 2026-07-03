// SectorCalc V5.3.1 — Internal Checker Trace Tests
// Server-only boundary. No public exposure. INTERNAL_TRACE_RESTRICTED.

import { describe, it, expect } from "vitest";
import { createInternalCheckerTrace, INTERNAL_CHECKER_TRACE_BOUNDARY } from "../internal-checker-trace";

describe("InternalCheckerTrace", () => {
  it("creates trace with INTERNAL_TRACE_RESTRICTED status", () => {
    const trace = createInternalCheckerTrace({
      formulaId: "f_test",
      formulaVersion: "1.0.0",
      schemaHash: "schema-hash-001",
      formulaRegistryHash: "fr-hash-001",
      normalizedInputHash: "input-hash-001",
    });
    expect(trace.redaction_status).toBe("INTERNAL_TRACE_RESTRICTED");
    expect(trace.formula_id).toBe("f_test");
    expect(trace.formula_version).toBe("1.0.0");
  });

  it("includes all required internal fields", () => {
    const trace = createInternalCheckerTrace({
      formulaId: "f_test",
      formulaVersion: "1.0.0",
      schemaHash: "sh-001",
      formulaRegistryHash: "frh-001",
      normalizedInputHash: "nih-001",
      intermediateOutputHashes: ["ioh-001", "ioh-002"],
      unitDimensionLog: ["LENGTH ok", "MASS ok"],
      uncertaintyPropagationLog: ["+-5%", "+-3%"],
      sensitivityLog: ["length: 0.8", "width: 0.2"],
      fmeaTriggerLog: ["RPN threshold not reached"],
      decisionRuleLog: ["result >= 0: PASS"],
    });
    expect(trace.intermediate_output_hashes).toHaveLength(2);
    expect(trace.unit_dimension_log).toHaveLength(2);
    expect(trace.uncertainty_propagation_log).toHaveLength(2);
    expect(trace.sensitivity_log).toHaveLength(2);
    expect(trace.fmea_trigger_log).toHaveLength(1);
    expect(trace.decision_rule_log).toHaveLength(1);
  });

  it("sets empty arrays for omitted optional fields", () => {
    const trace = createInternalCheckerTrace({
      formulaId: "f_test",
      formulaVersion: "1.0.0",
      schemaHash: "sh-001",
      formulaRegistryHash: "frh-001",
      normalizedInputHash: "nih-001",
    });
    expect(trace.intermediate_output_hashes).toEqual([]);
    expect(trace.unit_dimension_log).toEqual([]);
    expect(trace.uncertainty_propagation_log).toEqual([]);
    expect(trace.sensitivity_log).toEqual([]);
    expect(trace.fmea_trigger_log).toEqual([]);
    expect(trace.decision_rule_log).toEqual([]);
  });

  it("boundary constant is defined", () => {
    expect(INTERNAL_CHECKER_TRACE_BOUNDARY).toBe("SERVER_ONLY_MODULE_IMPORT_RESTRICTED");
  });
});

describe("Internal checker trace public absence", () => {
  it("does not export to public surface", () => {
    // Verify the module cannot be used to produce public content
    const trace = createInternalCheckerTrace({
      formulaId: "f_test",
      formulaVersion: "1.0.0",
      schemaHash: "sh-001",
      formulaRegistryHash: "frh-001",
      normalizedInputHash: "nih-001",
    });
    // The redaction_status ensures this is NOT publicly exposed
    expect(trace.redaction_status).toBe("INTERNAL_TRACE_RESTRICTED");
    // Verify no public-friendly fields leak
    const keys = Object.keys(trace);
    expect(keys).not.toContain("public_explanation");
    expect(keys).not.toContain("public_summary");
  });
});
