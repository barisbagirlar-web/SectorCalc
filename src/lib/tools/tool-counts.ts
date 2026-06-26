import { FREE_TRAFFIC_TOOLS } from "./free-traffic-catalog";
import mergedTools from "../../../data/pro-tools/_merged.json";

export function getFreeToolCount(): number {
  return FREE_TRAFFIC_TOOLS.length;
}

export function getPremiumToolCount(): number {
  return mergedTools.length;
}

export function getTotalToolCount(): number {
  return getFreeToolCount() + getPremiumToolCount();
}

export function resetToolCountCache(): void {}

