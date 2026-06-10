"use client";

import { useTranslations } from "next-intl";

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const textareaClass = [inputClass, "min-h-[88px] py-2"].join(" ");

export interface FormulaObjectionFieldsProps {
  readonly sectorContext: string;
  readonly suggestedFormulaChange: string;
  readonly expectedBehavior: string;
  readonly actualBehavior: string;
  readonly onSectorContextChange: (value: string) => void;
  readonly onSuggestedFormulaChangeChange: (value: string) => void;
  readonly onExpectedBehaviorChange: (value: string) => void;
  readonly onActualBehaviorChange: (value: string) => void;
}

export function FormulaObjectionFields({
  sectorContext,
  suggestedFormulaChange,
  expectedBehavior,
  actualBehavior,
  onSectorContextChange,
  onSuggestedFormulaChangeChange,
  onExpectedBehaviorChange,
  onActualBehaviorChange,
}: FormulaObjectionFieldsProps) {
  const t = useTranslations("feedback");

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="feedback-sector-context" className="mb-1 block text-xs font-medium text-deep-navy">
          {t("sectorContext.label")}
        </label>
        <input
          id="feedback-sector-context"
          type="text"
          value={sectorContext}
          onChange={(event) => onSectorContextChange(event.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="feedback-suggested-formula"
          className="mb-1 block text-xs font-medium text-deep-navy"
        >
          {t("suggestedFormulaChange.label")}
        </label>
        <textarea
          id="feedback-suggested-formula"
          rows={3}
          value={suggestedFormulaChange}
          onChange={(event) => onSuggestedFormulaChangeChange(event.target.value)}
          className={textareaClass}
        />
      </div>
      <div>
        <label
          htmlFor="feedback-expected-behavior"
          className="mb-1 block text-xs font-medium text-deep-navy"
        >
          {t("expectedBehavior.label")}
        </label>
        <textarea
          id="feedback-expected-behavior"
          rows={2}
          value={expectedBehavior}
          onChange={(event) => onExpectedBehaviorChange(event.target.value)}
          className={textareaClass}
        />
      </div>
      <div>
        <label
          htmlFor="feedback-actual-behavior"
          className="mb-1 block text-xs font-medium text-deep-navy"
        >
          {t("actualBehavior.label")}
        </label>
        <textarea
          id="feedback-actual-behavior"
          rows={2}
          value={actualBehavior}
          onChange={(event) => onActualBehaviorChange(event.target.value)}
          className={textareaClass}
        />
      </div>
    </div>
  );
}
