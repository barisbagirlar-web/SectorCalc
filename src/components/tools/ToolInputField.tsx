"use client";

import type { ToolInput } from "@/data/tool-schema";
import { handleNumericInputChange, SC_NUMERIC_INPUT_CLASS } from "@/lib/input/numeric-input";
import { getRiskDriverForInput } from "@/lib/terminology/margincore-identity";

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
 const riskDriver = getRiskDriverForInput(input.id, input.label);

 if (input.type === "select" && input.options) {
 return (
 <div className="space-y-1.5">
 <label htmlFor={inputId} className="block text-sm font-medium text-text-primary">
 <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
 Risk variable ·{" "}
 </span>
 {input.label}
 {input.required && <span className="text-amber ml-0.5">*</span>}
 </label>
 <select
 id={inputId}
 value={String(value)}
 onChange={(e) => onChange(input.id, e.target.value)}
 onBlur={() => onBlur(input.id)}
 aria-invalid={Boolean(error)}
 aria-describedby={error ? errorId : `${inputId}-helper`}
 className={`w-full min-h-[48px] rounded-lg border bg-white px-4 text-text-primary focus:outline-none focus:border-amber-500 ${
 error ? "border-soft-red" : "border-slate/25"
 }`}
 >
 {input.options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 {error ? (
 <p id={errorId} className="text-sm text-amber" role="alert">
 {error}
 </p>
 ) : (
 <>
 <p className="text-[11px] font-medium uppercase tracking-wide text-amber">
 Margin leak driver
 </p>
 <p id={`${inputId}-driver`} className="text-xs leading-relaxed text-text-secondary">
 {riskDriver}
 </p>
 <p id={`${inputId}-helper`} className="text-xs text-text-secondary leading-relaxed">
 {input.helperText}
 </p>
 </>
 )}
 </div>
 );
 }

 return (
 <div className="space-y-1.5">
 <label htmlFor={inputId} className="block text-sm font-medium text-text-primary">
 <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
 Risk variable ·{" "}
 </span>
 {input.label}
 {input.required && <span className="text-amber ml-0.5">*</span>}
 </label>
 <div className="relative">
 {input.currency && (
 <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
 $
 </span>
 )}
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
 aria-describedby={error ? errorId : `${inputId}-helper`}
 className={`${SC_NUMERIC_INPUT_CLASS} w-full min-h-[48px] rounded-lg border bg-white py-2.5 text-text-primary ${
 input.currency ? "pl-8 pr-4" : "px-4"
 } ${input.unit ? "pr-12" : ""} ${error ? "border-soft-red" : "border-slate/25"}`}
 />
 {input.unit && (
 <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
 {input.unit}
 </span>
 )}
 </div>
 {error ? (
 <p id={errorId} className="text-sm text-amber" role="alert">
 {error}
 </p>
 ) : (
 <>
 <p className="text-[11px] font-medium uppercase tracking-wide text-amber">
 Margin leak driver
 </p>
 <p id={`${inputId}-driver`} className="text-xs leading-relaxed text-text-secondary">
 {riskDriver}
 </p>
 <p id={`${inputId}-helper`} className="text-xs text-text-secondary leading-relaxed">
 {input.helperText}
 </p>
 </>
 )}
 </div>
 );
}
