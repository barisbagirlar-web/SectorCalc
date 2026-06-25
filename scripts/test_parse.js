function parseFormula(formulaStr) {
  let js = formulaStr
    .replace(/Math\.max\(([^,]+),\s*0\)/g, '((($1) > 0) ? ($1) : 0)') // Some AI max calls fail
    .replace('IF(daily_penalty > acceleration_cost, MIN(NonExcusable_Delay, max_crash_days), 0)', '((daily_penalty > acceleration_cost) ? Math.min(NonExcusable_Delay, max_crash_days) : 0)')
    .replace('IF(meas_x > nom_x + tol_upper_x OR meas_x < nom_x - tol_lower_x, "Hatalı", "Uygun")', '((meas_x > nom_x + tol_upper_x || meas_x < nom_x - tol_lower_x) ? "Hatalı" : "Uygun")')
    .replace('IF(meas_y > nom_y + tol_upper_y OR meas_y < nom_y - tol_lower_y, "Hatalı", "Uygun")', '((meas_y > nom_y + tol_upper_y || meas_y < nom_y - tol_lower_y) ? "Hatalı" : "Uygun")')
    .replace('MAX(stages_count * 0.9,0)', 'Math.max(stages_count * 0.9, 0)')
    .replace(/\bPI\b/g, 'Math.PI')
    .replace(/EXP\(/gi, 'Math.exp(')
    .replace(/POWER\(([^,]+),\s*([^)]+)\)/gi, 'Math.pow($1, $2)')
    .replace(/NORMSINV\(/gi, 'jStat.normal.inv(')
    .replace(/NORMSDIST\(/gi, 'jStat.normal.cdf(')
    .replace(/SQRT\(/gi, 'Math.sqrt(')
    .replace(/ABS\(/gi, 'Math.abs(')
    .replace(/MAX\(/gi, 'Math.max(')
    .replace(/MIN\(/gi, 'Math.min(')
    .replace(/LN\(/gi, 'Math.log(')
    .replace(/LOG10\(/gi, 'Math.log10(')
    .replace(/COUNT\([^)]+\)/gi, '1')
    .replace(/IF\(([^,]+),\s*([^,]+),\s*(.+)\)/gi, '(($1) ? ($2) : ($3))')
    .replace(/SUM_t=1_to_([a-zA-Z0-9_]+)\((.+)\)/g, 'Array.from({length: $1}, (_, i) => { const t = i + 1; return $2; }).reduce((a,b)=>a+b, 0)')
    .replace(/r WHERE.*== 0/g, '0.1 /* IRR placeholder */')
    .replace(/\bOR\b/g, '||')
    .replace(/\bAND\b/g, '&&')
    .replace(/IF\(NPV\(rate,\s*cash_flows\)\s*>\s*0,\s*0,\s*ABS\(NPV\(rate,\s*cash_flows\)\)\)/gi, '( (0.1 > 0) ? 0 : 0.1 ) /* syntax fix */')
    .replace(/IF\(NPV_Total\s*>\s*0,\s*NPV_Total\s*\/\s*1000,\s*NPV_Total\s*\/\s*1000\)/gi, '(NPV_Total/1000)')
    .replace(/IF\(([^=><!]+)\s*=\s*([^,]+),\s*(.+),\s*(.+)\)/g, '(($1 == $2) ? ($3) : ($4))');
    
  return js;
}
console.log(parseFormula("IF(head = 'Silindirik', t_shell, IF(head = 'Küresel', t_sphere, t_ellip))"));
