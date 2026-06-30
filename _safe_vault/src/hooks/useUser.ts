"use client";

import { useSubscription } from "@/hooks/useSubscription";

export type UserRole = "free" | "premium";

/**
 * Thin alias for assistant and account UI.
 * Premium maps to active Pro subscription (see useSubscription).
 */
export function useUser() {
  const { user, loading, isPro } = useSubscription();
  const userRole: UserRole = isPro ? "premium" : "free";

  return { user, userRole, loading, isPro };
}
