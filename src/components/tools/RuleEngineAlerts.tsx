import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import type { RuleAlert } from '@/lib/features/engine/rule-engine';

export function RuleEngineAlerts({ alerts }: { alerts: RuleAlert[] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-4">
      {alerts.map((alert, index) => {
        const isCritical = alert.severity === 'CRITICAL';
        const isWarning = alert.severity === 'WARNING';
        
        return (
          <div 
            key={index}
            className={`flex items-start p-4 rounded-lg border ${
              isCritical ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400' :
              isWarning ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400' :
              'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isCritical ? (
                <AlertCircle className="w-5 h-5" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold mb-1">
                {isCritical ? 'CRITICAL LIMIT VIOLATION' : isWarning ? 'WARNING: BOUNDARY APPROACHED' : 'OPTIMAL CONDITIONS'}
              </h3>
              <p className="text-sm opacity-90">{alert.message}</p>
              <p className="text-xs opacity-75 mt-2 flex items-center">
                <span className="font-medium mr-1">Source:</span> {alert.source}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
