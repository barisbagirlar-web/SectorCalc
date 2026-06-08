"use client";

import { useState, type FormEvent } from "react";
import { VerificationSeal } from "@/components/verification/VerificationSeal";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import {
  buildPublicVerificationDisplay,
  parseVerificationId,
} from "@/lib/verification/verification-seal";
import { VERIFICATION_DISCLAIMER } from "@/lib/verification/verification-types";

export function VerifyPageClient() {
  const [verificationId, setVerificationId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedId(verificationId.trim());
  };

  const status = submittedId ? parseVerificationId(submittedId) : null;
  const display =
    submittedId && status && status !== "invalid_id"
      ? buildPublicVerificationDisplay({
          verificationId: submittedId,
          formulaContractSlug: "—",
          generatedAt: "—",
          validationStatus: "lookup_pending",
        })
      : submittedId
        ? buildPublicVerificationDisplay({
            verificationId: submittedId,
            formulaContractSlug: "—",
            generatedAt: "—",
            validationStatus: "invalid",
            reportHash: "—",
          })
        : null;

  return (
    <PageLayout>
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <p className="sc-craft-eyebrow">Verification</p>
          <h1 className="sc-craft-headline">Public report verify</h1>
          <p className="sc-craft-lead max-w-3xl">{VERIFICATION_DISCLAIMER}</p>
        </Container>
      </section>
      <section className="sc-craft-section overflow-x-hidden">
        <Container size="narrow" className="sc-craft-container min-w-0 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="sc-industrial-panel sc-ledger-panel space-y-4 p-4 sm:p-5"
            noValidate
          >
            <label htmlFor="verification-id" className="sc-industrial-field__label">
              Verification ID
            </label>
            <input
              id="verification-id"
              type="text"
              value={verificationId}
              onChange={(event) => setVerificationId(event.target.value)}
              placeholder="scv_..."
              className="sc-ledger-input-underline w-full"
              autoComplete="off"
            />
            <button type="submit" className="sc-cta-primary">
              Check format
            </button>
          </form>

          {display ? <VerificationSeal display={display} /> : null}

          {submittedId && status === "invalid_id" ? (
            <p className="text-sm text-crit-red" role="alert">
              Invalid verification ID format. Expected pattern: scv_ followed by 24 hex characters.
            </p>
          ) : null}

          {submittedId && status === "lookup_pending" ? (
            <p className="text-sm text-body-charcoal">
              Database lookup is not enabled in this release. Format validation passed; matching
              record lookup requires a secure backend in a future patch.
            </p>
          ) : null}
        </Container>
      </section>
    </PageLayout>
  );
}
