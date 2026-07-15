import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

import * as customerSku from "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import * as downtimeScrap from "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import * as oeeLoss from "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import * as scrapRework from "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import * as outsource from "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import * as plantWide from "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import * as fxCommodity from "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
import * as energyEfficiency from "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import * as motorCompressor from "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import * as weldProcedure from "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import {
  isBarisBatch2Tool,
  isBarisToolLiveExecutable,
} from "@/sectorcalc/formulas/pro-v531/baris-formula-registry";
import type { ProFormulaModule } from "@/sectorcalc/formulas/pro-v531/pro-formula-contract";

const MODULES: ProFormulaModule[] = [
  customerSku,
  downtimeScrap,
  oeeLoss,
  scrapRework,
  outsource,
  plantWide,
  fxCommodity,
  energyEfficiency,
  motorCompressor,
  weldProcedure,
];

describe("Baris PRO Batch 2 - Live Engine", () => {
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

  it("is registered as Batch 2 live-executable", () => {
    for (const module of MODULES) {
      expect(isBarisToolLiveExecutable(module.toolKey)).toBe(true);
      expect(isBarisBatch2Tool(module.toolKey)).toBe(true);
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

  it("does not overlap Batch 1", () => {
    const batch1Keys = new Set([
      "break-even-survival-cash-calculator",
      "machine-hourly-rate-proof-report",
      "loss-making-job-detector",
      "receivables-cost-payment-term-addendum",
      "setup-time-reduction-roi-smed",
      "product-sku-margin-ranker",
      "true-employee-cost-statement",
      "job-quote-builder-pro-pack",
      "machine-investment-feasibility-buy-lease-keep",
      "capital-equipment-investment-appraisal-npv-irr",
    ]);
    expect(MODULES.filter((module) => batch1Keys.has(module.toolKey))).toEqual([]);
  });
});
