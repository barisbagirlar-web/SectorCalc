import { AlertTriangle } from 'lucide-react';

interface DecisionToolLegalDisclaimerProps {
  variant?: "free" | "paid";
}

export function DecisionToolLegalDisclaimer({
  variant = "free",
}: DecisionToolLegalDisclaimerProps) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 mt-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <div className="ml-3">
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
            ENGINEERING DISCLAIMER
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-red-700 dark:text-red-200">
            These calculations are provided as engineering estimation tools.
            Results must be verified by a qualified professional engineer before
            application in production, safety-critical, or structural contexts.
            SectorCalc assumes no liability for decisions made based on these results.
            Always validate against applicable local standards and regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
