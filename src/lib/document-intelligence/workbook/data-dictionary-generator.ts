/**
 * Data Dictionary HTML Generator
 *
 * Produces a self-contained, human-readable HTML document that defines every
 * field in the canonical BomRow schema with business meaning, data type,
 * validation rules, blocking behaviour, source traceability, and known
 * limitations.
 *
 * This dictionary is the single source of truth for consumers of the
 * Maintenance BOM Recovery output (ERP teams, procurement, engineering).
 */

/* ── Field Contract ───────────────────────────────────────────── */

export interface DataDictionaryField {
  fieldName: string;
  businessMeaning: string;
  sourceField: string;
  normalizedField: string;
  dataType: string;
  required: boolean;
  allowedValues: string;
  validationRule: string;
  blockingBehavior: string;
  sourceTraceabilityRule: string;
  knownLimitations: string;
}

/* ── BomRow Schema Definition ─────────────────────────────────── */

const BOM_ROW_FIELDS: DataDictionaryField[] = [
  {
    fieldName: "itemNumber",
    businessMeaning: "Sequential row identifier assigned during extraction. Uniquely identifies each record within a single job output.",
    sourceField: "Auto-generated (extraction ordinal)",
    normalizedField: "itemNumber",
    dataType: "integer",
    required: true,
    allowedValues: "1 to n (positive integer)",
    validationRule: "Must be a positive integer. Must be unique within the job output. No gaps guaranteed.",
    blockingBehavior: "Non-blocking. Duplicate itemNumber triggers a review flag.",
    sourceTraceabilityRule: "Ordinal of extraction, aligned with sourcePage and sourceRow.",
    knownLimitations: "Re-extraction may reassign itemNumbers. Not a persistent identifier across job runs.",
  },
  {
    fieldName: "partNumberRaw",
    businessMeaning: "Part number exactly as extracted from the source PDF, before any normalisation or cleanup.",
    sourceField: "OCR / PDF-extracted text (source table column)",
    normalizedField: "partNumberNormalized",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Any printable ASCII or Unicode string",
    validationRule: "Stored verbatim. Leading/trailing whitespace trimmed. Empty string promoted to null.",
    blockingBehavior: "Non-blocking if null (review_required). Blocking only if missing on a business-critical record per customer policy.",
    sourceTraceabilityRule: "Directly from sourceDocument, sourcePage, sourceTable, sourceRow coordinates.",
    knownLimitations: "OCR errors, mixed fonts, special characters, and ligatures may produce incorrect raw values. Always verify against source image.",
  },
  {
    fieldName: "partNumberNormalized",
    businessMeaning: "Part number after application of normalisation rules: whitespace collapsing, character mapping, prefix/suffix stripping, and formatting standardisation.",
    sourceField: "partNumberRaw",
    normalizedField: "partNumberNormalized (same field)",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Standardised alphanumeric with optional delimiters",
    validationRule: "Normalisation rules applied in deterministic order. Null if partNumberRaw was null. Must match comparisonKey pattern.",
    blockingBehavior: "Non-blocking if null (review_required). Non-blocking if normalisation produces warnings.",
    sourceTraceabilityRule: "Derived from partNumberRaw via normalisation pipeline. AppliedRules field in NormalizedPart document lists each transformation.",
    knownLimitations: "Normalisation may merge distinct part numbers that differ only in vendor-specific formatting. Review flagged records.",
  },
  {
    fieldName: "descriptionRaw",
    businessMeaning: "Part description exactly as extracted from the source PDF, before normalisation.",
    sourceField: "OCR / PDF-extracted text (source table column)",
    normalizedField: "descriptionNormalized",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Any printable ASCII or Unicode string",
    validationRule: "Stored verbatim. Whitespace trimmed. Empty string promoted to null.",
    blockingBehavior: "Non-blocking if null (review_required).",
    sourceTraceabilityRule: "Directly from source coordinates (page, table, row).",
    knownLimitations: "OCR may produce garbled descriptions for poor-quality scans, handwriting, or mixed languages.",
  },
  {
    fieldName: "descriptionNormalized",
    businessMeaning: "Description after whitespace normalisation and character mapping. May include standardised abbreviations.",
    sourceField: "descriptionRaw",
    normalizedField: "descriptionNormalized (same field)",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Standardised text string",
    validationRule: "Whitespace collapsed. Unicode normalised (NFC). Null if descriptionRaw was null.",
    blockingBehavior: "Non-blocking if null (review_required).",
    sourceTraceabilityRule: "Derived from descriptionRaw. AppliedRules list available in normalisation metadata.",
    knownLimitations: "Semantic normalisation (synonym resolution) is NOT applied. Different descriptions for the same part may remain.",
  },
  {
    fieldName: "quantity",
    businessMeaning: "Number of units required per BOM line item, as extracted from the source document.",
    sourceField: "Source PDF table column (e.g., Qty, Count, Quantity)",
    normalizedField: "quantity",
    dataType: "number (nullable, decimal)",
    required: false,
    allowedValues: "Positive number. Zero is permitted (triggers review). Negative values are invalid and promoted to null with a validation flag.",
    validationRule: "Must be a finite positive number or zero. Non-numeric extracted values set to null. Decimal precision preserved through processing.",
    blockingBehavior: "Null quantity triggers review_required. Negative values blocked with validation flag. Zero allowed with warning.",
    sourceTraceabilityRule: "Direct extraction from source cell at sourcePage, sourceTable, sourceRow.",
    knownLimitations: "OCR may confuse '1' and 'I', or miss decimal separators. Quantities in non-standard formats (e.g., fractions) are not parsed.",
  },
  {
    fieldName: "unit",
    businessMeaning: "Unit of measure for the quantity (e.g., EA, KG, M, L, SET).",
    sourceField: "Source PDF table column (UOM, Unit)",
    normalizedField: "unit",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Standardised UOM string or null",
    validationRule: "Whitespace trimmed. Empty string promoted to null. No unit normalisation applied (EA remains EA, not each).",
    blockingBehavior: "Non-blocking if null (review_required).",
    sourceTraceabilityRule: "Direct from source cell. No cross-referencing against UOM standards.",
    knownLimitations: "Mixed abbreviations (EA, PC, each) are not unified. Unit may be absent in source BOM.",
  },
  {
    fieldName: "material",
    businessMeaning: "Material specification or material grade as extracted (e.g., Stainless Steel 316, C45, PTFE).",
    sourceField: "Source PDF table column (Material, Spec, Grade)",
    normalizedField: "material",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Free-text material description or null",
    validationRule: "Whitespace trimmed. Empty string promoted to null. No material database cross-referencing.",
    blockingBehavior: "Non-blocking if null. May be flagged review_required if material is critical per customer policy.",
    sourceTraceabilityRule: "Direct from source cell at source coordinates.",
    knownLimitations: "Material may be specified elsewhere (title block, general notes) and not captured per-row. No material standardisation.",
  },
  {
    fieldName: "manufacturer",
    businessMeaning: "Original Equipment Manufacturer (OEM) or brand name as extracted.",
    sourceField: "Source PDF table column (Manufacturer, Brand, OEM)",
    normalizedField: "manufacturer",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Free-text manufacturer name or null",
    validationRule: "Whitespace trimmed. Empty string promoted to null. No manufacturer database matching.",
    blockingBehavior: "Non-blocking if null. Review_required flagged if manufacturer is considered critical.",
    sourceTraceabilityRule: "Direct from source cell.",
    knownLimitations: "Manufacturer may be abbreviated inconsistently (e.g., 'SIEMENS' vs 'Siemens AG'). No cross-reference.",
  },
  {
    fieldName: "manufacturerPartNumber",
    businessMeaning: "Manufacturer-assigned part number, distinct from the internal part number.",
    sourceField: "Source PDF table column (Mfr Part No, MPN)",
    normalizedField: "manufacturerPartNumber",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Free-text MPN string or null",
    validationRule: "Whitespace trimmed. Empty string promoted to null. No normalisation applied.",
    blockingBehavior: "Non-blocking if null.",
    sourceTraceabilityRule: "Direct from source cell.",
    knownLimitations: "May be identical to part number in some BOMs. Not validated against manufacturer databases.",
  },
  {
    fieldName: "revision",
    businessMeaning: "Engineering revision, version, or drawing revision identifier.",
    sourceField: "Source PDF table column (Rev, Revision, Version)",
    normalizedField: "revision",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Free-text revision identifier or null",
    validationRule: "Whitespace trimmed. Empty string promoted to null. No revision scheme normalisation.",
    blockingBehavior: "Non-blocking if null. Mixed revisions for same part number trigger revision conflict detection.",
    sourceTraceabilityRule: "Direct from source cell. Conflicts detected across rows with same partNumberNormalized.",
    knownLimitations: "Alphanumeric revision schemes (Rev A, Rev 1.0, -001) are not normalised. Comparative logic requires manual review.",
  },
  {
    fieldName: "equipment",
    businessMeaning: "Equipment or asset tag that this BOM line item belongs to.",
    sourceField: "Source PDF table column (Equipment, Asset, Tag)",
    normalizedField: "equipment",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Free-text equipment identifier or null",
    validationRule: "Whitespace trimmed. Empty string promoted to null. No equipment master validation.",
    blockingBehavior: "Non-blocking if null.",
    sourceTraceabilityRule: "Direct from source cell.",
    knownLimitations: "Equipment may be captured inconsistently. No cross-reference against asset register.",
  },
  {
    fieldName: "subassembly",
    businessMeaning: "Subassembly or functional group identifier within the equipment.",
    sourceField: "Source PDF table column (Subassembly, Assembly, Section)",
    normalizedField: "subassembly",
    dataType: "string (nullable)",
    required: false,
    allowedValues: "Free-text subassembly identifier or null",
    validationRule: "Whitespace trimmed. Empty string promoted to null.",
    blockingBehavior: "Non-blocking if null.",
    sourceTraceabilityRule: "Direct from source cell.",
    knownLimitations: "Hierarchy depth beyond one-level not supported. No parent-child relationship validation.",
  },
  {
    fieldName: "sourceDocument",
    businessMeaning: "Filename of the original source PDF document from which this row was extracted.",
    sourceField: "Upload metadata (original filename)",
    normalizedField: "sourceDocument (immutable)",
    dataType: "string",
    required: true,
    allowedValues: "Sanitised original filename string",
    validationRule: "Must be non-empty. Stored as sanitised basename. Source document sensitivity level preserved.",
    blockingBehavior: "Blocking if empty — a row must be traceable to a source document.",
    sourceTraceabilityRule: "Job-level source document metadata. Immutable after extraction.",
    knownLimitations: "Same filename may appear from different uploads; job-level isolation must be verified.",
  },
  {
    fieldName: "sourcePage",
    businessMeaning: "Page number (1-indexed) within the source PDF where this row was found.",
    sourceField: "Extraction engine (PDF page number during OCR/parsing)",
    normalizedField: "sourcePage",
    dataType: "integer",
    required: true,
    allowedValues: "1 to total page count of source PDF",
    validationRule: "Must be a positive integer not exceeding the source document page count.",
    blockingBehavior: "Blocking if missing or out of range — page provenance is non-negotiable.",
    sourceTraceabilityRule: "Extraction engine page counter, aligned with PDF page numbering.",
    knownLimitations: "PDF internal page numbering may differ from printed page numbers. SourcePage reflects PDF ordinal, not printed number.",
  },
  {
    fieldName: "sourceTable",
    businessMeaning: "Identifier of the table on the source page from which this row was extracted (e.g., 'Table 1', 'Table A').",
    sourceField: "Extraction engine (table detection index)",
    normalizedField: "sourceTable",
    dataType: "string",
    required: true,
    allowedValues: "String identifier assigned by extraction engine",
    validationRule: "Must be non-empty. Unique per (sourceDocument, sourcePage) pair.",
    blockingBehavior: "Blocking if empty — table provenance must be preserved.",
    sourceTraceabilityRule: "Table detection algorithm assigns identifier during extraction.",
    knownLimitations: "Table numbering is engine-assigned and may not correspond to visual table numbers in the PDF.",
  },
  {
    fieldName: "sourceRow",
    businessMeaning: "Row index (1-indexed) within the source table.",
    sourceField: "Extraction engine (table row position)",
    normalizedField: "sourceRow",
    dataType: "integer",
    required: true,
    allowedValues: "1 to n (positive integer, unique per source table)",
    validationRule: "Must be a positive integer.",
    blockingBehavior: "Blocking if missing — each extracted row must be positionally traceable.",
    sourceTraceabilityRule: "Ordinal position within sourceTable on sourcePage.",
    knownLimitations: "Merged cells or irregular table layouts may cause sourceRow to not align with visual row position.",
  },
  {
    fieldName: "confidence",
    businessMeaning: "Extraction confidence score (0.0–1.0) representing the engine's certainty about the overall accuracy of this row.",
    sourceField: "Extraction engine (per-row confidence aggregate)",
    normalizedField: "confidence",
    dataType: "number (float, 0.0–1.0)",
    required: true,
    allowedValues: "0.0 (lowest confidence) to 1.0 (highest confidence)",
    validationRule: "Clamped to [0.0, 1.0]. NaN or Infinity treated as 0.0. Threshold for low_confidence: < 0.6.",
    blockingBehavior: "Non-blocking. Confidence < 0.6 triggers lowConfidenceCount in summary and review_required flag.",
    sourceTraceabilityRule: "Computed by extraction engine per field then aggregated per row.",
    knownLimitations: "Confidence is a statistical estimate, not a guarantee of correctness. High-confidence rows may still contain errors.",
  },
  {
    fieldName: "validationStatus",
    businessMeaning: "Aggregate validation outcome for this row after all validation checks.",
    sourceField: "Computed by validation pipeline",
    normalizedField: "validationStatus",
    dataType: "enum: 'clean' | 'review_required' | 'blocked'",
    required: true,
    allowedValues: "clean, review_required, blocked",
    validationRule: "Must be one of the three allowed values. 'blocked' takes precedence over 'review_required'.",
    blockingBehavior: "'blocked' rows prevent export to clean BOM. 'review_required' rows are exported to the Review Required sheet.",
    sourceTraceabilityRule: "Aggregated from all validation rule outcomes (missing fields, duplicates, revisions, confidence, export disposition).",
    knownLimitations: "Status is computed deterministically. Re-validation may change status if rules are modified or source data corrected.",
  },
  {
    fieldName: "validationFlags",
    businessMeaning: "Array of human-readable flag strings detailing specific validation issues found on this row.",
    sourceField: "Computed by validation pipeline",
    normalizedField: "validationFlags",
    dataType: "array of strings",
    required: true,
    allowedValues: "Zero or more descriptive flag strings",
    validationRule: "Must be an array. Empty array means no flags. Each flag must be a non-empty string.",
    blockingBehavior: "Non-blocking (flags are informational). Flags may accompany any validationStatus.",
    sourceTraceabilityRule: "Each validation rule appends one or more flags when triggered.",
    knownLimitations: "Flags are human-readable and may change between engine versions for the same condition.",
  },
  {
    fieldName: "reviewRequired",
    businessMeaning: "Boolean flag indicating that this row requires human review before ERP import or purchasing action.",
    sourceField: "Computed (derived from validationStatus)",
    normalizedField: "reviewRequired",
    dataType: "boolean",
    required: true,
    allowedValues: "true, false",
    validationRule: "true if validationStatus is 'review_required' or 'blocked'. false otherwise.",
    blockingBehavior: "When true, row appears in the Review Required sheet and Exception Report.",
    sourceTraceabilityRule: "Derived from validationStatus. Always aligned.",
    knownLimitations: "Manual override of reviewRequired is not supported through the standard pipeline.",
  },
  {
    fieldName: "exportDisposition",
    businessMeaning: "Final export decision for this row after duplicate analysis and validation.",
    sourceField: "Computed by export-disposition engine",
    normalizedField: "exportDisposition",
    dataType: "enum: 'clean' | 'review_required' | 'excluded_duplicate'",
    required: true,
    allowedValues: "clean, review_required, excluded_duplicate",
    validationRule: "Must be one of the three allowed values. 'excluded_duplicate' rows are excluded from the clean BOM.",
    blockingBehavior: "'excluded_duplicate' rows are excluded from the Clean BOM but remain in the Source Map. 'review_required' rows are in the Review Required sheet.",
    sourceTraceabilityRule: "Duplicate groups, missing field analysis, and validation status are aggregated into disposition.",
    knownLimitations: "Disposition is algorithmic. Business rules (e.g., 'always keep manufacturer-specific duplicates') are not applied.",
  },
];

/* ── HTML Generator ───────────────────────────────────────────── */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generateDataDictionaryHtml(
  fields: DataDictionaryField[],
  version: string,
): string {
  const effectiveFields = fields.length > 0 ? fields : BOM_ROW_FIELDS;
  const generatedAt = new Date().toISOString();

  const rows = effectiveFields
    .map(
      (f) => `
    <tr>
      <td><code>${escapeHtml(f.fieldName)}</code></td>
      <td>${escapeHtml(f.businessMeaning)}</td>
      <td>${escapeHtml(f.sourceField)}</td>
      <td>${escapeHtml(f.normalizedField)}</td>
      <td>${escapeHtml(f.dataType)}</td>
      <td>${f.required ? "Yes" : "No"}</td>
      <td>${escapeHtml(f.allowedValues)}</td>
      <td>${escapeHtml(f.validationRule)}</td>
      <td>${escapeHtml(f.blockingBehavior)}</td>
      <td>${escapeHtml(f.sourceTraceabilityRule)}</td>
      <td>${escapeHtml(f.knownLimitations)}</td>
    </tr>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SectorCalc — Data Dictionary (schema v${escapeHtml(version)})</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #F0EEE6;
      color: #1A1915;
      line-height: 1.5;
      padding: 2rem;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
    .subtitle { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      font-size: 0.8125rem;
    }
    th, td {
      text-align: left;
      padding: 0.5rem 0.625rem;
      border: 1px solid #D4D2C8;
      vertical-align: top;
    }
    th {
      background: #1A1915;
      color: #F0EEE6;
      font-weight: 500;
      white-space: nowrap;
    }
    tr:nth-child(even) { background: #F9F8F4; }
    code {
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
      font-size: 0.8em;
      background: #E8E6DE;
      padding: 0.1em 0.3em;
      border-radius: 2px;
    }
    .version-badge {
      display: inline-block;
      background: #BD5D3A;
      color: #fff;
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      margin-left: 0.5rem;
      vertical-align: middle;
    }
    @media (max-width: 768px) {
      body { padding: 1rem; }
      table { font-size: 0.75rem; }
      th, td { padding: 0.375rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SectorCalc Maintenance BOM Recovery — Data Dictionary
      <span class="version-badge">v${escapeHtml(version)}</span>
    </h1>
    <p class="subtitle">Generated: ${escapeHtml(generatedAt)} &middot; Schema version: ${escapeHtml(version)}</p>
    <p style="margin-bottom:1.5rem;font-size:0.875rem;color:#444;">
      This document defines every field in the canonical BomRow output schema.
      All properties describe the schema contract for version ${escapeHtml(version)} of the
      Maintenance BOM Recovery product. Any field-level change in a future release
      will be reflected in a new version of this dictionary.
    </p>

    <table>
      <thead>
        <tr>
          <th>Field Name</th>
          <th>Business Meaning</th>
          <th>Source Field</th>
          <th>Normalized Field</th>
          <th>Data Type</th>
          <th>Required</th>
          <th>Allowed Values</th>
          <th>Validation Rule</th>
          <th>Blocking Behaviour</th>
          <th>Source Traceability</th>
          <th>Known Limitations</th>
        </tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

export { BOM_ROW_FIELDS };
