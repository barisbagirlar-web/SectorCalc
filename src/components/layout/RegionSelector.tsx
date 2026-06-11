"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { type RegionCode } from "@/config/regions";
import { readManualRegionCookie, setManualRegion } from "@/lib/compliance/region-client";
import { useRegion } from "@/lib/compliance/region-context";

function HeaderGlobeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="apple-header__globe-icon">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

const REGION_OPTIONS: readonly { code: RegionCode | "auto"; labelKey: string }[] = [
  { code: "auto", labelKey: "auto" },
  { code: "EN", labelKey: "global" },
  { code: "TR", labelKey: "turkey" },
  { code: "DE", labelKey: "germany" },
] as const;

export function RegionIndicator({ className = "" }: { className?: string }) {
  const t = useTranslations("region");
  const { profile, source } = useRegion();

  return (
    <span
      className={`hidden font-mono text-[10px] uppercase tracking-wide text-body-charcoal xl:inline ${className}`.trim()}
      title={t("indicatorHint")}
      data-region-code={profile.code}
      data-currency-code={profile.currency}
      data-region-source={source}
    >
      {t("indicator", { region: profile.label, currency: profile.currency })}
    </span>
  );
}

export function RegionSelector({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact";
}) {
  const t = useTranslations("region");
  const { region, profile, source } = useRegion();
  const [pending, startTransition] = useTransition();
  const [manual, setManual] = useState<RegionCode | null>(null);
  const compact = variant === "compact";

  useEffect(() => {
    setManual(readManualRegionCookie());
  }, []);

  const selectValue = manual ?? region;

  const handleChange = (next: string) => {
    startTransition(() => {
      if (next === "auto") {
        setManual(null);
        setManualRegion("auto");
        return;
      }
      if (next === "EN" || next === "TR" || next === "DE") {
        setManual(next);
        setManualRegion(next);
      }
    });
  };

  const regionTitle = manual
    ? t("manualActive", { region: profile.label })
    : t("followsLanguage", { region: profile.label });

  return (
    <label
      className={`apple-locale language-selector language-selector--region apple-header__region-trigger${compact ? " language-selector--compact-region" : ""} ${className}`.trim()}
      data-region-selector="true"
      data-region-code={region}
      data-currency-code={profile.currency}
      data-region-source={source}
      title={compact ? t("label") : regionTitle}
    >
      <HeaderGlobeIcon />
      <span className="sr-only">{t("label")}</span>
      <select
        value={selectValue}
        onChange={(event) => handleChange(event.target.value)}
        disabled={pending}
        aria-label={t("label")}
        className={`apple-locale__select language-selector__select${compact ? " language-selector__select--overlay" : ""}`}
        title={regionTitle}
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
