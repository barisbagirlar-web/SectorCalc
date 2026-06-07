"use client";

import type { ToolInput } from "@/data/tool-schema";
import { handleNumericInputChange } from "@/lib/input/numeric-input";

interface ToolInputFieldProps {
  input: ToolInput;
  value: number | string;
  error?: string;
  onChange: (id: string, value: number | string) => void;
  onBlur: (id: string) => void;
}

export function ToolInputField({
  input,
  value,
  error,
  onChange,
  onBlur,
}: ToolInputFieldProps) {
  const inputId = `tool-input-${input.id}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const showUnit = Boolean(input.unit) && !input.currency;

  if (input.type === "select" && input.options) {
    return (
      <div className="sc-industrial-field">
        <div className="sc-industrial-field__label-row">
          <label htmlFor={inputId} className="sc-industrial-field__label">
            {input.label}
            {input.required ? <span aria-hidden> *</span> : null}
          </label>
        </div>
        <select
          id={inputId}
          value={String(value)}
          onChange={(e) => onChange(input.id, e.target.value)}
          onBlur={() => onBlur(input.id)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperId}
          className={error ? "sc-industrial-input--error" : undefined}
        >
          {input.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p id={errorId} className="sc-industrial-field__error" role="alert">
            {error}
          </p>
        ) : (
          <p id={helperId} className="sc-industrial-field__helper">
            {input.helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="sc-industrial-field">
      <div className="sc-industrial-field__label-row">
        <label htmlFor={inputId} className="sc-industrial-field__label">
          {input.label}
          {input.required ? <span aria-hidden> *</span> : null}
        </label>
        {showUnit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
      </div>
      <div className="sc-industrial-input-wrap">
        {input.currency ? (
          <span className="sc-industrial-input-wrap__prefix" aria-hidden>
            $
          </span>
        ) : null}
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={String(value)}
          onChange={(e) => {
            const { numeric } = handleNumericInputChange(e.target.value);
            onChange(input.id, numeric);
          }}
          onBlur={() => onBlur(input.id)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperId}
          className={`sc-industrial-input${input.currency ? " sc-industrial-input--currency" : ""}${showUnit ? " sc-industrial-input--unit" : ""}${error ? " sc-industrial-input--error" : ""}`}
        />
      </div>
      {error ? (
        <p id={errorId} className="sc-industrial-field__error" role="alert">
          {error}
        </p>
      ) : (
        <p id={helperId} className="sc-industrial-field__helper">
          {input.helperText}
        </p>
      )}
    </div>
  );
}
