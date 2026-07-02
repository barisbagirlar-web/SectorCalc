"use client";

import { useState, type FormEvent } from "react";
import { Download, Loader2, Mail } from "lucide-react";
import { useTranslations } from "@/lib/i18n-stub";
import type { CalculationReportRow } from "@/lib/content/pdf/calculation-report-types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ExportPDFButtonProps = {
  readonly toolName: string;
  readonly toolSlug: string;
  readonly locale: string;
  readonly pagePath: string;
  readonly primaryResult: string;
  readonly inputRows: readonly CalculationReportRow[];
  readonly breakdownRows: readonly CalculationReportRow[];
};

function mapApiError(errorCode: string | undefined, t: ReturnType<typeof useTranslations>): string {
  switch (errorCode) {
    case "email_required":
      return t("errorEmailRequired");
    case "rate_limited":
      return t("errorRateLimited");
    case "email_not_configured":
      return t("errorNotConfigured");
    default:
      return t("errorGeneric");
  }
}

export function ExportPDFButton({
  toolName,
  toolSlug,
  locale,
  pagePath,
  primaryResult,
  inputRows,
  breakdownRows,
}: ExportPDFButtonProps) {
  const t = useTranslations("leadMagnet");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitExport = async (event?: FormEvent) => {
    event?.preventDefault();

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError(t("errorEmailRequired"));
      setShowModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          toolName,
          toolSlug,
          locale,
          pagePath,
          primaryResult,
          inputRows,
          breakdownRows,
          honeypot: "",
        }),
      });

      const body = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !body.ok) {
        setError(mapApiError(body.error, t));
        setShowModal(true);
        return;
      }

      setSuccess(true);
      setShowModal(false);
      setEmail("");
    } catch {
      setError(t("errorGeneric"));
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setError(null);
            if (email.trim()) {
              void submitExport();
              return;
            }
            setShowModal(true);
          }}
          disabled={loading}
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-deep-navy hover:underline disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {t("exportButtonLabel")}
        </button>
        <span className="text-xs text-text-secondary">{t("exportBadge")}</span>
      </div>

      {success ? (
        <p className="mt-2 text-sm text-body-charcoal" role="status">
          {t("successMessage")}
        </p>
      ) : null}

      {showModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-export-title"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border-subtle bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="pdf-export-title" className="text-xl font-semibold text-text-primary">
              {t("modalTitle")}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">{t("modalDescription")}</p>

            <form onSubmit={submitExport} className="mt-4 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("emailPlaceholder")}
                className="min-h-[44px] w-full rounded-lg border border-border-subtle px-4 py-2.5 text-sm focus:border-deep-navy focus:outline-none focus:ring-2 focus:ring-deep-navy/20"
                autoFocus
                required
              />

              <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              {error ? (
                <p className="text-sm text-soft-red" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-deep-navy px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      {t("submittingLabel")}
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {t("submitLabel")}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="min-h-[44px] px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary"
                >
                  {t("cancelLabel")}
                </button>
              </div>
            </form>

            <p className="mt-3 text-xs text-text-secondary">{t("privacyNote")}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
