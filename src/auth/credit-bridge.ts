/**
 * Bridge guest localStorage credit CACHE into signed-in display.
 * Authoritative grants are Cloud Functions ledger/webhook only.
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
  const merged = Math.max(guest, cloud);
  writeCredits({
    balance: merged,
    purchasedCredits: merged,
    promotionalCredits: readCredits().promotionalCredits ?? 0,
    updatedAt: new Date().toISOString(),
    lastTxnId: readCredits().lastTxnId
  });
  return merged;
}

/** Client must not mutate authoritative credits. */
export async function pushLocalCreditsToCloud(_uid: string): Promise<void> {
  return;
}
