// CBAM Service Page — commercial entitlement model service information.
// Uses 100 account credits to unlock 5 CBAM report uses.
"use client";

import { useCallback, useEffect, useState } from "react";

const PACKAGE_CREDITS = 100;
const PACKAGE_INCLUDED_USES = 5;

export default function CbamPage() {
  const [loading, setLoading] = useState(true);
  const [accountCredits, setAccountCredits] = useState<number | null>(null);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [entitlementError, setEntitlementError] = useState<string | null>(
    null
  );
  const [unlocking, setUnlocking] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [lastReportResult, setLastReportResult] = useState<string | null>(
    null
  );

  // Load account credit balance and CBAM entitlement on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/cbam/entitlement");
        if (res.ok) {
          const data = await res.json();
          setAccountCredits(data.accountCredits ?? 0);
          setRemainingUses(data.remainingUses ?? 0);
        } else if (res.status === 401) {
          setAccountCredits(null);
          setRemainingUses(null);
        }
      } catch {
        // Silently fail — entitlement is optional for preview
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const onUnlockPackage = useCallback(async () => {
    setUnlocking(true);
    setEntitlementError(null);
    try {
      const res = await fetch("/api/cbam/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: `cbam_unlock_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          setEntitlementError(
            "Insufficient account credits. Add account credits to unlock the CBAM report package."
          );
        } else {
          setEntitlementError(
            data.error ?? data.message ?? "Failed to unlock CBAM package."
          );
        }
        return;
      }
      if (typeof data.remainingUses === "number") {
        setRemainingUses(data.remainingUses);
      }
      if (typeof data.remainingAccountCredits === "number") {
        setAccountCredits(data.remainingAccountCredits);
      }
    } catch {
      setEntitlementError("Network error. Please try again.");
    } finally {
      setUnlocking(false);
    }
  }, []);

  const onGenerateReport = useCallback(async () => {
    if (remainingUses !== null && remainingUses <= 0) {
      setEntitlementError(
        "No remaining CBAM report uses. Unlock a new package."
      );
      return;
    }
    setReporting(true);
    setEntitlementError(null);
    setLastReportResult(null);
    try {
      const res = await fetch("/api/cbam/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cn_code: "test",
          eu_quarter_version: "2026-Q2",
          report_id: `cbam_report_${Date.now()}`,
        }),
      });
      const data = await res.json();

      if (res.status === 503) {
        setEntitlementError(
          "CBAM configuration not yet verified. Please try again later."
        );
        return;
      }

      if (res.status === 402) {
        setEntitlementError(
          data.message ??
            "No remaining CBAM report uses. Unlock a new package."
        );
        return;
      }

      if (!res.ok) {
        setEntitlementError(
          data.error ?? data.message ?? "Report generation failed."
        );
        return;
      }

      // Update remaining uses from response
      if (typeof data.remainingUsesAfterThisReport === "number") {
        setRemainingUses(data.remainingUsesAfterThisReport);
      }
      setLastReportResult(
        `Report generated. ${data.remainingUsesAfterThisReport ?? "?"} use(s) remaining.`
      );
    } catch {
      setEntitlementError("Network error. Please try again.");
    } finally {
      setReporting(false);
    }
  }, [remainingUses]);

  return (
    <main className="min-h-screen bg-[#F0EEE6] pb-24">
      {/* Service Package Information Panel */}
      <div className="bg-[#FAF9F5] border-b border-[rgba(26,25,21,0.10)]">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <span className="text-xs text-[#1A1915]/60 uppercase tracking-wider font-mono">
            Service Package
          </span>
          <h1 className="font-serif text-xl text-[#1A1915] mt-1">
            CBAM Report Package
          </h1>

          <p className="text-sm text-[#1A1915]/80 mt-3 max-w-lg leading-relaxed">
            Use 100 account credits to unlock 5 CBAM report uses. Each
            successful sealed report generation consumes 1 use. Failed
            validations, blocked source data, unsuccessful PDF generation, or
            verification storage failures do not consume a use.
          </p>

          <p className="text-xs text-[#1A1915]/60 mt-3 leading-relaxed">
            This package uses your existing SectorCalc account credit balance. No separate CBAM checkout is required after credits are available in your account.
          </p>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-[rgba(26,25,21,0.10)]">
            <div>
              <div className="text-xs text-[#1A1915]/60 font-mono">
                Package credits
              </div>
              <div className="font-mono text-lg text-[#1A1915]">
                {PACKAGE_CREDITS}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#1A1915]/60 font-mono">
                Included reports
              </div>
              <div className="font-mono text-lg text-[#1A1915]">
                {PACKAGE_INCLUDED_USES}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#1A1915]/60 font-mono">
                Use cost
              </div>
              <div className="font-mono text-lg text-[#1A1915]">
                1 per report
              </div>
            </div>
          </div>

          {/* Account balance and remaining uses */}
          {!loading && (
            <div className="mt-4 pt-4 border-t border-[rgba(26,25,21,0.10)] space-y-2">
              {typeof accountCredits === "number" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#1A1915]/60 font-mono">
                    Account credits
                  </span>
                  <span className="font-mono text-sm text-[#1A1915]">
                    {accountCredits}
                  </span>
                </div>
              )}
              {typeof remainingUses === "number" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#1A1915]/60 font-mono">
                    Remaining CBAM report uses
                  </span>
                  <span
                    className={`font-mono text-lg ${
                      remainingUses > 0
                        ? "text-[#1A1915]"
                        : "text-[#BD5D3A]"
                    }`}
                  >
                    {remainingUses} / {PACKAGE_INCLUDED_USES}
                  </span>
                </div>
              )}
              {accountCredits === null && remainingUses === null && (
                <p className="text-xs text-[#1A1915]/60 font-mono">
                  Sign in to view your account credits and CBAM entitlement.
                </p>
              )}
            </div>
          )}

          {/* Error display */}
          {entitlementError && (
            <div className="mt-3 p-3 border border-[#BD5D3A] bg-[#BD5D3A]/5">
              <p className="text-sm text-[#1A1915] font-mono">
                {entitlementError}
              </p>
            </div>
          )}

          {/* Last report result */}
          {lastReportResult && (
            <div className="mt-3 p-3 border border-[rgba(26,25,21,0.10)] bg-[#FAF9F5]">
              <p className="text-sm text-[#1A1915] font-mono">
                {lastReportResult}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action section */}
      <div className="max-w-xl mx-auto px-4 mt-8">
        {/* Unlock button */}
        {typeof remainingUses === "number" && remainingUses <= 0 && (
          <div className="mb-6">
            <button
              onClick={onUnlockPackage}
              disabled={unlocking}
              className="w-full bg-[#BD5D3A] text-[#FAF9F5] py-3 font-mono text-sm disabled:opacity-50"
            >
              {unlocking
                ? "PROCESSING..."
                : "Unlock 5 CBAM reports with 100 account credits"}
            </button>
            <p className="text-xs text-[#1A1915]/60 mt-2">
              No CBAM use is consumed until the report is successfully generated
              and registered for verification.
            </p>
          </div>
        )}

        {/* Generate report button */}
        {typeof remainingUses === "number" && remainingUses > 0 && (
          <div className="mb-6">
            <button
              onClick={onGenerateReport}
              disabled={reporting}
              className="w-full bg-[#1A1915] text-[#FAF9F5] py-3 font-mono text-sm disabled:opacity-50"
            >
              {reporting
                ? "GENERATING REPORT..."
                : "Generate sealed CBAM report (1 use)"}
            </button>
            <p className="text-xs text-[#1A1915]/60 mt-2">
              No CBAM use is consumed until the report is successfully generated
              and registered for verification.
            </p>
          </div>
        )}

        {/* Sign in prompt */}
        {remainingUses === null && !loading && (
          <div className="bg-[#FAF9F5] border border-[rgba(26,25,21,0.10)] p-6">
            <p className="text-sm text-[#1A1915] mb-2 font-mono">
              Sign in to use the CBAM report package
            </p>
            <p className="text-xs text-[#1A1915]/60">
              You need a SectorCalc account with credits to unlock CBAM report
              uses. 100 account credits unlock 5 report uses.
            </p>
          </div>
        )}

        {loading && (
          <p className="text-xs text-[#1A1915]/60 font-mono">
            Loading entitlement information...
          </p>
        )}

        {/* Usage details */}
        <div className="border-t border-[rgba(26,25,21,0.10)] pt-4 mt-8">
          <h2 className="text-xs text-[#1A1915]/60 uppercase tracking-wider font-mono mb-3">
            Usage details
          </h2>
          <ul className="text-xs text-[#1A1915]/70 space-y-1.5 font-mono">
            <li>{"> 100 account credits unlock 5 CBAM report uses."}</li>
            <li>{"> 1 successful sealed report consumes 1 use."}</li>
            <li>
              {"> Remaining uses are shown before report generation."}
            </li>
            <li>
              {"> A new 100-credit unlock is required after all 5 uses are consumed."}
            </li>
            <li>
              {"> Reports are decision-support outputs and do not replace qualified regulatory, customs, legal, or engineering review."}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
