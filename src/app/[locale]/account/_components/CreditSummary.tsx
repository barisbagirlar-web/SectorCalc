import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { Link } from "@/i18n/routing";

type CreditData = {
  available: number;
  totalPurchased: number;
  usedThisMonth: number;
};

async function fetchCreditData(userId: string): Promise<CreditData> {
  const db = getAdminFirestore();
  if (!db) {
    return { available: 0, totalPurchased: 0, usedThisMonth: 0 };
  }
  try {
    const creditRef = db.collection("users").doc(userId).collection("credits").doc("balance");
    const snap = await creditRef.get();
    if (!snap.exists) {
      return { available: 0, totalPurchased: 0, usedThisMonth: 0 };
    }
    const data = snap.data() ?? {};
    return {
      available: typeof data.amount === "number" && Number.isFinite(data.amount) ? Math.floor(data.amount) : 0,
      totalPurchased: typeof data.totalPurchased === "number" ? Math.floor(data.totalPurchased) : 0,
      usedThisMonth: typeof data.usedThisMonth === "number" ? Math.floor(data.usedThisMonth) : 0,
    };
  } catch {
    return { available: 0, totalPurchased: 0, usedThisMonth: 0 };
  }
}

interface Props { userId: string; }

export async function CreditSummary({ userId }: Props) {
  const credits = await fetchCreditData(userId);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Credit Balance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Available</p>
          <p className="mt-2 text-3xl font-bold text-indigo-900">{credits.available}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Purchased</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{credits.totalPurchased}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Used This Month</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{credits.usedThisMonth}</p>
        </div>
      </div>
      <div className="mt-6">
        <Link href="/pricing" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Manage Subscription & Credits →
        </Link>
      </div>
    </section>
  );
}
