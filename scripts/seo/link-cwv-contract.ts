export type LinkNode = { path: string; links: string[] };
export type CwvThresholds = { lcpP75Ms: number; inpP75Ms: number; clsP75: number };
export type CwvObservation = { lcpP75Ms?: number; inpP75Ms?: number; clsP75?: number };

export function findOrphans(nodes: LinkNode[], roots: string[]): string[] {
  const index = new Map(nodes.map((node) => [node.path, node]));
  const visited = new Set<string>();
  const queue = [...roots.filter((root) => index.has(root))];
  while (queue.length) {
    const path = queue.shift() as string;
    if (visited.has(path)) continue;
    visited.add(path);
    for (const target of index.get(path)?.links ?? []) if (index.has(target) && !visited.has(target)) queue.push(target);
  }
  return nodes.map((node) => node.path).filter((path) => !visited.has(path)).sort();
}

export function evaluateCwv(observation: CwvObservation, thresholds: CwvThresholds): { status: 'PASS' | 'SKIP_NO_DATA' | 'FAIL'; failures: string[] } {
  const keys = ['lcpP75Ms', 'inpP75Ms', 'clsP75'] as const;
  if (keys.some((key) => observation[key] === undefined)) return { status: 'SKIP_NO_DATA', failures: [] };
  const failures: string[] = [];
  if ((observation.lcpP75Ms as number) > thresholds.lcpP75Ms) failures.push('LCP');
  if ((observation.inpP75Ms as number) > thresholds.inpP75Ms) failures.push('INP');
  if ((observation.clsP75 as number) > thresholds.clsP75) failures.push('CLS');
  return failures.length ? { status: 'FAIL', failures } : { status: 'PASS', failures: [] };
}

export function assertAnchorQuality(anchor: string): void {
  const text = anchor.trim().toLowerCase();
  if (!text || /^(click here|read more|learn more|here|link)$/.test(text)) throw new Error(`GENERIC_ANCHOR ${anchor}`);
}
