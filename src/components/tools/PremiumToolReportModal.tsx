"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { VerificationIssueType } from "@/lib/features/feedback/feedback-types";
import { VERIFICATION_MESSAGE_MIN_LENGTH } from "@/lib/features/feedback/feedback-types";
import type { FeedbackSnapshotValue } from "@/lib/features/feedback/types";

export type PremiumReportCategory = "formul" | "eksik_veri" | "birim" | "ui" | "diger";

const CATEGORY_TO_ISSUE: Record<PremiumReportCategory, VerificationIssueType> = {
  formul: "wrong_result",
  eksik_veri: "missing_input",
  birim: "unit_issue",
  ui: "unclear_explanation",
  diger: "other",
};

type PremiumToolReportModalProps = {
  readonly toolSlug: string;
  readonly locale: string;
  readonly routePath: string;
  readonly userId?: string | null;
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly onClose: () => void;
};

function toSerializableSnapshot(
  snapshot: Readonly<Record<string, FeedbackSnapshotValue>> | undefined,
): Record<string, string | number | boolean> | undefined {
  if (!snapshot) {
    return undefined;
  }
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
      out[key] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function PremiumToolReportModal({
  toolSlug,
  locale,
  routePath,
  userId,
  inputSnapshot,
  resultSnapshot,
  onClose,
}: PremiumToolReportModalProps) {
  const t = useTranslations("generatedTool.premiumForm");
  const [category, setCategory] = useState<PremiumReportCategory>("formul");
  const [description, setDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (description.trim().length < VERIFICATION_MESSAGE_MIN_LENGTH) {
      setError(t("reportMessageTooShort"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : routePath;
      const issueType = CATEGORY_TO_ISSUE[category];

      const response = await fetch("/api/verification-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          locale,
          tier: "premium",
          issueType,
          message: description.trim(),
          pageUrl,
          userId: userId ?? undefined,
          honeypot,
          inputSnapshot: toSerializableSnapshot(inputSnapshot),
          resultSnapshot: toSerializableSnapshot(resultSnapshot),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        }),
      });

      const body = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !body.ok) {
        setError(t("reportSubmitFailed"));
        return;
      }

      setDone(true);
    } catch {
      setError(t("reportSubmitFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sc-premium-dtf-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-report-title"
      onClick={onClose}
    >
      <div className="sc-premium-dtf-modal" onClick={(event) => event.stopPropagation()}>
        <div className="sc-premium-dtf-modal__title" id="premium-report-title">
          {t("reportModalTitle")}
        </div>

        {done ? (
          <>
            <p className="text-sm text-slate-300">{t("reportSuccess")}</p>
            <div className="sc-premium-dtf-modal__actions">
              <button type="button" className="sc-premium-dtf-modal__submit" onClick={onClose}>
                {t("reportClose")}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="sc-premium-dtf-modal__label" htmlFor="premium-report-category">
                {t("reportCategoryLabel")}
              </label>
              <select
                id="premium-report-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as PremiumReportCategory)}
                className="sc-premium-dtf-modal__input"
              >
                <option value="formul">{t("reportCategoryFormula")}</option>
                <option value="eksik_veri">{t("reportCategoryMissingInput")}</option>
                <option value="birim">{t("reportCategoryUnit")}</option>
                <option value="ui">{t("reportCategoryUi")}</option>
                <option value="diger">{t("reportCategoryOther")}</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="sc-premium-dtf-modal__label" htmlFor="premium-report-description">
                {t("reportDescriptionLabel")}
              </label>
              <textarea
                id="premium-report-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="sc-premium-dtf-modal__textarea"
                placeholder={t("reportDescriptionPlaceholder")}
                minLength={VERIFICATION_MESSAGE_MIN_LENGTH}
                maxLength={2000}
                required
              />
            </div>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              aria-hidden="true"
            />

            {error ? (
              <p className="sc-premium-dtf-modal__error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="sc-premium-dtf-modal__actions">
              <button type="button" className="sc-premium-dtf-modal__cancel" onClick={onClose}>
                {t("reportCancel")}
              </button>
              <button type="submit" className="sc-premium-dtf-modal__submit" disabled={loading}>
                {loading ? t("reportSubmitting") : t("reportSubmit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
