/**
 * @deprecated Import from `../billing/credit-packages.js` — kept as compatibility shim.
 */
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
} from '../billing/credit-packages.js';

/** @deprecated Purchased credits never expire. */
export const CREDIT_VALIDITY = 'never expire';

/** @deprecated Replaced by trial promotional grant. */
export const FREE_MONTHLY_CREDITS = '0';
