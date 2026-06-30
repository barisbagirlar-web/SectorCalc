/**
 * Phase 6E post-deploy smoke record — production hosting deploy verification.
 */

export const PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE = {
  phase: "6E",
  deployTarget: "production",
  deployStatus: "deployed_live",
  pages: ["investor-demo", "pricing", "operating-system"],
  desktopPassed: true,
  mobilePassed: true,
  consoleClean: false,
  networkClean: true,
  smartFormPilotsStillLive: true,
  rollbackRequired: true,
  status: "partial_pass",
  notes:
    "Hosting deploy succeeded. Pricing and operating-system pages render on production. Investor-demo returns HTTP 200 but SSR body fails (RSC digest 485426391) on Cloud Run — metadata/shell only. Smart Form pilots unchanged. Hotfix required before investor-demo is launch-ready; full hosting rollback not required for pricing/OS.",
  liveChecks: {
    hostingUrl: "https://sectorcalc.com",
    firebaseHostingUrl: "https://sectorcalc-bf412.web.app",
    deployedAt: "2026-06-08",
    viewportsVerified: ["1280px", "1440px", "375px", "390px", "430px"],
    pageResults: {
      "investor-demo": {
        httpStatus: 200,
        bodyRendered: false,
        rscDigestError: "485426391",
      },
      pricing: { httpStatus: 200, bodyRendered: true },
      "operating-system": { httpStatus: 200, bodyRendered: true },
    },
    localeRoutesChecked: ["/en/investor-demo", "/en/pricing", "/en/operating-system"],
    smartFormPilots: [
      "3d-print-cost-check",
      "repair-time-vs-price-check",
      "cabinet-cost-estimator",
    ],
  },
} as const;

export type PublicInvestorDemoPostDeploySmoke =
  typeof PUBLIC_INVESTOR_DEMO_POST_DEPLOY_SMOKE;
