"use client";

import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { User } from "@/lib/firebase/auth";
import { getFirestoreDb } from "@/lib/firebase/client";
import {
  parseSavedVerdictReport,
  type SavedVerdictReport,
} from "@/lib/reports/report-storage";

const REPORTS_COLLECTION = "reports";

export type UseUserReportsState = {
  reports: SavedVerdictReport[];
  loading: boolean;
  error: string | null;
};

export function useUserReports(
  user: User | null,
  maxReports = 5
): UseUserReportsState {
  const [state, setState] = useState<UseUserReportsState>({
    reports: [],
    loading: Boolean(user),
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setState({ reports: [], loading: false, error: null });
      return;
    }

    const db = getFirestoreDb();
    if (!db) {
      setState({
        reports: [],
        loading: false,
        error: "Reports could not be loaded.",
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const reportsQuery = query(
      collection(db, REPORTS_COLLECTION),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(maxReports)
    );

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const reports: SavedVerdictReport[] = [];

        for (const docSnapshot of snapshot.docs) {
          const normalized = parseSavedVerdictReport(
            docSnapshot.id,
            docSnapshot.data()
          );
          if (normalized) {
            reports.push(normalized);
          }
        }

        setState({
          reports,
          loading: false,
          error: null,
        });
      },
      () => {
        setState({
          reports: [],
          loading: false,
          error: "Reports could not be loaded.",
        });
      }
    );

    return () => unsubscribe();
  }, [user, maxReports]);

  return state;
}
