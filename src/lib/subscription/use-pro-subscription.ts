"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, type User } from "@/lib/firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { getFirestoreDb } from "@/lib/firebase/client";
import { hasActiveSubscription } from "@/lib/billing/subscription";
import type { UserProfile } from "@/lib/subscription/types";

interface ProSubscriptionState {
  user: User | null;
  loading: boolean;
  isPro: boolean;
  subscription: UserProfile["subscription"] | null;
}

export function useProSubscription(): ProSubscriptionState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserProfile["subscription"] | null>(
    null
  );

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setSubscription(null);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const db = getFirestoreDb();
    if (!db) {
      setLoading(false);
      return;
    }

    const ref = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.data() as UserProfile | undefined;
        setSubscription(data?.subscription ?? null);
        setLoading(false);
      },
      () => {
        setSubscription(null);
        setLoading(false);
      }
    );

    return unsubscribeProfile;
  }, [user]);

  const isPro = hasActiveSubscription(subscription);

  return { user, loading, isPro, subscription };
}
