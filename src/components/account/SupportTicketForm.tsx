"use client";

import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import { useState } from "react";

const HONEYPOT_FIELD = "_hp_confirm_email";

type TicketStatus = "idle" | "sending" | "success" | "error";

export function SupportTicketForm() {
  const [status, setStatus] = useState<TicketStatus>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) {
      setStatus("error");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          subject: formData.get("subject"),
          message: formData.get("message"),
          priority: formData.get("priority"),
          [HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details ?? "Failed to submit ticket");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="sc-account-hub__section support-ticket">
      <h2 className="sc-account-hub__section-title">Open Support Ticket</h2>

      <form onSubmit={handleSubmit} className="support-ticket__form">
        {/* Honeypot - invisible to users, catches bots */}
        <input
          type="text"
          name={HONEYPOT_FIELD}
          autoComplete="off"
          tabIndex={-1}
          className="support-ticket__honeypot"
          aria-hidden="true"
        />

        <div className="support-ticket__field">
          <label htmlFor="ticket-subject" className="support-ticket__label">Subject</label>
          <input
            id="ticket-subject"
            name="subject"
            type="text"
            required
            minLength={5}
            maxLength={200}
            placeholder="Brief summary of your issue"
            className="support-ticket__input"
          />
        </div>

        <div className="support-ticket__field">
          <label htmlFor="ticket-priority" className="support-ticket__label">Priority</label>
          <select
            id="ticket-priority"
            name="priority"
            defaultValue="normal"
            className="support-ticket__select"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="support-ticket__field">
          <label htmlFor="ticket-message" className="support-ticket__label">Message</label>
          <textarea
            id="ticket-message"
            name="message"
            required
            minLength={20}
            maxLength={5000}
            rows={5}
            placeholder="Describe your issue in detail..."
            className="support-ticket__textarea"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="sc-cta-primary support-ticket__submit"
        >
          {status === "sending" ? "Submitting..." : "Submit Ticket"}
        </button>

        {status === "success" && (
          <p className="support-ticket__message support-ticket__message--success" role="status">
            Ticket submitted successfully.
          </p>
        )}
        {status === "error" && (
          <p className="support-ticket__message support-ticket__message--error" role="alert">
            Failed to submit. Please try again.
          </p>
        )}
      </form>
    </section>
  );
}
