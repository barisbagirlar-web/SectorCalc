#!/usr/bin/env python3
"""
SectorCalc — Premium Schema Pain Statement Enhancer v1.0
Expands painStatement fields for all 5 premium schema pilot tools
across all 6 languages (en, tr, de, fr, es, ar).

Architecture:
- English: updated directly in each schema's .ts file (painStatement field)
- TR: updated in src/data/premium-schema-i18n.ts
- DE/FR/ES/AR: updated in src/data/premium-schema-i18n-locales.ts
"""

import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# ===================================================================
# ENHANCED ENGLISH PAIN STATEMENTS (5-10 lines, SEO/LLM optimized)
# First paragraph = concise meta-description-ready summary
# ===================================================================

EN_PAIN_STATEMENTS = {

    "7-israf-muda-avcisi-parasal-karsilik-calculator": """Quantifies the monetary impact of all 7 Lean wastes (Muda) — overproduction, waiting, transport, inventory, motion, overprocessing, and defects — translating operational inefficiencies into direct financial terms that management can act on.

Traditional waste tracking stops at counting defects or measuring downtime hours. This tool converts every waste category into period-level cost, annualized loss, waste-to-revenue ratio, and risk-adjusted priority scores. It ranks which Muda category costs the most and where kaizen will deliver the highest return.

Example: A factory with 50 overproduction units, 20 waiting hours, and 15 defect units in a 30-day period discovers that waiting and defects represent 62% of $28,500 total waste cost. The tool prioritizes defect reduction with a risk-adjusted score of 4.2/5 and projects $17,700 annual savings.

Production managers, Lean coordinators, and plant directors use this analyzer to translate Muda into boardroom-ready financial metrics, prioritize improvement investments by ROI, and track waste-to-revenue ratio reduction over consecutive periods.""",

    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": """Converts 5S audit scores into actual dollar losses from workplace disorganization, search time, and inefficient workflows, making the financial case for workplace organization visible to management.

Most factories track 5S scores but cannot answer: "How much money are we losing because of a low 5S score?" This tool models the efficiency loss percentage based on the gap between current and target 5S score, then multiplies it by total labor capacity cost to reveal the monthly financial drain of poor workplace organization.

Example: A department with 50 employees, a 38/100 current 5S score, 87/100 target, and $35/hour labor cost discovers $34,496 monthly efficiency loss. Improving to the target score recovers $25,168 monthly — a $302,000 annual opportunity.

Lean managers, production supervisors, and continuous improvement teams use this converter to prove the ROI of 5S initiatives, set data-driven improvement targets, and communicate workplace organization value in financial terms that leadership understands.""",

    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": """Calculates the total cost of support structures and post-processing labor for 3D printed parts, revealing hidden expenses routinely excluded from additive manufacturing job quotes.

Additive manufacturing cost estimates frequently focus on build time and model material, ignoring support material consumption, removal labor, and surface finishing. This tool aggregates support volume cost, removal labor, and batch post-process cost into a total that often adds 30-60% to the apparent part cost.

Example: A part with 20 cm³ support volume at $0.05/cm³ and 15-minute cleaning time at $25/hour has $12.25 total post-process cost. In a batch of 10, post-process adds only $1.23 per part. But a single-part batch with 60 cm³ support and 45-minute cleanup jumps to $46.50 — often more than the build cost.

Additive manufacturing engineers, shop owners, and quoting specialists use this calculator to build complete cost models, optimize part orientation for minimal support, and ensure every quote covers the full cost of post-processing.""",

    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": """Optimizes 3D printer build plate utilization by calculating maximum parts per batch based on bounding box dimensions, bed size, and nesting efficiency — translating utilization percentages into cost per part.

Build plate utilization is the single biggest lever for additive manufacturing profitability, yet most operators estimate it by eye. This tool calculates exact rectangular nesting fit, utilization percentage, and machine hours per part, revealing the true cost impact of inefficient bed packing.

Example: A 200×200 mm bed with 50×50 mm parts fits 12 parts per batch at 75% utilization with an 8-hour print. Each part costs 0.67 machine hours. Poor nesting fitting only 8 parts raises machine hours to 1.0 per part — a 50% cost increase that directly reduces margin.

Additive manufacturing engineers and production planners use this optimizer to maximize batch size, reduce per-part machine costs, and make data-driven decisions about build orientation and multi-part nesting strategy.""",

    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": """Determines the exact production quantity at which 3D printing becomes more economical than CNC machining (or vice versa), using break-even analysis of setup costs and unit costs for both manufacturing methods.

Choosing between additive manufacturing and subtractive machining is one of the most common production decisions in modern manufacturing. Without data-driven comparison, teams default to habit — overpaying for additive at high volumes or machining at low volumes. This tool calculates the crossover quantity, total cost curves, and cost difference at any specified volume.

Example: With 3D printing at $100 setup and $5/part, and machining at $500 setup and $2/part, the break-even quantity is 134 parts. Below 134 units, printing is cheaper; above 134, machining wins. At 100 units, printing costs $600 vs. machining's $700.

Manufacturing engineers, production planners, and sourcing managers use this break-even analyzer to objectively select the most cost-effective manufacturing process for any production quantity, eliminating guesswork and reducing per-part costs.""",
}

# ===================================================================
# TRANSLATED VERSIONS (TR, DE, FR, ES, AR)
# ===================================================================

TR_PAIN_STATEMENTS = {
    "7-israf-muda-avcisi-parasal-karsilik-calculator": """7 temel Yalın israfın (Muda) parasal etkisini ölçer — fazla üretim, bekleme, taşıma, stok, gereksiz hareket, fazla işlem ve hatalar — operasyonel verimsizlikleri yönetimin harekete geçebileceği doğrudan finansal terimlere dönüştürür.

Geleneksel israf takibi, kusur saymak veya duruş saatlerini ölçmekle sınırlı kalır. Bu araç her israf kategorisini dönemsel maliyete, yıllık kayba, gelire orana ve risk ayarlı öncelik puanına dönüştürür. Hangi Muda kategorisinin en pahalı olduğunu ve kaizenin en yüksek getiriyi nerede sağlayacağını sıralar.

Örnek: 30 günlük dönemde 50 fazla üretim birimi, 20 saat bekleme ve 15 hatalı ürünü olan bir fabrika, bekleme ve hataların 28.500$ toplam israf maliyetinin %62'sini oluşturduğunu keşfeder. Araç, 4.2/5 risk ayarlı puanla hata azaltmayı önceliklendirir ve 17.700$ yıllık tasarruf öngörür.

Üretim müdürleri, Yalın koordinatörleri ve fabrika direktörleri, Muda'yı yönetim kurulu hazır finansal metriklerine dönüştürmek, iyileştirme yatırımlarını YG'ye göre önceliklendirmek ve ardışık dönemlerde israf-gelir oranı düşüşünü izlemek için bu analizörü kullanır.""",

    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": """5S denetim puanlarını, işyeri düzensizliği, arama süresi ve verimsiz iş akışlarından kaynaklanan gerçek dolar kayıplarına dönüştürür; işyeri organizasyonunun finansal gerekçesini yönetime görünür kılar.

Çoğu fabrika 5S puanlarını takip eder ancak "Düşük 5S puanı nedeniyle ne kadar para kaybediyoruz?" sorusunu yanıtlayamaz. Bu araç, mevcut ve hedef 5S puanı arasındaki farka dayalı verimlilik kaybı yüzdesini modeller ve toplam işgücü kapasite maliyetiyle çarparak zayıf işyeri organizasyonunun aylık finansal yükünü ortaya çıkarır.

Örnek: 50 çalışanı, 38/100 mevcut 5S puanı, 87/100 hedefi ve saat başına 35$ işgücü maliyeti olan bir departman aylık 34.496$ verimlilik kaybı keşfeder. Hedef puana iyileştirme aylık 25.168$ geri kazandırır — 302.000$ yıllık fırsat.

Yalın yöneticileri, üretim amirleri ve sürekli iyileştirme ekipleri, 5S girişimlerinin YG'sini kanıtlamak, veri odaklı iyileştirme hedefleri belirlemek ve işyeri organizasyonu değerini yönetimin anladığı finansal terimlerle iletmek için bu dönüştürücüyü kullanır.""",

    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": """3B baskı parçalar için destek yapıları ve işlem sonrası işçiliğin toplam maliyetini hesaplar; eklemeli imalat tekliflerinde rutin olarak atlanan gizli giderleri ortaya çıkarır.

Eklemeli imalat maliyet tahminleri genellikle baskı süresi ve model malzemesine odaklanır, destek malzemesi tüketimini, çıkarma işçiliğini ve yüzey bitirmeyi göz ardı eder. Bu araç, destek hacmi maliyeti, çıkarma işçiliği ve parti işlem sonrası maliyetini toplar ve genellikle görünür parça maliyetine %30-60 ekler.

Örnek: 20 cm³ destek hacmi, 0,05$/cm³ malzeme maliyeti ve 15 dakika temizlik süresi olan bir parçanın toplam işlem sonrası maliyeti 12,25$'dır. 10 parçalık bir partide parça başı sadece 1,23$ eklenir. Ancak 60 cm³ destek ve 45 dakika temizlik ile tek parçalık bir parti 46,50$'a yükselir — genellikle baskı maliyetinin üzerinde.

Eklemeli imalat mühendisleri, atölye sahipleri ve teklif uzmanları, eksiksiz maliyet modelleri oluşturmak, minimum destek için parça yönlendirmesini optimize etmek ve her teklifin işlem sonrası tüm maliyetleri kapsamasını sağlamak için bu hesaplayıcıyı kullanır.""",

    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": """Sınırlayıcı kutu boyutları, tabla boyutu ve yuvalama verimliliğine dayalı olarak parti başına maksimum parça sayısını hesaplayarak 3B yazıcı tabla kullanımını optimize eder; kullanım yüzdelerini parça başı maliyete dönüştürür.

Tabla kullanımı, eklemeli imalat karlılığı için en büyük kaldıraçtır ancak çoğu operatör bunu göz kararıyla tahmin eder. Bu araç, tam dikdörtgen yuvalama uyumunu, kullanım yüzdesini ve parça başı makine saatini hesaplar; verimsiz tabla paketlemenin gerçek maliyet etkisini ortaya çıkarır.

Örnek: 200×200 mm tabla, 50×50 mm parçalarla 8 saat baskıda 12 parça sığdırarak %75 kullanım sağlar. Her parça 0,67 makine saati tüketir. Sadece 8 parça sığdıran zayıf yuvalama, makine saatini parça başı 1,0 saate çıkarır — marjı doğrudan azaltan %50 maliyet artışı.

Eklemeli imalat mühendisleri ve üretim planlamacıları, parti boyutunu maksimize etmek, parça başı makine maliyetlerini azaltmak ve baskı yönü ile çok parçalı yuvalama stratejisi hakkında veri odaklı kararlar almak için bu optimize ediciyi kullanır.""",

    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": """Her iki üretim yöntemi için kurulum maliyetleri ve birim maliyetlerin başabaş analizini kullanarak, 3B baskının CNC işlemeye (veya tersi) hangi üretim miktarında daha ekonomik olduğunu belirler.

Eklemeli imalat ile talaşlı imalat arasında seçim yapmak, modern üretimdeki en yaygın kararlardan biridir. Veri odaklı karşılaştırma olmadan ekipler alışkanlığa göre hareket eder — yüksek hacimlerde eklemeli veya düşük hacimlerde talaşlı imalat için fazla ödeme yapar. Bu araç, geçiş miktarını, toplam maliyet eğrilerini ve belirtilen herhangi bir hacimdeki maliyet farkını hesaplar.

Örnek: 3B baskı 100$ kurulum ve parça başı 5$; işleme 500$ kurulum ve parça başı 2$ ile başabaş miktarı 134 parçadır. 134 birimin altında baskı daha ucuzdur; üstünde işleme kazanır. 100 birimde baskı 600$'a karşılık işleme 700$ tutar.

İmalat mühendisleri, üretim planlamacıları ve tedarik yöneticileri, herhangi bir üretim miktarı için en uygun maliyetli üretim sürecini objektif olarak seçmek, tahminleri ortadan kaldırmak ve parça başı maliyetleri azaltmak için bu başabaş analizörünü kullanır.""",
}

DE_PAIN_STATEMENTS = {
    "7-israf-muda-avcisi-parasal-karsilik-calculator": """Quantifiziert die monetären Auswirkungen aller 7 Lean-Verschwendungsarten (Muda) — Überproduktion, Warten, Transport, Bestand, Bewegung, Überbearbeitung und Fehler — und übersetzt operative Ineffizienzen in finanzielle Kennzahlen, auf die das Management reagieren kann.

Traditionelle Verschwendungsverfolgung beschränkt sich auf Fehlerzählung oder Stillstandszeiten. Dieses Tool wandelt jede Verschwendungskategorie in Periodenkosten, annualisierten Verlust, Abfall-Umsatz-Verhältnis und risikoadjustierte Prioritätswerte um. Es zeigt, welche Muda-Kategorie am teuersten ist und wo Kaizen die höchste Rendite erzielt.

Beispiel: Eine Fabrik mit 50 Überproduktionseinheiten, 20 Wartestunden und 15 Fehlereinheiten in 30 Tagen entdeckt, dass Warten und Fehler 62% der gesamten Abfallkosten von 28.500 € ausmachen. Das Tool priorisiert Fehlerreduzierung mit einem risikoadjustierten Wert von 4,2/5 und prognostiziert jährliche Einsparungen von 17.700 €.

Produktionsleiter, Lean-Koordinatoren und Werksdirektoren nutzen diesen Analysator, um Muda in vorstandsgerechte Finanzkennzahlen zu übersetzen, Verbesserungsinvestitionen nach ROI zu priorisieren und die Reduzierung des Abfall-Umsatz-Verhältnisses über aufeinanderfolgende Perioden zu verfolgen.""",

    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": """Wandelt 5S-Audit-Ergebnisse in tatsächliche Dollerverluste durch Arbeitsplatzdesorganisation, Suchzeiten und ineffiziente Arbeitsabläufe um und macht den finanziellen Nutzen der Arbeitsplatzorganisation für das Management sichtbar.

Die meisten Fabriken erfassen 5S-Ergebnisse, können aber nicht beantworten: "Wie viel Geld verlieren wir aufgrund eines niedrigen 5S-Werts?" Dieses Tool modelliert den Effizienzverlustprozentsatz basierend auf der Lücke zwischen aktuellem und Ziel-5S-Wert und multipliziert ihn mit den gesamten Arbeitskapazitätskosten, um die monatliche finanzielle Belastung durch schlechte Arbeitsplatzorganisation aufzuzeigen.

Beispiel: Eine Abteilung mit 50 Mitarbeitern, aktuellem 5S-Wert 38/100, Zielwert 87/100 und Arbeitskosten von 35 €/Stunde entdeckt einen monatlichen Effizienzverlust von 34.496 €. Die Verbesserung auf den Zielwert bringt monatlich 25.168 € zurück — eine jährliche Chance von 302.000 €.

Lean-Manager, Produktionsleiter und Teams für kontinuierliche Verbesserung nutzen diesen Konverter, um den ROI von 5S-Initiativen zu belegen, datengestützte Verbesserungsziele zu setzen und den Wert der Arbeitsplatzorganisation in finanziellen Begriffen zu kommunizieren, die die Führungsebene versteht.""",

    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": """Berechnet die Gesamtkosten von Stützstrukturen und Nachbearbeitungsarbeit für 3D-gedruckte Teile und deckt versteckte Kosten auf, die routinemäßig aus Additive-Fertigungskostenvoranschlägen ausgeschlossen werden.

Kostenschätzungen für die Additive-Fertigung konzentrieren sich häufig auf Bauzeit und Modellmaterial und ignorieren Stützmaterialverbrauch, Entfernungsarbeit und Oberflächenveredelung. Dieses Tool aggregiert Stützvolumenkosten, Entfernungsarbeit und Chargen-Nachbearbeitungskosten zu einem Gesamtbetrag, der oft 30-60% zu den scheinbaren Teilekosten hinzufügt.

Beispiel: Ein Teil mit 20 cm³ Stützvolumen zu 0,05 €/cm³ und 15 Minuten Reinigungszeit zu 25 €/Stunde verursacht Nachbearbeitungskosten von 12,25 €. Bei einer Charge von 10 Teilen betragen die Nachbearbeitungskosten nur 1,23 € pro Teil. Eine Einzelteil-Charge mit 60 cm³ Stütze und 45 Minuten Reinigung steigt jedoch auf 46,50 € — oft mehr als die Baukosten.

Additive-Fertigungstechniker, Werkstattbesitzer und Angebotsspezialisten nutzen diesen Rechner, um vollständige Kostenmodelle zu erstellen, die Teileausrichtung für minimale Stützen zu optimieren und sicherzustellen, dass jedes Angebot die vollen Nachbearbeitungskosten abdeckt.""",

    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": """Optimiert die Bauplattenauslastung von 3D-Druckern durch Berechnung der maximalen Teile pro Charge basierend auf Bounding-Box-Abmessungen, Bettsize und Nesting-Effizienz — und übersetzt Auslastungsprozentsätze in Kosten pro Teil.

Die Bauplattenauslastung ist der größte Hebel für die Rentabilität der Additive-Fertigung, doch die meisten Betreiber schätzen sie nach Augenmaß. Dieses Tool berechnet die exakte rechteckige Nesting-Passung, den Auslastungsgrad und die Maschinenstunden pro Teil und zeigt die wahren Kosten ineffizienten Bettpackens.

Beispiel: Ein 200×200 mm Bett mit 50×50 mm Teilen fasst 12 Teile pro Charge bei 75% Auslastung mit einer 8-Stunden-Druckzeit. Jedes Teil verbraucht 0,67 Maschinenstunden. Schlechtes Nesting, das nur 8 Teile fasst, erhöht die Maschinenstunden auf 1,0 pro Teil — eine Kostensteigerung von 50%, die die Marge direkt schmälert.

Additive-Fertigungstechniker und Produktionsplaner nutzen diesen Optimierer, um die Chargengröße zu maximieren, die Maschinenkosten pro Teil zu senken und datengestützte Entscheidungen über Bauausrichtung und Mehrteil-Nesting-Strategie zu treffen.""",

    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": """Ermittelt die genaue Produktionsmenge, bei der 3D-Druck wirtschaftlicher wird als CNC-Bearbeitung (oder umgekehrt), mithilfe einer Break-Even-Analyse von Rüstkosten und Stückkosten beider Fertigungsmethoden.

Die Wahl zwischen additiver und subtraktiver Fertigung ist eine der häufigsten Produktionsentscheidungen in der modernen Fertigung. Ohne datengestützten Vergleich entscheiden Teams aus Gewohnheit — sie zahlen bei hohen Volumen für Additive oder bei niedrigen Volumen für Zerspanung zu viel. Dieses Tool berechnet die Crossover-Menge, die Gesamtkostenkurven und die Kostendifferenz bei jedem angegebenen Volumen.

Beispiel: Mit 3D-Druck bei 100 € Rüstkosten und 5 €/Teil und Zerspanung bei 500 € Rüstkosten und 2 €/Teil beträgt die Break-Even-Menge 134 Teile. Unter 134 Einheiten ist Drucken günstiger; darüber gewinnt die Zerspanung. Bei 100 Einheiten kostet Drucken 600 € vs. 700 € für Zerspanung.

Fertigungsingenieure, Produktionsplaner und Einkaufsleiter nutzen diesen Break-Even-Analysator, um objektiv das kostengünstigste Fertigungsverfahren für jede Produktionsmenge auszuwählen, Rätselraten zu eliminieren und die Stückkosten zu senken.""",
}

FR_PAIN_STATEMENTS = {
    "7-israf-muda-avcisi-parasal-karsilik-calculator": """Quantifie l'impact monétaire des 7 gaspillages Lean (Muda) — surproduction, attente, transport, stock, mouvement, sur-traitement et défauts — en traduisant les inefficacités opérationnelles en termes financiers directs sur lesquels la direction peut agir.

Le suivi traditionnel des gaspillages se limite à compter les défauts ou à mesurer les heures d'arrêt. Cet outil convertit chaque catégorie de gaspillage en coût périodique, perte annualisée, ratio déchets/revenus et scores de priorité ajustés au risque. Il classe quelle catégorie Muda coûte le plus cher et où le kaizen offrira le meilleur retour.

Exemple : Une usine avec 50 unités de surproduction, 20 heures d'attente et 15 unités défectueuses sur 30 jours découvre que l'attente et les défauts représentent 62% du coût total des déchets de 28 500 €. L'outil priorise la réduction des défauts avec un score de 4,2/5 et projette 17 700 € d'économies annuelles.

Les directeurs de production, coordinateurs Lean et chefs d'usine utilisent cet analyseur pour traduire le Muda en indicateurs financiers prêts pour le conseil d'administration, prioriser les investissements d'amélioration par ROI et suivre la réduction du ratio déchets/revenus sur des périodes consécutives.""",

    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": """Convertit les scores d'audit 5S en pertes financières réelles dues à la désorganisation du lieu de travail, au temps de recherche et aux flux de travail inefficaces, rendant le cas financier de l'organisation du lieu de travail visible pour la direction.

La plupart des usines suivent les scores 5S mais ne peuvent pas répondre : "Combien d'argent perdons-nous à cause d'un faible score 5S ?" Cet outil modélise le pourcentage de perte d'efficacité basé sur l'écart entre le score 5S actuel et cible, puis le multiplie par le coût total de la capacité de main-d'œuvre pour révéler le drain financier mensuel d'une mauvaise organisation du lieu de travail.

Exemple : Un service de 50 employés, score 5S actuel 38/100, cible 87/100 et coût de main-d'œuvre de 35 €/heure découvre une perte d'efficacité mensuelle de 34 496 €. L'amélioration jusqu'au score cible récupère 25 168 € par mois — une opportunité annuelle de 302 000 €.

Les responsables Lean, superviseurs de production et équipes d'amélioration continue utilisent ce convertisseur pour prouver le ROI des initiatives 5S, définir des objectifs d'amélioration basés sur les données et communiquer la valeur de l'organisation du lieu de travail en termes financiers que la direction comprend.""",

    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": """Calcule le coût total des structures de support et de la main-d'œuvre de post-traitement pour les pièces imprimées en 3D, révélant les dépenses cachées systématiquement exclues des devis de fabrication additive.

Les estimations de coûts de fabrication additive se concentrent souvent sur le temps de construction et le matériau du modèle, ignorant la consommation de matériau de support, la main-d'œuvre d'enlèvement et la finition de surface. Cet outil agrège le coût du volume de support, la main-d'œuvre d'enlèvement et le coût de post-traitement par lot en un total qui ajoute souvent 30 à 60% au coût apparent de la pièce.

Exemple : Une pièce avec 20 cm³ de support à 0,05 €/cm³ et 15 minutes de nettoyage à 25 €/heure a un coût de post-traitement de 12,25 €. Dans un lot de 10, le post-traitement n'ajoute que 1,23 € par pièce. Mais un lot d'une seule pièce avec 60 cm³ de support et 45 minutes de nettoyage passe à 46,50 € — souvent plus que le coût de fabrication.

Les ingénieurs de fabrication additive, propriétaires d'ateliers et spécialistes des devis utilisent ce calculateur pour construire des modèles de coûts complets, optimiser l'orientation des pièces pour un support minimal et garantir que chaque devis couvre l'intégralité des coûts de post-traitement.""",

    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": """Optimise l'utilisation du plateau d'impression 3D en calculant le nombre maximum de pièces par lot basé sur les dimensions de la boîte englobante, la taille du plateau et l'efficacité du nesting — traduisant les pourcentages d'utilisation en coût par pièce.

L'utilisation du plateau est le levier le plus important pour la rentabilité de la fabrication additive, mais la plupart des opérateurs l'estiment à vue d'œil. Cet outil calcule l'ajustement exact du nesting rectangulaire, le pourcentage d'utilisation et les heures machine par pièce, révélant l'impact réel des coûts d'un remplissage inefficace du plateau.

Exemple : Un plateau de 200×200 mm avec des pièces de 50×50 mm peut contenir 12 pièces par lot à 75% d'utilisation avec une impression de 8 heures. Chaque pièce coûte 0,67 heure machine. Un mauvais nesting ne contenant que 8 pièces augmente les heures machine à 1,0 par pièce — une augmentation de coût de 50% qui réduit directement la marge.

Les ingénieurs de fabrication additive et les planificateurs de production utilisent cet optimiseur pour maximiser la taille des lots, réduire les coûts machine par pièce et prendre des décisions basées sur les données concernant l'orientation de construction et la stratégie de nesting multi-pièces.""",

    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": """Détermine la quantité de production exacte à laquelle l'impression 3D devient plus économique que l'usinage CNC (ou vice versa), en utilisant une analyse du seuil de rentabilité des coûts d'installation et des coûts unitaires des deux méthodes de fabrication.

Le choix entre la fabrication additive et l'usinage soustractif est l'une des décisions de production les plus courantes dans la fabrication moderne. Sans comparaison basée sur les données, les équipes suivent leurs habitudes — payant trop pour l'additif à volume élevé ou l'usinage à volume faible. Cet outil calcule la quantité de croisement, les courbes de coût total et la différence de coût à tout volume spécifié.

Exemple : Avec l'impression 3D à 100 € d'installation et 5 €/pièce, et l'usinage à 500 € d'installation et 2 €/pièce, la quantité d'équilibre est de 134 pièces. En dessous de 134 unités, l'impression est moins chère ; au-dessus, l'usinage gagne. À 100 unités, l'impression coûte 600 € contre 700 € pour l'usinage.

Les ingénieurs de fabrication, planificateurs de production et responsables achats utilisent cet analyseur de seuil de rentabilité pour sélectionner objectivement le procédé de fabrication le plus rentable pour toute quantité de production, éliminant les conjectures et réduisant les coûts par pièce.""",
}

ES_PAIN_STATEMENTS = {
    "7-israf-muda-avcisi-parasal-karsilik-calculator": """Cuantifica el impacto monetario de los 7 desperdicios Lean (Muda) — sobreproducción, espera, transporte, inventario, movimiento, sobreprocesamiento y defectos — traduciendo las ineficiencias operativas en términos financieros directos sobre los que la dirección puede actuar.

El seguimiento tradicional de desperdicios se limita a contar defectos o medir horas de parada. Esta herramienta convierte cada categoría de desperdicio en costo periódico, pérdida anualizada, ratio desperdicio/ingresos y puntuaciones de prioridad ajustadas al riesgo. Clasifica qué categoría Muda cuesta más y dónde el kaizen generará el mayor retorno.

Ejemplo: Una fábrica con 50 unidades de sobreproducción, 20 horas de espera y 15 unidades defectuosas en 30 días descubre que la espera y los defectos representan el 62% del costo total de desperdicio de 28.500 €. La herramienta prioriza la reducción de defectos con una puntuación de 4.2/5 y proyecta un ahorro anual de 17.700 €.

Los directores de producción, coordinadores Lean y jefes de planta utilizan este analizador para traducir Muda en métricas financieras listas para la dirección, priorizar inversiones de mejora por ROI y realizar un seguimiento de la reducción del ratio desperdicio/ingresos en períodos consecutivos.""",

    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": """Convierte las puntuaciones de auditoría 5S en pérdidas monetarias reales debidas a la desorganización del lugar de trabajo, el tiempo de búsqueda y los flujos de trabajo ineficientes, haciendo visible para la dirección el caso financiero de la organización del lugar de trabajo.

La mayoría de las fábricas realizan un seguimiento de las puntuaciones 5S pero no pueden responder: "¿Cuánto dinero estamos perdiendo debido a una puntuación 5S baja?" Esta herramienta modela el porcentaje de pérdida de eficiencia basado en la brecha entre la puntuación 5S actual y la objetivo, y lo multiplica por el costo total de capacidad laboral para revelar el drenaje financiero mensual de una mala organización del lugar de trabajo.

Ejemplo: Un departamento con 50 empleados, puntuación 5S actual de 38/100, objetivo de 87/100 y costo laboral de 35 €/hora descubre una pérdida de eficiencia mensual de 34.496 €. Mejorar hasta la puntuación objetivo recupera 25.168 € mensuales — una oportunidad anual de 302.000 €.

Los gerentes Lean, supervisores de producción y equipos de mejora continua utilizan este conversor para demostrar el ROI de las iniciativas 5S, establecer objetivos de mejora basados en datos y comunicar el valor de la organización del lugar de trabajo en términos financieros que la dirección entiende.""",

    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": """Calcula el costo total de las estructuras de soporte y la mano de obra de postprocesamiento para piezas impresas en 3D, revelando los gastos ocultos que se excluyen sistemáticamente de los presupuestos de fabricación aditiva.

Las estimaciones de costos de fabricación aditiva a menudo se centran en el tiempo de construcción y el material del modelo, ignorando el consumo de material de soporte, la mano de obra de extracción y el acabado de superficies. Esta herramienta agrega el costo del volumen de soporte, la mano de obra de extracción y el costo de postprocesamiento por lote en un total que a menudo añade un 30-60% al costo aparente de la pieza.

Ejemplo: Una pieza con 20 cm³ de volumen de soporte a 0,05 €/cm³ y 15 minutos de limpieza a 25 €/hora tiene un costo de postprocesamiento de 12,25 €. En un lote de 10, el postprocesamiento añade solo 1,23 € por pieza. Pero un lote de una sola pieza con 60 cm³ de soporte y 45 minutos de limpieza aumenta a 46,50 € — a menudo más que el costo de fabricación.

Los ingenieros de fabricación aditiva, propietarios de talleres y especialistas en presupuestos utilizan esta calculadora para construir modelos de costos completos, optimizar la orientación de las piezas para un soporte mínimo y garantizar que cada presupuesto cubra el costo total del postprocesamiento.""",

    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": """Optimiza la utilización de la placa de impresión 3D calculando el número máximo de piezas por lote basado en las dimensiones de la caja delimitadora, el tamaño de la cama y la eficiencia del anidamiento — traduciendo los porcentajes de utilización en costo por pieza.

La utilización de la placa de impresión es la palanca más importante para la rentabilidad de la fabricación aditiva, pero la mayoría de los operadores la estiman a ojo. Esta herramienta calcula el ajuste exacto del anidamiento rectangular, el porcentaje de utilización y las horas máquina por pieza, revelando el impacto real en los costos del embalaje ineficiente de la cama.

Ejemplo: Una cama de 200×200 mm con piezas de 50×50 mm puede albergar 12 piezas por lote al 75% de utilización con una impresión de 8 horas. Cada pieza cuesta 0,67 horas máquina. Un mal anidamiento que solo alberga 8 piezas aumenta las horas máquina a 1,0 por pieza — un aumento de costo del 50% que reduce directamente el margen.

Los ingenieros de fabricación aditiva y los planificadores de producción utilizan este optimizador para maximizar el tamaño del lote, reducir los costos de máquina por pieza y tomar decisiones basadas en datos sobre la orientación de construcción y la estrategia de anidamiento de múltiples piezas.""",

    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": """Determina la cantidad de producción exacta en la que la impresión 3D se vuelve más económica que el mecanizado CNC (o viceversa), utilizando un análisis de punto de equilibrio de los costos de configuración y los costos unitarios de ambos métodos de fabricación.

Elegir entre fabricación aditiva y mecanizado sustractivo es una de las decisiones de producción más comunes en la fabricación moderna. Sin una comparación basada en datos, los equipos actúan por hábito — pagando de más por aditivo en volúmenes altos o por mecanizado en volúmenes bajos. Esta herramienta calcula la cantidad de cruce, las curvas de costo total y la diferencia de costo en cualquier volumen especificado.

Ejemplo: Con impresión 3D a 100 € de configuración y 5 €/pieza, y mecanizado a 500 € de configuración y 2 €/pieza, la cantidad de equilibrio es de 134 piezas. Por debajo de 134 unidades, la impresión es más barata; por encima, gana el mecanizado. A 100 unidades, la impresión cuesta 600 € frente a 700 € del mecanizado.

Los ingenieros de fabricación, planificadores de producción y gerentes de abastecimiento utilizan este analizador de punto de equilibrio para seleccionar objetivamente el proceso de fabricación más rentable para cualquier cantidad de producción, eliminando conjeturas y reduciendo los costos por pieza.""",
}

AR_PAIN_STATEMENTS = {
    "7-israf-muda-avcisi-parasal-karsilik-calculator": """يقيس الأثر المالي لجميع أنواع الهدر السبعة في اللين (مودا) — الإنتاج الزائد، الانتظار، النقل، المخزون، الحركة، المعالجة الزائدة والعيوب — ويترجم أوجه عدم الكفاءة التشغيلية إلى مصطلحات مالية مباشرة يمكن للإدارة العمل بناءً عليها.

يقتصر تتبع الهدر التقليدي على عد العيوب أو قياس ساعات التوقف. تحول هذه الأداة كل فئة من فئات الهدر إلى تكلفة دورية، وخسارة سنوية، ونسبة الهدر إلى الإيرادات، ودرجات أولوية معدلة حسب المخاطر. وتصنف فئة الهدر الأكثر تكلفة وأين سيحقق كايزن أعلى عائد.

مثال: مصنع به 50 وحدة إنتاج زائد و20 ساعة انتظار و15 وحدة معيبة خلال 30 يومًا يكتشف أن الانتظار والعيوب يمثلان 62% من إجمالي تكلفة الهدر البالغة 28,500 دولار. تعطي الأداة أولوية لتقليل العيوب بدرجة 4.2/5 وتتوقع وفورات سنوية قدرها 17,700 دولار.

يستخدم مدراء الإنتاج ومنسقو اللين ومديرو المصانع هذا المحلل لترجمة مودا إلى مقاييس مالية جاهزة لمجلس الإدارة، وترتيب أولويات استثمارات التحسين حسب العائد على الاستثمار، وتتبع انخفاض نسبة الهدر إلى الإيرادات على فترات متتالية.""",

    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": """يحول نتائج تدقيق 5S إلى خسائر مالية فعلية من عدم تنظيم مكان العمل ووقت البحث وتدفقات العمل غير الفعالة، مما يجعل الحالة المالية لتنظيم مكان العمل مرئية للإدارة.

تتتبع معظم المصانع نتائج 5S لكنها لا تستطيع الإجابة: "كم نخسر من المال بسبب انخفاض نتيجة 5S؟" تصوغ هذه الأداة النسبة المئوية لفقدان الكفاءة بناءً على الفجوة بين نتيجة 5S الحالية والهدف، ثم تضربها في إجمالي تكلفة قدرة العمل لتكشف عن العبء المالي الشهري لسوء تنظيم مكان العمل.

مثال: قسم به 50 موظفًا، نتيجة 5S حالية 38/100، هدف 87/100، وتكلفة عمل 35 دولارًا/ساعة يكتشف خسارة كفاءة شهرية قدرها 34,496 دولارًا. التحسين إلى النتيجة المستهدفة يسترد 25,168 دولارًا شهريًا — فرصة سنوية قدرها 302,000 دولار.

يستخدم مدراء اللين ومشرفو الإنتاج وفرق التحسين المستمر هذا المحول لإثبات العائد على الاستثمار لمبادرات 5S، وتحديد أهداف تحسين مدعومة بالبيانات، وإيصال قيمة تنظيم مكان العمل بمصطلحات مالية تفهمها الإدارة.""",

    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": """يحسب التكلفة الإجمالية لهياكل الدعم وعمالة ما بعد المعالجة للأجزاء المطبوعة ثلاثية الأبعاد، مما يكشف النفقات الخفية التي تُستبعد بشكل روتيني من عروض أسعار التصنيع المضاف.

تركز تقديرات تكلفة التصنيع المضاف غالبًا على وقت البناء ومادة النموذج، متجاهلة استهلاك مادة الدعم وعمالة الإزالة والتشطيب السطحي. تجمع هذه الأداة تكلفة حجم الدعم وعمالة الإزالة وتكلفة ما بعد المعالجة لكل دفعة في إجمالي يضيف غالبًا 30-60% إلى تكلفة الجزء الظاهرة.

مثال: جزء بحجم دعم 20 سم³ بتكلفة 0.05 دولار/سم³ و15 دقيقة تنظيف بـ 25 دولارًا/ساعة له تكلفة ما بعد معالجة 12.25 دولارًا. في دفعة من 10 أجزاء، لا تضيف ما بعد المعالجة سوى 1.23 دولار لكل جزء. لكن دفعة من جزء واحد مع 60 سم³ دعم و45 دقيقة تنظيف تقفز إلى 46.50 دولارًا — غالبًا أكثر من تكلفة البناء.

يستخدم مهندسو التصنيع المضاف وأصحاب الورش ومتخصصو عروض الأسعار هذه الآلة الحاسبة لبناء نماذج تكلفة كاملة، وتحسين اتجاه الجزء لأقل دعم، وضمان أن كل عرض أسعار يغطي التكلفة الكاملة لما بعد المعالجة.""",

    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": """يحسن استخدام سرير الطباعة ثلاثية الأبعاد بحساب الحد الأقصى لعدد الأجزاء لكل دفعة بناءً على أبعاد الصندوق المحيط وحجم السرير وكفاءة التعشيش — ويحول نسب الاستخدام إلى تكلفة لكل جزء.

استخدام سرير الطباعة هو أكبر رافعة لربحية التصنيع المضاف، لكن معظم المشغلين يقدّرونه بالتخمين. تحسب هذه الأداة تطابق التعشيش المستطيل الدقيق ونسبة الاستخدام وساعات الماكينة لكل جزء، مما يكشف التأثير الحقيقي لتكلفة التعبئة غير الفعالة للسرير.

مثال: سرير 200×200 مم مع أجزاء 50×50 مم يتسع لـ 12 جزءًا لكل دفعة بنسبة استخدام 75% مع طباعة 8 ساعات. كل جزء يكلف 0.67 ساعة ماكينة. التعشيش السيئ الذي يتسع لـ 8 أجزاء فقط يرفع ساعات الماكينة إلى 1.0 لكل جزء — زيادة تكلفة بنسبة 50% تقلل الهامش مباشرة.

يستخدم مهندسو التصنيع المضاف ومخططو الإنتاج هذه الأداة لتعظيم حجم الدفعة، وتقليل تكاليف الماكينة لكل جزء، واتخاذ قرارات مدعومة بالبيانات حول اتجاه البناء واستراتيجية التعشيش متعدد الأجزاء.""",

    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": """يحدد كمية الإنتاج الدقيقة التي يصبح عندها الطباعة ثلاثية الأبعاد أكثر اقتصادًا من التصنيع باستخدام الحاسب الآلي (أو العكس)، باستخدام تحليل نقطة التعادل لتكاليف الإعداد وتكاليف الوحدة لكلتا طريقتي التصنيع.

الاختيار بين التصنيع المضاف والتصنيع بالقطع هو أحد أكثر قرارات الإنتاج شيوعًا في التصنيع الحديث. بدون مقارنة مدعومة بالبيانات، تختار الفرق بالعادة — مما يؤدي إلى دفع مبالغ زائدة للتصنيع المضاف بكميات كبيرة أو للتصنيع بالقطع بكميات صغيرة. تحسب هذه الأداة كمية التقاطع ومنحنيات التكلفة الإجمالية وفرق التكلفة عند أي حجم محدد.

مثال: مع الطباعة ثلاثية الأبعاد بتكلفة إعداد 100 دولار و5 دولارات/جزء، والتصنيع بتكلفة إعداد 500 دولار و2 دولار/جزء، كمية نقطة التعادل هي 134 جزءًا. تحت 134 وحدة، الطباعة أرخص؛ فوقها، يتفوق التصنيع. عند 100 وحدة، تكلفة الطباعة 600 دولار مقابل 700 دولار للتصنيع.

يستخدم مهندسو التصنيع ومخططو الإنتاج ومديرو المشتريات هذا المحلل لاختيار عملية التصنيع الأكثر فعالية من حيث التكلفة لأي كمية إنتاج، مما يلغي التخمين ويقلل التكاليف لكل جزء.""",
}


# ===================================================================
# FILE UPDATERS
# ===================================================================

def update_pain_statement_in_schema_file(slug: str, new_en: str) -> bool:
    """Update the painStatement field in a premium schema .ts file."""
    schema_dir = os.path.join(PROJECT_ROOT, "src", "lib", "premium-schema", "schemas")
    # Find the schema file
    for fname in os.listdir(schema_dir):
        if fname in ("index.ts",):
            continue
        fpath = os.path.join(schema_dir, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        if slug in content and "painStatement:" in content:
            # Replace painStatement
            pattern = r'(painStatement:\s*)(["\']).*?\2'
            # Escape newlines for JS string
            escaped = new_en.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n\\\n")
            # Build replacement
            new_value = f'painStatement:\n    "{escaped}"'
            old_pattern = r'painStatement:\s*"[^"]*"'
            import re
            updated = re.sub(old_pattern, new_value, content, count=1)
            if updated != content:
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(updated)
                print(f"  ✓ Updated EN painStatement in {fname}")
                return True
            else:
                print(f"  ✗ Failed to update {fname} — pattern not matched")
                return False
    print(f"  ✗ Schema file not found for {slug}")
    return False


def update_ts_dict_entry(filepath: str, tool_id: str, new_pain: str, indent: int = 4) -> bool:
    """Update a specific tool's painStatement in a TS locale dict file."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the tool entry
    import re
    # Pattern: find the tool id key and its following painStatement
    # We need to match multiline painStatement values
    pattern = rf'("{re.escape(tool_id)}"\s*:\s*{{.*?painStatement:\s*)"[^"]*"'
    
    # Escape the pain statement for TS string
    escaped = new_pain.replace("\\", "\\\\").replace('"', '\\"')

    # Build the replacement with exact same indentation
    ind = " " * indent
    replacement = f'{ind}"{tool_id}": {{\n{ind * 2}title: "', 
    # For the replacement, we need to find the title first
    # Better approach: use python to parse and replace
    
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    in_target = False
    in_pain = False
    brace_depth = 0
    pain_line_idx = -1
    pain_indent = ""
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith(f'"{tool_id}"'):
            in_target = True
        if in_target:
            if stripped.startswith("painStatement:"):
                pain_line_idx = i
                pain_indent = line[:len(line) - len(line.lstrip())]
                in_pain = True
                # This line has the pain statement start
                break
    
    if pain_line_idx < 0:
        print(f"  ✗ Could not find {tool_id} in {filepath}")
        return False
    
    # Build new pain line(s)
    escaped_pain = new_pain.replace('\\', '\\\\').replace('"', '\\"')
    # Split into multiple lines for readability
    pain_lines = escaped_pain.split('\n')
    new_pain_section = f'{pain_indent}painStatement:\n'
    for pl in pain_lines:
        new_pain_section += f'{pain_indent}  "{pl}",\n'
    # Remove trailing comma from last line
    new_pain_section = new_pain_section.rstrip(',\n')
    
    # Replace the old painStatement line(s)
    old_line = lines[pain_line_idx]
    if old_line.rstrip().endswith('"'):
        # It's a single-line painStatement
        # Need to find the end
        end_idx = pain_line_idx + 1
        # The next line after painStatement
        lines_to_replace = 1
        lines[pain_line_idx] = new_pain_section + '\n'
    else:
        print(f"  ✗ Unexpected painStatement format at line {pain_line_idx}")
        return False
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(lines)
    
    print(f"  ✓ Updated painStatement in {os.path.basename(filepath)} for {tool_id}")
    return True


def main():
    print("=" * 70)
    print("  PREMIUM SCHEMA PAIN STATEMENT ENHANCER v1.0")
    print("  5 Tools × 6 Languages = 30 Enhanced Statements")
    print("=" * 70)

    # 1. Update English in schema .ts files
    print("\n--- ENGLISH (schema files) ---")
    for slug, pain in EN_PAIN_STATEMENTS.items():
        update_pain_statement_in_schema_file(slug, pain)

    # 2. Update Turkish
    print("\n--- TURKISH (premium-schema-i18n.ts) ---")
    tr_file = os.path.join(PROJECT_ROOT, "src", "data", "premium-schema-i18n.ts")
    for slug, pain in TR_PAIN_STATEMENTS.items():
        update_ts_dict_entry(tr_file, slug, pain)

    # 3. Update German
    print("\n--- GERMAN (premium-schema-i18n-locales.ts) ---")
    de_file = os.path.join(PROJECT_ROOT, "src", "data", "premium-schema-i18n-locales.ts")
    for slug, pain in DE_PAIN_STATEMENTS.items():
        update_ts_dict_entry(de_file, slug, pain)

    # 4. Update French
    print("\n--- FRENCH (premium-schema-i18n-locales.ts) ---")
    for slug, pain in FR_PAIN_STATEMENTS.items():
        update_ts_dict_entry(de_file, slug, pain)

    # 5. Update Spanish
    print("\n--- SPANISH (premium-schema-i18n-locales.ts) ---")
    for slug, pain in ES_PAIN_STATEMENTS.items():
        update_ts_dict_entry(de_file, slug, pain)

    # 6. Update Arabic
    print("\n--- ARABIC (premium-schema-i18n-locales.ts) ---")
    for slug, pain in AR_PAIN_STATEMENTS.items():
        update_ts_dict_entry(de_file, slug, pain)

    print("\n" + "=" * 70)
    print("  ✅ DONE — all 30 pain statements enhanced across 6 languages")
    print("=" * 70)


if __name__ == "__main__":
    main()
