import { describe, expect, it } from "vitest";

import { getAllModules } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";
import { getProReportContract } from "@/sectorcalc/pro-report/pro-report-contract-registry";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const LIVE_MODULES = getAllModules();

describe("20 LIVE PRO schema, formula and report semantic closure", () => {
  it("has exactly twenty independently registered LIVE formula modules", () => {
    expect(LIVE_MODULES).toHaveLength(20);
    expect(new Set(LIVE_MODULES.map((module) => module.toolKey)).size).toBe(20);
  });

  for (const module of LIVE_MODULES) {
    it(`${module.toolKey}: every report output is a declared server output`, () => {
      const report = getProReportContract(module.toolKey);
      expect(report, `${module.toolKey} requires a strict report contract`).not.toBeNull();
      const declared = new Set(module.declaredOutputKeys);
      for (const section of report?.sections ?? []) {
        for (const entry of section.entries) {
          expect(
            declared.has(entry.sourceOutputId),
            `${module.toolKey}:${entry.sourceOutputId} is not declared by its formula`,
          ).toBe(true);
        }
      }
    });

    it(`${module.toolKey}: every normalized input has one visible semantic source and unit basis`, () => {
      const resolved = resolveApprovedToolSchema(module.toolKey);
      expect(resolved.ok).toBe(true);
      if (!resolved.ok) return;

      const visibleByNormalizedId = new Map(
        resolved.schema.inputs
          .filter((input) => typeof input.normalized_id === "string")
          .map((input) => [input.normalized_id as string, input]),
      );

      expect(visibleByNormalizedId.size).toBe(module.requiredInputKeys.length);
      for (const normalizedId of module.requiredInputKeys) {
        const input = visibleByNormalizedId.get(normalizedId);
        expect(
          input,
          `${module.toolKey}:${normalizedId} has no visible source input`,
        ).toBeDefined();
        expect(input?.name.trim().length).toBeGreaterThan(2);
        expect(
          input?.base_unit,
          `${module.toolKey}:${normalizedId} has no physical/economic base unit`,
        ).toBeTruthy();
        expect(input?.allowed_display_units.length).toBeGreaterThan(0);
      }
    });

    it(`${module.toolKey}: missing, unknown and non-finite inputs fail closed`, () => {
      const valid = { ...module.sampleInputs };
      const missing = { ...valid };
      delete missing[module.requiredInputKeys[0]];
      const missingResult = module.calculate(missing);
      expect(missingResult.status).toBe("BLOCKED");

      const unknownResult = module.calculate({ ...valid, n_unapproved_input: 1 });
      expect(unknownResult.status).toBe("BLOCKED");

      const nonFiniteResult = module.calculate({
        ...valid,
        [module.requiredInputKeys[0]]: Number.NaN,
      });
      expect(nonFiniteResult.status).toBe("BLOCKED");
    });

    it(`${module.toolKey}: repeated execution is deterministic and finite`, () => {
      const first = module.calculate({ ...module.sampleInputs });
      const second = module.calculate({ ...module.sampleInputs });
      expect(first).toEqual(second);
      expect(first.status).not.toBe("BLOCKED");
      expect(Object.keys(first.outputs).sort()).toEqual(
        [...module.declaredOutputKeys].sort(),
      );
      for (const value of Object.values(first.outputs)) {
        expect(Number.isFinite(value)).toBe(true);
      }
    });
  }

  it("loss detector exposes selling price, per-batch material and per-unit costs without aliasing", () => {
    const resolved = resolveApprovedToolSchema("loss-making-job-detector");
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    const byId = new Map(resolved.schema.inputs.map((input) => [input.id, input]));

    expect(byId.get("machine_rate")?.name).toBe("Quoted Selling Price per Unit");
    expect(byId.get("machine_rate")?.base_unit).toBe("currency_unit_per_unit");
    expect(byId.get("material_cost")?.name).toBe("Material Cost per Batch");
    expect(byId.get("material_cost")?.base_unit).toBe("currency_unit_per_batch");
    expect(byId.get("labor_rate")?.base_unit).toBe("currency_unit_per_unit");
    expect(byId.get("overhead_rate")?.base_unit).toBe("currency_unit_per_unit");
    expect(byId.get("defect_or_loss_cost")?.base_unit).toBe("currency_unit_per_unit");
  });

  it("capital appraisal removes unrelated volume, labor and overhead fields", () => {
    const resolved = resolveApprovedToolSchema(
      "capital-equipment-investment-appraisal-npv-irr",
    );
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    const normalizedIds = resolved.schema.inputs.map((input) => input.normalized_id);
    expect(normalizedIds).not.toContain("n_annual_volume");
    expect(normalizedIds).not.toContain("n_labor_rate");
    expect(normalizedIds).not.toContain("n_overhead_rate");
    expect(normalizedIds).toContain("n_defect_or_loss_cost");
    expect(
      resolved.schema.inputs.find((input) => input.id === "annual_net_cash_flow")
        ?.base_unit,
    ).toBe("currency_unit_per_year");
  });
});
