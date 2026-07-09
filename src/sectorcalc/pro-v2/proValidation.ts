// SectorCalc PRO V2 — Validation Layer
// Validation order: raw display input → parse number (for numeric fields) → convert unit → validate → build engineInputs.
// No red borders on initial load. Red borders only after Calculate or touched field.
// Optional fields must not crash calculation.
// Unknown unit returns controlled contract error.

import type { ProFieldContract } from "./proFieldContract";
import { convertToEngineUnit } from "./proUnitRegistry";

export interface ValidationBlocker {
  fieldId: string;
  message: string;
  severity: "ERROR" | "WARNING";
}

export interface ValidationResult {
  ok: boolean;
  blockers: ValidationBlocker[];
  engineInputs: Record<string, number | string>;
  displayInputs: Record<string, { value: string; unit: string }>;
}

export interface ValidateOptions {
  fields: ProFieldContract[];
  values: Record<string, string>;          // raw string values from inputs
  selectedUnits: Record<string, string>;   // fieldId → display unit
  hiddenValues?: Record<string, number>;   // engine-only values
  isTouched?: Record<string, boolean>;     // touched fields get red borders
}

export function validateProV2Inputs(options: ValidateOptions): ValidationResult {
  const { fields, values, selectedUnits, hiddenValues } = options;

  const blockers: ValidationBlocker[] = [];
  const engineInputs: Record<string, number | string> = {};
  const displayInputs: Record<string, { value: string; unit: string }> = {};

  // Process each visible field
  for (const field of fields) {
    if (field.hidden) continue;

    const rawValue = values[field.id] ?? "";
    const unit = selectedUnits[field.id] ?? field.defaultUnit ?? "";
    const trimmed = rawValue.trim();

    // ── Select fields: pass string value directly, no unit conversion ──
    if (field.type === "select") {
      if (field.required && trimmed === "") {
        blockers.push({
          fieldId: field.id,
          message: `${field.label} is required`,
          severity: "ERROR",
        });
        continue;
      }

      engineInputs[field.id] = trimmed;
      displayInputs[field.id] = { value: trimmed, unit: "" };
      continue;
    }

    // ── Skip optional empty numeric fields ─────────────────────────────
    if (!field.required && trimmed === "") {
      continue;
    }

    // ── Required field check ──────────────────────────────────────────
    if (field.required && trimmed === "") {
      blockers.push({
        fieldId: field.id,
        message: `${field.label} is required`,
        severity: "ERROR",
      });
      continue;
    }

    // ── Parse number ──────────────────────────────────────────────────
    const parsed = parseFloat(trimmed);
    if (!Number.isFinite(parsed)) {
      blockers.push({
        fieldId: field.id,
        message: `"${field.label}" must be a valid number`,
        severity: "ERROR",
      });
      continue;
    }

    // ── Range check ───────────────────────────────────────────────────
    if (field.min !== undefined && parsed < field.min) {
      blockers.push({
        fieldId: field.id,
        message: `${field.label} must be ≥ ${field.min}`,
        severity: "ERROR",
      });
      continue;
    }

    if (field.max !== undefined && parsed > field.max) {
      blockers.push({
        fieldId: field.id,
        message: `${field.label} must be ≤ ${field.max}`,
        severity: "ERROR",
      });
      continue;
    }

    // ── Convert to engine unit ────────────────────────────────────────
    let engineValue: number;
    try {
      engineValue = convertToEngineUnit(parsed, unit, field.unitFamily!);
    } catch (err) {
      blockers.push({
        fieldId: field.id,
        message: `Unknown unit "${unit}" for ${field.label} (${field.unitFamily})`,
        severity: "ERROR",
      });
      continue;
    }

    engineInputs[field.id] = engineValue;
    displayInputs[field.id] = { value: rawValue, unit };
  }

  // ── Inject hidden engine values ────────────────────────────────────
  if (hiddenValues) {
    for (const [key, val] of Object.entries(hiddenValues)) {
      if (Number.isFinite(val)) {
        engineInputs[key] = val;
      }
    }
  }

  return {
    ok: blockers.length === 0,
    blockers,
    engineInputs,
    displayInputs,
  };
}
