"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { FeedbackSuccessState } from "@/components/feedback/FeedbackSuccessState";
import {
  ToolFeedbackDialog,
  type ToolFeedbackFormState,
} from "@/components/feedback/ToolFeedbackDialog";
import {
  getOrCreateFeedbackSessionId,
  submitToolFeedback,
} from "@/lib/features/feedback/feedback-service";
import type {
  FeedbackSnapshotValue,
  FeedbackSource,
  FeedbackToolType,
  ToolFeedbackFieldErrors,
} from "@/lib/features/feedback/types";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";

export interface ToolFeedbackPanelProps {
  readonly toolSlug: string;
  readonly toolType: FeedbackToolType;
  readonly source: FeedbackSource;
  readonly locale: string;
  readonly routePath: string;
  readonly formulaVersion?: string;
  readonly formulaContractId?: string;
  readonly calculationHash?: string;
  readonly reportId?: string;
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
}

function buildInitialForm(): ToolFeedbackFormState {
  return {
    kind: "",
    message: "",
    expectedBehavior: "",
    actualBehavior: "",
    sectorContext: "",
    suggestedFormulaChange: "",
    suggestedInput: "",
    dataSourceUrl: "",
    companyWebsiteHidden: "",
  };
}

function resolveFormError(
  t: ReturnType<typeof useTranslations<"feedback">>,
  errors: ToolFeedbackFieldErrors,
): string | null {
  if (errors.form === "rateLimited") {
    return t("error.rateLimited");
  }
  if (errors.form === "submitFailed") {
    return t("error.submitFailed");
  }
  if (errors.form === "invalid") {
    return t("error.validation");
  }
  return null;
}

export function ToolFeedbackPanel({
  toolSlug,
  toolType,
  source,
  locale,
  routePath,
  formulaVersion,
  formulaContractId,
  calculationHash,
  reportId,
  inputSnapshot,
  resultSnapshot,
}: ToolFeedbackPanelProps) {
  const t = useTranslations("feedback");
  const { user } = useUserSubscription();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<ToolFeedbackFormState>(() => buildInitialForm());
  const [errors, setErrors] = useState<ToolFeedbackFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setErrors({});

    const result = await submitToolFeedback({
      ...form,
      toolSlug,
      toolType,
      locale,
      routePath,
      source,
      formulaVersion,
      formulaContractId,
      calculationHash,
      reportId,
      inputSnapshot,
      resultSnapshot,
      userId: user?.uid ?? null,
      userEmail: user?.email ?? null,
      sessionId: getOrCreateFeedbackSessionId(),
    });

    setLoading(false);

    if (result.honeypot) {
      setSubmitted(true);
      return;
    }

    if (!result.ok) {
      setErrors(result.errors ?? {});
      setSubmitError(resolveFormError(t, result.errors ?? {}));
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <aside
        className="sc-tool-feedback mt-4 min-w-0"
        data-tool-feedback-panel="true"
        data-tool-feedback-state="success"
      >
        <FeedbackSuccessState />
      </aside>
    );
  }

  if (!expanded) {
    return (
      <aside
        className="sc-tool-feedback mt-4 min-w-0 rounded-lg border border-slate/15 bg-off-white/80 p-4"
        data-tool-feedback-panel="true"
        data-tool-feedback-state="collapsed"
      >
        <p className="sc-ledger-eyebrow">{t("title")}</p>
        <p className="mt-1 text-sm text-body-charcoal">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-body-charcoal">{t("formulaObjectionNote")}</p>
        <p className="mt-1 text-xs text-body-charcoal">{t("trustTraceNote")}</p>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 min-h-[44px] text-sm font-semibold text-professional-blue hover:underline"
        >
          {t("openButton")}
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="sc-tool-feedback mt-4 min-w-0 rounded-lg border border-slate/20 bg-off-white p-4 sm:p-5"
      data-tool-feedback-panel="true"
      data-tool-feedback-state="open"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="sc-ledger-eyebrow">{t("title")}</p>
          <h3 className="mt-1 text-sm font-semibold text-deep-navy">{t("subtitle")}</h3>
          <p className="mt-1 text-xs text-body-charcoal">{t("visibilityNote")}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="min-h-[44px] shrink-0 text-xs font-medium text-body-charcoal hover:text-deep-navy"
        >
          {t("closeButton")}
        </button>
      </div>

      <ToolFeedbackDialog
        form={form}
        errors={errors}
        loading={loading}
        submitError={submitError}
        onClose={() => setExpanded(false)}
        onSubmit={handleSubmit}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
      />
    </aside>
  );
}
