/**
 * One primary search intent cluster → one owner URL.
 * Supporting routes must reinforce the owner, not compete as primary.
 */

export const QUERY_OWNERSHIP = [
  {
    clusterId: 'tolerance-stack-analysis',
    primaryQuery: 'tolerance stack up calculator',
    owner: '/calculator/tolerance-stack-up',
    supportingRoutes: [
      '/glossary/tolerance-stack-up',
      '/glossary/rss-tolerance',
      '/glossary/worst-case-analysis',
      '/glossary/monte-carlo-simulation',
      '/guides/tolerance-stack-up-complete',
      '/blog/tolerance-stack-up-rss-vs-monte-carlo.html',
    ],
  },
  {
    clusterId: 'cnc-feeds-speeds',
    primaryQuery: 'cnc feeds and speeds calculator',
    owner: '/calculator/cnc-feeds-speeds',
    supportingRoutes: [
      '/glossary/cnc-feeds-and-speeds',
      '/glossary/taylor-tool-life',
      '/glossary/chip-thinning',
      '/guides/cnc-optimization-complete',
    ],
  },
  {
    clusterId: 'manufacturing-machine-cost',
    primaryQuery: 'machine hourly rate calculator',
    owner: '/calculator/machine-hour-rate',
    supportingRoutes: ['/glossary/machine-hour-rate', '/guides/labor-costing-complete'],
  },
  {
    clusterId: 'labor-burden-cost',
    primaryQuery: 'true labor cost calculator',
    owner: '/calculator/true-labor-cost',
    supportingRoutes: ['/glossary/labor-burden-rate', '/guides/labor-costing-complete'],
  },
  {
    clusterId: 'manufacturing-quoting',
    primaryQuery: 'manufacturing quote calculator',
    owner: '/calculator/quote-pricing',
    supportingRoutes: ['/guides/labor-costing-complete', '/resources/excel-to-sectorcalc-migration'],
  },
  {
    clusterId: 'oee-teep',
    primaryQuery: 'oee calculator',
    owner: '/calculator/oee-teep',
    supportingRoutes: ['/glossary/oee-overall-equipment-effectiveness'],
  },
  {
    clusterId: 'bearing-life-l10',
    primaryQuery: 'bearing life calculator iso 281',
    owner: '/calculator/bearing-life-l10',
    supportingRoutes: ['/glossary/bearing-l10-life', '/glossary/iso-281', '/guides/bearing-life-complete'],
  },
  {
    clusterId: 'bolt-torque-preload',
    primaryQuery: 'bolt torque preload calculator',
    owner: '/calculator/bolt-torque-preload',
    supportingRoutes: ['/glossary/bolt-preload', '/glossary/vdi-2230-bolted-joint'],
  },
  {
    clusterId: 'bolted-joint',
    primaryQuery: 'bolted joint calculator vdi 2230',
    owner: '/calculator/bolted-joint',
    supportingRoutes: ['/glossary/vdi-2230-bolted-joint', '/glossary/bolt-preload'],
  },
  {
    clusterId: 'pipe-wall-thickness',
    primaryQuery: 'asme b31.3 pipe wall thickness calculator',
    owner: '/calculator/pipe-wall-thickness',
    supportingRoutes: ['/glossary/asme-b31-pipe-wall'],
  },
  {
    clusterId: 'pressure-vessel-shell',
    primaryQuery: 'asme viii pressure vessel thickness calculator',
    owner: '/calculator/pressure-vessel-shell',
    supportingRoutes: ['/glossary/asme-viii-pressure-vessel'],
  },
  {
    clusterId: 'weld-heat-input',
    primaryQuery: 'welding heat input calculator',
    owner: '/calculator/weld-heat-input',
    supportingRoutes: ['/glossary/heat-input-t85', '/guides/weld-sizing-complete'],
  },
  {
    clusterId: 'weld-thickness',
    primaryQuery: 'weld size calculator',
    owner: '/calculator/weld-thickness',
    supportingRoutes: ['/glossary/weld-throat', '/guides/weld-sizing-complete'],
  },
  {
    clusterId: 'iso-286-fits',
    primaryQuery: 'iso 286 fits calculator',
    owner: '/calculator/iso-286-fits',
    supportingRoutes: ['/glossary/iso-286-fits', '/resources/iso-286-quick-reference'],
  },
];

export function findDuplicatePrimaryOwners() {
  const byOwner = new Map();
  const conflicts = [];
  for (const c of QUERY_OWNERSHIP) {
    if (byOwner.has(c.owner)) {
      conflicts.push({ owner: c.owner, clusters: [byOwner.get(c.owner), c.clusterId] });
    } else {
      byOwner.set(c.owner, c.clusterId);
    }
  }
  const byQuery = new Map();
  for (const c of QUERY_OWNERSHIP) {
    const key = c.primaryQuery.toLowerCase();
    if (byQuery.has(key) && byQuery.get(key) !== c.owner) {
      conflicts.push({ primaryQuery: c.primaryQuery, owners: [byQuery.get(key), c.owner] });
    } else {
      byQuery.set(key, c.owner);
    }
  }
  return conflicts;
}
