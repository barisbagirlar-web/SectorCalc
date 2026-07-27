/**
 * Topical map SSOT — topic → subtopic → entity → internal links.
 * Powers query fan-out, money-block related maps, and llm.txt discovery.
 * Primary ownership remains in query-ownership.mjs (one primaryQuery → one owner).
 */
export const TOPICAL_MAPS = Object.freeze([
  {
    topicId: 'tolerance-metrology',
    topic: 'Tolerance & metrology',
    problem: 'Will this assembly still close when every contributor sits at its worst legal extreme?',
    subtopics: [
      {
        id: 'stack-prediction',
        name: '1D stack prediction',
        entities: ['tolerance-stack-up'],
        fanOutQueries: [
          'worst case tolerance stack up',
          'rss tolerance stack calculator',
          'monte carlo tolerance analysis',
        ],
        links: [
          '/calculator/tolerance-stack-up',
          '/glossary/tolerance-stack-up',
          '/glossary/rss-tolerance',
          '/glossary/monte-carlo-simulation',
          '/guides/tolerance-stack-up-complete',
        ],
      },
      {
        id: 'fits-finish',
        name: 'Fits & surface finish',
        entities: ['iso-286-fits', 'surface-finish'],
        fanOutQueries: ['iso 286 fit calculator', 'ra to rz conversion'],
        links: ['/calculator/iso-286-fits', '/calculator/surface-finish', '/glossary/iso-286-fits'],
      },
    ],
  },
  {
    topicId: 'cnc-machining',
    topic: 'CNC machining',
    problem: 'Will this cut release on the spindle you actually own — or burn a tool and stall the machine?',
    subtopics: [
      {
        id: 'feeds-speeds',
        name: 'Feeds & speeds',
        entities: ['cnc-feeds-speeds'],
        fanOutQueries: ['cnc feeds and speeds calculator', 'chip thinning calculator', 'spindle power check'],
        links: [
          '/calculator/cnc-feeds-speeds',
          '/glossary/cnc-feeds-and-speeds',
          '/glossary/chip-thinning',
          '/guides/cnc-optimization-complete',
        ],
      },
      {
        id: 'toolpath-adjacent',
        name: 'Related machining checks',
        entities: ['tap-thread-milling', 'cycle-time-cost'],
        fanOutQueries: ['tap drill size calculator', 'cycle time cost per part'],
        links: ['/calculator/tap-thread-milling', '/calculator/cycle-time-cost'],
      },
    ],
  },
  {
    topicId: 'manufacturing-economics',
    topic: 'Manufacturing economics',
    problem: 'Is the shop rate and sell price recovering true cost — or quietly quoting away the margin?',
    subtopics: [
      {
        id: 'rates',
        name: 'Labor & machine rates',
        entities: ['true-labor-cost', 'machine-hour-rate'],
        fanOutQueries: ['true labor cost calculator', 'machine hourly rate calculator'],
        links: [
          '/calculator/true-labor-cost',
          '/calculator/machine-hour-rate',
          '/glossary/labor-burden-rate',
          '/glossary/machine-hour-rate',
          '/guides/labor-costing-complete',
        ],
      },
      {
        id: 'quoting-oee',
        name: 'Quoting & effectiveness',
        entities: ['quote-pricing', 'oee-teep'],
        fanOutQueries: ['manufacturing quote calculator', 'oee calculator'],
        links: ['/calculator/quote-pricing', '/calculator/oee-teep', '/glossary/oee-overall-equipment-effectiveness'],
      },
    ],
  },
  {
    topicId: 'reliability',
    topic: 'Reliability & rotating equipment',
    problem: 'Is the L10 life honest for the load and lubrication you will actually run?',
    subtopics: [
      {
        id: 'bearing-life',
        name: 'Bearing life',
        entities: ['bearing-life-l10'],
        fanOutQueries: ['bearing life calculator iso 281', 'L10h bearing life'],
        links: ['/calculator/bearing-life-l10', '/glossary/bearing-l10-life', '/glossary/iso-281', '/guides/bearing-life-complete'],
      },
      {
        id: 'adjacent-rotating',
        name: 'Adjacent checks',
        entities: ['bearing-frequencies', 'shaft-design', 'belt-chain-drive'],
        fanOutQueries: ['bpfo bpfi calculator', 'shaft diameter calculator'],
        links: ['/calculator/bearing-frequencies', '/calculator/shaft-design', '/calculator/belt-chain-drive'],
      },
    ],
  },
  {
    topicId: 'fasteners',
    topic: 'Fasteners & joints',
    problem: 'Will preload survive service — or is the joint riding on friction and hope?',
    subtopics: [
      {
        id: 'torque-preload',
        name: 'Torque & preload',
        entities: ['bolt-torque-preload', 'bolted-joint'],
        fanOutQueries: ['bolt torque preload calculator', 'vdi 2230 bolted joint calculator'],
        links: [
          '/calculator/bolt-torque-preload',
          '/calculator/bolted-joint',
          '/glossary/bolt-preload',
          '/glossary/vdi-2230-bolted-joint',
        ],
      },
    ],
  },
  {
    topicId: 'pressure',
    topic: 'Pressure equipment',
    problem: 'Is the wall thick enough under the code edition you claim — before steel is ordered?',
    subtopics: [
      {
        id: 'pipe-vessel',
        name: 'Pipe & vessel shells',
        entities: ['pipe-wall-thickness', 'pressure-vessel-shell'],
        fanOutQueries: [
          'asme b31.3 pipe wall thickness calculator',
          'asme viii pressure vessel thickness calculator',
        ],
        links: [
          '/calculator/pipe-wall-thickness',
          '/calculator/pressure-vessel-shell',
          '/glossary/asme-b31-pipe-wall',
          '/glossary/asme-viii-pressure-vessel',
        ],
      },
    ],
  },
  {
    topicId: 'welding',
    topic: 'Welding & fabrication',
    problem: 'Is the throat and heat input inside the process window — or are you guessing from habit?',
    subtopics: [
      {
        id: 'weld-size-heat',
        name: 'Weld size & heat input',
        entities: ['weld-thickness', 'weld-heat-input'],
        fanOutQueries: ['weld size calculator', 'welding heat input calculator', 't8/5 cooling rate'],
        links: [
          '/calculator/weld-thickness',
          '/calculator/weld-heat-input',
          '/glossary/weld-throat',
          '/glossary/heat-input-t85',
          '/guides/weld-sizing-complete',
        ],
      },
      {
        id: 'forming',
        name: 'Forming adjacent',
        entities: ['sheet-metal-bend', 'punching-force'],
        fanOutQueries: ['k factor bend calculator', 'punching force calculator'],
        links: ['/calculator/sheet-metal-bend', '/calculator/punching-force'],
      },
    ],
  },
  {
    topicId: 'lifting',
    topic: 'Lifting & rigging',
    problem: 'Does the sling and hardware rating survive the angle and shock you will actually apply?',
    subtopics: [
      {
        id: 'sling-hardware',
        name: 'Sling & hardware',
        entities: ['sling-capacity', 'shackle-eyebolt'],
        fanOutQueries: ['sling angle capacity calculator', 'shackle working load limit'],
        links: ['/calculator/sling-capacity', '/calculator/shackle-eyebolt', '/glossary/sling-angle-factor'],
      },
    ],
  },
]);

export function topicalMapForEntity(primaryEntity) {
  for (const topic of TOPICAL_MAPS) {
    for (const sub of topic.subtopics) {
      if (sub.entities.includes(primaryEntity)) {
        return { topic, subtopic: sub };
      }
    }
  }
  return null;
}

export function allFanOutQueries() {
  const out = [];
  for (const topic of TOPICAL_MAPS) {
    for (const sub of topic.subtopics) {
      for (const q of sub.fanOutQueries || []) out.push({ query: q, topicId: topic.topicId, subtopicId: sub.id });
    }
  }
  return out;
}
