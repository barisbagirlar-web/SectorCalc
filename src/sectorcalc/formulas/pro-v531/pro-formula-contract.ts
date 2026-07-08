// SectorCalc PRO Engine Governance — ProFormulaModule Contract
// Every LIVE PRO formula module MUST conform to this contract.
// Server-side only. Never exposed to client.

import "server-only";

export type ProFormulaStatus = "OK" | "REVIEW" | "BLOCKED";

export interface ProFormulaResult {
  status: ProFormulaStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";
}

export interface ProFormulaModule {
  toolKey: string;
  formulaVersion?: string;
  calculate: (inputs: Record<string, number>) => ProFormulaResult;
  sampleInputs: Record<string, number>;
}
