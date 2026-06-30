"use client";

import { useTranslations } from "next-intl";
import { formatUnit, getUnitDefinition, type ConversionTraceEntry } from "@/lib/units/regional-unit-engine";

type ConversionTraceProps = {
  readonly entries: readonly ConversionTraceEntry[];
};

/** Display-only conversion trace: original value → canonical normalized value. */
export function ConversionTrace({ entries }: ConversionTraceProps) {
  const t = useTranslations("regionalUnits");

  return (
    <div data-conversion-trace="true" className="mt-3 rounded-lg border border-navy/10 bg-white/60 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-copper">{t("conversionTrace")}</p>
      {entries.length === 0 ? (
        <p className="mt-1 text-sm text-body-charcoal">{t("canonicalNote")}</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {entries.map((entry) => {
            const fromSymbol = getUnitDefinition(entry.fromUnit)?.symbol ?? entry.fromUnit;
            return (
              <li key={`${entry.field}-${entry.fromUnit}-${entry.toUnit}`} className="text-sm text-navy">
                <span className="font-medium">{entry.field}</span>:{" "}
                {formatUnit(entry.originalValue, entry.fromUnit)} {fromSymbol ? "" : ""}
                {" → "}
                {formatUnit(entry.normalizedValue, entry.toUnit)}
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-2 text-xs text-body-charcoal">{t("canonicalNote")}</p>
    </div>
  );
}
