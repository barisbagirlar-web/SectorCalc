"use client";

import { useTranslations } from "next-intl";

export function EmptyPurchases() {
  const t = useTranslations("emptyStates.purchases");

  return (
    <section className="mb-8 rounded-xl border border-border-subtle bg-white p-6">
      <h2 className="text-lg font-bold text-text-primary">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-slate">{t("body")}</p>
    </section>
  );
}
