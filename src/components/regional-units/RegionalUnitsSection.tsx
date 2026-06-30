"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  canConvert,
  convertUnit,
  formatUnit,
  getDefaultUnitForDimension,
  listUnitsForDimension,
  type MeasurementSystem,
  type SupportedRegion,
  type UnitDimension,
  type ConversionTraceEntry,
} from "@/lib/core/units/regional-unit-engine";
import { UnitSystemSelector } from "@/components/regional-units/UnitSystemSelector";
import { ConversionTrace } from "@/components/regional-units/ConversionTrace";

const CONVERTIBLE_DIMENSIONS: readonly UnitDimension[] = [
  "length",
  "area",
  "volume",
  "weight",
  "temperature",
  "speed",
  "energy",
  "power",
  "time",
];

type RegionalUnitsSectionProps = {
  readonly defaultRegion: SupportedRegion;
};

export function RegionalUnitsSection({ defaultRegion }: RegionalUnitsSectionProps) {
  const t = useTranslations("regionalUnits");

  const [region, setRegion] = useState<SupportedRegion>(defaultRegion);
  const [system, setSystem] = useState<MeasurementSystem>("metric");
  const [dimension, setDimension] = useState<UnitDimension>("length");
  const [fromUnit, setFromUnit] = useState<string>("ft");
  const [toUnit, setToUnit] = useState<string>("m");
  const [value, setValue] = useState<number>(1);

  const units = useMemo(() => listUnitsForDimension(dimension), [dimension]);

  const handleDimensionChange = (next: UnitDimension) => {
    setDimension(next);
    const dimensionUnits = listUnitsForDimension(next);
    const regionalDefault = getDefaultUnitForDimension(region, next);
    const nextTo = regionalDefault ?? dimensionUnits[0]?.id ?? "";
    const nextFrom = dimensionUnits.find((u) => u.id !== nextTo)?.id ?? nextTo;
    setFromUnit(nextFrom);
    setToUnit(nextTo);
  };

  const convertible = canConvert(fromUnit, toUnit);
  const result = convertible && Number.isFinite(value) ? convertUnit(value, fromUnit, toUnit) : null;

  const trace: readonly ConversionTraceEntry[] =
    result !== null
      ? [{ field: dimension, fromUnit, toUnit, originalValue: value, normalizedValue: result }]
      : [];

  return (
    <section
      aria-labelledby="regional-units-heading"
      className="sc-industrial-panel mt-6 p-4 sm:p-6"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-copper">{t("eyebrow")}</p>
      <h2 id="regional-units-heading" className="mt-1 text-lg font-semibold text-navy">
        {t("title")}
      </h2>
      <p className="mt-1 text-sm text-body-charcoal">{t("subtitle")}</p>

      <div className="mt-4">
        <UnitSystemSelector
          region={region}
          system={system}
          onRegionChange={setRegion}
          onSystemChange={setSystem}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">{t("dimension.label")}</span>
          <select
            value={dimension}
            onChange={(event) => handleDimensionChange(event.target.value as UnitDimension)}
            className="min-h-[44px] rounded-lg border border-navy/15 bg-white px-3 text-sm text-navy"
          >
            {CONVERTIBLE_DIMENSIONS.map((value) => (
              <option key={value} value={value}>
                {t(`dimension.${value}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">{t("value")}</span>
          <input
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value) ? value : ""}
            onChange={(event) => setValue(Number.parseFloat(event.target.value))}
            className="min-h-[44px] rounded-lg border border-navy/15 bg-white px-3 text-sm text-navy"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">{t("from")}</span>
          <select
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value)}
            className="min-h-[44px] rounded-lg border border-navy/15 bg-white px-3 text-sm text-navy"
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label} ({unit.symbol || unit.id})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">{t("to")}</span>
          <select
            value={toUnit}
            onChange={(event) => setToUnit(event.target.value)}
            className="min-h-[44px] rounded-lg border border-navy/15 bg-white px-3 text-sm text-navy"
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label} ({unit.symbol || unit.id})
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-base font-semibold text-navy" aria-live="polite">
        {result !== null
          ? `${formatUnit(value, fromUnit)} = ${formatUnit(result, toUnit)}`
          : t("notConvertible")}
      </p>

      <ConversionTrace entries={trace} />
    </section>
  );
}
