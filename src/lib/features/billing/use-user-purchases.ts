"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged, type User } from "@/lib/infrastructure/firebase/auth";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import { getFirestoreDb } from "@/lib/infrastructure/firebase/client";
import {
 hasSingleReportForTool,
 normalizeSingleReportPurchase,
 type SingleReportPurchase,
} from "@/lib/features/billing/purchase-types";

export type UseUserPurchasesState = {
 user: User | null;
 purchases: SingleReportPurchase[];
 loading: boolean;
 error: string | null;
 hasSingleReportForTool: (toolSlug: string) => boolean;
};

export function useUserPurchases(): UseUserPurchasesState {
 const [user, setUser] = useState<User | null>(null);
 const [purchases, setPurchases] = useState<SingleReportPurchase[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 const auth = getFirebaseAuth();
 if (!auth) {
 setUser(null);
 setPurchases([]);
 setLoading(false);
 setError(null);
 return;
 }

 let unsubscribePurchases: (() => void) | null = null;

 const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
 if (unsubscribePurchases) {
 unsubscribePurchases();
 unsubscribePurchases = null;
 }

 setUser(nextUser);

 if (!nextUser) {
 setPurchases([]);
 setLoading(false);
 setError(null);
 return;
 }

 setLoading(true);
 setError(null);

 const db = getFirestoreDb();
 if (!db) {
 setPurchases([]);
 setLoading(false);
 setError("Firestore is not configured.");
 return;
 }

 const purchasesQuery = query(
 collection(db, "users", nextUser.uid, "purchases"),
 orderBy("createdAt", "desc")
 );

 unsubscribePurchases = onSnapshot(
 purchasesQuery,
 (snapshot) => {
 const items: SingleReportPurchase[] = [];
 for (const docSnap of snapshot.docs) {
 const normalized = normalizeSingleReportPurchase(
 docSnap.id,
 docSnap.data() as Record<string, unknown>
 );
 if (normalized) {
 items.push(normalized);
 }
 }
 setPurchases(items);
 setLoading(false);
 setError(null);
 },
 () => {
 setPurchases([]);
 setLoading(false);
 setError("Purchase history could not be loaded.");
 }
 );
 });

 return () => {
 unsubscribeAuth();
 if (unsubscribePurchases) {
 unsubscribePurchases();
 }
 };
 }, []);

 const checkSingleReport = useMemo(
 () => (toolSlug: string) => hasSingleReportForTool(purchases, toolSlug),
 [purchases]
 );

 return {
 user,
 purchases,
 loading,
 error,
 hasSingleReportForTool: checkSingleReport,
 };
}
