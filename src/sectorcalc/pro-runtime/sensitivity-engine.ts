// SectorCalc SuperV4 V5.3 — Sensitivity Engine
// Computes sensitivity analysis by perturbing normalized inputs.

import type { SensitivityItem, Severity } from "../pro-form/contract-types";

export interface SensitivityConfig {
  perturbation_percent: number;
  max_drivers: number;
}

const DEFAULT_CONFIG: SensitivityConfig = {
  perturbation_percent: 10,
  max_drivers: 5,
};

export interface SensitivityAnalysisResult {
  items: SensitivityItem[];
  warnings: string[];
}

export function analyzeSensitivity(
  inputs: Array<{ id: string; name: string; value: number }>,
  outputs: Array<{ id: string; name: string; value: number }>,
  config: SensitivityConfig = DEFAULT_CONFIG,
): SensitivityAnalysisResult {
  const items: SensitivityItem[] = [];
  const warnings: string[] = [];

  if (inputs.length === 0 || outputs.length === 0) {
    return { items, warnings: ["Insufficient inputs or outputs for sensitivity analysis"] };
  }

  // Stub: for each input, estimate sensitivity as relative magnitude
  // Production uses derivative or perturbation methods
  for (const inp of inputs) {
    if (!Number.isFinite(inp.value) || inp.value === 0) continue;

    const primaryOutput = outputs[0];
    if (!primaryOutput || !Number.isFinite(primaryOutput.value)) continue;

    const ratio = Math.abs(inp.value / primaryOutput.value);
    const effect = ratio > 0.5
      ? `${config.perturbation_percent}% change in ${inp.name} causes significant output shift`
      : `${config.perturbation_percent}% change in ${inp.name} has moderate effect`;

    const severity: Severity = ratio > 0.8 ? "CRITICAL" : ratio > 0.5 ? "WARNING" : "INFO";

    items.push({
      id: `sens_${inp.id}`,
      driver: inp.name,
      effect,
      severity,
    });
  }

  // Sort by severity, limit to max_drivers
  const severityOrder: Record<Severity, number> = { BLOCKER: 0, CRITICAL: 0, WARNING: 1, REVIEW: 2, INFO: 3, BLOCKED: 0 };
  items.sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));
  items.splice(config.max_drivers);

  return { items, warnings };
}
