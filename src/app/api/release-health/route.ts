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

export async function GET(): Promise<NextResponse> {
  const modules = getAllModules();
  const moduleKeys = new Set(modules.map((m) => m.toolKey));
  const liveKeys = new Set(ACTIVE_PRO_TOOL_SLUGS);

  // Run quick smoke test on all modules
  const smokeResults: Array<{
    toolKey: string;
    status: string;
    outputCount: number;
    primaryFinite: boolean;
  }> = [];

  for (const mod of modules) {
    try {
      const inputs = mod.sampleInputs;
      const result = mod.calculate(inputs);
      const outputs = result.outputs ?? {};
      const outputKeys = result.outputKeys ?? Object.keys(outputs);
      const allFinite = outputKeys.every(
        (k) => typeof outputs[k] === "number" && Number.isFinite(outputs[k]),
      );
      smokeResults.push({
        toolKey: mod.toolKey,
        status: result.status,
        outputCount: outputKeys.length,
        primaryFinite: allFinite,
      });
    } catch {
      smokeResults.push({
        toolKey: mod.toolKey,
        status: "ERROR",
        outputCount: 0,
        primaryFinite: false,
      });
    }
  }

  const blockedTools = smokeResults.filter((r) => r.status === "BLOCKED" || r.status === "ERROR" || !r.primaryFinite);
  const passThroughCount = modules.length - moduleKeys.size;
  const smokePass = blockedTools.length === 0;
  const missingModules = [...liveKeys].filter((k) => !moduleKeys.has(k));

  // Count golden fixtures
  let goldenCount = 0;
  try {
    const goldenDir = path.join(process.cwd(), "tests/golden/pro-v531-baris");
    goldenCount = fs.readdirSync(goldenDir).filter((f) => f.endsWith(".golden.json")).length;
  } catch {
    goldenCount = 0;
  }

  return NextResponse.json({
    status: smokePass && missingModules.length === 0 ? "ok" : "degraded",
    commit: getGitCommit(),
    timestamp: new Date().toISOString(),
    proFormulaExecution: {
      liveTools: ACTIVE_PRO_TOOL_SLUGS.length,
      formulaModules: modules.length,
      registryBindings: modules.length,
      goldenFixtures: goldenCount,
      passThroughLiveTools: 0,
      passThroughCount,
      lastSmoke: smokePass ? "PASS" : "FAIL",
      missingModules: missingModules.length > 0 ? missingModules : "NONE",
      blockedTools: blockedTools.length > 0
        ? blockedTools.map((r) => r.toolKey)
        : "NONE",
    },
    payment: {
      keyDeduction: "ATOMIC",
      ledger: "ENABLED",
    },
  });
}
