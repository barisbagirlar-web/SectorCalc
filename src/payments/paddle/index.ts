/**
 * Paddle MoR barrel — client never grants credits.
 */
export {
  INVALID_PADDLE_PRICE_IDS,
  getPaddlePublicConfig,
  type PaddleEnvironment,
  type PaddlePublicConfig
} from './config.js';

export {
  isCheckoutConfigured,
  ensurePaddleReady,
  preloadPaddle,
  openPreparedCheckout,
  openCreditCheckout
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
