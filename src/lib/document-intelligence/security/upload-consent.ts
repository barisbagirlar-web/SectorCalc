/**
 * Upload Consent / Privacy Attestation
 *
 * Manages the end-user consent lifecycle for the Document Intelligence
 * document upload workflow. Every upload requires explicit consent to:
 *
 * 1. Authorise SectorCalc to upload and process the submitted document.
 * 2. Accept prohibited-data restrictions (no PII, no classified info).
 * 3. Accept cloud processing (third-party AI provider).
 * 4. Acknowledge the output retention policy.
 * 5. Acknowledge that output requires manual review before operational use.
 *
 * Consent is stored immutably in Firestore under the job subcollection:
 *   documentIntelligenceJobs/{jobId}/consent/{consentVersion}
 *
 * Dependencies: getAdminFirestore from @/lib/infrastructure/firebase/admin
 */

import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { escapeHtml } from "@/lib/document-intelligence/workbook/html-utils";

/* ── Consent Contract ─────────────────────────────────────────── */

export interface UploadConsent {
  consentVersion: string;
  consentTimestamp: string;
  userId: string;
  jobId: string;
  authorizedToUpload: boolean;
  prohibitedDataAccepted: boolean;
  processingAccepted: boolean;
  retentionPolicyUnderstood: boolean;
  outputRequiresReview: boolean;
  productVersion: string;
}

/* ── Validation ───────────────────────────────────────────────── */

const CONSENT_FIELDS: Record<keyof UploadConsent, { type: string; required: boolean }> = {
  consentVersion: { type: "string", required: true },
  consentTimestamp: { type: "string", required: true },
  userId: { type: "string", required: true },
  jobId: { type: "string", required: true },
  authorizedToUpload: { type: "boolean", required: true },
  prohibitedDataAccepted: { type: "boolean", required: true },
  processingAccepted: { type: "boolean", required: true },
  retentionPolicyUnderstood: { type: "boolean", required: true },
  outputRequiresReview: { type: "boolean", required: true },
  productVersion: { type: "string", required: true },
};

const BOOLEAN_CONSENT_FIELDS: (keyof UploadConsent)[] = [
  "authorizedToUpload",
  "prohibitedDataAccepted",
  "processingAccepted",
  "retentionPolicyUnderstood",
  "outputRequiresReview",
];

export function validateConsent(
  data: Record<string, unknown>,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [field, spec] of Object.entries(CONSENT_FIELDS)) {
    const value = data[field];

    if (value === undefined || value === null) {
      if (spec.required) {
        errors.push(`Missing required field: "${field}"`);
      }
      continue;
    }

    if (spec.type === "boolean" && typeof value !== "boolean") {
      errors.push(`Field "${field}" must be boolean, got ${typeof value}`);
      continue;
    }

    if (spec.type === "string" && typeof value !== "string") {
      errors.push(`Field "${field}" must be string, got ${typeof value}`);
      continue;
    }

    if (spec.type === "string" && typeof value === "string" && value.trim().length === 0) {
      errors.push(`Field "${field}" must not be empty`);
    }
  }

  // Semantic consent check: all boolean consent fields must be true
  if (errors.length === 0) {
    for (const boolField of BOOLEAN_CONSENT_FIELDS) {
      if (data[boolField] !== true) {
        errors.push(
          `Consent denied: "${boolField}" must be explicitly accepted (true)`,
        );
      }
    }
  }

  // Validate timestamp is ISO-8601
  const ts = data.consentTimestamp;
  if (typeof ts === "string" && ts.length > 0) {
    const parsed = Date.parse(ts);
    if (isNaN(parsed)) {
      errors.push(`Field "consentTimestamp" is not a valid ISO-8601 date string: "${ts}"`);
    }
  }

  return { ok: errors.length === 0, errors };
}

/* ── Consent Form HTML ─────────────────────────────────────────- */

export function generateConsentFormHtml(productVersion: string): string {
  const generatedAt = new Date().toISOString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SectorCalc — Upload Consent &amp; Privacy Attestation</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #F0EEE6; color: #1A1915; line-height: 1.5; padding: 2rem;
    }
    .container { max-width: 720px; margin: 0 auto; }
    h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.25rem; }
    .subtitle { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }
    .consent-box {
      background: #fff; border: 1px solid #D4D2C8; padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .consent-box h2 { font-size: 1.1rem; font-weight: 500; margin-bottom: 1rem; }
    .consent-item {
      display: flex; align-items: flex-start; gap: 0.75rem;
      padding: 0.75rem 0; border-bottom: 1px solid #E8E6DE;
    }
    .consent-item:last-child { border-bottom: none; }
    .consent-item input[type="checkbox"] {
      margin-top: 0.2rem; width: 1.125rem; height: 1.125rem;
      accent-color: #BD5D3A; flex-shrink: 0;
    }
    .consent-item label { font-size: 0.9375rem; cursor: pointer; }
    .consent-item .description {
      font-size: 0.8125rem; color: #666; margin-top: 0.25rem;
    }
    .actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    button {
      padding: 0.625rem 1.5rem; font-size: 0.9375rem; font-weight: 500;
      border: none; cursor: pointer;
    }
    .btn-accept { background: #BD5D3A; color: #fff; }
    .btn-accept:disabled { background: #D4D2C8; cursor: not-allowed; }
    .btn-cancel { background: transparent; color: #1A1915; border: 1px solid #D4D2C8; }
    .product-badge {
      display: inline-block; background: #1A1915; color: #F0EEE6;
      font-size: 0.75rem; padding: 0.2rem 0.5rem; margin-left: 0.5rem;
    }
    .notice {
      background: #FDF6F3; border: 1px solid #E8C8B0; padding: 1rem;
      font-size: 0.8125rem; margin-bottom: 1.5rem;
    }
    .notice strong { color: #BD5D3A; }
    @media (max-width: 768px) { body { padding: 1rem; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>Upload Consent &amp; Privacy Attestation
      <span class="product-badge">v${escapeHtml(productVersion)}</span>
    </h1>
    <p class="subtitle">Generated: ${escapeHtml(generatedAt)}</p>

    <div class="notice">
      <strong>Important:</strong> This consent is required before any document can be uploaded
      for processing. All fields must be accepted (checked) to proceed. Your document data
      is processed in accordance with the SectorCalc Privacy Policy.
    </div>

    <div class="consent-box">
      <h2>Consent Requirements</h2>

      <div class="consent-item">
        <input type="checkbox" id="authorizedToUpload" data-consent-field="authorizedToUpload">
        <div>
          <label for="authorizedToUpload">I am authorised to upload this document</label>
          <div class="description">
            I confirm that I own the document or have the legal right to share it
            with SectorCalc for processing. I understand that I must not upload
            documents containing personal data, classified information, or
            trade secrets without authorisation.
          </div>
        </div>
      </div>

      <div class="consent-item">
        <input type="checkbox" id="prohibitedDataAccepted" data-consent-field="prohibitedDataAccepted">
        <div>
          <label for="prohibitedDataAccepted">No prohibited data included</label>
          <div class="description">
            I confirm that this document does not contain: personally identifiable
            information (PII), special category data, export-controlled technical
            data (ITAR/EAR), classified information, passwords, payment card data,
            or health/medical information.
          </div>
        </div>
      </div>

      <div class="consent-item">
        <input type="checkbox" id="processingAccepted" data-consent-field="processingAccepted">
        <div>
          <label for="processingAccepted">Accept cloud processing</label>
          <div class="description">
            I understand that SectorCalc uses third-party cloud AI providers
            (including Google Cloud AI, OpenAI, and/or similar services) to
            process uploaded documents. Document content sent to these providers
            is subject to their respective data processing terms.
          </div>
        </div>
      </div>

      <div class="consent-item">
        <input type="checkbox" id="retentionPolicyUnderstood" data-consent-field="retentionPolicyUnderstood">
        <div>
          <label for="retentionPolicyUnderstood">Retention policy understood</label>
          <div class="description">
            I understand that uploaded source documents are retained for a limited
            period (typically 24 hours) and automatically deleted thereafter.
            Generated output files are retained for a limited period (typically
            7 days). I will download output files before the retention deadline.
          </div>
        </div>
      </div>

      <div class="consent-item">
        <input type="checkbox" id="outputRequiresReview" data-consent-field="outputRequiresReview">
        <div>
          <label for="outputRequiresReview">Output requires manual review</label>
          <div class="description">
            I acknowledge that SectorCalc's output is a technical extraction aid,
            not a substitute for professional engineering review. All extracted
            and normalised data must be verified by a qualified professional
            before use in ERP import, purchasing, maintenance, or engineering
            decisions.
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn-accept" id="acceptBtn" disabled>Accept &amp; Upload</button>
      <button class="btn-cancel" id="cancelBtn">Cancel</button>
    </div>
  </div>

  <script>
    (function() {
      var checkboxes = document.querySelectorAll('[data-consent-field]');
      var acceptBtn = document.getElementById('acceptBtn');
      var cancelBtn = document.getElementById('cancelBtn');

      function updateAcceptState() {
        var allChecked = Array.from(checkboxes).every(function(cb) { return cb.checked; });
        acceptBtn.disabled = !allChecked;
      }

      checkboxes.forEach(function(cb) {
        cb.addEventListener('change', updateAcceptState);
      });

      acceptBtn.addEventListener('click', function() {
        var consent = {
          consentVersion: '${escapeHtml(productVersion)}',
          consentTimestamp: new Date().toISOString(),
          userId: '',
          jobId: '',
          authorizedToUpload: document.getElementById('authorizedToUpload').checked,
          prohibitedDataAccepted: document.getElementById('prohibitedDataAccepted').checked,
          processingAccepted: document.getElementById('processingAccepted').checked,
          retentionPolicyUnderstood: document.getElementById('retentionPolicyUnderstood').checked,
          outputRequiresReview: document.getElementById('outputRequiresReview').checked,
          productVersion: '${escapeHtml(productVersion)}',
        };
        // Dispatch custom event for the hosting application
        window.dispatchEvent(new CustomEvent('sectorcalc-consent-accepted', { detail: consent }));
      });

      cancelBtn.addEventListener('click', function() {
        window.dispatchEvent(new CustomEvent('sectorcalc-consent-cancelled'));
      });
    })();
  </script>
</body>
</html>`;
}

/* ── Firestore Storage ─────────────────────────────────────────── */

export async function storeConsent(
  consent: UploadConsent,
): Promise<{ ok: boolean; error?: string }> {
  // Validate before writing
  const validation = validateConsent(consent as unknown as Record<string, unknown>);
  if (!validation.ok) {
    return { ok: false, error: `Validation failed: ${validation.errors.join("; ")}` };
  }

  // Ensure all boolean fields are explicitly true
  for (const field of BOOLEAN_CONSENT_FIELDS) {
    if ((consent as unknown as Record<string, unknown>)[field] !== true) {
      return { ok: false, error: `Consent denied: "${field}" must be true` };
    }
  }

  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, error: "Firestore not available" };
  }

  try {
    // Write to documentIntelligenceJobs/{jobId}/consent/{consentVersion}
    const docRef = db
      .collection("documentIntelligenceJobs")
      .doc(consent.jobId)
      .collection("consent")
      .doc(consent.consentVersion);

    await docRef.set({
      ...consent,
      _createdAt: new Date().toISOString(),
      _immutable: true,
    });

    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Firestore write failed: ${msg}` };
  }
}

/* ── Internal Helpers ─────────────────────────────────────────── */
