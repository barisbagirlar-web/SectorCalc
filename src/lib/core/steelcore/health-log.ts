import fs from "node:fs";
import path from "node:path";
import {
  STEELCORE_HEALING_LOG,
  STEELCORE_HEALTH_LOG,
  STEELCORE_VALIDATION_REPORT,
  STEELCORE_VERSION,
} from "@/lib/core/steelcore/constants";
import type { SteelCoreFallbackMetrics, SteelCoreHealthLog, SteelCoreValidationReport } from "@/lib/core/steelcore/types";

function writeJson(fileName: string, payload: unknown): void {
  fs.writeFileSync(path.join(process.cwd(), fileName), `${JSON.stringify(payload, null, 2)}\n`);
}

export function writeValidationReport(report: SteelCoreValidationReport): void {
  writeJson(STEELCORE_VALIDATION_REPORT, report);
}

export function writeHealingLog(metrics: SteelCoreFallbackMetrics): void {
  writeJson(STEELCORE_HEALING_LOG, metrics);
}

export function writeHealthLog(input: {
  readonly validation: SteelCoreValidationReport;
  readonly fallback: SteelCoreFallbackMetrics;
}): SteelCoreHealthLog {
  const payload: SteelCoreHealthLog = {
    timestamp: new Date().toISOString(),
    validation: {
      total: input.validation.total,
      valid: input.validation.valid,
      invalid: input.validation.invalid,
    },
    fallback: input.fallback,
    pipelineVersion: STEELCORE_VERSION,
  };
  writeJson(STEELCORE_HEALTH_LOG, payload);
  return payload;
}
