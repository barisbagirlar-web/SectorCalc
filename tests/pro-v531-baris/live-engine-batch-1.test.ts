import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

import * as breakEven from "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import * as machineHourly from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import * as lossMaking from "@/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula";
import * as receivablesCost from "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import * as setupTime from "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import * as productSku from "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import * as trueEmployee from "@/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula";
import * as jobQuote from "@/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula";
import * as machineInvest from "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import * as capitalEquip from "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import {
  LIVE_BATCH_1_KEYS,
  isBarisToolLiveExecutable,
} from "@/sectorcalc/formulas/pro-v531/baris-formula-registry";
import type { ProFormulaModule } from "@/sectorcalc/formulas/pro-v531/pro-formula-contract";

const MODULES: ProFormulaModule[] = [
  breakEven,
  machineHourly,
  lossMaking,
  receivablesCost,
  setupTime,
  productSku,
  trueEmployee,
  jobQuote,
  machineInvest,
  capitalEquip,
];

describe("Baris PRO Batch 1 - Live Engine", () => {
  it("has exactly 10 unique live modules", () => {
    expect(MODULES).toHaveLength(10);
    expect(new Set(MODULES.map((module) => module.toolKey)).size).toBe(10);
  });

  it("exposes a server-only calculation contract for every module", () => {
    for (const module of MODULES) {
      expect(module.toolKey).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(module.formulaVersion).toMatch(/^\d+\.\d+\.\d+-pro-baris/);
      expect(typeof module.calculate).toBe("function");
      expect(Object.keys(module.sampleInputs).length).toBeGreaterThan(0);
      expect(module.requiredInputKeys?.length).toBeGreaterThan(0);
      expect(module.declaredOutputKeys?.length).toBeGreaterThan(0);
    }
  });

  it("executes only each module's own canonical normalized sample", () => {
    for (const module of MODULES) {
      const result = module.calculate({ ...module.sampleInputs });
      expect(result.status, module.toolKey).not.toBe("BLOCKED");
      expect(Object.keys(result.outputs).sort()).toEqual(
        [...(module.declaredOutputKeys ?? [])].sort(),
      );
      for (const [outputId, value] of Object.entries(result.outputs)) {
        expect(Number.isFinite(value), `${module.toolKey}:${outputId}`).toBe(true);
      }
      expect(result.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
    }
  });

  it("fails closed on empty and cross-tool payloads", () => {
    for (const module of MODULES) {
      const emptyResult = module.calculate({});
      expect(emptyResult.status, `${module.toolKey}:empty`).toBe("BLOCKED");
      expect(emptyResult.outputs).toEqual({});

      const crossToolResult = module.calculate({
        ...module.sampleInputs,
        n_unapproved_cross_tool_input: 1,
      });
      expect(crossToolResult.status, `${module.toolKey}:cross-tool`).toBe("BLOCKED");
      expect(crossToolResult.outputs).toEqual({});
    }
  });

  it("is registered as live-executable", () => {
    for (const module of MODULES) {
      expect(isBarisToolLiveExecutable(module.toolKey)).toBe(true);
      expect(LIVE_BATCH_1_KEYS.has(module.toolKey)).toBe(true);
    }
  });

  it("has one golden fixture per module with matching formula version", () => {
    const goldenDirectory = path.join(
      process.cwd(),
      "tests/golden/pro-v531-baris",
    );
    for (const module of MODULES) {
      const fixturePath = path.join(
        goldenDirectory,
        `${module.toolKey}.golden.json`,
      );
      expect(fs.existsSync(fixturePath), fixturePath).toBe(true);
      const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as {
        formula_version?: string;
        expected_outputs?: Record<string, number>;
      };
      expect(fixture.formula_version).toBe(module.formulaVersion);
      expect(Object.keys(fixture.expected_outputs ?? {}).length).toBeGreaterThan(0);
    }
  });
});
