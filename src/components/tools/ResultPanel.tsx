"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  calculateCBAM,
  resolveCarbonEmissionsKg,
  schemaCbamEnabled,
} from "@/lib/cbam/compliance";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import { resolveGeneratedBreakdownLabel } from "@/lib/generated-tools/resolve-generated-display-text";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import {
  resolveBreakdownOutputUnit,
  resolvePrimaryOutputUnit,
} from "@/lib/generated-tools/resolve-output-unit";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";
import type { FeedbackSnapshotValue } from "@/lib/feedback/types";
import { buildQrCodeImageUrl } from "@/lib/trust-trace/verification";

type ApprovedReportApiResponse =
  | {
      readonly ok: true;
      readonly reportId: string;
      readonly calculationHash: string;
      readonly verifyUrl: string;
      readonly validationStampId: string;
    }
  | {
      readonly ok: false;
      readonly error?: string;
    };

export type ResultPanelProps = {
  readonly result: GeneratedToolResult | null;
  readonly schema: GeneratedToolSchema;
  readonly locale: string;
  readonly primaryOutputKey: string;
  readonly titleLabel: string;
  readonly emptyLabel: string;
  readonly loading?: boolean;
  readonly statusLabel?: string;
  readonly toolSlug?: string;
  readonly userId?: string | null;
  readonly enableEnterpriseActions?: boolean;
  readonly routePath?: string;
  readonly toolType?: "free" | "premium";
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
};

function resolvePrimaryNumericValue(
  result: GeneratedToolResult,
  primaryOutputKey: string,
): number | null {
  const candidates = [
    result[primaryOutputKey],
    result.totalWasteCost,
    result.dataConfidenceAdjusted,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }
  return null;
}

function formatPrimaryDisplayValue(
  value: number,
  primaryOutputKey: string,
  unit: string,
  locale: string,
): string {
  if (unit === "%") {
    const asFraction = Math.abs(value) > 1 ? value / 100 : value;
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(asFraction);
  }

  if (unit === "USD" || unit === "EUR" || unit === "TRY") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: unit,
      maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
    }).format(value);
  }

  if (unit && unit !== "—") {
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
    }).format(value);
    return `${formatted} ${unit}`;
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value);
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toSerializableSnapshot(
  snapshot: Readonly<Record<string, FeedbackSnapshotValue>> | undefined,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!snapshot) {
    return out;
  }
  for (const [key, value] of Object.entries(snapshot)) {
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
      out[key] = value;
    }
  }
  return out;
}

async function registerApprovedReport(input: {
  toolSlug: string;
  locale: string;
  routePath: string;
  toolType: "free" | "premium";
  userId?: string | null;
  inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  result: GeneratedToolResult;
}): Promise<ApprovedReportApiResponse> {
  const response = await fetch("/api/reports/approved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      toolSlug: input.toolSlug,
      locale: input.locale,
      routePath: input.routePath,
      toolType: input.toolType,
      userId: input.userId ?? null,
      inputSnapshot: toSerializableSnapshot(input.inputSnapshot),
      resultSnapshot: toSerializableSnapshot(
        Object.fromEntries(
          Object.entries(input.result).filter(
            ([, value]) =>
              typeof value === "number" || typeof value === "boolean" || typeof value === "string",
          ),
        ) as Record<string, FeedbackSnapshotValue>,
      ),
    }),
  });

  const body = (await response.json()) as ApprovedReportApiResponse;
  if (!response.ok || !body.ok) {
    return { ok: false, error: "create_failed" };
  }
  return body;
}

export function ResultPanel({
  result,
  schema,
  locale,
  primaryOutputKey,
  titleLabel,
  emptyLabel,
  loading = false,
  statusLabel,
  toolSlug,
  userId,
  enableEnterpriseActions,
  routePath,
  toolType = "premium",
  inputSnapshot,
}: ResultPanelProps) {
  const [exportBusy, setExportBusy] = useState(false);
  const [erpBusy, setErpBusy] = useState(false);

  const showEnterpriseActions =
    enableEnterpriseActions ?? schema.premiumRequired === true;

  const carbonEmissionsKg = useMemo(
    () => (result ? resolveCarbonEmissionsKg(result as Record<string, unknown>) : null),
    [result],
  );

  const cbamReport = useMemo(() => {
    if (!carbonEmissionsKg) {
      return null;
    }
    const carbonTool =
      schemaCbamEnabled(schema) || /carbon|co2|emission|cbam/i.test(schema.toolName);
    if (!carbonTool) {
      return null;
    }
    return calculateCBAM(carbonEmissionsKg, "DE");
  }, [carbonEmissionsKg, schema]);

  async function handleExportPDF() {
    if (!result) {
      return;
    }

    setExportBusy(true);
    try {
      const slug = toolSlug ?? schema.toolName;
      let hash = "";
      let verifyUrl = "";
      let reportId: string | null = null;
      let validationStampId: string | null = null;

      if (routePath) {
        const registered = await registerApprovedReport({
          toolSlug: slug,
          locale,
          routePath,
          toolType,
          userId,
          inputSnapshot,
          result,
        });
        if (registered.ok) {
          hash = registered.calculationHash;
          verifyUrl = registered.verifyUrl;
          reportId = registered.reportId;
          validationStampId = registered.validationStampId;
        }
      }

      const qrImageUrl = hash ? buildQrCodeImageUrl(verifyUrl, 140) : "";
      const primaryValue = resolvePrimaryNumericValue(result, primaryOutputKey);
      const unit = resolvePrimaryOutputUnit(schema);
      const primaryDisplay =
        primaryValue !== null
          ? formatPrimaryDisplayValue(primaryValue, primaryOutputKey, unit, locale)
          : "—";

      const html =
        "<!DOCTYPE html><html><head><meta charset='UTF-8' />" +
        `<title>${translateCalculatorPhrase("SectorCalc Calculation Report", locale)}</title>` +
        "<style>body{font-family:system-ui,sans-serif;padding:24px;color:#111}" +
        ".stamp{display:inline-block;background:#f0fdf4;color:#15803d;border:1px solid #86efac;border-radius:4px;padding:2px 10px;font-size:12px;font-weight:600}" +
        ".trust{display:flex;gap:16px;align-items:flex-start;margin:16px 0;padding:12px;border:1px solid #e5e7eb;border-radius:8px}" +
        "table{border-collapse:collapse;width:100%;margin-top:12px}td,th{border:1px solid #e5e7eb;padding:6px 8px;text-align:left;font-size:13px}" +
        "th{background:#f9fafb}.mono{font-family:monospace;font-size:11px;word-break:break-all}</style></head><body>" +
        `<h1>${translateCalculatorPhrase("SectorCalc Calculation Report", locale)}</h1>` +
        `<p><span class='stamp'>${translateCalculatorPhrase("Trust Trace", locale)}</span></p>` +
        `<p><strong>${translateCalculatorPhrase("Tool:", locale)}</strong> ${escapeHtml(slug)}</p>` +
        (reportId
          ? `<p><strong>${translateCalculatorPhrase("Report ID:", locale)}</strong> <span class='mono'>${escapeHtml(reportId)}</span></p>`
          : "") +
        (validationStampId
          ? `<p><strong>${translateCalculatorPhrase("Validation Stamp:", locale)}</strong> <span class='mono'>${escapeHtml(validationStampId)}</span></p>`
          : "") +
        `<p><strong>${translateCalculatorPhrase("Primary Result:", locale)}</strong> ${escapeHtml(primaryDisplay)}</p>` +
        (hash
          ? `<div class='trust'><img src='${escapeHtml(qrImageUrl)}' alt='${translateCalculatorPhrase("Verify QR Code", locale)}' width='140' height='140' />` +
            `<div><p><strong>${translateCalculatorPhrase("Verification Hash", locale)}</strong></p><p class='mono'>${escapeHtml(hash)}</p>` +
            `<p><a href='${escapeHtml(verifyUrl)}'>${escapeHtml(verifyUrl)}</a></p>` +
            (reportId
              ? `<p style='font-size:12px;margin-top:8px'>${translateCalculatorPhrase("Verify with Report ID at", locale)} ${escapeHtml(typeof window !== "undefined" ? `${window.location.origin}/verify` : "/verify")}</p>`
              : "") +
            `</div></div>`
          : "") +
        (cbamReport
          ? `<h2>${translateCalculatorPhrase("CBAM", locale)}</h2><table><tr><th>${translateCalculatorPhrase("Metric", locale)}</th><th>${translateCalculatorPhrase("Value", locale)}</th></tr>` +
            `<tr><td>${translateCalculatorPhrase("Product Carbon Footprint", locale)}</td><td>${cbamReport.productCarbonFootprint.toFixed(2)} kg CO2e</td></tr>` +
            `<tr><td>${translateCalculatorPhrase("CBAM Adjustment", locale)}</td><td>€${cbamReport.cbamAdjustment.toFixed(2)}</td></tr>` +
            `<tr><td>${translateCalculatorPhrase("Status", locale)}</td><td>${escapeHtml(translateCalculatorPhrase(cbamReport.complianceStatus, locale))}</td></tr></table>`
          : "") +
        `<p style='font-size:11px;color:#6b7280;margin-top:24px'>${translateCalculatorPhrase("Technical simulation only. Not financial, legal, or engineering advice.", locale)}</p>` +
        "</body></html>";

      downloadBlob(
        html,
        `sectorcalc-${toolSlug ?? schema.toolName}-report.html`,
        "text/html;charset=utf-8",
      );
    } finally {
      setExportBusy(false);
    }
  }

  async function handleSendToERP() {
    if (!result) {
      return;
    }

    const webhookUrl = window.prompt(translateCalculatorPhrase("Enter ERP Webhook URL", locale));
    if (!webhookUrl) {
      return;
    }

    setErpBusy(true);
    try {
      const response = await fetch("/api/external/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId ?? null,
          toolSlug: toolSlug ?? schema.toolName,
          result,
          webhookUrl,
        }),
      });

      window.alert(
        response.ok
          ? translateCalculatorPhrase("Sent to ERP", locale)
          : translateCalculatorPhrase("Send failed", locale),
      );
    } catch {
      window.alert(translateCalculatorPhrase("Send failed", locale));
    } finally {
      setErpBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
        <div className="sc-premium-dtf-result">
          <div className="animate-pulse space-y-2">
            <div className="mx-auto h-4 w-20 rounded bg-gray-200" />
            <div className="mx-auto h-10 w-28 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
        <div className="sc-premium-dtf-result">
          <div className="sc-premium-dtf-result__title">{emptyLabel}</div>
        </div>
      </div>
    );
  }

  const primaryValue = resolvePrimaryNumericValue(result, primaryOutputKey);
  const unit = resolvePrimaryOutputUnit(schema);
  const formattedPrimary =
    primaryValue !== null
      ? formatPrimaryDisplayValue(primaryValue, primaryOutputKey, unit, locale)
      : null;
  const breakdown = result.breakdown ?? null;

  let breakdownSection: ReactNode = null;
  if (breakdown && Object.keys(breakdown).length > 0) {
    breakdownSection = (
      <div className="sc-premium-dtf-result__breakdown">
        {Object.entries(breakdown).map(([key, value]) => {
          if (typeof value !== "number" || !Number.isFinite(value)) {
            return null;
          }
          const breakdownUnit = resolveBreakdownOutputUnit(schema, key);
          const label = resolveGeneratedBreakdownLabel(key, schema.outputs.breakdown, locale);
          const formattedValue = formatGeneratedNumericValue(value, key, locale, breakdownUnit);
          return (
            <div key={key}>
              <span>{label}</span>
              <span>{formattedValue}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (formattedPrimary === null) {
    return (
      <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
        <div className="sc-premium-dtf-result">
          <div className="sc-premium-dtf-result__title">{emptyLabel}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
      <div className="sc-premium-dtf-result sc-premium-dtf-result--pass">
        <div className="sc-premium-dtf-result__title">{titleLabel}</div>
        <div className="sc-premium-dtf-result__value sc-result-nowrap result-value">{formattedPrimary}</div>
        {statusLabel ? (
          <div className="sc-premium-dtf-result__status">{statusLabel}</div>
        ) : null}
        {breakdownSection}
        {cbamReport ? (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm">
            <p className="font-semibold text-slate-800">
              {translateCalculatorPhrase("CBAM Compliance Summary", locale)}
            </p>
            <dl className="mt-2 space-y-1 text-slate-600">
              <div className="flex justify-between gap-3">
                <dt>{translateCalculatorPhrase("Carbon Footprint", locale)}</dt>
                <dd className="sc-result-nowrap">{cbamReport.productCarbonFootprint.toFixed(0)} kg CO2e</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{translateCalculatorPhrase("CBAM Adjustment", locale)}</dt>
                <dd className="sc-result-nowrap">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(cbamReport.cbamAdjustment)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{translateCalculatorPhrase("Status", locale)}</dt>
                <dd className="sc-result-nowrap capitalize">{translateCalculatorPhrase(cbamReport.complianceStatus, locale)}</dd>
              </div>
            </dl>
            {cbamReport.recommendations.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-500">
                {cbamReport.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        {showEnterpriseActions ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleExportPDF()}
              disabled={exportBusy}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {exportBusy
                ? translateCalculatorPhrase("Preparing PDF…", locale)
                : translateCalculatorPhrase("Download PDF", locale)}
            </button>
            <button
              type="button"
              onClick={() => void handleSendToERP()}
              disabled={erpBusy}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {erpBusy
                ? translateCalculatorPhrase("Sending…", locale)
                : translateCalculatorPhrase("Send to ERP", locale)}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
