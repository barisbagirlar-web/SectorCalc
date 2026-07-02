"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n-stub";
import { useMemo } from "react";
import { useClientSearchParams } from "@/lib/ui-shared/navigation/use-client-search-params";
import { PlanCheckoutAction } from "@/components/pricing/PlanCheckoutAction";
import { PRICING_MATRIX_PLANS, PRICING_MATRIX_ROWS } from "@/data/pricing-matrix";
import { buildPricingPlans } from "@/data/pricing-plans";
import { getRevenueToolByPaidSlug } from "@/lib/features/tools/revenue-tools";

function CellValue({ value }: { value: boolean | "partial" }) {
  if (value === true) {
    return <span className="text-safe-green">✓</span>;
  }
  if (value === "partial") {
    return <span className="text-warn-amber">~</span>;
  }
  return <span className="text-body-charcoal">—</span>;
}

export function PricingFeatureMatrix() {
  const t = useTranslations();
  const searchParams = useClientSearchParams();
  const checkoutToolSlug = useMemo(() => {
    const tool = searchParams.get("tool");
    return tool && getRevenueToolByPaidSlug(tool) ? tool : undefined;
  }, [searchParams]);

  const plans = useMemo(() => buildPricingPlans(t), [t]);
  const proPlan = plans.find((p) => p.id === "pro");
  const teamPlan = plans.find((p) => p.id === "team");
  const freePlan = plans.find((p) => p.id === "free");

  return (
    <div className="overflow-x-auto font-sans text-sm">
      <table className="w-full min-w-[640px] border-collapse border border-technical-gray bg-white">
        <thead>
          <tr className="border-b border-technical-gray bg-industrial-matte">
            <th className="border-r border-technical-gray p-2 text-left text-xs font-semibold text-body-charcoal">
              {t("pricing.matrix.featureCol")}
            </th>
            {PRICING_MATRIX_PLANS.map((plan) => (
              <th
                key={plan.column}
                className="border-r border-technical-gray p-2 text-left last:border-r-0"
              >
                <p className="text-xs font-semibold text-body-charcoal">{t(plan.nameKey)}</p>
                <p className="mt-1 text-sm font-semibold text-premium-velvet">{t(plan.priceKey)}</p>
                {plan.periodKey ? (
                  <p className="text-[10px] text-body-charcoal">{t(plan.periodKey)}</p>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRICING_MATRIX_ROWS.map((row) => (
            <tr key={row.id} className="border-b border-technical-gray">
              <td className="border-r border-technical-gray p-2 text-xs text-body-charcoal">
                {t(row.labelKey)}
              </td>
              <td className="border-r border-technical-gray p-2 text-center">
                <CellValue value={row.free} />
              </td>
              <td className="border-r border-technical-gray p-2 text-center">
                <CellValue value={row.pro} />
              </td>
              <td className="p-2 text-center">
                <CellValue value={row.enterprise} />
              </td>
            </tr>
          ))}
          <tr>
            <td className="border-r border-technical-gray p-2 text-xs text-body-charcoal">
              {t("pricing.matrix.action")}
            </td>
            <td className="border-r border-technical-gray p-2">
              {freePlan?.primaryHref ? (
                <Link
                  href={freePlan.primaryHref}
                  className="text-xs font-semibold text-premium-velvet hover:text-body-charcoal"
                >
                  {freePlan.primaryCta}
                </Link>
              ) : null}
            </td>
            <td className="border-r border-technical-gray p-2">
              {proPlan ? (
                <PlanCheckoutAction
                  plan={proPlan}
                  checkoutToolSlug={checkoutToolSlug}
                  highlighted={false}
                  className="!min-h-[32px] !w-full !px-2 !py-1 !text-xs"
                />
              ) : null}
            </td>
            <td className="p-2">
              {teamPlan ? (
                <PlanCheckoutAction
                  plan={teamPlan}
                  checkoutToolSlug={checkoutToolSlug}
                  highlighted={false}
                  className="!min-h-[32px] !w-full !px-2 !py-1 !text-xs"
                />
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
