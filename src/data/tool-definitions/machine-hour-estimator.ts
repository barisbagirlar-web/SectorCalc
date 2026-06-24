import type { ToolDefinition } from "@/data/tool-schema";

export const machineHourEstimatorDefinition: ToolDefinition = {
 id: "machine-hour-estimator",
 slug: "machine-hour-estimator",
 tier: "free",
 industryId: "cnc-manufacturing",
 title: "Machine Hour Estimator",
 shortDescription: "CNC and shop machine-hour cost estimates.",
 longDescription:
 "Estimate the true hourly cost of a production machine by spreading monthly machine, maintenance, energy, labor and overhead costs across productive hours — not just available hours.",
 inputs: [
 {
 id: "monthlyMachineCost",
 label: "Monthly machine lease or depreciation cost",
 type: "number",
 currency: true,
 defaultValue: 1200,
 min: 0,
 step: 1,
 helperText:
 "Include lease, depreciation or ownership cost allocated monthly.",
 required: true,
 },
 {
 id: "monthlyMaintenanceCost",
 label: "Monthly maintenance cost",
 type: "number",
 currency: true,
 defaultValue: 300,
 min: 0,
 step: 1,
 helperText:
 "Include routine maintenance, spare parts and service costs.",
 required: true,
 },
 {
 id: "monthlyEnergyCost",
 label: "Monthly electricity / energy cost",
 type: "number",
 currency: true,
 defaultValue: 450,
 min: 0,
 step: 1,
 helperText: "Use the estimated monthly energy cost for this machine.",
 required: true,
 },
 {
 id: "monthlyLaborCost",
 label: "Monthly operator labor cost",
 type: "number",
 currency: true,
 defaultValue: 2500,
 min: 0,
 step: 1,
 helperText:
 "Include wages, taxes, benefits or contractor cost for the operator.",
 required: true,
 },
 {
 id: "monthlyOverheadCost",
 label: "Monthly overhead allocation",
 type: "number",
 currency: true,
 defaultValue: 700,
 min: 0,
 step: 1,
 helperText:
 "Include rent, admin, insurance and indirect costs allocated to this machine.",
 required: true,
 },
 {
 id: "availableHours",
 label: "Available machine hours per month",
 type: "number",
 defaultValue: 160,
 min: 1,
 step: 1,
 helperText:
 "Total hours the machine could realistically work in a month.",
 required: true,
 },
 {
 id: "utilizationRate",
 label: "Utilization rate",
 type: "number",
 unit: "%",
 defaultValue: 70,
 min: 1,
 max: 100,
 step: 1,
 helperText:
 "Percentage of available hours the machine is actually used productively.",
 required: true,
 },
 ],
 outputs: [
 {
 id: "machineHourCost",
 label: "Estimated machine hour cost",
 currency: true,
 },
 {
 id: "productiveHours",
 label: "Productive hours per month",
 unit: "hours",
 },
 {
 id: "idleHours",
 label: "Estimated idle hours",
 unit: "hours",
 },
 {
 id: "idleCost",
 label: "Estimated idle capacity cost",
 currency: true,
 },
 ],
 premiumTeaser: {
 title: "Need decision-level calculation?",
 text: "Open the CNC Minimum Safe Quote Calculator to see minimum safe quote, setup and scrap risk, scenario calculation, risk level and a packaged decision report.",
 ctaLabel: "Open CNC Minimum Safe Quote Calculator",
 ctaHref: "/tools/premium/cnc-minimum-safe-quote-analyzer",
 },
 relatedToolIds: ["cnc-minimum-safe-quote-analyzer"],
 seo: {
 title: "Machine Hour Estimator",
 description:
 "Estimate your machine hour cost using monthly machine, labor, energy, maintenance and overhead costs.",
 canonicalPath: "/tools/free/machine-hour-estimator",
 },
 calculatorId: "machine-hour-estimator",
 interpretationNote:
 "Your estimated machine hour cost is based on productive hours, not total available hours. Lower utilization increases the real hourly cost because fixed costs are spread over fewer productive hours.",
 faqPlaceholder:
 "Who it is for: CNC shops, job shops and production managers estimating hourly machine cost. What to do with the result: use it as a baseline rate before quoting; open the CNC Minimum Safe Quote Calculator when a specific job’s setup, scrap and margin matter. Assumptions depend on your monthly cost and productive-hour inputs — results are indicative, not certified accounting.",
};
