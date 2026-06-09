"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Play } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { IndustrialBadge } from "@/components/ui/industrial";
import {
  runGlobalAudit,
  type GlobalAuditResult,
} from "@/lib/os/core/audit-engine";
import { buildBenchmarkFromAudit } from "@/lib/os/core/intel-engine";
import { submitAnonymizedBenchmark } from "@/lib/os/server/submit-benchmark-pool";
import { BenchmarkPanel } from "@/components/os/BenchmarkPanel";
import {
  MANUFACTURING_OS_I18N_NS,
  SectorRegistry,
  resolveSectorParamLabel,
  resolveSectorTitle,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import { SC_NUMERIC_INPUT_CLASS } from "@/lib/input/numeric-input";
import { sanitizeNumericInput } from "@/lib/input/numeric-input";

export interface AuditInputPanelProps {
  sectorId: SectorRegistryKey;
}

function buildEmptyParamValues(sectorId: SectorRegistryKey): Record<string, string> {
  const sector = SectorRegistry[sectorId];
  return Object.fromEntries(sector.params.map((param) => [param, ""]));
}

function parseParamValues(
  params: readonly [string, string, string],
  values: Record<string, string>,
): { target: number; actual: number; cost: number } | null {
  const [targetKey, actualKey, costKey] = params;
  const target = parseFloat(values[targetKey] ?? "");
  const actual = parseFloat(values[actualKey] ?? "");
  const cost = parseFloat(values[costKey] ?? "");

  if (!Number.isFinite(target) || !Number.isFinite(actual) || !Number.isFinite(cost)) {
    return null;
  }

  return { target, actual, cost };
}

export function AuditInputPanel({ sectorId }: AuditInputPanelProps) {
  const sector = SectorRegistry[sectorId];
  const locale = useLocale();
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);

  const [values, setValues] = useState<Record<string, string>>(() =>
    buildEmptyParamValues(sectorId),
  );
  const [report, setReport] = useState<GlobalAuditResult | null>(null);
  const [benchmark, setBenchmark] = useState<{ userScore: number; industryAvg: number } | null>(
    null,
  );
  const [inputError, setInputError] = useState(false);

  const handleAudit = () => {
    const parsed = parseParamValues(sector.params, values);

    if (!parsed) {
      setInputError(true);
      setReport(null);
      setBenchmark(null);
      return;
    }

    setInputError(false);
    const result = runGlobalAudit(
      {
        ...parsed,
        tolerance: sector.defaultTolerance,
      },
      locale,
    );
    setReport(result);

    void submitAnonymizedBenchmark(buildBenchmarkFromAudit(sectorId, parsed)).then(
      (benchResult) => {
        if (benchResult.ok) {
          setBenchmark({
            userScore: benchResult.userScore,
            industryAvg: benchResult.industryAvg,
          });
        }
      },
    );
  };

  const sectorTitle = resolveSectorTitle(sector, t);
  const isCritical = report?.status === "CRITICAL";

  return (
    <div className="ind-os-panel p-6 font-sans sm:p-8">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-premium-velvet">
        {sectorTitle}
        <span className="text-body-charcoal"> · </span>
        {t("auditPanel.operationalAudit")}
      </h2>

      <div className="mb-8 mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {sector.params.map((param) => (
          <div key={param} className="flex flex-col">
            <label
              htmlFor={`audit-${sectorId}-${param}`}
              className="label-badge mb-2 text-body-charcoal"
            >
              {resolveSectorParamLabel(sector, param, t)}
            </label>
            <input
              id={`audit-${sectorId}-${param}`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              className={SC_NUMERIC_INPUT_CLASS}
              placeholder="0.00"
              value={values[param] ?? ""}
              onChange={(event) => {
                setValues((current) => ({
                  ...current,
                  [param]: sanitizeNumericInput(event.target.value),
                }));
                setInputError(false);
              }}
            />
          </div>
        ))}
      </div>

      {inputError ? (
        <p className="mb-4 text-xs text-soft-red terminal-status-crit" role="alert">
          {t("auditPanel.invalidInput")}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleAudit}
        className="ind-os-btn-action flex w-full items-center justify-center gap-2 py-4 text-sm font-semibold uppercase tracking-wider"
      >
        <Play className="h-4 w-4" aria-hidden />
        {t("auditPanel.runAudit")}
      </button>

      {report ? (
        <div className="ind-os-panel mt-8 border border-technical-gray bg-industrial-matte p-6">
          <h3 className="label-badge mb-4 text-body-charcoal">{t("auditPanel.prescription")}</h3>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <IndustrialBadge tone={isCritical ? "critical" : "stable"}>
              {report.status}
            </IndustrialBadge>
          </div>

          <div className="data-value text-lg font-bold text-premium-velvet">
            {t("auditPanel.variance")}:{" "}
            <span className="text-warn-amber">{report.variancePct}%</span>
          </div>
          <div className="data-value mt-2 text-sm text-body-charcoal">
            {t("auditPanel.financialImpact")}: {report.financialLoss}
          </div>

          <div className="mt-4 flex items-start gap-2 text-sm text-body-charcoal">
            {isCritical ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-crit-red" aria-hidden />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-safe-green" aria-hidden />
            )}
            <p>{isCritical ? t("auditPanel.critical") : t("auditPanel.stable")}</p>
          </div>

          {benchmark ? (
            <BenchmarkPanel
              userScore={benchmark.userScore}
              industryAvg={benchmark.industryAvg}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
