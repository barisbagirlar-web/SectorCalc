"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

interface EmptyReportsProps {
  hasPurchaseCredits?: boolean;
}

export function EmptyReports({ hasPurchaseCredits = false }: EmptyReportsProps) {
  const t = useTranslations("emptyStates.reports");

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate/30 bg-off-white/50 p-12 text-center dark:border-slate-600 dark:bg-slate-800/50">
      <div className="mb-4 rounded-full bg-slate/10 p-4 dark:bg-slate-700">
        <DocumentTextIcon
          className="h-8 w-8 text-slate dark:text-slate-400"
          aria-hidden
        />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-deep-navy dark:text-white">
        {t("title")}
      </h3>
      <p className="mb-6 max-w-md text-sm text-slate dark:text-slate-400">
        {hasPurchaseCredits ? t("bodyWithCredits") : t("body")}
      </p>
      <Link
        href={hasPurchaseCredits ? "/premium-tools" : "/free-tools"}
        className="inline-flex min-h-[44px] items-center rounded-xl bg-professional-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-professional-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue focus-visible:ring-offset-2 dark:bg-cyan dark:text-deep-navy dark:hover:bg-cyan/90"
      >
        {hasPurchaseCredits ? t("ctaPremium") : t("ctaFree")}
        <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
