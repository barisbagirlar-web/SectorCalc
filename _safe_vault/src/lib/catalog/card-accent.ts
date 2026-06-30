import type { CalculatorCardAccent } from "@/components/catalog/CalculatorCard";

export function resolveCalculatorCardAccent(
  groupId: string,
  tier: "free" | "premium",
): CalculatorCardAccent {
  if (tier === "premium") {
    return "orange";
  }
  const sum = groupId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (sum % 3 === 0) {
    return "green";
  }
  if (sum % 3 === 1) {
    return "blue";
  }
  return "green";
}
