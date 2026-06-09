"use client";

import { Link } from "@/i18n/routing";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";

interface HeaderAuthCtaProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function HeaderAuthCta({ onNavigate, mobile = false }: HeaderAuthCtaProps) {
  const { user, loading } = useUserSubscription();

  const linkClass = mobile ? "apple-nav__dropdown-link" : "apple-nav__link";

  if (loading) {
    return (
      <>
        <Link href="/login" prefetch={false} onClick={onNavigate} className={linkClass}>
          Login
        </Link>
        {!mobile ? (
          <Link href="/pricing" prefetch onClick={onNavigate} className="sc-pro-header-cta sc-cta-primary">
            Get Pro
          </Link>
        ) : null}
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Link href="/login" prefetch={false} onClick={onNavigate} className={linkClass}>
          Login
        </Link>
        {!mobile ? (
          <Link href="/pricing" prefetch onClick={onNavigate} className="sc-pro-header-cta sc-cta-primary">
            Get Pro
          </Link>
        ) : null}
      </>
    );
  }

  return (
    <Link href="/account" prefetch={false} onClick={onNavigate} className={linkClass}>
      Account
    </Link>
  );
}
