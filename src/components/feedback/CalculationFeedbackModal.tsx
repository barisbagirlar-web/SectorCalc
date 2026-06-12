"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { FeedbackSnapshotValue, FeedbackToolType } from "@/lib/feedback/types";
import type { VerificationIssueType } from "@/lib/feedback/feedback-types";
import { VERIFICATION_ISSUE_TYPES } from "@/lib/feedback/feedback-types";

type CalculationFeedbackModalProps = {
  readonly toolSlug: string;
  readonly toolType: FeedbackToolType;
  readonly locale: string;
  readonly routePath: string;
  readonly region?: string;
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly resultSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly onClose: () => void;
};

export function CalculationFeedbackModal({
  toolSlug,
  locale,
  routePath,
  region,
  inputSnapshot,
  resultSnapshot,
  onClose,
}: CalculationFeedbackModalProps) {
  const t = useTranslations("calculationFeedback");
  const [issueType, setIssueType] = useState<VerificationIssueType>("wrong-result");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/verification-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          locale,
          region,
          issueType,
          message,
          email: email || undefined,
          pageUrl: routePath,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          honeypot,
          inputSnapshot,
          resultSnapshot,
        }),
      });

      if (!response.ok) {
        setError(t("error.submitFailed"));
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      setError(t("error.submitFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">{t("modalTitle")}</h2>
          <button type="button" className="text-sm text-slate-600" onClick={onClose}>
            {t("close")}
          </button>
        </div>

        {done ? (
          <p className="mt-4 text-sm text-slate-700">{t("success")}</p>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <label className="block text-xs font-medium text-slate-700">
              {t("issueTypeLabel")}
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={issueType}
                onChange={(event) => setIssueType(event.target.value as VerificationIssueType)}
              >
                {VERIFICATION_ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`issueTypes.${type}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-slate-700">
              {t("messageLabel")}
              <textarea
                className="mt-1 min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                maxLength={2000}
              />
            </label>

            <label className="block text-xs font-medium text-slate-700">
              {t("emailLabel")}
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              aria-hidden="true"
            />

            {error ? <p className="text-xs text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? t("submitting") : t("submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
