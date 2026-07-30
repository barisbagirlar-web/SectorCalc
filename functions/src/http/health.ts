import type { Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';
import { getPaddleEnv, monetizationEnabled } from '../lib/config';

export async function handleHealth(
  _req: Request,
  res: Response,
  opts?: { reconciliationSchedulerDeployed?: boolean }
): Promise<void> {
  const schedulerDeployed = opts?.reconciliationSchedulerDeployed === true;
  res.status(200).json({
    ok: true,
    service: 'sectorcalc-billing',
    creditMonetizationEnabled: monetizationEnabled(),
    paddleEnv: getPaddleEnv(),
    reconciliationSchedulerMissing: !schedulerDeployed,
    RECONCILIATION_SCHEDULER_MISSING: schedulerDeployed ? 'NO' : 'YES',
    reconciliationSchedule: schedulerDeployed ? 'every 15 minutes' : null
  });
}
