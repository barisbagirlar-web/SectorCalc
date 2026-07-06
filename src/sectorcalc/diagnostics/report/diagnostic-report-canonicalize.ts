import { createHash } from "node:crypto";
import type { DiagnosticReport } from "./diagnostic-report-types";

function sortKeys(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      const val = obj[key];
      if (val !== undefined) {
        result[key] = sortKeys(val);
      }
    }
    return result;
  }
  return value;
}

export function buildDiagnosticReportCanonicalPayload(
  report: DiagnosticReport
): Record<string, unknown> {
  return sortKeys(JSON.parse(JSON.stringify(report))) as Record<string, unknown>;
}

export function createDiagnosticReportHash(report: DiagnosticReport): string {
  const canonical = buildDiagnosticReportCanonicalPayload(report);
  const json = JSON.stringify(canonical);
  return createHash("sha256").update(json, "utf-8").digest("hex");
}

export function createShortInputHash(input: Record<string, unknown>): string {
  const canonical = sortKeys(input) as Record<string, unknown>;
  const json = JSON.stringify(canonical);
  return createHash("sha256").update(json, "utf-8").digest("hex").slice(0, 12);
}
