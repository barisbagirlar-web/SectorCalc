// SectorCalc V5.4 — Engineering Diagnostics Dashboard Page
// Route: /dashboard/engineering-diagnostics
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { getCurrentUserIdToken } from "@/lib/infrastructure/firebase/auth";

interface ReportSummary {
  report_id: string;
  domain: string;
  decision: string;
  risk_score: number;
  created_at: string;
  report_hash: string;
}

function DecisionBadge({ decision }: { decision: string }) {
  const colors: Record<string, string> = {
    LOW_RISK: "#238A23",
    PROCEED_WITH_CAUTION: "#8A7A23",
    STOP_AND_INSPECT: "#A16A23",
    QC_REQUIRED: "#A12323",
    HIGH_SCRAP_RISK: "#8A1010",
  };
  const color = colors[decision] ?? "#6B6B68";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.5rem",
        borderRadius: "4px",
        fontSize: "0.78rem",
        fontWeight: 600,
        background: color + "18",
        color,
      }}
    >
      {decision.replace(/_/g, " ")}
    </span>
  );
}

export default function EngineeringDiagnosticsDashboardPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Get Firebase ID token — real SectorCalc pattern
    const token = await getCurrentUserIdToken();

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token && typeof token === "string") {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch("/api/dashboard/engineering-diagnostics", { headers });
      const data = await res.json();
      if (data.ok && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else if (res.status === 401) {
        setError("Please sign in to view your reports.");
      } else {
        setError("Unable to load reports.");
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <PageLayout>
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "4rem 1.5rem" }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "#1A1915",
            }}
          >
            Engineering Diagnostics Dashboard
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#4A4A48",
              marginBottom: "2rem",
            }}
          >
            View and manage your diagnostic reports, track ongoing analyses,
            and review completed action plans.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/engineering-diagnostics/start"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#BD5D3A",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              + New Diagnostic
            </Link>
          </div>

          {loading && (
            <div
              style={{
                padding: "2rem",
                backgroundColor: "#F0EEE6",
                border: "1px dashed #D6D4CC",
                borderRadius: "8px",
                textAlign: "center",
                color: "#6B6B68",
                fontSize: "0.9rem",
              }}
            >
              Loading reports...
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "#FFF0D6",
                border: "1px solid #E8D4A0",
                borderRadius: "8px",
                color: "#8A7A23",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              {error === "Please sign in to view your reports." ? (
                <>
                  Please{" "}
                  <Link href="/login" style={{ color: "#BD5D3A", fontWeight: 600 }}>
                    sign in
                  </Link>{" "}
                  to view your reports.
                </>
              ) : (
                error
              )}
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div
              style={{
                padding: "2rem",
                backgroundColor: "#F0EEE6",
                border: "1px dashed #D6D4CC",
                borderRadius: "8px",
                textAlign: "center",
                color: "#6B6B68",
                fontSize: "0.9rem",
              }}
            >
              <p style={{ margin: 0 }}>No diagnostic reports yet.</p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
                Start a new diagnostic to generate your first report.
              </p>
              <Link
                href="/engineering-diagnostics/start"
                style={{
                  display: "inline-block",
                  marginTop: "1rem",
                  color: "#BD5D3A",
                  fontWeight: 600,
                  textDecoration: "underline",
                  fontSize: "0.9rem",
                }}
              >
                Start New Diagnostic &rarr;
              </Link>
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {reports.map((r) => (
                <div
                  key={r.report_id}
                  style={{
                    padding: "1rem 1.25rem",
                    background: "#F0EEE6",
                    border: "1px solid #D6D4CC",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontFamily: "monospace",
                          color: "#4A4A48",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {r.report_id}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#1A1915",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {r.domain || "Unknown Domain"}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                        <DecisionBadge decision={r.decision} />
                        <span style={{ fontSize: "0.78rem", color: "#6B6B68" }}>
                          Risk: {r.risk_score}/100
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "#6B6B68" }}>
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/engineering-diagnostics/reports/${r.report_id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.4rem 0.9rem",
                        background: "#BD5D3A",
                        color: "#fff",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      View Report &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
