export {
 UEngine,
 type AuditMetrics,
 type UEngineAnalysisResult,
 type UEngineRegistryInput,
 type UEngineRegistryResult,
 type UEngineSeverity,
} from "@/lib/os/core/u-engine";

export {
 INDUSTRIAL_OS_ARCHITECTURE,
 type IndustrialOsLayer,
} from "@/lib/os/core/architecture";

export { OfflineStore, type OfflineAuditRecord } from "@/lib/os/core/offline-store";

export {
 runGlobalAudit,
 type AuditInput,
 type GlobalAuditResult,
 type GlobalAuditStatus,
} from "@/lib/os/core/audit-engine";

export {
 buildBenchmarkFromAudit,
 computeEfficiencyScore,
 DEFAULT_INDUSTRY_BENCHMARK,
 mergeBenchmarkPool,
 processBenchmarking,
 type AnonymizedBenchmarkRecord,
 type BenchmarkData,
 type SectorBenchmarkPool,
} from "@/lib/os/core/intel-engine";

export {
 ACTION_PLAN_VARIANCE_THRESHOLD,
 IntelligenceLayer,
 buildSectorIntelligence,
 calculateCarbonImpact,
 calculateHiddenLoss,
 computeVarianceRatio,
 generateActionPlan,
 type ActionPlanCode,
 type ActionPlanResult,
 type SectorIntelligenceResult,
} from "@/lib/os/core/intelligence-layer";

export {
 FormulaRepository,
 Formulas,
 formulaRepository,
 runSectorFormula,
 standardEfficiencyFormula,
 type FormulaExecutionResult,
 type FormulaInputs,
 type FormulaRegistry,
 type SectorFormula,
} from "@/lib/os/core/formulas";

export {
 MasterOS,
 runIndustrialAudit,
 OPTIMAL_SCORE_THRESHOLD,
 type IndustrialAuditResult,
 type IndustrialAuditStatus,
} from "@/lib/os/core/master-os";

export {
 submitAnonymizedBenchmark,
 getSectorBenchmarkPool,
 type RecordBenchmarkResult,
 type FetchBenchmarkResult,
} from "@/lib/os/server/submit-benchmark-pool";

export {
 auditSeverityToVerdictCode,
 generatePremiumAuditReport,
 generatePremiumAuditReportBySlug,
 runIndustryDiagnostic,
 runLegacyDiagnostic,
 runSectorAnalysis,
 runSectorAnalysisBySlug,
 runSectorRegistryDiagnostic,
 runSectorRegistryDiagnosticBySlug,
 toIndustryDiagnosticConfig,
 type AuditOutput,
 type AuditReport,
 type AuditSeverity,
 type IndustryAuditReport,
 type PremiumAuditReport,
 type ProcessMetrics,
 type ProcessVariables,
} from "@/lib/os/core/audit-gen";

export {
 performAudit,
 auditStatusToVerdictCode,
 runDiagnostic,
 type LegacyPerformAuditInput,
 type AuditStatus,
 type PerformAuditResult,
} from "@/lib/os/adapters/legacy-u-engine";

export {
 IndustrialRegistry,
 MANUFACTURING_OS_I18N_NS,
 SectorRegistry,
 costBasisForUnitType,
 formatSectorParamLabel,
 getIndustrialRegistryEntry,
 getSectorEntry,
 getSectorEntryByI18nKey,
 getSectorEntryBySlug,
 hasExpertFeature,
 hasSectorSmartModule,
 industrySlugToSectorKey,
 isSectorRegistryKey,
 listEnabledExpertFeatures,
 listSectorSmartModules,
 listIndustrialRegistryKeys,
 listSectorRegistryKeys,
 resolveSectorParamLabel,
 resolveSectorTitle,
 sectorKeyToIndustrySlug,
 sectorParamMessageKey,
 sectorTitleMessageKey,
 SmartModuleIds,
 SmartModules,
 hasSmartModule,
 listSmartModules,
 resolveSmartModuleLabel,
 smartModulesToExpertFeatures,
 type IndustrialRegistryEntry,
 type IndustrialRegistryKey,
 type ExpertFeatureKey,
 type SectorEntry,
 type SectorExpertFeatures,
 type SmartModuleId,
 type SectorParamTriple,
 type SectorParamValues,
 type SectorRegistryKey,
 type SectorUnitType,
 getSectorEntry as getSectorDefinition,
 getSectorEntryBySlug as getSectorDefinitionBySlug,
 getSectorEntryByI18nKey as getSectorDefinitionByI18nKey,
 listSectorRegistryKeys as listSectorDefinitionKeys,
 getIndustrialSector,
 getIndustrialSectorBySlug,
 industrySlugToIndustrialKey,
 type IndustrialSectorEntry,
 type SectorDefinition,
 type SectorUnit,
} from "@/lib/os/registry/sectors";

export {
 getIndustrialModule,
 getIndustrialModuleByLogic,
 getIndustrialModuleByReport,
 ModuleRegistry,
 listIndustrialModuleKeys,
 IndustrialRegistry as OperationalModuleRegistry,
 type IndustrialLogicId,
 type IndustrialModuleEntry,
 type IndustrialModuleKey,
 type IndustrialModuleValues,
 type PremiumReportId,
} from "@/lib/os/registry/industrial";

export {
 formatCurrency,
 formatNumber,
 formatPercent,
 formatUnitValue,
 unitLabel,
 UNIT_LABELS,
 type FormatLocale,
 type UnitLabelKey,
} from "@/lib/os/utils/formatters";

export {
 buildCncCycleDiagnosticValues,
 CNC_MANUFACTURING_DIAGNOSTIC_CONFIG,
 type CncCycleDiagnosticValues,
 type IndustryDiagnosticConfig,
 type IndustryDiagnosticParamMap,
 type PremiumRuleSeverity,
} from "@/lib/os/config/industry-config";

export { CNC_MACHINE_TIME_EFFICIENCY_SCHEMA } from "@/lib/os/schemas/cnc-machine-time";

export type {
 IndustryAnalysisResult,
 IndustryInputRole,
 IndustryInputUnit,
 IndustryInterpretationRules,
 IndustryToolFormulas,
 IndustryToolInputParam,
 IndustryToolInputValues,
 IndustryToolSchema,
 IndustryToolType,
 InterpretationThreshold,
 ManufacturingIndustry,
} from "@/lib/os/types";

export { runLegacyDiagnostic as runProcessDiagnostic } from "@/lib/os/core/audit-gen";
