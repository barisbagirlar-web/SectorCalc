"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  getRegionProfile,
  localeToRegion,
  type RegionCode,
} from "@/config/regions";
import { readManualRegionCookie, setManualRegion } from "@/lib/compliance/region-client";
import { useRegion } from "@/lib/compliance/region-context";

const REGION_OPTIONS: readonly { code: RegionCode | "auto"; labelKey: string }[] = [
  { code: "auto", labelKey: "auto" },
  { code: "EN", labelKey: "global" },
  { code: "TR", labelKey: "turkey" },
  { code: "DE", labelKey: "germany" },
] as const;

export function RegionIndicator({ className = "" }: { className?: string }) {
  const t = useTranslations("region");
  const { profile } = useRegion();

  return (
    <span
      className={`hidden font-mono text-[10px] uppercase tracking-wide text-body-charcoal xl:inline ${className}`.trim()}
      title={t("indicatorHint")}
    >
      {t("indicator", { region: profile.label, currency: profile.currency })}
    </span>
  );
}

export function RegionSelector({ className = "" }: { className?: string }) {
  const t = useTranslations("region");
  const locale = useLocale();
  const { region } = useRegion();
  const [pending, startTransition] = useTransition();
  const [manual, setManual] = useState<RegionCode | null>(null);

  useEffect(() => {
    setManual(readManualRegionCookie());
  }, []);

  const localeDefault = localeToRegion(locale);
  const selectValue = manual ?? "auto";

  const handleChange = (next: string) => {
    startTransition(() => {
      if (next === "auto") {
        setManualRegion("auto");
        return;
      }
      if (next === "EN" || next === "TR" || next === "DE") {
        setManualRegion(next);
      }
    });
  };

  return (
    <label className={`apple-locale language-selector language-selector--region ${className}`.trim()}>
      <span className="language-selector__icon" aria-hidden>
        🌐
      </span>
      <span className="sr-only">{t("label")}</span>
      <select
        value={selectValue}
        onChange={(event) => handleChange(event.target.value)}
        disabled={pending}
        aria-label={t("label")}
        className="apple-locale__select language-selector__select"
        title={
          manual
            ? t("manualActive", { region: getRegionProfile(region).label })
            : t("followsLanguage", { region: getRegionProfile(localeDefault).label })
        }
      >
        {REGION_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {t(opt.labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
}
