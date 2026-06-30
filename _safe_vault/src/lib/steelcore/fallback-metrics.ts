import fs from "node:fs";
import path from "node:path";
import { FALLBACK_RATE_THRESHOLD_PERCENT, SCHEMAS_DIR } from "@/lib/steelcore/constants";
import { listSchemaFiles } from "@/lib/steelcore/schema-validator";
import type { SteelCoreFallbackMetrics } from "@/lib/steelcore/types";

function isFallbackFormula(value: unknown): boolean {
  return typeof value === "string" && (value.trim() === "0" || value.trim() === "0.0");
}

export function measureFallbackRate(schemasDir: string = path.join(process.cwd(), SCHEMAS_DIR)): SteelCoreFallbackMetrics {
  const files = listSchemaFiles(schemasDir);
  let fallbackCount = 0;
  for (const file of files) {
    const schema = JSON.parse(
      fs.readFileSync(path.join(schemasDir, file), "utf8"),
    ) as Record<string, unknown>;
    const formulas =
      schema.formulas && typeof schema.formulas === "object"
        ? (schema.formulas as Record<string, unknown>)
        : {};
    if (Object.values(formulas).some(isFallbackFormula)) fallbackCount += 1;
  }
  const total = files.length;
  const ratePercent = total === 0 ? 0 : (fallbackCount / total) * 100;
  return {
    timestamp: new Date().toISOString(),
    total,
    fallbackCount,
    ratePercent,
    thresholdPercent: FALLBACK_RATE_THRESHOLD_PERCENT,
    healthy: ratePercent <= FALLBACK_RATE_THRESHOLD_PERCENT,
  };
}

export function shouldTriggerSelfHeal(metrics: SteelCoreFallbackMetrics): boolean {
  return !metrics.healthy && metrics.total > 0;
}
