import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
const audit = runGovernanceAudit({ strict: false });
console.log(JSON.stringify(audit.results.filter(r => r.status === 'FAIL')[0], null, 2));
