/**
 * Paddle sandbox barrel — MoR only (see DECISIONS.md #3).
 */
export {
  PADDLE_SANDBOX_PRICE_IDS,
  getPaddlePublicConfig,
  resolveSandboxPriceId,
  type PaddleEnvironment,
  type PaddlePublicConfig
} from './config.js';

export {
  isCheckoutConfigured,
  ensurePaddleReady,
  preloadPaddle,
  openCreditCheckout,
  type PaddleCheckoutItem
} from './checkout.js';

export {
  readCredits,
  writeCredits,
  grantCredits,
  spendCredits,
  type CreditLedger
} from './credits.js';

export {
  fulfillCheckoutCompleted,
  type PaddleCheckoutEvent,
  type FulfillResult
} from './fulfill.js';
