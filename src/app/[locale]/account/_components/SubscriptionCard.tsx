interface Props { userId: string; }

export async function SubscriptionCard({ userId }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Standard Plan</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      </div>
      <a href="/pricing" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Upgrade Plan →
      </a>
    </section>
  );
}
