import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { monetizationEnabled } from '../lib/config';

export async function handleHealth(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    ok: true,
    service: 'sectorcalc-billing',
    creditMonetizationEnabled: monetizationEnabled(),
    paddleEnv: process.env.PADDLE_ENV || null,
    reconciliationSchedulerMissing: true,
    RECONCILIATION_SCHEDULER_MISSING: 'YES'
  });
}
