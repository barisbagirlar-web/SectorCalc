"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import { useRegion } from "@/lib/features/compliance/region-context";
import { runIndustrialAudit } from "@/lib/os/core/master-os";
import type { GlobalAuditResult } from "@/lib/os/core/audit-engine";
import type { SectorIntelligenceResult } from "@/lib/os/core/intelligence-layer";
import { buildBenchmarkFromAudit } from "@/lib/os/core/intel-engine";
import { submitAnonymizedBenchmark } from "@/lib/os/server/submit-benchmark-pool";
import {
  MANUFACTURING_OS_I18N_NS,
  SectorRegistry,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";

export type ParsedAuditMetrics = {
  target: number;
  actual: number;
  cost: number;
};

export function parseSectorParamValues(
  params: readonly [string, string, string],
  values: Record<string, number>,
): ParsedAuditMetrics | null {
  const [targetKey, actualKey, costKey] = params;
  const target = values[targetKey];
  const actual = values[actualKey];
  const cost = values[costKey];

  if (!Number.isFinite(target) || !Number.isFinite(actual) || !Number.isFinite(cost)) {
    return null;
  }

  return { target, actual, cost };
}

export function useOperationalAudit(sectorId: SectorRegistryKey) {
  const sector = SectorRegistry[sectorId];
  const locale = useLocale();
  const { region } = useRegion();
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);

  const [report, setReport] = useState<GlobalAuditResult | null>(null);
  const [benchmark, setBenchmark] = useState<{ userScore: number; industryAvg: number } | null>(
    null,
  );
  const [intelligence, setIntelligence] = useState<SectorIntelligenceResult | null>(null);
  const [inputError, setInputError] = useState(false);

  const runAudit = useCallback(
    (values: Record<string, number>) => {
      const parsed = parseSectorParamValues(sector.params, values);

      if (!parsed) {
        setInputError(true);
        setReport(null);
        setBenchmark(null);
        setIntelligence(null);
        return false;
      }

      try {
        setInputError(false);
        const master = runIndustrialAudit(sectorId, parsed, locale, region);

        setReport({
          variancePct: master.variancePct,
          financialLoss: master.financialLoss,
          status: master.status,
          timestamp: new Date().toISOString(),
        });
        setIntelligence(master.intelligence);

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

        return true;
      } catch {
        setInputError(true);
        setReport(null);
        setBenchmark(null);
        setIntelligence(null);
        return false;
      }
    },
    [locale, region, sector.params, sectorId],
  );

  const resetAudit = useCallback(() => {
    setReport(null);
    setBenchmark(null);
    setIntelligence(null);
    setInputError(false);
  }, []);

  return {
    sector,
    t,
    report,
    benchmark,
    intelligence,
    inputError,
    runAudit,
    resetAudit,
  };
}
