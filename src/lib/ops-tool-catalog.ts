/**
 * Live calculator inventory for the ops administration console.
 * Hrefs must match firebase.json / verify-nav rewrite targets.
 */
export interface OpsToolEntry {
  id: string;
  name: string;
  href: string;
  status: 'live';
}

export const OPS_TOOL_CATALOG: OpsToolEntry[] = [
  { id: 'SC-001', name: 'Weld Thickness', href: '/calculator/weld-thickness', status: 'live' },
  { id: 'SC-008', name: 'Tolerance Stack-Up', href: '/calculator/tolerance-stack-up', status: 'live' },
  { id: 'SC-010', name: 'True Labor Cost', href: '/calculator/true-labor-cost', status: 'live' },
  { id: 'SC-012', name: 'Quote Pricing', href: '/calculator/quote-pricing', status: 'live' },
  { id: 'SC-020', name: 'CNC Feeds & Speeds', href: '/calculator/cnc-feeds-speeds', status: 'live' },
  { id: 'SC-021', name: 'Bearing Life L10', href: '/calculator/bearing-life-l10', status: 'live' },
  { id: 'SC-022', name: 'Tap & Thread Milling', href: '/calculator/tap-thread-milling', status: 'live' },
  { id: 'SC-023', name: 'Cycle Time & Cost', href: '/calculator/cycle-time-cost', status: 'live' },
  { id: 'SC-024', name: 'Bearing Frequencies', href: '/calculator/bearing-frequencies', status: 'live' },
  { id: 'SC-025', name: 'Belt & Chain Drive', href: '/calculator/belt-chain-drive', status: 'live' },
  { id: 'SC-026', name: 'Shaft Design', href: '/calculator/shaft-design', status: 'live' },
  { id: 'SC-027', name: 'ISO 286 Fits', href: '/calculator/iso-286-fits', status: 'live' },
  { id: 'SC-028', name: 'Surface Finish', href: '/calculator/surface-finish', status: 'live' },
  { id: 'SC-029', name: 'Weld Heat Input', href: '/calculator/weld-heat-input', status: 'live' },
  { id: 'SC-030', name: 'Bend & K-Factor', href: '/calculator/sheet-metal-bend', status: 'live' },
  { id: 'SC-031', name: 'Sling Capacity', href: '/calculator/sling-capacity', status: 'live' },
  { id: 'SC-032', name: 'Shackle & Eye Bolt', href: '/calculator/shackle-eyebolt', status: 'live' },
  { id: 'SC-033', name: 'Pressure Vessel Shell', href: '/calculator/pressure-vessel-shell', status: 'live' },
  { id: 'SC-034', name: 'Pipe Wall Thickness', href: '/calculator/pipe-wall-thickness', status: 'live' },
  { id: 'SC-035', name: 'Bolt Torque & Preload', href: '/calculator/bolt-torque-preload', status: 'live' },
  { id: 'SC-036', name: 'Bolted Joint', href: '/calculator/bolted-joint', status: 'live' },
  { id: 'SC-037', name: 'OEE / TEEP', href: '/calculator/oee-teep', status: 'live' },
  { id: 'SC-038', name: 'Machine Hour Rate', href: '/calculator/machine-hour-rate', status: 'live' },
  { id: 'SC-039', name: 'Punching Force', href: '/calculator/punching-force', status: 'live' },
  { id: 'SC-040', name: 'Hydraulic Cylinder', href: '/calculator/hydraulic-cylinder', status: 'live' }
];
