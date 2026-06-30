"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { startCreditCheckoutSession } from "@/lib/billing/create-credit-checkout-session";
import { CREDIT_PACKAGE_OPTIONS } from "@/lib/credits/credit-packages";

export function CreditsPackages() {
  const t = useTranslations("credits");
  const locale = useLocale();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setLoadingId(packageId);
    setError(null);
    try {
      await startCreditCheckoutSession({ packageId, locale });
    } catch (err) {
      console.error(err);
      setError(t("checkoutError"));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {CREDIT_PACKAGE_OPTIONS.map((pkg) => {
          const perCredit = (pkg.priceUsd / pkg.credits).toFixed(2);
          const isLoading = loadingId === pkg.id;

          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => void handlePurchase(pkg.id)}
              disabled={loadingId !== null}
              className="min-h-[44px] rounded-xl border border-technical-gray bg-white p-4 text-center shadow-sm transition hover:border-[var(--sc-copper)] hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="text-2xl font-bold text-premium-velvet">
                {t("packageCredits", { credits: pkg.credits })}
              </div>
              <div className="mt-1 text-lg text-body-charcoal">
                ${pkg.priceUsd.toFixed(2)}
              </div>
              <div className="mt-2 text-xs text-body-charcoal/70">
                {isLoading
                  ? t("loading")
                  : t("perCreditPrice", { price: perCredit })}
              </div>
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
