"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import type { VerifyReportPublicResult } from "@/lib/features/trust-trace/types";

type VerifyReportApiResponse =
  | VerifyReportPublicResult
  | {
      readonly ok: false;
      readonly error: string;
      readonly message?: string;
    };

type VerifyReportFormProps = {
  readonly initialReportId?: string;
  readonly initialHash?: string;
};

function isVerified(result: VerifyReportApiResponse): boolean {
  return result.ok === true && result.status === "verified" && result.hashMatches;
}

function useResultMessage(t: ReturnType<typeof useTranslations>) {
  return function resultMessage(result: VerifyReportApiResponse): string {
    if (result.ok === false) {
      return result.message ?? t("formServiceUnavailable");
    }

    switch (result.status) {
      case "verified":
        return result.hashMatches
          ? t("formValidApproved")
          : t("formHashMismatch");
      case "hash_mismatch":
        return t("formHashMismatch");
      case "revoked":
        return t("formRevoked");
      case "not_found":
        return t("formNotFound");
      default:
        return t("formUnableToVerify");
    }
  };
}

export function VerifyReportForm({
  initialReportId = "",
  initialHash = "",
}: VerifyReportFormProps) {
  const t = useTranslations("verify");
  const [reportId, setReportId] = useState(initialReportId);
  const [hash, setHash] = useState(initialHash);
  const [result, setResult] = useState<VerifyReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const getMessage = useResultMessage(t);

  async function verify() {
    const trimmedReportId = reportId.trim();
    if (!trimmedReportId) {
      setResult({
        ok: false,
        error: "missing_params",
        message: t("formReportIdRequired"),
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({ reportId: trimmedReportId });
      const trimmedHash = hash.trim();
      if (trimmedHash) {
        params.set("hash", trimmedHash);
      }

      const res = await fetch(`/api/verify-report?${params.toString()}`);
      const data = (await res.json()) as VerifyReportApiResponse;
      setResult(data);
    } catch {
      setResult({
        ok: false,
        error: "lookup_failed",
        message: t("formServiceUnavailable"),
      });
    } finally {
      setLoading(false);
    }
  }

  const verified = result ? isVerified(result) : false;
  const publicSummary = result?.ok === true ? result.publicSummary : undefined;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-800">{t("formReportId")}</span>
          <input
            type="text"
            placeholder={t("formReportIdPlaceholder")}
            value={reportId}
            onChange={(event) => setReportId(event.target.value)}
            className="min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-800">
            {t("formCalcHash")}
          </span>
          <input
            type="text"
            placeholder={t("formHashPlaceholder")}
            value={hash}
            onChange={(event) => setHash(event.target.value)}
            className="min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <button
          type="button"
          onClick={verify}
          disabled={loading}
          className="min-h-11 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t("formChecking") : t("formVerifyBtn")}
        </button>
      </div>

      {result ? (
        <div
          className={`mt-6 rounded-md border p-4 ${
            verified
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
          aria-live="polite"
        >
          <p className="text-sm font-semibold">{getMessage(result)}</p>

          {result.ok === true && result.status !== "not_found" ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="font-medium">{t("formReportId")}</dt>
                <dd className="break-all font-mono text-xs">{result.reportId}</dd>
              </div>
              {result.validationStampId ? (
                <div>
                  <dt className="font-medium">{t("labelValidationStamp")}</dt>
                  <dd className="break-all font-mono text-xs">{result.validationStampId}</dd>
                </div>
              ) : null}
              {publicSummary ? (
                <>
                  <div>
                    <dt className="font-medium">{t("labelTool")}</dt>
                    <dd>{publicSummary.toolSlug}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t("labelFormulaVersion")}</dt>
                    <dd>{publicSummary.formulaVersion}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{t("labelIssuedAt")}</dt>
                    <dd>{publicSummary.issuedAt}</dd>
                  </div>
                </>
              ) : null}
            </dl>
          ) : null}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-gray-600">
        {t("formFootnote")}
      </p>
    </div>
  );
}
