"use client";

import { handleNumericInputChange } from "@/lib/input/numeric-input";
import type { SmartFormContractFieldSpec } from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";

type SmartFormFieldProps = {
  readonly field: SmartFormContractFieldSpec;
  readonly value: number | string;
  readonly error?: string;
  readonly onChange: (key: string, value: number | string) => void;
  readonly inputIdPrefix?: string;
};

export function SmartFormField({
  field,
  value,
  error,
  onChange,
  inputIdPrefix = "smart-form",
}: SmartFormFieldProps) {
  const inputId = `${inputIdPrefix}-${field.key}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const showUnit = Boolean(field.unit) && field.type !== "currency";
  const isCurrency = field.type === "currency";

  return (
    <div className="sc-industrial-field sc-form-field" data-field-key={field.key} data-field-group={field.group}>
      <div className="sc-industrial-field__label-row">
        <label htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">
          {field.label}
          {field.required ? <span aria-hidden> *</span> : null}
        </label>
        {showUnit ? <span className="sc-industrial-field__unit">{field.unit}</span> : null}
      </div>
      <div className="relative">
        {isCurrency ? (
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs text-body-charcoal">
            $
          </span>
        ) : null}
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={String(value)}
          placeholder={field.placeholder}
          onChange={(event) => {
            const { numeric } = handleNumericInputChange(event.target.value);
            onChange(field.key, numeric);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : field.helperText || field.validationHint ? helperId : undefined}
          className={`sc-ledger-input-underline${isCurrency ? " pl-5" : ""}${error ? " sc-ledger-input--error" : ""}`}
        />
      </div>
      {field.helperText || field.validationHint ? (
        <p id={helperId} className="sc-industrial-field__helper">
          {field.helperText ?? field.validationHint}
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
