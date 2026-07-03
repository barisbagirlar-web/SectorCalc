// SectorCalc SuperV4 V5.3.1 — Internal Checker Trace Module
// Server-only. No public API exposure. No client import. No public PDF/JSON exposure.
// Restricted to INTERNAL_TRACE_RESTRICTED redaction status.

import type { RedactionStatus } from "@/sectorcalc/pro-form/contract-types";

export interface InternalCheckerTrace {
  formula_id: string;
  formula_version: string;
  schema_hash: string;
  formula_registry_hash: string;
  normalized_input_hash: string;
  intermediate_output_hashes: string[];
  unit_dimension_log: string[];
  uncertainty_propagation_log: string[];
  sensitivity_log: string[];
  fmea_trigger_log: string[];
  decision_rule_log: string[];
  redaction_status: RedactionStatus;
}

export function createInternalCheckerTrace(params: {
  formulaId: string;
  formulaVersion: string;
  schemaHash: string;
  formulaRegistryHash: string;
  normalizedInputHash: string;
  intermediateOutputHashes?: string[];
  unitDimensionLog?: string[];
  uncertaintyPropagationLog?: string[];
  sensitivityLog?: string[];
  fmeaTriggerLog?: string[];
  decisionRuleLog?: string[];
}): InternalCheckerTrace {
  return {
    formula_id: params.formulaId,
    formula_version: params.formulaVersion,
    schema_hash: params.schemaHash,
    formula_registry_hash: params.formulaRegistryHash,
    normalized_input_hash: params.normalizedInputHash,
    intermediate_output_hashes: params.intermediateOutputHashes ?? [],
    unit_dimension_log: params.unitDimensionLog ?? [],
    uncertainty_propagation_log: params.uncertaintyPropagationLog ?? [],
    sensitivity_log: params.sensitivityLog ?? [],
    fmea_trigger_log: params.fmeaTriggerLog ?? [],
    decision_rule_log: params.decisionRuleLog ?? [],
    redaction_status: "INTERNAL_TRACE_RESTRICTED",
  };
}

// Boundary check — this file must never be imported by client code.
// Manifest constant for runtime guard verification.
export const INTERNAL_CHECKER_TRACE_BOUNDARY = "SERVER_ONLY_MODULE_IMPORT_RESTRICTED";
