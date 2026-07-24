# SC-020 Assumptions (FS-ENGINE v2.1.0)

- All internal math is SI (mm, m/min, kW, N·m). Display units convert at entry with exact factors:
  - 1 in = 25.4 mm
  - 1 SFM = 0.3048 m/min
  - 1 HP = 0.7457 kW
  - 1 ft·lb = 1.3558 N·m
- Currency selector is a symbol only; no FX conversion.
- ISO 513 kc1/mc and Taylor C/n are reference-grade mid-band values. Calibrate against tooling-supplier datasheets for contract work.
- Coolant and interruption factors multiply Taylor tool life.
- Chip thinning: hm = fz * sqrt(ae/D); compensated feed holds mean chip thickness.
- Kienzle: kc = kc1 * hm^(-mc); Fc = kc * ap * hm.
- Spindle power includes machine efficiency eta.
- Deflection model: cantilever round tool; holders ignored.
- Ra model: geometric nose-radius approximation only.
- Engineering preview: not for production approval; not a substitute for measured data or a licensed engineer.
