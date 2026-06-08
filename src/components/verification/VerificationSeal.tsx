import type { PublicVerificationDisplay } from "@/lib/verification/verification-types";

type VerificationSealProps = {
  readonly display: PublicVerificationDisplay;
};

export function VerificationSeal({ display }: VerificationSealProps) {
  return (
    <aside className="sc-industrial-panel min-w-0 space-y-3 p-4 sm:p-5 font-mono text-xs">
      <p className="font-sans text-sm font-semibold text-navy">Verification seal</p>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-body-charcoal">Verification ID</dt>
          <dd className="mt-1 break-all text-navy">{display.verificationId}</dd>
        </div>
        <div>
          <dt className="text-body-charcoal">Status</dt>
          <dd className="mt-1 text-navy">{display.status}</dd>
        </div>
        <div>
          <dt className="text-body-charcoal">Report hash</dt>
          <dd className="mt-1 break-all text-navy">{display.reportHash}</dd>
        </div>
        <div>
          <dt className="text-body-charcoal">Formula contract</dt>
          <dd className="mt-1 break-all text-navy">{display.formulaContractSlug}</dd>
        </div>
        <div>
          <dt className="text-body-charcoal">Generated</dt>
          <dd className="mt-1 text-navy">{display.generatedAt}</dd>
        </div>
        <div>
          <dt className="text-body-charcoal">Validation</dt>
          <dd className="mt-1 text-navy">{display.validationStatus}</dd>
        </div>
      </dl>
      <p className="font-sans text-xs leading-relaxed text-body-charcoal">{display.disclaimer}</p>
    </aside>
  );
}
