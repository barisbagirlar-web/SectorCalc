// CBAM billing constants — single source of truth for the entitlement model.
// 100 account credits unlock a package of 5 CBAM report uses.
// Each successful sealed report generation consumes exactly 1 use.
// No Paddle product/price ID required. Uses existing internal account credit balance.

export const CBAM_PACKAGE_CREDITS = 100;
export const CBAM_PACKAGE_INCLUDED_USES = 5;
export const CBAM_REPORT_USE_COST = 1;
export const CBAM_SERVICE_KEY = "cbam_definitive_period_report";
export const CBAM_ENTITLEMENT_KEY = "cbam_100_account_credits_5_reports";
