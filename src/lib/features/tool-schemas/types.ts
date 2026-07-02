/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SECTORCALC PRO - UNIVERSAL TOOL SCHEMA CONTRACT  (v1)
 * ───────────────────────────────────────────────────────────────────────────
 * One ToolShell (chrome) + one ToolRuntime (engine) + N data schemas.
 * A PRO_xxx.json that conforms to `ToolSchema` is FULLY sufficient to render
 * and compute a tool. Zero per-tool JS. No display/compute drift.
 *
 * Design invariants:
 *   I1. SINGLE SOURCE OF TRUTH - the SAME `expression` string is both shown in
 *       the Formulas tab and evaluated by the AST runtime. One interpreter.
 *   I2. EVERYTHING IS AN EXPRESSION - validation, warnings, decision, FMEA gating
 *       all reuse the same evaluator. No bespoke JS branches per tool.
 *   I3. GUM IS REAL - sensitivity coefficients come from AST partials (analytic)
 *       or finite-difference fallback. No hardcoded constants.
 *   I4. DIMENSIONS ARE CHECKED - every input + formula output carries a unit;
 *       runtime asserts dimensional consistency (ISO 80000) at eval time.
 *   I5. TAMPER-EVIDENT AUDIT - input snapshot hashed with SHA-256 (Web Crypto).
 *   I6. FAIL-CLOSED - missing required input or failed dimensional check → BLOCK.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CalculationEngine } from "./types-legacy";

/* ─────────────────────────  PRIMITIVES  ───────────────────────── */

/** Confidence label - your house standard. Drives the input badge. */
export type Confidence = 'CERTAIN' | 'STRONG' | 'MEDIUM' | 'DEFAULT';

/** Severity for warnings / decision banners. */
export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';

/** Validation action. BLOCK = fail-closed; WARN = surface but proceed. */
export type RuleAction = 'BLOCK' | 'WARN';

/** GUM uncertainty distribution → divisor for Type B standard uncertainty. */
export type Distribution = 'normal' | 'rectangular' | 'triangular' | 'u-shaped';

/**
 * Unit as a dimensional vector over SI base dims (ISO 80000), so the runtime
 * can verify expressions without string parsing.
 * `display` is the human label shown in the UI.
 */
export interface UnitRef {
  /** Key into the shared unit registry, e.g. "MPa", "kN·m", "mm", "dimensionless". */
  ref: string;
}

/** An AST-evaluable expression string. The ONLY place math lives. */
export type Expr = string;

/* ─────────────────────────  INPUTS  ───────────────────────── */

export interface InputUncertainty {
  /** Absolute (in input's unit) or relative ("2%"). */
  value: number | `${number}%`;
  type: 'A' | 'B';
  distribution: Distribution;
  /** Optional traceability note for audit (NIST/DKD/PTB etc.). */
  source?: string;
}

export interface InputDef {
  /** Stable variable id used inside expressions. e.g. "b_w". MUST be a valid identifier. */
  id: string;
  symbol: string;
  label: string;
  unit: UnitRef;
  confidence: Confidence;
  min?: number;
  max?: number;
  /** Explicit default. If omitted AND not optional → required (fail-closed). */
  default?: number | null;
  optional?: boolean;
  hint?: string;
  uncertainty?: InputUncertainty;
  /** UI grouping key (e.g. "geometry","materials"). Maps to a sec-hdr block. */
  group: string;
  /** If set, input only applies under these standard ids. Omit = applies to all. */
  appliesTo?: string[];
  /** Optional enum for select inputs instead of numeric. */
  enum?: { value: number | string; label: string }[];
}

export interface InputGroup {
  key: string;
  letter: string;
  title: string;
  description?: string;
  /** Columns hint for the grid (2|3|4). Pure layout. */
  cols?: 2 | 3 | 4;
}

/* ─────────────────────────  FORMULAS  ───────────────────────── */

export interface FormulaDef {
  id: string;
  /** Output variable id, usable downstream in later formulas/expressions. */
  output: string;
  /** The expression - rendered verbatim in Formulas tab AND evaluated. (I1) */
  expression: Expr;
  /** Unit of the output, for dimensional assertion. (I4) */
  unit: UnitRef;
  reference: string;
  /**
   * Optional guard. If present and evaluates falsy, the runtime throws a
   * domain error with `errorMessage` (e.g. over-reinforced: x >= d). Fail-closed.
   */
  domainGuard?: { condition: Expr; errorMessage: string };
  /** Mark outputs that should appear in the Results table + gauge feed. */
  display?: { resultRow?: boolean; highlight?: boolean; gauge?: boolean };
}

/* ─────────────────────────  VALIDATION & WARNINGS  ───────────────────────── */

export interface ValidationRule {
  id: string;
  action: RuleAction;
  /** Boolean expression. TRUE = rule VIOLATED (fires). Same evaluator as formulas. */
  condition: Expr;
  message: string;
}

export interface SmartWarning {
  id: string;
  severity: Severity;
  source: string;
  condition: Expr;
  /** Message with {var} / {var:2f} interpolation from inputs + outputs. */
  message: string;
}

/* ─────────────────────────  DECISION / VERDICT  ───────────────────────── */

export interface DecisionConfig {
  /** The governing utilization output id (the measurand for the gauge). */
  governingOutput: string;
  /** Pass when governing <= pass; warn band (peer review); fail above fail. */
  thresholds: { pass: number; fail: number };
  /** Optional: expression yielding a label string for the governing mode. */
  governingMode?: { expression: Expr; labels?: Record<string, string> };
  verdictText: {
    pass: string; warn: string; fail: string;
  };
}

/* ─────────────────────────  GUM (real propagation)  ───────────────────────── */

export interface GumConfig {
  /** Output whose combined standard uncertainty u_c is reported. */
  measurand: string;
  /**
   * "analytic": runtime differentiates the formula AST w.r.t. each uncertain
   * input (preferred). "numeric": central finite-difference fallback.
   */
  method: 'analytic' | 'numeric';
  /** Coverage factor for expanded uncertainty U = k·u_c. Default 2 (~95%). */
  coverageFactor?: number;
}

/* ─────────────────────────  FMEA (result-aware)  ───────────────────────── */

export interface FmeaMode {
  mode: string;
  effect: string;
  sev: number; occ: number; det: number;
  mitigation?: string;
  /** Optional gate: include this mode only when expression is TRUE. Omit = always shown. */
  when?: Expr;
}

export interface FmeaConfig {
  /** Mandatory-review gate. When TRUE → ISO 9001 §8.6 block. */
  mandatoryWhen: Expr;
  modes: FmeaMode[];
  /** RPN bands for color coding. */
  rpnBands?: { high: number; med: number };
}

/* ─────────────────────────  STANDARD VARIANT  ───────────────────────── */

export interface StandardVariant {
  id: string;
  code: string;
  name: string;
  description: string;
  year?: string;
  formulas: FormulaDef[];
  validation: ValidationRule[];
  warnings: SmartWarning[];
  decision: DecisionConfig;
  gum: GumConfig;
  /** Standard-specific input ids that are required for this variant. */
  requiredInputs?: string[];
}

/* ─────────────────────────  TOP-LEVEL SCHEMA  ───────────────────────── */

export interface ToolSchema {
  /** "PRO_117" */
  schemaId: string;
  /** "TOOL-RC-BEAM-117" */
  toolCode: string;
  version: string;
  name: string;
  subtitle?: string;
  /** Breadcrumb / sector path, leaf last. */
  sectorPath: string[];
  /** Standards-basis tags shown in the identity bar. */
  standardsBasis: string[];
  scope: {
    inScope: string[];
    outOfScope: string[];
    boundaryWarning: string;
  };
  /** Shared input registry + grouping. Variants reference these by id. */
  inputs: InputDef[];
  inputGroups: InputGroup[];
  /** One or more computable standards. Single-standard tools have length 1. */
  standards: StandardVariant[];
  /** FMEA is tool-level. */
  fmea: FmeaConfig;
  legalNotice: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * RUNTIME CONSUMER CONTRACT
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface ComputeRequest {
  schema: ToolSchema;
  standardId: string;
  values: Record<string, number>;
}

export interface ComputeResult {
  standardId: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  /** All computed formula outputs, id → value. */
  outputs: Record<string, number>;
  governing: { output: string; value: number; mode?: string };
  /** Real GUM result. */
  uncertainty: {
    measurand: string;
    u_c: number;
    U: number;
    contributions: { input: string; share: number }[];
  };
  warnings: { id: string; severity: Severity; source: string; message: string }[];
  fmea: { mode: string; effect: string; sev: number; occ: number; det: number; rpn: number; mitigation?: string }[];
  fmeaMandatory: boolean;
  /** SHA-256 hex of the canonicalized input snapshot. (I5) */
  inputHash: string;
  timestamp: string;
}

export interface ToolRuntime {
  validate(req: ComputeRequest): { ruleId: string; message: string }[];
  compute(req: ComputeRequest): Promise<ComputeResult>;
  format(template: string, scope: Record<string, number>): string;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * LEGACY BACKWARD COMPATIBILITY
 * The existing ToolSchema (old) still works as the "light" variant.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Re-export of legacy types for backward compatibility - available as Legacy* or from types-legacy */
export type { CalculationEngine, CalculationResult } from "./types-legacy";
export type {
  ToolSchemaInput,
  ToolSchemaFormula,
  ToolSchemaValidationRule,
  ToolSchemaWarning,
  ToolSchemaFMEAItem,
  ToolSchemaAuditConfig,
  ToolSchemaOutput,
  ToolSchemaEngineRules,
} from "./types-legacy";
