import type { IndustryToolSchema } from "@/lib/os/types";

/** CNC machine-time efficiency — reference schema for Manufacturing OS pilot. */
export const CNC_MACHINE_TIME_EFFICIENCY_SCHEMA: IndustryToolSchema = {
 id: "cnc-machine-time-efficiency",
 industry: "cnc",
 toolType: "efficiency",
 inputs: [
 {
 id: "setupTime",
 label: "Setup time",
 unit: "hour",
 role: "actual",
 riskDriverKey: "setupTime",
 defaultValue: 0.75,
 },
 {
 id: "cycleTime",
 label: "Cycle time per unit",
 unit: "hour",
 role: "actual",
 riskDriverKey: "cycleTime",
 defaultValue: 0.13,
 },
 {
 id: "quantity",
 label: "Order quantity",
 unit: "unit",
 role: "actual",
 riskDriverKey: "quantity",
 defaultValue: 1,
 min: 1,
 },
 {
 id: "targetUtilization",
 label: "Target machine utilization",
 unit: "percent",
 role: "target",
 defaultValue: 85,
 },
 {
 id: "hourlyRate",
 label: "Machine hourly rate",
 unit: "currency",
 role: "constant",
 riskDriverKey: "machineRate",
 defaultValue: 75,
 },
 ],
 formulas: {
 variance: "(actualHours - targetHours) / targetHours",
 lossMetric: "variance * hourlyRate * quantity",
 },
 interpretationRules: {
 thresholds: [
 {
 condition: "variance > 0.15",
 verdict: "CRITICAL_INEFFICIENCY",
 advice: "Setup burden dominates — re-batch quantity or reduce changeovers before quoting.",
 },
 {
 condition: "variance > 0.05",
 verdict: "MARGIN_LEAK_WARNING",
 advice: "Review tooling wear and cycle-time assumptions; P90 buffer likely understated.",
 },
 {
 condition: "variance <= 0.05",
 verdict: "WITHIN_OPERATIONAL_LIMIT",
 advice: "Exposure within operational limit — run full P90 verdict before accepting bid.",
 },
 ],
 },
};
