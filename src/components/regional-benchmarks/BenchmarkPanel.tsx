"use client";

import { useTranslations } from "next-intl";
import { getBenchmarkBand } from "@/lib/regional-benchmarks/benchmark-registry";
import type { BenchmarkMetric, BenchmarkRegion } from "@/lib/regional-benchmarks/types";
import { BenchmarkCard } from "@/components/regional-benchmarks/BenchmarkCard";
import { BenchmarkDisclosure } from "@/components/regional-benchmarks/BenchmarkDisclosure";

const DEFAULT_METRICS: readonly BenchmarkMetric[] = [
  "gross_margin",
  "net_margin",
  "scrap_rate",
  "quote_risk",
];

type BenchmarkPanelProps = {
  readonly region: BenchmarkRegion;
  readonly metrics?: readonly BenchmarkMetric[];
  readonly industry?: string;
};

export function BenchmarkPanel({ region, metrics = DEFAULT_METRICS, industry }: BenchmarkPanelProps) {
  const t = useTranslations("regionalBenchmarks");
  const bands = metrics
    .map((metric) => getBenchmarkBand({ metric, region, industry }))
    .filter((band): band is NonNullable<typeof band> => band !== null);

  if (bands.length === 0) {
    return null;
  }

  const primarySourceNote = bands[0].sourceNote;

  return (
    <section
      data-regional-benchmark-panel="true"
      aria-labelledby="regional-benchmark-heading"
      className="sc-industrial-panel mt-6 p-4 sm:p-6"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-copper">{t("eyebrow")}</p>
      <h2 id="regional-benchmark-heading" className="mt-1 text-lg font-semibold text-navy">
        {t("title")}
      </h2>
      <p className="mt-1 text-sm text-body-charcoal">{t("subtitle")}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {bands.map((band) => (
          <BenchmarkCard key={band.metric} band={band} />
        ))}
      </div>

      <BenchmarkDisclosure sourceNote={primarySourceNote} />
    </section>
  );
}
