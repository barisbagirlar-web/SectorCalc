/**
 * Bridge guest localStorage credits into the signed-in Firestore profile (max).
 */
import { readCredits, writeCredits } from '../payments/paddle/credits.js';
import { readUserProfile, setUserCredits } from './profile.js';

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
    updatedAt: new Date().toISOString(),
    lastTxnId: readCredits().lastTxnId
  });
  try {
    if (merged !== cloud) await setUserCredits(uid, merged);
  } catch {
    /* Firestore rules may block until deployed — local balance still updated */
  }
  return merged;
}

export async function pushLocalCreditsToCloud(uid: string): Promise<void> {
  const { balance } = readCredits();
  await setUserCredits(uid, balance);
}
