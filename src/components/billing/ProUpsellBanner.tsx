"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { SparklesIcon } from "@heroicons/react/24/solid";

export function ProUpsellBanner() {
  const t = useTranslations("purchaseSuccess");

  return (
    <div className="mt-8 rounded-2xl border border-cyan/20 bg-bg-primary p-6">
      <div className="mb-3 flex items-center gap-3">
        <SparklesIcon className="h-6 w-6 text-accent-teal" aria-hidden />
        <h3 className="text-lg font-bold text-white">{t("proUpsellTitle")}</h3>
      </div>
      <p className="mb-4 text-sm text-white/70">{t("proUpsellBody")}</p>
      <Link
        href="/pricing"
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-accent-teal px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-accent-teal/90"
      >
        {t("proUpsellCta")}
      </Link>
    </div>
  );
}
