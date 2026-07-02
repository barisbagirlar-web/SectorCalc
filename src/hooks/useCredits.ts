"use client";

import { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/infrastructure/firebase/client";
import { getUserCredits } from "@/lib/features/credits/credits-manager";
import { spendCreditsViaFunction } from "@/lib/features/credits/spend-credits";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";

const CREDITS_COLLECTION = "credits";
const BALANCE_DOC = "balance";

export type UseCreditsState = {
  credits: number | null;
  /** Alias for credits - matches Firestore balance field semantics. */
  balance: number;
  loading: boolean;
  refreshCredits: () => Promise<void>;
  spendCredits: (amount?: number, toolSlug?: string) => Promise<boolean>;
};

export function useCredits(): UseCreditsState {
  const { user } = useUserSubscription();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    const db = getFirestoreDb();
    if (!db) {
      setCredits(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = doc(db, "users", user.uid, CREDITS_COLLECTION, BALANCE_DOC);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const amount = snap.data()?.amount;
        setCredits(typeof amount === "number" && Number.isFinite(amount) ? amount : 0);
        setLoading(false);
      },
      () => {
        setCredits(0);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const refreshCredits = useCallback(async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const value = await getUserCredits(user.uid);
      setCredits(value);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const spendCredits = useCallback(
    async (amount = 1, toolSlug?: string): Promise<boolean> => {
      const result = await spendCreditsViaFunction({ amount, toolSlug });
      if (!result.ok) {
        return false;
      }
      setCredits((current) => {
        if (typeof current !== "number") {
          return current;
        }
        return Math.max(0, current - result.spent);
      });
      return true;
    },
    []
  );

  return {
    credits,
    balance: credits ?? 0,
    loading,
    refreshCredits,
    spendCredits,
  };
}
