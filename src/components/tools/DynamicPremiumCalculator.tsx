"use client";

import { useMemo, useState, type FormEvent } from "react";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import type {
  PremiumCalculatorSchema,
  SchemaInputValues,
  ThresholdSeverity,
} from "@/lib/premium-schema/premium-calculator-schema";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  worstThresholdSeverity,
} from "@/lib/premium-schema/premium-schema-engine";
import { handleNumericInputChange } from "@/lib/input/numeric-input";

const STRIP_CLASS: Record<ThresholdSeverity, string> = {
  ok: "sc-ledger-threshold sc-risk-strip sc-risk-strip--safe",
  warning: "sc-ledger-threshold sc-risk-strip sc-risk-strip--watch",
  critical: "sc-ledger-threshold sc-risk-strip sc-risk-strip--danger",
};

function primaryAlertMessage(
  severity: ThresholdSeverity,
  suggestedAction: string
): string {
  if (severity === "critical" || severity === "warning") {
    return suggestedAction;
  }
  return "Current inputs are inside the acceptable range.";
}

export interface DynamicPremiumCalculatorProps {
  schema: PremiumCalculatorSchema;
}

/**
 * Karar Masası — schema-driven premium UI. Renders only; math in Safe Formula Registry.
 */
export function DynamicPremiumCalculator({ schema }: DynamicPremiumCalculatorProps) {
  const [values, setValues] = useState<SchemaInputValues>(() => buildDefaultSchemaInputs(schema));
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }
    return runPremiumSchemaEngine(schema, values);
  }, [submitted, schema, values]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const severity = result ? worstThresholdSeverity(result.thresholdAlerts) : "ok";

  return (
    <div className="sc-ledger-karar-masasi mt-4">
      {/* Panel 1 — Ledger entries (boxed inputs) */}
      <form
        onSubmit={handleSubmit}
        className="sc-ledger-karar-masasi__entries sc-industrial-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-4 sm:p-5"
        noValidate
      >
        <p className="sc-ledger-eyebrow">Ledger entries</p>
        <h2 className="mt-1 text-base font-semibold text-premium-velvet">{schema.name}</h2>
        <hr className="sc-ledger-divider" />

        {schema.inputs.map((input) => {
          const id = `schema-input-${schema.id}-${input.id}`;
          const value = values[input.id];

          if (input.type === "select" && input.options) {
            return (
              <div key={input.id} className="sc-industrial-field sc-industrial-field--full">
                <div className="sc-industrial-field__label-row">
                  <label htmlFor={id} className="sc-ledger-label sc-industrial-field__label">
                    {input.label}
                  </label>
                  {input.unit ? (
                    <span className="sc-industrial-field__unit">{input.unit}</span>
                  ) : null}
                </div>
                <select
                  id={id}
                  value={String(value ?? "")}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, [input.id]: e.target.value }));
                    setSubmitted(false);
                  }}
                  className="sc-ledger-input-boxed"
                >
                  {input.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="sc-ledger-helper sc-industrial-field__helper">{input.helper}</p>
              </div>
            );
          }

          if (input.type === "boolean") {
            return (
              <div key={input.id} className="sc-industrial-field sc-industrial-field--full">
                <label className="flex min-h-[44px] items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, [input.id]: e.target.checked }));
                      setSubmitted(false);
                    }}
                  />
                  <span className="text-sm text-premium-velvet">{input.label}</span>
                </label>
                <p className="sc-ledger-helper sc-industrial-field__helper">{input.helper}</p>
              </div>
            );
          }

          return (
            <div key={input.id} className="sc-industrial-field sc-industrial-field--full">
              <div className="sc-industrial-field__label-row">
                <label htmlFor={id} className="sc-ledger-label sc-industrial-field__label">
                  {input.label}
                </label>
                {input.unit ? (
                  <span className="sc-industrial-field__unit">{input.unit}</span>
                ) : null}
              </div>
              <input
                id={id}
                type={input.type === "slider" ? "range" : "text"}
                inputMode="decimal"
                min={input.validation?.min}
                max={input.validation?.max}
                step={input.validation?.step}
                value={String(value ?? "")}
                onChange={(e) => {
                  if (input.type === "slider") {
                    setValues((prev) => ({ ...prev, [input.id]: Number(e.target.value) }));
                  } else {
                    const { numeric } = handleNumericInputChange(e.target.value);
                    setValues((prev) => ({ ...prev, [input.id]: numeric }));
                  }
                  setSubmitted(false);
                }}
                className="sc-ledger-input-boxed sc-industrial-input"
              />
              <p className="sc-ledger-helper sc-industrial-field__helper">{input.helper}</p>
            </div>
          );
        })}

        <div className="sc-industrial-form-actions">
          <button type="submit" className="sc-ledger-cta-primary sc-cta-primary">
            Run analysis
          </button>
        </div>
      </form>

      {/* Panel 2 — Big number + threshold */}
      <div className="sc-ledger-karar-masasi__big-number min-w-0" aria-live="polite">
        {result ? (
          <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress">
            <div className={STRIP_CLASS[severity]}>
              {severity === "ok"
                ? "Within acceptable range"
                : severity === "critical"
                  ? "High risk — review before committing"
                  : "Watch band — tolerance pressure"}
            </div>
            <div className="sc-premium-report-section">
              <p className="sc-premium-report-section__title">{result.bigNumber.label}</p>
              <LedgerNumberTick
                value={result.bigNumber.formatted}
                className="sc-ledger-big-number sc-result-primary mt-1"
              />
            </div>
            <div className="sc-decision-block m-4 mt-0 sc-ledger-karar-masasi__alert">
              <p className="sc-decision-block__title">Do now</p>
              <p className="sc-decision-block__body">
                {primaryAlertMessage(severity, result.suggestedAction)}
              </p>
            </div>
          </div>
        ) : (
          <div className="sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-5">
            <p className="sc-ledger-eyebrow">Karar masası</p>
            <p className="mt-2 text-sm text-body-charcoal">{schema.painStatement}</p>
            <p className="mt-4 text-sm text-body-charcoal">
              Enter ledger entries and run the analysis.
            </p>
          </div>
        )}
      </div>

      {/* Panel 3 — Report preview */}
      <div className="sc-ledger-karar-masasi__report min-w-0">
        {result ? (
          <details className="sc-ledger-panel sc-industrial-panel sc-ledger-letterpress" open>
            <summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-wider text-body-charcoal">
              Decision report
            </summary>
            <div className="space-y-4 border-t border-technical-gray p-4">
              <p className="text-xs text-body-charcoal">
                P90 {result.p90ExposureFormatted} · Floor {result.minimumSafePriceFormatted}
              </p>
              {result.thresholdAlerts.length > 0 ? (
                <ul className="space-y-2">
                  {result.thresholdAlerts.map((alert) => (
                    <li
                      key={`${alert.fieldId}-${alert.severity}`}
                      className={`text-sm ${alert.severity === "critical" ? "text-crit-red" : "text-warn-amber"}`}
                    >
                      {alert.message}
                    </li>
                  ))}
                </ul>
              ) : null}
              <dl className="sc-result-secondary-grid">
                {result.outputs
                  .filter((o) => !o.isBigNumber)
                  .map((output) => (
                    <div key={output.id}>
                      <dt>{output.label}</dt>
                      <dd>{output.formatted}</dd>
                    </div>
                  ))}
              </dl>
              {result.reportSections.map((section) => (
                <div key={section.id}>
                  <p className="sc-premium-report-section__title">{section.title}</p>
                  <p className="mt-1 text-sm text-body-charcoal">{section.body}</p>
                </div>
              ))}
              <p className="text-xs text-body-charcoal">{result.legalNote}</p>
            </div>
          </details>
        ) : (
          <aside className="sc-ledger-panel sc-industrial-panel p-4 sm:p-5">
            <p className="sc-ledger-eyebrow">{schema.category}</p>
            <p className="mt-2 text-xs text-body-charcoal">Sector: {schema.sectorSlug}</p>
          </aside>
        )}
      </div>
    </div>
  );
}
