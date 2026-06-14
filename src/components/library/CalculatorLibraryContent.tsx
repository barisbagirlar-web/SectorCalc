import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { PageLayout } from "@/components/layout/PageLayout";

type CalculatorLibraryContentProps = {
  readonly title: string;
  readonly lead: string;
  readonly resourcesTitle: string;
  readonly catalogsTitle: string;
  readonly llmsLabel: string;
  readonly indexLabel: string;
  readonly faqLabel: string;
  readonly servicesLabel: string;
  readonly freeToolsLabel: string;
  readonly premiumToolsLabel: string;
  readonly industriesLabel: string;
  readonly generatedToolsLabel: string;
};

export function CalculatorLibraryContent({
  title,
  lead,
  resourcesTitle,
  catalogsTitle,
  llmsLabel,
  indexLabel,
  faqLabel,
  servicesLabel,
  freeToolsLabel,
  premiumToolsLabel,
  industriesLabel,
  generatedToolsLabel,
}: CalculatorLibraryContentProps) {
  return (
    <PageLayout>
      <Container className="py-10 sm:py-14">
        <header className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-premium-velvet sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-premium-muted sm:text-base">{lead}</p>
        </header>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-premium-velvet">
              {resourcesTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="text-premium-copper hover:underline" href="/llms.txt">
                  {llmsLabel}
                </a>
              </li>
              <li>
                <a className="text-premium-copper hover:underline" href="/sectorcalc-index.txt">
                  {indexLabel}
                </a>
              </li>
              <li>
                <a className="text-premium-copper hover:underline" href="/faq-knowledge.txt">
                  {faqLabel}
                </a>
              </li>
              <li>
                <a className="text-premium-copper hover:underline" href="/services-products.txt">
                  {servicesLabel}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-premium-velvet">
              {catalogsTitle}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-premium-copper hover:underline" href="/free-tools">
                  {freeToolsLabel}
                </Link>
              </li>
              <li>
                <Link className="text-premium-copper hover:underline" href="/premium-tools">
                  {premiumToolsLabel}
                </Link>
              </li>
              <li>
                <Link className="text-premium-copper hover:underline" href="/industries">
                  {industriesLabel}
                </Link>
              </li>
              <li>
                <Link className="text-premium-copper hover:underline" href="/tools/generated">
                  {generatedToolsLabel}
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </Container>
    </PageLayout>
  );
}
