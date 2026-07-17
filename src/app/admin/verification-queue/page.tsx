import type { Metadata } from "next";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { VERIFICATION_QUEUE_COLLECTION } from "@/lib/features/feedback/feedback-types";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Verification Queue (Admin)",
    description: "Calculation feedback and result objections from users. Review and prioritize formula updates.",
    path: "/admin/verification-queue",
  }),
  robots: { index: false, follow: false },
};

type QueueRow = {
  id: string;
  toolSlug: string;
  tier: string;
  issueType: string;
  status: string;
  message: string;
  createdAt: string;
  userId?: string;
};

export default async function AdminVerificationQueuePage() {
  const db = getAdminFirestore();
  const items: QueueRow[] = [];

  if (db) {
    const snap = await db
      .collection(VERIFICATION_QUEUE_COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    for (const doc of snap.docs) {
      const data = doc.data();
      items.push({
        id: doc.id,
        toolSlug: String(data.toolSlug ?? "unknown"),
        tier: String(data.tier ?? data.toolType ?? "unknown"),
        issueType: String(data.issueType ?? "other"),
        status: String(data.status ?? "open"),
        message: String(data.message ?? ""),
        createdAt: String(data.createdAt ?? ""),
        userId: typeof data.userId === "string" ? data.userId : undefined,
      });
    }
  }

  // Weekly Recommendations Report (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoIso = sevenDaysAgo.toISOString();

  const weeklyRecommendationsMap = new Map<string, { toolSlug: string; count: number; messages: string[] }>();

  for (const item of items) {
    if (item.createdAt && item.createdAt >= sevenDaysAgoIso && (item.issueType === "wrong_result" || item.issueType === "formula_error")) {
      const existing = weeklyRecommendationsMap.get(item.toolSlug) || { toolSlug: item.toolSlug, count: 0, messages: [] };
      existing.count += 1;
      if (existing.messages.length < 3) {
        existing.messages.push(item.message);
      }
      weeklyRecommendationsMap.set(item.toolSlug, existing);
    }
  }

  const weeklyRecommendations = Array.from(weeklyRecommendationsMap.values()).sort((a, b) => b.count - a.count);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Verification Queue"
        subtitle="Calculation feedback and result objections from users. Review, prioritize formula updates, and track resolution status."
      />
      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />

          {!db ? (
            <div className="mb-6 rounded-sm border border-amber/25 bg-amber/5 px-5 py-4 text-sm text-deep-navy">
              <p className="font-semibold">Admin Firestore unavailable in this environment.</p>
            </div>
          ) : null}

          {weeklyRecommendations.length > 0 ? (
            <section className="mb-8 rounded-sm border border-red/20 bg-red/5 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-red">
                Weekly Formula Update Recommendations (Last 7 Days)
              </h2>
              <p className="mt-1 text-xs text-red/80">
                The following tools received result objections from users. Formula validation should be prioritized.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-red/20 text-xs text-deep-navy">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Tool Slug</th>
                      <th className="px-3 py-2 text-center font-semibold">Objections</th>
                      <th className="px-3 py-2 text-left font-semibold">Recent Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red/10">
                    {weeklyRecommendations.map((rec) => (
                      <tr key={rec.toolSlug}>
                        <td className="px-3 py-2 font-medium">{rec.toolSlug}</td>
                        <td className="px-3 py-2 text-center font-bold text-red">{rec.count}</td>
                        <td className="px-3 py-2 italic text-red/80">
                          <ul className="list-disc pl-4 space-y-1">
                            {rec.messages.map((m, idx) => (
                              <li key={idx}>{m.slice(0, 80)}{m.length > 80 ? "..." : ""}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <p className="text-xs text-text-secondary">{items.length} item(s) · newest first</p>

          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <div className="rounded-sm border border-dashed border-slate/25 bg-white p-6 text-sm text-text-secondary">
                No feedback queued yet.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-sm border border-slate/20 bg-white p-4 text-sm shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-deep-navy">{item.toolSlug}</p>
                    <p className="text-xs text-text-secondary">{item.createdAt || "-"}</p>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    {item.issueType} · {item.status} · {item.tier}
                    {item.userId ? ` · uid ${item.userId.slice(0, 8)}…` : ""}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-deep-navy">{item.message.slice(0, 500)}</p>
                </div>
              ))
            )}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
