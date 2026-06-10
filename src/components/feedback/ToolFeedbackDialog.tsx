"use client";

import { useTranslations } from "next-intl";
import type { FeedbackKind } from "@/lib/feedback/types";
import type { ToolFeedbackFieldErrors } from "@/lib/feedback/types";
import { FeedbackKindSelect } from "@/components/feedback/FeedbackKindSelect";
import { FormulaObjectionFields } from "@/components/feedback/FormulaObjectionFields";

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const textareaClass = [inputClass, "min-h-[120px] py-2"].join(" ");

export interface ToolFeedbackFormState {
  readonly kind: FeedbackKind | "";
  readonly message: string;
  readonly expectedBehavior: string;
  readonly actualBehavior: string;
  readonly sectorContext: string;
  readonly suggestedFormulaChange: string;
  readonly suggestedInput: string;
  readonly dataSourceUrl: string;
  readonly companyWebsiteHidden: string;
}

export interface ToolFeedbackDialogProps {
  readonly form: ToolFeedbackFormState;
  readonly errors: ToolFeedbackFieldErrors;
  readonly loading: boolean;
  readonly submitError: string | null;
  readonly onClose: () => void;
  readonly onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  readonly onChange: (patch: Partial<ToolFeedbackFormState>) => void;
}

function fieldErrorMessage(
  t: ReturnType<typeof useTranslations<"feedback">>,
  code: string | undefined,
): string | null {
  if (!code) {
    return null;
  }
  if (code === "tooShort") {
    return t("error.tooShort");
  }
  if (code === "tooLong") {
    return t("error.tooLong");
  }
  if (code === "invalidUrl") {
    return t("error.validation");
  }
  if (code === "required") {
    return t("error.validation");
  }
  return t("error.validation");
}

export function ToolFeedbackDialog({
  form,
  errors,
  loading,
  submitError,
  onClose,
  onSubmit,
  onChange,
}: ToolFeedbackDialogProps) {
  const t = useTranslations("feedback");
  const showFormulaFields =
    form.kind === "formula_objection" ||
    form.kind === "wrong_result" ||
    form.kind === "sector_adjustment";

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="feedback-company-website">Company website</label>
        <input
          id="feedback-company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyWebsiteHidden}
          onChange={(event) => onChange({ companyWebsiteHidden: event.target.value })}
        />
      </div>

      {submitError ? <p className="text-xs text-soft-red">{submitError}</p> : null}

      <FeedbackKindSelect
        id="feedback-kind"
        value={form.kind}
        onChange={(kind) => onChange({ kind })}
        error={fieldErrorMessage(t, errors.kind) ?? undefined}
      />

      <div>
        <label htmlFor="feedback-message" className="mb-1 block text-xs font-medium text-deep-navy">
          {t("message.label")} *
        </label>
        <textarea
          id="feedback-message"
          rows={4}
          required
          value={form.message}
          onChange={(event) => onChange({ message: event.target.value })}
          placeholder={t("message.placeholder")}
          className={textareaClass}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-soft-red">{fieldErrorMessage(t, errors.message)}</p>
        ) : null}
      </div>

      {showFormulaFields ? (
        <FormulaObjectionFields
          sectorContext={form.sectorContext}
          suggestedFormulaChange={form.suggestedFormulaChange}
          expectedBehavior={form.expectedBehavior}
          actualBehavior={form.actualBehavior}
          onSectorContextChange={(value) => onChange({ sectorContext: value })}
          onSuggestedFormulaChangeChange={(value) => onChange({ suggestedFormulaChange: value })}
          onExpectedBehaviorChange={(value) => onChange({ expectedBehavior: value })}
          onActualBehaviorChange={(value) => onChange({ actualBehavior: value })}
        />
      ) : null}

      {form.kind === "missing_input" ? (
        <div>
          <label htmlFor="feedback-suggested-input" className="mb-1 block text-xs font-medium text-deep-navy">
            {t("suggestedInput.label")}
          </label>
          <input
            id="feedback-suggested-input"
            type="text"
            value={form.suggestedInput}
            onChange={(event) => onChange({ suggestedInput: event.target.value })}
            className={inputClass}
          />
        </div>
      ) : null}

      {form.kind === "data_source_suggestion" ? (
        <div>
          <label htmlFor="feedback-data-source" className="mb-1 block text-xs font-medium text-deep-navy">
            {t("dataSourceUrl.label")}
          </label>
          <input
            id="feedback-data-source"
            type="url"
            inputMode="url"
            value={form.dataSourceUrl}
            onChange={(event) => onChange({ dataSourceUrl: event.target.value })}
            className={inputClass}
            aria-invalid={Boolean(errors.dataSourceUrl)}
          />
          {errors.dataSourceUrl ? (
            <p className="mt-1 text-xs text-soft-red">{fieldErrorMessage(t, errors.dataSourceUrl)}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          disabled={loading}
          className="sc-cta-secondary min-h-[44px] px-5 text-sm disabled:opacity-60"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] px-4 text-sm font-medium text-body-charcoal hover:text-deep-navy"
        >
          {t("closeButton")}
        </button>
      </div>
    </form>
  );
}
