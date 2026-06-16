import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { readHomepageStringArray, resolveHomepageMessage } from "@/lib/home/homepage-component-utils";
import { HOMEPAGE_COVERAGE_IDS } from "@/lib/home/homepage-positioning-data";
import { cn } from "@/lib/cn";

export async function CategoryGrid() {
  const t = await getTranslations("homepageHybrid");
  const subtitle = t.has("coverage.subtitle") ? t("coverage.subtitle") : "";

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
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {HOMEPAGE_COVERAGE_IDS.map((id) => {
              const tags = t.has(`coverage.items.${id}.tags`)
                ? readHomepageStringArray(t.raw(`coverage.items.${id}.tags`))
                : [];
              const { icon: Icon } = getCategoryCardIcon(id);
              const title = resolveHomepageMessage(
                t,
                `coverage.items.${id}.shortTitle`,
                `coverage.items.${id}.title`,
              );

              return (
                <li key={id}>
                  <article
                    className={cn(
                      "group flex min-h-[132px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-3 py-5 text-center shadow-sm",
                      "transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md",
                    )}
                    data-category-icon-name={id}
                  >
                    <Icon
                      className="mb-3 h-8 w-8 text-[#C45A2C]"
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                    <h4 className="line-clamp-2 text-sm font-semibold text-slate-900">{title}</h4>
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
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      </Container>
    </section>
  );
}
