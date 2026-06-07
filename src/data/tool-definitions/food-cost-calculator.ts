import type { ToolDefinition } from "@/data/tool-schema";

export const foodCostCalculatorDefinition: ToolDefinition = {
 id: "food-cost-calculator",
 slug: "food-cost-calculator",
 tier: "free",
 industryId: "restaurant",
 title: "Food Cost Calculator",
 shortDescription:
 "Calculate plate cost and food cost percentage using ingredient cost, portions and selling price.",
 longDescription:
 "Break down recipe batch cost into per-plate food cost, food cost percentage and gross profit per portion. Factor in waste and packaging to see whether a menu price is structurally sound.",
 inputs: [
 {
 id: "ingredientCost",
 label: "Total ingredient cost",
 type: "number",
 currency: true,
 defaultValue: 42,
 min: 0,
 step: 0.01,
 helperText: "Total ingredient cost for the recipe batch.",
 required: true,
 },
 {
 id: "portions",
 label: "Portions produced",
 type: "number",
 defaultValue: 10,
 min: 1,
 step: 1,
 helperText: "Number of portions produced from the recipe.",
 required: true,
 },
 {
 id: "sellingPrice",
 label: "Selling price per portion",
 type: "number",
 currency: true,
 defaultValue: 12,
 min: 0,
 step: 0.01,
 helperText: "Menu selling price for one portion.",
 required: true,
 },
 {
 id: "wasteRate",
 label: "Waste / yield loss %",
 type: "number",
 unit: "%",
 defaultValue: 5,
 min: 0,
 max: 100,
 step: 0.1,
 helperText: "Expected waste, trimming, spoilage or yield loss.",
 required: true,
 },
 {
 id: "extraCostPerPortion",
 label: "Packaging / garnish cost per portion",
 type: "number",
 currency: true,
 defaultValue: 0.75,
 min: 0,
 step: 0.01,
 helperText:
 "Add packaging, garnish, sauces or small extras per portion.",
 required: true,
 },
 ],
 outputs: [
 { id: "plateCost", label: "Plate cost", currency: true },
 { id: "foodCostPercentage", label: "Food cost %", unit: "%" },
 { id: "grossProfitPerPlate", label: "Gross profit per plate", currency: true },
 { id: "adjustedIngredientCost", label: "Adjusted ingredient cost", currency: true },
 ],
 premiumTeaser: {
 title: "Need decision-level analysis?",
 text: "Open the Menu Profit Leak Detector to see minimum safe price, delivery commission impact, monthly profit leak, risk level, scenarios and a decision report.",
 ctaLabel: "Open Menu Profit Leak Detector",
 ctaHref: "/tools/premium/menu-profit-leak-detector",
 },
 relatedToolIds: [
 "menu-profit-leak-detector",
 "product-margin-calculator",
 "cleaning-cost-estimator",
 ],
 seo: {
 title: "Food Cost Calculator",
 description:
 "Calculate plate cost and food cost percentage from ingredient cost, portions, waste and selling price.",
 canonicalPath: "/tools/free/food-cost-calculator",
 },
 calculatorId: "food-cost-calculator",
 interpretationNote:
 "Food cost percentage shows how much of the menu price is consumed by ingredients and waste. A full menu decision should also consider labor, delivery commissions and product mix.",
 faqPlaceholder:
 "Who it is for: restaurant owners, chefs and operators pricing menu items. What to do with the result: flag items with high food cost % before promoting them; use Menu Profit Leak Detector for labor, delivery and mix effects. Assumptions follow your ingredient and waste inputs.",
};
