"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import { getLiveKpiDecision } from "@/lib/analytics/live-kpi-decision";
import {
  buildLiveKpiSnapshot,
  createEmptyLiveKpiSnapshot,
  isSnapshotEmpty,
  type LiveKpiSnapshot,
} from "@/lib/analytics/live-kpi-model";
import { loadLiveKpiEvents } from "@/lib/analytics/load-live-kpi-events";

const VERDICT_LABELS: Record<string, string> = {
  needs_traffic: "Needs traffic",
  needs_free_tool_ux: "Needs free tool UX",
  needs_premium_value: "Needs premium value",
  needs_pricing_fix: "Needs pricing fix",
  needs_checkout_fix: "Needs checkout fix",
  ready_to_scale: "Ready to scale",
};

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-deep-navy">{title}</h2>
      {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
    </div>
  );
}

function TopItemsTable({
  columns,
  rows,
  emptyLabel,
}: {
  columns: [string, string];
  rows: readonly { key: string; primary: string; secondary: string }[];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-text-secondary">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-slate/20 bg-white shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate/15 bg-off-white">
          <tr>
            <th className="px-4 py-3 font-semibold text-deep-navy">{columns[0]}</th>
            <th className="px-4 py-3 font-semibold text-deep-navy">{columns[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate/10 last:border-b-0">
              <td className="px-4 py-3 text-deep-navy">{row.primary}</td>
              <td className="px-4 py-3 text-text-secondary">{row.secondary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LiveKpiReviewClient() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [snapshot, setSnapshot] = useState<LiveKpiSnapshot>(createEmptyLiveKpiSnapshot());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const events = await loadLiveKpiEvents({ period: "weekly" });
        if (!cancelled) {
          setSnapshot(buildLiveKpiSnapshot(events, "weekly"));
        }
      } catch {
        if (!cancelled) {
          setSnapshot(createEmptyLiveKpiSnapshot());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAdmin]);

  const decision = useMemo(() => getLiveKpiDecision(snapshot), [snapshot]);
  const empty = isSnapshotEmpty(snapshot);

  if (authLoading) {
    return (
      <div className="rounded-sm border border-slate/20 bg-white px-5 py-4 text-sm text-text-secondary shadow-card">
        Loading admin session…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminAuthBar />

      {!isAdmin ? null : (
        <>
          {loading ? (
            <div className="rounded-sm border border-slate/20 bg-white px-5 py-4 text-sm text-text-secondary shadow-card">
              Loading live KPI snapshot…
            </div>
          ) : null}

          {empty ? (
            <div
              className="rounded-sm border border-slate/20 bg-white px-5 py-4 text-sm text-deep-navy shadow-card"
              role="status"
            >
              <p className="font-semibold">No live KPI data yet.</p>
              <p className="mt-2 text-text-secondary">
                Start campaign distribution and check again after first traffic. Event storage is
                not wired yet — this page shows the aggregate model with an empty snapshot.
              </p>
              <p className="mt-3 text-text-secondary">
                See <code className="text-xs">docs/live-kpi-review-runbook.md</code> and{" "}
                <code className="text-xs">docs/revenue-sprint-dashboard.md</code>.
              </p>
            </div>
          ) : null}

          <section aria-labelledby="kpi-verdict-heading">
            <SectionHeading
              title="Executive verdict"
              description="Weekly decision based on aggregate funnel signals."
            />
            <article className="rounded-sm border border-slate/20 bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Verdict
              </p>
              <p id="kpi-verdict-heading" className="mt-2 text-2xl font-bold text-deep-navy">
                {VERDICT_LABELS[decision.verdict] ?? decision.verdict}
              </p>
              <p className="mt-3 text-sm text-deep-navy">{decision.reason}</p>
              <p className="mt-2 text-sm font-medium text-professional-blue">{decision.nextAction}</p>
            </article>
          </section>

          <section aria-labelledby="kpi-traffic-heading">
            <SectionHeading title="Traffic" />
            <h2 id="kpi-traffic-heading" className="sr-only">
              Traffic
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminMetricCard label="Landing views" value={formatCount(snapshot.traffic.landingViews)} />
              <AdminMetricCard label="SEO landing views" value={formatCount(snapshot.traffic.seoLandingViews)} />
              <AdminMetricCard label="Free tool opens" value={formatCount(snapshot.traffic.freeToolOpens)} />
              <AdminMetricCard
                label="Premium analyzer opens"
                value={formatCount(snapshot.traffic.premiumAnalyzerOpens)}
              />
            </div>
          </section>

          <section aria-labelledby="kpi-free-heading">
            <SectionHeading title="Free tool usage" />
            <h2 id="kpi-free-heading" className="sr-only">
              Free tool usage
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminMetricCard
                label="Free calculations"
                value={formatCount(snapshot.conversion.freeCalculations)}
              />
              <AdminMetricCard
                label="Calculate rate"
                value={
                  snapshot.traffic.freeToolOpens > 0
                    ? `${Math.round((snapshot.conversion.freeCalculations / snapshot.traffic.freeToolOpens) * 100)}%`
                    : "—"
                }
                hint="Calculations / free tool opens"
              />
            </div>
          </section>

          <section aria-labelledby="kpi-premium-heading">
            <SectionHeading title="Premium intent" />
            <h2 id="kpi-premium-heading" className="sr-only">
              Premium intent
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminMetricCard
                label="Free → premium clicks"
                value={formatCount(snapshot.conversion.freeToPremiumClicks)}
              />
              <AdminMetricCard
                label="Premium unlock clicks"
                value={formatCount(snapshot.conversion.premiumUnlockClicks)}
              />
              <AdminMetricCard label="Pricing views" value={formatCount(snapshot.conversion.pricingViews)} />
              <AdminMetricCard
                label="Pricing CTA clicks"
                value={formatCount(snapshot.conversion.pricingCtaClicks)}
              />
            </div>
          </section>

          <section aria-labelledby="kpi-revenue-heading">
            <SectionHeading title="Checkout / revenue" />
            <h2 id="kpi-revenue-heading" className="sr-only">
              Checkout / revenue
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AdminMetricCard
                label="Checkout started"
                value={formatCount(snapshot.revenue.checkoutStarted)}
              />
              <AdminMetricCard
                label="Payment completed"
                value={formatCount(snapshot.revenue.paymentCompleted)}
              />
              <AdminMetricCard
                label="Single report purchases"
                value={formatCount(snapshot.revenue.singleReportPurchases)}
                hint="Requires server-side purchase events"
              />
            </div>
          </section>

          <section aria-labelledby="kpi-leads-heading">
            <SectionHeading title="Leads" />
            <h2 id="kpi-leads-heading" className="sr-only">
              Leads
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminMetricCard
                label="Beta partner submits"
                value={formatCount(snapshot.leads.betaPartnerSubmits)}
              />
              <AdminMetricCard
                label="Report feedback submits"
                value={formatCount(snapshot.leads.reportFeedbackSubmits)}
                hint="Aggregate count only — no PII"
              />
            </div>
          </section>

          <section aria-labelledby="kpi-top-free-heading">
            <SectionHeading title="Top free tools" />
            <h2 id="kpi-top-free-heading" className="sr-only">
              Top free tools
            </h2>
            <TopItemsTable
              columns={["Tool slug", "Opens"]}
              rows={snapshot.topItems.freeTools.map((item) => ({
                key: item.slug,
                primary: item.slug,
                secondary: formatCount(item.count),
              }))}
              emptyLabel="No free tool opens recorded yet."
            />
          </section>

          <section aria-labelledby="kpi-top-premium-heading">
            <SectionHeading title="Top premium analyzers" />
            <h2 id="kpi-top-premium-heading" className="sr-only">
              Top premium analyzers
            </h2>
            <TopItemsTable
              columns={["Analyzer slug", "Opens"]}
              rows={snapshot.topItems.premiumAnalyzers.map((item) => ({
                key: item.slug,
                primary: item.slug,
                secondary: formatCount(item.count),
              }))}
              emptyLabel="No premium analyzer opens recorded yet."
            />
          </section>

          <section aria-labelledby="kpi-top-campaign-heading">
            <SectionHeading title="Top campaign clusters" />
            <h2 id="kpi-top-campaign-heading" className="sr-only">
              Top campaign clusters
            </h2>
            <TopItemsTable
              columns={["Campaign ID", "Intent score"]}
              rows={snapshot.topItems.campaigns.slice(0, 10).map((item) => ({
                key: item.campaignId,
                primary: item.campaignId,
                secondary: formatCount(item.score),
              }))}
              emptyLabel="No campaign-attributed events yet."
            />
          </section>

          <section aria-labelledby="kpi-next-action-heading">
            <SectionHeading title="Next action" />
            <h2 id="kpi-next-action-heading" className="sr-only">
              Next action
            </h2>
            <article className="rounded-sm border border-professional-blue/20 bg-off-white p-5">
              <p className="text-sm font-semibold text-deep-navy">{decision.nextAction}</p>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
