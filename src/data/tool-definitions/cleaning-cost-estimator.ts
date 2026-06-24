import type { ToolDefinition } from "@/data/tool-schema";

export const cleaningCostEstimatorDefinition: ToolDefinition = {
 id: "cleaning-cost-estimator",
 slug: "cleaning-cost-estimator",
 tier: "free",
 industryId: "cleaning",
 title: "Cleaning Cost Estimator",
 shortDescription:
 "Estimate basic cleaning job cost using area, crew size, labor time, supplies and travel.",
 longDescription:
 "Calculate a quick cleaning job estimate from square footage, crew hours, labor cost, supplies and travel. Use the per-square-foot and per-crew-hour results to sanity-check bids before sending a quote.",
 inputs: [
 {
 id: "area",
 label: "Area to clean",
 type: "number",
 unit: "sq ft",
 defaultValue: 2500,
 min: 0,
 step: 1,
 helperText: "Total area to be cleaned.",
 required: true,
 },
 {
 id: "estimatedHours",
 label: "Estimated hours",
 type: "number",
 defaultValue: 4,
 min: 0.1,
 step: 0.1,
 helperText: "Estimated job duration for the crew.",
 required: true,
 },
 {
 id: "crewSize",
 label: "Crew size",
 type: "number",
 defaultValue: 2,
 min: 1,
 step: 1,
 helperText: "Number of cleaners assigned to the job.",
 required: true,
 },
 {
 id: "laborHourlyCost",
 label: "Labor hourly cost",
 type: "number",
 currency: true,
 defaultValue: 18,
 min: 0,
 step: 0.01,
 helperText:
 "Cost per cleaner per hour including wage, tax or contractor cost.",
 required: true,
 },
 {
 id: "suppliesCost",
 label: "Supplies cost",
 type: "number",
 currency: true,
 defaultValue: 35,
 min: 0,
 step: 0.01,
 helperText:
 "Cleaning supplies, chemicals, consumables and small equipment.",
 required: true,
 },
 {
 id: "travelCost",
 label: "Travel cost",
 type: "number",
 currency: true,
 defaultValue: 25,
 min: 0,
 step: 0.01,
 helperText: "Fuel, parking, travel time or distance-related cost.",
 required: true,
 },
 ],
 outputs: [
 { id: "totalCost", label: "Estimated cleaning cost", currency: true },
 { id: "laborCost", label: "Labor cost", currency: true },
 { id: "costPerSqFt", label: "Cost per sq ft", currency: true },
 { id: "costPerCrewHour", label: "Cost per crew hour", currency: true },
 ],
 premiumTeaser: {
 title: "Need decision-level calculation?",
 text: "Open the Office Cleaning Bid Optimizer to see minimum safe monthly bid, customer budget gap, margin at budget, risk level, scenarios and a decision report.",
 ctaLabel: "Open Office Cleaning Bid Optimizer",
 ctaHref: "/tools/premium/office-cleaning-bid-optimizer",
 },
 relatedToolIds: [
 "office-cleaning-bid-optimizer",
 "project-cost-estimator",
 "food-cost-calculator",
 ],
 seo: {
 title: "Cleaning Cost Estimator",
 description:
 "Estimate cleaning job cost using area, crew size, labor hours, supplies and travel.",
 canonicalPath: "/tools/free/cleaning-cost-estimator",
 },
 calculatorId: "cleaning-cost-estimator",
 interpretationNote:
 "This estimate includes labor, supplies and travel. For recurring or commercial cleaning, the minimum safe bid should also consider route density, contract length and margin protection.",
 faqPlaceholder:
 "Who it is for: cleaning operators pricing one-off or recurring jobs. What to do with the result: compare to customer budget before signing; open the Office Cleaning Bid Optimizer for recurring commercial contracts. Assumptions follow your crew and area inputs.",
};
