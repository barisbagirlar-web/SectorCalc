"use client";

import type { SmartFormUnitOption } from "@/lib/smart-form/types";

export type SmartUnitSelectProps = {
  readonly inputId: string;
  readonly value?: string;
  readonly options: readonly SmartFormUnitOption[];
  readonly metricImperialReady?: boolean;
  readonly disabled?: boolean;
  readonly onChange?: (value: string) => void;
};

export function SmartUnitSelect({
  inputId,
  value,
  options,
  metricImperialReady = true,
  disabled = true,
  onChange,
}: SmartUnitSelectProps) {
  if (options.length === 0) {
    return null;
  }

  const selected = value ?? options[0]?.value;

  return (
    <select
      id={`${inputId}-unit`}
      aria-label="Unit"
      disabled={disabled}
      value={selected}
      onChange={(event) => onChange?.(event.target.value)}
      className="min-h-[48px] min-w-[4.5rem] rounded-sm border border-border-subtle bg-off-white px-2 text-sm text-body-charcoal"
      data-metric-imperial-ready={metricImperialReady ? "true" : "false"}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
