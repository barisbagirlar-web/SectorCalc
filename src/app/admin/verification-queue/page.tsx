import Link from "next/link";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { VERIFICATION_QUEUE_COLLECTION } from "@/lib/features/feedback/feedback-types";

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

export const dynamic = "force-dynamic";

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

  // Weekly Recommendations Report calculation (last 7 days)
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
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Verification queue</h1>
          <p className="mt-2 text-sm text-slate-600">
            Calculation feedback and result objections (`verification_queue`).
          </p>
        </div>
        <Link href="/admin/leads" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Admin leads
        </Link>
      </div>

      {!db ? (
        <p className="mt-4 text-sm text-amber-800">Admin Firestore unavailable in this environment.</p>
      ) : null}

      {weeklyRecommendations.length > 0 ? (
        <section className="mt-6 mb-8 rounded-xl border border-rose-200 bg-rose-50/40 p-5">
          <h2 className="text-sm font-semibold text-rose-900 uppercase tracking-wider">
            Weekly Formula Update Recommendations (Last 7 Days)
          </h2>
          <p className="text-xs text-rose-700 mt-1">
            The following tools received result objections from users. Formula validation should be prioritized.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-rose-200 text-xs text-rose-900">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Tool Slug</th>
                  <th className="px-3 py-2 text-center font-semibold">Objections</th>
                  <th className="px-3 py-2 text-left font-semibold">Recent Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-200">
                {weeklyRecommendations.map((rec) => (
                  <tr key={rec.toolSlug}>
                    <td className="px-3 py-2 font-medium">{rec.toolSlug}</td>
                    <td className="px-3 py-2 text-center font-bold text-rose-700">{rec.count}</td>
                    <td className="px-3 py-2 text-rose-800 italic">
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

      <p className="mt-4 text-xs text-slate-500">{items.length} item(s) · newest first</p>

      <ul className="mt-4 space-y-3">
        {items.length === 0 ? (
          <li className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            No feedback queued yet.
          </li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-slate-900">{item.toolSlug}</p>
                <p className="text-xs text-slate-500">{item.createdAt || "—"}</p>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {item.issueType} · {item.status} · {item.tier}
                {item.userId ? ` · uid ${item.userId.slice(0, 8)}…` : ""}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">{item.message.slice(0, 500)}</p>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
