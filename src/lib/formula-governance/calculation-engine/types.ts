/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SECTORCALC PRO — CALCULATION ENGINE TYPES
 * ═══════════════════════════════════════════════════════════════════════════
 * Source: claude_pro_tasrım_/engine-types.ts (verified engine design)
 * 
 * v2 — Added preValidationRules / postValidationRules for 2‑phase validation
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type ConfidenceLevel = 'KESIN' | 'GUCLU' | 'ORTA' | 'VARSAYIM';
export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';
export type RuleAction = 'BLOCK' | 'WARN';
export type Distribution = 'normal' | 'rectangular' | 'triangular';

/** Input uncertainty for GUM propagation. */
export interface Uncertainty {
  value: number;
  relative?: boolean;
  type: 'A' | 'B';
  distribution: Distribution;
}

export interface InputField {
  id: string;
  label: string;
  symbol: string;
  unit: string;
  type: 'number' | 'select' | 'boolean';
  confidence: ConfidenceLevel;
  required: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
  description?: string;
  uncertainty?: Uncertainty;
  options?: { value: number; label: string }[];
}

export interface FormulaNode {
  id: string;
  outputVar: string;
  expression: string;
  unit: string;
  domainGuard?: { condition: string; errorMessage: string };
}

export interface ValidationRule {
  id: string;
  action: RuleAction;
  condition: string;
  message: string;
}

export interface GumConfig {
  measurand: string;
  coverageFactor?: number;
}

export interface ToolSchema {
  id: string;
  version: string;
  name: string;
  industry: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  inputs: InputField[];
  formulas: FormulaNode[];
  /** Rules that reference only input variables — checked BEFORE computation */
  preValidationRules?: ValidationRule[];
  /** Rules that reference output variables — checked AFTER computation */
  postValidationRules?: ValidationRule[];
  /** Legacy alias — kept for backward compatibility */
  validationRules?: ValidationRule[];
  gum?: GumConfig;
  auditConfig: { requirePeerReview: boolean; retentionDays: number };
}

export interface UncertaintyResult {
  measurand: string;
  value: number;
  u_c: number;
  U: number;
  k: number;
  contributions: { input: string; uShare: number; percent: number }[];
}

export interface ComputeResult {
  ok: boolean;
  results: Record<string, number>;
  order: string[];
  errors: { code: string; message: string }[];
  warnings: { code: string; message: string }[];
  uncertainty?: UncertaintyResult;
}
