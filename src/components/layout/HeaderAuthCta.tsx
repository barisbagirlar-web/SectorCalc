"use client";

import Link from "next/link";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { getAccountHref, getPricingHref } from "@/lib/tools/tool-links";

interface HeaderAuthCtaProps {
  onNavigate?: () => void;
}

export function HeaderAuthCta({ onNavigate }: HeaderAuthCtaProps) {
  const { user, isActive, loading } = useUserSubscription();

  const baseClass = "inline-flex min-h-[44px] items-center text-sm font-semibold text-text-secondary hover:text-accent-teal";

  const mobileClass = "block min-h-[44px] py-3 text-sm font-semibold text-accent-teal";

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Link href="/login" onClick={onNavigate} className={onNavigate ? mobileClass : baseClass}>
        Login
      </Link>
    );
  }

  if (isActive) {
    return (
      <Link
        href={getAccountHref()}
        onClick={onNavigate}
        className={onNavigate ? mobileClass : baseClass}
      >
        Account
      </Link>
    );
  }

  return (
    <Link
      href={getPricingHref()}
      onClick={onNavigate}
      className={onNavigate ? mobileClass : baseClass}
    >
      Unlock Pro
    </Link>
  );
}