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
  writeOpsAudit,
  adminSetUserCredits,
  adminAdjustUserCredits,
  profilesToCsv,
  downloadTextFile,
  type OpsAuditEvent
} from './ops-admin.js';