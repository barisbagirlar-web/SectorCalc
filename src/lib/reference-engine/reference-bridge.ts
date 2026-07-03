/**
 * Reference Data Bridge - Shared utility for component integration.
 *
 * Provides safe access to reference data from the build-time validated registry.
 * Components use this instead of inline reference arrays.
 *
 * Usage:
 *   import { getReferenceValue, getReferenceOptions } from "@/lib/reference-engine/reference-bridge";
 *
 *   const densityOptions = getReferenceOptions("beam-weight-analyzer", "steelDensity");
 *   const defaultDensity = getReferenceValue("beam-weight-analyzer", "steelDensity", "Structural Steel (EN 10025-2)");
 */

import { registry } from "@/generated/reference-registry";
import type { FormReferenceBindingContractType } from "./FormReferenceBindingContract";

/**
 * Returns the binding contract for a tool+input pair, or undefined if not found.
 */
export function getBinding(
  toolId: string,
  inputKey: string,
): FormReferenceBindingContractType | undefined {
  return registry[toolId]?.[inputKey];
}

/**
 * Returns all reference options as {value, label} array for use in select/combobox.
 * Falls back to empty array if no binding found.
 */
export function getReferenceOptions(
  toolId: string,
  inputKey: string,
): ReadonlyArray<{ value: string; label: string }> {
  const binding = getBinding(toolId, inputKey);
  if (!binding) return [];
  return binding.references.map((r) => ({
    value: r.label,
    label: `${r.label} (${r.value} ${r.unit})`,
  }));
}

/**
 * Returns the numeric value for a specific reference label in a binding.
 * Returns undefined if the label or binding is not found.
 */
export function getReferenceValue(
  toolId: string,
  inputKey: string,
  label: string,
): number | undefined {
  const binding = getBinding(toolId, inputKey);
  if (!binding) return undefined;
  const ref = binding.references.find((r) => r.label === label);
  return ref?.value;
}

/**
 * Returns the standard identifier for a tool+input binding.
 * Returns empty string if not found.
 */
export function getReferenceStandard(
  toolId: string,
  inputKey: string,
): string {
  const binding = getBinding(toolId, inputKey);
  return binding?.standard ?? "";
}

/**
 * Checks if a binding exists for the given tool+input pair.
 */
export function hasBinding(toolId: string, inputKey: string): boolean {
  return !!registry[toolId]?.[inputKey];
}

/**
 * ISO 513 Cutting Tool Material Database (loaded from registry).
 * Returns the material data map from the reference registry.
 *
 * Format matches the existing inline MAT_DB structure for backward compatibility.
 */
export interface MaterialData {
  label: string;
  kc1: number;
  mc: number;
  vc: number[];
  color: string;
}

const MAT_DB_COLORS: Record<string, string> = {
  "P": "#3B82F6",
  "M": "#7C3AED",
  "K": "#6B7280",
  "N": "#10B981",
  "S": "#F59E0B",
  "H": "#EF4444",
};

/**
 * Returns the ISO 513 material database from the reference registry.
 * Falls back to empty map if registry is empty.
 */
export function getMaterialDatabase(): Record<string, MaterialData> {
  const binding = getBinding("pro-tool-machining", "material_group");
  if (!binding) return {};

  const db: Record<string, MaterialData> = {};

  // Map ISO 513 references to MAT_DB format
  // kc1 is the specific cutting force (the value field)
  // mc, vc are described in the description field
  for (const ref of binding.references) {
    const key = ref.label
      .replace(/[-–-]/g, "_")
      .replace(/[\s()]+/g, "_")
      .replace(/[,_]+$/, "")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    // Extract material group letter (P, M, K, N, S, H)
    const groupLetter = ref.label.charAt(0);
    const color = MAT_DB_COLORS[groupLetter] || "#6B7280";

    // Parse Vc range and mc from description
    let vc: number[] = [100, 200, 300];
    let mc = 0.25;

    if (ref.description) {
      const vcMatch = ref.description.match(/Vc=(\d+)-(\d+)/);
      if (vcMatch) {
        vc = [parseInt(vcMatch[1]), 0, parseInt(vcMatch[2])];
        // Calculate mid-point
        vc[1] = Math.round((vc[0] + vc[2]) / 2);
      }
      const mcMatch = ref.description.match(/mc=([\d.]+)/);
      if (mcMatch) {
        mc = parseFloat(mcMatch[1]);
      }
    }

    db[key] = {
      label: ref.label,
      kc1: ref.value,
      mc,
      vc,
      color,
    };
  }

  return db;
}

/**
 * Taylor Tool Life Constants (C, n) for ISO 513 material groups.
 * These are empirical constants used in tool life calculation.
 */
export const TAYLOR_CONSTANTS: Record<string, { C: number; n: number }> = {
  P: { C: 600, n: 0.25 },
  M: { C: 350, n: 0.20 },
  K: { C: 800, n: 0.20 },
  N: { C: 1200, n: 0.30 },
  S: { C: 200, n: 0.15 },
  H: { C: 500, n: 0.30 },
};

/**
 * Returns Taylor constants for a given material group letter.
 */
export function getTaylorConstants(
  groupLetter: string,
): { C: number; n: number } | undefined {
  return TAYLOR_CONSTANTS[groupLetter];
}
