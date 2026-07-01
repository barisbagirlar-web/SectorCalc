"use client";

import Link from "@/lib/ui-shared/navigation/next-link";
import { useCallback, useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";

type CreditData = {
  available: number;
  totalPurchased: number;
  usedThisMonth: number;
};

type FetchStatus = "loading" | "success" | "error";

export function CreditSummary() {
  const [data, setData] = useState<CreditData | null>(null);
  const [status, setStatus] = useState<FetchStatus>("loading");

  const fetchCredits = useCallback(async () => {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) {
      setData(null);
      setStatus("error");
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/user/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch credits");
      }

      const json: CreditData = await res.json();
      setData({
        available: Math.floor(json.available),
        totalPurchased: Math.floor(json.totalPurchased),
        usedThisMonth: Math.floor(json.usedThisMonth),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return (
    <section className="sc-account-hub__section credit-summary">
      <h2 className="sc-account-hub__section-title">Credit Balance</h2>

      {status === "loading" && (
        <p className="text-sm text-text-secondary">Loading credits…</p>
      )}

      {status === "error" && data === null && (
        <p className="text-sm text-amber">Could not load credit data.</p>
      )}

      {data && (
        <>
          <div className="credit-summary__stats">
            <div className="credit-summary__stat">
              <span className="credit-summary__stat-label">Available Credits</span>
              <span className="credit-summary__stat-value">{data.available}</span>
            </div>
            <div className="credit-summary__stat">
              <span className="credit-summary__stat-label">Total Purchased</span>
              <span className="credit-summary__stat-value">{data.totalPurchased}</span>
            </div>
            <div className="credit-summary__stat">
              <span className="credit-summary__stat-label">Used This Month</span>
              <span className="credit-summary__stat-value">{data.usedThisMonth}</span>
            </div>
          </div>
          <Link href="/billing" className="sc-cta-secondary credit-summary__cta">
            Manage Subscription
          </Link>
        </>
      )}
    </section>
  );
}
