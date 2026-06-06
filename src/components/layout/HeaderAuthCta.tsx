"use client";

import Link from "next/link";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { getAccountHref, getPricingHref } from "@/lib/tools/tool-links";

type HeaderTheme = "light" | "dark";

interface HeaderAuthCtaProps {
  theme?: HeaderTheme;
  onNavigate?: () => void;
}

export function HeaderAuthCta({ theme = "light", onNavigate }: HeaderAuthCtaProps) {
  const { user, isActive, loading } = useUserSubscription();
  const isLight = theme === "light";

  const baseClass = `inline-flex min-h-[44px] items-center text-sm font-semibold ${
    isLight ? "text-[#808080] hover:text-professional-blue" : "text-slate-300 hover:text-white"
  }`;

  const mobileClass = `block min-h-[44px] py-3 text-sm font-semibold ${
    isLight ? "text-professional-blue" : "text-cyan"
  }`;

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
