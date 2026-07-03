"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n-stub";
import { ArrowRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

interface EmptyReportsProps {
 hasPurchaseCredits?: boolean;
}

export function EmptyReports({ hasPurchaseCredits = false }: EmptyReportsProps) {
 const t = useTranslations("emptyStates.reports");

 return (
 <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-slate/30 bg-bg-subtle/50 p-12 text-center">
 <div className="mb-4 rounded-full bg-slate/10 p-4">
 <DocumentTextIcon
 className="h-8 w-8 text-text-secondary"
 aria-hidden
 />
 </div>
 <h3 className="mb-2 text-lg font-semibold text-text-primary">
 {t("title")}
 </h3>
 <p className="mb-6 max-w-md text-sm text-text-secondary">
 {hasPurchaseCredits ? t("bodyWithCredits") : t("body")}
 </p>
 <Link
 href={hasPurchaseCredits ? "/free-tools" : "/free-tools"}
 className="inline-flex min-h-[44px] items-center rounded-sm bg-accent-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-navy focus-visible:ring-offset-2"
 >
 {hasPurchaseCredits ? t("ctaPremium") : t("ctaFree")}
 <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden />
 </Link>
 </div>
 );
}
