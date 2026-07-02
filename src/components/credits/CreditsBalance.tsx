"use client";

import { useCredits } from "@/hooks/useCredits";
import { useTranslations } from "@/lib/i18n-stub";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";

export function CreditsBalance() {
  const t = useTranslations("credits");
  const { user } = useUserSubscription();
  const { credits, loading } = useCredits();

  if (!user) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-body-charcoal">
      {t("balanceLabel")}: {loading || credits === null ? "…" : credits}
    </p>
  );
}
