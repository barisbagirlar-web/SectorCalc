export { autoFixSchemas, applyRuleBasedSchemaFix } from "@/lib/steelcore/auto-fix";
export type { SteelCoreAutoFixReport, SteelCoreAutoFixResult } from "@/lib/steelcore/auto-fix";
export {
  FALLBACK_RATE_THRESHOLD_PERCENT,
  SCHEMAS_DIR,
  STEELCORE_HEALING_LOG,
  STEELCORE_HEALTH_LOG,
  STEELCORE_VALIDATION_REPORT,
  STEELCORE_VERSION,
} from "@/lib/steelcore/constants";
export { measureFallbackRate, shouldTriggerSelfHeal } from "@/lib/steelcore/fallback-metrics";
export { writeHealthLog, writeHealingLog, writeValidationReport } from "@/lib/steelcore/health-log";
export {
  listSchemaFiles,
  validateAllSchemas,
  validateSchemaRecord,
} from "@/lib/steelcore/schema-validator";
export {
  mergeAiSchemaRepair,
  normalizeSchemaMechanically,
  parseAiSchemaJson,
} from "@/lib/steelcore/schema-normalizer";
export { validateStructuralSchema } from "@/lib/steelcore/structural-validator";
export type {
  SteelCoreFallbackMetrics,
  SteelCoreHealthLog,
  SteelCoreSchemaIssue,
  SteelCoreSchemaValidationResult,
  SteelCoreValidationLayer,
  SteelCoreValidationReport,
} from "@/lib/steelcore/types";
