"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { startCreditCheckoutSession } from "@/lib/billing/create-credit-checkout-session";
import { CREDIT_PACKAGE_OPTIONS } from "@/lib/credits/credit-packages";

export function BuyCreditsButton() {
  const t = useTranslations("credits");
  const locale = useLocale();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buy = async (packageId: string) => {
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
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CREDIT_PACKAGE_OPTIONS.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => void buy(pkg.id)}
            disabled={loadingId !== null}
            className="sc-cta-secondary min-h-[44px] px-3 py-2 text-sm"
          >
            {loadingId === pkg.id
              ? t("loading")
              : t("packageLabel", { credits: pkg.credits, price: pkg.priceUsd.toFixed(2) })}
          </button>
        ))}
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
