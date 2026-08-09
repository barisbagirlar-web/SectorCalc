import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { inspectFirstHtml } from '../../scripts/seo/render-contract-v3.ts';

describe('SEO V3 phase 4 render contract', () => {
  it('keeps critical calculator SEO and explanatory content in first HTML', () => {
    const html = fs.readFileSync('machine-rate-pro.html', 'utf8');
    expect(inspectFirstHtml(html, '/calculator/machine-hour-rate')).toEqual([]);
  });

  it('does not require client JavaScript to expose the primary H1/title/canonical', () => {
    const html = fs.readFileSync('machine-rate-pro.html', 'utf8');
    expect(html).toMatch(/<title>[^<]+<\/title>/i);
    expect(html).toMatch(/<h1\b[^>]*>[\s\S]*?<\/h1>/i);
    expect(html).toMatch(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i);
  });
});
