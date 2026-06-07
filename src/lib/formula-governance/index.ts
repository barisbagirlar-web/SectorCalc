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
} from "@/lib/formula-governance/types";

export {
  FORMULA_CONTRACTS,
  getFormulaContractById,
  getFormulaContractBySlug,
  listFormulaContractSlugs,
  rentVsBuyContract,
} from "@/lib/formula-governance/contracts";

export { TOP_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/top-critical";
export {
  BATCH_EXPANSION_CRITICAL_FORMULA_CONTRACTS,
  BATCH_EXPANSION_CRITICAL_SLUGS,
} from "@/lib/formula-governance/contracts/batch-expansion-critical";

export {
  buildAuditPriorities,
  buildContractGapReport,
} from "@/lib/formula-governance/contract-gap";
export type {
  ContractGapEntry,
  FormulaContractGapReport,
} from "@/lib/formula-governance/contract-gap";

export {
  buildFormulaInventory,
  getInventoryEntriesByTier,
  getInventoryEntryBySlug,
  summarizeInventory,
} from "@/lib/formula-governance/inventory";
export type { InventorySummary } from "@/lib/formula-governance/inventory";

export {
  formatGovernanceAuditReport,
  runGovernanceAudit,
  shouldFailStrictAudit,
} from "@/lib/formula-governance/audit-runner";

export {
  evaluateCriticalPassPolicy,
  isCriticalRisk,
  resolveAuditStatus,
  suggestDecisionImpact,
  suggestRiskLevel,
} from "@/lib/formula-governance/risk-rules";

export {
  createWarningPolicy,
  EMPTY_WARNING_POLICY,
  evaluateWarningPolicy,
  summarizeWarningPolicy,
} from "@/lib/formula-governance/warning-policy";

export {
  runContractScenarioTests,
  runScenarioSpec,
} from "@/lib/formula-governance/scenario-runner";
export type { ScenarioRunResult, ScenarioRunSummary } from "@/lib/formula-governance/scenario-runner";

export {
  auditOracleComparisonForSlug,
  compareProductionVsOracle,
  comparisonStatusToAuditCode,
  FINANCE_COMPARISON_SCENARIOS,
  runAllFinanceOracleComparisonAudits,
  runFinanceOracleComparisonAudit,
} from "@/lib/formula-governance/oracle/compare-production-oracle";
export type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/formula-governance/oracle/compare-production-oracle";

export {
  adaptProductionFinanceOutput,
  PRODUCTION_ADAPTER_EXPORTS,
} from "@/lib/formula-governance/oracle/production-adapters";

export {
  FINANCE_PRODUCTION_FORMULA_LOCATORS,
  getProductionFormulaLocator,
} from "@/lib/formula-governance/oracle/production-formula-locator";
export type { ProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";

export {
  calculateCompoundInterestOracle,
  calculateLoanPaymentOracle,
  calculateMortgagePaymentOracle,
  calculateProfitMarginOracle,
  calculateSimpleInterestOracle,
  FINANCE_ORACLE_SLUGS,
  isFinanceOracleSlug,
} from "@/lib/formula-governance/oracle/finance-oracles";

export {
  hasOracleForTool,
  isOraclePending,
  isOracleRegistered,
  listFinanceOracleToolIds,
  listImplementedOracleToolIds,
  listPendingOracleToolIds,
  listRegisteredOracleToolIds,
} from "@/lib/formula-governance/oracle/registry";
