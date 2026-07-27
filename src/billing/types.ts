/**
 * SectorCalc credit monetization — shared types (SSOT consumers).
 * Engineering calculation payloads never belong here.
 */
export type PricingTier = 'FREE' | 'CORE' | 'PRO' | 'ADVANCED' | 'DECISION';

export type CreditTransactionType =
  | 'PURCHASE'
  | 'PROMOTIONAL_GRANT'
  | 'SESSION_DEBIT'
  | 'REFUND'
  | 'ADMIN_ADJUSTMENT'
  | 'EXPIRATION';

export type CalculationSessionStatus = 'ACTIVE' | 'EXPIRED' | 'REFUNDED';

export type CreditPackageId = 'STARTER' | 'WORKSHOP' | 'PROFESSIONAL' | 'TEAM_WALLET';

export interface CreditWalletBalances {
  purchasedCredits: number;
  promotionalCredits: number;
  /** ISO timestamp; null when no promo balance / no expiry window. */
  promotionalExpiresAt: string | null;
  /** Denormalized available total (purchased + non-expired promo). */
  availableCredits: number;
  updatedAt: string;
}

export interface CreditLedgerEntry {
  /** Deterministic idempotency key (also Firestore doc id when persisted). */
  id: string;
  type: CreditTransactionType;
  /** Signed integer: +grant / -debit. */
  delta: number;
  purchasedDelta: number;
  promotionalDelta: number;
  toolId?: string;
  packageId?: CreditPackageId;
  pricingTier?: PricingTier;
  providerEventId?: string;
  calculationSessionId?: string;
  note?: string;
  createdAt: string;
}

export interface CalculationSessionRecord {
  calculationSessionId: string;
  accountId: string;
  toolId: string;
  pricingTier: PricingTier;
  creditCost: number;
  createdAt: string;
  expiresAt: string;
  reportRevisionCount: number;
  maxReportRevisions: number;
  status: CalculationSessionStatus;
  debitTransactionId: string | null;
}

export interface PaymentEventRecord {
  providerEventId: string;
  provider: 'paddle';
  type: string;
  accountId?: string;
  packageId?: CreditPackageId;
  creditsGranted?: number;
  rawSummary?: string;
  processedAt: string;
}
