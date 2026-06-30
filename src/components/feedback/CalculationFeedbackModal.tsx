"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { FeedbackSnapshotValue, FeedbackToolType } from "@/lib/features/feedback/types";
import type { VerificationIssueType } from "@/lib/features/feedback/feedback-types";
import { VERIFICATION_ISSUE_TYPES, VERIFICATION_MESSAGE_MIN_LENGTH } from "@/lib/features/feedback/feedback-types";
import type { ToolFeedbackTier } from "@/lib/ui-shared/notifications/tool-feedback-mail";

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

function resolveToolSlug(toolSlug: string, routePath: string): string {
  const trimmed = toolSlug.trim();
  if (trimmed) {
    return trimmed;
  }
  const match = routePath.match(/\/tools\/(?:free|premium|premium-schema)\/([^/?#]+)/);
  return match?.[1] ?? "unknown-tool";
}

function resolveToolTier(toolType: FeedbackToolType, routePath: string): ToolFeedbackTier {
  if (routePath.includes("/premium-schema/") || routePath.includes("/tools/premium-schema/")) {
    return "premium-schema";
  }
  if (routePath.includes("/tools/free/")) {
    return "free";
  }
  if (routePath.includes("/tools/premium/")) {
    return "premium";
  }
  if (toolType === "free" || toolType === "premium") {
    return toolType;
  }
  return "unknown";
}

function safeFeedbackSnapshot(
  snapshot: Readonly<Record<string, FeedbackSnapshotValue>> | undefined,
): Readonly<Record<string, FeedbackSnapshotValue>> | undefined {
  if (!snapshot) {
    return undefined;
  }
  try {
    JSON.stringify(snapshot);
    return snapshot;
  } catch {
    return undefined;
  }
}

export function CalculationFeedbackModal({
  toolSlug,
  toolType,
  locale,
  routePath,
  inputSnapshot,
  resultSnapshot,
  onClose,
}: CalculationFeedbackModalProps) {
  const t = useTranslations("calculationFeedback");
  const [issueType, setIssueType] = useState<VerificationIssueType>("wrong_result");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim().length < VERIFICATION_MESSAGE_MIN_LENGTH) {
      setError(t("error.messageTooShort"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pageUrl =
        typeof window !== "undefined" ? window.location.href : routePath;
      const trimmedEmail = email.trim();
      const issueLabel = t(`issueTypes.${issueType}`);
      const normalizedMessage = `[${issueLabel}]\n\n${message.trim()}`;
      const snapshot = safeFeedbackSnapshot(resultSnapshot ?? inputSnapshot);

      const payload: Record<string, unknown> = {
        toolSlug: resolveToolSlug(toolSlug, routePath),
        toolTier: resolveToolTier(toolType, routePath),
        locale,
        pageUrl,
        message: normalizedMessage,
        feedbackType: issueType,
        issueType,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        honeypot,
      };

      if (trimmedEmail) {
        payload.email = trimmedEmail;
      }
      if (snapshot) {
        payload.resultSnapshot = snapshot;
      }

      const response = await fetch("/api/tool-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !responseBody.ok) {
        if (process.env.NODE_ENV === "development") {
          console.error("[tool-feedback] submit failed", {
            status: response.status,
            error: responseBody.error ?? "unknown",
            body: responseBody,
          });
        }
        setError(t("error.submitFailed"));
        setLoading(false);
        return;
      }

      setMessage("");
      setEmail("");
      setDone(true);
    } catch {
      setError(t("error.submitFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calculation-feedback-title"
    >
      <div className="max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 id="calculation-feedback-title" className="text-base font-semibold text-slate-900">
            {t("modalTitle")}
          </h2>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] text-sm text-slate-600"
            onClick={onClose}
          >
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
                minLength={VERIFICATION_MESSAGE_MIN_LENGTH}
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

            {error ? (
              <p className="text-xs text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || done}
              className="min-h-[44px] w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
            >
              {loading ? t("submitting") : t("submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
