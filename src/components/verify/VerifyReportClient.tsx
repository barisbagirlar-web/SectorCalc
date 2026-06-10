"use client";

import { useEffect, useState } from "react";
import { VerifyStatusBadge } from "./VerifyStatusBadge";

type VerifyApiResult = {
  ok: boolean;
  status: "verified" | "hash_mismatch" | "revoked" | "not_found";
  reportId?: string;
  toolSlug?: string;
  formulaVersion?: string;
  issuedAt?: string;
  validationStampId?: string;
  hashMatches?: boolean;
  publicSummary?: {
    toolSlug: string;
    toolType: string;
    formulaVersion: string;
    issuedAt: string;
    validationStampId: string;
  };
  error?: string;
};

type Props = {
  reportId?: string;
  hash?: string;
};

export function VerifyReportClient({ reportId: initialReportId, hash: initialHash }: Props) {
  const [reportId, setReportId] = useState(initialReportId ?? "");
  const [verifyState, setVerifyState] = useState<
    "idle" | "loading" | "done" | "error"
  >(initialReportId ? "loading" : "idle");
  const [result, setResult] = useState<VerifyApiResult | null>(null);

  useEffect(() => {
    if (initialReportId) {
      doVerify(initialReportId, initialHash);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialReportId]);

  async function doVerify(id: string, hash?: string) {
    if (!id.trim()) return;
    setVerifyState("loading");
    setResult(null);
    try {
      const params = new URLSearchParams({ reportId: id.trim() });
      if (hash) params.set("hash", hash);
      const res = await fetch("/api/verify-report?" + params.toString());
      const data = (await res.json()) as VerifyApiResult;
      setResult(data);
      setVerifyState("done");
    } catch {
      setVerifyState("error");
      setResult(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doVerify(reportId, initialHash);
  }

  const badgeStatus =
    verifyState === "loading"
      ? "loading"
      : verifyState === "error"
        ? "error"
        : verifyState === "idle"
          ? "idle"
          : (result?.status ?? "idle");

  return (
    <div className="mx-auto max-w-xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Verify Calculation Report
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter a Report ID to verify an approved SectorCalc calculation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          placeholder="SC-20260601-TOOLSLUG-XXXX"
          aria-label="Report ID"
          className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={verifyState === "loading" || !reportId.trim()}
          className="inline-flex items-center rounded border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {verifyState === "loading" ? "Verifying…" : "Verify"}
        </button>
      </form>

      {(verifyState === "loading" ||
        verifyState === "done" ||
        verifyState === "error") && (
        <div
          className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4"
          data-verify-result="true"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Result
            </span>
            <VerifyStatusBadge status={badgeStatus} />
          </div>

          {verifyState === "error" && (
            <p className="text-xs text-red-600">
              Verification failed. Please try again.
            </p>
          )}

          {verifyState === "done" && result && (
            <div className="space-y-2 text-xs text-gray-700">
              {result.status === "not_found" && (
                <p className="text-gray-600">
                  No report found for ID{" "}
                  <span className="font-mono">{result.reportId}</span>. Check
                  the ID and try again.
                </p>
              )}

              {result.status === "revoked" && (
                <p className="text-red-600">
                  This report has been revoked and is no longer valid.
                </p>
              )}

              {result.status === "hash_mismatch" && (
                <p className="text-yellow-700">
                  Report found but the hash does not match. The calculation
                  result may have been altered.
                </p>
              )}

              {(result.status === "verified" ||
                result.status === "revoked" ||
                result.status === "hash_mismatch") &&
                result.reportId && (
                  <table className="w-full border-collapse text-xs">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-1 pr-3 font-medium text-gray-500">
                          Report ID
                        </td>
                        <td className="break-all py-1 font-mono">
                          {result.reportId}
                        </td>
                      </tr>
                      {result.toolSlug && (
                        <tr className="border-b border-gray-200">
                          <td className="py-1 pr-3 font-medium text-gray-500">
                            Tool
                          </td>
                          <td className="py-1 font-mono">{result.toolSlug}</td>
                        </tr>
                      )}
                      {result.formulaVersion && (
                        <tr className="border-b border-gray-200">
                          <td className="py-1 pr-3 font-medium text-gray-500">
                            Formula Version
                          </td>
                          <td className="py-1 font-mono">
                            {result.formulaVersion}
                          </td>
                        </tr>
                      )}
                      {result.issuedAt && (
                        <tr className="border-b border-gray-200">
                          <td className="py-1 pr-3 font-medium text-gray-500">
                            Issued
                          </td>
                          <td className="py-1">
                            {new Date(result.issuedAt).toLocaleString()}
                          </td>
                        </tr>
                      )}
                      {result.validationStampId && (
                        <tr>
                          <td className="py-1 pr-3 font-medium text-gray-500">
                            Stamp
                          </td>
                          <td className="break-all py-1 font-mono text-gray-500">
                            {result.validationStampId.slice(0, 40)}…
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">
        SectorCalc Approved Reports are technical simulations only. Not
        financial, legal, or engineering advice. Always verify before making
        business decisions.
      </p>
    </div>
  );
}