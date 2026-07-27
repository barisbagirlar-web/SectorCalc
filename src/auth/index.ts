/**
 * Auth public barrel.
 */
export {
  getFirebasePublicConfig,
  isFirebaseConfigured,
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseDb
} from './firebase-app.js';

export {
  authReady,
  watchAuth,
  signUpEmail,
  signInEmail,
  signInGoogle,
  signOutUser,
  currentUser,
  friendlyAuthError
} from './session.js';

export { ensureUserProfile, readUserProfile, setUserCredits, type UserProfile } from './profile.js';

export { mergeGuestCreditsOnLogin, pushLocalCreditsToCloud } from './credit-bridge.js';

export {
  recordLocalPurchase,
  recordCloudPurchase,
  listCloudPurchases,
  mergePurchases,
  readLocalPurchases,
  readPrefs,
  writePrefs,
  syncPrefsToCloud,
  touchSession,
  listSessions,
  revokeSession,
  DEFAULT_PREFS,
  type PurchaseRecord,
  type DeviceSession,
  type AccountPrefs
} from './account-data.js';

export {
  readLocalLedger,
  listCloudLedger,
  mergeMovements,
  withRunningBalance,
  ledgerTotals,
  purchasesAsMovements,
  recordPurchaseMovement,
  recordSpendMovement,
  persistMovement,
  type CreditMovement,
  type CreditMovementKind
} from './credit-ledger.js';

export {
  getOpsAdminEmails,
  isOpsGateConfigured,
  isOpsUnlocked,
  lockOpsGate,
  unlockOpsGate,
  isOpsAdminEmail,
  canEnterOps,
  sha256Hex
} from './admin-gate.js';

export {
  listUserProfiles,
  listOpsAudit,
  listAllPurchases,
  enrichOpsPurchases,
  packBuyerSummary,
  estimateGmvUsd,
  writeOpsAudit,
  adminSetUserCredits,
  adminAdjustUserCredits,
  profilesToCsv,
  downloadTextFile,
  type OpsAuditEvent,
  type OpsPurchaseRow
} from './ops-admin.js';