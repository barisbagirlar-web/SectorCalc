import type { SuperV4Input } from "./contract-types";
import {
  GLOBAL_CURRENCY_CODES,
  isCurrencyCode,
  resolveUniversalUnitContract as resolveCatalogContract,
  type ResolvedUniversalUnitContract,
} from "./universal-unit-catalog";

const NON_CURRENCY_THREE_LETTER_ALIAS: Readonly<Record<string, string>> = {
  bar: "bar_g",
  btu: "J",
  cfm: "m³/min",
  day: "week",
  deg: "degree",
  gpa: "Pa",
  khz: "Hz",
  kpa: "Pa",
  ksi: "Pa",
  kwh: "J",
  min: "minute",
  mpa: "Pa",
  mph: "m/s",
  mwh: "J",
  psi: "Pa",
  rad: "degree",
  rpm: "Hz",
};

function hasAny(value: string, tokens: readonly string[]): boolean {
  return tokens.some((token) => value.includes(token));
}

/**
 * Monetary classification is deliberately stricter than a generic three-letter
 * pattern. Engineering units such as cfm, psi, rpm, min, day, deg, kWh, and MPa
 * must never be mistaken for ISO currency codes.
 */
export function isMonetaryInputContract(
  input: Pick<SuperV4Input, "id" | "name" | "quantity_kind" | "base_unit">,
): boolean {
  const quantity = input.quantity_kind.toLowerCase();
  const base = (input.base_unit ?? "").trim();
  const baseLower = base.toLowerCase();
  if (quantity.includes("currency") || baseLower.includes("currency")) return true;

  const codeMatch = base.toUpperCase().match(/^([A-Z]{3})(?:$|\/)/);
  if (codeMatch && isCurrencyCode(codeMatch[1])) return true;

  const identity = `${input.id} ${input.name}`.toLowerCase();
  return hasAny(identity, [
    " cost", "cost_", "_cost", " price", "price_", "_price", " revenue", "revenue_", "_revenue",
    " cash", "cash_", "_cash", " salary", "salary_", "_salary", " capex", " opex", " investment",
    " invoice", " fee", " tariff", " freight", " labor rate", "labour rate", " machine rate", " shop rate",
    " material value", " inventory value", " selling value", "amount", "grant coverage",
  ]) && !hasAny(identity, [
    "percentage", "percent", "ratio", "rate percent", "margin", "flow", "angle", "minute", "day", "hour",
  ]);
}

function catalogResolutionInput(input: SuperV4Input): SuperV4Input {
  if (isMonetaryInputContract(input)) return input;
  const base = (input.base_unit ?? "").trim();
  const alias = NON_CURRENCY_THREE_LETTER_ALIAS[base.toLowerCase()];
  return alias ? { ...input, base_unit: alias } : input;
}

/**
 * Authoritative resolver used by the public schema pipeline. It delegates the
 * family catalog but first disambiguates physical three-letter unit symbols from
 * ISO currency codes. The original schema base unit remains the canonical unit
 * exposed to formulas and audits.
 */
export function resolveUniversalUnitContract(input: SuperV4Input): ResolvedUniversalUnitContract {
  const actualMonetary = isMonetaryInputContract(input);
  const resolutionInput = catalogResolutionInput(input);
  const resolved = resolveCatalogContract(resolutionInput);

  if (actualMonetary) return resolved;
  if (!input.base_unit || input.base_unit === resolutionInput.base_unit) return resolved;

  return {
    ...resolved,
    baseUnit: input.base_unit,
    monetary: false,
    displayUnits: [...new Set([input.base_unit, ...resolved.displayUnits])],
  };
}

export { GLOBAL_CURRENCY_CODES };
