"use client";

import { Link } from "@/i18n/routing";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";

interface HeaderAuthCtaProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function HeaderAuthCta({ onNavigate, mobile = false }: HeaderAuthCtaProps) {
  const { user, loading } = useUserSubscription();

  const className = mobile ? "apple-nav__dropdown-link" : "apple-nav__link";

  if (loading) {
    return (
      <Link href="/login" prefetch={true} onClick={onNavigate} className={className}>
        Login
      </Link>
    );
  }

  if (!user) {
    return (
      <Link href="/login" prefetch={true} onClick={onNavigate} className={className}>
        Login
      </Link>
    );
  }

  return (
    <Link href="/account" prefetch={true} onClick={onNavigate} className={className}>
      Account
    </Link>
  );
}
