import { Link } from "@/i18n/routing";

export type CrawlIndexGroup = {
  readonly label: string;
  readonly links: readonly { readonly href: string; readonly label: string }[];
};

export type CrawlIndexLinkListProps = {
  readonly title?: string;
  readonly groups: readonly CrawlIndexGroup[];
};

export function CrawlIndexLinkList({
  title = "Calculator index",
  groups,
}: CrawlIndexLinkListProps) {
  return (
    <section className="sc-crawl-index" aria-labelledby="crawl-index-title">
      <h2 id="crawl-index-title" className="sc-crawl-index__title">
        {title}
      </h2>
      <p className="sc-crawl-index__note">
        Crawl-friendly index of public calculators and analyzers on SectorCalc.
      </p>
      <div className="sc-crawl-index__groups">
        {groups.map((group) => (
          <div key={group.label} className="sc-crawl-index__group">
            <h3 className="sc-crawl-index__group-title">{group.label}</h3>
            <ul className="sc-crawl-index__list">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="sc-crawl-index__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
