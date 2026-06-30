"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import {
  getCurrencyOptionsForLocale,
  getDefaultCurrencyForRegion,
  getAvailableUnitsForGroup,
  getDefaultUnitForRegion,
  inferUnitGroupFromFieldKey,
  localizedUnitAriaLabel,
  resolveRegionalCodeForUnitDefaults,
  type UnitGroup,
} from "@/lib/regional/unit-defaults";
import { resolveRegionalCodeFromLocale } from "@/lib/regional/regions";

export function useCalculatorFieldUnitState(fieldKey: string, explicitUnit?: string, isCurrency = false) {
  const locale = useLocale();
  const unitSystem = usePreferredUnitSystem();
  const region = resolveRegionalCodeForUnitDefaults(locale, unitSystem);
  const unitGroup = inferUnitGroupFromFieldKey(fieldKey);

  return useMemo(() => {
    if (isCurrency) {
      const defaultCurrency = getDefaultCurrencyForRegion(region);
      return {
        unit: defaultCurrency,
        unitOptions: getCurrencyOptionsForLocale(locale),
        unitGroup: "currency" as UnitGroup,
      };
    }
    if (!unitGroup) {
      return {
        unit: explicitUnit,
        unitOptions: explicitUnit ? [{ value: explicitUnit, label: explicitUnit }] : [],
        unitGroup: null,
      };
    }
    return {
      unit: getDefaultUnitForRegion(region, unitGroup, unitSystem),
      unitOptions: getAvailableUnitsForGroup(unitGroup, locale, unitSystem),
      unitGroup,
    };
  }, [explicitUnit, isCurrency, locale, region, unitGroup, unitSystem]);
}

type CalculatorUnitSelectProps = {
  readonly inputId: string;
  readonly fieldKey: string;
  readonly explicitUnit?: string;
  readonly isCurrency?: boolean;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
};

export function CalculatorUnitSelect({
  inputId,
  fieldKey,
  explicitUnit,
  isCurrency = false,
  value,
  onChange,
}: CalculatorUnitSelectProps) {
  const locale = useLocale();
  const { unitOptions, unit } = useCalculatorFieldUnitState(fieldKey, explicitUnit, isCurrency);

  if (unitOptions.length === 0) {
    return explicitUnit ? <span className="sc-industrial-field__unit">{explicitUnit}</span> : null;
  }

  return (
    <select
      id={`${inputId}-unit`}
      className="sc-industrial-field__unit-select min-h-[44px] rounded border border-technical-gray bg-white px-2 text-xs"
      value={value ?? unit}
      disabled={!onChange}
      aria-label={localizedUnitAriaLabel(locale)}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {unitOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function CalculatorCurrencyPrefix({
  currency,
}: {
  readonly currency?: string;
}) {
  const locale = useLocale();
  const region = resolveRegionalCodeFromLocale(locale);
  const code = currency ?? getDefaultCurrencyForRegion(region);
  const symbol = code === "TRY" ? "₺" : code === "EUR" ? "€" : code === "GBP" ? "£" : code === "USD" ? "$" : code;
  return (
    <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs text-body-charcoal">
      {symbol}
    </span>
  );
}
