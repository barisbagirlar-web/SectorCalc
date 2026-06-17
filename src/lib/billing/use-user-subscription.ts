"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, type User } from "@/lib/firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { getFirestoreDb } from "@/lib/firebase/client";
import {
  hasProAccess,
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

const INITIAL_STATE: UseUserSubscriptionState = {
  user: null,
  subscription: null,
  isActive: false,
  loading: false,
  error: null,
};

type StoreListener = () => void;

let storeState: UseUserSubscriptionState = INITIAL_STATE;
const storeListeners = new Set<StoreListener>();
let authBootstrapped = false;
let unsubscribeAuth: (() => void) | null = null;
let unsubscribeUserDoc: (() => void) | null = null;

function emitStore() {
  storeListeners.forEach((listener) => listener());
}

function setStoreState(next: UseUserSubscriptionState) {
  storeState = next;
  emitStore();
}

function stripLocalePrefix(pathname: string): string {
  return pathname.replace(/^\/(tr|de|fr|es|ar)(?=\/|$)/, "") || "/";
}

/** Routes that need Firebase auth on first paint (account, checkout, premium tools). */
function isAuthRequiredPath(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const bare = stripLocalePrefix(window.location.pathname);
  return (
    /^\/(account|login|pricing)(\/|$)/.test(bare) ||
    /^\/tools\/(premium|premium-schema)\//.test(bare) ||
    /^\/admin(\/|$)/.test(bare)
  );
}

function subscribeStore(listener: StoreListener): () => void {
  storeListeners.add(listener);
  if (isAuthRequiredPath()) {
    bootstrapAuthStore();
  }
  return () => {
    storeListeners.delete(listener);
  };
}

function getStoreSnapshot(): UseUserSubscriptionState {
  return storeState;
}

function bootstrapAuthStore() {
  if (authBootstrapped) {
    return;
  }
  authBootstrapped = true;
  setStoreState({ ...storeState, loading: true, error: null });

  const auth = getFirebaseAuth();
  if (!auth) {
    setStoreState({
      user: null,
      subscription: null,
      isActive: false,
      loading: false,
      error: null,
    });
    return;
  }

  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (unsubscribeUserDoc) {
      unsubscribeUserDoc();
      unsubscribeUserDoc = null;
    }

    if (!user) {
      setStoreState({
        user: null,
        subscription: null,
        isActive: false,
        loading: false,
        error: null,
      });
      return;
    }

    setStoreState({
      ...storeState,
      user,
      loading: true,
      error: null,
    });

    const db = getFirestoreDb();
    if (!db) {
      setStoreState({
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
          snapshot.exists() ? snapshot.data().subscription : null,
        );

        setStoreState({
          user,
          subscription,
          isActive: hasProAccess(subscription, user.email),
          loading: false,
          error: null,
        });
      },
      () => {
        setStoreState({
          user,
          subscription: null,
          isActive: hasProAccess(null, user.email),
          loading: false,
          error: "Subscription status could not be loaded.",
        });
      },
    );
  });
}

/** Shared subscription store — one Firebase listener for the whole app. */
export function useUserSubscription(): UseUserSubscriptionState {
  return useSyncExternalStore(subscribeStore, getStoreSnapshot, () => INITIAL_STATE);
}

/** Warm auth/subscription listener early (header mount). */
export function warmUserSubscriptionStore(): void {
  bootstrapAuthStore();
}
