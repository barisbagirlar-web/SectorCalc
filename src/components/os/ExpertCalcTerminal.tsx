"use client";

import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import { TerminalPanel } from "@/components/os/TerminalPanel";
import { useRegion } from "@/lib/compliance/region-context";
import {
  buildExpertFieldSpecs,
  runExpertCalculation,
  type ExpertCalcResult,
  type ExpertCalcTier,
} from "@/lib/os/core/formulas/expert-calc";
import {
  getSectorDisplayName,
  getSectorEntry,
  resolveSectorParamLabel,
  MANUFACTURING_OS_I18N_NS,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import { useTranslations } from "next-intl";

export interface ExpertCalcTerminalProps {
  sectorId: SectorRegistryKey;
  tier?: ExpertCalcTier;
}

export function ExpertCalcTerminal({ sectorId, tier = "premium" }: ExpertCalcTerminalProps) {
  const locale = useLocale();
  const { region, profile } = useRegion();
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);
  const sector = getSectorEntry(sectorId);

  const [result, setResult] = useState<ExpertCalcResult | null>(null);
  const [pending, setPending] = useState(false);

  const baseFields = buildExpertFieldSpecs(sectorId);
  const fields = baseFields.map((field) => ({
    ...field,
    label: resolveSectorParamLabel(sector, field.key, t),
  }));

  const title = getSectorDisplayName(sector, locale);
  const meta = `${profile.label} · ${profile.currency}`;

  const handleCalculate = useCallback(
    (values: Record<string, number>) => {
      setPending(true);
      window.setTimeout(() => {
        const next = runExpertCalculation({
          sectorId,
          values,
          region,
          locale,
          tier,
        });
        setResult(next);
        setPending(false);
      }, 120);
    },
    [locale, region, sectorId, tier],
  );

  const handleReset = useCallback(() => {
    setResult(null);
  }, []);

  return (
    <TerminalPanel
      title={title}
      meta={meta}
      fields={fields}
      tier={tier}
      result={result}
      pending={pending}
      onCalculate={handleCalculate}
      onReset={handleReset}
    />
  );
}
