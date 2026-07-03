"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n-stub";
import { stripLocalePrefix } from "@/i18n/locales";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";

type Props = {
  readonly slug: string;
  readonly locale: string;
  readonly findings?: readonly string[];
  readonly showDebugFindings?: boolean;
};

export function ToolSafeReviewState({
  slug,
  locale,
  findings,
  showDebugFindings = false,
}: Props) {
  const t = useTranslations("runtimeTrust");
  const pathname = usePathname();
  const routePath = stripLocalePrefix(pathname);
  const showFindings =
    showDebugFindings &&
    process.env.NODE_ENV !== "production" &&
    findings &&
    findings.length > 0;

  return (
    <div
      className="sc-industrial-panel mt-6 rounded-sm border border-amber/30 bg-premium-surface p-5 sm:p-6"
      data-runtime-trust-safe-state="true"
      data-runtime-trust-slug={slug}
      role="status"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-amber">{t("eyebrow")}</p>
      <h2 className="mt-2 text-lg font-bold text-premium-velvet">{t("title")}</h2>
      <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{t("body")}</p>
      {showFindings ? (
        <ul
          className="mt-4 list-disc space-y-1 pl-5 text-xs text-body-charcoal/80"
          data-runtime-trust-findings="true"
        >
          {findings.map((finding) => (
            <li key={finding}>{finding}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-5 flex flex-col gap-3">
        <Link
          href="/free-tools"
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
