export type IndustrySlug =
  | "construction"
  | "cleaning"
  | "restaurant"
  | "ecommerce"
  | "cnc-manufacturing";

export interface Industry {
  slug: IndustrySlug;
  name: string;
  shortDescription: string;
  description: string;
  /** One-line pain for industry listing cards */
  businessPain: string;
  href: string;
  icon: IndustryIcon;
  accentColor: "blue" | "cyan" | "emerald" | "amber";
  freeToolSlugs: string[];
  premiumToolSlugs: string[];
}

export type IndustryIcon =
  | "construction"
  | "cleaning"
  | "restaurant"
  | "ecommerce"
  | "manufacturing";

export const INDUSTRIES: Industry[] = [
  {
    slug: "construction",
    name: "Construction",
    shortDescription: "Project costing, change orders, and bid decisions.",
    businessPain:
      "Bids and change orders often move forward without a clear view of margin impact on the full project.",
    description:
      "Estimate project costs, analyze change order impact, and make confident bidding decisions for contractors and builders.",
    href: "/industries/construction",
    icon: "construction",
    accentColor: "amber",
    freeToolSlugs: ["project-cost-calculator"],
    premiumToolSlugs: ["change-order-impact-analyzer"],
  },
  {
    slug: "cleaning",
    name: "Cleaning",
    shortDescription: "Service costing and commercial bid optimization.",
    businessPain:
      "Recurring office contracts are often priced before crew, travel and overhead margin are visible.",
    description:
      "Calculate cleaning service costs, optimize office bids, and price contracts with operational clarity.",
    href: "/industries/cleaning",
    icon: "cleaning",
    accentColor: "cyan",
    freeToolSlugs: ["cleaning-cost-calculator"],
    premiumToolSlugs: ["office-cleaning-bid-optimizer"],
  },
  {
    slug: "restaurant",
    name: "Restaurant",
    shortDescription: "Food cost, menu margins, and profit leak detection.",
    businessPain:
      "Menu items can stay popular while waste, labor and delivery commissions quietly erode margin.",
    description:
      "Control food costs, protect menu margins, and identify profit leaks before they erode your bottom line.",
    href: "/industries/restaurant",
    icon: "restaurant",
    accentColor: "emerald",
    freeToolSlugs: ["food-cost-calculator"],
    premiumToolSlugs: ["menu-profit-leak-detector"],
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    shortDescription: "Product margins and return-rate profit analysis.",
    businessPain:
      "Returns, fees and ad spend can erode catalog profit even when top-line revenue looks healthy.",
    description:
      "Model product margins, understand return-rate erosion, and price with confidence across your catalog.",
    href: "/industries/ecommerce",
    icon: "ecommerce",
    accentColor: "blue",
    freeToolSlugs: ["product-margin-calculator"],
    premiumToolSlugs: ["return-profit-erosion-tool"],
  },
  {
    slug: "cnc-manufacturing",
    name: "CNC & Manufacturing",
    shortDescription: "Machine-hour costing and safe quote analysis.",
    businessPain:
      "Small shops often quote jobs without full visibility into setup, scrap, tooling and machine-hour cost.",
    description:
      "Estimate machine hours, analyze minimum safe quotes, and protect shop-floor profitability on every job.",
    href: "/industries/cnc-manufacturing",
    icon: "manufacturing",
    accentColor: "blue",
    freeToolSlugs: ["machine-time-calculator"],
    premiumToolSlugs: ["cnc-quote-risk-analyzer"],
  },
];

export function getIndustryBySlug(slug: IndustrySlug): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function getIndustryByHref(href: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.href === href);
}
