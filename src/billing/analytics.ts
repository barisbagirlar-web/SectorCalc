/**
 * Billing analytics helpers — GA4 via existing scTrack when present.
 * Never send engineering input values.
 */
export type BillingAnalyticsEvent =
  | 'calculator_free_completed'
  | 'professional_report_clicked'
  | 'insufficient_credit'
  | 'checkout_started'
  | 'credit_purchase_success'
  | 'credit_purchase_failed'
  | 'professional_session_started'
  | 'professional_report_generated'
  | 'credit_wallet_viewed';

export interface BillingAnalyticsProps {
  toolId?: string;
  pricingTier?: string;
  creditCost?: number;
  packageId?: string;
  cohort?: 'anonymous' | 'account';
}

declare global {
  interface Window {
    scTrack?: (name: string, params?: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

const ALLOWED = new Set<BillingAnalyticsEvent>([
  'calculator_free_completed',
  'professional_report_clicked',
  'insufficient_credit',
  'checkout_started',
  'credit_purchase_success',
  'credit_purchase_failed',
  'professional_session_started',
  'professional_report_generated',
  'credit_wallet_viewed'
]);

export function trackBillingEvent(name: BillingAnalyticsEvent, props: BillingAnalyticsProps = {}): void {
  if (!ALLOWED.has(name)) return;
  const payload: Record<string, unknown> = {};
  if (props.toolId) payload.tool_id = props.toolId;
  if (props.pricingTier) payload.pricing_tier = props.pricingTier;
  if (props.creditCost != null) payload.credit_cost = props.creditCost;
  if (props.packageId) payload.package_id = props.packageId;
  if (props.cohort) payload.cohort = props.cohort;

  if (typeof window === 'undefined') return;
  if (typeof window.scTrack === 'function') {
    // Extend funnel allow-list via direct gtag if scTrack rejects unknown names.
    try {
      window.scTrack(name, payload);
    } catch {
      /* ignore */
    }
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }
}
