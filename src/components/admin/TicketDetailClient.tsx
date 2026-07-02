"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";

type Ticket = {
  id: string;
  email: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Reply = {
  id: string;
  authorId?: string;
  authorEmail?: string;
  isAdmin: boolean;
  content: string;
  createdAt: string;
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  critical: "bg-red-100 text-red-800",
};

const STATUS_BADGES: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-gray-100 text-gray-600",
  closed: "bg-gray-100 text-gray-400",
};

const STATUS_OPTIONS = ["open", "in_progress", "resolved", "closed"] as const;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type Props = { ticketId: string };

export function TicketDetailClient({ ticketId }: Props) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyContent, setReplyContent] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch ticket");
      }

      const data = await res.json();
      setTicket(data.ticket as Ticket);
      setReplies(data.replies as Reply[]);
      setNewStatus((data.ticket as Ticket).status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!replyContent.trim() || replyContent.trim().length < 1) return;

    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) return;

    setSubmitting(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: replyContent.trim(), status: newStatus !== ticket?.status ? newStatus : undefined }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as Record<string, string>).details ?? "Failed to submit reply");
      }

      setReplyContent("");
      await fetchTicket();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <AdminAuthBar />
        <p className="text-sm text-text-secondary">Loading ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <AdminAuthBar />
        <p className="text-sm text-amber" role="alert">{error ?? "Ticket not found."}</p>
        <Link href="/admin/tickets" className="text-sm font-semibold text-professional-blue hover:underline">← Back to tickets</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminAuthBar />

      <Link href="/admin/tickets" className="inline-block text-sm font-semibold text-professional-blue hover:underline">← Back to tickets</Link>

      {/* Ticket header */}
      <div className="rounded-sm border border-slate/20 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-deep-navy">{ticket.subject}</h2>
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_COLORS[ticket.priority] ?? ""}`}>{ticket.priority}</span>
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_BADGES[ticket.status] ?? ""}`}>{ticket.status.replace("_", " ")}</span>
        </div>

        <div className="space-y-1 text-sm text-text-secondary mb-4">
          <p><span className="font-medium text-deep-navy">From:</span> {ticket.email}</p>
          <p><span className="font-medium text-deep-navy">Ticket ID:</span> #{ticket.id.slice(0, 8)}</p>
          <p><span className="font-medium text-deep-navy">Created:</span> {formatDate(ticket.createdAt)}</p>
          <p><span className="font-medium text-deep-navy">Updated:</span> {formatDate(ticket.updatedAt)}</p>
        </div>

        <div className="rounded-sm bg-off-white p-4 text-sm text-deep-navy leading-relaxed whitespace-pre-wrap">
          {ticket.message}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="rounded-sm border border-slate/20 bg-white p-6 shadow-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">Replies ({replies.length})</h3>
          <div className="space-y-4">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className={`rounded-sm p-4 text-sm ${
                  reply.isAdmin ? "bg-professional-blue/5 border border-professional-blue/20" : "bg-off-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-deep-navy">
                    {reply.isAdmin ? "Admin" : reply.authorEmail ?? "User"}
                  </span>
                  <span className="text-xs text-text-secondary">{formatDate(reply.createdAt)}</span>
                </div>
                <p className="text-deep-navy leading-relaxed whitespace-pre-wrap">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply form + status changer - single transaction */}
      <div className="rounded-sm border border-slate/20 bg-white p-6 shadow-card">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">Add Reply</h3>

        <form onSubmit={handleSubmitReply} className="space-y-4">
          <div>
            <label htmlFor="reply-status" className="block text-sm font-medium text-deep-navy mb-1">Update status</label>
            <select
              id="reply-status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm w-full"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reply-content" className="block text-sm font-medium text-deep-navy mb-1">Reply message</label>
            <textarea
              id="reply-content"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
              minLength={1}
              maxLength={5000}
              rows={4}
              placeholder="Type your reply..."
              className="w-full rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm resize-y"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !replyContent.trim()}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Reply"}
            </button>
            {submitError && (
              <p className="text-sm text-amber" role="alert">{submitError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
