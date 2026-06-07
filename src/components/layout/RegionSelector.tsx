"use client";

import { useTransition } from "react";
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
  const manual = readManualRegionCookie();
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
    <label className={`apple-locale ${className}`.trim()}>
      <span className="sr-only">{t("label")}</span>
      <select
        value={selectValue}
        onChange={(event) => handleChange(event.target.value)}
        disabled={pending}
        aria-label={t("label")}
        className="apple-locale__select max-w-[7rem] min-w-0 text-[11px] sm:max-w-[8rem]"
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
