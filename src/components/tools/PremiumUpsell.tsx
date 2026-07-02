"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "@/lib/i18n-stub";
import { Link } from "@/i18n/routing";

export function PremiumUpsell() {
  const t = useTranslations("generatedTool.premiumUpsell");

  return (
    <aside className="sc-premium-upsell" aria-label={t("ariaLabel")}>
      <Sparkles className="sc-premium-upsell__icon" aria-hidden="true" />
      <p className="sc-premium-upsell__copy">
        {t("message")}{" "}
        <Link href="/pricing" className="sc-premium-upsell__cta">
          {t("cta")}
        </Link>
      </p>
    </aside>
  );
}
