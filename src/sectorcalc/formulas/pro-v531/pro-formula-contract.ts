// SectorCalc PRO Engine Governance — ProFormulaModule Contract
// Every LIVE PRO formula module MUST conform to this contract.
// Server-side only. Never exposed to client.

import "server-only";
import type { DecimalSource } from "./pro-decimal-domain";

export type ProFormulaStatus = "OK" | "REVIEW" | "BLOCKED";

export interface ProFormulaResult {
  status: ProFormulaStatus;
  outputs: Record<string, number>;
  /** Canonical decimal strings used for deterministic audit hashing. */
  decimalOutputs?: Record<string, string>;
  warnings: string[];
  outputKeys: string[];
  redaction_status:
    | "PUBLIC_SAFE_REDACTED"
    | "REDACTION_NOT_REQUIRED"
    | "REDACTION_FAILED_BLOCKED";
}

export interface ProFormulaModule {
  toolKey: string;
  formulaVersion?: string;
  arithmeticMode?: "DECIMAL_BIGJS_50_HALF_EVEN" | "INTERVAL_MPMATH_IV";
  modelId?: string;
  verificationEvidenceId?: string;
  calculate: (inputs: Record<string, DecimalSource>) => ProFormulaResult;
  sampleInputs: Record<string, DecimalSource>;
  requiredInputKeys?: readonly string[];
  declaredOutputKeys?: readonly string[];
}
