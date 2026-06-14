import type { FormulaContract } from "../types";

export type TrustTraceCoverageTrace = {
  readonly slug?: string;
  readonly status: "not_wired" | "needs_review" | "fail" | "pass";
  readonly wired?: boolean;
  readonly detail: string;
  readonly covered?: number;
  readonly total?: number;
};

export function buildTrustTraceCoverage(): TrustTraceCoverageTrace {
  return { covered: 0, total: 0, status: "not_wired", detail: "Regeneration baseline" };
}

export function summarizeTrustTraceCoverage(): TrustTraceCoverageTrace {
  return { covered: 0, total: 0, status: "not_wired", detail: "Regeneration baseline" };
}

export function buildOracleCoverageTrace(slug?: string): TrustTraceCoverageTrace {
  return { slug, status: "not_wired", wired: false, detail: "Regeneration baseline" };
}

export function buildPropertyCoverageTrace(_contract?: FormulaContract): TrustTraceCoverageTrace {
  return { status: "not_wired", wired: false, detail: "Regeneration baseline" };
}

export function buildScenarioCoverageTrace(_contract?: FormulaContract): TrustTraceCoverageTrace {
  return { status: "not_wired", wired: false, detail: "Regeneration baseline" };
}
