/**
 * Tool entitlement domain (pure, no Firebase).
 *
 * CREDIT_BASED lazy model: an entitlement is created/updated when a user
 * first opens a professional session for a tool. Access is governed by the
 * wallet (credits) plus the active 24h session window. Status and canAccess
 * are ALWAYS derived from server time — clients never compute expiry.
 */

export type EntitlementAccessType =
  | 'LIFETIME'
  | 'SUBSCRIPTION'
  | 'FIXED_TERM'
  | 'USAGE_LIMIT'
  | 'CREDIT_BASED';

export type EntitlementStatus = 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'SUSPENDED';

export interface ToolEntitlement {
  id: string;
  userId: string;
  toolId: string;
  toolSlug: string;
  toolName: string;
  /** Billing purchase id when the entitlement came from a direct tool purchase; session source otherwise. */
  purchaseId: string | null;
  paddleTransactionId: string | null;
  status: EntitlementStatus;
  accessType: EntitlementAccessType;
  startsAt: string;
  expiresAt: string | null;
  usageLimit: number | null;
  usageConsumed: number;
  creditsGranted: number | null;
  creditsConsumed: number;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}

/** Deterministic per-user per-tool entitlement id (never duplicates). */
export function buildEntitlementId(userId: string, toolId: string): string {
  return `${userId}_${toolId}`;
}

/** Whole days remaining until an expiry instant (server time). */
export function entitlementDaysRemaining(expiresAt: string | null, nowMs: number): number | null {
  if (!expiresAt) return null;
  return Math.ceil((Date.parse(expiresAt) - nowMs) / 86_400_000);
}

export interface StatusInput {
  storedStatus: EntitlementStatus;
  accessType: EntitlementAccessType;
  expiresAt: string | null;
  usageLimit: number | null;
  usageConsumed: number;
  nowMs: number;
}

/** Server-computed status; EXPIRING only surfaces for term-based access within 30 days. */
export function computeEntitlementStatus(i: StatusInput): EntitlementStatus {
  if (i.storedStatus === 'SUSPENDED') return 'SUSPENDED';
  if (i.accessType === 'LIFETIME') return 'ACTIVE';
  if (i.accessType === 'CREDIT_BASED') {
    if (i.expiresAt && Date.parse(i.expiresAt) <= i.nowMs) return 'EXPIRED';
    return 'ACTIVE';
  }
  if (i.expiresAt && Date.parse(i.expiresAt) <= i.nowMs) return 'EXPIRED';
  if (i.usageLimit != null && i.usageConsumed >= i.usageLimit) return 'EXPIRED';
  const days = entitlementDaysRemaining(i.expiresAt, i.nowMs);
  if (days != null && days <= 30) return 'EXPIRING';
  return 'ACTIVE';
}

export interface CanAccessInput {
  status: EntitlementStatus;
  accessType: EntitlementAccessType;
  expiresAt: string | null;
  usageLimit: number | null;
  usageConsumed: number;
  creditsAvailable: number | null;
  creditCost: number;
  nowMs: number;
}

export function entitlementCanAccess(i: CanAccessInput): boolean {
  if (i.status === 'SUSPENDED' || i.status === 'EXPIRED') return false;
  if (i.accessType === 'LIFETIME') return true;
  if (i.accessType === 'CREDIT_BASED') {
    const sessionLive = !!i.expiresAt && Date.parse(i.expiresAt) > i.nowMs;
    const creditsEnough = i.creditsAvailable != null && i.creditsAvailable >= i.creditCost;
    return sessionLive || creditsEnough;
  }
  if (i.accessType === 'USAGE_LIMIT') {
    return i.usageLimit == null || i.usageConsumed < i.usageLimit;
  }
  return true;
}

export interface UpsertInput {
  existing: ToolEntitlement | null;
  userId: string;
  toolId: string;
  purchaseId: string;
  expiresAt: string;
  debit: number;
  nowIso: string;
}

/** New session debit → create or extend the credit-based entitlement record. */
export function upsertCreditBasedEntitlement(input: UpsertInput): ToolEntitlement {
  const meta = TOOL_META[input.toolId];
  const id = buildEntitlementId(input.userId, input.toolId);
  return {
    id,
    userId: input.userId,
    toolId: input.toolId,
    toolSlug: meta?.url?.replace(/^\/calculator\//, '') || input.toolId.toLowerCase(),
    toolName: meta?.name || input.toolId,
    purchaseId: input.purchaseId,
    paddleTransactionId: null,
    status: 'ACTIVE',
    accessType: 'CREDIT_BASED',
    startsAt: input.existing?.startsAt || input.nowIso,
    expiresAt: input.expiresAt,
    usageLimit: null,
    usageConsumed: (input.existing?.usageConsumed || 0) + 1,
    creditsGranted: null,
    creditsConsumed: (input.existing?.creditsConsumed || 0) + input.debit,
    createdAt: input.existing?.createdAt || input.nowIso,
    updatedAt: input.nowIso,
    lastUsedAt: input.nowIso
  };
}

/** Reused (no-debit) session → refresh lastUsedAt only. */
export function touchEntitlementUsage(input: {
  existing: ToolEntitlement;
  nowIso: string;
}): ToolEntitlement {
  return {
    ...input.existing,
    status: 'ACTIVE',
    updatedAt: input.nowIso,
    lastUsedAt: input.nowIso
  };
}

/** Tool catalog SSOT (mirrors public/data/tools-catalog.json, server needs no fetch). */
export const TOOL_META: Record<string, { name: string; url: string }> = {
  'SC-001': { name: 'Weld Thickness Calculator', url: '/calculator/weld-thickness' },
  'SC-008': { name: 'Tolerance Stack-Up Calculator', url: '/calculator/tolerance-stack-up' },
  'SC-010': { name: 'True Labor Cost Calculator', url: '/calculator/true-labor-cost' },
  'SC-012': { name: 'Quote Pricing Calculator', url: '/calculator/quote-pricing' },
  'SC-020': {
    name: 'CNC Feeds & Speeds + Tool Life Calculator',
    url: '/calculator/cnc-feeds-speeds'
  },
  'SC-021': { name: 'Bearing Life L10 Calculator (ISO 281)', url: '/calculator/bearing-life-l10' },
  'SC-022': { name: 'Tap & Thread Milling Calculator', url: '/calculator/tap-thread-milling' },
  'SC-023': { name: 'Cycle Time & Cost per Part Calculator', url: '/calculator/cycle-time-cost' },
  'SC-024': {
    name: 'Bearing Frequencies Calculator (BPFO / BPFI)',
    url: '/calculator/bearing-frequencies'
  },
  'SC-025': { name: 'Belt & Chain Drive Sizing Calculator', url: '/calculator/belt-chain-drive' },
  'SC-026': {
    name: 'Shaft Design Calculator (Torsion + Bending)',
    url: '/calculator/shaft-design'
  },
  'SC-027': { name: 'Fits & Clearances Calculator (ISO 286)', url: '/calculator/iso-286-fits' },
  'SC-028': { name: 'Surface Finish Converter (Ra / Rz)', url: '/calculator/surface-finish' },
  'SC-029': { name: 'Heat Input & Cooling Rate Calculator', url: '/calculator/weld-heat-input' },
  'SC-030': { name: 'Sheet Metal Bend & K-Factor Calculator', url: '/calculator/sheet-metal-bend' },
  'SC-031': { name: 'Sling Capacity & Angle Calculator', url: '/calculator/sling-capacity' },
  'SC-032': { name: 'Shackle & Eye Bolt Check Calculator', url: '/calculator/shackle-eyebolt' },
  'SC-033': {
    name: 'Pressure Vessel Shell Calculator (ASME VIII)',
    url: '/calculator/pressure-vessel-shell'
  },
  'SC-034': {
    name: 'Pipe Wall Thickness Calculator (ASME B31)',
    url: '/calculator/pipe-wall-thickness'
  },
  'SC-035': {
    name: 'Bolt Torque & Preload Calculator (VDI 2230)',
    url: '/calculator/bolt-torque-preload'
  },
  'SC-036': { name: 'Bolted Joint Verification (VDI 2230)', url: '/calculator/bolted-joint' },
  'SC-037': { name: 'OEE Calculator', url: '/calculator/oee-teep' },
  'SC-038': { name: 'Machine Hour Rate Calculator', url: '/calculator/machine-hour-rate' },
  'SC-039': {
    name: 'Punching Force & Die Clearance Calculator',
    url: '/calculator/punching-force'
  },
  'SC-040': { name: 'Hydraulic Cylinder Sizing Calculator', url: '/calculator/hydraulic-cylinder' }
};
