"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";

interface HeaderAuthCtaProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function HeaderAuthCta({ onNavigate, mobile = false }: HeaderAuthCtaProps) {
  const t = useTranslations("nav");
  const { user, loading } = useUserSubscription();

  const linkClass = mobile ? "apple-nav__dropdown-link" : "apple-nav__link";
  const ctaClass = mobile
    ? "apple-nav__dropdown-link font-semibold text-sc-copper"
    : "sc-pro-header-cta sc-cta-primary";

  if (loading) {
    return (
      <>
        <Link href="/login" prefetch={false} onClick={onNavigate} className={linkClass}>
          {t("login")}
        </Link>
        <Link href="/pricing" prefetch={false} onClick={onNavigate} className={ctaClass}>
          {t("getPro")}
        </Link>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Link href="/login" prefetch={false} onClick={onNavigate} className={linkClass}>
          {t("login")}
        </Link>
        <Link href="/pricing" prefetch={false} onClick={onNavigate} className={ctaClass}>
          {t("getPro")}
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/account" prefetch={false} onClick={onNavigate} className={linkClass}>
        {t("account")}
      </Link>
      <Link href="/account/reports" prefetch={false} onClick={onNavigate} className={linkClass}>
        {t("myReports")}
      </Link>
    </>
  );
}
