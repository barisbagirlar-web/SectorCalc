"use client";

import Link from "next/link";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { SUPER_ADMIN_EMAIL } from "@/lib/infrastructure/firebase/auth";

interface MobileCTAProps {
  isAuthenticated: boolean;
  onClose: () => void;
}

export function MobileCTA({ isAuthenticated, onClose }: MobileCTAProps) {
  const { user } = useUserSubscription();
  const isSuperAdmin = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;

  return (
    <div className="sc-mnav-cta-block">
      {isSuperAdmin && (
        <Link
          href="/admin"
          className="sc-mnav-cta-primary"
          onClick={onClose}
          style={{ background: "var(--accent, #BD5D3A)", color: "#fff" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Admin Panel
        </Link>
      )}
      {isAuthenticated ? (
        <Link
          href="/account"
          className="sc-mnav-cta-primary"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          My Account
        </Link>
      ) : (
        <>
          <Link href="/signup" className="sc-mnav-cta-primary" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Get started
          </Link>
          <Link href="/login" className="sc-mnav-cta-secondary" onClick={onClose}>
            Sign in
          </Link>
        </>
      )}
      <div className="sc-mnav-cta-trust">
        <p>
          <strong>Trusted by engineers worldwide</strong>
          <br />
          Accurate &bull; Reliable &bull; Built for professionals
        </p>
      </div>
    </div>
  );
}
