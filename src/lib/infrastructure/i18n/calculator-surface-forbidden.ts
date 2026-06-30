/** TR calculator surface — forbidden visible English UI tokens (P25 quality gate). */

export const TR_FORBIDDEN_SURFACE_WORDS = [
  "Length",
  "Width",
  "Height",
  "Depth",
  "Yardage",
  "Area",
  "Volume",
  "Weight",
  "Price",
  "Cost",
  "Rate",
  "Margin",
  "Revenue",
  "Profit",
  "Discount",
  "Tax",
  "Loan",
  "Payment",
  "Amount",
  "Quantity",
  "Unit",
  "Result",
  "Calculate",
  "Calculator",
  "Input",
  "Output",
  "Select",
  "Choose",
  "Search",
  "Reset",
  "Submit",
  "Required",
  "Optional",
  "Invalid",
  "Error",
  "Warning",
  "Total",
  "Subtotal",
  "Annual",
  "Monthly",
  "Daily",
  "Hourly",
  "Distance",
  "Speed",
  "Time",
  "Fuel",
  "Energy",
  "Power",
  "Temperature",
  "Pressure",
  "Diameter",
  "Radius",
  "Thickness",
  "Density",
] as const;

const TR_FORBIDDEN_RE = new RegExp(
  `\\b(${TR_FORBIDDEN_SURFACE_WORDS.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  ).join("|")})\\b`,
  "i",
);

export function containsForbiddenTrSurfaceEnglish(text: string): boolean {
  if (!text) {
    return false;
  }
  return TR_FORBIDDEN_RE.test(text);
}

export function findForbiddenTrSurfaceEnglish(text: string): string[] {
  if (!text) {
    return [];
  }
  const matches = text.match(TR_FORBIDDEN_RE);
  return matches ? [...new Set(matches.map((m) => m))] : [];
}
