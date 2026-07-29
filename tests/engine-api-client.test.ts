import { describe, it, expect, vi, beforeEach } from 'vitest';

const getIdToken = vi.fn(async () => 'token');
vi.mock('../src/auth/firebase-app.js', () => ({
  getFirebaseAuth: () => ({
    authStateReady: async () => undefined,
    currentUser: { getIdToken }
  })
}));

describe('engine API client', () => {
  beforeEach(() => {
    getIdToken.mockClear();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ result: { ok: true }, engineVersion: '1.0.0', requestId: 'r1' })
      }))
    );
  });

  it('posts authenticated calculate requests', async () => {
    const { calculateTool } = await import('../src/engine-api/client.js');
    const res = await calculateTool('SC-001', {
      designLoadN: 1,
      weldLengthMm: 1,
      weldStrengthMpa: 1,
      safetyFactor: 1,
      materialThicknessMm: 1
    });
    expect(res.requestId).toBe('r1');
    expect(getIdToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalled();
    const call = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(call[0])).toContain('/tools/SC-001/calculate');
    expect(call[1].headers.Authorization).toBe('Bearer token');
  });
});
