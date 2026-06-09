"use client";

import { useState } from "react";
import { LEAD_CAPTURE_CONTRACTS } from "@/lib/commercial/commercial-model";
import { Container } from "@/components/ui/Container";

export function LeadCaptureCta() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="sc-pro-section sc-pro-section--border bg-bg-secondary">
      <Container className="sc-pro-container" size="narrow">
        <p className="sc-pro-eyebrow">Lead capture</p>
        <h2 className="sc-pro-title sc-pro-title--compact">Request access or talk to us</h2>
        <p className="sc-pro-lead mt-3">
          UI-only contract — no backend wiring, no API keys, no secrets. Submissions are not stored.
        </p>

        {submitted ? (
          <p className="mt-6 rounded-lg border border-border-subtle bg-white p-4 text-sm text-deep-navy">
            Thank you. This preview form does not transmit data. Connect your lead pipeline when ready.
          </p>
        ) : (
          <form
            className="mt-6 space-y-4 rounded-xl border border-border-subtle bg-white p-5"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="block text-sm">
              <span className="font-medium text-deep-navy">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full min-h-[44px] rounded-lg border border-border-subtle px-3 text-sm"
                placeholder="you@company.com"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-deep-navy">Company</span>
              <input
                type="text"
                className="mt-1 w-full min-h-[44px] rounded-lg border border-border-subtle px-3 text-sm"
                placeholder="Optional"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-deep-navy">Intent</span>
              <select className="mt-1 w-full min-h-[44px] rounded-lg border border-border-subtle px-3 text-sm">
                {LEAD_CAPTURE_CONTRACTS.map((contract) => (
                  <option key={contract.intent} value={contract.intent}>
                    {contract.intent.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-deep-navy px-5 text-sm font-semibold text-white sm:w-auto"
            >
              Request early access
            </button>
          </form>
        )}
      </Container>
    </section>
  );
}
