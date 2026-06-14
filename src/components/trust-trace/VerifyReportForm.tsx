"use client";

import { useState } from "react";
import type { VerifyReportPublicResult } from "@/lib/trust-trace/types";

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

function resultMessage(result: VerifyReportApiResponse): string {
  if (result.ok === false) {
    return result.message ?? "Verification request failed. Check the report ID and try again.";
  }

  switch (result.status) {
    case "verified":
      return result.hashMatches
        ? "Report is valid and approved."
        : "Report found, but the calculation hash does not match.";
    case "hash_mismatch":
      return "Report found, but the calculation hash does not match.";
    case "revoked":
      return "This report exists but has been revoked.";
    case "not_found":
      return "Report not found or invalid.";
    default:
      return "Unable to verify this report.";
  }
}

export function VerifyReportForm({
  initialReportId = "",
  initialHash = "",
}: VerifyReportFormProps) {
  const [reportId, setReportId] = useState(initialReportId);
  const [hash, setHash] = useState(initialHash);
  const [result, setResult] = useState<VerifyReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function verify() {
    const trimmedReportId = reportId.trim();
    if (!trimmedReportId) {
      setResult({
        ok: false,
        error: "missing_params",
        message: "Report ID is required.",
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
        message: "Verification service is unavailable. Try again shortly.",
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
          <span className="mb-1 block text-sm font-medium text-gray-800">Report ID</span>
          <input
            type="text"
            placeholder="SC-YYYYMMDD-TOOL-ID"
            value={reportId}
            onChange={(event) => setReportId(event.target.value)}
            className="min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-800">
            Calculation hash (optional)
          </span>
          <input
            type="text"
            placeholder="64-character SHA-256 hash"
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
          {loading ? "Checking..." : "Verify report"}
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
          <p className="text-sm font-semibold">{resultMessage(result)}</p>

          {result.ok === true && result.status !== "not_found" ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="font-medium">Report ID</dt>
                <dd className="break-all font-mono text-xs">{result.reportId}</dd>
              </div>
              {result.validationStampId ? (
                <div>
                  <dt className="font-medium">Validation stamp</dt>
                  <dd className="break-all font-mono text-xs">{result.validationStampId}</dd>
                </div>
              ) : null}
              {publicSummary ? (
                <>
                  <div>
                    <dt className="font-medium">Tool</dt>
                    <dd>{publicSummary.toolSlug}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Formula version</dt>
                    <dd>{publicSummary.formulaVersion}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Issued at</dt>
                    <dd>{publicSummary.issuedAt}</dd>
                  </div>
                </>
              ) : null}
            </dl>
          ) : null}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-gray-600">
        Public verification returns limited metadata only. Full input and result snapshots are never
        exposed on this page.
      </p>
    </div>
  );
}
