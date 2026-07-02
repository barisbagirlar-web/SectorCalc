import Link from "next/link";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { parseSavedVerdictReport, type SavedVerdictReport } from "@/lib/features/reports/report-storage";

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function fetchRecentReports(userId: string): Promise<SavedVerdictReport[]> {
  const db = getAdminFirestore();
  if (!db) return [];

  try {
    const snapshot = await db
      .collection("reports")
      .where("uid", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const reports: SavedVerdictReport[] = [];
    snapshot.forEach((doc) => {
      const parsed = parseSavedVerdictReport(doc.id, doc.data());
      if (parsed) reports.push(parsed);
    });
    return reports;
  } catch {
    return [];
  }
}

interface Props {
  userId: string;
}

export async function RecentActivity({ userId }: Props) {
  const reports = await fetchRecentReports(userId);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        {reports.length > 0 && (
          <Link href="/account/reports" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="text-sm text-gray-500 italic">
          <p>No recent calculations found.</p>
          <p className="mt-1">Run a calculator to see your activity here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {reports.map((report) => (
            <li key={report.id}>
              <Link
                href={`/account/reports/${report.id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {report.toolTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {report.result.verdict} · {report.result.primaryMetricValue}
                  </p>
                </div>
                <div className="text-xs text-gray-400 shrink-0 ml-4">
                  {formatDate(report.createdAt)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
