import { describe, expect, it } from "vitest";

import { pass2RuntimeExecution } from "@/app/api/pro-calculator/execute/route";
import type {
  ExecuteRequest,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";
import { buildProReport } from "@/sectorcalc/pro-report/pro-report-adapter";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const TOOL_KEY = "loss-making-job-detector";

function resolveSchema(): SuperV4Schema {
  const resolved = resolveApprovedToolSchema(TOOL_KEY);
  expect(resolved.ok).toBe(true);
  if (!resolved.ok) throw new Error(resolved.errors.join(" | "));
  return resolved.schema;
}

function buildRequest(schema: SuperV4Schema): ExecuteRequest {
  const rawInputs: Record<string, number> = {
    machine_rate: 8,
    material_cost: 300,
    labor_rate: 55,
    overhead_rate: 75,
    defect_or_loss_cost: 20,
    target_margin: 0.25,
    batch_quantity: 100,
    annual_volume: 5000,
    source_confidence: 0.9,
  };
  const selectedUnits = Object.fromEntries(
    schema.inputs.map((input) => [
      input.id,
      input.allowed_display_units[0] ?? input.base_unit ?? "",
    ]),
  );

  return {
    request_id: "test-loss-making-job",
    tool_id: schema.tool_id,
    tool_key: schema.tool_key,
    schema_version: schema.metadata.schema_version,
    raw_inputs: rawInputs,
    selected_units: selectedUnits,
    display_currency: "EUR",
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

describe("loss-making job API and report integrity", () => {
  it("normalizes /batch and /unit bases without reinterpreting machine cost as revenue", async () => {
    const schema = resolveSchema();
    const request = buildRequest(schema);
    const result = await pass2RuntimeExecution(request, schema);

    expect(result.ok).toBe(true);
    expect(result.normalizedInputs.machine_rate).toBe(8);
    expect(result.normalizedInputs.material_cost).toBe(300);
    expect(result.normalizedInputs.batch_quantity).toBe(100);
    expect(numericOutput(result, "out_normalized_demand")).toBe(800);
    expect(numericOutput(result, "out_demand_metric")).toBe(-145);
    expect(numericOutput(result, "out_capacity_metric")).toBe(204);
    expect(numericOutput(result, "out_utilization_margin")).toBe(-18.125);
    expect(numericOutput(result, "out_money_at_risk")).toBe(797500);
    expect(numericOutput(result, "out_final_decision_state")).toBe(2);
  });

  it("renders the strict commercial report with selected currency and loss decision", async () => {
    const schema = resolveSchema();
    const request = buildRequest(schema);
    const result = await pass2RuntimeExecution(request, schema);
    expect(result.ok).toBe(true);

    const report = buildProReport({
      toolSlug: TOOL_KEY,
      outputs: result.outputs.map((output) => ({
        id: output.id,
        name: output.name,
        value: output.value,
        unit: output.unit ?? undefined,
      })),
      rawInputs: request.raw_inputs,
      selectedUnits: request.selected_units,
      displayCurrency: "EUR",
    });
    expect(report).not.toBeNull();

    const entries = new Map(
      report?.resolvedSections
        .flatMap((section) => section.entries)
        .map((entry) => [entry.label, entry]) ?? [],
    );
    expect(entries.get("Quoted Batch Revenue")?.value).toBe(800);
    expect(entries.get("Quoted Batch Revenue")?.unit).toBe("EUR/batch");
    expect(entries.get("Gross Margin per Unit")?.value).toBe(-145);
    expect(entries.get("Minimum Price at Target Gross Margin")?.value).toBe(204);
    expect(entries.get("Job Decision")?.value).toBe("LOSS-MAKING");
  });

  it("blocks a missing selling price instead of fabricating profitability", async () => {
    const schema = resolveSchema();
    const request = buildRequest(schema);
    delete request.raw_inputs.machine_rate;
    const result = await pass2RuntimeExecution(request, schema);

    expect(result.ok).toBe(false);
    expect(result.outputs).toHaveLength(0);
    expect(result.pipelineState).toBe("INPUT_KEY_MISSING");
  });
});
