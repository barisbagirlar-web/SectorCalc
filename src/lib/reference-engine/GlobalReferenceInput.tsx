"use client";

import { useMemo, useCallback, type ChangeEvent } from "react";
import type { FormReferenceBindingContractType } from "./FormReferenceBindingContract";

// ─── Props ────────────────────────────────────────────────────────────────

interface GlobalReferenceInputProps {
  /** The binding contract from the reference registry */
  binding: FormReferenceBindingContractType;
  /** Current value (controlled) */
  value: number | string | undefined;
  /** Change handler */
  onChange: (value: number) => void;
  /** Label to display */
  label: string;
  /** Symbol (e.g., "ρ") */
  symbol?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Validation min/max */
  validation?: { min?: number; max?: number };
  /** Hint text */
  hint?: string;
  /** Confidence badge label */
  confidenceLabel?: string;
  /** Expert meaning tooltip */
  expertMeaning?: string;
  /** Uncertainty string (e.g., "±5%") */
  uncertainty?: string;
}

// ─── Component ────────────────────────────────────────────────────────────

/**
 * GlobalReferenceInput — Reference-bound form input.
 *
 * Renders a numeric input with a dropdown of reference values from the
 * build-time validated registry. Reference values are filtered by the
 * binding's projectUnitSystem.
 *
 * Usage:
 *   import { registry } from "@/generated/reference-registry";
 *
 *   <GlobalReferenceInput
 *     binding={registry["beam-weight-analyzer"]["steelDensity"]}
 *     value={values.steelDensity}
 *     onChange={(v) => handleChange("steelDensity", v)}
 *     label="Steel Density"
 *     symbol="ρ"
 *     required
 *     unit="kg/m³"
 *   />
 */
export function GlobalReferenceInput({
  binding,
  value,
  onChange,
  label,
  symbol,
  required,
  validation,
  hint,
  confidenceLabel,
  expertMeaning,
  uncertainty,
}: GlobalReferenceInputProps & { unit?: string }) {
  const references = binding.references;

  // Confidence badge class
  const confClass = useCallback(
    (lbl?: string): string => {
      if (!lbl) return "pro-conf-approx";
      const u = lbl.toUpperCase();
      if (u === "EXACT" || u === "CERTAIN" || u === "HIGH") return "pro-conf-exact";
      if (u === "STRONG" || u === "MEDIUM") return "pro-conf-strong";
      return "pro-conf-approx";
    },
    [],
  );

  const confidenceDisplay = useMemo(() => {
    if (!confidenceLabel) return null;
    const u = confidenceLabel.toUpperCase();
    if (u === "EXACT" || u === "CERTAIN" || u === "HIGH") return "EXACT";
    if (u === "STRONG" || u === "MEDIUM") return "STRONG";
    if (u === "MODERATE") return "MODERATE";
    return "DEFAULT";
  }, [confidenceLabel]);

  const handleSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const selected = references.find(
        (r) => r.label === e.target.value,
      );
      if (selected) {
        onChange(selected.value);
      }
    },
    [references, onChange],
  );

  return (
    <div className="pro-inp-item">
      {/* Label row */}
      <div className="pro-inp-lbl">
        {label}
        {symbol && <span className="pro-sym">{symbol}</span>}
        {required && <span className="pro-req">*</span>}
        {confidenceDisplay && (
          <span className={`pro-conf-badge ${confClass(confidenceLabel)}`}>
            {confidenceDisplay}
          </span>
        )}
      </div>

      {/* Input row */}
      <div className="pro-inp-row">
        <input
          type="number"
          step="any"
          min={validation?.min}
          max={validation?.max}
          value={value === undefined || value === "" ? "" : String(value)}
          placeholder={hint || "Enter value..."}
          onChange={(e) =>
            onChange(
              e.target.value === "" ? 0 : Number(e.target.value),
            )
          }
        />
        {/* Reference preset selector */}
        <select
          className="pro-ref-preset"
          value=""
          onChange={handleSelect}
          style={{
            marginLeft: 4,
            padding: "4px 8px",
            fontSize: 11,
            borderRadius: 4,
            border: "1px solid rgba(26,25,21,0.15)",
            background: "#F5F4EF",
            color: "#1A1915",
            cursor: "pointer",
            maxWidth: 130,
          }}
        >
          <option value="">Preset...</option>
          {references.map((ref, i) => (
            <option key={i} value={ref.label}>
              {ref.label} ({ref.value} {ref.unit})
            </option>
          ))}
        </select>
      </div>

      {/* Bottom metadata */}
      <div className="pro-inp-meta">
        <span className="pro-inp-hint">
          {expertMeaning || hint || ""}
          {validation?.min !== undefined ? ` ≥${validation.min}` : ""}
          {validation?.max !== undefined ? ` ≤${validation.max}` : ""}
          {expertMeaning && " · "}
          {binding.standard && `Ref: ${binding.standard}`}
        </span>
        {uncertainty && (
          <span className="pro-inp-unc">{uncertainty}</span>
        )}
      </div>
    </div>
  );
}
