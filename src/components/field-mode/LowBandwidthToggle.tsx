"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getLowBandwidth, setLowBandwidth } from "@/lib/field-mode/low-bandwidth";

export function LowBandwidthToggle() {
  const t = useTranslations("fieldMode");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getLowBandwidth());
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setLowBandwidth(next);
  };

  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-navy">{t("lowBandwidth")}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 min-h-[24px] items-center rounded-full transition-colors ${
          enabled ? "bg-copper" : "bg-navy/20"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}
