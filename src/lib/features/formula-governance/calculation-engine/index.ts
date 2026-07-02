/**
 * Calculation Engine - Barrel Export
 *
 * Source: claude_pro_tasarim_/ (verified engine design)
 * Integrates the verified calculation engine into SectorCalc.
 */
export type {
  ToolSchema, InputField, FormulaNode, ValidationRule,
  GumConfig, Uncertainty, UncertaintyResult, ComputeResult,
  ConfidenceLevel, Severity, RuleAction, Distribution,
} from './types';
export { prepare, compute } from './engine';
export { compileSafe, dependencies, ALLOWED_FUNCTIONS, ALLOWED_CONSTANTS } from './safe-expr';
export { toCanonical, canonicalUnitOf, UNIT_REGISTRY } from './units';
export { AuditService } from './audit';
export type { AuditRecord, AuditComment } from './audit';
export {
  adaptProTool, calculateWithRawTool,
  normalizeExpression, parseFormulaExpressionFull, parseUncertaintyString,
} from './pro-tool-adapter';
