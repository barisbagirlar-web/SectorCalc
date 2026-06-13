import type { JsonGuardResult } from "@/lib/ai/deepseek/deepseek-json-guard";
import type { BulkToolRepairEnvelope } from "@/lib/ai/deepseek/bulk-tool-repair-types";

const ALLOWED_PATCH_TYPES = new Set([
  "i18n_fix",
  "schema_fix",
  "validation_fix",
  "contract_alignment",
  "result_renderer",
  "submit_handler",
  "unit_fix",
  "guide_hide",
  "route_wiring",
]);

const ALLOWED_DECISIONS = new Set([
  "auto_apply",
  "auto_apply_candidate",
  "manual_review",
  "keep_safe_state",
  "skip",
]);

export function validateBulkRepairEnvelope(parsed: unknown): JsonGuardResult<BulkToolRepairEnvelope> {
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, reason: "invalid_json", message: "Envelope must be an object." };
  }

  const record = parsed as Record<string, unknown>;
  if (record.taskType !== "bulk_tool_repair" || !Array.isArray(record.items)) {
    return { ok: false, reason: "missing_keys", message: "taskType/items invalid." };
  }

  for (const item of record.items) {
    if (!item || typeof item !== "object") {
      return { ok: false, reason: "invalid_json", message: "Item must be object." };
    }
    const row = item as Record<string, unknown>;
    if (typeof row.slug !== "string") {
      return { ok: false, reason: "missing_keys", message: "slug required." };
    }
    if (
      typeof row.repairDecision === "string" &&
      !ALLOWED_DECISIONS.has(row.repairDecision)
    ) {
      return { ok: false, reason: "invalid_json", message: "repairDecision invalid." };
    }
    if (!Array.isArray(row.patches)) {
      return { ok: false, reason: "missing_keys", message: "patches array required." };
    }
    for (const patch of row.patches) {
      if (!patch || typeof patch !== "object") {
        return { ok: false, reason: "invalid_json", message: "patch must be object." };
      }
      const patchRow = patch as Record<string, unknown>;
      if (typeof patchRow.type !== "string" || !ALLOWED_PATCH_TYPES.has(patchRow.type)) {
        return { ok: false, reason: "invalid_json", message: "patch type invalid." };
      }
    }
  }

  return { ok: true, data: record as BulkToolRepairEnvelope };
}
