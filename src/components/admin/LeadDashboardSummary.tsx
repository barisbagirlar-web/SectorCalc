import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import type { LeadDashboardStats } from "@/lib/leads/admin-dashboard";

interface LeadDashboardSummaryProps {
 stats: LeadDashboardStats;
 loading?: boolean;
}

function DistributionBlock({
 title,
 items,
 emptyLabel,
}: {
 title: string;
 items: { key: string; label: string; count: number }[];
 emptyLabel: string;
}) {
 const max = Math.max(1, ...items.map((item) => item.count));

 return (
 <div className="rounded-sm border border-slate/20 bg-white p-4 shadow-card sm:p-5">
 <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 {title}
 </h3>
 {items.length === 0 ? (
 <p className="mt-3 text-sm text-text-secondary">{emptyLabel}</p>
 ) : (
 <ul className="mt-3 space-y-2.5">
 {items.map((item) => (
 <li key={item.key}>
 <div className="flex items-center justify-between gap-2 text-sm">
 <span className="min-w-0 truncate text-ink-black">{item.label}</span>
 <span className="shrink-0 font-semibold tabular-nums text-ink-black">
 {item.count}
 </span>
 </div>
 <div
 className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-off-white"
 aria-hidden
 >
 <div
 className="h-full rounded-full bg-ink-black/70"
 style={{ width: `${(item.count / max) * 100}%` }}
 />
 </div>
 </li>
 ))}
 </ul>
 )}
 </div>
 );
}

export function LeadDashboardSummary({ stats, loading }: LeadDashboardSummaryProps) {
 const { counts } = stats;

 const summaryCards = [
 { label: "Toplam Lead", value: counts.total },
 { label: "Yeni Lead", value: counts.newCount },
 { label: "Sıcak Lead", value: counts.hotCount },
 { label: "Uygun Lead", value: counts.qualifiedCount },
 { label: "Müşteriye Dönen", value: counts.convertedCount },
 { label: "Kayıp Lead", value: counts.lostCount },
 ];

 return (
 <section
 className="space-y-4"
 aria-label="Lead dashboard"
 >
 <div>
 <h2 className="text-lg font-bold text-ink-black">Lead dashboard</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Yönetim özeti — yüklü lead listesinden (salt okunur).
 </p>
 </div>

 <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
 {summaryCards.map((card) => (
 <AdminMetricCard
 key={card.label}
 label={card.label}
 value={loading ? "…" : String(card.value)}
 />
 ))}
 </div>

 <div className="grid gap-4 lg:grid-cols-3">
 <DistributionBlock
 title="Priority"
 items={stats.priority}
 emptyLabel="Henüz lead yok."
 />
 <DistributionBlock
 title="Status"
 items={stats.status}
 emptyLabel="Henüz lead yok."
 />
 <div className="rounded-sm border border-slate/20 bg-white p-4 shadow-card sm:p-5 lg:col-span-1">
 <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Attribution (top 5)
 </h3>
 <p className="mt-1 text-xs text-text-secondary">
 Unknown: {loading ? "…" : String(stats.attribution.unknownCount)}
 </p>
 {stats.attribution.top5.length === 0 ? (
 <p className="mt-3 text-sm text-text-secondary">Henüz attribution verisi yok.</p>
 ) : (
 <ul className="mt-3 space-y-2.5">
 {stats.attribution.top5.map((item) => {
 const max = Math.max(
 1,
 ...stats.attribution.top5.map((entry) => entry.count)
 );
 return (
 <li key={item.key}>
 <div className="flex items-center justify-between gap-2 text-sm">
 <span className="min-w-0 break-words text-ink-black">
 {item.label}
 </span>
 <span className="shrink-0 font-semibold tabular-nums text-ink-black">
 {item.count}
 </span>
 </div>
 <div
 className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-off-white"
 aria-hidden
 >
 <div
 className="h-full rounded-full bg-ink-black/70"
 style={{ width: `${(item.count / max) * 100}%` }}
 />
 </div>
 </li>
 );
 })}
 </ul>
 )}
 </div>
 </div>
 </section>
 );
}
