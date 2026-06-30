import { PUBLIC_COPY_SURFACE_IDS, type PublicCopySurface } from "@/lib/locale-center/locale-types";

export const PUBLIC_COPY_SURFACES = PUBLIC_COPY_SURFACE_IDS;

/** Namespace roots in messages/*.json per public surface. */
export const PUBLIC_SURFACE_MESSAGE_ROOTS: Record<PublicCopySurface, readonly string[]> = {
  header: ["nav"],
  footer: ["sectorFooter"],
  homepage: ["home", "homepage", "catalogExplorer"],
  "free-tools": ["freeTrafficCatalog", "catalogExplorer.freeTools", "calculatorCards"],
  "premium-tools": ["catalogExplorer.premiumTools", "premiumTools", "calculatorCards"],
  industries: ["industries", "catalogExplorer.industries", "industryPage"],
  "industry-detail": ["industryPage", "industries"],
  "tool-detail": ["freeTool", "freeToolContent", "premiumAccess", "calculator"],
  "calculator-form": ["freeToolInputs", "calculator", "smartForm"],
  "calculator-result": ["freeToolResult", "premiumReport"],
  "guided-graphics": ["guidance"],
  "calculator-library": ["calculatorLibrary"],
  pricing: ["pricing", "premiumAccess"],
  auth: ["auth", "login"],
  legal: ["legal", "sectorFooter"],
};

export const PUBLIC_COMPONENT_GLOBS = [
  "src/components/layout/**/*.tsx",
  "src/components/catalog/**/*.tsx",
  "src/components/industries/**/*.tsx",
  "src/components/home/**/*.tsx",
  "src/components/tools/**/*.tsx",
  "src/components/guidance/**/*.tsx",
  "src/components/pages/**/*.tsx",
] as const;

export function isPublicCopySurface(value: string): value is PublicCopySurface {
  return (PUBLIC_COPY_SURFACES as readonly string[]).includes(value);
}
