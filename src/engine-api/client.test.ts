import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../auth/firebase-app.js', () => ({
  getFirebaseAuth: () => ({
    authStateReady: vi.fn().mockResolvedValue(undefined),
    currentUser: { getIdToken: vi.fn().mockResolvedValue('firebase-id-token') }
  })
}));

import { EngineApiError, LatestCalculation, calculateTool } from './client.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('engine API client contract', () => {
  it('posts the typed input with a Firebase bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          result: { finalLegMm: '5.00' },
          engineVersion: 'engine-1',
          requestId: 'request-1'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    await calculateTool('SC-001', {
      designLoadN: 1,
      weldLengthMm: 1,
      weldStrengthMpa: 1,
      safetyFactor: 1,
      materialThicknessMm: 1
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/tools/SC-001/calculate');
    expect(init.headers).toMatchObject({ Authorization: 'Bearer firebase-id-token' });
    expect(JSON.parse(String(init.body))).toEqual({
      input: {
        designLoadN: 1,
        weldLengthMm: 1,
        weldStrengthMpa: 1,
        safetyFactor: 1,
        materialThicknessMm: 1
      }
    });
  });

  it('rejects malformed success envelopes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ result: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    await expect(
      calculateTool('SC-010', { country: 'US', netSalary: 1, payFrequency: 'monthly' })
    ).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
      status: 502
    } satisfies Partial<EngineApiError>);
  });

  it('aborts an older request and ignores its response', async () => {
    const resolvers: Array<(value: Response) => void> = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolvers.push(resolve);
          })
      )
    );
    const latest = new LatestCalculation();
    const first = latest.run('SC-010', { country: 'US', netSalary: 1, payFrequency: 'monthly' });
    const second = latest.run('SC-010', { country: 'US', netSalary: 2, payFrequency: 'monthly' });
    await vi.waitFor(() => expect(resolvers).toHaveLength(2));
    resolvers[1]!(
      new Response(JSON.stringify({ result: {}, engineVersion: 'v', requestId: 'second' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    resolvers[0]!(
      new Response(JSON.stringify({ result: {}, engineVersion: 'v', requestId: 'first' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );
    await expect(second).resolves.toMatchObject({ requestId: 'second' });
    await expect(first).resolves.toBeNull();
  });
});
