"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "@/lib/i18n-stub";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { SingleVerdictCheckoutButton } from "@/components/subscription/SingleVerdictCheckoutButton";
import { SINGLE_VERDICT_PRICE } from "@/lib/pricing/plan-catalog";
import { SECTORCALC_PRO_PRICE_LABEL } from "@/lib/pricing/sectorcalc-pro";

interface IntelligenceSubscriptionGateProps {
  toolSlug: string;
  returnPath?: string;
}

export function IntelligenceSubscriptionGate({
  toolSlug,
  returnPath = `/tools/premium/${toolSlug}`,
}: IntelligenceSubscriptionGateProps) {
  const t = useTranslations("osGate");

  return (
    <div className="ind-os-panel font-mono" role="status">
      <div className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5 text-body-charcoal" aria-hidden />
        <span className="ind-os-panel__label">{t("label")}</span>
      </div>
      <p className="mt-2 text-xs text-premium-velvet">{t("message")}</p>
      <p className="mt-1 text-[10px] text-body-charcoal">
        {t("single", { price: String(SINGLE_VERDICT_PRICE) })} ·{" "}
        {t("pro", { price: SECTORCALC_PRO_PRICE_LABEL })}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <SingleVerdictCheckoutButton
          toolSlug={toolSlug}
          returnPath={returnPath}
          source="intelligence_gate"
          label={t("singleCta", { price: SINGLE_VERDICT_PRICE })}
          showTrust={false}
          buttonClassName="ind-os-btn-secondary !w-full !text-xs"
        />
        <ProCheckoutButton
          label={t("proCta", { price: SECTORCALC_PRO_PRICE_LABEL })}
          source="intelligence_gate"
          toolSlug={toolSlug}
          className="ind-os-btn-action sc-btn-primary !w-full !text-xs"
        />
      </div>
    </div>
  );
}
