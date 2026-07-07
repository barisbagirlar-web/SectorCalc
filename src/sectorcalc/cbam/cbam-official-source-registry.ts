// CBAM Official Source Registry
// Single source of truth for CBAM regulatory references.
// Each source must be verified before paid report generation is unlocked.
import "server-only";

export interface CbamOfficialSource {
  source_id: string;
  publisher: string;
  title: string;
  source_type:
    | "REGULATORY_PUBLIC_SOURCE"
    | "REGULATORY_BINDING_LEGAL_SOURCE"
    | "INFORMATIONAL_EXCEL_SOURCE";
  official_source_url: string;
  required_for_unlock: boolean;
  version_label: string;
  publication_date: string;
  retrieved_at: string | null;
  sha256: string | null;
  retrieval_status:
    | "FETCHED_AND_HASHED"
    | "MANUAL_VERIFICATION_REQUIRED"
    | "FETCH_BLOCKED";
  legal_binding_status: "BINDING" | "INFORMATIONAL" | "CONTEXT_ONLY";
  runtime_use: {
    citation_reference: boolean;
    config_verification: boolean;
    source_hash_lock: boolean;
  };
  forbidden_use: {
    invented_default_values: boolean;
    placeholder_config: boolean;
    unversioned_report_generation: boolean;
    stale_certificate_price_assumption: boolean;
  };
}

// Registry — all known official CBAM sources
export const CBAM_OFFICIAL_SOURCE_REGISTRY: Record<string, CbamOfficialSource> = {
  "eu-commission-cbam-main": {
    source_id: "eu-commission-cbam-main",
    publisher: "European Commission",
    title: "CBAM main page — definitive regime status and official policy context",
    source_type: "REGULATORY_PUBLIC_SOURCE",
    official_source_url: "https://ec.europa.eu/commission/presscorner/detail/en/qanda_25_2632",
    required_for_unlock: true,
    version_label: "2025-Q4-definitive",
    publication_date: "2025-10-22",
    retrieved_at: null,
    sha256: null,
    retrieval_status: "MANUAL_VERIFICATION_REQUIRED",
    legal_binding_status: "CONTEXT_ONLY",
    runtime_use: {
      citation_reference: true,
      config_verification: false,
      source_hash_lock: false,
    },
    forbidden_use: {
      invented_default_values: true,
      placeholder_config: true,
      unversioned_report_generation: true,
      stale_certificate_price_assumption: true,
    },
  },
  "eu-commission-cbam-legislation": {
    source_id: "eu-commission-cbam-legislation",
    publisher: "European Commission",
    title: "CBAM legislation and guidance — default values, benchmarks, guidance index",
    source_type: "REGULATORY_PUBLIC_SOURCE",
    official_source_url: "https://ec.europa.eu/taxation_customs/carbon-border-adjustment-mechanism_en",
    required_for_unlock: true,
    version_label: "2025-Q4-definitive",
    publication_date: "2025-10-01",
    retrieved_at: null,
    sha256: null,
    retrieval_status: "MANUAL_VERIFICATION_REQUIRED",
    legal_binding_status: "INFORMATIONAL",
    runtime_use: {
      citation_reference: true,
      config_verification: true,
      source_hash_lock: false,
    },
    forbidden_use: {
      invented_default_values: true,
      placeholder_config: true,
      unversioned_report_generation: true,
      stale_certificate_price_assumption: true,
    },
  },
  "eur-lex-2025-2621": {
    source_id: "eur-lex-2025-2621",
    publisher: "Official Journal of the European Union",
    title: "Commission Implementing Regulation (EU) 2025/2621 — definitive-period default values",
    source_type: "REGULATORY_BINDING_LEGAL_SOURCE",
    official_source_url: "https://eur-lex.europa.eu/eli/reg_impl/2025/2621",
    required_for_unlock: true,
    version_label: "2025-2621-definitive",
    publication_date: "2025-11-28",
    retrieved_at: null,
    sha256: null,
    retrieval_status: "FETCH_BLOCKED",
    legal_binding_status: "BINDING",
    runtime_use: {
      citation_reference: true,
      config_verification: true,
      source_hash_lock: true,
    },
    forbidden_use: {
      invented_default_values: true,
      placeholder_config: true,
      unversioned_report_generation: true,
      stale_certificate_price_assumption: true,
    },
  },
};

export const REQUIRED_UNLOCK_SOURCE_IDS: string[] = Object.entries(
  CBAM_OFFICIAL_SOURCE_REGISTRY
)
  .filter(([_, s]) => s.required_for_unlock)
  .map(([id, _]) => id);

/** Source lock summary from the on-disk lock file (or null). */
export interface CbamSourceLock {
  exists: boolean;
  required_sources_locked: boolean;
  binding_source_locked: boolean;
  source_hashes_present: boolean;
  retrieved_at: string | null;
  lock_path: string;
}
