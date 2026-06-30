import { Container } from "@/components/ui/Container";

type CatalogPageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
};

export function CatalogPageHero({ eyebrow, title, subtitle }: CatalogPageHeroProps) {
  return (
    <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
      <Container className="sc-pro-container">
        {eyebrow ? <p className="sc-pro-eyebrow">{eyebrow}</p> : null}
        <h1 className="sc-pro-title sc-pro-title--compact">{title}</h1>
        <p className="sc-pro-lead">{subtitle}</p>
      </Container>
    </section>
  );
}
