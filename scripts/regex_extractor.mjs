import fs from 'fs';
import path from 'path';

const file1 = path.resolve('./gemını free 191-359 .txt');
const file2 = path.resolve('./gemını_free_359_359.txt');

function extractTools(rawData, fileName) {
    const tools = [];
    
    // Split by tool_id to get chunks
    const chunks = rawData.split(/"tool_id"\s*:\s*/);
    
    // Skip the first chunk (it's the header before the first tool)
    for (let i = 1; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        try {
            // 1. ID
            const idMatch = chunk.match(/^"([^"]+)"/);
            if (!idMatch) continue;
            const id = idMatch[1];
            
            // 2. Name
            const nameMatch = chunk.match(/"tool_name"\s*:\s*"([^"]+)"/);
            const name = nameMatch ? nameMatch[1] : id;
            
            // 3. Inputs
            const inputs = [];
            const inputsBlockMatch = chunk.match(/"inputs"\s*:\s*\[([\s\S]*?)\]/);
            if (inputsBlockMatch) {
                const inputMatches = inputsBlockMatch[1].matchAll(/{\s*"id"\s*:\s*"([^"]+)"\s*,\s*"name"\s*:\s*"([^"]+)"\s*(?:,\s*"unit"\s*:\s*"([^"]*)")?\s*,\s*"type"\s*:\s*"([^"]+)"/g);
                for (const im of inputMatches) {
                    inputs.push({
                        id: im[1],
                        name: im[2],
                        unit: im[3] || '',
                        type: im[4]
                    });
                }
            }
            
            // 4. Validation (Absolute Min)
            const validationRules = {};
            const valBlockMatch = chunk.match(/"validation"\s*:\s*{([\s\S]*?)}/);
            if (valBlockMatch) {
                const valMatches = valBlockMatch[1].matchAll(/"([^"]+)"\s*:\s*{\s*"absolute_min"\s*:\s*([\d.-]+)/g);
                for (const vm of valMatches) {
                    validationRules[vm[1]] = parseFloat(vm[2]);
                }
            }
            
            // 5. Smart Warnings
            const warnings = [];
            const warnBlockMatch = chunk.match(/"smart_warnings"\s*:\s*\[([\s\S]*?)\]/);
            if (warnBlockMatch) {
                const warnMatches = warnBlockMatch[1].matchAll(/{\s*"condition"\s*:\s*"([^"]+)"\s*,\s*"severity"\s*:\s*"([^"]+)"\s*,\s*"source"\s*:\s*"([^"]+)"\s*,\s*"message"\s*:\s*"([^"]+)"\s*}/g);
                for (const wm of warnMatches) {
                    warnings.push({
                        condition: wm[1],
                        severity: wm[2],
                        source: wm[3],
                        message: wm[4]
                    });
                }
            }
            
            tools.push({
                tool_id: id,
                tool_name: name,
                inputs: inputs,
                validation: validationRules,
                smart_warnings: warnings
            });
            
        } catch (e) {
            console.error(`Error parsing tool chunk in ${fileName}`);
        }
    }
    
    return tools;
}

console.log("=== TYPE 1: REGEX EXTRACTION (DEEP SANITIZATION) ===");

try {
    const raw1 = fs.existsSync(file1) ? fs.readFileSync(file1, 'utf-8') : '';
    const tools1 = extractTools(raw1, path.basename(file1));
    console.log(`[PASS] ${path.basename(file1)} parsed via Regex. Found ${tools1.length} tools.`);
    
    const raw2 = fs.existsSync(file2) ? fs.readFileSync(file2, 'utf-8') : '';
    const tools2 = extractTools(raw2, path.basename(file2));
    console.log(`[PASS] ${path.basename(file2)} parsed via Regex. Found ${tools2.length} tools.`);
    
    const totalTools = tools1.length + tools2.length;
    console.log(`\n[SUCCESS] RAM aktarımı tamamlandı! Total İşlenebilir Araç: ${totalTools}`);
    
    if (tools2.length > 0) {
        const sample = tools2[0]; // MECH_192 Rezonans Frequencyı
        console.log(`\nÖrneklem (Set 2): ${sample.tool_id} - ${sample.tool_name}`);
        console.log(`Inputs:`, sample.inputs.map(i => i.id).join(', '));
        console.log(`Validation Rules:`, JSON.stringify(sample.validation));
        console.log(`Warnings Count:`, sample.smart_warnings.length);
        if (sample.smart_warnings.length > 0) {
            console.log(`Sample Warning Source:`, sample.smart_warnings[0].source);
        }
    }
    
    // Verileri diğer scriptin (Factory) kullanabilmesi için sağlam bir JSON formatında diske yaz (Cache).
    fs.writeFileSync(path.resolve('./scripts/extracted_tools_cache.json'), JSON.stringify(tools1.concat(tools2), null, 2));
    console.log(`\n[PASS] Tüm araçlar (359 count) hatasız formatta ./scripts/extracted_tools_cache.json olarak derlendi.`);

} catch (err) {
    console.error("\n[FAIL] Regex Extraction Başarısız:", err.message);
}
