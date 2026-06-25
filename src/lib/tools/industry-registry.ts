/**
 * SectorCalc — 27 active industry registry (Revenue Flow multi-sector launch).
 * Single source for industry metadata, categories, and additional analyzer copy.
 */

export type IndustryCategory =
 | "heavy-industry"
 | "building-trades"
 | "field-services"
 | "food-retail"
 | "custom-manufacturing"
 | "logistics-transport"
 | "agriculture-livestock"
 | "energy-environment"
 | "daily-life";

export type IndustrySlug =
 | "cnc-manufacturing"
 | "construction"
 | "cleaning"
 | "restaurant"
 | "ecommerce"
 | "welding-fabrication"
 | "hvac"
 | "electrical-contracting"
 | "landscaping-lawn-care"
 | "auto-repair-shop"
 | "printing-signage"
 | "plumbing"
 | "carpentry-millwork"
 | "roofing"
 | "painting"
 | "sheet-metal"
 | "3d-printing-service"
 | "logistics-transport"
 | "agriculture-crops"
 | "agriculture-irrigation"
 | "agriculture-feed"
 | "agriculture-dairy"
 | "energy-consumption"
 | "energy-carbon"
 | "daily-renovation"
 | "daily-fuel"
 | "daily-meals";

export type IndustryIcon =
 | "construction"
 | "cleaning"
 | "restaurant"
 | "ecommerce"
 | "manufacturing"
 | "trades"
 | "field-service"
 | "custom"
 | "agriculture"
 | "energy"
 | "daily";

export type AdditionalAnalyzer = {
 title: string;
 description: string;
};

export interface IndustryRegistryEntry {
 slug: IndustrySlug;
 name: string;
 category: IndustryCategory;
 description: string;
 painStatement: string;
 seoKeywords: readonly string[];
 priority: number;
 icon: IndustryIcon;
 accentColor: "blue" | "cyan" | "emerald" | "amber";
 additionalAnalyzers?: readonly AdditionalAnalyzer[];
}

export const INDUSTRY_CATEGORY_LABELS: Record<IndustryCategory, string> = {
 "heavy-industry": "Heavy Industry",
 "building-trades": "Building Trades",
 "field-services": "Field Services",
 "food-retail": "Food & Retail",
 "custom-manufacturing": "Custom Manufacturing",
 "logistics-transport": "Logistics & Transport",
 "agriculture-livestock": "Agriculture & Livestock",
 "energy-environment": "Energy & Environment",
 "daily-life": "Daily Life",
};

export const FEATURED_INDUSTRY_SLUGS: readonly IndustrySlug[] = [
 "cnc-manufacturing",
 "construction",
 "cleaning",
 "logistics-transport",
 "agriculture-crops",
 "energy-carbon",
 "daily-renovation",
] as const;

export const industryRegistry: readonly IndustryRegistryEntry[] = [
 {
 slug: "cnc-manufacturing",
 name: "CNC / Manufacturing",
 category: "heavy-industry",
 description:
 "Estimate machine time, calculate quote risk and protect shop-floor margin on CNC and job-shop work.",
 painStatement:
 "This one-off job may look profitable but setup and tooling can destroy the margin.",
 seoKeywords: [
 "cnc cost calculator",
 "machine shop quote calculator",
 "cnc quote risk calculator",
 ],
 priority: 1,
 icon: "manufacturing",
 accentColor: "blue",
 additionalAnalyzers: [
 {
 title: "Tool Life Cost Allocator",
 description:
 "Allocate tooling wear across batch size before quoting repeat or prototype jobs.",
 },
 ],
 },
 {
 slug: "construction",
 name: "Construction",
 category: "building-trades",
 description:
 "Estimate project costs, calculate change order impact and protect margin on contractor bids.",
 painStatement: "Small change orders can quietly erase project margin.",
 seoKeywords: [
 "construction cost calculator",
 "change order impact calculator",
 "project margin risk",
 ],
 priority: 2,
 icon: "construction",
 accentColor: "amber",
 additionalAnalyzers: [
 {
 title: "Subcontractor Margin Leak",
 description:
 "Spot when sub quotes compress head-contractor margin before you lock scope.",
 },
 ],
 },
 {
 slug: "cleaning",
 name: "Cleaning",
 category: "field-services",
 description:
 "Estimate cleaning job cost, optimize office bids and price recurring contracts with margin clarity.",
 painStatement:
 "A cleaning contract can look easy and still lose money every month.",
 seoKeywords: [
 "cleaning cost calculator",
 "office cleaning bid calculator",
 "cleaning contract pricing",
 ],
 priority: 3,
 icon: "cleaning",
 accentColor: "cyan",
 additionalAnalyzers: [
 {
 title: "Janitorial Supply Cost Guard",
 description:
 "Check whether supply and consumable assumptions erode monthly contract profit.",
 },
 ],
 },
 {
 slug: "restaurant",
 name: "Restaurant",
 category: "food-retail",
 description:
 "Check food cost ratios, detect menu profit leaks and protect margin after waste and delivery fees.",
 painStatement:
 "A popular menu item can still leak profit after waste, labor and commission.",
 seoKeywords: [
 "food cost calculator",
 "menu profit calculator",
 "restaurant margin leak detector",
 ],
 priority: 4,
 icon: "restaurant",
 accentColor: "emerald",
 additionalAnalyzers: [
 {
 title: "Delivery App Fee Killer",
 description:
 "Model how delivery commissions change real item margin before you promote on apps.",
 },
 ],
 },
 {
 slug: "ecommerce",
 name: "E-commerce",
 category: "food-retail",
 description:
 "Check product margins, return-rate erosion and net profit after ads, fees and shipping.",
 painStatement:
 "Sales can grow while returns, ads and fees erase the profit.",
 seoKeywords: [
 "product margin calculator",
 "return rate profit calculator",
 "ecommerce profit erosion",
 ],
 priority: 5,
 icon: "ecommerce",
 accentColor: "blue",
 additionalAnalyzers: [
 {
 title: "Ad Spend Break-Even Tool",
 description:
 "See whether ad cost per sale still leaves contribution margin after returns.",
 },
 ],
 },
 {
 slug: "welding-fabrication",
 name: "Welding & Fabrication",
 category: "heavy-industry",
 description:
 "Estimate welding job cost, rework exposure and minimum safe bid before you quote fabrication work.",
 painStatement:
 "Fit-up time and rework risk can turn a busy fab shop quote into a margin loss.",
 seoKeywords: [
 "welding cost estimator",
 "fabrication bid calculator",
 "welding bid risk calculator",
 ],
 priority: 6,
 icon: "manufacturing",
 accentColor: "blue",
 },
 {
 slug: "hvac",
 name: "HVAC",
 category: "building-trades",
 description:
 "Run quick tonnage checks and full project margin guards before you sign HVAC installs.",
 painStatement:
 "Equipment, ductwork and callback risk can compress HVAC project margin fast.",
 seoKeywords: [
 "hvac tonnage calculator",
 "hvac project cost estimator",
 "hvac margin guard",
 ],
 priority: 7,
 icon: "trades",
 accentColor: "cyan",
 },
 {
 slug: "electrical-contracting",
 name: "Electrical Contracting",
 category: "building-trades",
 description:
 "Estimate electrical labor and panel shop bids with inspection-risk margin protection.",
 painStatement:
 "Material, testing time and inspection delays can underprice electrical panel work.",
 seoKeywords: [
 "electrical labor estimator",
 "panel shop bid calculator",
 "electrical margin verdict",
 ],
 priority: 8,
 icon: "trades",
 accentColor: "amber",
 },
 {
 slug: "landscaping-lawn-care",
 name: "Landscaping & Lawn Care",
 category: "field-services",
 description:
 "Check lawn care visit cost and minimum monthly contract price before you sign recurring routes.",
 painStatement:
 "Fuel, crew hours and equipment wear can underprice monthly lawn contracts.",
 seoKeywords: [
 "lawn care cost calculator",
 "landscaping bid calculator",
 "landscaping contract profit tool",
 ],
 priority: 9,
 icon: "field-service",
 accentColor: "emerald",
 },
 {
 slug: "auto-repair-shop",
 name: "Auto Repair Shop",
 category: "field-services",
 description:
 "Compare quoted repair price to true labor, parts and comeback risk before you accept the job.",
 painStatement:
 "Diagnostic time and comeback risk can leak profit on quoted repair jobs.",
 seoKeywords: [
 "auto repair pricing calculator",
 "repair shop margin calculator",
 "auto shop margin leak detector",
 ],
 priority: 10,
 icon: "field-service",
 accentColor: "blue",
 },
 {
 slug: "printing-signage",
 name: "Printing & Signage",
 category: "custom-manufacturing",
 description:
 "Estimate print job cost and safe signage bid price before you accept design-heavy work.",
 painStatement:
 "Design time, install labor and reprint risk can erase signage job margin.",
 seoKeywords: [
 "print job cost calculator",
 "signage bid calculator",
 "signage safe price tool",
 ],
 priority: 11,
 icon: "custom",
 accentColor: "cyan",
 },
 {
 slug: "plumbing",
 name: "Plumbing",
 category: "building-trades",
 description:
 "Check fixture job cost and safe plumbing price before you commit to service calls.",
 painStatement:
 "Parts runs, callbacks and fixture complexity can underprice plumbing jobs.",
 seoKeywords: [
 "plumbing cost calculator",
 "plumbing job estimator",
 "plumbing margin verdict",
 ],
 priority: 12,
 icon: "trades",
 accentColor: "blue",
 },
 {
 slug: "carpentry-millwork",
 name: "Carpentry & Millwork",
 category: "custom-manufacturing",
 description:
 "Estimate cabinet cost and millwork bid risk with waste and install exposure included.",
 painStatement:
 "Waste, finishing and install time can underprice custom millwork bids.",
 seoKeywords: [
 "cabinet cost estimator",
 "millwork bid calculator",
 "millwork bid risk calculator",
 ],
 priority: 13,
 icon: "custom",
 accentColor: "amber",
 },
 {
 slug: "roofing",
 name: "Roofing",
 category: "building-trades",
 description:
 "Check roofing square cost and minimum contract bid with tear-off and weather delay risk.",
 painStatement:
 "Tear-off, dump fees and weather delays can turn roofing bids into warranty risk.",
 seoKeywords: [
 "roofing cost calculator",
 "roofing bid calculator",
 "roofing contract margin guard",
 ],
 priority: 14,
 icon: "trades",
 accentColor: "amber",
 },
 {
 slug: "painting",
 name: "Painting",
 category: "building-trades",
 description:
 "Estimate paint coverage cost and minimum job price with prep and touch-up risk included.",
 painStatement:
 "Prep time, scaffold cost and touch-ups can underprice painting jobs.",
 seoKeywords: [
 "painting cost calculator",
 "paint job estimator",
 "painting job profit verdict",
 ],
 priority: 15,
 icon: "trades",
 accentColor: "cyan",
 },
 {
 slug: "sheet-metal",
 name: "Machine Shop — Sheet Metal",
 category: "heavy-industry",
 description:
 "Check laser cutting time exposure and safe sheet metal quote before you accept low-volume jobs.",
 painStatement:
 "Programming, setup and scrap can destroy margin on sheet metal quotes.",
 seoKeywords: [
 "laser cutting cost calculator",
 "sheet metal quote calculator",
 "sheet metal quote risk tool",
 ],
 priority: 16,
 icon: "manufacturing",
 accentColor: "blue",
 },
 {
 slug: "3d-printing-service",
 name: "3D Printing Service",
 category: "heavy-industry",
 description:
 "Estimate 3D print job cost and minimum print price with fail-rate margin protection.",
 painStatement:
 "Print failures and post-processing can erase profit on custom 3D print jobs.",
 seoKeywords: [
 "3d print cost calculator",
 "3d printing job estimator",
 "3d print margin tool",
 ],
 priority: 17,
 icon: "manufacturing",
 accentColor: "cyan",
 },
 {
 slug: "logistics-transport",
 name: "Logistics & Transport",
 category: "logistics-transport",
 description:
 "Calculate volumetric (desi) weight, route cost exposure and freight margin risk before you quote a load.",
 painStatement:
 "Desi miscalculations and empty return miles can quietly erase freight margin.",
 seoKeywords: [
 "desi calculator",
 "freight cost calculator",
 "route optimization calculator",
 "volumetric weight shipping",
 ],
 priority: 18,
 icon: "field-service",
 accentColor: "amber",
 },
 {
 slug: "agriculture-crops",
 name: "Crop & Fertilizer",
 category: "agriculture-livestock",
 description:
 "Calculate fertilizer dosage, crop yield exposure and soil moisture risk before planting season commitments.",
 painStatement:
 "Fertilizer over-application and weather gaps can destroy crop margin before harvest.",
seoKeywords: [
"fertilizer dosage calculator",
"crop yield calculator",
],
 priority: 19,
 icon: "agriculture",
 accentColor: "emerald",
 },
 {
 slug: "agriculture-irrigation",
 name: "Irrigation & Water",
 category: "agriculture-livestock",
 description:
 "Estimate irrigation cost and water efficiency before expanding acreage or signing supply contracts.",
 painStatement:
 "Underestimated pumping and water rights cost can erase field margin.",
 seoKeywords: [
 "irrigation cost calculator",
 "water efficiency farm",
 "sulama maliyeti",
 ],
 priority: 20,
 icon: "agriculture",
 accentColor: "cyan",
 },
 {
 slug: "agriculture-feed",
 name: "Livestock Feed",
 category: "agriculture-livestock",
 description:
 "Estimate feed cost and efficiency exposure for cattle and herd operations.",
 painStatement:
 "Feed waste and storage loss can quietly exceed milk or meat revenue.",
 seoKeywords: ["feed cost calculator", "yem maliyeti", "feed efficiency livestock"],
 priority: 21,
 icon: "agriculture",
 accentColor: "amber",
 },
 {
 slug: "agriculture-dairy",
 name: "Dairy & Milk Yield",
 category: "agriculture-livestock",
 description:
 "Check milk yield versus feed cost and detect dairy profit leaks.",
 painStatement:
 "Low yield per cow with rising feed prices destroys dairy profitability.",
 seoKeywords: ["milk yield calculator", "dairy profit calculator"],
 priority: 22,
 icon: "agriculture",
 accentColor: "emerald",
 },
 {
 slug: "energy-consumption",
 name: "Energy Consumption",
 category: "energy-environment",
 description:
 "Check kWh exposure and energy efficiency before capex or tariff renegotiation.",
 painStatement:
 "Unmanaged kWh spikes and demand charges can blow operating budgets.",
seoKeywords: [
"kwh consumption calculator",
"energy efficiency report",
],
 priority: 23,
 icon: "energy",
 accentColor: "amber",
 },
 {
 slug: "energy-carbon",
 name: "Carbon & CBAM",
 category: "energy-environment",
 description:
 "Estimate carbon footprint and CBAM-style import cost before EU shipments.",
 painStatement:
 "Carbon border costs can erase export margin if not modeled upfront.",
seoKeywords: [
"carbon footprint calculator",
"CBAM compliance",
],
 priority: 24,
 icon: "energy",
 accentColor: "emerald",
 },
 {
 slug: "daily-renovation",
 name: "Home Renovation",
 category: "daily-life",
 description:
 "Estimate renovation cost per m² with regional and seasonal buffers.",
 painStatement:
 "Renovation budgets blow up when weather delays and city premiums are ignored.",
 seoKeywords: ["home renovation calculator", "renovation budget"],
 priority: 25,
 icon: "daily",
 accentColor: "blue",
 },
 {
 slug: "daily-fuel",
 name: "Fuel & Travel",
 category: "daily-life",
 description:
 "Check fuel consumption and trip budget before long drives or fleet trips.",
 painStatement:
 "Fuel and toll surprises can wreck personal or small fleet travel budgets.",
 seoKeywords: ["fuel consumption calculator", "trip budget"],
 priority: 26,
 icon: "daily",
 accentColor: "cyan",
 },
 {
 slug: "daily-meals",
 name: "Meals & Grocery",
 category: "daily-life",
 description:
 "Calculate recipe and weekly grocery cost with waste and inflation buffers.",
 painStatement:
 "Food waste and premium ingredient drift erode household food budgets.",
 seoKeywords: ["recipe cost calculator", "meal planning budget", "yemek tarifi maliyeti"],
 priority: 27,
 icon: "daily",
 accentColor: "amber",
 },
] as const;

export function getIndustryRegistryEntry(
 slug: string
): IndustryRegistryEntry | undefined {
 return industryRegistry.find((entry) => entry.slug === slug);
}

export function getIndustriesByCategory(
 category: IndustryCategory
): IndustryRegistryEntry[] {
 return industryRegistry
 .filter((entry) => entry.category === category)
 .sort((a, b) => a.priority - b.priority);
}

export function getAllIndustryCategories(): IndustryCategory[] {
 return [
 "heavy-industry",
 "building-trades",
 "field-services",
 "food-retail",
 "custom-manufacturing",
 "logistics-transport",
 "agriculture-livestock",
 "energy-environment",
 "daily-life",
 ];
}

export function getIndustryDisplayName(slug: IndustrySlug): string {
 return getIndustryRegistryEntry(slug)?.name ?? slug;
}

export function buildIndustrySeoDescription(name: string): string {
 return `Use SectorCalc tools to check ${name} cost risk, bid margin and hidden profit leaks before accepting work.`;
}

export function buildIndustrySeoTitle(name: string): string {
 return `${name} Cost & Margin Tools`;
}
