/**
 * SECTORCALC PRO — TYPE DEFINITIONS (Industrial Grade v2.0)
 *
 * ISO 80000 dimensional vectors, GUM uncertainty propagation,
 * fail-closed validation, immutable audit trail.
 */

// 1. TEMEL PRIMITIVES
export type ConfidenceLevel = 'KESIN' | 'GÜÇLÜ' | 'ORTA' | 'VARSAYIM';
export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'INFO';
export type RuleAction = 'BLOCK' | 'WARN';

/** Risk level for the tool schema. Affects audit retention and peer-review requirements. */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Input field types supported by the renderer. */
export type InputType = 'number' | 'select' | 'boolean';

/** GUM uncertainty distribution type. */
export type Distribution = 'normal' | 'rectangular' | 'triangular' | 'u-shaped';

// 2. ISO 80000 BOYUTSAL ANALİZ
export type DimensionVector = [number, number, number, number, number, number, number];

export const DIMENSIONS = {
  DIMENSIONLESS:   [0, 0, 0, 0, 0, 0, 0] as DimensionVector,
  MASS:            [1, 0, 0, 0, 0, 0, 0] as DimensionVector,
  LENGTH:          [0, 1, 0, 0, 0, 0, 0] as DimensionVector,
  TIME:            [0, 0, 1, 0, 0, 0, 0] as DimensionVector,
  ELECTRIC_CURRENT:[0, 0, 0, 1, 0, 0, 0] as DimensionVector,
  TEMPERATURE:     [0, 0, 0, 0, 1, 0, 0] as DimensionVector,
  AMOUNT:          [0, 0, 0, 0, 0, 1, 0] as DimensionVector,
  LUMINOUS_INTENSITY:[0,0,0,0,0,0,1] as DimensionVector,
  AREA:            [0, 2, 0, 0, 0, 0, 0] as DimensionVector,
  VOLUME:          [0, 3, 0, 0, 0, 0, 0] as DimensionVector,
  VELOCITY:        [0, 1, -1, 0, 0, 0, 0] as DimensionVector,
  ACCELERATION:    [0, 1, -2, 0, 0, 0, 0] as DimensionVector,
  FORCE:           [1, 1, -2, 0, 0, 0, 0] as DimensionVector,
  PRESSURE:        [1, -1, -2, 0, 0, 0, 0] as DimensionVector,
  ENERGY:          [1, 2, -2, 0, 0, 0, 0] as DimensionVector,
  POWER:           [1, 2, -3, 0, 0, 0, 0] as DimensionVector,
  FREQUENCY:       [0, 0, -1, 0, 0, 0, 0] as DimensionVector,
  CURRENCY:        [0, 0, 0, 0, 0, 0, 0] as DimensionVector,
} as const;

export interface UnitDefinition {
  symbol: string;
  name: string;
  dimensions: DimensionVector;
  toSI: (val: number) => number;
  fromSI: (val: number) => number;
  description?: string;
}

// 3. INPUT TANIMI

export interface UncertaintySpec {
  value: number | `${number}%`;
  type: 'A' | 'B';
  distribution: Distribution;
  source?: string;
}

export interface DependsOn {
  fieldId: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: number | string | boolean;
}

export interface InputField {
  id: string;
  label: string;
  symbol: string;
  unitRef: string;
  type: InputType;
  confidence: ConfidenceLevel;
  required: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
  description?: string;

  // Referans Değerler (GAP 5)
  referenceValues?: (number | { label: string; value: number })[];
  referenceSource?: string;

  uncertainty?: UncertaintySpec;
  dependsOn?: DependsOn;
  enum?: { value: number | string; label: string }[];
}

// 4. FORMÜL VE AST YAPISI

export interface DomainGuard {
  condition: string;
  errorMessage: string;
}

export interface FormulaNode {
  id: string;
  outputVar: string;
  expression: string;
  unitRef: string;
  domainGuard?: DomainGuard;
}

// 5. VALIDATION RULES

export interface ValidationRule {
  id: string;
  action: RuleAction;
  condition: string;
  message: string;
}

// 6. AUDIT CONFIG

export interface AuditConfig {
  requirePeerReview: boolean;
  retentionDays: number;
}

// 7. TOOL SCHEMA

export interface ToolSchema {
  id: string;
  version: string;
  name: string;
  industry: string;
  riskLevel: RiskLevel;
  inputs: InputField[];
  formulas: FormulaNode[];
  validationRules: ValidationRule[];
  auditConfig: AuditConfig;
}

// 8. COMPUTATION TYPES

export interface UncertaintyResult {
  standard: number;   // Combined standard uncertainty u_c(y)
  expanded: number;   // Expanded uncertainty U = k * u_c
  coverageFactor: number; // Coverage factor k (default 2 for ~95%)
}

export interface ComputationResult {
  results: Record<string, number>;
  errors: string[];
  warnings: string[];
  uncertainty: UncertaintyResult | null;
  timestamp: string;
  inputHash: string;
}

export interface CalculationEngine {
  id: string;
  compute(schema: ToolSchema, inputs: Record<string, number>): ComputationResult;
}
