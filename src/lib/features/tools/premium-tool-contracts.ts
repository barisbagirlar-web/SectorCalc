/**
 * SectorCalc Premium Tool Contract v1 — all premium analyzer contracts.
 */

import type {
 PremiumInputKind,
 PremiumInputSpec,
 PremiumToolContract,
} from "@/lib/features/tools/premium-tool-contract";
import { getRevenueToolByPaidSlug } from "@/lib/features/tools/revenue-tools";

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

function mapKind(type: string): PremiumInputKind {
 if (type === "currency" || type === "percent" || type === "select" || type === "number") {
 return type;
 }
 return "number";
}

function _fromRevenuePaidInputs(slug: string): readonly PremiumInputSpec[] {
 const tool = getRevenueToolByPaidSlug(slug);
 if (!tool) return [];
 return tool.paidInputs.map((input) => ({
 key: input.key,
 label: input.label,
 kind: mapKind(input.type),
 unit: input.unit,
 required: input.required,
 defaultValue: input.defaultValue,
 helperText: input.helperText,
 options: input.options,
 }));
}

// ---------------------------------------------------------------------------
// Contracts
// ---------------------------------------------------------------------------

export const PREMIUM_TOOL_CONTRACTS: readonly PremiumToolContract[] = [];

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

const CONTRACT_BY_SLUG = new Map(
 PREMIUM_TOOL_CONTRACTS.map((entry) => [entry.slug, entry])
);

export function getPremiumToolContract(slug: string): PremiumToolContract | null {
 return CONTRACT_BY_SLUG.get(slug) ?? null;
}
