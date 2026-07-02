"use client";

import { useTranslations } from "@/lib/i18n-stub";

export function EmptyPurchases() {
 const t = useTranslations("emptyStates.purchases");

 return (
 <section className="mb-8 rounded-sm border border-border-subtle bg-white p-6">
 <h2 className="text-lg font-bold text-text-primary">
 {t("title")}
 </h2>
 <p className="mt-2 text-sm text-text-secondary">{t("body")}</p>
 </section>
 );
}
