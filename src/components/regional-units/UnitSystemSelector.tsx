"use client";

import { useTranslations } from "next-intl";
import type { MeasurementSystem, SupportedRegion } from "@/lib/core/units/regional-unit-engine";

const REGIONS: readonly SupportedRegion[] = ["global", "us", "uk", "eu", "tr", "mena", "latam"];
const SYSTEMS: readonly MeasurementSystem[] = ["metric", "imperial", "mixed"];

type UnitSystemSelectorProps = {
  readonly region: SupportedRegion;
  readonly system: MeasurementSystem;
  readonly onRegionChange: (region: SupportedRegion) => void;
  readonly onSystemChange: (system: MeasurementSystem) => void;
};

export function UnitSystemSelector({
  region,
  system,
  onRegionChange,
  onSystemChange,
}: UnitSystemSelectorProps) {
  const t = useTranslations("regionalUnits");

  return (
    <div data-unit-system-selector="true" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-navy">{t("region.label")}</span>
        <select
          value={region}
          onChange={(event) => onRegionChange(event.target.value as SupportedRegion)}
          className="min-h-[44px] rounded-lg border border-navy/15 bg-white px-3 text-sm text-navy"
        >
          {REGIONS.map((value) => (
            <option key={value} value={value}>
              {t(`region.${value}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-navy">{t("system.label")}</span>
        <select
          value={system}
          onChange={(event) => onSystemChange(event.target.value as MeasurementSystem)}
          className="min-h-[44px] rounded-lg border border-navy/15 bg-white px-3 text-sm text-navy"
        >
          {SYSTEMS.map((value) => (
            <option key={value} value={value}>
              {t(`system.${value}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
