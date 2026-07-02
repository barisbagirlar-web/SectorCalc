"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n-stub";
import { ProFeatureNotice } from "@/components/premium/ProFeatureNotice";
import { getPricingHref } from "@/lib/features/tools/tool-links";
import { getRevenueToolByPaidSlug } from "@/lib/features/tools/revenue-tools";

type ProLockedActionProps = {
  readonly paidSlug: string;
  readonly messageKey: "lockedExport" | "fullReportRequiresPro";
  readonly children?: ReactNode;
};

export function ProLockedAction({ paidSlug, messageKey, children }: ProLockedActionProps) {
  const t = useTranslations("premiumAccess");
  const tool = getRevenueToolByPaidSlug(paidSlug);
  const pricingHref = tool ? getPricingHref(tool, "pro") : getPricingHref(undefined, "pro");

  return (
    <div className="sc-pro-locked-action min-w-0 space-y-3 rounded-sm border border-dashed border-border-subtle bg-bg-subtle p-4">
      <ProFeatureNotice messageKey={messageKey} />
      {children ? <div className="pointer-events-none opacity-50">{children}</div> : null}
      <Link href={pricingHref} className="sc-cta-primary inline-flex min-h-[44px] items-center justify-center px-4">
        {t("getPro")}
      </Link>
    </div>
  );
}
