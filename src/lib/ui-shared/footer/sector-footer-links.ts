import { getPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-registry";
import { isCanonicalPremiumSlug } from "@/lib/features/tools/canonical-tool-slugs";
import { getPremiumSchemaToolHref } from "@/lib/features/tools/tool-links";

export type SectorFooterPanelLink = {
  readonly labelKey: string;
  readonly premiumSchemaSlug?: string;
  readonly fallbackHref: string;
};

export const SECTOR_FOOTER_COST_LINKS: readonly SectorFooterPanelLink[] = [
  {
    labelKey: "panel1Link1",
    premiumSchemaSlug: "quote-price-profit-margin-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel1Link2",
    premiumSchemaSlug: "shop-rate-hourly-cost-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel1Link3",
    premiumSchemaSlug: "break-even-safety-margin-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel1Link4",
    premiumSchemaSlug: "employee-total-cost-calculator",
    fallbackHref: "/free-tools",
  },
] as const;

export const SECTOR_FOOTER_LOSS_LINKS: readonly SectorFooterPanelLink[] = [
  {
    labelKey: "panel2Link1",
    premiumSchemaSlug: "sheet-metal-scrap-risk",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel2Link2",
    premiumSchemaSlug: "downtime-minute-cost-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel2Link3",
    premiumSchemaSlug: "inventory-carrying-cost-eoq-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel2Link4",
    premiumSchemaSlug: "quality-cost-paf-calculator",
    fallbackHref: "/free-tools",
  },
] as const;

export const SECTOR_FOOTER_TECHNICAL_LINKS: readonly SectorFooterPanelLink[] = [
  {
    labelKey: "panel3Link1",
    premiumSchemaSlug: "oee-equipment-effectiveness-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel3Link2",
    premiumSchemaSlug: "compressor-leak-cost-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel3Link3",
    premiumSchemaSlug: "bolt-tightening-torque-calculator",
    fallbackHref: "/free-tools",
  },
  {
    labelKey: "panel3Link4",
    premiumSchemaSlug: "carbon-footprint-compliance-risk",
    fallbackHref: "/free-tools",
  },
] as const;

export function resolveSectorFooterPremiumHref(slug: string | undefined, fallbackHref: string): string {
  if (!slug || !isCanonicalPremiumSlug(slug)) {
    return fallbackHref;
  }
  const schema = getPremiumCalculatorSchema(slug);
  if (!schema) {
    return `/tools/generated/${slug.replace(/-premium$/, "")}`;
  }
  return getPremiumSchemaToolHref(slug);
}

export function getSectorFooterApiHref(): string {
  return "/calculator-library";
}
