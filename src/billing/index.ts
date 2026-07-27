/**
 * SectorCalc billing / credit monetization public API.
 */
export type {
  PricingTier,
  CreditTransactionType,
  CalculationSessionStatus,
  CreditPackageId,
  CreditWalletBalances,
  CreditLedgerEntry,
  CalculationSessionRecord,
  PaymentEventRecord
} from './types.js';

export { CREDIT_COST, creditCostForTier } from './pricing-tiers.js';
export {
  getToolPricingTier,
  resolveToolCreditCost,
  isToolClassified,
  CORE_TOOLS,
  PRO_TOOLS,
  ADVANCED_TOOLS,
  DECISION_TOOLS
} from './tool-pricing.js';
export {
  PACKAGES,
  PADDLE_SANDBOX_PRICE_IDS,
  PURCHASED_CREDITS_EXPIRE,
  TRIAL_PROMOTIONAL_CREDITS,
  TRIAL_EXPIRY_DAYS,
  getPackageByPriceId,
  getPackageById,
  getPackageByCredits,
  type CreditPackage
} from './credit-packages.js';
export { getMonetizationFlags, isToolMonetizationActive } from './flags.js';
export {
  emptyWallet,
  availableCredits,
  toBalances,
  expirePromotionalIfNeeded,
  applyPurchase,
  applyPromotionalGrant,
  applySessionDebit,
  applyRefund,
  applyAdminAdjustment,
  sessionDebitId,
  purchaseIdempotencyKey,
  trialGrantId,
  isPromoValid,
  type WalletState
} from './ledger.js';
export {
  SESSION_TTL_MS,
  MAX_REPORT_REVISIONS,
  createActiveSession,
  isSessionActive,
  findReusableSession,
  registerReportRevision,
  professionalSessionDebitKey,
  buildSessionId
} from './session.js';
export { trackBillingEvent, type BillingAnalyticsEvent, type BillingAnalyticsProps } from './analytics.js';
export {
  requestProfessionalAccess,
  professionalCtaCopy,
  type ProfessionalAccessResult,
  type ProfessionalAccessDeps
} from './professional-access.js';
