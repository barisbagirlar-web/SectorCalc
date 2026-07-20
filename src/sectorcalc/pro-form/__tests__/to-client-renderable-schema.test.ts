import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { toClientRenderableSchema } from "../to-client-renderable-schema";
import type { SuperV4Schema } from "../contract-types";

const VON_MISES_PATH = join(
  process.cwd(),
  "src/sectorcalc/schemas/free-v531/278-von-mises-stress-calculator.json",
);

describe("toClientRenderableSchema", () => {
  it("strips QA dossiers while preserving input E-E-A-T and interactive contract fields", () => {
    const raw = JSON.parse(readFileSync(VON_MISES_PATH, "utf8")) as SuperV4Schema;
    // Simulate enrichment markers that resolveApprovedToolSchema attaches.
    raw.inputs = raw.inputs.map((input, index) => ({
      ...input,
      ...(index === 0
        ? {
            _reference_source:
              "Derived from declared schema engineering range; verify against project source data.",
            _reference_default_text: "0–500 MPa",
            _reference_origin: "midpoint_of_engineering_range",
          }
        : {}),
    })) as SuperV4Schema["inputs"];

    const before = JSON.stringify(raw).length;
    const client = toClientRenderableSchema(raw);
    const after = JSON.stringify(client).length;

    expect(after).toBeLessThan(before * 0.45);
    expect(JSON.stringify(client.test_plan)).not.toContain("test_cases\":[{");
    expect(Array.isArray((client.test_plan as { test_cases?: unknown[] }).test_cases)).toBe(true);
    expect((client.test_plan as { test_cases: unknown[] }).test_cases).toHaveLength(0);
    expect((client.red_team_review as { issues: unknown[] }).issues).toHaveLength(0);
    expect(client.formulas).toEqual([]);
    expect(client.validation_contract).toEqual({});

    // Interactive + E-E-A-T preserved
    expect(client.inputs).toHaveLength(raw.inputs.length);
    expect(client.inputs[0]).toMatchObject({
      id: raw.inputs[0].id,
      user_help_text: raw.inputs[0].user_help_text,
      _reference_source: expect.stringContaining("engineering range"),
    });
    expect(client.normalized_inputs).toEqual(raw.normalized_inputs);
    expect(client.outputs).toEqual(raw.outputs);
    expect(client.form_runtime_binding).toEqual(raw.form_runtime_binding);
    expect(client.ui_contract).toEqual(raw.ui_contract);
    expect(client.unit_conversion_contract).toEqual(raw.unit_conversion_contract);
    expect(client.metadata.schema_version).toBe(raw.metadata.schema_version);
    expect(Array.isArray(client.standards)).toBe(true);
  });
});
