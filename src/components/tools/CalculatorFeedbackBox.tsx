"use client";

import { useState, type FormEvent } from "react";
import {
  CALCULATOR_FEEDBACK_CATEGORIES,
  CALCULATOR_FEEDBACK_CATEGORY_LABELS,
  type CalculatorFeedbackCategory,
  type CalculatorFeedbackFieldErrors,
  type CalculatorFeedbackInput,
  type CalculatorFeedbackSnapshotValue,
  type CalculatorFeedbackTier,
} from "@/lib/features/feedback/calculator-feedback-types";
import { submitCalculatorFeedback } from "@/lib/features/feedback/submit-calculator-feedback";

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

export interface CalculatorFeedbackBoxProps {
  toolSlug: string;
  tier: CalculatorFeedbackTier;
  pagePath: string;
  inputSnapshot?: Readonly<Record<string, CalculatorFeedbackSnapshotValue>>;
  resultSnapshot?: Readonly<Record<string, CalculatorFeedbackSnapshotValue>>;
}

function buildInitialForm(props: CalculatorFeedbackBoxProps): CalculatorFeedbackInput {
  return {
    toolSlug: props.toolSlug,
    tier: props.tier,
    category: "",
    comment: "",
    pagePath: props.pagePath,
    inputSnapshot: props.inputSnapshot,
    resultSnapshot: props.resultSnapshot,
  };
}

export function CalculatorFeedbackBox(props: CalculatorFeedbackBoxProps) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<CalculatorFeedbackInput>(() => buildInitialForm(props));
  const [errors, setErrors] = useState<CalculatorFeedbackFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setErrors({});

    const result = await submitCalculatorFeedback({
      ...form,
      toolSlug: props.toolSlug,
      tier: props.tier,
      pagePath: props.pagePath,
      inputSnapshot: props.inputSnapshot,
      resultSnapshot: props.resultSnapshot,
    });

    setLoading(false);

    if (!result.success) {
      setErrors(result.errors ?? {});
      if (result.rateLimited) {
        setSubmitError(result.errors?.form ?? "Please wait before submitting again.");
      }
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <aside className="sc-calculator-feedback sc-calculator-feedback--done mt-4 rounded-lg border border-slate/20 bg-off-white p-4">
        <p className="text-sm text-body-charcoal">
          Thanks - your feedback helps improve this calculator.
        </p>
      </aside>
    );
  }

  if (!expanded) {
    return (
      <aside className="sc-calculator-feedback mt-4 rounded-lg border border-slate/15 bg-off-white/80 p-4">
        <p className="text-sm text-body-charcoal">
          Something off with this result? Tell us what does not match your field.
        </p>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 min-h-[44px] text-sm font-semibold text-professional-blue hover:underline"
        >
          Report an issue
        </button>
      </aside>
    );
  }

  return (
    <aside className="sc-calculator-feedback mt-4 rounded-lg border border-slate/20 bg-off-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="sc-ledger-eyebrow">Calculator feedback</p>
          <h3 className="mt-1 text-sm font-semibold text-deep-navy">Report a mismatch</h3>
          <p className="mt-1 text-xs text-body-charcoal">Optional - helps tune formulas and inputs.</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="min-h-[44px] shrink-0 text-xs font-medium text-body-charcoal hover:text-deep-navy"
        >
          Dismiss
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        {submitError ? <p className="text-xs text-soft-red">{submitError}</p> : null}

        <div>
          <label htmlFor="calc-feedback-category" className="mb-1 block text-xs font-medium text-deep-navy">
            Issue type
          </label>
          <select
            id="calc-feedback-category"
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category: event.target.value as CalculatorFeedbackCategory | "",
              }))
            }
            className={inputClass}
          >
            <option value="">Select…</option>
            {CALCULATOR_FEEDBACK_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CALCULATOR_FEEDBACK_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
          {errors.category ? (
            <p className="mt-1 text-xs text-soft-red">{errors.category}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="calc-feedback-comment" className="mb-1 block text-xs font-medium text-deep-navy">
            Details {form.category === "other" ? "(required)" : "(optional)"}
          </label>
          <textarea
            id="calc-feedback-comment"
            rows={3}
            value={form.comment}
            onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
            className={[inputClass, "min-h-[88px] py-2"].join(" ")}
          />
          {errors.comment ? (
            <p className="mt-1 text-xs text-soft-red">{errors.comment}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="sc-cta-secondary min-h-[44px] px-5 text-sm disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send feedback"}
        </button>
      </form>
    </aside>
  );
}
