export type {
  AuditFinding,
  AuditStatus,
  ContractAuditResult,
  DecisionImpact,
  DecisionLanguageRule,
  FormulaContract,
  FormulaInventoryEntry,
  GovernanceAuditReport,
  MonotonicityRule,
  RiskLevel,
  ScenarioTestSpec,
  ValidationRule,
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
  runContractScenarioTests,
  runScenarioSpec,
} from "@/lib/formula-governance/scenario-runner";
export type { ScenarioRunResult, ScenarioRunSummary } from "@/lib/formula-governance/scenario-runner";

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
