/**
 * Structured, PII-free operational logging.
 * Never log email addresses, raw tokens, or full UIDs.
 */
import { createHash } from 'node:crypto';

export function uidHash(uid: string): string {
  return createHash('sha256').update(uid).digest('hex').slice(0, 16);
}

export type EntitlementLogEvent =
  | 'entitlement_list_requested'
  | 'entitlement_session_reused'
  | 'entitlement_session_started'
  | 'entitlement_session_denied'
  | 'entitlement_upserted'
  | 'entitlement_api_failed'
  | 'entitlement_fetch_failed';

interface LogFields {
  uidHash?: string;
  toolId?: string;
  sessionId?: string;
  result?: string;
  creditsBefore?: number;
  creditsAfter?: number;
  correlationId?: string;
  [k: string]: unknown;
}

/** Synchronous correlation id from a request object's header (x-correlation-id) or random. */
export function correlationIdFrom(req: { get?: (h: string) => string | undefined }): string {
  const incoming = req.get?.('x-correlation-id');
  if (incoming) return incoming.slice(0, 64);
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function logEntitlement(event: EntitlementLogEvent, fields: LogFields): void {
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      event,
      ts: new Date().toISOString(),
      ...fields
    })
  );
}
