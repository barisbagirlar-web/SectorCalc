"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged, type User } from "@/lib/infrastructure/firebase/auth";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import { getFirestoreDb } from "@/lib/infrastructure/firebase/client";
import { PREMIUM_ENTITLEMENTS_COLLECTION } from "@/lib/features/entitlements/entitlement-types";
import { normalizePremiumEntitlementDocuments } from "@/lib/features/entitlements/read-premium-entitlements";
import type { PremiumEntitlementRecord } from "@/lib/features/entitlements/entitlement-types";

export type UsePremiumEntitlementRecordsState = {
  readonly user: User | null;
  readonly records: readonly PremiumEntitlementRecord[];
  readonly loading: boolean;
  readonly error: string | null;
};

export function usePremiumEntitlementRecords(): UsePremiumEntitlementRecordsState {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<readonly PremiumEntitlementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setUser(null);
      setRecords([]);
      setLoading(false);
      setError(null);
      return;
    }

    let unsubscribeRecords: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      if (unsubscribeRecords) {
        unsubscribeRecords();
        unsubscribeRecords = null;
      }

      setUser(nextUser);

      if (!nextUser) {
        setRecords([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const db = getFirestoreDb();
      if (!db) {
        setRecords([]);
        setLoading(false);
        setError("Firestore is not configured.");
        return;
      }

      const entitlementsQuery = query(
        collection(db, PREMIUM_ENTITLEMENTS_COLLECTION),
        where("userId", "==", nextUser.uid)
      );

      unsubscribeRecords = onSnapshot(
        entitlementsQuery,
        (snapshot) => {
          const docs = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            data: docSnap.data() as Record<string, unknown>,
          }));
          setRecords(normalizePremiumEntitlementDocuments(docs));
          setLoading(false);
          setError(null);
        },
        () => {
          setRecords([]);
          setLoading(false);
          setError("Premium entitlements could not be loaded.");
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeRecords) {
        unsubscribeRecords();
      }
    };
  }, []);

  return { user, records, loading, error };
}
