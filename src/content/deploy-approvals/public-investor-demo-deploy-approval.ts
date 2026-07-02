/**
 * Phase 6D deploy approval record - QA complete; deploy command disabled until 6E.
 */

export const PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL = {
  phase: "6D",
  deployTarget: "production",
  pages: ["investor-demo", "pricing", "operating-system"],
  qaStatus: {
    desktopPassed: true,
    mobilePassed: true,
    buildPassed: true,
    lintPassed: true,
    secretsPassed: true,
    formulaTestsPassed: true,
    consoleFatalExpected: false,
    networkFatalExpected: false,
  },
  deployApproved: true,
  deployCommandAllowed: false,
  notes:
    "6D QA and mobile polish completed. Production deploy requires explicit next-step approval in Phase 6E.",
} as const;

export type PublicInvestorDemoDeployApproval = typeof PUBLIC_INVESTOR_DEMO_DEPLOY_APPROVAL;
