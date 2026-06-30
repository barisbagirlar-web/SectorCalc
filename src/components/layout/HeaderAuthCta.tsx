"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useUserSubscription, warmUserSubscriptionStore } from "@/lib/features/billing/use-user-subscription";

interface HeaderAuthCtaProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function HeaderAuthCta({ onNavigate, mobile = false }: HeaderAuthCtaProps) {
  const t = useTranslations("nav");
  const { user, loading } = useUserSubscription();

  const linkClass = mobile
    ? "sc-mobile-drawer__link sc-mobile-drawer__link--auth"
    : "apple-nav__link sc-header-auth-link";
  const signUpClass = mobile
    ? "sc-mobile-drawer__link sc-mobile-drawer__link--auth sc-mobile-drawer__link--signup"
    : "sc-header-signup";
  const groupClass = mobile ? "sc-mobile-drawer__auth-group" : "sc-header-auth-group";

  if (loading) {
    return (
      <div className={groupClass}>
        <Link href="/login" prefetch={false} onClick={onNavigate} className={linkClass}>
          {t("login")}
        </Link>
        <Link href="/login?next=/pricing" prefetch={false} onClick={onNavigate} className={signUpClass}>
          {t("signUp")}
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={groupClass}>
        <Link
          href="/login"
          prefetch={false}
          onClick={() => {
            warmUserSubscriptionStore();
            onNavigate?.();
          }}
          className={linkClass}
        >
          {t("login")}
        </Link>
        <Link
          href="/login?next=/pricing"
          prefetch={false}
          onClick={() => {
            warmUserSubscriptionStore();
            onNavigate?.();
          }}
          className={signUpClass}
        >
          {t("signUp")}
        </Link>
      </div>
    );
  }

  return (
    <div className={groupClass}>
      <Link href="/account" prefetch={false} onClick={onNavigate} className={linkClass}>
        {t("account")}
      </Link>
    </div>
  );
}
