import type { ToolDefinition } from "@/data/tool-schema";

export const projectCostEstimatorDefinition: ToolDefinition = {
 id: "project-cost-estimator",
 slug: "project-cost-estimator",
 tier: "free",
 industryId: "construction",
 title: "Project Cost Estimator",
 shortDescription:
 "Estimate the basic cost of a construction or renovation project using materials, labor, overhead and contingency.",
 longDescription:
 "Use this free estimator to calculate a quick construction project cost. It provides an indicative cost breakdown and helps identify whether material, labor or overhead is driving the estimate.",
 inputs: [
 {
 id: "materialCost",
 label: "Material cost",
 type: "number",
 currency: true,
 defaultValue: 8000,
 min: 0,
 step: 1,
 helperText:
 "Include purchased materials, delivery, waste allowance and supplier charges.",
 required: true,
 },
 {
 id: "laborHours",
 label: "Labor hours",
 type: "number",
 defaultValue: 120,
 min: 0,
 step: 1,
 helperText: "Total estimated labor hours for the project.",
 required: true,
 },
 {
 id: "laborHourlyRate",
 label: "Labor hourly rate",
 type: "number",
 currency: true,
 defaultValue: 35,
 min: 0,
 step: 0.01,
 helperText:
 "Include wages, subcontractor cost, taxes or crew cost per hour.",
 required: true,
 },
 {
 id: "equipmentCost",
 label: "Equipment / rental cost",
 type: "number",
 currency: true,
 defaultValue: 1200,
 min: 0,
 step: 1,
 helperText:
 "Include equipment rental, tools, machinery or site-related equipment costs.",
 required: true,
 },
 {
 id: "overheadRate",
 label: "Overhead %",
 type: "number",
 unit: "%",
 defaultValue: 12,
 min: 0,
 max: 100,
 step: 0.1,
 helperText:
 "Add indirect cost allocation such as supervision, insurance, transport and admin.",
 required: true,
 },
 {
 id: "contingencyRate",
 label: "Contingency %",
 type: "number",
 unit: "%",
 defaultValue: 10,
 min: 0,
 max: 100,
 step: 0.1,
 helperText:
 "Add a buffer for uncertainty, waste, price changes or small scope changes.",
 required: true,
 },
 ],
 outputs: [
 { id: "estimatedProjectCost", label: "Estimated project cost", currency: true },
 { id: "laborCost", label: "Labor cost", currency: true },
 { id: "overheadCost", label: "Overhead cost", currency: true },
 { id: "contingencyCost", label: "Contingency amount", currency: true },
 ],
 premiumTeaser: {
 title: "Need decision-level analysis?",
 text: "Open the Change Order Impact Analyzer to see minimum safe change price, margin impact on the full project, risk level, scenario analysis and a packaged decision report.",
 ctaLabel: "Open Change Order Impact Analyzer",
 ctaHref: "/tools/premium/change-order-impact-analyzer",
 },
 relatedToolIds: [
 "change-order-impact-analyzer",
 "cleaning-cost-estimator",
 "machine-hour-estimator",
 ],
 seo: {
 title: "Project Cost Estimator",
 description:
 "Estimate construction project cost with materials, labor, equipment, overhead and contingency.",
 canonicalPath: "/tools/free/project-cost-estimator",
 },
 calculatorId: "project-cost-estimator",
 interpretationNote:
 "This estimate is based on direct project costs plus overhead and contingency. It does not replace a full bid analysis, but it helps reveal whether labor, materials or overhead are driving the project cost.",
 faqPlaceholder:
 "Who it is for: contractors, estimators and project managers needing a fast project cost range. What to do with the result: sanity-check bid components before submitting; use the Change Order Impact Analyzer when scope changes affect total margin. Assumptions follow your entered costs — indicative only.",
};
