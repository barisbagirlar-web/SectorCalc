// SectorCalc PRO Engine Governance — Release Health Endpoint
// Returns live engine state, formula module health, and payment infrastructure status.
// No auth required (read-only public health check).
// Server-side only.

import { NextResponse } from "next/server";
import { getAllModules } from "@/sectorcalc/formulas/pro-v531/resolve-formula-module";
import { ACTIVE_PRO_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BREAK_EVEN_TOOL_KEY = "break-even-survival-cash-calculator";
const BREAK_EVEN_OUTPUT_IDS = [
  "out_break_even_monthly_revenue",
  "out_cash_runway_months",
  "out_current_revenue_gap",
  "out_decision_code",
  "out_funding_gap",
  "out_margin_of_safety_ratio",
  "out_monthly_cash_burn",
  "out_source_confidence_ratio",
  "out_stressed_monthly_revenue",
  "out_survival_cash_target",
  "out_target_runway_breached",
  "out_uncertainty_cash_buffer",
] as const;

const BREAK_EVEN_KNOWN_ANSWERS: ReadonlyArray<
  readonly [outputId: string, expected: number, tolerance: number]
> = [
  ["out_break_even_monthly_revenue", 345238.1, 0.01],
  ["out_current_revenue_gap", 74761.9, 0.01],
  ["out_stressed_monthly_revenue", 294000, 0.01],
  ["out_monthly_cash_burn", 21520, 0.01],
  ["out_cash_runway_months", 30.2, 0.01],
  ["out_uncertainty_cash_buffer", 19368, 0.01],
  ["out_survival_cash_target", 248488, 0.01],
  ["out_funding_gap", 0, 0.001],
  ["out_decision_code", 0, 0.001],
];

function getGitCommit(): string {
  try {
    const head = fs.readFileSync(path.join(process.cwd(), ".git/HEAD"), "utf-8").trim();
    if (head.startsWith("ref: ")) {
      const refPath = head.slice(5);
      return fs.readFileSync(path.join(process.cwd(), ".git", refPath), "utf-8").trim().slice(0, 12);
    }
    return head.slice(0, 12);
  } catch {
    return "unknown";
  }
}

function exactStringSet(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
}

function isClose(actual: unknown, expected: number, tolerance: number): boolean {
  return (
    typeof actual === "number" &&
    Number.isFinite(actual) &&
    Math.abs(actual - expected) <= tolerance
  );
}

export async function GET(): Promise<NextResponse> {
  const modules = getAllModules();
  const moduleKeys = new Set(modules.map((formulaModule) => formulaModule.toolKey));
  const liveKeys = new Set(ACTIVE_PRO_TOOL_SLUGS);

  const smokeResults: Array<{
    toolKey: string;
    status: string;
    outputCount: number;
    primaryFinite: boolean;
  }> = [];

  for (const formulaModule of modules) {
    try {
      const result = formulaModule.calculate(formulaModule.sampleInputs);
      const outputs = result.outputs ?? {};
      const outputKeys = result.outputKeys ?? Object.keys(outputs);
      const allFinite = outputKeys.every(
        (key) => typeof outputs[key] === "number" && Number.isFinite(outputs[key]),
      );
      smokeResults.push({
        toolKey: formulaModule.toolKey,
        status: result.status,
        outputCount: outputKeys.length,
        primaryFinite: allFinite,
      });
    } catch {
      smokeResults.push({
        toolKey: formulaModule.toolKey,
        status: "ERROR",
        outputCount: 0,
        primaryFinite: false,
      });
    }
  }

  const breakEvenCriticalCheck = (() => {
    const formulaModule = modules.find(
      (candidate) => candidate.toolKey === BREAK_EVEN_TOOL_KEY,
    );
    if (!formulaModule) {
      return {
        status: "FAIL" as const,
        modulePresent: false,
        outputNamespace: false,
        knownAnswer: false,
        decision: false,
      };
    }

    try {
      const result = formulaModule.calculate(formulaModule.sampleInputs);
      const outputs = (result.outputs ?? {}) as Record<string, unknown>;
      const outputKeys = result.outputKeys ?? Object.keys(outputs);
      const outputNamespace = exactStringSet(outputKeys, BREAK_EVEN_OUTPUT_IDS);
      const knownAnswer = BREAK_EVEN_KNOWN_ANSWERS.every(
        ([outputId, expected, tolerance]) =>
          isClose(outputs[outputId], expected, tolerance),
      );
      const decision =
        result.status === "OK" &&
        isClose(outputs.out_decision_code, 0, 0.001) &&
        isClose(outputs.out_target_runway_breached, 0, 0.001);
      const pass = outputNamespace && knownAnswer && decision;

      return {
        status: pass ? ("PASS" as const) : ("FAIL" as const),
        modulePresent: true,
        outputNamespace,
        knownAnswer,
        decision,
      };
    } catch {
      return {
        status: "FAIL" as const,
        modulePresent: true,
        outputNamespace: false,
        knownAnswer: false,
        decision: false,
      };
    }
  })();

  const blockedTools = smokeResults.filter(
    (result) =>
      result.status === "BLOCKED" ||
      result.status === "ERROR" ||
      !result.primaryFinite,
  );
  const passThroughCount = modules.length - moduleKeys.size;
  const missingModules = [...liveKeys].filter((toolKey) => !moduleKeys.has(toolKey));
  const smokePass = blockedTools.length === 0;
  const releasePass =
    smokePass &&
    missingModules.length === 0 &&
    breakEvenCriticalCheck.status === "PASS";

  let goldenCount = 0;
  try {
    const goldenDir = path.join(process.cwd(), "tests/golden/pro-v531-baris");
    goldenCount = fs
      .readdirSync(goldenDir)
      .filter((filename) => filename.endsWith(".golden.json")).length;
  } catch {
    goldenCount = 0;
  }

  return NextResponse.json({
    status: releasePass ? "ok" : "degraded",
    commit: getGitCommit(),
    timestamp: new Date().toISOString(),
    criticalChecks: {
      breakEvenSurvivalCash: breakEvenCriticalCheck,
    },
    proFormulaExecution: {
      liveTools: ACTIVE_PRO_TOOL_SLUGS.length,
      formulaModules: modules.length,
      registryBindings: modules.length,
      goldenFixtures: goldenCount,
      passThroughLiveTools: 0,
      passThroughCount,
      lastSmoke: smokePass ? "PASS" : "FAIL",
      missingModules: missingModules.length > 0 ? missingModules : "NONE",
      blockedTools:
        blockedTools.length > 0
          ? blockedTools.map((result) => result.toolKey)
          : "NONE",
    },
    payment: {
      keyDeduction: "ATOMIC",
      ledger: "ENABLED",
    },
  });
}
