"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import type {
  BetaPartner,
  BenchmarkSubmission,
  ReportFeedback,
} from "@/lib/features/benchmarks/benchmark-types";
import { getClaimReadiness } from "@/lib/features/benchmarks/claim-readiness";
import { listBenchmarkAdminData } from "@/lib/features/benchmarks/benchmark-firestore-read";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";
import { formatLocalDateTime } from "@/lib/core/format/datetime";
import { isFirebaseConfigured } from "@/lib/infrastructure/firebase/client";

type AdminTab = "partners" | "benchmarks" | "feedback";

const tabClass = (active: boolean): string =>
  [
    "inline-flex min-h-[44px] shrink-0 items-center rounded-lg border px-4 text-sm font-medium transition-colors",
    active
      ? "border-professional-blue bg-professional-blue text-white"
      : "border-slate/25 bg-white text-deep-navy hover:border-professional-blue/40 hover:bg-off-white",
  ].join(" ");

const statusBadgeClass = (status: string): string => {
  if (status === "accepted" || status === "approved") {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  if (status === "rejected") {
    return "bg-red-50 text-red-800 border-red-200";
  }
  if (status === "reviewing" || status === "pending") {
    return "bg-amber-50 text-amber-900 border-amber-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
};

function ClaimReadinessBadge({ readiness }: { readiness: ReturnType<typeof getClaimReadiness> }) {
  const labels: Record<typeof readiness, string> = {
    sample_only: "Sample only",
    benchmark_ready: "Benchmark ready",
    case_study_ready: "Case study ready",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(readiness === "sample_only" ? "pending" : "approved")}`}
    >
      Claim readiness: {labels[readiness]}
    </span>
  );
}

export function BenchmarkDataClient() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [tab, setTab] = useState<AdminTab>("partners");
  const [betaPartners, setBetaPartners] = useState<BetaPartner[]>([]);
  const [benchmarkSubmissions, setBenchmarkSubmissions] = useState<BenchmarkSubmission[]>([]);
  const [reportFeedback, setReportFeedback] = useState<ReportFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const claimReadiness = useMemo(
    () => getClaimReadiness(benchmarkSubmissions),
    [benchmarkSubmissions]
  );

  const loadData = useCallback(async () => {
    if (!isAdmin) {
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listBenchmarkAdminData();
      setBetaPartners(data.betaPartners);
      setBenchmarkSubmissions(data.benchmarkSubmissions);
      setReportFeedback(data.reportFeedback);
    } catch {
      setLoadError("Failed to load benchmark data.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      void loadData();
    }
  }, [isAdmin, loadData]);

  if (authLoading) {
    return <p className="text-sm text-body-charcoal">Checking admin access…</p>;
  }

  return (
    <div className="sc-admin-benchmarks">
      <AdminAuthBar />

      {!isAdmin ? (
        <p className="mt-6 text-sm text-body-charcoal">
          Sign in with an admin account to view beta partner and benchmark records.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ClaimReadinessBadge readiness={claimReadiness} />
            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="min-h-[44px] rounded-lg border border-slate/25 bg-white px-4 text-sm font-medium text-deep-navy hover:bg-off-white"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {!isFirebaseConfigured ? (
            <p className="mt-4 text-sm text-amber-800">
              Firebase is not configured — no live records will load.
            </p>
          ) : null}

          {loadError ? (
            <p className="mt-4 text-sm text-soft-red">{loadError}</p>
          ) : null}

          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Benchmark data tabs">
            <button
              type="button"
              className={tabClass(tab === "partners")}
              onClick={() => setTab("partners")}
            >
              Beta partners ({betaPartners.length})
            </button>
            <button
              type="button"
              className={tabClass(tab === "benchmarks")}
              onClick={() => setTab("benchmarks")}
            >
              Benchmark submissions ({benchmarkSubmissions.length})
            </button>
            <button
              type="button"
              className={tabClass(tab === "feedback")}
              onClick={() => setTab("feedback")}
            >
              Report feedback ({reportFeedback.length})
            </button>
          </nav>

          {tab === "partners" ? (
            <BenchmarkTable
              loading={loading}
              emptyMessage="No beta partner applications yet."
              rows={betaPartners.map((partner) => ({
                id: partner.id,
                cells: [
                  formatLocalDateTime(partner.createdAt),
                  partner.companyName,
                  partner.country,
                  partner.industry,
                  partner.mainLossArea,
                  partner.status,
                  partner.wantsCaseStudyPermission ? "Yes" : "No",
                ],
              }))}
              headers={[
                "Created",
                "Company",
                "Country",
                "Industry",
                "Main loss area",
                "Status",
                "Case study OK",
              ]}
            />
          ) : null}

          {tab === "benchmarks" ? (
            <BenchmarkTable
              loading={loading}
              emptyMessage="No benchmark submissions yet."
              rows={benchmarkSubmissions.map((item) => ({
                id: item.id,
                cells: [
                  formatLocalDateTime(item.createdAt),
                  item.sectorSlug,
                  item.toolSlug,
                  item.country,
                  item.companySize,
                  item.reviewStatus,
                  item.permissionForAnonymizedBenchmark ? "Yes" : "No",
                ],
              }))}
              headers={[
                "Created",
                "Sector",
                "Tool",
                "Country",
                "Size",
                "Review",
                "Anonymized OK",
              ]}
            />
          ) : null}

          {tab === "feedback" ? (
            <BenchmarkTable
              loading={loading}
              emptyMessage="No report feedback yet."
              rows={reportFeedback.map((item) => ({
                id: item.id,
                cells: [
                  formatLocalDateTime(item.createdAt),
                  item.schemaSlug,
                  String(item.rating),
                  item.formulaFit,
                  item.missingVariable || "—",
                ],
              }))}
              headers={["Created", "Schema", "Rating", "Formula fit", "Missing variable"]}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

interface BenchmarkTableProps {
  headers: string[];
  rows: { id: string; cells: string[] }[];
  loading: boolean;
  emptyMessage: string;
}

function BenchmarkTable({ headers, rows, loading, emptyMessage }: BenchmarkTableProps) {
  if (loading && rows.length === 0) {
    return <p className="mt-6 text-sm text-body-charcoal">Loading records…</p>;
  }

  if (rows.length === 0) {
    return <p className="mt-6 text-sm text-body-charcoal">{emptyMessage}</p>;
  }

  return (
    <div className="sc-admin-benchmarks__table-wrap mt-6">
      <table className="sc-admin-benchmarks__table hidden w-full md:table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-b border-slate/20 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-body-charcoal"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate/10">
              {row.cells.map((cell, index) => (
                <td key={`${row.id}-${index}`} className="px-3 py-3 text-sm text-deep-navy">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-slate/20 bg-white p-4"
          >
            {headers.map((header, index) => (
              <div key={`${row.id}-${header}`} className="flex justify-between gap-3 py-1 text-sm">
                <span className="font-medium text-body-charcoal">{header}</span>
                <span className="text-right text-deep-navy">{row.cells[index]}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
