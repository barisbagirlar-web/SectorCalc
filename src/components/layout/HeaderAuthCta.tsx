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

  const linkClass = mobile ? "apple-nav__dropdown-link" : "apple-nav__link sc-header-auth-link";
  const signUpClass = mobile
    ? "apple-nav__dropdown-link sc-header-signup"
    : "sc-header-signup";
  const ctaClass = mobile
    ? "apple-nav__dropdown-link get-pro-btn get-pro-btn--mobile"
    : "get-pro-btn";

  if (loading) {
    return (
      <div className="sc-header-auth-group">
        <Link href="/login" prefetch={false} onClick={onNavigate} className={linkClass}>
          {t("login")}
        </Link>
        <Link href="/login?next=/pricing" prefetch={false} onClick={onNavigate} className={signUpClass}>
          {t("signUp")}
        </Link>
        <Link href="/pricing" prefetch={false} onClick={onNavigate} className={ctaClass}>
          {t("getPro")}
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="sc-header-auth-group">
        <Link href="/login" prefetch={false} onClick={onNavigate} className={linkClass}>
          {t("login")}
        </Link>
        <Link href="/login?next=/pricing" prefetch={false} onClick={onNavigate} className={signUpClass}>
          {t("signUp")}
        </Link>
        <Link href="/pricing" prefetch={false} onClick={onNavigate} className={ctaClass}>
          {t("getPro")}
        </Link>
      </div>
    );
  }

  return (
    <div className="sc-header-auth-group">
      <Link href="/account" prefetch={false} onClick={onNavigate} className={linkClass}>
        {t("account")}
      </Link>
      <Link href="/account/reports" prefetch={false} onClick={onNavigate} className={linkClass}>
        {t("myReports")}
      </Link>
    </div>
  );
}
