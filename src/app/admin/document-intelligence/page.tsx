/**
 * Operator Control Plane — Document Intelligence Admin UI (Section 81)
 *
 * Route: /admin/document-intelligence
 *
 * Admin-only page for monitoring and managing Document Intelligence jobs.
 * Features:
 *   - System health overview
 *   - Job list with status filtering
 *   - Per-job retry / refund actions
 *   - Job detail drill-down
 *
 * This is a client component that calls the admin API routes.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Tokens ────────────────────────────────────────────────────── */

const ACCENT = "#BD5D3A";
const TEXT = "#1A1915";
const MUTED = "#696764";
const BG = "#F0EEE6";
const CARD_BG = "#FFFFFF";
const BORDER = "rgba(26,25,21,0.10)";

/* ── Types ─────────────────────────────────────────────────────── */

interface HealthData {
  featureEnabled: boolean;
  engineVersion: string;
  jobCounts: Record<string, number>;
  stuckJobCount: number;
  stuckJobIds: string[];
  provider: string;
  timestamp: string;
}

interface JobView {
  jobId: string;
  userId: string;
  status: string | null;
  paymentStatus: string | null;
  entitlementStatus: string | null;
  diagnosticStatus: string | null;
  originalFilename: string | null;
  fileSizeBytes: number | null;
  pageCount: number | null;
  engineVersion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  failureCode: string | null;
  retryCount: number;
  processingExecutionId: string | null;
}

/* ── Helpers ───────────────────────────────────────────────────── */

function statusColor(status: string | null): string {
  if (!status) return MUTED;
  if (["completed", "paid", "diagnostic_eligible"].includes(status)) return "#22C55E";
  if (["failed_terminal", "refunded", "expired", "diagnostic_rejected"].includes(status)) return "#EF4444";
  if (["failed_retryable", "queued"].includes(status)) return "#F59E0B";
  return "#3B82F6";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

/* ── Component ─────────────────────────────────────────────────── */

export default function DocumentIntelligenceAdminPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [jobs, setJobs] = useState<JobView[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/document-intelligence/admin/health");
      const json = await res.json();
      if (json.ok) setHealth(json.data);
    } catch {
      // Non-critical
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === "all"
        ? "/api/document-intelligence/admin/jobs?limit=50"
        : `/api/document-intelligence/admin/jobs?status=${filter}&limit=50`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.ok) {
        setJobs(json.data.jobs);
      } else {
        setError(json.error?.message ?? "Failed to fetch jobs");
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [filter]);
  // Note: refreshKey is intentionally excluded from deps.
  // The useEffect below depends on both fetchJobs and refreshKey to trigger re-fetch.

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, refreshKey]);

  const handleRetry = async (jobId: string) => {
    setActionMsg(null);
    try {
      const res = await fetch(`/api/document-intelligence/admin/jobs/${jobId}/retry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Operator retry via Control Plane" }),
      });
      const json = await res.json();
      if (json.ok) {
        setActionMsg(`Job ${jobId} retried successfully`);
        setRefreshKey((k) => k + 1);
      } else {
        setActionMsg(`Retry failed: ${json.error?.message ?? "Unknown error"}`);
      }
    } catch (e) {
      setActionMsg(`Retry error: ${String(e)}`);
    }
  };

  return (
    <main className="min-h-screen p-6" style={{ background: BG, color: TEXT }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Document Intelligence — Operator Control Plane</h1>
            <p className="text-sm" style={{ color: MUTED }}>
              Monitor, retry, and manage Document Intelligence processing jobs
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm px-4 py-2 border"
            style={{ borderColor: BORDER }}
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Action Feedback */}
        {actionMsg && (
          <div className="mb-4 p-3 border" style={{ background: CARD_BG, borderColor: BORDER }}>
            {actionMsg}
          </div>
        )}

        {/* Health Summary */}
        {health && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            <HealthCard label="Feature" value={health.featureEnabled ? "ENABLED" : "DISABLED"} color={health.featureEnabled ? "#22C55E" : "#EF4444"} />
            <HealthCard label="Engine" value={health.engineVersion} />
            <HealthCard label="Provider" value={health.provider} />
            <HealthCard label="Total Jobs" value={String(Object.values(health.jobCounts).reduce((a, b) => a + b, 0))} />
            <HealthCard label="Stuck Jobs" value={String(health.stuckJobCount)} color={health.stuckJobCount > 0 ? "#F59E0B" : "#22C55E"} />
            <HealthCard label="Status Counts" value={Object.entries(health.jobCounts).map(([k, v]) => `${k}:${v}`).join(" | ")} />
            <HealthCard label="Updated" value={new Date(health.timestamp).toLocaleTimeString()} />
          </div>
        )}

        {/* Stuck Jobs Alert */}
        {health && health.stuckJobCount > 0 && (
          <div className="mb-6 p-4 border" style={{ background: "#FEF3C7", borderColor: "#F59E0B" }}>
            <strong className="block mb-1">⚠ {health.stuckJobCount} stuck job(s) detected</strong>
            <p className="text-sm" style={{ color: MUTED }}>
              IDs: {health.stuckJobIds.join(", ") || "None (within limits)"}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 border" style={{ background: "#FEF2F2", borderColor: "#EF4444" }}>
            <strong className="block mb-1">Error loading jobs</strong>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Filter + Refresh */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium">Status Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border text-sm"
            style={{ borderColor: BORDER, background: CARD_BG }}
          >
            <option value="all">All</option>
            <option value="stuck">Stuck</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="px-4 py-2 text-sm border"
            style={{ borderColor: BORDER }}
          >
            Refresh
          </button>
          <span className="text-xs" style={{ color: MUTED }}>
            {jobs.length} job(s)
          </span>
        </div>

        {/* Job Table */}
        <div className="overflow-x-auto border" style={{ borderColor: BORDER, background: CARD_BG }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: BORDER }}>
                <th className="text-left p-3 font-semibold">Job ID</th>
                <th className="text-left p-3 font-semibold">User</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Payment</th>
                <th className="text-left p-3 font-semibold">Filename</th>
                <th className="text-left p-3 font-semibold">Created</th>
                <th className="text-left p-3 font-semibold">Failure</th>
                <th className="text-left p-3 font-semibold">Retries</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center" style={{ color: MUTED }}>
                    Loading jobs...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center" style={{ color: MUTED }}>
                    No jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.jobId} className="border-t" style={{ borderColor: BORDER }}>
                    <td className="p-3 font-mono text-xs">{job.jobId.slice(0, 20)}...</td>
                    <td className="p-3 font-mono text-xs">{job.userId.slice(0, 12)}...</td>
                    <td className="p-3">
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-medium text-white rounded"
                        style={{ background: statusColor(job.status) }}
                      >
                        {job.status ?? "unknown"}
                      </span>
                    </td>
                    <td className="p-3 text-xs">{job.paymentStatus ?? "—"}</td>
                    <td className="p-3 text-xs max-w-[150px] truncate">{job.originalFilename ?? "—"}</td>
                    <td className="p-3 text-xs">{formatDate(job.createdAt)}</td>
                    <td className="p-3 text-xs" style={{ color: job.failureCode ? "#EF4444" : MUTED }}>
                      {job.failureCode ?? "—"}
                    </td>
                    <td className="p-3 text-xs">{job.retryCount}</td>
                    <td className="p-3">
                      {job.status === "failed_retryable" && (
                        <button
                          onClick={() => handleRetry(job.jobId)}
                          className="text-xs px-2 py-1 border"
                          style={{ borderColor: ACCENT, color: ACCENT }}
                        >
                          Retry
                        </button>
                      )}
                      {job.status === "failed_terminal" && (
                        <span className="text-xs" style={{ color: MUTED }}>Terminal</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Guide */}
        <div className="mt-8 p-4 border text-sm" style={{ borderColor: BORDER, background: CARD_BG }}>
          <h3 className="font-semibold mb-2">Operator Guide</h3>
          <ul className="space-y-1 text-xs" style={{ color: MUTED }}>
            <li>• Use the status filter to find stuck, processing, or failed jobs.</li>
            <li>&bull; &ldquo;Stuck&rdquo; = processing state unchanged for &gt;30 min. Retry or investigate.</li>
            <li>• Retry moves a <code>failed_retryable</code> job back to the queue.</li>
            <li>• Refund requests should use the API directly (<code>POST /api/.../refund</code>).</li>
            <li>• Health endpoint shows system status, provider info, and job distribution.</li>
            <li>• No document content is exposed in this view (safe metadata only).</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

/* ── Health Card Sub-component ─────────────────────────────────── */

function HealthCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-3 border" style={{ borderColor: BORDER, background: CARD_BG }}>
      <div className="text-xs mb-1" style={{ color: MUTED }}>
        {label}
      </div>
      <div
        className="text-sm font-semibold truncate"
        style={{ color: color ?? TEXT }}
      >
        {value}
      </div>
    </div>
  );
}
