"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AccountLoginPrompt,
  ReportsHistoryList,
} from "@/components/reports/ReportsHistoryList";
import {
  SingleReportPurchaseSuccessBanner,
  SingleReportPurchasesPanel,
} from "@/components/reports/SingleReportPurchasesPanel";
import { ProUpsellBanner } from "@/components/billing/ProUpsellBanner";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { useUserPurchases } from "@/lib/billing/use-user-purchases";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import {
  listUserVerdictReports,
  type SavedVerdictReport,
} from "@/lib/reports/report-storage";
import { getAccountHref, getReportsHref } from "@/lib/tools/tool-links";

export function AccountReportsPageContent() {
  const searchParams = useSearchParams();
  const purchased = searchParams.get("purchased");
  const purchasedTool = searchParams.get("tool") ?? undefined;
  const { user, loading: authLoading, isActive } = useUserSubscription();
  const { purchases, loading: purchasesLoading } = useUserPurchases();
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

  const showPurchaseSuccess = purchased === "single_report";

  return (
    <PageLayout>
      <section className="border-b border-border-subtle bg-white py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          <Link
            href={getAccountHref()}
            className="text-sm font-medium text-accent-teal hover:underline"
          >
            Back to account
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent-teal">
            {isActive ? "SectorCalc Pro" : "Verdict reports"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Saved verdict reports
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate">
            Saved reports are linked to your account. Single Verdict purchases unlock
            one premium analyzer — run it and save the report here.
          </p>
        </Container>
      </section>

      <section className="bg-bg-subtle py-10 sm:py-12">
        <Container size="wide" className="min-w-0">
          {authLoading ? (
            <div className="rounded-xl border border-border-subtle bg-white p-6 text-sm text-slate">
              Loading your account…
            </div>
          ) : !user ? (
            <AccountLoginPrompt nextPath={getReportsHref()} />
          ) : (
            <>
              {showPurchaseSuccess ? (
                <>
                  <SingleReportPurchaseSuccessBanner toolSlug={purchasedTool} />
                  {!isActive ? <ProUpsellBanner /> : null}
                </>
              ) : null}

              {purchasesLoading ? (
                <div className="mb-8 rounded-xl border border-border-subtle bg-white p-6 text-sm text-slate">
                  Loading purchase credits…
                </div>
              ) : (
                <SingleReportPurchasesPanel purchases={purchases} />
              )}

              {loadingReports ? (
                <div className="rounded-xl border border-border-subtle bg-white p-6 text-sm text-slate">
                  Loading saved reports…
                </div>
              ) : (
                <ReportsHistoryList reports={reports} hasPurchaseCredits={purchases.length > 0} />
              )}
            </>
          )}
        </Container>
      </section>
    </PageLayout>
  );
}
