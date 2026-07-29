import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeAttr } from '../src/lib/html-escape.js';
import { parseInputNumber, parseLocaleNumber } from '../src/lib/parse-number.js';
import { parseIntegrityShare, makeIntegrityShareURL } from '../src/lib/share-integrity.js';
import { makeShareURL } from '../src/lib/sc008-p4.js';
import type { ProjectState } from '../src/lib/sc008-p4.js';
import { EngineApiError } from '../src/engine-api/client.js';

describe('ADV-F1/F2 html escape', () => {
  it('neutralizes attribute breakout XSS payload', () => {
    const payload = 'Spacer"><img src=x onerror="window.__xssFired=1">';
    const attr = escapeAttr(payload);
    expect(attr).toContain('&quot;');
    expect(`<input value="${attr}">`).not.toContain('<img');
    expect(`<div>${escapeHtml(payload)}</div>`).not.toContain('<img');
  });
  it('escapes HTML text nodes', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });
});

describe('ADV-E2 locale number parse', () => {
  it('rejects decimal comma', () => {
    expect(parseInputNumber('10,5')).toBeNaN();
    expect(() => parseLocaleNumber('10,5', 'x')).toThrow(/comma/);
  });
  it('accepts point decimals', () => {
    expect(parseInputNumber('10.5')).toBe(10.5);
    expect(parseLocaleNumber('10.5')).toBe(10.5);
  });
});

describe('ADV-F6 share integrity', () => {
  it('missing hash is tampered', () => {
    const state = { a: 1 };
    const r = parseIntegrityShare('s=' + encodeURIComponent(JSON.stringify(state)));
    expect(r.ok).toBe(true);
    expect(r.tampered).toBe(true);
    expect(r.missingHash).toBe(true);
  });
  it('round-trips with hash', () => {
    const url = makeIntegrityShareURL('https://sectorcalc.com', '/calculator/quote-pricing', {
      q: 1
    });
    const q = url.split('?')[1]!;
    const r = parseIntegrityShare(q);
    expect(r.tampered).toBe(false);
    expect(r.state).toEqual({ q: 1 });
  });
});

describe('ADV-F7 canonical share URL', () => {
  it('SC-008 share uses pretty calculator path', () => {
    const st: ProjectState = {
      specUpper: '0.1',
      specLower: '-0.1',
      cpkTarget: '1.33',
      seed: '1',
      unit: 'mm',
      dims: [{ name: 'A', nominal: 1, tol: 0.01, dist: 'normal' }]
    };
    const url = makeShareURL('https://sectorcalc.com', st);
    expect(url).toContain('/calculator/tolerance-stack-up?');
    expect(url).not.toContain('sc008-pro.html');
    expect(url).toContain('&h=');
  });
});

describe('private engine client contract', () => {
  it('EngineApiError carries status/code', () => {
    const err = new EngineApiError(403, 'PROFESSIONAL_SESSION_REQUIRED', 'Session required');
    expect(err.status).toBe(403);
    expect(err.code).toBe('PROFESSIONAL_SESSION_REQUIRED');
  });
});
