"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  FEEDBACK_FORMULA_FIT_OPTIONS,
  FEEDBACK_USEFULNESS_OPTIONS,
} from "@/data/beta-partner-options";
import type {
  BenchmarkSnapshotValue,
  ReportFeedbackFieldErrors,
  ReportFeedbackInput,
  ReportFeedbackRating,
} from "@/lib/benchmarks/benchmark-types";
import { createReportFeedback } from "@/lib/benchmarks/create-report-feedback";

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-ink-black focus:border-ink-black focus:outline-none focus:ring-2 focus:ring-ink-black/20";

export interface PremiumReportFeedbackProps {
  schemaSlug: string;
  sectorSlug: string;
  reportSlug?: string;
  inputSnapshot?: Readonly<Record<string, BenchmarkSnapshotValue>>;
  resultSnapshot?: Readonly<Record<string, BenchmarkSnapshotValue>>;
  companySize?: string;
  country?: string;
  currency?: string;
}

const RATING_OPTIONS: ReportFeedbackRating[] = [1, 2, 3, 4, 5];

function emptyFeedback(
  props: PremiumReportFeedbackProps
): ReportFeedbackInput {
  return {
    schemaSlug: props.schemaSlug,
    sectorSlug: props.sectorSlug,
    reportSlug: props.reportSlug,
    rating: 3,
    usefulness: "",
    formulaFit: "",
    missingVariable: "",
    comment: "",
    permissionForBenchmark: false,
    inputSnapshot: props.inputSnapshot,
    resultSnapshot: props.resultSnapshot,
    country: props.country,
    currency: props.currency,
    companySize: props.companySize,
  };
}

export function PremiumReportFeedback(props: PremiumReportFeedbackProps) {
  const t = useTranslations("betaPartner.feedback");
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<ReportFeedbackInput>(() => emptyFeedback(props));
  const [errors, setErrors] = useState<ReportFeedbackFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setErrors({});

    const result = await createReportFeedback(form);

    setLoading(false);

    if (!result.success) {
      setErrors(result.errors ?? {});
      if (result.rateLimited) {
        setSubmitError(result.errors?.form ?? t("rateLimited"));
      }
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <aside className="sc-report-feedback sc-report-feedback--done mt-4 rounded-lg border border-slate/20 bg-off-white p-4">
        <p className="text-sm text-body-charcoal">{t("thankYou")}</p>
      </aside>
    );
  }

  if (!expanded) {
    return (
      <aside className="sc-report-feedback mt-4 rounded-lg border border-slate/15 bg-off-white/80 p-4">
        <p className="text-sm text-body-charcoal">{t("prompt")}</p>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 min-h-[44px] text-sm font-semibold text-ink-black hover:underline"
        >
          {t("open")}
        </button>
      </aside>
    );
  }

  return (
    <aside className="sc-report-feedback mt-4 rounded-lg border border-slate/20 bg-off-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="sc-ledger-eyebrow">{t("eyebrow")}</p>
          <h3 className="mt-1 text-sm font-semibold text-ink-black">{t("title")}</h3>
          <p className="mt-1 text-xs text-body-charcoal">{t("optional")}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="min-h-[44px] shrink-0 text-xs font-medium text-body-charcoal hover:text-ink-black"
        >
          {t("dismiss")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        {submitError ? (
          <p className="text-xs text-soft-red">{submitError}</p>
        ) : null}

        <fieldset>
          <legend className="mb-2 text-xs font-medium text-ink-black">{t("rating")}</legend>
          <div className="flex flex-wrap gap-2">
            {RATING_OPTIONS.map((value) => (
              <label
                key={value}
                className={`inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border px-3 text-sm ${
                  form.rating === value
                    ? "border-ink-black bg-ink-black text-white"
                    : "border-slate/25 bg-white text-ink-black"
                }`}
              >
                <input
                  type="radio"
                  name="feedback-rating"
                  value={value}
                  checked={form.rating === value}
                  onChange={() => setForm((prev) => ({ ...prev, rating: value }))}
                  className="sr-only"
                />
                {value}
              </label>
            ))}
          </div>
          {errors.rating ? (
            <p className="mt-1 text-xs text-soft-red">{errors.rating}</p>
          ) : null}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="feedback-usefulness" className="mb-1 block text-xs font-medium text-ink-black">
              {t("usefulness")}
            </label>
            <select
              id="feedback-usefulness"
              value={form.usefulness}
              onChange={(e) => setForm((prev) => ({ ...prev, usefulness: e.target.value }))}
              className={inputClass}
            >
              <option value="">{t("selectPlaceholder")}</option>
              {FEEDBACK_USEFULNESS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.usefulness ? (
              <p className="mt-1 text-xs text-soft-red">{errors.usefulness}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="feedback-formula-fit" className="mb-1 block text-xs font-medium text-ink-black">
              {t("formulaFit")}
            </label>
            <select
              id="feedback-formula-fit"
              value={form.formulaFit}
              onChange={(e) => setForm((prev) => ({ ...prev, formulaFit: e.target.value }))}
              className={inputClass}
            >
              <option value="">{t("selectPlaceholder")}</option>
              {FEEDBACK_FORMULA_FIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.formulaFit ? (
              <p className="mt-1 text-xs text-soft-red">{errors.formulaFit}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="feedback-missing" className="mb-1 block text-xs font-medium text-ink-black">
            {t("missingVariable")}
          </label>
          <input
            id="feedback-missing"
            type="text"
            value={form.missingVariable}
            onChange={(e) => setForm((prev) => ({ ...prev, missingVariable: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="feedback-comment" className="mb-1 block text-xs font-medium text-ink-black">
            {t("comment")}
          </label>
          <textarea
            id="feedback-comment"
            rows={3}
            value={form.comment}
            onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
            className={[inputClass, "min-h-[88px] py-2"].join(" ")}
          />
          {errors.comment ? (
            <p className="mt-1 text-xs text-soft-red">{errors.comment}</p>
          ) : null}
        </div>

        <label className="flex min-h-[44px] items-start gap-2">
          <input
            type="checkbox"
            checked={form.permissionForBenchmark}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, permissionForBenchmark: e.target.checked }))
            }
            className="mt-1"
          />
          <span className="text-xs text-body-charcoal">{t("benchmarkPermission")}</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="sc-cta-secondary min-h-[44px] px-5 text-sm"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>
    </aside>
  );
}
