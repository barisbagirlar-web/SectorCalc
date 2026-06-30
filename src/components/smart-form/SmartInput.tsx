"use client";

import { useEffect, useState } from "react";
import { CalculatorCurrencyPrefix } from "@/components/tools/CalculatorUnitCurrencyControls";
import { SmartHelpTooltip } from "@/components/smart-form/SmartHelpTooltip";
import { SmartUnitSelect } from "@/components/smart-form/SmartUnitSelect";
import { localizedUnitAriaLabel } from "@/lib/features/regional/unit-defaults";
import { useLocale } from "next-intl";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import { useGuidanceFieldFocus } from "@/components/guidance/GuidanceContext";
import type { SmartFormInput, SmartFormValidationTone } from "@/lib/features/smart-form/types";

export type SmartInputProps = {
  readonly input: SmartFormInput;
  readonly value: number | string;
  readonly error?: string;
  readonly tone?: SmartFormValidationTone;
  readonly onChange: (key: string, value: number | string) => void;
  readonly inputIdPrefix?: string;
};

const TONE_CLASS: Record<SmartFormValidationTone, string> = {
  neutral: "border-border-subtle",
  valid: "border-safe-green",
  warning: "border-watch-amber",
  error: "border-crit-red",
};

export function SmartInput({
  input,
  value,
  error,
  tone = "neutral",
  onChange,
  inputIdPrefix = "eng-smart-form",
}: SmartInputProps) {
  const locale = useLocale();
  const { onFocus, onBlur } = useGuidanceFieldFocus(input.key);
  const inputId = `${inputIdPrefix}-${input.key}`;
  const [selectedUnit, setSelectedUnit] = useState(input.unit ?? input.unitOptions?.[0]?.value ?? "");
  useEffect(() => {
    setSelectedUnit(input.unit ?? input.unitOptions?.[0]?.value ?? "");
  }, [input.unit, input.unitOptions]);
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const resolvedTone: SmartFormValidationTone = error ? "error" : tone;
  const showUnit = Boolean(input.unit) && input.type !== "currency";
  const isCurrency = input.type === "currency";

  if (input.type === "select" && input.options) {
    return (
      <div className="sc-industrial-field" data-field-key={input.key}>
        <div className="sc-industrial-field__label-row">
          <label htmlFor={inputId} className="sc-industrial-field__label">
            {input.label}
            {input.required ? <span aria-hidden> *</span> : null}
          </label>
          <SmartHelpTooltip
            label={input.label}
            why={input.helpWhy}
            typical={input.helpTypical}
            reference={input.helpReference}
            example={input.helpExample}
          />
        </div>
        <select
          id={inputId}
          value={String(value)}
          onChange={(event) => onChange(input.key, event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperId}
          className={`min-h-[48px] w-full rounded-sm border bg-white px-3 text-sm ${TONE_CLASS[resolvedTone]}${error ? " sc-industrial-input--error" : ""}`}
        >
          {input.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {input.helperText ? (
          <p id={helperId} className="sc-industrial-field__helper">{input.helperText}</p>
        ) : null}
        {error ? (
          <p id={errorId} className="sc-industrial-field__error" role="alert">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="sc-industrial-field" data-field-key={input.key}>
      <div className="sc-industrial-field__label-row">
        <label htmlFor={inputId} className="sc-industrial-field__label">
          {input.label}
          {input.required ? <span aria-hidden> *</span> : null}
        </label>
        {showUnit && !(input.unitOptions && input.unitOptions.length > 0) ? (
          <span className="sc-industrial-field__unit">{input.unit}</span>
        ) : null}
        <SmartHelpTooltip
          label={input.label}
          why={input.helpWhy}
          typical={input.helpTypical}
          reference={input.helpReference}
          example={input.helpExample}
        />
      </div>
      <div className="flex min-w-0 items-stretch gap-2">
        <div className="sc-industrial-input-wrap min-w-0 flex-1">
          {isCurrency ? <CalculatorCurrencyPrefix currency={input.unit} /> : null}
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={String(value)}
            placeholder={input.placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(event) => {
              const { numeric } = handleNumericInputChange(event.target.value);
              onChange(input.key, numeric);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperId}
            className={`min-h-[48px] w-full sc-ledger-input-boxed sc-industrial-input${isCurrency ? " sc-industrial-input--currency" : ""}${showUnit ? " sc-industrial-input--unit" : ""}${error ? " sc-industrial-input--error" : ""} border ${TONE_CLASS[resolvedTone]}`}
          />
        </div>
        {input.unitOptions && input.unitOptions.length > 0 ? (
          <SmartUnitSelect
            inputId={inputId}
            value={selectedUnit}
            options={input.unitOptions}
            ariaLabel={localizedUnitAriaLabel(locale)}
            onChange={setSelectedUnit}
          />
        ) : null}
      </div>
      {input.helperText ? (
        <p id={helperId} className="sc-industrial-field__helper">{input.helperText}</p>
      ) : null}
      {error ? (
        <p id={errorId} className="sc-industrial-field__error" role="alert">{error}</p>
      ) : null}
    </div>
  );
}
