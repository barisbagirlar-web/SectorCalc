import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import {
  countToolsForHomepageCoverage,
  HOMEPAGE_COVERAGE_FILTER_SLUG,
} from "@/lib/home/homepage-coverage-tool-map";
import { readHomepageStringArray, resolveHomepageMessage } from "@/lib/home/homepage-component-utils";
import {
  HOMEPAGE_COVERAGE_IDS,
  type HomepageCoverageId,
} from "@/lib/home/homepage-positioning-data";
import { getAllTools } from "@/lib/tools/all-tools-data";
import { cn } from "@/lib/cn";

type CategoryGridProps = {
  readonly locale: string;
};

export async function CategoryGrid({ locale }: CategoryGridProps) {
  const t = await getTranslations("homepageHybrid");
  const subtitle = t.has("coverage.subtitle") ? t("coverage.subtitle") : "";
  const tools = getAllTools(locale);

  return (
    <section
      className="sc-home-omni__section sc-home-omni__section--surface"
      aria-labelledby="home-coverage-heading"
    >
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <header className="sc-home-omni__section-head">
          <h2 id="home-coverage-heading" className="sc-home-omni__section-title">
            {t("coverage.title")}
          </h2>
          {subtitle ? <p className="sc-home-omni__section-lead">{subtitle}</p> : null}
        </header>

        <section aria-labelledby="home-coverage-browse-heading">
          <h3
            id="home-coverage-browse-heading"
            className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700"
          >
            {t("coverage.browseByCategory")}
          </h3>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {HOMEPAGE_COVERAGE_IDS.map((id) => {
              const coverageId = id as HomepageCoverageId;
              const tags = t.has(`coverage.items.${id}.tags`)
                ? readHomepageStringArray(t.raw(`coverage.items.${id}.tags`))
                : [];
              const { icon: Icon } = getCategoryCardIcon(id);
              const title = resolveHomepageMessage(
                t,
                `coverage.items.${id}.shortTitle`,
                `coverage.items.${id}.title`,
              );
              const toolCount = countToolsForHomepageCoverage(coverageId, tools);
              const filterSlug = HOMEPAGE_COVERAGE_FILTER_SLUG[coverageId];

              return (
                <li key={id}>
                  <Link
                    href={`/free-tools?category=${encodeURIComponent(filterSlug)}`}
                    prefetch={false}
                    className={cn(
                      "group flex min-h-[148px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-5 text-center shadow-sm transition",
                      "hover:-translate-y-0.5 hover:border-[#d4af37] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2",
                    )}
                    data-category-icon-name={id}
                  >
                    <Icon
                      className="mb-3 h-12 w-12 text-[#C45A2C] transition group-hover:text-[#9a3412]"
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                    <h4 className="line-clamp-2 text-sm font-bold text-gray-800">{title}</h4>
                    <p className="mt-1 text-xs text-gray-400">
                      {t("coverage.toolCount", { count: toolCount })}
                    </p>
                    {tags.length > 0 ? (
                      <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.6875rem] text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </Container>
    </section>
  );
}
