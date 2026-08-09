import { describe, expect, it } from 'vitest';
import { applicableRules, isRobotsAllowed, parseRobots } from '../seo/robots-policy.mjs';

describe('robots policy evaluator', () => {
  it('uses the most specific user-agent group instead of merging wildcard rules', () => {
    const robots = `
User-agent: *
Disallow: /admin/

User-agent: Googlebot
Allow: /
`;
    expect(isRobotsAllowed(robots, 'Googlebot', '/admin/')).toBe(true);
  });

  it('inherits wildcard private-path blocks when no specific allow group exists', () => {
    const robots = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
`;
    expect(isRobotsAllowed(robots, 'Googlebot', '/')).toBe(true);
    expect(isRobotsAllowed(robots, 'Googlebot', '/admin/users')).toBe(false);
    expect(isRobotsAllowed(robots, 'Bingbot', '/api/billing')).toBe(false);
  });

  it('prefers the longest matching path and Allow on equal length', () => {
    const robots = `
User-agent: *
Disallow: /private/
Allow: /private/public/
`;
    expect(isRobotsAllowed(robots, 'ExampleBot', '/private/file')).toBe(false);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/private/public/file')).toBe(true);
  });

  it('merges groups with the same matching specificity', () => {
    const robots = `
User-agent: ExampleBot
Disallow: /a/

User-agent: ExampleBot
Disallow: /b/
`;
    const rules = applicableRules(robots, 'ExampleBot');
    expect(rules).toHaveLength(2);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/a/x')).toBe(false);
    expect(isRobotsAllowed(robots, 'ExampleBot', '/b/x')).toBe(false);
  });

  it('parses adjacent user-agent lines as one group', () => {
    const groups = parseRobots(`
User-agent: BotA
User-agent: BotB
Disallow: /private/
`);
    expect(groups).toHaveLength(1);
    expect(groups[0].agents).toEqual(['bota', 'botb']);
  });
});
