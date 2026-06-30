import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  buildExecutiveSectorRows,
  DASHBOARD_SECTOR_GROUPS,
  type DashboardSectorGroupId,
} from "@/lib/ui-shared/home/margincore-dashboard-data";
import { industryRegistry } from "@/lib/features/tools/industry-registry";

function sectorDisplayName(slug: (typeof DASHBOARD_SECTOR_GROUPS)[number]["slugs"][number]): string {
  return industryRegistry.find((entry) => entry.slug === slug)?.name ?? slug;
}

export async function MarginCoreExecutiveGrid() {
  const t = await getTranslations("homeDashboard");

  const groupLabels: Record<DashboardSectorGroupId, string> = {
    industry: t("groups.industry"),
    construction: t("groups.construction"),
    logistics: t("groups.logistics"),
  };

  return (
    <section
      aria-labelledby="executive-grid-heading"
      className="border-b border-border-subtle bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="border-b border-border-subtle pb-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
            {t("grid.eyebrow")}
          </p>
          <h2
            id="executive-grid-heading"
            className="mt-2 text-xl font-semibold tracking-tight text-deep-navy sm:text-2xl"
          >
            {t("grid.title")}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {t("grid.subtitle")}
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {DASHBOARD_SECTOR_GROUPS.map((group) => {
            const rows = buildExecutiveSectorRows(group.slugs, sectorDisplayName);

            return (
              <article
                key={group.id}
                className="flex flex-col border border-border-subtle bg-bg-subtle"
              >
                <header className="border-b border-border-subtle bg-deep-navy px-4 py-3">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white">
                    {groupLabels[group.id]}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-white/55">
                    {t("grid.sectorCount", { count: rows.length })}
                  </p>
                </header>

                <ul className="flex flex-1 flex-col divide-y divide-border-subtle">
                  {rows.map((row) => (
                    <li key={row.slug} className="px-4 py-4">
                      <p className="text-sm font-semibold text-deep-navy">
                        {row.sectorName}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
                        <li>
                          <span className="font-mono text-[10px] uppercase tracking-wide text-text-secondary">
                            {t("grid.freeLabel")}
                          </span>
                          <Link
                            href={row.freeHref}
                            className="mt-0.5 block text-text-primary underline-offset-2 hover:text-deep-navy hover:underline"
                          >
                            {row.freeTool}
                          </Link>
                        </li>
                        <li>
                          <span className="font-mono text-[10px] uppercase tracking-wide text-amber">
                            {t("grid.proLabel")}
                          </span>
                          <Link
                            href={row.premiumHref}
                            className="mt-0.5 block font-medium text-deep-navy underline-offset-2 hover:underline"
                          >
                            {row.premiumTool}
                          </Link>
                        </li>
                      </ul>
                      <p className="mt-3 border-l-2 border-amber/40 pl-3 text-xs leading-relaxed text-text-secondary">
                        {row.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
