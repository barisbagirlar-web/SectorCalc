"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { stripLocalePrefix } from "@/i18n/locales";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";

type Props = {
  readonly slug: string;
  readonly locale: string;
};

export function PremiumToolReviewSafeState({ slug, locale }: Props) {
  const t = useTranslations("runtimeReadiness");
  const pathname = usePathname();
  const routePath = stripLocalePrefix(pathname);

  return (
    <div
      className="sc-industrial-panel mt-6 rounded-sm border border-amber/30 bg-premium-surface p-5 sm:p-6"
      data-runtime-readiness-safe-state="true"
      data-runtime-readiness-slug={slug}
      role="status"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-amber">{t("eyebrow")}</p>
      <h2 className="mt-2 text-lg font-bold text-premium-velvet">{t("title")}</h2>
      <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{t("body")}</p>
      <div className="mt-5 flex flex-col gap-3">
        <Link
          href="/premium-tools"
          className="sc-cta-primary inline-flex min-h-[44px] w-full items-center justify-center px-4 text-sm sm:w-auto"
        >
          {t("browsePremiumCta")}
        </Link>
        <CalculationFeedbackButton
          toolSlug={slug}
          toolType="premium"
          locale={locale}
          routePath={routePath}
        />
      </div>
    </div>
  );
}
