"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  inferStandardFamily,
  listStandardOptions,
  resolveDefaultStandardSystem,
} from "@/lib/features/standards/standard-system-resolver";
import type { StandardSystem } from "@/lib/features/standards/engineering-standards-types";

type StandardSystemSelectorProps = {
  readonly toolSlug: string;
  readonly region: string;
  readonly value?: StandardSystem;
  readonly onChange?: (system: StandardSystem) => void;
};

export function StandardSystemSelector({
  toolSlug,
  region,
  value,
  onChange,
}: StandardSystemSelectorProps) {
  const t = useTranslations("standards");
  const family = inferStandardFamily(toolSlug);
  const options = useMemo(
    () => (family ? listStandardOptions(family) : []),
    [family],
  );
  const defaultSystem = family ? resolveDefaultStandardSystem(region, family) : undefined;
  const [internal, setInternal] = useState<StandardSystem>(value ?? defaultSystem ?? "ISO_EN");
  const selected = value ?? internal;

  if (!family || options.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4" data-engineering-standard-selector="true">
      <p className="text-sm font-semibold text-slate-900">{t("selectorTitle")}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{t("selectorNote")}</p>
      <label className="mt-3 block text-xs font-medium text-slate-700" htmlFor={`standard-${toolSlug}`}>
        {t("selectorLabel")}
      </label>
      <select
        id={`standard-${toolSlug}`}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        value={selected}
        onChange={(event) => {
          const next = event.target.value as StandardSystem;
          setInternal(next);
          onChange?.(next);
        }}
      >
        {options.map((option) => (
          <option key={option.system} value={option.system}>
            {t(`systems.${option.system}`)}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{t("engineeringWarning")}</p>
    </div>
  );
}
