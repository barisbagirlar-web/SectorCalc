"use client";

import { useEffect, useRef } from "react";

export type ToolAccessTier = "FREE" | "PRO" | "ASSISTED";

export interface StickyActionBarConfig {
  /** Primary status text shown on the left */
  status: string;
  /** Primary button label */
  actionLabel: string;
  /** Whether the primary button is disabled */
  actionDisabled: boolean;
  /** Action to perform on primary button click */
  onAction: () => void;
  /** Access tier determines rendering */
  accessTier: ToolAccessTier;
  /** Optional secondary action label (PRO: unlock/sign-in) */
  secondaryLabel?: string;
  /** Optional secondary action */
  onSecondaryAction?: () => void;
}

interface MobileStickyActionBarProps {
  config: StickyActionBarConfig;
}

/**
 * MobileStickyActionBar — fixed bottom action bar for tool pages.
 * Safe-area aware, iOS-friendly. Handles FREE / PRO / ASSISTED tiers.
 */
export function MobileStickyActionBar({ config }: MobileStickyActionBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  // Ensure the page has padding for the action bar
  useEffect(() => {
    const height = barRef.current?.offsetHeight || 88;
    document.documentElement.style.setProperty("--sc-actionbar-height", `${height}px`);
  }, []);

  const { status, actionLabel, actionDisabled, onAction, accessTier } = config;

  return (
    <div
      ref={barRef}
      className="sc-v531-mobile-action-bar"
      data-tier={accessTier.toLowerCase()}
    >
      <span className="sc-v531-mobile-bar-status">{status}</span>
      <button
        type="button"
        className="sc-v531-primary-button"
        disabled={actionDisabled}
        onClick={onAction}
        aria-label={actionLabel}
      >
        {actionLabel}
      </button>
    </div>
  );
}

/**
 * Resolves the sticky action bar state for a given tool tier.
 * Centralizes free/pro/assisted state logic into a single resolver.
 */
export function resolveToolStickyBarState(
  accessTier: ToolAccessTier,
  hasResult: boolean,
  hasSession: boolean,
  isExecuting: boolean,
  clientBlockerCount: number,
  resultLabel: string,
  isAuthenticated: boolean,
  onCalculate: () => void,
  onSignIn: () => void,
  onUnlock: () => void,
  onRequestAssisted: () => void,
): StickyActionBarConfig {
  // FREE tier
  if (accessTier === "FREE") {
    if (isExecuting) {
      return {
        accessTier: "FREE",
        status: "Calculating...",
        actionLabel: "Calculating...",
        actionDisabled: true,
        onAction: () => {},
      };
    }
    if (hasResult) {
      return {
        accessTier: "FREE",
        status: "Results ready",
        actionLabel: "Recalculate",
        actionDisabled: false,
        onAction: onCalculate,
      };
    }
    if (clientBlockerCount > 0) {
      return {
        accessTier: "FREE",
        status: "Inputs need review",
        actionLabel: "Calculate",
        actionDisabled: true,
        onAction: () => {},
      };
    }
    return {
      accessTier: "FREE",
      status: "Ready",
      actionLabel: "Calculate",
      actionDisabled: false,
      onAction: onCalculate,
    };
  }

  // ASSISTED tier — no form, just request dossier
  if (accessTier === "ASSISTED") {
    return {
      accessTier: "ASSISTED",
      status: "Request assisted analysis",
      actionLabel: "Request assisted dossier",
      actionDisabled: false,
      onAction: onRequestAssisted,
    };
  }

  // PRO tier
  if (!isAuthenticated) {
    return {
      accessTier: "PRO",
      status: "Sign in to access",
      actionLabel: "Sign in",
      actionDisabled: false,
      onAction: onSignIn,
    };
  }

  if (!hasSession) {
    return {
      accessTier: "PRO",
      status: "Unlock to calculate",
      actionLabel: "Unlock",
      actionDisabled: false,
      onAction: onUnlock,
    };
  }

  if (isExecuting) {
    return {
      accessTier: "PRO",
      status: "Calculating...",
      actionLabel: "Calculating...",
      actionDisabled: true,
      onAction: () => {},
    };
  }

  if (hasResult) {
    return {
      accessTier: "PRO",
      status: resultLabel,
      actionLabel: "Recalculate",
      actionDisabled: false,
      onAction: onCalculate,
    };
  }

  if (clientBlockerCount > 0) {
    return {
      accessTier: "PRO",
      status: "Inputs need review",
      actionLabel: "Calculate",
      actionDisabled: true,
      onAction: () => {},
    };
  }

  return {
    accessTier: "PRO",
    status: "Ready",
    actionLabel: "Calculate",
    actionDisabled: false,
    onAction: onCalculate,
  };
}
