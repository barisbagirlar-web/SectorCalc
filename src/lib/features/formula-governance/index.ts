export type {
  AuditFinding,
  AuditStatus,
  ContractAuditResult,
  DecisionImpact,
  DecisionLanguageRule,
  FormulaContract,
  FormulaInventoryEntry,
  FormulaWarningPolicy,
  GovernanceAuditReport,
  MonotonicityRule,
  RiskLevel,
  ScenarioTestSpec,
  ValidationRule,
  WarningPolicySummary,
} from "@/lib/features/formula-governance/types";

export {
  FORMULA_CONTRACTS,
  getFormulaContractById,
  getFormulaContractBySlug,
  listFormulaContractSlugs,
  rentVsBuyContract,
} from "@/lib/features/formula-governance/contracts";

export { TOP_CRITICAL_FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts/top-critical";
export {
  BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  BATCH_EXPANSION_CRITICAL_SLUGS,
} from "@/lib/features/formula-governance/contracts/batch-expansion-critical";

export {
  buildAuditPriorities,
  buildContractGapReport,
} from "@/lib/features/formula-governance/contract-gap";
export type {
  ContractGapEntry,
  FormulaContractGapReport,
} from "@/lib/features/formula-governance/contract-gap";

export {
  buildFormulaInventory,
  getInventoryEntriesByTier,
  getInventoryEntryBySlug,
  summarizeInventory,
} from "@/lib/features/formula-governance/inventory";
export type { InventorySummary } from "@/lib/features/formula-governance/inventory";

export {
  formatGovernanceAuditReport,
  runGovernanceAudit,
  shouldFailStrictAudit,
} from "@/lib/features/formula-governance/audit-runner";

export {
  evaluateCriticalPassPolicy,
  isCriticalRisk,
  resolveAuditStatus,
  suggestDecisionImpact,
  suggestRiskLevel,
} from "@/lib/features/formula-governance/risk-rules";

export {
  createWarningPolicy,
  EMPTY_WARNING_POLICY,
  evaluateWarningPolicy,
  summarizeWarningPolicy,
} from "@/lib/features/formula-governance/warning-policy";

export {
  runContractScenarioTests,
  runScenarioSpec,
} from "@/lib/features/formula-governance/scenario-runner";
export type { ScenarioRunResult, ScenarioRunSummary } from "@/lib/features/formula-governance/scenario-runner";

export {
  auditOracleComparisonForSlug,
  compareProductionVsOracle,
  comparisonStatusToAuditCode,
  FINANCE_COMPARISON_SCENARIOS,
  runAllFinanceOracleComparisonAudits,
  runFinanceOracleComparisonAudit,
} from "@/lib/features/formula-governance/oracle/compare-production-oracle";
export type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/features/formula-governance/oracle/compare-production-oracle";

export {
  adaptProductionFinanceOutput,
  PRODUCTION_ADAPTER_EXPORTS,
} from "@/lib/features/formula-governance/oracle/production-adapters";

export {
  FINANCE_PRODUCTION_FORMULA_LOCATORS,
  getProductionFormulaLocator,
} from "@/lib/features/formula-governance/oracle/production-formula-locator";
export type { ProductionFormulaLocator } from "@/lib/features/formula-governance/oracle/production-formula-locator";

export {
  calculateCompoundInterestOracle,
  calculateLoanPaymentOracle,
  calculateMortgagePaymentOracle,
  calculateProfitMarginOracle,
  calculateSimpleInterestOracle,
  FINANCE_ORACLE_SLUGS,
  isFinanceOracleSlug,
} from "@/lib/features/formula-governance/oracle/finance-oracles";

export {
  hasOracleForTool,
  isOraclePending,
  isOracleRegistered,
  listFinanceOracleToolIds,
  listImplementedOracleToolIds,
  listPendingOracleToolIds,
  listRegisteredOracleToolIds,
} from "@/lib/features/formula-governance/oracle/registry";
