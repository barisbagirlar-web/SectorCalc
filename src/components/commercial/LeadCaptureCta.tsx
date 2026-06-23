"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LEAD_CAPTURE_CONTRACTS } from "@/lib/commercial/commercial-model";
import { Container } from "@/components/ui/Container";

export function LeadCaptureCta() {
  const t = useTranslations("leadCapture");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="sc-pro-section sc-pro-section--border bg-bg-secondary">
      <Container className="sc-pro-container" size="narrow">
        <p className="sc-pro-eyebrow">{t("eyebrow")}</p>
        <h2 className="sc-pro-title sc-pro-title--compact">{t("title")}</h2>
        <p className="sc-pro-lead mt-3">
          {t("desc")}
        </p>

        {submitted ? (
          <p className="mt-6 rounded-lg border border-border-subtle bg-white p-4 text-sm text-deep-navy">
            {t("success")}
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
              <span className="font-medium text-deep-navy">{t("emailLabel")}</span>
              <input
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full min-h-[44px] rounded-lg border border-border-subtle px-3 text-sm"
                placeholder={t("placeholderEmail")}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-deep-navy">{t("companyLabel")}</span>
              <input
                type="text"
                className="mt-1 w-full min-h-[44px] rounded-lg border border-border-subtle px-3 text-sm"
                placeholder={t("placeholderCompany")}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-deep-navy">{t("intentLabel")}</span>
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
              {t("btnRequest")}
            </button>
          </form>
        )}
      </Container>
    </section>
  );
}
