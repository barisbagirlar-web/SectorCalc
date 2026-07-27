import { getAuth } from 'firebase-admin/auth';
import type { Request } from 'firebase-functions/v2/https';

export async function requireUser(req: Request): Promise<{ uid: string; email?: string }> {
  const hdr = req.get('authorization') || req.get('Authorization') || '';
  const m = hdr.match(/^Bearer\s+(.+)$/i);
  if (!m) {
    const err = new Error('NOT_AUTHENTICATED');
    (err as Error & { status: number }).status = 401;
    throw err;
  }
  try {
    const decoded = await getAuth().verifyIdToken(m[1]!);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    const err = new Error('NOT_AUTHENTICATED');
    (err as Error & { status: number }).status = 401;
    throw err;
  }
}

export function sendError(res: { status: (n: number) => { json: (b: unknown) => void } }, err: unknown): void {
  const msg = err instanceof Error ? err.message : 'INTERNAL';
  const status = (err as { status?: number })?.status || (msg.startsWith('PADDLE_CONFIGURATION') ? 503 : 500);
  const code =
    msg === 'NOT_AUTHENTICATED'
      ? 'NOT_AUTHENTICATED'
      : msg.startsWith('PADDLE_CONFIGURATION')
        ? 'PADDLE_CONFIGURATION_ERROR'
        : msg;
  res.status(status === 500 && code !== 'INTERNAL' && status ? status : status).json({ error: code, message: msg });
}
