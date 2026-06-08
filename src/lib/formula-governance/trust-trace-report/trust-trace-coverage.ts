/**
 * Trust trace coverage helpers — oracle/scenario/property (read-only).
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  auditOracleComparisonForSlug,
  type OracleComparisonStatus,
} from "@/lib/formula-governance/oracle/compare-production-oracle";
import type { TrustTraceCoverageTrace, TrustTraceCoverageStatus } from "@/lib/formula-governance/trust-trace-report/trust-trace-types";

function mapOracleStatus(status: OracleComparisonStatus | undefined): TrustTraceCoverageStatus {
  if (!status) {
    return "not_wired";
  }
  switch (status) {
    case "PASS":
      return "pass";
    case "FAIL":
      return "fail";
    case "NEEDS_ADAPTER":
      return "needs_review";
    case "NOT_WIRED":
      return "not_wired";
    default:
      return "not_wired";
  }
}

export function buildOracleCoverageTrace(slug: string): TrustTraceCoverageTrace {
  const summary = auditOracleComparisonForSlug(slug);
  const status = mapOracleStatus(summary?.status);
  const wired = status !== "not_wired";

  let detail = "Oracle comparison not wired.";
  if (summary) {
    detail =
      summary.status === "PASS"
        ? `${summary.passCount} scenario(s) matched oracle within tolerance.`
        : summary.status === "FAIL"
          ? `${summary.failCount} scenario(s) diverged from oracle.`
          : summary.status === "NEEDS_ADAPTER"
            ? "Production output normalization needs adapter."
            : "Oracle comparison not wired.";
  }

  return { status, wired, detail };
}

export function buildScenarioCoverageTrace(contract: FormulaContract): TrustTraceCoverageTrace {
  const declared = contract.scenarioTests.length;
  const present = contract.scenarioTests.filter((test) => test.present).length;
  const wired = declared > 0 && present === declared;

  let status: TrustTraceCoverageStatus = "not_required";
  if (contract.oracleRequired || contract.riskLevel === "critical" || contract.riskLevel === "high") {
    if (wired) {
      status = "pass";
    } else if (present > 0) {
      status = "needs_review";
    } else {
      status = "fail";
    }
  } else if (declared > 0) {
    status = wired ? "pass" : "needs_review";
  }

  return {
    status,
    wired,
    detail: `${present}/${declared} declared scenario test(s) present.`,
  };
}

export function buildPropertyCoverageTrace(contract: FormulaContract): TrustTraceCoverageTrace {
  const wired = contract.propertyTestsRegistered;
  let status: TrustTraceCoverageStatus = "not_required";

  if (contract.oracleRequired || contract.riskLevel === "critical") {
    status = wired ? "pass" : "needs_review";
  } else if (wired) {
    status = "pass";
  }

  return {
    status,
    wired,
    detail: wired ? "Property tests registered." : "Property tests not registered.",
  };
}
