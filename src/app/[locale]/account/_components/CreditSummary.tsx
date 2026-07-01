import { getUserCredits } from "@/lib/features/credits/credits-manager";

interface Props { userId: string; }

export async function CreditSummary({ userId }: Props) {
  const available = await getUserCredits(userId);
  const credits = { available, totalPurchased: 0, usedThisMonth: 0 }; 

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
        <a href="/pricing" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Manage Subscription & Credits →
        </a>
      </div>
    </section>
  );
}
