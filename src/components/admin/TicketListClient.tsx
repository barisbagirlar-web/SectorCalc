"use client";

import Link from "@/lib/ui-shared/navigation/next-link";
import { useCallback, useEffect, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";

type Ticket = {
  id: string;
  email: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type FilterState = {
  status: string;
  priority: string;
  search: string;
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  critical: "bg-red-100 text-red-800",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-gray-100 text-gray-600",
  closed: "bg-gray-100 text-gray-400",
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function TicketListClient() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ status: "", priority: "", search: "" });

  const fetchTickets = useCallback(async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`/api/admin/tickets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await res.json();
      setTickets(data.tickets as Ticket[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className="space-y-6">
      <AdminAuthBar />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          className="rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm"
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="Search subject or email..."
          className="rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm min-w-[240px]"
        />

        <button
          type="button"
          onClick={() => fetchTickets()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white"
        >
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-text-secondary">Loading tickets...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm font-medium text-amber" role="alert">{error}</p>
      )}

      {/* Ticket table */}
      {!loading && !error && tickets.length === 0 && (
        <p className="text-sm text-text-secondary">No tickets found.</p>
      )}

      {!loading && tickets.length > 0 && (
        <div className="overflow-x-auto rounded-sm border border-slate/20 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-off-white text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-off-white/50">
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    #{ticket.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-deep-navy">{ticket.email}</td>
                  <td className="px-4 py-3 max-w-[240px] truncate text-deep-navy font-medium">
                    {ticket.subject}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_COLORS[ticket.priority] ?? "bg-gray-100 text-gray-700"}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[ticket.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tickets/${ticket.id}`}
                      className="text-sm font-semibold text-professional-blue hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
