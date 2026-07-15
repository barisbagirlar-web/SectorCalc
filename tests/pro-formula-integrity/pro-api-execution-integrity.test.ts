import { describe, expect, it } from "vitest";

import {
  pass2RuntimeExecution,
  pass3PublicControl,
} from "@/app/api/pro-calculator/execute/route";
import type {
  ExecuteRequest,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const WELD_TOOL = "weld-procedure-cost-consumable-estimation-suite";

function resolveWeldSchema(): SuperV4Schema {
  const resolved = resolveApprovedToolSchema(WELD_TOOL);
  expect(resolved.ok).toBe(true);
  if (!resolved.ok) throw new Error(resolved.errors.join(" | "));
  return resolved.schema;
}

function buildWeldRequest(
  schema: SuperV4Schema,
  overrides: Record<string, number> = {},
): ExecuteRequest {
  const rawInputs: Record<string, number> = {
    weld_length: 50,
    weld_throat: 8,
    weld_density: 7.85,
    wire_cost_per_kg: 15,
    gas_cost_per_min: 0.15,
    arc_time: 180,
    weld_time_min: 240,
    labor_rate: 55,
    overhead_rate: 25,
    deposition_efficiency_pct: 85,
    source_confidence: 0.9,
    ...overrides,
  };

  return {
    request_id: "test-weld-request",
    tool_id: schema.tool_id,
    tool_key: schema.tool_key,
    schema_version: schema.metadata.schema_version,
    raw_inputs: rawInputs,
    selected_units: {
      weld_length: "m",
      weld_throat: "mm",
      weld_density: "g_per_cm3",
      wire_cost_per_kg: "currency_unit_per_kg",
      gas_cost_per_min: "currency_unit_per_min",
      arc_time: "min",
      weld_time_min: "min",
      labor_rate: "currency_unit_per_h",
      overhead_rate: "currency_unit_per_h",
      deposition_efficiency_pct: "percent",
      source_confidence: "ratio",
    },
    display_currency: "USD",
    locale: "en",
    evidence_acknowledgements: {},
    client_timestamp: "2026-07-15T00:00:00.000Z",
  };
}

function numericOutput(
  result: Awaited<ReturnType<typeof pass2RuntimeExecution>>,
  id: string,
): number {
  const value = result.outputs.find((output) => output.id === id)?.value;
  expect(typeof value).toBe("number");
  return value as number;
}

describe("PRO API execution integrity", () => {
  it("normalizes weld density once and executes the closed-form module", async () => {
    const schema = resolveWeldSchema();
    const request = buildWeldRequest(schema);
    const result = await pass2RuntimeExecution(request, schema);

    expect(result.ok).toBe(true);
    expect(result.normalizedInputs.weld_density).toBeCloseTo(7850, 12);
    expect(
      result.normalizedAudit.find((input) => input.input_id === "weld_density")
        ?.base_value,
    ).toBeCloseTo(7850, 12);
    expect(numericOutput(result, "out_wire_mass_kg")).toBeCloseTo(29.553, 3);
    expect(numericOutput(result, "out_total_cost_floor")).toBeGreaterThan(500);
  });

  it("blocks the reported impossible 1780 m / 80 mm / 15 min case", async () => {
    const schema = resolveWeldSchema();
    const request = buildWeldRequest(schema, {
      weld_length: 1780,
      weld_throat: 80,
      arc_time: 15,
      weld_time_min: 30,
      wire_cost_per_kg: 8,
      gas_cost_per_min: 0.35,
      labor_rate: 65,
      overhead_rate: 25,
    });
    const result = await pass2RuntimeExecution(request, schema);

    expect(result.ok).toBe(false);
    expect(result.outputs).toHaveLength(0);
    expect(result.pipelineState).toMatch(
      /PHYSICAL_BOUNDS_BLOCKED|FORMULA_RESULT_CONTRACT_MISMATCH/,
    );
  });

  it("blocks total weld time below arc-on time", async () => {
    const schema = resolveWeldSchema();
    const request = buildWeldRequest(schema, {
      arc_time: 120,
      weld_time_min: 60,
    });
    const result = await pass2RuntimeExecution(request, schema);

    expect(result.ok).toBe(false);
    expect(result.outputs).toHaveLength(0);
    expect(result.errors.join(" ")).toMatch(/total weld time|blocked/i);
  });

  it("blocks unknown input keys before formula execution", async () => {
    const schema = resolveWeldSchema();
    const request = buildWeldRequest(schema);
    request.raw_inputs.unapproved_input = 123;
    const result = await pass2RuntimeExecution(request, schema);

    expect(result.ok).toBe(false);
    expect(result.pipelineState).toBe("INPUT_KEY_UNKNOWN");
  });

  it("blocks a missing required input before formula execution", async () => {
    const schema = resolveWeldSchema();
    const request = buildWeldRequest(schema);
    delete request.raw_inputs.weld_throat;
    const result = await pass2RuntimeExecution(request, schema);

    expect(result.ok).toBe(false);
    expect(result.pipelineState).toBe("INPUT_KEY_MISSING");
  });

  it("creates a SHA-256 public proof seal only after successful execution", async () => {
    const schema = resolveWeldSchema();
    const request = buildWeldRequest(schema);
    const pass2 = await pass2RuntimeExecution(request, schema);
    expect(pass2.ok).toBe(true);

    const pass3 = pass3PublicControl(request, schema, pass2);
    expect(pass3.ok).toBe(true);
    expect(pass3.auditSeal.seal_status).toBe("SEALED");
    expect(pass3.auditSeal.hash_algorithm).toBe("SHA-256");
    expect(pass3.auditSeal.input_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(pass3.auditSeal.output_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(pass3.auditSeal.schema_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(pass3.auditSeal.signature_status).toBe("UNSIGNED");
  });
});
