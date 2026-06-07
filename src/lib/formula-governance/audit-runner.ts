/**
 * Formula governance audit runner — contract-driven assurance pipeline.
 */

import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  auditDecisionLanguage,
  auditPurposeFormulaAlignment,
  hasDecisionDisclaimer,
} from "@/lib/formula-governance/decision-language-guard";
import { auditDimensionalRules } from "@/lib/formula-governance/dimensional-guard";
import {
  buildFormulaInventory,
  getInventoryEntryBySlug,
  summarizeInventory,
} from "@/lib/formula-governance/inventory";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import {
  evaluateCriticalPassPolicy,
  isCriticalRisk,
  resolveAuditStatus,
} from "@/lib/formula-governance/risk-rules";
import type {
  AuditFinding,
  ContractAuditResult,
  FormulaContract,
  GovernanceAuditReport,
} from "@/lib/formula-governance/types";

export type RunGovernanceAuditOptions = {
  readonly rootDir?: string;
  readonly strict?: boolean;
};

function auditContract(
  contract: FormulaContract,
  implementedInputKeys: readonly string[],
  rootDir: string,
): ContractAuditResult {
  const findings: AuditFinding[] = [
    ...auditPurposeFormulaAlignment(contract),
    ...auditDimensionalRules(contract, implementedInputKeys),
    ...auditDecisionLanguage(contract),
  ];

  const oraclePresent = hasOracleForTool(contract.toolId, rootDir);
  const disclaimerPresent = hasDecisionDisclaimer(contract);

  if (isCriticalRisk(contract.riskLevel)) {
    findings.push(
      ...evaluateCriticalPassPolicy({
        contract,
        findings,
        implementedInputKeys,
        oraclePresent,
        disclaimerPresent,
      }),
    );
  }

  const edgeRules = contract.validationRules.filter((r) => r.kind === "edge");
  if (isCriticalRisk(contract.riskLevel) && edgeRules.length === 0) {
    findings.push({
      code: "EDGE_NO_RULES",
      severity: "warning",
      message: "No edge-case validation rules declared.",
    });
  }

  if (implementedInputKeys.length === 0) {
    findings.push({
      code: "INV_TOOL_NOT_FOUND",
      severity: "warning",
      message: "Tool not found in inventory scan — input coverage not verified.",
    });
  }

  return {
    toolId: contract.toolId,
    slug: contract.slug,
    toolName: contract.toolName,
    riskLevel: contract.riskLevel,
    status: resolveAuditStatus(findings),
    findings,
  };
}

function buildRecommendedActions(
  results: readonly ContractAuditResult[],
  criticalMissingSlugs: readonly string[],
): string[] {
  const actions: string[] = [];

  const failed = results.filter((r) => r.status === "FAIL");
  if (failed.some((r) => r.slug === "rent-vs-buy-calculator")) {
    actions.push("Fix rent-vs-buy formula and inputs before launch.");
  }

  if (criticalMissingSlugs.length > 0) {
    actions.push(
      `Add FormulaContracts for ${criticalMissingSlugs.length} critical tool(s) without coverage.`,
    );
  }

  if (failed.length > 0) {
    actions.push("Resolve critical FAIL findings before enabling strict deploy gate.");
  }

  actions.push("Phase 2: run smart inventory risk scan across full catalog.");
  actions.push("Phase 3: add property-based and oracle tests for top critical tools.");

  return actions;
}

export function runGovernanceAudit(
  options: RunGovernanceAuditOptions = {},
): GovernanceAuditReport {
  const rootDir = options.rootDir ?? process.cwd();
  const strictMode = options.strict ?? false;
  const inventory = buildFormulaInventory(rootDir);
  const inventorySummary = summarizeInventory(inventory);

  const results = FORMULA_CONTRACTS.map((contract) => {
    const entry = getInventoryEntryBySlug(inventory, contract.slug);
    const implementedInputKeys = entry?.inputKeys ?? [];
    return auditContract(contract, implementedInputKeys, rootDir);
  });

  const passCount = results.filter((r) => r.status === "PASS").length;
  const needsReviewCount = results.filter((r) => r.status === "NEEDS_REVIEW").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;
  const disableOrSoftenCount = results.filter((r) => r.status === "DISABLE_OR_SOFTEN").length;

  const criticalFails = results.filter(
    (r) => isCriticalRisk(r.riskLevel) && (r.status === "FAIL" || r.status === "DISABLE_OR_SOFTEN"),
  );

  const criticalToolsWithoutContract = inventorySummary.criticalMissingContracts.map(
    (e) => e.slug,
  );

  const launchBlockers = [
    ...criticalFails.map((r) => r.slug),
    ...criticalToolsWithoutContract.filter((slug) => !criticalFails.some((f) => f.slug === slug)),
  ];

  const warnings = results
    .flatMap((r) => r.findings.filter((f) => f.severity === "warning").map((f) => `${r.slug}: ${f.message}`));

  if (criticalToolsWithoutContract.length > 0) {
    warnings.push(
      `${criticalToolsWithoutContract.length} critical tool(s) have no FormulaContract.`,
    );
  }

  return {
    generatedAt: new Date().toISOString(),
    strictMode,
    totalToolsScanned: inventorySummary.total,
    totalContracts: FORMULA_CONTRACTS.length,
    passCount,
    needsReviewCount,
    failCount,
    disableOrSoftenCount,
    criticalToolsDetected: inventorySummary.critical,
    highToolsDetected: inventorySummary.high,
    criticalToolsWithoutContract,
    criticalFails,
    launchBlockers: [...new Set(launchBlockers)],
    warnings,
    recommendedNextActions: buildRecommendedActions(results, criticalToolsWithoutContract),
    results,
  };
}

export function formatGovernanceAuditReport(report: GovernanceAuditReport): string {
  const lines: string[] = [
    "Formula Governance Audit Report",
    "--------------------------------",
    `Generated: ${report.generatedAt}`,
    `Strict mode: ${report.strictMode ? "yes" : "no"}`,
    "",
    `Total tools scanned: ${report.totalToolsScanned}`,
    `Contracts found: ${report.totalContracts}`,
    `Critical tools detected: ${report.criticalToolsDetected}`,
    `High tools detected: ${report.highToolsDetected}`,
    "",
    `PASS: ${report.passCount}`,
    `NEEDS_REVIEW: ${report.needsReviewCount}`,
    `FAIL: ${report.failCount}`,
    `DISABLE_OR_SOFTEN: ${report.disableOrSoftenCount}`,
    "",
  ];

  if (report.criticalFails.length > 0) {
    lines.push("Critical FAIL:");
    for (const fail of report.criticalFails) {
      lines.push(`- ${fail.slug}`);
      for (const finding of fail.findings.filter((f) => f.severity === "blocker")) {
        lines.push(`  Reason: ${finding.message}`);
      }
    }
    lines.push("");
  }

  if (report.criticalToolsWithoutContract.length > 0) {
    lines.push(
      `Critical tools without contracts: ${report.criticalToolsWithoutContract.length}`,
    );
    for (const slug of report.criticalToolsWithoutContract.slice(0, 20)) {
      lines.push(`- ${slug}`);
    }
    if (report.criticalToolsWithoutContract.length > 20) {
      lines.push(`- ... and ${report.criticalToolsWithoutContract.length - 20} more`);
    }
    lines.push("");
  }

  if (report.launchBlockers.length > 0) {
    lines.push("Launch blockers:");
    for (const slug of report.launchBlockers.slice(0, 30)) {
      lines.push(`- ${slug}`);
    }
    lines.push("");
  }

  if (report.warnings.length > 0) {
    lines.push("Warnings:");
    for (const warning of report.warnings.slice(0, 15)) {
      lines.push(`- ${warning}`);
    }
    lines.push("");
  }

  if (report.recommendedNextActions.length > 0) {
    lines.push("Recommended next actions:");
    report.recommendedNextActions.forEach((action, index) => {
      lines.push(`${index + 1}. ${action}`);
    });
  }

  return lines.join("\n");
}

export function shouldFailStrictAudit(report: GovernanceAuditReport): boolean {
  return report.criticalFails.length > 0 || report.criticalToolsWithoutContract.length > 0;
}
