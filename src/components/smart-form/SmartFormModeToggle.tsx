"use client";

import { useTranslations } from "next-intl";
import type { SmartFormMode } from "@/lib/features/smart-form/dynamic-form-types";

type SmartFormModeToggleProps = {
  readonly mode: SmartFormMode;
  readonly onChange: (mode: SmartFormMode) => void;
};

export function SmartFormModeToggle({ mode, onChange }: SmartFormModeToggleProps) {
  const t = useTranslations("smartForm.mode");

  return (
    <div
      className="sc-smart-form-mode sc-smart-form-mode-toggle"
      role="group"
      aria-label={t("simple")}
    >
      {(["simple", "advanced"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`sc-smart-form-mode-toggle__btn${
            mode === option ? " sc-smart-form-mode-toggle__btn--active" : ""
          }`}
          aria-pressed={mode === option}
        >
          {t(option)}
        </button>
      ))}
    </div>
  );
}
