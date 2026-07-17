"use client";

import { useCallback, useState } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";
import { usePathname, useRouter } from "next/navigation";
import { BRAND_ASSETS } from "@/config/brand";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { loading, user, isAdmin, signOut } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/admin/login");
    } finally {
      setSigningOut(false);
    }
  }, [signOut, router]);

  return (
    <div className="min-h-screen bg-[#E8E6DE]">
      {/* ── Admin Top Bar ── */}
      {!isLoginPage && (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1A1915]">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2 no-underline">
                <img
                  src={BRAND_ASSETS.logo.headerDefault}
                  alt="SectorCalc"
                  className="h-6 w-auto brightness-0 invert"
                />
                <span className="hidden text-sm font-bold text-white sm:inline">Admin Panel</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {loading ? (
                <span className="text-xs text-white/50">Loading...</span>
              ) : user && isAdmin ? (
                <>
                  <span className="hidden truncate text-xs text-white/60 sm:inline max-w-[180px]">
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                    className="inline-flex min-h-[36px] items-center justify-center rounded-sm border border-white/20 bg-white/10 px-3 text-xs font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                  >
                    {signingOut ? "..." : "Sign out"}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </header>
      )}

      {/* ── Main Content ── */}
      {children}
    </div>
  );
}
