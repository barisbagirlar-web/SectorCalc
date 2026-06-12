"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type {
  CalculatorExperienceContract,
  CalculatorExperienceMode,
} from "@/lib/calculator-experience/calculator-experience-types";

export type PremiumCalculatorShellProps = {
  readonly title: string;
  readonly description: string;
  readonly experience: CalculatorExperienceContract;
  readonly mode: CalculatorExperienceMode;
  readonly onModeChange: (mode: CalculatorExperienceMode) => void;
  readonly hasCalculated: boolean;
  readonly inputPanel: ReactNode;
  readonly resultPanel: ReactNode;
  readonly emptyResultPanel?: ReactNode;
};

export function PremiumCalculatorShell({
  title,
  description,
  experience,
  mode,
  onModeChange,
  hasCalculated,
  inputPanel,
  resultPanel,
  emptyResultPanel,
}: PremiumCalculatorShellProps) {
  const t = useTranslations("calculator");

  return (
    <section className="sc-premium-tool-shell" data-premium-calculator-shell="true">
      <header className="sc-tool-header">
        <span className="sc-tool-eyebrow">{t("premiumEyebrow")}</span>
        <h1>{title}</h1>
        <p>{description}</p>

        {experience.hasExpertMode ? (
          <div className="sc-mode-switch" role="tablist" aria-label={t("mode.label")}>
            <button
              type="button"
              className={mode === "quick" ? "is-active" : ""}
              aria-selected={mode === "quick"}
              onClick={() => onModeChange("quick")}
            >
              {t("mode.quick")}
            </button>
            <button
              type="button"
              className={mode === "expert" ? "is-active" : ""}
              aria-selected={mode === "expert"}
              onClick={() => onModeChange("expert")}
            >
              {t("mode.expert")}
            </button>
          </div>
        ) : null}
      </header>

      <div className="sc-tool-workspace sc-tool-workspace--dual">
        <section className="sc-tool-panel sc-input-panel">
          <h2>{t("sections.inputs")}</h2>
          {inputPanel}
        </section>

        <section className="sc-tool-panel sc-result-panel">
          <h2>{hasCalculated ? t("sections.result") : t("sections.summary")}</h2>
          {hasCalculated
            ? resultPanel
            : (emptyResultPanel ?? <p className="sc-empty-state">{t("emptyState.enterValues")}</p>)}
        </section>
      </div>
    </section>
  );
}
