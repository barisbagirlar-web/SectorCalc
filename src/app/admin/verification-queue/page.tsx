import Link from "next/link";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { VERIFICATION_QUEUE_COLLECTION } from "@/lib/feedback/feedback-types";

type QueueRow = {
  id: string;
  toolSlug: string;
  locale: string;
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
        locale: String(data.locale ?? "en"),
        tier: String(data.tier ?? data.toolType ?? "unknown"),
        issueType: String(data.issueType ?? "other"),
        status: String(data.status ?? "open"),
        message: String(data.message ?? ""),
        createdAt: String(data.createdAt ?? ""),
        userId: typeof data.userId === "string" ? data.userId : undefined,
      });
    }
  }

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
                {item.issueType} · {item.status} · {item.tier} · {item.locale}
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
