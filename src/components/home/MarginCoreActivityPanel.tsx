import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ACTIVITY_PLACEHOLDER_ROWS } from "@/lib/ui-shared/home/margincore-dashboard-data";

function formatActivityTimestamp(iso: string, locale: string): string {
  if (!iso) {
    return "—";
  }

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }

  return parsed.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function MarginCoreActivityPanel({ locale }: { locale: string }) {
  const t = await getTranslations("homeDashboard");

  return (
    <section
      aria-labelledby="activity-panel-heading"
      className="bg-bg-subtle"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-border-subtle pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
              {t("activity.eyebrow")}
            </p>
            <h2
              id="activity-panel-heading"
              className="mt-2 text-xl font-semibold tracking-tight text-deep-navy sm:text-2xl"
            >
              {t("activity.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              {t("activity.subtitle")}
            </p>
          </div>
          <Link
            href="/account/reports"
            className="inline-flex min-h-[44px] items-center border border-border-subtle bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-deep-navy/30"
          >
            {t("activity.viewAll")}
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto border border-border-subtle bg-white">
          <table className="bf-table min-w-[640px]">
            <caption className="sr-only">{t("activity.title")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("activity.columns.id")}</th>
                <th scope="col">{t("activity.columns.sector")}</th>
                <th scope="col">{t("activity.columns.verdict")}</th>
                <th scope="col">{t("activity.columns.updated")}</th>
                <th scope="col">{t("activity.columns.status")}</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_PLACEHOLDER_ROWS.map((row) => (
                <tr key={row.id}>
                  <td className="font-mono text-xs">{row.id}</td>
                  <td>{row.sector}</td>
                  <td
                    className={
                      row.status === "pending"
                        ? "text-text-secondary"
                        : "font-medium text-deep-navy"
                    }
                  >
                    {row.verdict}
                  </td>
                  <td className="font-mono text-xs text-text-secondary">
                    {formatActivityTimestamp(row.updatedAt, locale)}
                  </td>
                  <td>
                    <span
                      className={
                        row.status === "sample"
                          ? "font-mono text-[10px] uppercase tracking-wide text-amber"
                          : row.status === "pending"
                            ? "font-mono text-[10px] uppercase tracking-wide text-text-secondary"
                            : "font-mono text-[10px] uppercase tracking-wide text-deep-navy"
                      }
                    >
                      {t(`activity.status.${row.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-text-secondary">
          {t("activity.disclaimer")}
        </p>
      </div>
    </section>
  );
}
