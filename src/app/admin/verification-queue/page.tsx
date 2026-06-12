import { getAdminFirestore } from "@/lib/firebase/admin";
import { VERIFICATION_QUEUE_COLLECTION } from "@/lib/feedback/feedback-types";

export default async function AdminVerificationQueuePage() {
  const db = getAdminFirestore();
  const items: Array<Record<string, unknown>> = [];

  if (db) {
    const snap = await db
      .collection(VERIFICATION_QUEUE_COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    for (const doc of snap.docs) {
      items.push(doc.data());
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Verification queue</h1>
      <p className="mt-2 text-sm text-slate-600">
        Admin-only review list for public calculation feedback (`verification_queue`).
      </p>
      {!db ? (
        <p className="mt-4 text-sm text-amber-800">Admin Firestore unavailable in this environment.</p>
      ) : null}
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={String(item.id ?? item.createdAt)} className="rounded-lg border border-slate-200 p-4 text-sm">
            <p className="font-medium text-slate-900">{String(item.toolSlug ?? "unknown tool")}</p>
            <p className="text-slate-600">{String(item.issueType ?? "other")} · {String(item.status ?? "open")}</p>
            <p className="mt-1 text-slate-700">{String(item.message ?? "").slice(0, 240)}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
