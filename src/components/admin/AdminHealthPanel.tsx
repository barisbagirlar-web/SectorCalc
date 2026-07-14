"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";

// ── Types ──────────────────────────────────────────────────────────────────

interface HealthCheckResult {
  check: string;
  status: "pass" | "fail" | "warn";
  detail: string;
  category: string;
  metric?: number;
}

interface HealthCheckResponse {
  ok: boolean;
  timestamp: string;
  elapsedMs: number;
  status: "pass" | "fail" | "warn";
  scores: { total: number; passed: number; failed: number; warnings: number };
  categories: Array<{ category: string; total: number; passed: number; failed: number; warnings: number }>;
  checks: HealthCheckResult[];
  environment: { nodeEnv: string; firebaseProject: string; adminPageCount: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  infrastructure: "Infrastructure",
  auth: "Authentication & Authorization",
  firestore: "Firestore Collections",
  route_integrity: "Route Integrity",
  title_integrity: "Title & Metadata Integrity",
  navigation: "Navigation",
  api: "API Endpoints",
};

const STATUS_ICONS: Record<string, string> = {
  pass: "✓",
  fail: "✗",
  warn: "⚠",
};

const STATUS_COLORS: Record<string, string> = {
  pass: "text-emerald-600 bg-emerald-50 border-emerald-200",
  fail: "text-red-600 bg-red-50 border-red-200",
  warn: "text-amber-600 bg-amber-50 border-amber-200",
};

const STATUS_BG: Record<string, string> = {
  pass: "bg-emerald-500",
  fail: "bg-red-500",
  warn: "bg-amber-500",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
        STATUS_COLORS[status] ?? "text-slate-600 bg-slate-50 border-slate-200"
      }`}
    >
      {STATUS_ICONS[status] ?? "?"} {status}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function AdminHealthPanel() {
  const { getIdToken } = useAdminAuth();
  const [response, setResponse] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["infrastructure", "title_integrity"]));
  const [autoRun, setAutoRun] = useState(true);

  const runHealthCheck = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const token = await getIdToken(true);
      if (!token) {
        setError("No auth token available. Please sign in.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/health-check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setResponse(data);
        // Auto-expand all categories with failures
        const failedCats = new Set(expandedCategories);
        for (const cat of data.categories) {
          if (cat.failed > 0 || cat.warnings > 0) {
            failedCats.add(cat.category);
          }
        }
        setExpandedCategories(failedCats);
      } else {
        setError(data.error ?? "Health check failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run health check");
    } finally {
      setLoading(false);
      setAutoRun(false);
    }
  }, [getIdToken, expandedCategories]);

  useEffect(() => {
    if (autoRun) {
      void runHealthCheck();
    }
  }, [autoRun, runHealthCheck]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const groupedChecks = response
    ? response.checks.reduce<Record<string, HealthCheckResult[]>>((acc, check) => {
        if (!acc[check.category]) acc[check.category] = [];
        acc[check.category].push(check);
        return acc;
      }, {})
    : {};

  // ── Score ring color ──
  const scorePct = response ? Math.round((response.scores.passed / response.scores.total) * 100) : 0;
  const scoreColor = scorePct === 100 ? "text-emerald-600" : scorePct >= 80 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-deep-navy">System Health Check</h2>
          <p className="text-sm text-text-secondary">
            Military-grade integrity verification for all admin system components.
            Runtime checks verify titles, routes, API endpoints, Firestore collections, and auth.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void runHealthCheck()}
          disabled={loading}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-accent/40 bg-accent px-5 text-sm font-bold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Running Checks...
            </>
          ) : (
            <>
              <span className="text-base">▶</span>
              Run Full Health Check
            </>
          )}
        </button>
      </div>

      {/* ── Error ── */}
      {error ? (
        <div className="rounded-sm border border-red/20 bg-red/5 p-4 text-sm text-red">
          <p className="font-bold">Check Failed</p>
          <p className="mt-1 text-red/80">{error}</p>
        </div>
      ) : null}

      {/* ── Loading Skeleton ── */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-sm border border-slate/20 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="h-4 w-40 rounded bg-slate/10" />
                <div className="h-5 w-16 rounded bg-slate/10" />
              </div>
              <div className="mt-3 space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-3 rounded bg-slate/10" style={{ width: `${60 + j * 20}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : response ? (
        <>
          {/* ── Score Summary ── */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-sm border border-slate/20 bg-white p-5 text-center shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Score</p>
              <p className={`mt-1 text-3xl font-black ${scoreColor}`}>{scorePct}%</p>
              <p className="mt-1 text-xs text-text-secondary">{response.scores.passed}/{response.scores.total} passed</p>
            </div>
            <div className="rounded-sm border border-emerald/20 bg-emerald/5 p-5 text-center shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Passed</p>
              <p className="mt-1 text-3xl font-black text-emerald-600">{response.scores.passed}</p>
            </div>
            <div className="rounded-sm border border-amber/20 bg-amber/5 p-5 text-center shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Warnings</p>
              <p className="mt-1 text-3xl font-black text-amber-600">{response.scores.warnings}</p>
            </div>
            <div className="rounded-sm border border-red/20 bg-red/5 p-5 text-center shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Failed</p>
              <p className="mt-1 text-3xl font-black text-red-600">{response.scores.failed}</p>
            </div>
          </div>

          {/* ── Overall Status Banner ── */}
          <div
            className={`rounded-sm border p-5 ${
              response.status === "pass"
                ? "border-emerald/30 bg-emerald/5"
                : response.status === "fail"
                ? "border-red/30 bg-red/5"
                : "border-amber/30 bg-amber/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-full ${STATUS_BG[response.status] ?? "bg-slate-500"}`} />
              <div>
                <p className="font-bold text-deep-navy">
                  Overall Status:{" "}
                  <span className={response.status === "pass" ? "text-emerald-600" : response.status === "fail" ? "text-red-600" : "text-amber-600"}>
                    {response.status.toUpperCase()}
                  </span>
                </p>
                <p className="text-xs text-text-secondary">
                  {response.timestamp} · Completed in {response.elapsedMs}ms · {response.environment.firebaseProject}
                </p>
              </div>
            </div>
          </div>

          {/* ── Category Breakdown ── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {response.categories.map((cat) => {
              const pct = cat.total > 0 ? Math.round((cat.passed / cat.total) * 100) : 0;
              return (
                <div
                  key={cat.category}
                  className="rounded-sm border border-slate/20 bg-white p-4 shadow-card"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {CATEGORY_LABELS[cat.category] ?? cat.category}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className={`text-xl font-black ${pct === 100 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600"}`}>
                      {pct}%
                    </span>
                    <span className="text-xs text-text-secondary">
                      {cat.passed}/{cat.total} · {cat.failed} fail · {cat.warnings} warn
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Detailed Checks by Category ── */}
          {Object.entries(groupedChecks).map(([cat, checks]) => {
            const catInfo = response.categories.find((c) => c.category === cat);
            const isExpanded = expandedCategories.has(cat);
            const hasIssues = (catInfo?.failed ?? 0) > 0 || (catInfo?.warnings ?? 0) > 0;

            return (
              <div key={cat} className="rounded-sm border border-slate/20 bg-white shadow-card">
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-off-white"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center rounded-sm px-2 py-0.5 text-xs font-bold uppercase ${
                        hasIssues
                          ? "bg-amber/10 text-amber"
                          : "bg-emerald/10 text-emerald-600"
                      }`}
                    >
                      {catInfo ? `${catInfo.passed}/${catInfo.total}` : "?"}
                    </span>
                    <span className="text-sm font-semibold text-deep-navy">
                      {CATEGORY_LABELS[cat] ?? cat}
                    </span>
                    {hasIssues ? (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-red/10 px-2 py-0.5 text-xs font-bold text-red">
                        {catInfo?.failed ?? 0} failed · {catInfo?.warnings ?? 0} warn
                      </span>
                    ) : null}
                  </div>
                  <span className={`text-sm text-text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-slate/10 border-t border-slate/15">
                    {checks.map((check) => (
                      <div key={check.check} className="flex items-start gap-3 px-5 py-3">
                        <StatusBadge status={check.status} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-deep-navy">{check.check}</p>
                          <p className="mt-0.5 text-xs text-text-secondary">{check.detail}</p>
                          {check.metric !== undefined && (
                            <p className="mt-0.5 text-xs text-text-secondary">Metric: {check.metric}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Environment ── */}
          <div className="rounded-sm border border-slate/20 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Environment</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-text-secondary">Node Env</p>
                <p className="font-medium text-deep-navy">{response.environment.nodeEnv}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Firebase Project</p>
                <p className="font-medium text-deep-navy">{response.environment.firebaseProject}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Admin Pages</p>
                <p className="font-medium text-deep-navy">{response.environment.adminPageCount}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
