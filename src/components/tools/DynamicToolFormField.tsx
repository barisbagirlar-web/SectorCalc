"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { CalculatorUnitSelect } from "@/components/tools/CalculatorUnitCurrencyControls";
import { useGeneratedToolFieldDisplay } from "@/hooks/use-generated-tool-field-display";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import {
  getGeneratedInputUnitOptions,
  shouldShowGeneratedUnitSelector,
} from "@/lib/generated-tools/unit-conversion";
import type { GeneratedToolInput } from "@/lib/generated-tools/types";
import { useLocale } from "next-intl";

type DynamicToolFormFieldProps = {
  readonly slug: string;
  readonly input: GeneratedToolInput;
  readonly control: Control<Record<string, unknown>>;
  readonly errors: FieldErrors<Record<string, unknown>>;
  readonly inputIdPrefix: string;
  readonly selectedUnit?: string;
  readonly onUnitChange?: (unit: string) => void;
};

function formatSelectLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DynamicToolFormField({
  slug,
  input,
  control,
  errors,
  inputIdPrefix,
  selectedUnit,
  onUnitChange,
}: DynamicToolFormFieldProps) {
  const locale = useLocale();
  const display = useGeneratedToolFieldDisplay(slug, input);
  const inputId = `${inputIdPrefix}-${input.id}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const fieldError = errors[input.id];
  const errorMessage = fieldError?.message ? String(fieldError.message) : undefined;
  const showUnitSelector = shouldShowGeneratedUnitSelector(input);
  const unitOptions = showUnitSelector ? getGeneratedInputUnitOptions(input, locale) : [];
  const showStaticUnit = Boolean(input.unit) && !showUnitSelector;

  if (input.type === "select" && input.options) {
    return (
      <Controller
        name={input.id}
        control={control}
        render={({ field }) => (
          <div className="sc-industrial-field sc-form-field">
            <div className="sc-industrial-field__label-row">
              <label htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">
                {display.label}
              </label>
            </div>
            <select
              id={inputId}
              value={String(field.value ?? "")}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? errorId : helperId}
              className="sc-ledger-input-boxed min-h-[44px]"
            >
              {input.options?.map((option) => (
                <option key={option} value={option}>
                  {formatSelectLabel(option)}
                </option>
              ))}
            </select>
            <p id={helperId} className="sc-ledger-helper sc-industrial-field__helper">
              {display.helper ?? input.businessContext}
            </p>
            {errorMessage ? (
              <p id={errorId} className="sc-industrial-field__error" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        )}
      />
    );
  }

  if (input.type === "boolean") {
    return (
      <Controller
        name={input.id}
        control={control}
        render={({ field }) => (
          <div className="sc-industrial-field sc-form-field">
            <label className="flex min-h-[44px] items-center gap-2">
              <input
                id={inputId}
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? errorId : helperId}
              />
              <span className="text-sm text-premium-velvet">{display.label}</span>
            </label>
            <p id={helperId} className="sc-ledger-helper sc-industrial-field__helper">
              {display.helper ?? input.businessContext}
            </p>
            {errorMessage ? (
              <p id={errorId} className="sc-industrial-field__error" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        )}
      />
    );
  }

  return (
    <Controller
      name={input.id}
      control={control}
      render={({ field }) => (
        <div className="sc-industrial-field sc-form-field">
          <div className="sc-industrial-field__label-row">
            <label htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">
              {display.label}
            </label>
            {showStaticUnit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
          </div>
          <div className="flex min-w-0 items-stretch gap-2">
            <input
              id={inputId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={field.value === undefined || field.value === null ? "" : String(field.value)}
              onChange={(event) => {
                const { numeric } = handleNumericInputChange(event.target.value);
                field.onChange(numeric);
              }}
              onBlur={field.onBlur}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? errorId : helperId}
              className="sc-ledger-input-boxed sc-industrial-input min-h-[44px] min-w-0 flex-1"
            />
            {showUnitSelector && unitOptions.length > 0 ? (
              <CalculatorUnitSelect
                inputId={inputId}
                fieldKey={input.id}
                explicitUnit={input.unit}
                value={selectedUnit}
                onChange={onUnitChange}
              />
            ) : null}
          </div>
          <p id={helperId} className="sc-ledger-helper sc-industrial-field__helper">
            {display.helper ?? input.businessContext}
          </p>
          {errorMessage ? (
            <p id={errorId} className="sc-industrial-field__error" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
