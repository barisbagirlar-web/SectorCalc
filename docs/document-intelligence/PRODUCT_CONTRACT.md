# Maintenance BOM Recovery — Product Contract

## Commercial Name

Maintenance BOM Recovery

## Primary Product Line

Verified BOM Job

## Public Price

USD 149 per accepted job

## Included Allowances

| Parameter | Limit |
|---|---|
| Source PDFs | 1 |
| PDF pages | ≤ 50 |
| Extracted BOM rows | ≤ 500 |
| Document type | Native/digital PDF only |
| Language | English (v1) |
| Output retention | 7 days |
| Source retention | 24 hours (auto-deleted after output) |

## Included Deliverables

A successful paid job must deliver:

1. **PDF Extraction** — Full BOM/parts table extraction from source document
2. **Part-Number Normalization** — Deterministic normalization with raw value preservation
3. **Duplicate Detection** — 7 classes of duplicate detection
4. **Missing-Field Detection** — Required field identification with severity classification
5. **Revision Conflict Detection** — Cross-row revision comparison
6. **Source-Page Traceability** — Every exported row links to source page
7. **ERP-Ready Excel Schema** — 8-sheet workbook with frozen headers, autofilter, formula protection
8. **Procurement Exception Report** — 7-sheet priority-ordered exception analysis

## Downloadable Artifacts

| Filename | Format | Description |
|---|---|---|
| `SectorCalc_Maintenance_BOM_{jobId}.xlsx` | XLSX | 8-sheet ERP-ready workbook |
| `SectorCalc_Procurement_Exception_Report_{jobId}.xlsx` | XLSX | 7-sheet procurement exception report |
| `SectorCalc_Source_Map_{jobId}.csv` | CSV | Row-level source traceability |
| `SectorCalc_Processing_Summary_{jobId}.html` | HTML | Printable processing summary |

## Not Included (v1)

- Generic PDF-to-Excel conversion
- Guaranteed engineering verification
- Direct SAP/Oracle/ERP integration
- Official OEM data
- Error-free automated procurement
- Human engineering approval
- Replacement for user review
- Non-English documents
- Scanned/image-only PDFs
- Handwritten annotations

## Required Disclaimer

> "Automated extraction and consistency checks support data preparation. The customer must review flagged and business-critical records before ERP import, RFQ issuance, purchasing, maintenance, or engineering use."

## Prohibited Marketing Claims

- "Fully verified"
- "100% accurate"
- "Ready for direct import without review"
- "Engineering approved"
- "Direct SAP/Oracle/ERP Integration"
- Customer logos, testimonials, usage counts, accuracy percentages, or savings claims without verified data
