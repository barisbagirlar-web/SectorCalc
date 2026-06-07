"use client";

import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { IndustrialBadge, IndustrialMetric } from "@/components/ui/industrial";
import { runGlobalAudit, type AuditInput } from "@/lib/os/core/audit-engine";
import {
  MANUFACTURING_OS_I18N_NS,
  SectorRegistry,
  resolveSectorTitle,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";

export interface TerminalDashboardProps {
  sectorId: SectorRegistryKey;
  locale?: string;
  /** Form bağlantısı için — verilmezse demo değerler kullanılır. */
  metrics?: AuditInput;
}

const DEMO_METRICS: AuditInput = {
  target: 100,
  actual: 112,
  cost: 50,
  tolerance: 0.05,
};

function formatAuditTimestamp(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleString(locale, {
      dateStyle: "short",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export const TerminalDashboard = ({
  sectorId = "cnc",
  locale = "en-US",
  metrics = DEMO_METRICS,
}: TerminalDashboardProps) => {
  const sector = SectorRegistry[sectorId];
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);

  const auditInput: AuditInput = {
    ...metrics,
    tolerance: metrics.tolerance ?? sector.defaultTolerance,
  };

  const auditResult = runGlobalAudit(auditInput, locale);
  const sectorTitle = resolveSectorTitle(sector, t);
  const isCritical = auditResult.status === "CRITICAL";

  return (
    <div className="ind-terminal w-full p-8">
      <div className="ind-terminal-header">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-bold uppercase tracking-wider text-amber">
            {sectorTitle}
          </h1>
          <p className="font-mono text-xs text-white/75">
            OS_VERSION: 1.0.0 · UNIT: {sector.unitType.toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs text-white/75">
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
            LAST AUDIT
          </div>
          <div className="mt-1 font-mono text-sm font-semibold text-emerald-400">
            {formatAuditTimestamp(auditResult.timestamp, locale)}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <IndustrialBadge tone={isCritical ? "critical" : "stable"}>
          {auditResult.status}
        </IndustrialBadge>
        <IndustrialBadge tone="neutral">MONITORING</IndustrialBadge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <IndustrialMetric label="Variance Rate" value={`${auditResult.variancePct}%`} />
        <IndustrialMetric
          label="Financial Impact"
          value={auditResult.financialLoss}
          tone="amber"
        />
        <IndustrialMetric
          label="System Status"
          value={auditResult.status}
          tone={isCritical ? "critical" : "stable"}
        />
      </div>

      <div className="mt-6 border-t border-premium pt-6">
        <h3 className="ind-mono-label mb-2 text-white/75">Prescriptive Audit</h3>
        <div className="flex gap-3">
          {isCritical ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
          )}
          <p className="text-sm italic leading-relaxed text-white/85">
            {isCritical
              ? "CRITICAL DRIFT DETECTED: Review operational parameters immediately."
              : "OPERATIONAL STABILITY: Efficiency standards maintained."}
          </p>
        </div>
      </div>
    </div>
  );
};
