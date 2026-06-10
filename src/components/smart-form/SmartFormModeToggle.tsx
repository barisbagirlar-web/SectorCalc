"use client";

import { useTranslations } from "next-intl";
import type { SmartFormMode } from "@/lib/smart-form/dynamic-form-types";

type SmartFormModeToggleProps = {
  readonly mode: SmartFormMode;
  readonly onChange: (mode: SmartFormMode) => void;
};

export function SmartFormModeToggle({ mode, onChange }: SmartFormModeToggleProps) {
  const t = useTranslations("smartForm.mode");

  return (
    <div
      className="sc-smart-form-mode flex min-w-0 flex-wrap gap-2"
      role="group"
      aria-label={t("simple")}
    >
      {(["simple", "advanced"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`min-h-[44px] min-w-0 flex-1 rounded-sm px-3 text-sm font-medium sm:flex-none sm:px-4 ${
            mode === option
              ? "bg-navy text-white"
              : "border border-border-subtle bg-white text-body-charcoal"
          }`}
          aria-pressed={mode === option}
        >
          {t(option)}
        </button>
      ))}
    </div>
  );
}
