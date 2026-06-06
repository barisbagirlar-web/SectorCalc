"use client";

import { useTranslations } from "next-intl";

export function EmptyPurchases() {
  const t = useTranslations("emptyStates.purchases");

  return (
    <section className="mb-8 rounded-xl border border-slate/15 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
      <h2 className="text-lg font-bold text-deep-navy dark:text-off-white">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-slate dark:text-slate-400">{t("body")}</p>
    </section>
  );
}
