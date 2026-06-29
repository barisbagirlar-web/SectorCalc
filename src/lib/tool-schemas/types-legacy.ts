/**
 * Legacy PRO Tool Schema Types (backward compatible)
 * These types support the existing PRO_xxx.json format before
 * the full v1 contract migration.
 */

export interface ToolSchemaInput {
  id: string;
  name: string;
  symbol?: string;
  unit: string;
  type: "number" | "enum" | "string" | "boolean";
  required: boolean;
  confidence_label?: string;
  absolute_min?: number;
  absolute_max?: number;
  resolution?: number;
  default?: number | string;
  options?: string[] | { value: string; label: string }[];
  validation_rule?: string;
  source?: string;
  uncertainty?: string;
  note?: string;
  group?: string;
  visibleWhen?: {
    field: string;
    equals: string;
  };
  conditional_on?: {
    field: string;
    value: string;
  };
}

export interface ToolSchemaFormula {
  id?: string;
  branch?: string;
  lhs?: string;
  rhs?: string;
  reference?: string;
  dimensional_check?: string;
  note?: string;
  raw?: string;
}

export interface ToolSchemaValidationRule {
  id: string;
  action: "BLOCK" | "WARN";
  condition: string;
  message: string;
  standard_ref?: string;
}

export interface ToolSchemaWarning {
  id?: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  condition: string;
  source?: string;
}

export interface ToolSchemaFMEAItem {
  failureMode: string;
  effect?: string;
  description?: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  occurrence?: number;
  likelihood?: number;
  detection?: number;
  rpn?: number;
  rpn_high?: number;
  rpn_low?: number;
  condition?: string;
  control_measure?: string;
}

export interface ToolSchemaAuditConfig {
  fields: string[];
  version: string;
}

export interface ToolSchemaOutput {
  id: string;
  name: string;
  unit: string;
  group?: string;
}

export interface ToolSchemaEngineRules {
  standards: string[];
  validation?: Record<string, {
    condition: string;
    error_msg: string;
    action?: "BLOCK" | "WARN";
    standard_ref?: string;
  }>;
  smart_warnings?: ToolSchemaWarning[];
  fmea?: ToolSchemaFMEAItem[];
  audit_log?: ToolSchemaAuditConfig;
  uc_threshold?: {
    pass_max: number;
    warn_max: number;
    fail_min: number;
  };
}

export interface LegacyToolSchema {
  tool_id: string;
  tool_key?: string;
  tool_name: string;
  title?: string;
  category: string;
  scope?: string;
  primary_operation?: string;
  designStandard?: string;
  standards?: string[];
  inputs: ToolSchemaInput[];
  formulas: string[] | ToolSchemaFormula[];
  outputs?: ToolSchemaOutput[];
  engine_rules?: ToolSchemaEngineRules;
  validationRules?: ToolSchemaValidationRule[];
  fmea?: ToolSchemaFMEAItem[];
  calculationEngine?: CalculationEngine;
}

export interface CalculationResult {
  UC?: number;
  UC_flexure?: number;
  UC_shear?: number;
  M_Rd?: number;
  V_Rd?: number;
  governingMode?: string;
  status?: string;
  warnings?: Array<{
    severity: string;
    source: string;
    message: string;
  }>;
  fmea?: ToolSchemaFMEAItem[];
  audit?: {
    timestamp: string;
    tool_id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface CalculationEngine {
  (input: Record<string, any>): CalculationResult;
}
