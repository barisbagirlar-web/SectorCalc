"use client";

import { useState, useEffect } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import {
  getGeneratedInputUnitOptions,
  shouldShowGeneratedUnitSelector,
} from "@/lib/features/generated-tools/unit-conversion";
import type { GeneratedToolInput } from "@/lib/features/generated-tools/types";
import { resolveLocalizedGeneratedSelectOptions } from "@/lib/features/generated-tools/select-options";
import { translateZodErrorMessage } from "@/lib/infrastructure/i18n/zod-error-translate";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import { FitText } from "@/components/ui/FitText";

type PremiumDynamicToolFormFieldProps = {
  readonly input: GeneratedToolInput;
  readonly control: Control<Record<string, unknown>>;
  readonly errors: FieldErrors<Record<string, unknown>>;
  readonly inputId: string;
  readonly label: string;
  readonly businessContext: string;
  readonly selectedUnit?: string;
  readonly onUnitChange?: (unit: string) => void;
  readonly enterValuePlaceholder: string;
};

type NumericInputProps = {
  value: any;
  onChange: (val: number) => void;
  onBlur: () => void;
  inputId: string;
  enterValuePlaceholder: string;
  errorMessage: any;
};

function NumericInput({
  value,
  onChange,
  onBlur,
  inputId,
  enterValuePlaceholder,
  errorMessage,
}: NumericInputProps) {
  const [inputValue, setInputValue] = useState<string>(() => {
    return value === undefined || value === null ? "" : String(value);
  });

  useEffect(() => {
    const num = Number(inputValue);
    const isTypingDecimal = inputValue.endsWith(".") || inputValue.endsWith(",");
    if (value !== num && !isTypingDecimal && inputValue !== ".") {
      setInputValue(value === undefined || value === null ? "" : String(value));
    }
  }, [value]);

  return (
    <input
      id={inputId}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={inputValue}
      onChange={(event) => {
        const { sanitized, numeric } = handleNumericInputChange(event.target.value);
        setInputValue(sanitized);
        onChange(numeric);
      }}
      onBlur={onBlur}
      aria-invalid={Boolean(errorMessage)}
      className="sc-premium-dtf-touch-input"
      placeholder={enterValuePlaceholder}
    />
  );
}

export function PremiumDynamicToolFormField({
  input,
  control,
  errors,
  inputId,
  label,
  businessContext,
  selectedUnit,
  onUnitChange,
  enterValuePlaceholder,
}: PremiumDynamicToolFormFieldProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.premiumForm");
  const unitSystem = usePreferredUnitSystem();
  const fieldError = errors[input.id];
  const rawErrorMessage = fieldError?.message ? String(fieldError.message) : undefined;
  const errorMessage = rawErrorMessage ? translateZodErrorMessage(rawErrorMessage, locale) : undefined;
  const showUnitSelector = shouldShowGeneratedUnitSelector(input);
  const unitOptions = showUnitSelector
    ? getGeneratedInputUnitOptions(input, locale, unitSystem)
    : [];

  if (input.type === "select" && input.options) {
    const selectOptions = resolveLocalizedGeneratedSelectOptions(input, locale);
    return (
      <div className="sc-premium-dtf-input-row">
        <div className="sc-premium-dtf-input-label">
          <FitText as="div" className="sc-premium-dtf-input-title">{label}</FitText>
          {businessContext ? (
            <div className="sc-premium-dtf-input-desc">{businessContext}</div>
          ) : null}
        </div>
        <Controller
          name={input.id}
          control={control}
          render={({ field }) => (
            <div className="sc-premium-dtf-input-control">
              <select
                id={inputId}
                value={String(field.value ?? "")}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errorMessage)}
                className="sc-premium-dtf-touch-select"
              >
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        />
        {errorMessage ? (
          <p className="sc-premium-dtf-field-error col-span-2" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  }

  if (input.type === "boolean") {
    return (
      <div className="sc-premium-dtf-input-row">
        <div className="sc-premium-dtf-input-label">
          <FitText as="div" className="sc-premium-dtf-input-title">{label}</FitText>
          {businessContext ? (
            <div className="sc-premium-dtf-input-desc">{businessContext}</div>
          ) : null}
        </div>
        <Controller
          name={input.id}
          control={control}
          render={({ field }) => (
            <label className="sc-premium-dtf-boolean-row" htmlFor={inputId}>
              <input
                id={inputId}
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errorMessage)}
              />
              <span>{label}</span>
            </label>
          )}
        />
        {errorMessage ? (
          <p className="sc-premium-dtf-field-error col-span-2" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="sc-premium-dtf-input-row">
      <div className="sc-premium-dtf-input-label">
        <FitText as="div" className="sc-premium-dtf-input-title">{label}</FitText>
        {businessContext ? (
          <div className="sc-premium-dtf-input-desc">{businessContext}</div>
        ) : null}
      </div>
      <Controller
        name={input.id}
        control={control}
        render={({ field }) => (
          <div className="sc-premium-dtf-input-control">
            <NumericInput
              inputId={inputId}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              enterValuePlaceholder={enterValuePlaceholder}
              errorMessage={errorMessage}
            />
            {showUnitSelector && unitOptions.length > 0 ? (
              <select
                id={`${inputId}-unit`}
                value={selectedUnit ?? input.unit}
                onChange={(event) => onUnitChange?.(event.target.value)}
                className="sc-premium-dtf-unit-select"
                aria-label={t("unitSuffix", { label })}
              >
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        )}
      />
      {errorMessage ? (
        <p className="sc-premium-dtf-field-error col-span-2" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
