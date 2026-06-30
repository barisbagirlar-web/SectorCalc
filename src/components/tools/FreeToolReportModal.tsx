"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  VERIFICATION_MESSAGE_MIN_LENGTH,
  type VerificationIssueType,
} from "@/lib/features/feedback/feedback-types";
import type { FeedbackSnapshotValue } from "@/lib/features/feedback/types";

export type FreeReportCategory = "formul" | "eksik_veri" | "birim" | "ui" | "diger";

const CATEGORY_TO_ISSUE: Record<FreeReportCategory, VerificationIssueType> = {
  formul: "wrong_result",
  eksik_veri: "missing_input",
  birim: "unit_issue",
  ui: "unclear_explanation",
  diger: "other",
};

type FreeToolReportModalProps = {
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

export function FreeToolReportModal({
  toolSlug,
  locale,
  routePath,
  userId,
  inputSnapshot,
  resultSnapshot,
  onClose,
}: FreeToolReportModalProps) {
  const t = useTranslations("generatedTool.freeForm");
  const [category, setCategory] = useState<FreeReportCategory>("formul");
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
          tier: "free",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="free-report-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border border-technical-gray bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="free-report-title" className="text-lg font-semibold text-premium-velvet">
          {t("reportModalTitle")}
        </h2>

        {done ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-body-charcoal">{t("reportSuccess")}</p>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] w-full bg-action-orange px-4 py-2 text-sm font-medium text-white"
            >
              {t("reportClose")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="free-report-category"
                className="mb-1 block text-xs font-medium text-premium-velvet"
              >
                {t("reportCategoryLabel")}
              </label>
              <select
                id="free-report-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as FreeReportCategory)}
                className="min-h-[44px] w-full border border-technical-gray bg-white px-3 text-sm"
              >
                <option value="formul">{t("reportCategoryFormula")}</option>
                <option value="eksik_veri">{t("reportCategoryMissingInput")}</option>
                <option value="birim">{t("reportCategoryUnit")}</option>
                <option value="ui">{t("reportCategoryUi")}</option>
                <option value="diger">{t("reportCategoryOther")}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="free-report-description"
                className="mb-1 block text-xs font-medium text-premium-velvet"
              >
                {t("reportDescriptionLabel")}
              </label>
              <textarea
                id="free-report-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full border border-technical-gray px-3 py-2 text-sm"
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
              <p className="text-sm text-soft-red" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] flex-1 border border-technical-gray px-4 py-2 text-sm text-body-charcoal"
              >
                {t("reportCancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="min-h-[44px] flex-1 bg-action-orange px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {loading ? t("reportSubmitting") : t("reportSubmit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
