"use client";

import { useTranslations } from "next-intl";

type BenchmarkDisclosureProps = {
  readonly sourceNote: string;
};

export function BenchmarkDisclosure({ sourceNote }: BenchmarkDisclosureProps) {
  const t = useTranslations("regionalBenchmarks");
  return (
    <div className="mt-3 border-t border-navy/10 pt-3">
      <p className="text-xs text-body-charcoal">
        <span className="font-medium">{t("sourceNote")}:</span> {sourceNote}
      </p>
      <p className="mt-1 text-xs text-body-charcoal">{t("disclaimer")}</p>
    </div>
  );
}
