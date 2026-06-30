"use client";

import { useTranslations } from "next-intl";
import type { GeneratedToolStandardOption } from "@/lib/generated-tools/types";

export type ToolStandardSelectorProps = {
  readonly options: readonly GeneratedToolStandardOption[];
  readonly value: string;
  readonly onChange: (standardId: string) => void;
  readonly disabled?: boolean;
};

export function ToolStandardSelector({
  options,
  value,
  onChange,
  disabled = false,
}: ToolStandardSelectorProps) {
  const t = useTranslations("generatedTool.premiumForm");
  const selected = options.find((option) => option.id === value);

  return (
    <div className="sc-premium-dtf-standard-block">
      <label htmlFor="tool-calculation-standard" className="sc-premium-dtf-standard-label">
        {t("calculationStandardLabel")}
      </label>
      <div className="sc-premium-dtf-touch-field">
        <select
          id="tool-calculation-standard"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="sc-premium-dtf-touch-select sc-premium-dtf-standard-select"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {selected?.description ? (
        <p className="sc-premium-dtf-standard-description">{selected.description}</p>
      ) : null}
    </div>
  );
}
