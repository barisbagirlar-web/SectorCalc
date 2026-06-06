"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, type User } from "@/lib/firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { getFirestoreDb } from "@/lib/firebase/client";
import {
  hasActiveSubscription,
  normalizeUserSubscription,
  type UserSubscription,
} from "@/lib/billing/subscription";

export type UseUserSubscriptionState = {
  user: User | null;
  subscription: UserSubscription | null;
  isActive: boolean;
  loading: boolean;
  error: string | null;
};

export function useUserSubscription(): UseUserSubscriptionState {
  const [state, setState] = useState<UseUserSubscriptionState>({
    user: null,
    subscription: null,
    isActive: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setState({
        user: null,
        subscription: null,
        isActive: false,
        loading: false,
        error: null,
      });
      return;
    }

    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (!user) {
        setState({
          user: null,
          subscription: null,
          isActive: false,
          loading: false,
          error: null,
        });
        return;
      }

      setState((prev) => ({
        ...prev,
        user,
        loading: true,
        error: null,
      }));

      const db = getFirestoreDb();
      if (!db) {
        setState({
          user,
          subscription: null,
          isActive: false,
          loading: false,
          error: "Firestore is not configured.",
        });
        return;
      }

      const userRef = doc(db, "users", user.uid);

      unsubscribeUserDoc = onSnapshot(
        userRef,
        (snapshot) => {
          const subscription = normalizeUserSubscription(
            snapshot.exists() ? snapshot.data().subscription : null
          );

          setState({
            user,
            subscription,
            isActive: hasActiveSubscription(subscription),
            loading: false,
            error: null,
          });
        },
        () => {
          setState({
            user,
            subscription: null,
            isActive: false,
            loading: false,
            error: "Subscription status could not be loaded.",
          });
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
    };
  }, []);

  return state;
}
