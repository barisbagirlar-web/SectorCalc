// SectorCalc SuperV4 V5.3.1 — Private Formula Registry
// Server-side only. Never exposed to client.

export type FormulaOperation =
  | "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE"
  | "MIN" | "MAX" | "ABS"
  | "RATIO" | "MARGIN" | "UTILIZATION" | "CAPACITY_REDUCTION"
  | "WEIGHTED_SUM" | "THRESHOLD_DECISION" | "PASS_THROUGH";

export interface FormulaRegistryNode {
  formula_id: string;
  formula_version: string;
  schema_hash_binding: string;
  formula_registry_hash: string;
  operation: FormulaOperation;
  constant_refs: number[];
  input_refs: string[];
  output_ref: string;
  unit_dimension_rule: string;
  uncertainty_rule: "ANALYTICAL" | "MONTE_CARLO" | "NONE";
  sensitivity_rule: "DERIVATIVE" | "PERTURBATION" | "NONE";
  fmea_trigger_rule: {
    enabled: boolean;
    threshold_type: "RPN" | "UTILIZATION" | "RISK_SCORE";
    threshold_value: number;
  } | null;
  acceptance_rule: string;
  review_rule: string;
  rejection_rule: string;
  redaction_rule: "REDACT_EXPRESSION" | "REDACT_ALL" | "PUBLIC_SAFE_REDACTED";
}

export interface FormulaRegistryRecord {
  tool_id: string;
  tool_key: string;
  formula_version: string;
  formula_registry_hash: string;
  schema_hash_binding: string;
  nodes: FormulaRegistryNode[];
  internal_trace_policy: "RESTRICTED_ADMIN" | "RESTRICTED_CHECKER" | "RESTRICTED_QA";
  created_at: string;
  approved_at: string;
  approved_by: string;
}

export class FormulaRegistry {
  private store = new Map<string, FormulaRegistryRecord>();

  register(record: FormulaRegistryRecord): void {
    const key = `${record.tool_id}::${record.formula_version}`;
    this.store.set(key, record);
  }

  fetch(toolId: string, formulaVersion: string): FormulaRegistryRecord | null {
    const key = `${toolId}::${formulaVersion}`;
    return this.store.get(key) ?? null;
  }

  fetchBySchemaHash(schemaHash: string): FormulaRegistryRecord | null {
    for (const record of this.store.values()) {
      if (record.schema_hash_binding === schemaHash) return record;
    }
    return null;
  }

  verifyHashBinding(schemaHash: string, formulaVersion: string): boolean {
    const key = `${schemaHash}::${formulaVersion}`;
    for (const record of this.store.values()) {
      if (
        record.schema_hash_binding === schemaHash &&
        record.formula_version === formulaVersion
      ) {
        return true;
      }
    }
    return false;
  }

  static computeRegistryHash(nodes: FormulaRegistryNode[]): string {
    const json = JSON.stringify(nodes.map((n) => n.formula_id).sort());
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `fr-${Math.abs(hash).toString(16).padStart(8, "0")}`;
  }
}

export const formulaRegistry = new FormulaRegistry();
