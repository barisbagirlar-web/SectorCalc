"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";

interface DashboardStats {
  users: { total: number; newLast30d: number; adminClaim: number; adminRole: number };
  leads: {
    total: number;
    newLast30d: number;
    statusBreakdown: { new: number; contacted: number; converted: number; lost: number };
    recent: Array<{ id: string; email: string; toolSlug: string; status: string; createdAt: string }>;
  };
  tickets: { total: number; open: number; resolved: number; closed: number };
  caseStudies: { total: number };
  reports: { total: number };
  verificationQueue: { total: number };
}

interface AdminLink {
  href: string;
  label: string;
  description: string;
  icon: string;
}

const ADMIN_LINKS: AdminLink[] = [
  { href: "/admin/case-studies", label: "Case Studies", description: "Manage case study content, create and edit studies", icon: "📄" },
  { href: "/admin/tickets", label: "Support Tickets", description: "View and respond to user support requests", icon: "🎫" },
  { href: "/admin/leads", label: "Lead Intents", description: "Full lead pipeline with quality scoring and SLA tracking", icon: "📊" },
  { href: "/admin/users", label: "Member Management", description: "Manage users, admin claims, credits and subscriptions", icon: "👥" },
  { href: "/admin/kpi", label: "Live KPI Review", description: "Traffic, calculator usage, premium intent and revenue signals", icon: "📈" },
  { href: "/admin/benchmarks", label: "Benchmark Data", description: "Beta partner intake and benchmark submissions", icon: "🏆" },
  { href: "/admin/schema-generator", label: "Schema Generator", description: "Build premium analyzer schemas from safe formula blocks", icon: "⚙️" },
  { href: "/admin/verification-queue", label: "Verification Queue", description: "Calculation feedback and result objections", icon: "🔍" },
];

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-amber-100 text-amber-800",
    converted: "bg-emerald-100 text-emerald-800",
    lost: "bg-red-100 text-red-800",
    open: "bg-blue-100 text-blue-800",
    in_progress: "bg-amber-100 text-amber-800",
    resolved: "bg-emerald-100 text-emerald-800",
    closed: "bg-slate-100 text-slate-600",
  };
  const colorClass = colorMap[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function SuperAdminDashboard() {
  const { loading, user, isAdmin, getIdToken } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setError(null);
    try {
      const token = await getIdToken(true);
      if (!token) {
        setStatsLoading(false);
        return;
      }
      const res = await fetch("/api/admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setStats(data.stats);
      } else {
        setError(data.error ?? "Failed to load dashboard stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
    } finally {
      setStatsLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (!loading && isAdmin) {
      void fetchStats();
    }
  }, [loading, isAdmin, fetchStats]);

  if (loading || !user || !isAdmin) {
    return null;
  }

  const sectionClass = "rounded-sm border border-slate/20 bg-white p-5 shadow-card";

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="rounded-sm border border-accent/20 bg-accent/5 p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Super Admin</p>
            <h2 className="mt-1 text-xl font-bold text-deep-navy">
              Welcome, {user.displayName || user.email || "Admin"}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              System overview and management dashboard. All admin modules are accessible below.
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <button
              type="button"
              onClick={() => void fetchStats()}
              disabled={statsLoading}
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-slate/25 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-accent/40 hover:bg-accent/5 disabled:opacity-50"
            >
              {statsLoading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      {statsLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-sm border border-slate/20 bg-white p-5 shadow-card">
              <div className="h-3 w-20 rounded bg-slate/10" />
              <div className="mt-3 h-7 w-16 rounded bg-slate/10" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-sm border border-red/20 bg-red/5 p-4 text-sm text-red">
          <p className="font-semibold">Failed to load dashboard data</p>
          <p className="mt-1 text-red/80">{error}</p>
        </div>
      ) : stats ? (
        <>
          {/* Primary Metrics */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <AdminMetricCard label="Total Users" value={String(stats.users.total)} hint={`${stats.users.newLast30d} new in 30d`} />
            <AdminMetricCard label="Admin Accounts" value={String(stats.users.adminClaim)} hint={`${stats.users.adminRole} with admin role`} />
            <AdminMetricCard label="Total Leads" value={String(stats.leads.total)} hint={`${stats.leads.newLast30d} in 30d · ${stats.leads.statusBreakdown.converted} converted`} />
            <AdminMetricCard label="Support Tickets" value={String(stats.tickets.total)} hint={`${stats.tickets.open} open · ${stats.tickets.resolved} resolved`} />
            <AdminMetricCard label="Case Studies" value={String(stats.caseStudies.total)} hint="Published content" />
            <AdminMetricCard label="Saved Reports" value={String(stats.reports.total)} hint="User-generated reports" />
            <AdminMetricCard label="Verification Queue" value={String(stats.verificationQueue.total)} hint="Pending review items" />
            <AdminMetricCard label="Lead Conversion" value={stats.leads.total > 0 ? `${Math.round((stats.leads.statusBreakdown.converted / stats.leads.total) * 100)}%` : "0%"} hint={`${stats.leads.statusBreakdown.converted} of ${stats.leads.total} leads`} />
          </div>

          {/* ── Lead Status Breakdown ── */}
          <div className={sectionClass}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Lead Status Breakdown</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {([
                { label: "New", value: stats.leads.statusBreakdown.new, color: "bg-blue-500" },
                { label: "Contacted", value: stats.leads.statusBreakdown.contacted, color: "bg-amber-500" },
                { label: "Converted", value: stats.leads.statusBreakdown.converted, color: "bg-emerald-500" },
                { label: "Lost", value: stats.leads.statusBreakdown.lost, color: "bg-red-500" },
              ] as const).map((item) => (
                <div key={item.label} className="rounded-sm border border-slate/15 bg-off-white p-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <p className="text-xs font-semibold uppercase text-text-secondary">{item.label}</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-deep-navy">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Leads ── */}
          {stats.leads.recent.length > 0 && (
            <div className={sectionClass}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Recent Leads (Last 30 Days)</h3>
                <Link href="/admin/leads" className="text-xs font-semibold text-accent hover:underline">
                  View All →
                </Link>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate/15 text-left text-xs font-semibold uppercase text-text-secondary">
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Tool</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate/10">
                    {stats.leads.recent.map((lead) => (
                      <tr key={lead.id} className="hover:bg-off-white/50">
                        <td className="max-w-[200px] truncate px-3 py-2 font-medium text-deep-navy">
                          {lead.email || "-"}
                        </td>
                        <td className="px-3 py-2 text-text-secondary">{lead.toolSlug || "-"}</td>
                        <td className="px-3 py-2">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-3 py-2 text-xs text-text-secondary">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Quick Links ── */}
          <div className={sectionClass}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Admin Modules</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ADMIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-3 rounded-sm border border-slate/15 bg-off-white p-4 transition-colors hover:border-accent/30 hover:bg-accent/5"
                >
                  <span className="mt-0.5 text-lg" aria-hidden="true">{link.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-deep-navy group-hover:text-accent">{link.label}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {/* ── System Status ── */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">System Status</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-sm border border-emerald/20 bg-emerald/5 p-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-deep-navy">Authentication</p>
              <p className="text-xs text-text-secondary">Firebase Auth operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-sm border border-emerald/20 bg-emerald/5 p-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-deep-navy">Database</p>
              <p className="text-xs text-text-secondary">Firestore connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-sm border border-emerald/20 bg-emerald/5 p-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-deep-navy">Storage</p>
              <p className="text-xs text-text-secondary">Firebase Storage ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
