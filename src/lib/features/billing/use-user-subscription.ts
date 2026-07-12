"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { doc, onSnapshot, type FirestoreError } from "firebase/firestore";
import { onAuthStateChanged, type User } from "@/lib/infrastructure/firebase/auth";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import { getFirestoreDb } from "@/lib/infrastructure/firebase/client";
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
/**
 * Tracks whether we ever saw a non-null user from onAuthStateChanged.
 * Prevents clearSessionCookie() from firing on the initial null that
 * Firebase emits before restoring the persisted auth state from IndexedDB.
 */
let hadAuthUser = false;

function emitStore() {
  storeListeners.forEach((listener) => listener());
}

function setStoreState(next: UseUserSubscriptionState) {
  storeState = next;
  emitStore();
}

function subscribeStore(listener: StoreListener): () => void {
  storeListeners.add(listener);
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
        // Clear server-side session cookie ONLY when we transition from
        // authenticated → unauthenticated (deliberate sign-out).
        // On initial page load Firebase emits null before restoring the
        // persisted auth state from IndexedDB - clearing the cookie then
        // would destroy the session on every navigation.
        if (hadAuthUser) {
          clearSessionCookie();
          hadAuthUser = false;
        }
        setStoreState({
          user: null,
          subscription: null,
          isActive: false,
          loading: false,
          error: null,
        });
        return;
      }

      hadAuthUser = true;
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
            // Firestore subscription failed - set degraded state
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

/**
 * Hydration-safe subscription store.
 *
 * Must NEVER return a different value from getServerSnapshot during the
 * initial SSR → hydration window. If the store was already mutated by a
 * warmUserSubscriptionStore() call before this component mounts, the
 * client snapshot would differ from the server snapshot, causing the
 * React streaming SSR error:
 *   "The deferred DOM Node could not be resolved to a valid node."
 *
 * Mitigation: use a hydration flag so store reads return INITIAL_STATE
 * until the hydration commit completes. Then bootstrapAuthStore fires
 * in a separate microtask to start the real Firebase listener.
 */
let hydrationComplete = false;

function getHydrationSafeSnapshot(): UseUserSubscriptionState {
  if (typeof window === "undefined") return INITIAL_STATE;       // SSR always sees INITIAL
  if (!hydrationComplete) return INITIAL_STATE;                  // during hydration
  return storeState;                                             // after hydration
}

/** Shared subscription store - one Firebase listener for the whole app. */
export function useUserSubscription(): UseUserSubscriptionState {
  const state = useSyncExternalStore(subscribeStore, getHydrationSafeSnapshot, () => INITIAL_STATE);

  useEffect(() => {
    hydrationComplete = true;
    bootstrapAuthStore();
  }, []);

  return state;
}

/** Warm auth/subscription listener early (header mount). */
export function warmUserSubscriptionStore(): void {
  bootstrapAuthStore();
}
