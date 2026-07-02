"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n-stub";
import { SparklesIcon } from "@heroicons/react/24/solid";

export function ProUpsellBanner() {
 const t = useTranslations("purchaseSuccess");

 return (
 <div className="mt-8 rounded-sm border border-cyan/20 bg-bg-primary p-6">
 <div className="mb-3 flex items-center gap-3">
 <SparklesIcon className="h-6 w-6 text-deep-navy" aria-hidden />
 <h3 className="text-lg font-bold text-premium-velvet">{t("proUpsellTitle")}</h3>
 </div>
 <p className="mb-4 text-sm text-body-charcoal">{t("proUpsellBody")}</p>
 <Link
 href="/pricing"
 className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-deep-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
 >
 {t("proUpsellCta")}
 </Link>
 </div>
 );
}
