import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolCatalogByCategory } from "@/components/tools/ToolCatalogByCategory";
import { Container } from "@/components/ui/Container";
import { FREE_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Calculator Categories",
  description:
    "Browse SectorCalc tools by function: OEE, scrap, routing, calibration, energy, margin and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <PageLayout>
      <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-navy">
            Categories
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Find the right calculator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            Measure money, material, time and energy losses — grouped by what you need on the
            shop floor.
          </p>
        </Container>
      </section>

      <section className="border-b border-border-subtle bg-white py-10 sm:py-14">
        <Container size="wide">
          <ToolCatalogByCategory tools={FREE_TOOLS} />
        </Container>
      </section>
    </PageLayout>
  );
}
