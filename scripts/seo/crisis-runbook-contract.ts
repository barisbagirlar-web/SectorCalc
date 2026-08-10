export type CrisisCard = {
  id: 'algorithm-drop' | 'manual-action' | 'technical-disaster' | 'revenue-crisis';
  detection: string[];
  firstFourHours: string[];
  decisionTree: string[];
  communication: string[];
};

export function validateCrisisCards(cards: CrisisCard[]): string[] {
  const required = new Set(['algorithm-drop', 'manual-action', 'technical-disaster', 'revenue-crisis']);
  const errors: string[] = [];
  for (const card of cards) {
    required.delete(card.id);
    for (const field of ['detection', 'firstFourHours', 'decisionTree', 'communication'] as const) {
      if (!Array.isArray(card[field]) || card[field].length === 0) errors.push(`${card.id}:${field}`);
    }
  }
  for (const missing of required) errors.push(`missing:${missing}`);
  return errors.sort();
}

export function assertMigrationMayStart(runbookExists: boolean, approvalRecorded: boolean): void {
  if (!runbookExists || !approvalRecorded) throw new Error('MIGRATION_START_BLOCKED');
}

const FORBIDDEN_EXECUTION = [
  /automatic\s+301/i,
  /automatic\s+content\s+publish/i,
  /bulk\s+410/i,
  /paid\s+link/i,
  /\bPBN\b/i,
  /cross-site\s+link\s+scheme/i,
  /fake\s+lastmod/i,
  /invisible\s+schema\s+claim/i,
  /fabricated\s+faq/i,
];

export function findForbiddenExecution(text: string): string[] {
  return FORBIDDEN_EXECUTION.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}
