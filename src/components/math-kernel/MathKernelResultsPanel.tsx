"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { BoundedMetric, NpvBoundedOutput } from "@/lib/core/math/bounded-result-types";
import { BoundedResultBadge } from "./BoundedResultBadge";

// ── Props ─────────────────────────────────────────────────────────────────

interface MathKernelResultsPanelProps {
  inputs: {
    I: number;
    CF: number;
    r: number;
    n: number;
    RV: number;
  };
  currency?: string;
  onError?: (error: string) => void;
}

type LoadingState = "idle" | "loading" | "success" | "error" | "circuit_fallback";

// ── Component ─────────────────────────────────────────────────────────────

export function MathKernelResultsPanel({
  inputs,
  currency = "USD",
  onError,
}: MathKernelResultsPanelProps) {
  const [result, setResult] = useState<NpvBoundedOutput | null>(null);
  const [state, setState] = useState<LoadingState>("idle");
  const [kernelAvailable, setKernelAvailable] = useState(false);
  const [circuitInfo, setCircuitInfo] = useState<{
    retryAfterMs?: number;
    reason?: string;
  } | null>(null);

  const calculate = useCallback(async () => {
    setState("loading");
    setCircuitInfo(null);
    try {
      const response = await fetch("/api/math-kernel/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      // ── Handle 503 (Circuit Open) / 504 (Timeout) ──────────────────
      if (response.status === 503 || response.status === 504) {
        const json = await response.json().catch(() => ({}));
        setKernelAvailable(false);
        setState("circuit_fallback");
        setCircuitInfo({
          retryAfterMs: json.retry_after_ms ?? undefined,
          reason: json.error ?? "Math kernel is busy.",
        });
        onError?.(
          response.status === 503
            ? "Calculation server is busy (Circuit Open). Estimated value shown."
            : "Calculation server timed out (>3s). Estimated value shown.",
        );
        return;
      }

      const json = await response.json();

      if (!json.success) {
        setKernelAvailable(json.kernel_available);
        if (!json.kernel_available) {
          setState("circuit_fallback");
          onError?.(
            `Math kernel unavailable: ${json.error}. Using standard calculation.`,
          );
        } else {
          setState("error");
          onError?.(json.error);
        }
        return;
      }

      setKernelAvailable(true);
      setResult(json.data as NpvBoundedOutput);
      setState("success");
    } catch (err) {
      setKernelAvailable(false);
      setState("circuit_fallback");
      onError?.(
        `Failed to reach math kernel: ${err instanceof Error ? err.message : "Unknown error"}. Using standard calculation.`,
      );
    }
  }, [inputs, onError]);

  // Auto-calculate on mount
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────

  if (state === "loading") {
    return (
      <div className="math-kernel-panel loading">
        <div className="kernel-spinner" />
        <p>Calculating with verified interval arithmetic...</p>
      </div>
    );
  }

  // ── Circuit Fallback (503/504 — kernel busy, circuit open, or timeout) ──

  if (state === "circuit_fallback") {
    return (
      <div className="math-kernel-panel circuit-fallback">
        <div className="fallback-notice">
          <span className="fallback-icon">○</span>
          <div className="fallback-text">
            <strong>Calculation server is busy.</strong>{" "}
            {circuitInfo?.reason ??
              "Estimated value shown without verified error bounds."}
          </div>
        </div>
        {circuitInfo?.retryAfterMs && circuitInfo.retryAfterMs > 0 && (
          <div className="fallback-hint">
            Circuit breaker reset in{" "}
            {Math.ceil(circuitInfo.retryAfterMs / 1000)}s. Auto-retry will
            occur after recovery.
          </div>
        )}
        <p className="fallback-disclaimer">
          Results displayed below use standard float arithmetic without
          interval verification. Error margins are estimates only.
        </p>
        <button
          className="retry-button"
          onClick={calculate}
          type="button"
        >
          Retry with verified arithmetic
        </button>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────

  if (state === "error") {
    return (
      <div className="math-kernel-panel error">
        <div className="error-notice">
          <span className="error-icon">✕</span>
          <span>Calculation failed. Please verify inputs and try again.</span>
        </div>
        <button
          className="retry-button"
          onClick={calculate}
          type="button"
        >
          Retry calculation
        </button>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────

  if (!result) {
    return null;
  }

  const decisionLabels: Record<number, { label: string; className: string }> = {
    0: { label: "PASS — Accept investment", className: "decision-pass" },
    1: { label: "REVIEW — NPV positive but IRR low", className: "decision-review" },
    2: { label: "HOLD — NPV negative", className: "decision-hold" },
  };

  const decisionInfo = decisionLabels[Math.round(result.decision.value)] ?? {
    label: `Unknown (${result.decision.value})`,
    className: "decision-unknown",
  };

  return (
    <div className="math-kernel-panel success">
      <div className="kernel-header">
        <h3 className="kernel-title">Verified Bounded Results</h3>
        <span className="kernel-badge">Interval Arithmetic</span>
      </div>

      {/* Decision Banner */}
      <div className={`decision-banner ${decisionInfo.className}`}>
        <span className="decision-text">{decisionInfo.label}</span>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <BoundedResultBadge
          metric={result.npv}
          label="Net Present Value (NPV)"
          currency={currency}
          format="currency"
        />
        <BoundedResultBadge
          metric={result.irr}
          label="Internal Rate of Return (IRR)"
          format="percent"
        />
        <BoundedResultBadge
          metric={result.payback_years}
          label="Payback Period"
          format="years"
        />
        <BoundedResultBadge
          metric={result.profitability_index}
          label="Profitability Index"
          format="ratio"
        />
        <BoundedResultBadge
          metric={result.expanded_uncertainty}
          label="Expanded Uncertainty"
          currency={currency}
          format="currency"
        />
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="warnings-section">
          <h4>Warnings</h4>
          <ul>
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation */}
      <div className="kernel-explanation">
        <p>
          <strong>How to read this:</strong> Each metric shows a{" "}
          <strong>verified range</strong>{" "}
          <code>[lower_bound, upper_bound]</code> that is mathematically
          guaranteed to contain the true real-valued result. The{" "}
          <strong>± error margin</strong> is half the interval width (maximum
          ULP error). This follows IEEE 754 interval arithmetic standards
          (C-XSC compatible).
        </p>
      </div>

      <button
        className="recalculate-button"
        onClick={calculate}
        type="button"
      >
        Recalculate
      </button>
    </div>
  );
}
