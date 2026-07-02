"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { CalculatorUnitSelect } from "@/components/tools/CalculatorUnitCurrencyControls";
import { FitText } from "@/components/ui/FitText";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import { useGeneratedToolFieldDisplay } from "@/hooks/use-generated-tool-field-display";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import {
  getGeneratedInputUnitOptions,
  shouldShowGeneratedUnitSelector,
} from "@/lib/features/generated-tools/unit-conversion";
import { translateZodErrorMessage } from "@/lib/infrastructure/i18n/zod-error-translate";
import type { GeneratedToolInput } from "@/lib/features/generated-tools/types";
import { resolveLocalizedGeneratedSelectOptions } from "@/lib/features/generated-tools/select-options";
import { useLocale } from "@/lib/i18n-stub";

type DynamicToolFormFieldProps = {
  readonly slug: string;
  readonly input: GeneratedToolInput;
  readonly control: Control<Record<string, unknown>>;
  readonly errors: FieldErrors<Record<string, unknown>>;
  readonly inputIdPrefix: string;
  readonly selectedUnit?: string;
  readonly onUnitChange?: (unit: string) => void;
};

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
  const rawErrorMessage = fieldError?.message ? String(fieldError.message) : undefined;
  const errorMessage = rawErrorMessage ? translateZodErrorMessage(rawErrorMessage, locale) : undefined;
  const showUnitSelector = shouldShowGeneratedUnitSelector(input);
  const unitSystem = usePreferredUnitSystem();
  const unitOptions = showUnitSelector
    ? getGeneratedInputUnitOptions(input, locale, unitSystem)
    : [];
  const showStaticUnit = Boolean(input.unit) && !showUnitSelector;

  if (input.type === "select" && input.options) {
    const selectOptions = resolveLocalizedGeneratedSelectOptions(input, locale);
    return (
      <Controller
        name={input.id}
        control={control}
        render={({ field }) => (
          <div className="sc-industrial-field sc-form-field">
            <div className="sc-industrial-field__label-row">
              <FitText as="label" htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">{display.label}</FitText>
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
              {selectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id={helperId} className="sc-ledger-helper sc-industrial-field__helper">
              {display.helper}
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
              <FitText as="span" className="text-sm text-premium-velvet">{display.label}</FitText>
            </label>
            <p id={helperId} className="sc-ledger-helper sc-industrial-field__helper">
              {display.helper}
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
            <FitText as="label" htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">{display.label}</FitText>
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
            {display.helper}
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
