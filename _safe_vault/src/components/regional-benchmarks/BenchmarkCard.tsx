"use client";

import { useTranslations } from "next-intl";
import type { BenchmarkBand } from "@/lib/regional-benchmarks/types";

type BenchmarkCardProps = {
  readonly band: BenchmarkBand;
};

export function BenchmarkCard({ band }: BenchmarkCardProps) {
  const t = useTranslations("regionalBenchmarks");
  const unit = t(`unit.${band.unit}`);

  return (
    <div className="rounded-lg border border-navy/10 bg-white/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">{t(`metric.${band.metric}`)}</p>
        <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[11px] font-medium text-body-charcoal">
          {t(`confidence.${band.confidence}`)}
        </span>
      </div>
      <p className="mt-2 text-sm text-navy">
        <span className="font-medium">{t("referenceBand")}:</span> {band.low}–{band.high} {unit}
      </p>
      <p className="mt-1 text-xs text-body-charcoal">
        {t("typical")}: {band.mid} {unit}
      </p>
    </div>
  );
}
