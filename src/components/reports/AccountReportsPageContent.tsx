"use client";

import { useEffect, useState } from "react";
import {
  AccountLoginPrompt,
  ReportsHistoryList,
} from "@/components/reports/ReportsHistoryList";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import {
  listUserVerdictReports,
  type SavedVerdictReport,
} from "@/lib/reports/report-storage";

export function AccountReportsPageContent() {
  const { user, loading: authLoading } = useUserSubscription();
  const [reports, setReports] = useState<SavedVerdictReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (!user) {
      setReports([]);
      setLoadingReports(false);
      return;
    }

    let cancelled = false;
    setLoadingReports(true);

    void listUserVerdictReports(user.uid).then((items) => {
      if (!cancelled) {
        setReports(items);
        setLoadingReports(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <PageLayout headerTheme="light">
      <section className="border-b border-slate/10 bg-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
            SectorCalc Pro
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl">
            Saved verdict reports
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate">
            Saved reports are linked to your account. Free tool inputs are not saved
            unless you create a premium report.
          </p>
        </Container>
      </section>

      <section className="bg-off-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          {authLoading ? (
            <div className="rounded-xl border border-slate/15 bg-white p-6 text-sm text-slate">
              Loading your account…
            </div>
          ) : !user ? (
            <AccountLoginPrompt nextPath="/account/reports" />
          ) : loadingReports ? (
            <div className="rounded-xl border border-slate/15 bg-white p-6 text-sm text-slate">
              Loading saved reports…
            </div>
          ) : (
            <ReportsHistoryList reports={reports} />
          )}
        </Container>
      </section>
    </PageLayout>
  );
}
