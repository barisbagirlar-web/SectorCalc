/**
 * Firestore security rules tests for tool_entitlements (and neighbors).
 * Runs ONLY against the Firestore emulator (see `npm run test:rules`);
 * skipped in plain `npm test` where no emulator is available.
 *
 * Verified matrix (hardening mandate §7):
 *   owner read        = allow
 *   other user read   = deny
 *   anonymous read    = deny
 *   client write      = deny (create/update/delete)
 *   ops admin read    = allow
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment
} from '@firebase/rules-unit-testing';

const OWNER = 'owner-uid';
const OTHER = 'other-uid';
const OPS_EMAIL = 'barisbagirlar@gmail.com';
const ENTL_ID = `${OWNER}_SC-029`;

const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

describe.skipIf(!hasEmulator)('firestore rules — tool_entitlements', () => {
  let env: RulesTestEnvironment;

  beforeAll(async () => {
    const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
    env = await initializeTestEnvironment({
      projectId: 'demo-sectorcalc',
      firestore: { host: 'localhost', port: 8080, rules }
    });
    await env.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('tool_entitlements').doc(ENTL_ID).set({
        userId: OWNER,
        toolId: 'SC-029',
        accessType: 'CREDIT_BASED',
        status: 'ACTIVE'
      });
    });
  });

  afterAll(async () => {
    await env?.cleanup();
  });

  it('owner can read their own entitlement', async () => {
    const db = env.authenticatedContext(OWNER).firestore();
    await assertSucceeds(db.collection('tool_entitlements').doc(ENTL_ID).get());
  });

  it('owner cannot write (create/update/delete)', async () => {
    const db = env.authenticatedContext(OWNER).firestore();
    await assertFails(db.collection('tool_entitlements').doc(ENTL_ID).set({ userId: OWNER }));
    await assertFails(
      db.collection('tool_entitlements').doc(ENTL_ID).update({ status: 'EXPIRED' })
    );
    await assertFails(db.collection('tool_entitlements').doc(ENTL_ID).delete());
    await assertFails(
      db.collection('tool_entitlements').doc(`${OTHER}_SC-010`).set({ userId: OTHER })
    );
  });

  it('another user cannot read another user’s entitlement', async () => {
    const db = env.authenticatedContext(OTHER).firestore();
    await assertFails(db.collection('tool_entitlements').doc(ENTL_ID).get());
  });

  it('anonymous read is denied', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(db.collection('tool_entitlements').doc(ENTL_ID).get());
  });

  it('ops admin can read any entitlement', async () => {
    const db = env.authenticatedContext('ops-uid', { email: OPS_EMAIL }).firestore();
    await assertSucceeds(db.collection('tool_entitlements').doc(ENTL_ID).get());
  });

  it('non-admin with arbitrary email cannot read', async () => {
    const db = env.authenticatedContext('other-uid', { email: 'nobody@example.com' }).firestore();
    await assertFails(db.collection('tool_entitlements').doc(ENTL_ID).get());
  });

  it('client write to wallets remains denied', async () => {
    const db = env.authenticatedContext(OWNER).firestore();
    await assertFails(db.collection('wallets').doc(OWNER).set({ purchasedCredits: 999 }));
  });
});
