"use client";

import React from "react";
import type { BoundedMetric } from "@/lib/core/math/bounded-result-types";

// ── Props ─────────────────────────────────────────────────────────────────

interface BoundedResultBadgeProps {
  metric: BoundedMetric;
  label: string;
  currency?: string;
  format?: "currency" | "percent" | "ratio" | "years" | "decimal";
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  TRY: "₺",
};

function formatValue(value: number, format: string, currency: string): string {
  switch (format) {
    case "currency": {
      const sym = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
      const abs = Math.abs(value);
      return `${value < 0 ? "-" : ""}${sym}${abs.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    case "percent":
      return `${(value * 100).toFixed(2)}%`;
    case "years":
      return `${value.toFixed(2)} yrs`;
    case "ratio":
      return value.toFixed(4);
    default:
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      });
  }
}

function getStatusClass(status: string): string {
  if (status.startsWith("ERROR")) return "status-error";
  if (status === "WIDE_INTERVAL") return "status-warning";
  if (status === "FALLBACK_ESTIMATE") return "status-fallback";
  return "status-verified";
}

function getStatusIcon(status: string): string {
  if (status.startsWith("ERROR")) return "✕";
  if (status === "WIDE_INTERVAL") return "⚠";
  if (status === "FALLBACK_ESTIMATE") return "○";
  return "●";
}

// ── Component ─────────────────────────────────────────────────────────────

export function BoundedResultBadge({
  metric,
  label,
  currency = "USD",
  format = "currency",
  className = "",
}: BoundedResultBadgeProps) {
  const statusClass = getStatusClass(metric.status);
  const statusIcon = getStatusIcon(metric.status);

  return (
    <div className={`bounded-result-badge ${statusClass} ${className}`}>
      <div className="badge-header">
        <span className="badge-label">{label}</span>
        <span className={`badge-status ${statusClass}`} title={metric.status}>
          {statusIcon} {metric.status === "VERIFIED" ? "Verified" : metric.status === "WIDE_INTERVAL" ? "Wide" : metric.status === "FALLBACK_ESTIMATE" ? "Estimate" : "Error"}
        </span>
      </div>

      <div className="badge-value">
        {formatValue(metric.value, format, currency)}
      </div>

      <div className="badge-interval">
        <span className="interval-label">Guaranteed range:</span>
        <span className="interval-range">
          [{formatValue(metric.lower_bound, format, currency)},{" "}
          {formatValue(metric.upper_bound, format, currency)}]
        </span>
      </div>

      <div className="badge-error-margin">
        <span className="margin-label">± Error margin:</span>
        <span className="margin-value">
          {formatValue(metric.ulp_error_margin, format, currency)}
        </span>
      </div>
    </div>
  );
}
