/**
 * Bridge guest localStorage into UI cache only.
 * NEVER promote browser-local balances into Firestore — fraud vector (mandate §41).
 */
import { readCredits, writeCredits } from '../payments/paddle/credits.js';
import { readUserProfile } from './profile.js';

export async function mergeGuestCreditsOnLogin(uid: string): Promise<number> {
  const guest = readCredits().balance;
  let cloud = 0;
  try {
    const profile = await readUserProfile(uid);
    cloud = profile?.credits ?? 0;
  } catch {
    cloud = 0;
  }
  // Display cache may show max for UX continuity, but cloud is never raised from guest.
  const display = Math.max(guest, cloud);
  writeCredits({
    balance: display,
    updatedAt: new Date().toISOString(),
    lastTxnId: readCredits().lastTxnId
  });
  return cloud;
}

/** @deprecated Server wallet is authoritative — do not push local balances. */
export async function pushLocalCreditsToCloud(_uid: string): Promise<void> {
  throw new Error('pushLocalCreditsToCloud disabled — server wallet is authoritative');
}
