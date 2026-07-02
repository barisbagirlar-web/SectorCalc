"use client";

import { useState } from "react";

const STANDARD_GROUPS = {
  welding: ["AWS D1.1", "ISO 3834", "EN 1090"],
  bolting: ["UNC/UNF", "Metric (ISO)", "JIS"],
  pressure: ["ASME BPVC", "PED/EN 13445"],
  material: ["ASTM", "EN", "JIS", "DIN"],
  gdt: ["ASME Y14.5", "ISO GPS"],
  steel: ["AISC", "Eurocode"],
} as const;

export type StandardCategory = keyof typeof STANDARD_GROUPS;

export type StandardSelectorProps = {
  readonly category: StandardCategory;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
};

/**
 * Draft standard selector - prefer schema-driven ToolStandardSelector in premium forms.
 */
export function StandardSelector({ category, value, onChange }: StandardSelectorProps) {
  const options = STANDARD_GROUPS[category];
  const [internal, setInternal] = useState<string>(options[0]);
  const selected = value ?? internal;

  const handleChange = (next: string) => {
    if (onChange) {
      onChange(next);
      return;
    }
    setInternal(next);
  };

  return (
    <div className="mb-2">
      <label htmlFor={`standard-${category}`} className="block text-sm font-medium">
        Standard
      </label>
      <select
        id={`standard-${category}`}
        value={selected}
        onChange={(event) => handleChange(event.target.value)}
        className="mt-1 w-full rounded border border-[var(--sc-border)] bg-white p-2 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
