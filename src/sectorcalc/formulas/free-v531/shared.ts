import type { FreeV531AuditSeal, FreeV531DecisionState, FreeV531OutputMetric, FreeV531Severity, FreeV531Warning } from "./types";

export const FREE_V531_RUNTIME_VERSION = "free-v531-server-runtime-1";
export const FREE_V531_FORMULA_VERSION = "free-v531-formula-1";

export function finiteNumber(value: unknown, inputId: string): number {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  if (!Number.isFinite(parsed)) {
    throw new Error(`BLOCKED_NON_FINITE_INPUT:${inputId}`);
  }
  return parsed;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function stableHash(input: unknown): string {
  const text = stableStringify(input);
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv1a32:${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export function stableStringify(input: unknown): string {
  if (input === null || typeof input !== "object") return JSON.stringify(input);
  if (Array.isArray(input)) return `[${input.map(stableStringify).join(",")}]`;
  const entries = Object.entries(input as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}

export function outputMetric(id: string, value: number, unit: string, role: FreeV531OutputMetric["role"], publicExplanation: string): FreeV531OutputMetric {
  if (!Number.isFinite(value)) {
    throw new Error(`BLOCKED_NON_FINITE_OUTPUT:${id}`);
  }
  return { id, value, unit, role, publicExplanation };
}

export function warning(severity: FreeV531Severity, message: string, suggestedAction: string): FreeV531Warning {
  return { severity, message, suggestedAction };
}

export function deriveStatus(warnings: readonly FreeV531Warning[], preferred: FreeV531DecisionState): FreeV531DecisionState {
  if (warnings.some(w => w.severity === "BLOCKER")) return "BLOCKED";
  if (warnings.some(w => w.severity === "REJECT")) return "REJECT";
  if (warnings.some(w => w.severity === "REPRICE")) return "REPRICE";
  if (warnings.some(w => w.severity === "REPAIR")) return "REPAIR";
  if (warnings.some(w => w.severity === "HOLD")) return "HOLD";
  if (warnings.some(w => w.severity === "CRITICAL" || w.severity === "REVIEW" || w.severity === "WARNING")) return "REVIEW";
  return preferred;
}

export function buildAuditSeal(toolId: string, toolKey: string, normalizedInputs: Readonly<Record<string, number>>, outputs: readonly FreeV531OutputMetric[]): FreeV531AuditSeal {
  return {
    toolId,
    toolKey,
    formulaVersion: FREE_V531_FORMULA_VERSION,
    runtimeVersion: FREE_V531_RUNTIME_VERSION,
    normalizedInputHash: stableHash(normalizedInputs),
    outputHash: stableHash(outputs.map(o => ({ id: o.id, value: o.value, unit: o.unit }))),
    redactionStatus: "PUBLIC_SAFE_REDACTED",
  };
}
