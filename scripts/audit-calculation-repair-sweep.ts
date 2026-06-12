#!/usr/bin/env npx tsx
/**
 * Autonomous Calculation Tool Repair Sweep — orchestrates Dual-Intelligence gates.
 * PASS / WARN / FAIL / QUARANTINE decision engine for deploy gating.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import { runBatchRemediationApplyAudit } from "@/lib/formula-governance/full-tool-audit/remediation/apply-gate/batch-remediation-apply-audit";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { isEngineModulesProductionSlug } from "@/lib/formula-governance/oracle/engine-modules-production-locators";
import {
  assertFormulaRegulationMetadata,
  resolveFormulaRegulationMetadata,
} from "@/lib/formulas/formula-regulation";

type SweepDecision = "PASS" | "WARN" | "FAIL" | "QUARANTINE";

type SweepGate = {
  readonly id: string;
  readonly label: string;
  readonly decision: SweepDecision;
  readonly detail: string;
};

function classifyTool(item: {
  readonly slug: string;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly readiness: { readonly productionSafe: boolean };
  readonly oracleStatus: string;
}): SweepDecision {
  if (item.blockers.length > 0) {
    return item.oracleStatus === "FAIL" ? "QUARANTINE" : "FAIL";
  }
  if (item.oracleStatus === "FAIL") {
    return "QUARANTINE";
  }
  if (!item.readiness.productionSafe) {
    return isEngineModulesProductionSlug(item.slug) ? "WARN" : "FAIL";
  }
  if (item.warnings.length > 0) {
    return "WARN";
  }
  return "PASS";
}

function main(): void {
  const strict = process.argv.includes("--strict");
  const gates: SweepGate[] = [];

  const governance = runGovernanceAudit({ strict: false });
  const governanceDecision: SweepDecision =
    governance.launchBlockers.length > 0 || governance.criticalFails.length > 0
      ? "FAIL"
      : governance.warnings.length > 0
        ? "WARN"
        : "PASS";
  gates.push({
    id: "formula-governance",
    label: "Formula governance (Mind 1 oracle + contracts)",
    decision: governanceDecision,
    detail: `contracts=${governance.totalContracts} blockers=${governance.launchBlockers.length}`,
  });

  const fullTool = runFullExistingToolAudit();
  const toolDecisions = fullTool.items.map((item) => ({
    slug: item.slug,
    decision: classifyTool(item),
  }));
  const pass = toolDecisions.filter((row) => row.decision === "PASS").length;
  const warn = toolDecisions.filter((row) => row.decision === "WARN").length;
  const fail = toolDecisions.filter((row) => row.decision === "FAIL").length;
  const quarantine = toolDecisions.filter((row) => row.decision === "QUARANTINE").length;

  const inventoryDecision: SweepDecision =
    fail > 0 ? "FAIL" : quarantine > 0 ? "QUARANTINE" : "PASS";
  gates.push({
    id: "full-tool-inventory",
    label: "Full tool inventory scan",
    decision: inventoryDecision,
    detail: `PASS=${pass} WARN=${warn} FAIL=${fail} QUARANTINE=${quarantine}`,
  });

  let regulationFailures = 0;
  for (const contract of FORMULA_CONTRACTS) {
    try {
      assertFormulaRegulationMetadata(resolveFormulaRegulationMetadata(contract));
    } catch {
      regulationFailures += 1;
    }
  }
  gates.push({
    id: "formula-regulation-metadata",
    label: "Formula regulation metadata (lastUpdated, source, validUntil)",
    decision: regulationFailures > 0 ? "FAIL" : "PASS",
    detail: `contracts=${FORMULA_CONTRACTS.length} failures=${regulationFailures}`,
  });

  const remediation = runBatchRemediationApplyAudit();
  const remediationDecision: SweepDecision = remediation.blocked > 0 ? "FAIL" : "PASS";
  gates.push({
    id: "remediation-apply-gate",
    label: "Controlled remediation apply gate",
    decision: remediationDecision,
    detail: `blocked=${remediation.blocked} canApply=${remediation.canApplyCount}`,
  });

  const overall: SweepDecision = gates.some((gate) => gate.decision === "FAIL")
    ? "FAIL"
    : gates.some((gate) => gate.decision === "QUARANTINE")
      ? "QUARANTINE"
      : "PASS";

  console.log("Autonomous Calculation Repair Sweep");
  console.log("===================================");
  for (const gate of gates) {
    console.log(`${gate.decision.padEnd(11)} ${gate.label} — ${gate.detail}`);
  }
  console.log(`\nOVERALL: ${overall}`);

  const cacheDir = join(process.cwd(), "scripts/.cache");
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(
    join(cacheDir, "calculation-repair-sweep.json"),
    JSON.stringify({ overall, gates, toolDecisions, generatedAt: new Date().toISOString() }, null, 2),
  );

  if (strict && overall !== "PASS") {
    process.exit(1);
  }
}

main();
