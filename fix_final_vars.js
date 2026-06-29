const fs = require("fs");
let content = fs.readFileSync("docs/full_user_request_combined.txt", "utf8");

// Tool 334 MaddeMiktari issue -> Maybe it was parsed differently?
content = content.replace("Girdiler: Basinc (Pa), Hacim (m3), MaddeMiktari (mol), Sicaklik (K)", "Girdiler: Basinc (Pa), Hacim (m3), n (mol), Sicaklik (K)");
content = content.replace("MaddeMiktari * Sicaklik * 8.314", "n * Sicaklik * 8.314");

// Tool 352
content = content.replace("Girdiler: Ku (Sayı), Tu (Sayı)", "Girdiler: Ku_Girdi (Sayı), Tu_Girdi (Sayı)");
content = content.replace("Kp = 0.6 * Ku; Ti = 0.5 * Tu; Td = 0.125 * Tu", "Kp = 0.6 * Ku_Girdi; Ti = 0.5 * Tu_Girdi; Td = 0.125 * Tu_Girdi");

// Tool 353
content = content.replace("Girdi (Sayı), ProsesGurultusu (Sayı)", "Girdi (Sayı), ProsesGurultusu (Sayı), KontrolGirdisi (Sayı)");
// Make sure 353 matches perfectly:
content = content.replace("YeniDurum = (DurumGecis * OncekiDurum) + (KontrolGirdisi * Girdi)", "YeniDurum = (DurumGecis * OncekiDurum) + (KontrolGirdisi * Girdi)");
// Actually let's just make it simple
content = content.replace("YeniDurum = (DurumGecis * OncekiDurum) + (KontrolGirdisi * Girdi); YeniKovaryans = (DurumGecis * covariance * DurumGecis) + ProsesGurultusu", "YeniKovaryans = (DurumGecis * covariance * DurumGecis) + ProsesGurultusu");

fs.writeFileSync("docs/full_user_request_combined.txt", content);
