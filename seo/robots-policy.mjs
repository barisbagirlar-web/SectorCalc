/**
 * Deterministic robots.txt parser/evaluator for SectorCalc release gates.
 *
 * Scope: user-agent group selection plus Allow/Disallow longest-match rules.
 * It intentionally ignores unsupported/non-indexing directives such as Crawl-delay.
 */

function stripComment(line) {
  const index = line.indexOf('#');
  return (index >= 0 ? line.slice(0, index) : line).trim();
}

export function parseRobots(text) {
  const groups = [];
  let current = null;
  let acceptingAgents = false;

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = stripComment(rawLine);
    if (!line) {
      acceptingAgents = false;
      continue;
    }

    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === 'user-agent') {
      if (!current || !acceptingAgents) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      acceptingAgents = true;
      continue;
    }

    acceptingAgents = false;
    if (!current) continue;
    if (key === 'allow' || key === 'disallow') {
      current.rules.push({ type: key, path: value });
    }
  }

  return groups.filter((group) => group.agents.length > 0);
}

function matchingSpecificity(agentToken, userAgent) {
  if (agentToken === '*') return 0;
  return userAgent.includes(agentToken) ? agentToken.length : -1;
}

export function applicableRules(text, userAgent) {
  const normalizedAgent = String(userAgent || '').trim().toLowerCase();
  const groups = parseRobots(text);
  let bestSpecificity = -1;
  const matches = [];

  for (const group of groups) {
    const specificity = Math.max(...group.agents.map((agent) => matchingSpecificity(agent, normalizedAgent)));
    if (specificity < 0) continue;
    if (specificity > bestSpecificity) {
      bestSpecificity = specificity;
      matches.length = 0;
      matches.push(group);
    } else if (specificity === bestSpecificity) {
      matches.push(group);
    }
  }

  return matches.flatMap((group) => group.rules);
}

function pathMatches(rulePath, requestPath) {
  if (rulePath === '') return false;
  const normalizedPath = requestPath.startsWith('/') ? requestPath : `/${requestPath}`;
  return normalizedPath.startsWith(rulePath);
}

export function isRobotsAllowed(text, userAgent, requestPath) {
  const rules = applicableRules(text, userAgent)
    .filter((rule) => pathMatches(rule.path, requestPath))
    .sort((a, b) => {
      const lengthDiff = b.path.length - a.path.length;
      if (lengthDiff !== 0) return lengthDiff;
      if (a.type === b.type) return 0;
      return a.type === 'allow' ? -1 : 1;
    });

  if (rules.length === 0) return true;
  return rules[0].type === 'allow';
}
