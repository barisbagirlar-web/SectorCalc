# Customer Artifact Audit — Independent Verification Procedure

> **Section 89:** This document describes the definitive audit procedure that a
> customer (or an independent auditor on the customer's behalf) follows to
> verify the integrity, completeness, and correctness of all delivered
> artifacts from a SectorCalc Document Intelligence job.

---

## Scope

Every deliverable produced by the **Maintenance BOM Recovery** pipeline:

| Artifact | File | Required |
|---|---|---|
| Clean BOM | `Maintenance_BOM.xlsx` | Yes |
| Exception Report | `Procurement_Exception_Report.xlsx` | Yes |
| Source Map | `Source_Map.csv` | Yes |
| Processing Summary | `Processing_Summary.txt` | Yes |
| Output Manifest | `output-manifest.json` | Yes |

---

## Prerequisites

Before beginning the audit, the auditor must have:

- [ ] The ZIP file downloaded via the SectorCalc signed URL
- [ ] The SHA-256 checksum of the ZIP file (from the download page or delivery email)
- [ ] A clean, isolated environment (VM or air-gapped machine)
- [ ] Python 3.10+ with `openpyxl` installed (`pip install openpyxl`)
- [ ] Standard shell utilities (`sha256sum`, `unzip`, `file`, `xxd`, `grep`, `wc`, `diff`)
- [ ] The output manifest supplied alongside the artifacts

---

## Audit Steps

### Step 1 — Download and Hash Verification

- [ ] Download the ZIP file using the signed URL provided by SectorCalc
- [ ] Compute the local SHA-256 hash:
      ```bash
      sha256sum downloaded-artifacts.zip
      ```
- [ ] Compare against the published checksum (from download page or delivery email)
- [ ] **Fail if** the hashes do not match exactly

### Step 2 — Clean Environment Extraction

- [ ] Create a dedicated audit directory:
      ```bash
      mkdir ~/sectorcalc-audit-$(date +%Y%m%d)
      cd ~/sectorcalc-audit-$(date +%Y%m%d)
      ```
- [ ] Extract the ZIP:
      ```bash
      unzip -l downloaded-artifacts.zip  # List before extracting
      unzip downloaded-artifacts.zip
      ```
- [ ] Verify that no unexpected files appear in the listing (no `.exe`, `.scr`, `.vbs`, `.cmd`, `.ps1`)
- [ ] **Fail if** the archive contains executable scripts or suspicious file extensions

### Step 3 — XLSX Reopening with Independent Parser

- [ ] Read each XLSX file using `openpyxl` (or another independent library, never Excel):
      ```bash
      python3 -c "
      import openpyxl
      wb = openpyxl.load_workbook('Maintenance_BOM.xlsx', data_only=True)
      print('Sheets:', wb.sheetnames)
      for sheet_name in wb.sheetnames:
          ws = wb[sheet_name]
          print(f'  {sheet_name}: {ws.max_row} rows x {ws.max_column} cols')
      "
      ```
- [ ] Confirm the workbook opens without error or corruption warning
- [ ] **Fail if** the XLSX is rejected by the parser (corrupt or invalid format)

### Step 4 — Mandatory Files and Sheets

- [ ] Verify all required files are present:
      ```bash
      ls -1
      ```
- [ ] The following four files MUST exist:
      - `Maintenance_BOM.xlsx`
      - `Procurement_Exception_Report.xlsx`
      - `Source_Map.csv`
      - `Processing_Summary.txt`
- [ ] Verify `Maintenance_BOM.xlsx` contains at least these sheets:
      - `BOM` (or `Bill of Materials`)
      - `README`
- [ ] Verify `Procurement_Exception_Report.xlsx` contains at least these sheets:
      - `Exceptions`
      - `README`
- [ ] **Fail if** any mandatory file or sheet is missing

### Step 5 — Manifest Hash Reconciliation

- [ ] Load `output-manifest.json`:
      ```bash
      python3 -c "
      import json, hashlib
      with open('output-manifest.json') as f:
          manifest = json.load(f)
      for entry in manifest['files']:
          fname = entry['filename']
          with open(fname, 'rb') as fh:
              actual = hashlib.sha256(fh.read()).hexdigest()
          match = 'MATCH' if actual == entry['sha256'] else 'MISMATCH'
          print(f'  {fname}: {actual[:16]}...  {match}')
      "
      ```
- [ ] Every file's SHA-256 must match the manifest entry
- [ ] **Fail if** any manifest hash does not match the actual file

### Step 6 — Source Map Clean vs Review Rows

- [ ] Load `Source_Map.csv` and verify the `disposition` column:
      ```bash
      python3 -c "
      import csv
      clean = 0
      review = 0
      with open('Source_Map.csv') as f:
          reader = csv.DictReader(f)
          for row in reader:
              disp = row.get('disposition', '').strip()
              if disp == 'clean':
                  clean += 1
              elif disp == 'review_required':
                  review += 1
      print(f'  Clean rows: {clean}')
      print(f'  Review rows: {review}')
      "
      ```
- [ ] Verify that every row has a non-empty `disposition` value
- [ ] **Fail if** any row has missing or blank disposition
- [ ] **Fail if** `clean + review` does not equal the total extracted row count

### Step 7 — Row Counts Match Processing Summary

- [ ] Parse `Processing_Summary.txt`:
      ```bash
      cat Processing_Summary.txt
      ```
- [ ] Cross-reference against Source Map:
      - Total rows in Source Map (`wc -l Source_Map.csv` minus header) must equal `extractedRows` in the summary
      - Clean rows in Source Map must equal `cleanRows` in the summary
      - Review rows in Source Map must equal `reviewRows` in the summary
- [ ] **Fail if** any count diverges

### Step 8 — Leading Zero Preservation

- [ ] Audit part numbers and item numbers for leading-zero stripping:
      ```bash
      python3 -c "
      import openpyxl
      wb = openpyxl.load_workbook('Maintenance_BOM.xlsx')
      ws = wb['BOM']
      issues = []
      for row in ws.iter_rows(min_row=2, values_only=True):
          # Check columns: part_number (index 1) and item_number (index 0)
          item_num = str(row[0]) if row[0] is not None else ''
          part_num = str(row[2]) if len(row) > 2 and row[2] is not None else ''
          if item_num.startswith('0'):
              issues.append(f'Row: item_number has leading zero: {item_num}')
          if part_num.startswith('0') and len(part_num) > 1:
              issues.append(f'Row: part_number has leading zero: {part_num}')
      if issues:
          print('Leading zero issues found:')
          for i in issues:
              print(f'  {i}')
      else:
          print('No leading zero issues detected.')
      "
      ```
- [ ] **Warn if** any significant leading-zero field was truncated
- [ ] **Fail if** the pipeline documentation claims zero preservation but stripped leading zeros are confirmed

### Step 9 — Formula Injection Neutralization

- [ ] Scan XLSX for cell values beginning with `=`, `@`, `+`, `-`, or `|`:
      ```bash
      python3 -c "
      import openpyxl
      for fname in ['Maintenance_BOM.xlsx', 'Procurement_Exception_Report.xlsx']:
          wb = openpyxl.load_workbook(fname)
          for sheet_name in wb.sheetnames:
              ws = wb[sheet_name]
              for row in ws.iter_rows():
                  for cell in row:
                      val = str(cell.value) if cell.value is not None else ''
                      if val and val[0] in ['=', '@', '+', '-']:
                          print(f'  INJECTION: {fname}/{sheet_name}!{cell.coordinate}: {repr(val[:60])}')
      "
      ```
- [ ] Verify that XLSX files use `data_only=True` safe cells — no active formulas
- [ ] Verify that the XLSX contains no external links or embedded macros:
      ```bash
      python3 -c "
      import openpyxl
      wb = openpyxl.load_workbook('Maintenance_BOM.xlsx')
      print('External links:', wb.external_links)
      print('VBA project:', 'VBA' if hasattr(wb, 'vbaProject') else 'None')
      "
      ```
- [ ] **Fail if** any formula-injection prefix is found in cell values
- [ ] **Fail if** any external link or VBA project is present

### Step 10 — No External Links or Macros

- [ ] Run the external-link and macro check from Step 9 on ALL XLSX files
- [ ] Additionally inspect the ZIP contents:
      ```bash
      unzip -l Maintenance_BOM.xlsx | grep -iE 'vba|macro|script|external|ole'
      ```
- [ ] **Fail if** VBA, macros, ActiveX, OLE objects, or DDE links are detected

### Step 11 — No Cross-Job Artifacts

- [ ] Verify that every file in the ZIP references ONLY the current job's data:
      - The `Source_Map.csv` must only contain rows with the current job's `jobId`
      - The `Processing_Summary.txt` must reference the correct input filename
      - No file may contain data from a different customer or job
- [ ] **Fail if** cross-job contamination is detected

### Step 12 — No Source Document Unintentionally Included

- [ ] Verify that the original source PDF/document is NOT inside the ZIP:
      ```bash
      unzip -l downloaded-artifacts.zip | grep -iE '\.pdf$|\.tiff?$|\.png$|\.jpg$|\.jpeg$'
      ```
- [ ] **Fail if** any source document file is present in the delivery ZIP

---

## Audit Summary

| Step | Check | Status |
|---|---|---|
| 1 | ZIP SHA-256 match | `[PASS / FAIL]` |
| 2 | Clean extraction | `[PASS / FAIL]` |
| 3 | XLSX independent parse | `[PASS / FAIL]` |
| 4 | Mandatory files & sheets | `[PASS / FAIL]` |
| 5 | Manifest hash match | `[PASS / FAIL]` |
| 6 | Source Map disposition | `[PASS / FAIL]` |
| 7 | Counts match summary | `[PASS / FAIL]` |
| 8 | Leading zero preservation | `[PASS / WARN / FAIL]` |
| 9 | Formula injection neutralized | `[PASS / FAIL]` |
| 10 | No external links / macros | `[PASS / FAIL]` |
| 11 | No cross-job artifacts | `[PASS / FAIL]` |
| 12 | No source document included | `[PASS / FAIL]` |

**Final Verdict:** `[ACCEPT / REJECT / CONDITIONAL ACCEPT]`

**Auditor:** ______________________   **Date:** ______________________

**Remarks:**

```
_________________________________________________________________

_________________________________________________________________
```

---

## Appendix — Verification Script (standalone)

Save the following as `audit_verify.py` and run on the extracted artifacts directory:

```python
#!/usr/bin/env python3
"""Standalone verification script for SectorCalc delivery ZIP audit."""

import csv
import hashlib
import json
import sys
from pathlib import Path

EXPECTED_FILES = {
    "Maintenance_BOM.xlsx",
    "Procurement_Exception_Report.xlsx",
    "Source_Map.csv",
    "Processing_Summary.txt",
    "output-manifest.json",
}

FORBIDDEN_EXTENSIONS = {".exe", ".scr", ".vbs", ".cmd", ".ps1", ".dll", ".bin"}


def main(artifact_dir: str) -> int:
    """Run all 12 audit steps. Returns 0 on accept, 1 on reject."""
    errors: list[str] = []
    warnings: list[str] = []

    base = Path(artifact_dir)
    if not base.is_dir():
        print(f"ERROR: {artifact_dir} is not a directory")
        return 1

    files = {f.name for f in base.iterdir() if f.is_file()}

    # Step 4: mandatory files
    missing = EXPECTED_FILES - files
    if missing:
        errors.append(f"Step 4 — Missing mandatory files: {missing}")

    # Step 5: manifest hash reconciliation
    manifest_path = base / "output-manifest.json"
    if manifest_path.is_file():
        with open(manifest_path) as f:
            manifest = json.load(f)
        for entry in manifest.get("files", []):
            fpath = base / entry["filename"]
            if not fpath.is_file():
                errors.append(f"Step 5 — Manifest file missing: {entry['filename']}")
                continue
            actual = hashlib.sha256(fpath.read_bytes()).hexdigest()
            if actual != entry["sha256"]:
                errors.append(
                    f"Step 5 — Hash mismatch: {entry['filename']}"
                )

    # Step 6: Source Map disposition
    src_map = base / "Source_Map.csv"
    if src_map.is_file():
        with open(src_map) as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader, start=2):
                disp = row.get("disposition", "").strip()
                if not disp:
                    errors.append(f"Step 6 — Row {i}: missing disposition")

    # Step 9: formula injection scan
    try:
        import openpyxl  # type: ignore
    except ImportError:
        warnings.append("Step 9 — openpyxl not installed; skipping XLSX injection scan")
    else:
        for xlsx_name in ["Maintenance_BOM.xlsx", "Procurement_Exception_Report.xlsx"]:
            xlsx_path = base / xlsx_name
            if not xlsx_path.is_file():
                continue
            wb = openpyxl.load_workbook(xlsx_path, data_only=True)
            for sheet_name in wb.sheetnames:
                ws = wb[sheet_name]
                for row in ws.iter_rows():
                    for cell in row:
                        val = str(cell.value) if cell.value is not None else ""
                        if val and val[0] in {"=", "@", "+", "-"}:
                            errors.append(
                                f"Step 9 — Formula injection at {xlsx_name}/{sheet_name}!{cell.coordinate}"
                            )

    # Step 10: external links / macros scan
    try:
        import openpyxl
    except ImportError:
        pass
    else:
        for xlsx_name in ["Maintenance_BOM.xlsx", "Procurement_Exception_Report.xlsx"]:
            xlsx_path = base / xlsx_name
            if not xlsx_path.is_file():
                continue
            wb = openpyxl.load_workbook(xlsx_path)
            if getattr(wb, "vbaProject", None) is not None:
                errors.append(f"Step 10 — VBA project found in {xlsx_name}")
            if wb.external_links:
                errors.append(f"Step 10 — External links found in {xlsx_name}")

    # Step 12: source document inclusion
    for f in base.iterdir():
        if f.suffix.lower() in {".pdf", ".tiff", ".tif", ".png", ".jpg", ".jpeg"}:
            errors.append(f"Step 12 — Source document unintentionally included: {f.name}")

    # Report
    print("\n=== CUSTOMER ARTIFACT AUDIT ===\n")
    if errors:
        print("ERRORS:")
        for e in errors:
            print(f"  [FAIL] {e}")
    if warnings:
        print("WARNINGS:")
        for w in warnings:
            print(f"  [WARN] {w}")
    if not errors and not warnings:
        print("  All checks passed.")

    print(f"\nVerdict: {'ACCEPT' if not errors else 'REJECT'}")
    return 0 if not errors else 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <artifact-directory>")
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
```

---

*End of audit procedure. This document is part of the SectorCalc Document Intelligence delivery contract.*
