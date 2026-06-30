export { autoFixSchemas, applyRuleBasedSchemaFix } from "@/lib/core/steelcore/auto-fix";
export type { SteelCoreAutoFixReport, SteelCoreAutoFixResult } from "@/lib/core/steelcore/auto-fix";
export {
  FALLBACK_RATE_THRESHOLD_PERCENT,
  SCHEMAS_DIR,
  STEELCORE_HEALING_LOG,
  STEELCORE_HEALTH_LOG,
  STEELCORE_VALIDATION_REPORT,
  STEELCORE_VERSION,
} from "@/lib/core/steelcore/constants";
export { measureFallbackRate, shouldTriggerSelfHeal } from "@/lib/core/steelcore/fallback-metrics";
export { writeHealthLog, writeHealingLog, writeValidationReport } from "@/lib/core/steelcore/health-log";
export {
  listSchemaFiles,
  validateAllSchemas,
  validateSchemaRecord,
} from "@/lib/core/steelcore/schema-validator";
export {
  mergeAiSchemaRepair,
  normalizeSchemaMechanically,
  parseAiSchemaJson,
} from "@/lib/core/steelcore/schema-normalizer";
export { validateStructuralSchema } from "@/lib/core/steelcore/structural-validator";
export type {
  SteelCoreFallbackMetrics,
  SteelCoreHealthLog,
  SteelCoreSchemaIssue,
  SteelCoreSchemaValidationResult,
  SteelCoreValidationLayer,
  SteelCoreValidationReport,
} from "@/lib/core/steelcore/types";
