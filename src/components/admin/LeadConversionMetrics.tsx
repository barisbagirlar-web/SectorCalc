"use client";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import {
  formatConversionPercent,
  type LeadConversionMetrics as LeadConversionMetricsData,
} from "@/lib/leads/conversion-metrics";

interface LeadConversionMetricsProps {
  metrics: LeadConversionMetricsData;
  loading?: boolean;
}

const cardClass =
  "rounded-xl border border-slate/20 bg-white p-4 shadow-card sm:p-5";

export function LeadConversionMetrics({
  metrics,
  loading,
}: LeadConversionMetricsProps) {
  const rateCards = [
    {
      label: "Follow-up Needed",
      value: loading ? "…" : String(metrics.followUpNeeded),
      hint: "Yeni + İncelendi",
    },
    {
      label: "Open Pipeline",
      value: loading ? "…" : String(metrics.openPipeline),
      hint: "Kayıp hariç aktif huni",
    },
    {
      label: "Contact Rate",
      value: loading ? "…" : formatConversionPercent(metrics.contactRate),
      hint: "İletişim + uygun + dönüşüm",
    },
    {
      label: "Qualification Rate",
      value: loading ? "…" : formatConversionPercent(metrics.qualificationRate),
      hint: "Uygun + dönüşüm",
    },
    {
      label: "Conversion Rate",
      value: loading ? "…" : formatConversionPercent(metrics.conversionRate),
      hint: "Müşteriye dönen / toplam",
    },
    {
      label: "Loss Rate",
      value: loading ? "…" : formatConversionPercent(metrics.lossRate),
      hint: "Kayıp / toplam",
    },
  ];

  const funnelMax = Math.max(1, ...metrics.funnel.map((step) => step.count));

  return (
    <section className="space-y-4" aria-label="Conversion metrics">
      <div>
        <h2 className="text-lg font-bold text-deep-navy">Conversion metrics</h2>
        <p className="mt-1 text-sm text-slate">
          Satış hunisi ve dönüşüm oranları — yüklü lead listesinden (salt okunur).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rateCards.map((card) => (
          <AdminMetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            hint={card.hint}
          />
        ))}
      </div>

      <div className={cardClass}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate">
          Satış hunisi
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.funnel.map((step, index) => (
            <div key={step.status} className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate">
                {index > 0 ? (
                  <span className="hidden lg:inline" aria-hidden>
                    →
                  </span>
                ) : null}
                <span className="font-medium text-deep-navy">{step.label}</span>
              </div>
              <p className="mt-1 text-xl font-bold tabular-nums text-deep-navy">
                {loading ? "…" : String(step.count)}
              </p>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-off-white"
                aria-hidden
              >
                <div
                  className="h-full rounded-full bg-professional-blue/70"
                  style={{
                    width: loading
                      ? "0%"
                      : `${(step.count / funnelMax) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate">
          Attribution conversion
        </h3>
        {metrics.attribution.length === 0 ? (
          <p className="mt-3 text-sm text-slate">Henüz attribution verisi yok.</p>
        ) : (
          <div className="mt-4">
            <table className="w-full table-fixed text-left text-sm">
              <thead>
                <tr className="border-b border-slate/15 text-xs font-semibold uppercase tracking-wide text-slate">
                  <th className="py-2 pr-3">Source</th>
                  <th className="py-2 px-2 text-right">Total</th>
                  <th className="py-2 px-2 text-right">Contacted</th>
                  <th className="py-2 px-2 text-right">Qualified</th>
                  <th className="py-2 px-2 text-right">Converted</th>
                  <th className="py-2 pl-2 text-right">Conversion %</th>
                </tr>
              </thead>
              <tbody>
                {metrics.attribution.map((row) => (
                  <tr
                    key={row.sourceLabel}
                    className="border-b border-slate/10 last:border-0"
                  >
                    <td className="max-w-[12rem] py-2.5 pr-3 break-words text-deep-navy">
                      {row.sourceLabel}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {loading ? "…" : row.total}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {loading ? "…" : row.contacted}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {loading ? "…" : row.qualified}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {loading ? "…" : row.converted}
                    </td>
                    <td className="py-2.5 pl-2 text-right tabular-nums font-medium">
                      {loading ? "…" : formatConversionPercent(row.conversionRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={cardClass}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate">
          Son 7 gün
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: metrics.last7Days.total },
            { label: "Contacted", value: metrics.last7Days.contacted },
            { label: "Qualified", value: metrics.last7Days.qualified },
            { label: "Converted", value: metrics.last7Days.converted },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate/15 bg-off-white/50 px-3 py-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-deep-navy">
                {loading ? "…" : String(item.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
