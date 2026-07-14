import { describe, expect, test } from "vitest";
import {
  ACTIVE_FREE_TOOL_SLUGS,
  ACTIVE_PRO_TOOL_SLUGS,
} from "@/sectorcalc/runtime/active-tool-allowlist";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import {
  normalizeInput,
  normalizeUnitRegistryEntry,
  preservePhysicalQuantity,
} from "@/sectorcalc/pro-form/unit-normalizer";
import {
  GLOBAL_CURRENCY_CODES,
  isMonetaryInputContract,
} from "@/sectorcalc/pro-form/universal-unit-catalog";
import type { SuperV4Input } from "@/sectorcalc/pro-form/contract-types";

const ACTIVE_TOOL_KEYS = [...ACTIVE_FREE_TOOL_SLUGS, ...ACTIVE_PRO_TOOL_SLUGS];

type PresentedInput = SuperV4Input & {
  _reference_default_text?: string | null;
  example?: number | null;
  sampleValue?: number | null;
};

function relativeError(actual: number, expected: number): number {
  const scale = Math.max(1, Math.abs(expected));
  return Math.abs(actual - expected) / scale;
}

describe("universal unit and reference contract", () => {
  test("the governed currency catalog has broad global ISO coverage and no duplicates", () => {
    expect(GLOBAL_CURRENCY_CODES.length).toBeGreaterThanOrEqual(140);
    expect(new Set(GLOBAL_CURRENCY_CODES).size).toBe(GLOBAL_CURRENCY_CODES.length);
    for (const required of ["USD", "EUR", "GBP", "JPY", "CNY", "CHF", "TRY", "INR", "BRL", "ZAR", "AED", "SAR"]) {
      expect(GLOBAL_CURRENCY_CODES).toContain(required);
    }
  });

  test("every active numeric input exposes a non-autofilled numeric example", () => {
    const failures: string[] = [];

    for (const toolKey of ACTIVE_TOOL_KEYS) {
      const resolved = resolveApprovedToolSchema(toolKey);
      if (!resolved.ok) {
        failures.push(`${toolKey}: schema did not resolve (${resolved.reason}: ${resolved.errors.join(" | ")})`);
        continue;
      }

      for (const input of resolved.schema.inputs) {
        if (input.type !== "number" && input.type !== "integer") continue;
        const presented = input as PresentedInput;
        const reference = presented._reference_default_text ?? "";
        if (!/\d/.test(reference)) failures.push(`${toolKey}/${input.id}: numeric illustrative reference missing`);
        if (!/not auto-filled/i.test(input.help_text ?? input.user_help_text ?? "")) {
          failures.push(`${toolKey}/${input.id}: example is not explicitly declared non-autofill`);
        }
        if (input.default_policy === "NO_DEFAULT") {
          if (input.default_value !== null && input.default_value !== undefined) {
            failures.push(`${toolKey}/${input.id}: NO_DEFAULT input carries default_value`);
          }
          if (input.default !== null && input.default !== undefined) {
            failures.push(`${toolKey}/${input.id}: NO_DEFAULT input carries default`);
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test("monetary inputs use one global denomination selector and never imply FX conversion", () => {
    const failures: string[] = [];

    for (const toolKey of ACTIVE_TOOL_KEYS) {
      const resolved = resolveApprovedToolSchema(toolKey);
      if (!resolved.ok) continue;
      expect(resolved.schema.unit_conversion_contract.currency_policy).toBe(
        "ISO_4217_DENOMINATION_ONLY_NO_FX_CONVERSION",
      );

      for (const input of resolved.schema.inputs.filter(isMonetaryInputContract)) {
        if (input.unit_selectable) failures.push(`${toolKey}/${input.id}: monetary unit must be governed by one tool-wide selector`);
        if (input.allowed_display_units.join(",") !== "display_currency") {
          failures.push(`${toolKey}/${input.id}: display_currency binding missing`);
        }
        const registryItem = resolved.schema.unit_conversion_contract.conversion_registry[input.quantity_kind];
        const units = registryItem
          ? normalizeUnitRegistryEntry(registryItem as unknown as Record<string, unknown>)
          : [];
        const displayEntry = units.find((entry) => entry.unit === "display_currency");
        if (!displayEntry || displayEntry.factor !== 1) {
          failures.push(`${toolKey}/${input.id}: denomination identity entry missing`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  test("all selectable engineering units are registered and round-trip without drift", () => {
    const failures: string[] = [];

    for (const toolKey of ACTIVE_TOOL_KEYS) {
      const resolved = resolveApprovedToolSchema(toolKey);
      if (!resolved.ok) continue;
      const registry = resolved.schema.unit_conversion_contract.conversion_registry;

      for (const input of resolved.schema.inputs) {
        if (!input.unit_selectable || !input.base_unit) continue;
        const item = registry[input.quantity_kind];
        const registered = item
          ? normalizeUnitRegistryEntry(item as unknown as Record<string, unknown>)
          : [];
        const registeredNames = new Set(registered.map((entry) => entry.unit));

        if (!registeredNames.has(input.base_unit)) {
          failures.push(`${toolKey}/${input.id}: base unit ${input.base_unit} not registered; registered=${[...registeredNames].join(",")}`);
          continue;
        }

        for (const displayUnit of input.allowed_display_units) {
          if (!registeredNames.has(displayUnit)) {
            failures.push(`${toolKey}/${input.id}: display unit ${displayUnit} not registered`);
            continue;
          }
          const normalized = normalizeInput(
            input.id,
            "1.23456789",
            displayUnit,
            input.base_unit,
            input.quantity_kind,
            registry,
          );
          if (!("baseValue" in normalized)) {
            failures.push(`${toolKey}/${input.id}: ${displayUnit} normalization failed (${normalized.reason})`);
            continue;
          }
          const roundTrip = preservePhysicalQuantity(
            normalized.baseValue,
            input.base_unit,
            displayUnit,
            input.quantity_kind,
            registry,
          );
          if (!("newValue" in roundTrip)) {
            failures.push(`${toolKey}/${input.id}: ${displayUnit} reverse conversion failed (${roundTrip.reason})`);
            continue;
          }
          if (relativeError(roundTrip.newValue, 1.23456789) > 1e-10) {
            failures.push(`${toolKey}/${input.id}: ${displayUnit} round-trip drift ${roundTrip.newValue}`);
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
