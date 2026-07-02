"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import type { VerificationIssueType } from "@/lib/features/feedback/feedback-types";
import { VERIFICATION_ISSUE_TYPES } from "@/lib/features/feedback/feedback-types";

type Props = {
  readonly toolSlug: string;
  readonly locale: string;
  readonly tier: "free" | "premium" | "unknown";
  readonly pageUrl: string;
  readonly inputSnapshot?: Record<string, string | number | boolean>;
  readonly resultSnapshot?: Record<string, string | number | boolean>;
};

export function VerificationQueueButton(props: Props) {
  const t = useTranslations("verificationQueue");
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState<VerificationIssueType>("wrong_result");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError("");

      try {
        const res = await fetch("/api/verification-queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolSlug: props.toolSlug,
            locale: props.locale,
            tier: props.tier,
            issueType,
            message: message.trim(),
            email: email.trim() || undefined,
            pageUrl: props.pageUrl,
            inputSnapshot: props.inputSnapshot,
            resultSnapshot: props.resultSnapshot,
          }),
        });

        const data = await res.json();
        if (!data.ok) {
          setError(data.error === "rate_limited" ? t("rateLimited") : t("submitError"));
          return;
        }
        setDone(true);
      } catch {
        setError(t("submitError"));
      } finally {
        setSubmitting(false);
      }
    },
    [props, issueType, message, email, t],
  );

  if (done) {
    return (
      <aside className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        {t("submitted")}
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        className="mt-4 min-h-[44px] text-sm font-semibold text-body-charcoal hover:text-kil-accent hover:underline"
        onClick={() => setOpen(true)}
      >
        {t("reportIssue")}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-border-subtle">
            <h3 className="text-lg font-semibold text-kil-text">{t("title")}</h3>
            <p className="mt-1 text-sm text-body-charcoal">{t("description")}</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-body-charcoal" htmlFor="vq-issue-type">
                  {t("issueTypeLabel")}
                </label>
                <select
                  id="vq-issue-type"
                  className="mt-1 block w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-kil-text focus:border-kil-accent focus:outline-none focus:ring-1 focus:ring-kil-accent/30"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as VerificationIssueType)}
                >
                  {VERIFICATION_ISSUE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`type.${type}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-body-charcoal" htmlFor="vq-message">
                  {t("messageLabel")}
                </label>
                <textarea
                  id="vq-message"
                  className="mt-1 block w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-kil-text focus:border-kil-accent focus:outline-none focus:ring-1 focus:ring-kil-accent/30"
                  rows={3}
                  minLength={10}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("messagePlaceholder")}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-body-charcoal" htmlFor="vq-email">
                  {t("emailLabel")}
                </label>
                <input
                  id="vq-email"
                  type="email"
                  className="mt-1 block w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-kil-text focus:border-kil-accent focus:outline-none focus:ring-1 focus:ring-kil-accent/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                />
              </div>

              {error ? <p className="text-sm text-crit-red font-semibold">{error}</p> : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="sc-cta-secondary min-h-[44px] px-4 text-sm font-semibold"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="sc-cta-primary min-h-[44px] px-4 text-sm font-semibold disabled:opacity-50"
                  disabled={submitting || message.trim().length < 10}
                >
                  {submitting ? t("submitting") : t("send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
