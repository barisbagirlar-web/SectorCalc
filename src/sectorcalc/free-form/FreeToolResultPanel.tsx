// SectorCalc — Universal Free Tool Result Panel (V5.4)
// Single presenter for all Free tool results. Replaces inline result rendering.
// Props-driven: no dependency on form state or tool-specific logic.

"use client";

import { resolveDecisionState, type DecisionStateInput } from "./freeDecisionState";
import {
  formatPrimaryResult,
  formatSummary,
  formatComparison,
} from "./freeResultText";

export interface ComparisonData {
  current: number;
  calculated: number;
  unit?: string;
  currentLabel: string;
  calculatedLabel: string;
}

export interface FreeToolResultPanelProps {
  /** Tool display title */
  toolTitle: string;
  /** Tool category */
  category: string;
  /** Primary result label (e.g. "Required shop hourly rate") */
  primaryLabel: string;
  /** Primary result numeric value */
  primaryValue: number | string;
  /** Primary result unit (e.g. "$/hour") */
  primaryUnit?: string;
  /** Forced decision state (overrides auto-resolve). Empty string = auto-resolve */
  decisionState?: string;
  /** Forced decision severity */
  decisionSeverity?: "info" | "success" | "warning" | "danger";
  /** Business summary sentence. Empty = auto-generate */
  summary?: string;
  /** Optional comparison data */
  comparison?: ComparisonData;
  /** Warning messages */
  warnings?: string[];
  /** Assumption notes */
  assumptions?: string[];
  /** Whether the calculation is valid */
  isValid: boolean;
  /** Raw current value for auto decision state resolver */
  currentValue?: number;
  /** Current value label */
  currentLabel?: string;
  /** Whether positive result is expected */
  positiveExpected?: boolean;
}

/**
 * Universal Free Tool Result Panel.
 *
 * Renders in a structured card layout:
 * 1. Status badge ("Calculation complete")
 * 2. Primary KPI card (large value + unit)
 * 3. Decision state card (prominent, never "—")
 * 4. Business summary sentence
 * 5. Comparison strip (if comparator exists)
 * 6. Warning strip (if applicable)
 */
export function FreeToolResultPanel(props: FreeToolResultPanelProps) {
  const {
    toolTitle,
    primaryLabel,
    primaryValue,
    primaryUnit,
    decisionState: forcedDecisionState,
    decisionSeverity: forcedSeverity,
    summary: forcedSummary,
    comparison: comparisonData,
    warnings = [],
    isValid,
    currentValue,
    currentLabel,
  } = props;

  // ── Decision state ──
  const numericValue =
    typeof primaryValue === "number" && Number.isFinite(primaryValue)
      ? primaryValue
      : NaN;

  const dsInput: DecisionStateInput = {
    calculatedValue: numericValue,
    currentValue:
      currentValue !== undefined
        ? currentValue
        : comparisonData?.current,
    currentLabel: currentLabel || comparisonData?.currentLabel,
    positiveExpected: props.positiveExpected,
    isValid: isValid && Number.isFinite(numericValue),
  };
  const autoDs = resolveDecisionState(dsInput);
  const dsState = forcedDecisionState || autoDs.state;
  const dsSeverity = forcedSeverity || autoDs.severity;

  // ── Primary formatted display ──
  const primaryDisplay =
    typeof primaryValue === "number" && Number.isFinite(primaryValue)
      ? formatPrimaryResult({
          label: primaryLabel,
          value: primaryValue,
          unit: primaryUnit,
        })
      : String(primaryValue);

  // ── Summary ──
  const summary =
    forcedSummary ||
    (Number.isFinite(numericValue)
      ? formatSummary({
          calculated: numericValue,
          current:
            currentValue !== undefined
              ? currentValue
              : comparisonData?.current,
          unit: primaryUnit,
          resultLabel: primaryLabel,
          currentLabel:
            currentLabel ||
            comparisonData?.currentLabel ||
            "Current value",
        })
      : "");

  // ── Comparison ──
  const comp = comparisonData;

  // ── Severity color class ──
  const severityClass =
    dsSeverity === "danger"
      ? "frp-severity-danger"
      : dsSeverity === "warning"
        ? "frp-severity-warning"
        : dsSeverity === "success"
          ? "frp-severity-success"
          : "frp-severity-info";

  return (
    <section className="free-result-panel" aria-label={`${toolTitle} result`}>
      {/* Status badge */}
      <div className="frp-status">
        <span className="frp-status-icon">&#10003;</span>
        Calculation complete
      </div>

      {/* Primary + Decision grid */}
      <div className="frp-grid">
        {/* Primary KPI card */}
        <div className="frp-primary-card">
          <span className="frp-label">{primaryLabel}</span>
          <strong className="frp-primary-value">{primaryDisplay}</strong>
        </div>

        {/* Decision state card */}
        <div className={`frp-decision-card ${severityClass}`}>
          <span className="frp-label">Decision state</span>
          <strong className="frp-decision-value">{dsState}</strong>
          {autoDs.reason && (
            <span className="frp-decision-reason">{autoDs.reason}</span>
          )}
        </div>
      </div>

      {/* Business summary */}
      {summary && <p className="frp-summary">{summary}</p>}

      {/* Comparison strip */}
      {comp && (
        <div className="frp-comparison">
          <div className="frp-comparison-row">
            <span className="frp-comp-label">{comp.currentLabel}:</span>
            <span className="frp-comp-value">
              {formatPrimaryResult({
                label: comp.currentLabel,
                value: comp.current,
                unit: comp.unit,
              })}
            </span>
          </div>
          <div className="frp-comparison-row">
            <span className="frp-comp-label">{comp.calculatedLabel}:</span>
            <span className="frp-comp-value">
              {formatPrimaryResult({
                label: comp.calculatedLabel,
                value: comp.calculated,
                unit: comp.unit,
              })}
            </span>
          </div>
          <div className="frp-comparison-row frp-comp-highlight">
            <span className="frp-comp-label">Hourly surplus:</span>
            <span className="frp-comp-value">
              {formatPrimaryResult({
                label: "Hourly surplus",
                value: comp.current - comp.calculated,
                unit: comp.unit,
              })}
            </span>
          </div>
          <div className="frp-comparison-row frp-comp-highlight">
            <span className="frp-comp-label">Margin on current rate:</span>
            <span className="frp-comp-value">
              {comp.calculated !== 0
                ? `${(
                    ((comp.current - comp.calculated) / comp.calculated) *
                    100
                  ).toFixed(2)}%`
                : "—"}
            </span>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="frp-warnings">
          {warnings.map((w, i) => (
            <p key={i} className="frp-warning-item">
              {w}
            </p>
          ))}
        </div>
      )}

      {/* Default disclaimer when no tool-specific warnings */}
      {warnings.length === 0 && (
        <div className="frp-warnings">
          <p className="frp-warning-item">
            Use this result for early screening only. Verify inputs before
            quoting, production planning, or customer pricing.
          </p>
        </div>
      )}
    </section>
  );
}
