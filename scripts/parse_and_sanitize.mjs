import fs from 'fs';
import path from 'path';

const file1 = path.resolve('./gemını free 191-359 .txt');
const file2 = path.resolve('./gemını_free_359_359.txt');

import JSON5 from 'json5';

function robustParse(rawData, fileName) {
    // Aggressive cleaning of non-printable control characters except newline, tab, return
    let cleaned = rawData.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
    
    // Flatten to single line to prevent "invalid character '\\n'" inside string literals
    cleaned = cleaned.replace(/\n/g, ' ').replace(/\r/g, '');
    
    // Array wrap if multiple roots exist
    let fixed = cleaned.trim();
    if (fixed.startsWith('{') && fixed.endsWith('}')) {
        fixed = fixed.replace(/}\s*\{/g, '},{');
        fixed = '[' + fixed + ']';
    }

    try {
        return JSON5.parse(fixed);
    } catch(e) {
        // Fallback array wrapping attempt if JSON5 fails
        try {
            return JSON5.parse('[' + fixed + ']');
        } catch (e2) {
            console.error(`JSON5 Unrecoverable error in ${fileName}:`, e.message);
            throw e;
        }
    }
}

function loadAndParse(file) {
    if (!fs.existsSync(file)) {
        console.error(`File not found: ${file}`);
        return [];
    }
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = robustParse(raw, path.basename(file));
    
    let extractedTools = [];
    if (Array.isArray(parsed)) {
        parsed.forEach(batchObj => {
            Object.keys(batchObj).forEach(key => {
                if (Array.isArray(batchObj[key])) {
                    extractedTools = extractedTools.concat(batchObj[key]);
                }
            });
        });
    } else {
        Object.keys(parsed).forEach(key => {
            if (Array.isArray(parsed[key])) {
                extractedTools = extractedTools.concat(parsed[key]);
            }
        });
    }
    return extractedTools;
}

console.log("=== TYPE 1: DEEP SANITIZATION & PARSING ===");

try {
    const tools1 = loadAndParse(file1);
    console.log(`[PASS] ${path.basename(file1)} parsed. Found ${tools1.length} tools.`);
    
    const tools2 = loadAndParse(file2);
    console.log(`[PASS] ${path.basename(file2)} parsed. Found ${tools2.length} tools.`);
    
    const totalTools = tools1.length + tools2.length;
    console.log(`\n[SUCCESS] RAM aktarımı tamamlandı! Total İşlenebilir Araç (Tam Veri): ${totalTools}`);
    
    // Test for first tool of second file
    const sample = tools2[0];
    if (sample) {
        console.log(`\nÖrneklem (Set 2): ${sample.tool_id} - ${sample.tool_name}`);
        console.log(`Inputs:`, sample.inputs.map(i => i.name).join(', '));
        console.log(`Warnings Count:`, sample.engine_rules?.smart_warnings?.length || 0);
    }
} catch (err) {
    console.error("\n[FAIL] Veri Recovery Başarısız:", err.message, err.stack);
}
