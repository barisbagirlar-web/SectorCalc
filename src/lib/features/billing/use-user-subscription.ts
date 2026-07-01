"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { doc, onSnapshot, type FirestoreError } from "firebase/firestore";
import { onAuthStateChanged, type User } from "@/lib/infrastructure/firebase/auth";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import { getFirestoreDb } from "@/lib/infrastructure/firebase/client";
import { isAuthRequiredBrowserPath } from "@/lib/features/auth/auth-required-path";
import {
  hasProAccess,
  normalizeUserSubscription,
  type UserSubscription,
} from "@/lib/features/billing/subscription";
import {
  syncSessionCookie,
  clearSessionCookie,
} from "@/lib/infrastructure/auth/session-cookie";

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

function subscribeStore(listener: StoreListener): () => void {
  storeListeners.add(listener);
  if (isAuthRequiredBrowserPath()) {
    bootstrapAuthStore();
  }
  return () => {
    storeListeners.delete(listener);
  };
}

function getStoreSnapshot(): UseUserSubscriptionState {
  return storeState;
}

/**
 * Firebase Firestore SDK may throw "Connection closed" from its transport layer
 * when the WebSocket or long-poll connection drops. These errors are not
 * always caught by the onSnapshot error callback. We suppress them globally
 * to prevent the Next.js global-error boundary from replacing the UI.
 * The onSnapshot error callback already sets a user-visible error state.
 */
function suppressFirebaseConnectionErrors() {
  if (typeof window === "undefined") return;

  function handler(event: PromiseRejectionEvent | ErrorEvent) {
    const message =
      event instanceof PromiseRejectionEvent
        ? event.reason?.message ?? ""
        : event.message ?? "";

    if (
      message.includes("Connection closed") ||
      message.includes("Firebase") ||
      message.includes("firestore") ||
      message.includes("online") ||
      message.includes("channel")
    ) {
      event.preventDefault();
    }
  }

  window.addEventListener("unhandledrejection", handler);
  window.addEventListener("error", handler);
}

function bootstrapAuthStore() {
  if (authBootstrapped) {
    return;
  }
  authBootstrapped = true;
  setStoreState({ ...storeState, loading: true, error: null });

  /** Suppress Firebase transport errors from crashing the app. */
  suppressFirebaseConnectionErrors();

  try {
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
        // Clear server-side session cookie on sign-out
        clearSessionCookie();
        setStoreState({
          user: null,
          subscription: null,
          isActive: false,
          loading: false,
          error: null,
        });
        return;
      }

      // Sync server-side session cookie on every auth detection
      syncSessionCookie(user);

      setStoreState({
        ...storeState,
        user,
        loading: true,
        error: null,
      });

      try {
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
          (err: FirestoreError) => {
            // Firestore subscription failed — set degraded state
            setStoreState({
              user,
              subscription: null,
              isActive: hasProAccess(null, user.email),
              loading: false,
              error: err?.message?.includes("closed")
                ? null
                : "Subscription status could not be loaded.",
            });
          },
        );
      } catch {
        setStoreState({
          user,
          subscription: null,
          isActive: hasProAccess(null, user.email),
          loading: false,
          error: null,
        });
      }
    });
  } catch {
    authBootstrapped = false;
    setStoreState({ ...INITIAL_STATE, loading: false, error: null });
  }
}

/** Shared subscription store — one Firebase listener for the whole app. */
export function useUserSubscription(): UseUserSubscriptionState {
  return useSyncExternalStore(subscribeStore, getStoreSnapshot, () => INITIAL_STATE);
}

/** Warm auth/subscription listener early (header mount). */
export function warmUserSubscriptionStore(): void {
  bootstrapAuthStore();
}
