"use client";

import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { getLoginHref } from "@/lib/features/tools/tool-links";
import type { ReactNode } from "react";

interface ProToolPaywallGateProps {
  children: ReactNode;
  toolName: string;
}

/**
 * Client-side paywall gate.
 * Shows a sign-in prompt for unauthenticated users instead of the form.
 * Only renders children (the PRO calculator form) when authenticated.
 */
export function ProToolPaywallGate({ children, toolName }: ProToolPaywallGateProps) {
  const { user, loading } = useUserSubscription();

  // While auth state is loading, show a minimal skeleton
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Checking authentication"
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          padding: "2rem",
          background: "#F0EEE6",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            height: "1.8rem",
            width: "40%",
            background: "#E0DDD4",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: "4rem",
            background: "#fff",
            borderRadius: "6px",
            border: "1px solid #E0DDD4",
          }}
          className="skeleton-pulse"
        />
        <style>{`
          @keyframes skeletonPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
          .skeleton-pulse { animation: skeletonPulse 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // Not authenticated — show sign-in prompt
  if (!user) {
    const loginHref = getLoginHref(`/tools/pro/${encodeURIComponent(toolName)}`);

    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "3rem auto",
          padding: "2.5rem",
          background: "#F0EEE6",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Barlow', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1A1915",
            marginTop: 0,
            marginBottom: "0.75rem",
          }}
        >
          Sign in to access this PRO calculator
        </h2>

        <p
          style={{
            color: "#4A4A46",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          {toolName} is a premium decision-support tool. Sign in or create an
          account to use it. PRO key packs are available from your dashboard.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={loginHref}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "#BD5D3A",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Sign in
          </a>

          <a
            href="/signup"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              background: "#1A1915",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Create account
          </a>
        </div>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#888",
            fontStyle: "italic",
            marginTop: "1.5rem",
            lineHeight: 1.5,
          }}
        >
          Technical simulation for engineering decision support. Results are
          not a substitute for professional engineering review, legal advice,
          or regulatory compliance certification.
        </p>
      </div>
    );
  }

  // Authenticated — render the calculator form
  return <>{children}</>;
}
