import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applicableRules, isRobotsAllowed, parseRobots } from '../seo/robots-policy.mjs';

describe('robots policy evaluator', () => {
  it('uses the most specific user-agent group instead of merging wildcard rules', () => {
    const robots = `\nUser-agent: *\nDisallow: /admin/\n\nUser-agent: Googlebot\nAllow: /\n`;
    expect(isRobotsAllowed(robots, 'Googlebot', '/admin/')).toBe(true);
  });

  it('inherits wildcard private-path blocks when no specific group exists', () => {
    const robots = `\nUser-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n`;
    expect(isRobotsAllowed(robots, 'ExampleBot', '/')).toBe(true);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/admin/users')).toBe(false);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/api/billing')).toBe(false);
  });

  it('prefers the longest matching path and Allow on equal length', () => {
    const robots = `\nUser-agent: *\nDisallow: /private/\nAllow: /private/public/\n`;
    expect(isRobotsAllowed(robots, 'ExampleBot', '/private/file')).toBe(false);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/private/public/file')).toBe(true);
  });

  it('merges groups with the same matching specificity', () => {
    const robots = `\nUser-agent: ExampleBot\nDisallow: /a/\n\nUser-agent: ExampleBot\nDisallow: /b/\n`;
    const rules = applicableRules(robots, 'ExampleBot');
    expect(rules).toHaveLength(2);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/a/x')).toBe(false);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/b/x')).toBe(false);
  });

  it('parses adjacent user-agent lines as one group', () => {
    const groups = parseRobots(`\nUser-agent: BotA\nUser-agent: BotB\nDisallow: /private/\n`);
    expect(groups).toHaveLength(1);
    expect(groups[0].agents).toEqual(['bota', 'botb']);
  });
});

describe('SectorCalc production robots contract', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');
  const allowedBots = [
    'Googlebot',
    'Googlebot-Image',
    'Bingbot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'PerplexityBot',
    'Google-Extended',
    'Anthropic-ai',
    'Claude-Web',
    'cohere-ai',
    'ia_archiver',
    'AhrefsBot',
    'SemrushBot',
  ];
  const privatePaths = [
    '/cgi-bin/',
    '/tmp/',
    '/draft/',
    '/staging/',
    '/admin/',
    '/api/',
    '/internal/',
    '/assets/cache/',
  ];

  it.each(allowedBots)('%s can crawl public calculators but not private surfaces', (bot) => {
    expect(isRobotsAllowed(robots, bot, '/calculator/bearing-life-l10')).toBe(true);
    for (const path of privatePaths) {
      expect(isRobotsAllowed(robots, bot, path)).toBe(false);
    }
  });

  it.each(['GPTBot', 'ClaudeBot', 'CCBot', 'FacebookBot'])('%s remains blocked by training policy', (bot) => {
    expect(isRobotsAllowed(robots, bot, '/')).toBe(false);
    expect(isRobotsAllowed(robots, bot, '/calculator/bearing-life-l10')).toBe(false);
  });
});
