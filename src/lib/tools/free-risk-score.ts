import type { FreeRiskLevel } from "@/lib/tools/free-tool-results";

export function freeRiskLevelToScore(level: FreeRiskLevel): number {
 switch (level) {
 case "LOW":
 return 28;
 case "MEDIUM":
 return 58;
 case "HIGH":
 return 84;
 }
}

export function freeRiskLevelLabel(level: FreeRiskLevel): string {
 switch (level) {
 case "LOW":
 return "Low visible risk — still missing expert buffers";
 case "MEDIUM":
 return "Margin pressure likely — verify before quoting";
 case "HIGH":
 return "High loss risk — do not commit without full verdict";
 }
}
