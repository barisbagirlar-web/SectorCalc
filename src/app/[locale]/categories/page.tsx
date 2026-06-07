import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import { FREE_TOOLS } from "@/data/tools";
import { buildSectorToolCatalogGroups } from "@/lib/catalog/build-catalog-groups";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Calculator Categories",
  description:
    "Browse SectorCalc tools by function: OEE, scrap, routing, calibration, energy, margin and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  const groups = buildSectorToolCatalogGroups(FREE_TOOLS);

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Categories</p>
          <h1 className="sc-pro-title sc-pro-title--compact">Find the right calculator</h1>
          <p className="sc-pro-lead">
            Choose the type of loss, measurement or decision you need first.
          </p>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <SectorCatalogExplorer groups={groups} variant="categories" />
        </Container>
      </section>
    </PageLayout>
  );
}
