"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { SmartHelpTooltip } from "@/components/smart-form/SmartHelpTooltip";
import { SmartUnitSelect } from "@/components/smart-form/SmartUnitSelect";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import { localizedUnitAriaLabel } from "@/lib/features/regional/unit-defaults";
import { useLocale } from "@/lib/i18n-stub";
import type { SmartInputRequirement } from "@/lib/features/smart-form/dynamic-form-types";

const DEFAULT_CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "TRY", label: "TRY" },
  { value: "CHF", label: "CHF" },
] as const;

type SmartInputFieldProps = {
  readonly input: SmartInputRequirement;
  readonly value: number | string;
  readonly error?: string;
  readonly required?: boolean;
  readonly onChange: (key: string, value: number | string) => void;
  readonly inputIdPrefix?: string;
};

export function SmartInputField({
  input,
  value,
  error,
  required = false,
  onChange,
  inputIdPrefix = "dynamic-smart-form",
}: SmartInputFieldProps) {
  const t = useTranslations("smartForm");
  const locale = useLocale();
  const inputId = `${inputIdPrefix}-${input.key}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const label = t(input.labelKey);
  const help = input.helpKey ? t(input.helpKey) : undefined;
  const isCurrency = input.kind === "currency";
  const unitOptions = input.unitOptions && input.unitOptions.length > 0
    ? input.unitOptions
    : isCurrency
      ? DEFAULT_CURRENCY_OPTIONS
      : undefined;
  const hasUnitOptions = unitOptions !== undefined && unitOptions.length > 0;
  const showUnit = Boolean(input.unit) && !isCurrency && !hasUnitOptions;

  const [selectedUnit, setSelectedUnit] = useState(
    input.unit ?? unitOptions?.[0]?.value ?? "",
  );
  useEffect(() => {
    setSelectedUnit(input.unit ?? unitOptions?.[0]?.value ?? "");
  }, [input.unit, input.unitOptions, isCurrency]);

  return (
    <div className="sc-smart-form-field sc-industrial-field" data-field-key={input.key}>
      <div className="sc-smart-form-field__label-row sc-industrial-field__label-row">
        <label htmlFor={inputId} className="sc-smart-form-field__label sc-industrial-field__label">
          {label}
          {required ? <span aria-hidden> *</span> : null}
        </label>
        {showUnit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
        {help ? (
          <SmartHelpTooltip label={label} why={help} typical={help} example={help} />
        ) : null}
      </div>
      <div className="sc-smart-form-field__input-wrap relative min-w-0">
        {isCurrency && !hasUnitOptions ? (
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs text-body-charcoal">
            {selectedUnit}
          </span>
        ) : null}
        <div className="flex min-w-0 items-stretch gap-2">
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={String(value)}
            onChange={(event) => {
              const { numeric } = handleNumericInputChange(event.target.value);
              onChange(input.key, numeric);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : help ? helperId : undefined}
            className={`sc-smart-form-field__input sc-ledger-input-underline flex-1${isCurrency ? " pl-8" : ""}${error ? " sc-ledger-input--error" : ""}`}
          />
          {hasUnitOptions ? (
            <SmartUnitSelect
              inputId={inputId}
              value={selectedUnit}
              options={unitOptions}
              ariaLabel={localizedUnitAriaLabel(locale)}
              onChange={(unit) => setSelectedUnit(unit)}
            />
          ) : null}
        </div>
      </div>
      {help ? (
        <p id={helperId} className="sc-smart-form-field__help sc-industrial-field__helper">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="sc-industrial-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
