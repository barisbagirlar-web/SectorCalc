import type { RevenueTool } from "@/lib/features/tools/revenue-tools";
import type {
 FreeToolInputValues,
 FreeToolResult,
} from "@/lib/features/tools/free-tool-results";
import type {
 PremiumToolInputValues,
 PremiumToolResult,
} from "@/lib/features/tools/premium-tool-results";

export function isPhase2Sector(_sector: string): boolean {
  return false;
}

export function calculatePhase2FreeResult(
  _tool: RevenueTool,
  _values: FreeToolInputValues
): FreeToolResult | null {
  return null;
}

export function calculatePhase2PremiumResult(
  _tool: RevenueTool,
  _values: PremiumToolInputValues
): PremiumToolResult | null {
  return null;
}
