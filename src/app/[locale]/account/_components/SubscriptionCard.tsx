import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { normalizeUserSubscription, hasActiveSubscription, type UserSubscription } from "@/lib/features/billing/subscription";

function formatPeriodEnd(value: string | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", { dateStyle: "medium" });
}

async function fetchSubscription(userId: string): Promise<{
  subscription: UserSubscription | null;
  email: string | null;
}> {
  const db = getAdminFirestore();
  if (!db) {
    return { subscription: null, email: null };
  }
  try {
    const userRef = db.collection("users").doc(userId);
    const snap = await userRef.get();
    if (!snap.exists) {
      return { subscription: null, email: null };
    }
    const data = snap.data() ?? {};
    return {
      subscription: normalizeUserSubscription(data.subscription),
      email: typeof data.email === "string" ? data.email : null,
    };
  } catch {
    return { subscription: null, email: null };
  }
}

interface Props { userId: string; }

export async function SubscriptionCard({ userId }: Props) {
  const { subscription, email } = await fetchSubscription(userId);
  const isActive = hasActiveSubscription(subscription);
  const status = subscription?.status ?? "none";
  const periodEnd = formatPeriodEnd(subscription?.currentPeriodEnd);
  const planName = subscription?.plan ?? "";

  if (status === "past_due") {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {planName ? `${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan` : "Pro Plan"}
            </p>
            <p className="text-sm text-orange-600 font-medium">Payment needs attention</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Past Due
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Update billing to restore premium calculator access.
        </p>
        <a href="/pricing" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Update billing →
        </a>
      </section>
    );
  }

  if (isActive) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {planName ? `${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan` : "Pro Plan"}
            </p>
            <p className="text-sm text-green-600 font-medium">
              {periodEnd ? `Active · Renews ${periodEnd}` : "Active"}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
        <a href="/pricing" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Manage plan →
        </a>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Free Plan</p>
          <p className="text-sm text-gray-500">No active subscription</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          Free
        </span>
      </div>
      <a href="/pricing" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Upgrade to Pro →
      </a>
    </section>
  );
}
