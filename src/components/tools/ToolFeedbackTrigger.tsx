"use client";

import { useState } from "react";
import { MessageSquareWarning, Send, Loader2 } from "lucide-react";

interface ToolFeedbackTriggerProps {
  toolSlug: string;
}

export function ToolFeedbackTrigger({ toolSlug }: ToolFeedbackTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length < 5) return;
    
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/tool-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          message,
          issueType: "user_report",
        }),
      });

      if (!res.ok) {
        throw new Error("Feedback failed");
      }
      
      setStatus("success");
      setMessage("");
      setTimeout(() => setIsOpen(false), 3000);
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 flex items-center gap-2 text-sm text-body-charcoal/70 transition-colors hover:text-accent-terracotta"
      >
        <MessageSquareWarning className="h-4 w-4" />
        Report an issue or suggest an improvement
      </button>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-border-subtle bg-surface-cream p-4">
      <h4 className="mb-3 text-sm font-semibold text-body-charcoal">Report Issue / Suggestion</h4>
      {status === "success" ? (
        <p className="text-sm text-green-700">Thank you for your feedback! We will review it shortly.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue with the result or your suggestion..."
            className="w-full rounded-md border border-border-subtle bg-white px-3 py-2 text-sm text-body-charcoal focus:border-accent-terracotta focus:outline-none focus:ring-1 focus:ring-accent-terracotta"
            rows={3}
            disabled={isSubmitting}
            required
            minLength={5}
          />
          {status === "error" && (
            <p className="text-xs text-red-600">Failed to send. Please try again.</p>
          )}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-body-charcoal/70 hover:text-body-charcoal"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || message.length < 5}
              className="flex items-center gap-2 rounded-md bg-premium-velvet px-4 py-2 text-sm text-white transition-colors hover:bg-premium-velvet/90 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
