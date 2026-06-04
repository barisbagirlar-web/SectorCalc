"use client";

import type { ToolInput } from "@/data/tool-schema";

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

  if (input.type === "select" && input.options) {
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-deep-navy">
          {input.label}
          {input.required && <span className="text-soft-red ml-0.5">*</span>}
        </label>
        <select
          id={inputId}
          value={String(value)}
          onChange={(e) => onChange(input.id, e.target.value)}
          onBlur={() => onBlur(input.id)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : `${inputId}-helper`}
          className={`w-full min-h-[48px] rounded-lg border bg-white px-4 text-deep-navy focus:outline-none focus:ring-2 focus:ring-professional-blue/20 ${
            error ? "border-soft-red" : "border-slate/25 focus:border-professional-blue"
          }`}
        >
          {input.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p id={errorId} className="text-sm text-soft-red" role="alert">
            {error}
          </p>
        ) : (
          <p id={`${inputId}-helper`} className="text-xs text-slate leading-relaxed">
            {input.helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-deep-navy">
        {input.label}
        {input.required && <span className="text-soft-red ml-0.5">*</span>}
      </label>
      <div className="relative">
        {input.currency && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate">
            $
          </span>
        )}
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          value={value}
          min={input.min}
          max={input.max}
          step={input.step ?? (input.currency ? 1 : 0.01)}
          onChange={(e) => {
            const parsed = e.target.value === "" ? 0 : Number(e.target.value);
            onChange(input.id, parsed);
          }}
          onBlur={() => onBlur(input.id)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : `${inputId}-helper`}
          className={`w-full min-h-[48px] rounded-lg border bg-white py-2.5 text-deep-navy focus:outline-none focus:ring-2 focus:ring-professional-blue/20 ${
            input.currency ? "pl-8 pr-4" : "px-4"
          } ${input.unit ? "pr-12" : ""} ${error ? "border-soft-red" : "border-slate/25 focus:border-professional-blue"}`}
        />
        {input.unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate">
            {input.unit}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-soft-red" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${inputId}-helper`} className="text-xs text-slate leading-relaxed">
          {input.helperText}
        </p>
      )}
    </div>
  );
}
