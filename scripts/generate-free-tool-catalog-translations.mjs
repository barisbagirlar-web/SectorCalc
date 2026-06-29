#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  readFileSync(join(root, "src/lib/tools/free-traffic-catalog.generated.json"), "utf8"),
);

// TR_TITLE_OVERRIDES removed — Turkish content cleaned

const T = {
  "square-meter-calculator": {
    de: { title: "Quadratmeter-Rechner", description: "Berechnen Sie die rechteckige Bodenfläche in Quadratmetern mit Umrechnungen in andere Maßeinheiten." },
    fr: { title: "Calculateur de mètres carrés", description: "Calculez la surface rectangulaire au sol en mètres carrés avec conversions d'unités." },
    es: { title: "Calculadora de metros cuadrados", description: "Calcule el área rectangular del suelo en metros cuadrados con conversiones de unidades." },
  },
  "square-footage-calculator": {
    de: { title: "Quadratfuß-Rechner", description: "Berechnen Sie die Bodenfläche in Quadratfuß mit metrischen Umrechnungen und Acres." },
    fr: { title: "Calculateur de pieds carrés", description: "Calculez la surface au sol en pieds carrés avec conversions métriques et en acres." },
    es: { title: "Calculadora de pies cuadrados", description: "Calcule el área del suelo en pies cuadrados con conversiones métricas y a acres." },
  },
  "concrete-volume-calculator": {
    de: { title: "Betonvolumen-Rechner", description: "Schätzen Sie das Betonvolumen für Platten und Fundamente in Kubikmetern." },
    fr: { title: "Calculateur de volume de béton", description: "Estimez le volume de béton pour dalles et fondations en mètres cubes." },
    es: { title: "Calculadora de volumen de hormigón", description: "Estime el volumen de hormigón para losas y cimentaciones en metros cúbicos." },
  },
  "concrete-bag-calculator": {
    de: { title: "Betonsack-Rechner", description: "Schätzen Sie die benötigten Betonsäcke inklusive Verschnittfaktor für einen Guss." },
    fr: { title: "Calculateur de sacs de béton", description: "Estimez le nombre de sacs nécessaires pour un coulage, y compris le facteur de perte." },
    es: { title: "Calculadora de sacos de hormigón", description: "Estime los sacos necesarios para un vertido, incluido el factor de merma." },
  },
  "paint-coverage-calculator": {
    de: { title: "Farbanstrich-Rechner", description: "Schätzen Sie die benötigten Farbliter für Wandfläche und Anzahl der Anstriche." },
    fr: { title: "Calculateur de couverture peinture", description: "Estimez les litres de peinture selon la surface des murs et le nombre de couches." },
    es: { title: "Calculadora de cobertura de pintura", description: "Estime los litros de pintura según el área de pared y el número de capas." },
  },
  "tile-calculator": {
    de: { title: "Fliesen-Rechner", description: "Berechnen Sie die benötigte Fliesenanzahl für eine Bodenfläche mit Verschnittzuschlag." },
    fr: { title: "Calculateur de carrelage", description: "Comptez les carreaux nécessaires pour une surface au sol avec marge de perte." },
    es: { title: "Calculadora de azulejos", description: "Calcule la cantidad de azulejos necesaria para un suelo con margen de merma." },
  },
  "flooring-calculator": {
    de: { title: "Bodenbelag-Rechner", description: "Berechnen Sie die Bodenfläche eines Raums mit Verschnittfaktor für die Materialbestellung." },
    fr: { title: "Calculateur de revêtement de sol", description: "Calculez la surface de sol d'une pièce avec marge de perte pour commander le matériau." },
    es: { title: "Calculadora de suelos", description: "Calcule el área del suelo de una habitación con factor de merma para pedir material." },
  },
  "roofing-area-calculator": {
    de: { title: "Dachflächen-Rechner", description: "Schätzen Sie die Dachoberfläche aus Grundrissfläche und Neigungsfaktor." },
    fr: { title: "Calculateur de surface de toiture", description: "Estimez la surface du toit à partir de l'empreinte au sol et du facteur de pente." },
    es: { title: "Calculadora de área de tejado", description: "Estime el área de la cubierta a partir de la huella y el factor de inclinación." },
  },
  "stair-calculator": {
    de: { title: "Treppen-Rechner", description: "Schätzen Sie die Anzahl der Stufen und den gesamten horizontalen Lauf einer Treppe." },
    fr: { title: "Calculateur d'escalier", description: "Estimez le nombre de marches et la course horizontale totale d'un escalier." },
    es: { title: "Calculadora de escaleras", description: "Estime el número de peldaños y la carrera horizontal total de una escalera." },
  },
  "drywall-calculator": {
    de: { title: "Trockenbau-Rechner", description: "Berechnen Sie die benötigten Gipskartonplatten für eine Wandfläche." },
    fr: { title: "Calculateur de plaques de plâtre", description: "Calculez le nombre de plaques de plâtre nécessaires pour une surface murale." },
    es: { title: "Calculadora de pladur", description: "Calcule las placas de yeso laminado necesarias para un área de pared." },
  },
  "brick-calculator": {
    de: { title: "Ziegel-Rechner", description: "Berechnen Sie die Ziegelanzahl für eine Wandfläche mit Verschnittzuschlag." },
    fr: { title: "Calculateur de briques", description: "Comptez les briques nécessaires pour une surface murale avec marge de perte." },
    es: { title: "Calculadora de ladrillos", description: "Calcule la cantidad de ladrillos para un muro con margen de merma." },
  },
  "rebar-weight-calculator": {
    de: { title: "Bewehrungsstahl-Gewichtsrechner", description: "Schätzen Sie das Gewicht von Bewehrungsstahl aus Durchmesser, Länge und Stückzahl." },
    fr: { title: "Calculateur de poids d'armatures", description: "Estimez le poids des armatures à partir du diamètre, de la longueur et de la quantité." },
    es: { title: "Calculadora de peso de armadura", description: "Estime el peso del acero de refuerzo según diámetro, longitud y cantidad." },
  },
  "excavation-volume-calculator": {
    de: { title: "Aushubvolumen-Rechner", description: "Berechnen Sie das rechteckige Aushubvolumen in Kubikmetern." },
    fr: { title: "Calculateur de volume de terrassement", description: "Calculez le volume de terrassement rectangulaire en mètres cubes." },
    es: { title: "Calculadora de volumen de excavación", description: "Calcule el volumen de excavación rectangular en metros cúbicos." },
  },
  "plaster-calculator": {
    de: { title: "Putz-Rechner", description: "Berechnen Sie Putzvolumen und -gewicht aus Fläche und Schichtdicke." },
    fr: { title: "Calculateur de plâtre", description: "Calculez le volume et le poids de plâtre à partir de la surface et de l'épaisseur." },
    es: { title: "Calculadora de yeso", description: "Calcule el volumen y peso del yeso según área y espesor." },
  },
  "home-renovation-m2-calculator": {
    de: { title: "Renovierungskosten pro m²-Rechner", description: "Schätzen Sie das Budget aus Fläche, Kosten pro m² und Risikopuffer." },
    fr: { title: "Calculateur de coût de rénovation au m²", description: "Estimez le budget à partir de la surface, du coût au m² et d'une marge de contingence." },
    es: { title: "Calculadora de coste de reforma por m²", description: "Estime el presupuesto según área, coste por m² y contingencia." },
  },
  "loan-payment-calculator": {
    de: { title: "Kreditraten-Rechner", description: "Berechnen Sie die monatliche Annuität aus Kapital, Zinssatz und Laufzeit." },
    fr: { title: "Calculateur de mensualité de prêt", description: "Calculez la mensualité amortissable à partir du capital, du taux et de la durée." },
    es: { title: "Calculadora de cuota de préstamo", description: "Calcule la cuota mensual amortizable según capital, tipo y plazo." },
  },
  "mortgage-calculator": {
    de: { title: "Hypotheken-Rechner", description: "Berechnen Sie die monatliche Hypothekenrate mit Aufschlüsselung der Gesamtzinsen." },
    fr: { title: "Calculateur d'hypothèque", description: "Calculez la mensualité hypothécaire avec le détail des intérêts totaux." },
    es: { title: "Calculadora de hipoteca", description: "Calcule la cuota hipotecaria mensual con el desglose de intereses totales." },
  },
  "interest-calculator": {
    de: { title: "Einfachzins-Rechner", description: "Berechnen Sie einfachen Zins und Gesamtrückzahlung über die Laufzeit." },
    fr: { title: "Calculateur d'intérêt simple", description: "Calculez l'intérêt simple et le remboursement total sur la durée." },
    es: { title: "Calculadora de interés simple", description: "Calcule el interés simple y el reembolso total a lo largo del tiempo." },
  },
  "compound-interest-calculator": {
    de: { title: "Zinseszins-Rechner", description: "Berechnen Sie den Endwert mit Zinseszinswachstum." },
    fr: { title: "Calculateur d'intérêts composés", description: "Calculez la valeur future avec une croissance composée." },
    es: { title: "Calculadora de interés compuesto", description: "Calcule el valor futuro con crecimiento compuesto." },
  },
  "vat-calculator": {
    de: { title: "MwSt-Rechner", description: "Addieren Sie die Mehrwertsteuer zu einem Nettobetrag." },
    fr: { title: "Calculateur de TVA", description: "Ajoutez la TVA à un montant net." },
    es: { title: "Calculadora de IVA", description: "Añada el IVA a un importe neto." },
  },
  "discount-calculator": {
    de: { title: "Rabatt-Rechner", description: "Berechnen Sie den Verkaufspreis nach prozentualem Rabatt." },
    fr: { title: "Calculateur de remise", description: "Calculez le prix de vente après remise en pourcentage." },
    es: { title: "Calculadora de descuento", description: "Calcule el precio de venta tras un descuento porcentual." },
  },
  "percentage-calculator": {
    de: { title: "Prozent-Rechner", description: "Finden Sie X Prozent eines Wertes." },
    fr: { title: "Calculateur de pourcentage", description: "Trouvez X pour cent d'une valeur." },
    es: { title: "Calculadora de porcentaje", description: "Encuentre el X por ciento de un valor." },
  },
  "profit-margin-calculator": {
    de: { title: "Gewinnmargen-Rechner", description: "Berechnen Sie die Verkaufsmarge in Prozent aus Preis und Kosten." },
    fr: { title: "Calculateur de marge bénéficiaire", description: "Calculez le pourcentage de marge à partir du prix et du coût." },
    es: { title: "Calculadora de margen de beneficio", description: "Calcule el margen de venta en porcentaje a partir del precio y coste." },
  },
  "break-even-calculator": {
    de: { title: "Break-even-Rechner", description: "Berechnen Sie die Einheiten, die nötig sind, um Fixkosten zu decken." },
    fr: { title: "Calculateur de seuil de rentabilité", description: "Calculez les unités nécessaires pour couvrir les coûts fixes." },
    es: { title: "Calculadora de punto de equilibrio", description: "Calcule las unidades necesarias para cubrir los costes fijos." },
  },
  "roi-calculator": {
    de: { title: "ROI-Rechner", description: "Berechnen Sie die Kapitalrendite in Prozent." },
    fr: { title: "Calculateur de ROI", description: "Calculez le retour sur investissement en pourcentage." },
    es: { title: "Calculadora de ROI", description: "Calcule el retorno de la inversión en porcentaje." },
  },
  "salary-cost-calculator": {
    de: { title: "Arbeitgeber-Lohnkosten-Rechner", description: "Berechnen Sie die Gesamtkosten des Arbeitgebers inklusive Arbeitgeberbeiträge." },
    fr: { title: "Calculateur de coût salarial employeur", description: "Calculez le coût total employeur incluant les charges patronales." },
    es: { title: "Calculadora de coste salarial del empleador", description: "Calcule el coste total del empleador incluyendo cotizaciones patronales." },
  },
  "hourly-rate-calculator": {
    de: { title: "Stundensatz-Rechner", description: "Berechnen Sie den abrechenbaren Stundensatz aus dem Monatseinkommen." },
    fr: { title: "Calculateur de taux horaire", description: "Calculez le taux horaire facturable à partir du revenu mensuel." },
    es: { title: "Calculadora de tarifa por hora", description: "Calcule la tarifa por hora facturable a partir del ingreso mensual." },
  },
  "depreciation-calculator": {
    de: { title: "Lineare Abschreibungs-Rechner", description: "Berechnen Sie die jährliche Abschreibung aus Anschaffungskosten und Restwert." },
    fr: { title: "Calculateur d'amortissement linéaire", description: "Calculez l'amortissement annuel à partir du coût d'actif et de la valeur résiduelle." },
    es: { title: "Calculadora de amortización lineal", description: "Calcule la amortización anual a partir del coste del activo y valor residual." },
  },
  "cash-flow-gap-calculator": {
    de: { title: "Liquiditätslücken-Rechner", description: "Berechnen Sie die Working-Capital-Lücke aus Forderungs- und Verbindlichkeitsterminen." },
    fr: { title: "Calculateur d'écart de trésorerie", description: "Calculez l'écart de fonds de roulement selon les délais créances et dettes." },
    es: { title: "Calculadora de brecha de flujo de caja", description: "Calcule la brecha de capital de trabajo según plazos de cobros y pagos." },
  },
  "unit-cost-calculator": {
    de: { title: "Stückkosten-Rechner", description: "Berechnen Sie die Kosten pro Einheit aus Gesamtkosten und Menge." },
    fr: { title: "Calculateur de coût unitaire", description: "Calculez le coût par unité à partir du coût total et de la quantité." },
    es: { title: "Calculadora de coste unitario", description: "Calcule el coste por unidad a partir del coste total y la cantidad." },
  },
  "machine-time-calculator": {
    de: { title: "Maschinenzeit-Rechner", description: "Wandeln Sie Rüst- und Zykluszeit in Maschinenkosten um." },
    fr: { title: "Calculateur de temps machine", description: "Convertissez le temps de réglage et de cycle en coût machine." },
    es: { title: "Calculadora de tiempo de máquina", description: "Convierta el tiempo de preparación y ciclo en coste de máquina." },
  },
  "cnc-cycle-time-calculator": {
    de: { title: "CNC-Zykluszeit-Rechner", description: "Berechnen Sie die gesamten CNC-Sekunden pro Charge inklusive Be- und Entladen." },
    fr: { title: "Calculateur de temps de cycle CNC", description: "Calculez le total des secondes CNC par lot, chargement et déchargement inclus." },
    es: { title: "Calculadora de tiempo de ciclo CNC", description: "Calcule los segundos CNC totales por lote incluyendo carga y descarga." },
  },
  "welding-cost-estimator": {
    de: { title: "Schweißkosten-Schätzer", description: "Berechnen Sie Material-, Arbeits- und Verbrauchskosten für einen Schweißauftrag." },
    fr: { title: "Estimateur de coût de soudure", description: "Calculez matériaux, main-d'œuvre et consommables pour un travail de soudure." },
    es: { title: "Estimador de coste de soldadura", description: "Calcule material, mano de obra y consumibles para un trabajo de soldadura." },
  },
  "laser-cutting-time-check": {
    de: { title: "Laser-Schneidzeit-Check", description: "Berechnen Sie Schnittweg, Piercing- und Rüstminuten für Laseraufträge." },
    fr: { title: "Contrôle du temps de découpe laser", description: "Calculez le trajet de coupe, perçage et minutes de réglage pour les travaux laser." },
    es: { title: "Control de tiempo de corte láser", description: "Calcule trayectoria de corte, perforación y minutos de preparación para trabajos láser." },
  },
  "3d-print-cost-check": {
    de: { title: "3D-Druck-Kosten-Check", description: "Berechnen Sie Material-, Maschinen- und Nachbearbeitungskosten für einen Druckauftrag." },
    fr: { title: "Contrôle du coût d'impression 3D", description: "Calculez les coûts matière, machine et post-traitement pour une impression." },
    es: { title: "Control de coste de impresión 3D", description: "Calcule material, máquina y postproceso para un trabajo de impresión." },
  },
  "sheet-metal-weight-calculator": {
    de: { title: "Blechgewicht-Rechner", description: "Berechnen Sie das Plattengewicht aus Abmessungen, Dicke und Dichte." },
    fr: { title: "Calculateur de poids de tôle", description: "Calculez le poids de la plaque à partir des dimensions, épaisseur et densité." },
    es: { title: "Calculadora de peso de chapa metálica", description: "Calcule el peso de la placa según dimensiones, espesor y densidad." },
  },
  "material-waste-calculator": {
    de: { title: "Materialverschnitt-Rechner", description: "Berechnen Sie Verschnitt in kg und Prozent aus Input und guter Ausbringung." },
    fr: { title: "Calculateur de perte de matière", description: "Calculez les pertes en kg et en pourcentage à partir de l'entrée et de la bonne sortie." },
    es: { title: "Calculadora de merma de material", description: "Calcule la merma en kg y porcentaje a partir de entrada y salida buena." },
  },
  "scrap-rate-calculator": {
    de: { title: "Ausschussquote-Rechner", description: "Berechnen Sie die Ausschussquote in Prozent aus Ausschuss- und Gesamteinheiten." },
    fr: { title: "Calculateur de taux de rebut", description: "Calculez le taux de rebut en pourcentage à partir des rebuts et unités totales." },
    es: { title: "Calculadora de tasa de rechazo", description: "Calcule el porcentaje de rechazo a partir de unidades defectuosas y totales." },
  },
  "oee-calculator": {
    de: { title: "OEE-Rechner", description: "Berechnen Sie die Gesamtanlageneffektivität aus Verfügbarkeit × Leistung × Qualität." },
    fr: { title: "Calculateur OEE", description: "Calculez l'efficacité globale des équipements via disponibilité × performance × qualité." },
    es: { title: "Calculadora OEE", description: "Calcule la efectividad global del equipo mediante disponibilidad × rendimiento × calidad." },
  },
  "machine-hour-rate-calculator": {
    de: { title: "Maschinenstundensatz-Rechner", description: "Berechnen Sie den voll belasteten Maschinenstundensatz." },
    fr: { title: "Calculateur de taux horaire machine", description: "Calculez le taux horaire machine entièrement chargé." },
    es: { title: "Calculadora de tarifa horaria de máquina", description: "Calcule la tarifa horaria de máquina con todos los costes incluidos." },
  },
  "tool-life-calculator": {
    de: { title: "Werkzeuglebensdauer-Kostenrechner", description: "Berechnen Sie die Werkzeugkosten pro gutem Teil." },
    fr: { title: "Calculateur de coût de durée d'outil", description: "Calculez le coût d'outillage réparti par pièce conforme." },
    es: { title: "Calculadora de coste de vida útil de herramienta", description: "Calcule el coste de herramienta asignado por pieza buena." },
  },
  "cutting-speed-calculator": {
    de: { title: "Schnittgeschwindigkeits-Rechner", description: "Berechnen Sie die Schnittgeschwindigkeit Vc aus Durchmesser und U/min." },
    fr: { title: "Calculateur de vitesse de coupe", description: "Calculez la vitesse de coupe Vc à partir du diamètre et des tr/min." },
    es: { title: "Calculadora de velocidad de corte", description: "Calcule la velocidad de corte Vc a partir del diámetro y RPM." },
  },
  "feed-rate-calculator": {
    de: { title: "Vorschub-Rechner", description: "Berechnen Sie den Tischvorschub aus U/min, Zähnezahl und Vorschub pro Zahn." },
    fr: { title: "Calculateur d'avance", description: "Calculez l'avance de table à partir des tr/min, dents et avance par dent." },
    es: { title: "Calculadora de avance", description: "Calcule el avance de mesa a partir de RPM, dientes y avance por diente." },
  },
  "tolerance-drift-calculator": {
    de: { title: "Toleranzdrift-Rechner", description: "Berechnen Sie die Abweichung von der Sollmaß und die Drift in Prozent." },
    fr: { title: "Calculateur de dérive de tolérance", description: "Calculez l'écart par rapport à la cote et le pourcentage de dérive." },
    es: { title: "Calculadora de deriva de tolerancia", description: "Calcule la desviación respecto a la cota objetivo y el porcentaje de deriva." },
  },
  "batch-yield-calculator": {
    de: { title: "Chargenausbeute-Rechner", description: "Berechnen Sie die Prozessausbeute in Prozent aus Input und guter Ausbringung." },
    fr: { title: "Calculateur de rendement de lot", description: "Calculez le rendement du processus en pourcentage à partir de l'entrée et de la bonne sortie." },
    es: { title: "Calculadora de rendimiento de lote", description: "Calcule el rendimiento del proceso en porcentaje a partir de entrada y salida buena." },
  },
  "kwh-cost-calculator": {
    de: { title: "kWh-Kosten-Rechner", description: "Berechnen Sie die Stromkosten aus Verbrauch und Tarif." },
    fr: { title: "Calculateur de coût kWh", description: "Calculez le coût de l'électricité à partir de la consommation et du tarif." },
    es: { title: "Calculadora de coste kWh", description: "Calcule el coste eléctrico según consumo y tarifa." },
  },
  "electricity-bill-calculator": {
    de: { title: "Stromrechnungs-Rechner", description: "Berechnen Sie die monatliche Rechnung aus Verbrauch, Tarif und Grundgebühr." },
    fr: { title: "Calculateur de facture d'électricité", description: "Calculez la facture mensuelle selon usage, tarif et charge fixe." },
    es: { title: "Calculadora de factura eléctrica", description: "Calcule la factura mensual según consumo, tarifa y cargo fijo." },
  },
  "energy-consumption-check": {
    de: { title: "Energieverbrauchs-Check", description: "Berechnen Sie kWh und Kosten aus Leistung, Stunden und Tagen." },
    fr: { title: "Contrôle de consommation d'énergie", description: "Calculez kWh et coût à partir de la puissance, heures et jours." },
    es: { title: "Control de consumo energético", description: "Calcule kWh y coste a partir de potencia, horas y días." },
  },
  "carbon-footprint-quick": {
    de: { title: "CO₂-Fußabdruck-Schnellcheck", description: "Berechnen Sie CO₂ aus Energieverbrauch und Emissionsfaktor." },
    fr: { title: "Contrôle rapide d'empreinte carbone", description: "Calculez le CO₂ à partir de la consommation d'énergie et du facteur d'émission." },
    es: { title: "Control rápido de huella de carbono", description: "Calcule CO₂ según uso energético y factor de emisión." },
  },
  "fuel-emission-calculator": {
    de: { title: "Kraftstoffemissions-Rechner", description: "Berechnen Sie CO₂ aus Kraftstofflitern und Emissionsfaktor." },
    fr: { title: "Calculateur d'émissions de carburant", description: "Calculez le CO₂ à partir des litres de carburant et du facteur d'émission." },
    es: { title: "Calculadora de emisiones de combustible", description: "Calcule CO₂ según litros de combustible y factor de emisión." },
  },
  "solar-panel-output-calculator": {
    de: { title: "Solarmodul-Ertrags-Rechner", description: "Berechnen Sie die Energieausbeute aus Anlagengröße, Sonnenstunden und Wirkungsgrad." },
    fr: { title: "Calculateur de production solaire", description: "Calculez la production d'énergie selon taille du système, heures d'ensoleillement et rendement." },
    es: { title: "Calculadora de producción de paneles solares", description: "Calcule la producción según tamaño del sistema, horas solares y eficiencia." },
  },
  "heat-loss-calculator": {
    de: { title: "Wärmeverlust-Rechner", description: "Berechnen Sie den stationären Wärmeverlust in Watt." },
    fr: { title: "Calculateur de perte thermique", description: "Calculez la perte de chaleur en régime permanent en watts." },
    es: { title: "Calculadora de pérdida de calor", description: "Calcule la pérdida de calor en régimen permanente en vatios." },
  },
  "boiler-efficiency-calculator": {
    de: { title: "Kesselwirkungsgrad-Rechner", description: "Berechnen Sie den Brennwirkungsgrad aus Nutz- und Brennstoffenergie." },
    fr: { title: "Calculateur de rendement de chaudière", description: "Calculez le rendement de combustion à partir de l'énergie utile et du combustible." },
    es: { title: "Calculadora de eficiencia de caldera", description: "Calcule la eficiencia de combustión según energía útil y combustible." },
  },
  "compressor-energy-cost-calculator": {
    de: { title: "Kompressor-Energiekosten-Rechner", description: "Berechnen Sie die Betriebskosten aus Kompressor-kW, Stunden und Tarif." },
    fr: { title: "Calculateur de coût énergétique compresseur", description: "Calculez le coût de fonctionnement à partir des kW, heures et tarif." },
    es: { title: "Calculadora de coste energético de compresor", description: "Calcule el coste de funcionamiento según kW, horas y tarifa." },
  },
  "cbam-exposure-quick-check": {
    de: { title: "CBAM-Expositions-Schnellcheck", description: "Berechnen Sie die CO₂-Grenzkostenexposition aus Emissionen und CO₂-Preis." },
    fr: { title: "Contrôle rapide d'exposition CBAM", description: "Calculez l'exposition au coût carbone aux frontières selon émissions et prix du carbone." },
    es: { title: "Control rápido de exposición CBAM", description: "Calcule la exposición al coste fronterizo del carbono según emisiones y precio." },
  },
  "fuel-consumption-calculator": {
    de: { title: "Kraftstoffverbrauchs-Rechner", description: "Berechnen Sie Reisekraftstoff in Litern und Kosten aus Strecke und Verbrauch." },
    fr: { title: "Calculateur de consommation de carburant", description: "Calculez les litres et le coût du trajet selon distance et consommation." },
    es: { title: "Calculadora de consumo de combustible", description: "Calcule litros y coste del viaje según distancia y consumo." },
  },
  "fuel-cost-calculator": {
    de: { title: "Kraftstoffkosten-Rechner", description: "Berechnen Sie Liter und Gesamtkosten aus Strecke und Verbrauch." },
    fr: { title: "Calculateur de coût de carburant", description: "Calculez les litres et le coût total selon distance et consommation." },
    es: { title: "Calculadora de coste de combustible", description: "Calcule litros y coste total según distancia y consumo." },
  },
  "desi-calculator": {
    de: { title: "Desi-Rechner", description: "Berechnen Sie das Volumengewicht (Desi) aus Paketabmessungen." },
    fr: { title: "Calculateur de desi", description: "Calculez le poids volumétrique (desi) à partir des dimensions du colis." },
    es: { title: "Calculadora de desi", description: "Calcule el peso volumétrico (desi) a partir de las dimensiones del paquete." },
  },
  "volumetric-weight-calculator": {
    de: { title: "Volumengewicht-Rechner", description: "Berechnen Sie das abrechenbare Volumengewicht für Fracht." },
    fr: { title: "Calculateur de poids volumétrique", description: "Calculez le poids volumétrique facturable pour le fret." },
    es: { title: "Calculadora de peso volumétrico", description: "Calcule el peso volumétrico facturable para transporte." },
  },
  "route-cost-calculator": {
    de: { title: "Routenkosten-Rechner", description: "Berechnen Sie die Reisekosten aus Kraftstoff, Fahrerzeit und Maut." },
    fr: { title: "Calculateur de coût d'itinéraire", description: "Calculez le coût du trajet selon carburant, temps conducteur et péages." },
    es: { title: "Calculadora de coste de ruta", description: "Calcule el coste del viaje según combustible, tiempo del conductor y peajes." },
  },
  "delivery-cost-calculator": {
    de: { title: "Lieferkosten-Rechner", description: "Berechnen Sie die Last-Mile-Kosten aus Entfernung und Stoppgebühren." },
    fr: { title: "Calculateur de coût de livraison", description: "Calculez le coût du dernier kilomètre selon distance et frais d'arrêt." },
    es: { title: "Calculadora de coste de entrega", description: "Calcule el coste de última milla según distancia y tarifas por parada." },
  },
  "freight-cost-calculator": {
    de: { title: "Frachtkosten-Rechner", description: "Berechnen Sie die Frachtgebühr aus Gewichtstarif und Festgebühr." },
    fr: { title: "Calculateur de coût de fret", description: "Calculez les frais de fret selon tarif au poids et frais fixes." },
    es: { title: "Calculadora de coste de flete", description: "Calcule el cargo de flete según tarifa por peso y tarifa fija." },
  },
  "warehouse-storage-cost-calculator": {
    de: { title: "Lagerkosten-Rechner", description: "Berechnen Sie die Lagerkosten aus Paletten, Tagesrate und Tagen." },
    fr: { title: "Calculateur de coût de stockage", description: "Calculez le coût de stockage selon palettes, tarif journalier et jours." },
    es: { title: "Calculadora de coste de almacenamiento", description: "Calcule el coste de almacén según palés, tarifa diaria y días." },
  },
  "vehicle-depreciation-calculator": {
    de: { title: "Fahrzeugabschreibungs-Rechner", description: "Berechnen Sie die jährliche Fahrzeugabschreibung linear." },
    fr: { title: "Calculateur d'amortissement véhicule", description: "Calculez l'amortissement annuel du véhicule en linéaire." },
    es: { title: "Calculadora de depreciación de vehículo", description: "Calcule la depreciación anual del vehículo en línea recta." },
  },
  "trip-budget-calculator": {
    de: { title: "Reisebudget-Rechner", description: "Berechnen Sie das Gesamtreisebudget aus Kraftstoff, Unterkunft, Essen und Extras." },
    fr: { title: "Calculateur de budget de voyage", description: "Calculez le budget total selon carburant, hébergement, repas et extras." },
    es: { title: "Calculadora de presupuesto de viaje", description: "Calcule el presupuesto total según combustible, alojamiento, comida y extras." },
  },
  "fertilizer-dosage-calculator": {
    de: { title: "Düngemitteldosierungs-Rechner", description: "Berechnen Sie die Gesamtdüngermenge aus Feldfläche und Dosierungsrate." },
    fr: { title: "Calculateur de dosage d'engrais", description: "Calculez la quantité totale d'engrais selon la surface et le taux de dosage." },
    es: { title: "Calculadora de dosis de fertilizante", description: "Calcule el fertilizante total según área del campo y tasa de dosificación." },
  },
  "seed-rate-calculator": {
    de: { title: "Saatgutrate-Rechner", description: "Berechnen Sie die Saatgutmenge aus Fläche und Aussaatrate." },
    fr: { title: "Calculateur de dose de semences", description: "Calculez la quantité de semences selon la surface et le taux d'ensemencement." },
    es: { title: "Calculadora de tasa de semilla", description: "Calcule la cantidad de semilla según área y tasa de siembra." },
  },
  "irrigation-cost-check": {
    de: { title: "Bewässerungskosten-Check", description: "Berechnen Sie Pumpenenergie plus Wasserkosten für die Bewässerung." },
    fr: { title: "Contrôle du coût d'irrigation", description: "Calculez l'énergie de pompage et le coût de l'eau pour l'irrigation." },
    es: { title: "Control de coste de riego", description: "Calcule la energía de bombeo y el coste del agua para el riego." },
  },
  "water-usage-calculator": {
    de: { title: "Wasserverbrauchs-Rechner", description: "Berechnen Sie Liter aus Durchflussrate und Dauer." },
    fr: { title: "Calculateur de consommation d'eau", description: "Calculez les litres à partir du débit et de la durée." },
    es: { title: "Calculadora de uso de agua", description: "Calcule los litros según caudal y duración." },
  },
  "feed-cost-estimator": {
    de: { title: "Futterkosten-Schätzer", description: "Berechnen Sie die Gesamtfutterkosten inklusive Transport." },
    fr: { title: "Estimateur de coût d'alimentation", description: "Calculez le coût total de l'alimentation incluant le transport." },
    es: { title: "Estimador de coste de pienso", description: "Calcule el coste total del pienso incluyendo transporte." },
  },
  "milk-yield-check": {
    de: { title: "Milchleistungs-Check", description: "Berechnen Sie tägliche Milchliter und Umsatzschätzung." },
    fr: { title: "Contrôle de rendement laitier", description: "Calculez les litres de lait quotidiens et l'estimation de revenu." },
    es: { title: "Control de rendimiento lechero", description: "Calcule litros diarios de leche y estimación de ingresos." },
  },
  "crop-yield-calculator": {
    de: { title: "Ernteertrags-Rechner", description: "Berechnen Sie Erntetonnage und Umsatz aus Ertrag pro Hektar." },
    fr: { title: "Calculateur de rendement agricole", description: "Calculez le tonnage récolté et le revenu selon le rendement à l'hectare." },
    es: { title: "Calculadora de rendimiento de cultivo", description: "Calcule tonelaje de cosecha e ingresos según rendimiento por hectárea." },
  },
  "recipe-cost-check": {
    de: { title: "Rezeptkosten-Check", description: "Berechnen Sie die Portionskosten aus den Gesamtzutatenkosten." },
    fr: { title: "Contrôle du coût de recette", description: "Calculez le coût par portion à partir des dépenses totales en ingrédients." },
    es: { title: "Control de coste de receta", description: "Calcule el coste por porción a partir del gasto total en ingredientes." },
  },
  "food-cost-calculator": {
    de: { title: "Wareneinsatz-Rechner", description: "Berechnen Sie den Speisenkostenprozentsatz aus Zutatenkosten und Menüpreis." },
    fr: { title: "Calculateur de coût alimentaire", description: "Calculez le pourcentage de coût matière à partir du coût des ingrédients et du prix menu." },
    es: { title: "Calculadora de coste de alimentos", description: "Calcule el porcentaje de coste de comida según ingredientes y precio del menú." },
  },
  "portion-cost-calculator": {
    de: { title: "Portionskosten-Rechner", description: "Berechnen Sie die Kosten pro Portion aus den Chargenkosten." },
    fr: { title: "Calculateur de coût par portion", description: "Calculez le coût par portion à partir du coût du lot." },
    es: { title: "Calculadora de coste por porción", description: "Calcule el coste por ración a partir del coste del lote." },
  },
  "rent-vs-buy-calculator": {
    de: { title: "Mieten vs. Kaufen-Rechner", description: "Vergleichen Sie Miete plus angelegte Anzahlung mit Kauf per Hypothek und Wertsteigerung." },
    fr: { title: "Calculateur location vs achat", description: "Comparez le loyer plus apport investi à l'achat avec crédit et plus-value." },
    es: { title: "Calculadora alquiler vs compra", description: "Compare alquiler más entrada invertida frente a compra con hipoteca y revalorización." },
  },
  "home-budget-calculator": {
    de: { title: "Haushaltsbudget-Rechner", description: "Vergleichen Sie monatliche Ausgaben mit Einkommen und berechnen Sie den Restsaldo." },
    fr: { title: "Calculateur de budget domestique", description: "Comparez les dépenses mensuelles au revenu et calculez le solde restant." },
    es: { title: "Calculadora de presupuesto doméstico", description: "Compare gastos mensuales con ingresos y calcule el saldo restante." },
  },
  "time-duration-calculator": {
    de: { title: "Zeitdauer-Rechner", description: "Berechnen Sie die verstrichenen Minuten zwischen zwei Uhrzeiten." },
    fr: { title: "Calculateur de durée", description: "Calculez les minutes écoulées entre deux heures." },
    es: { title: "Calculadora de duración de tiempo", description: "Calcule los minutos transcurridos entre dos horas." },
  },
  "age-calculator": {
    de: { title: "Alters-Rechner", description: "Berechnen Sie das Alter in Jahren aus dem Geburtsjahr." },
    fr: { title: "Calculateur d'âge", description: "Calculez l'âge en années à partir de l'année de naissance." },
    es: { title: "Calculadora de edad", description: "Calcule la edad en años a partir del año de nacimiento." },
  },
  "date-difference-calculator": {
    de: { title: "Datumsdifferenz-Rechner", description: "Berechnen Sie die Tagesdifferenz zwischen zwei Tagesnummern." },
    fr: { title: "Calculateur de différence de dates", description: "Calculez le nombre de jours entre deux numéros de jour." },
    es: { title: "Calculadora de diferencia de fechas", description: "Calcule la diferencia en días entre dos números de día." },
  },
  "shopping-budget-calculator": {
    de: { title: "Einkaufsbudget-Rechner", description: "Berechnen Sie die Summe von bis zu fünf Einkaufspositionen." },
    fr: { title: "Calculateur de budget shopping", description: "Calculez le total de jusqu'à cinq lignes d'achat." },
    es: { title: "Calculadora de presupuesto de compras", description: "Calcule el total de hasta cinco partidas de compra." },
  },
  "fuel-travel-calculator": {
    de: { title: "Kraftstoff-Reise-Rechner", description: "Berechnen Sie Reisekraftstoff und Kosten für private Fahrten." },
    fr: { title: "Calculateur de carburant voyage", description: "Calculez le carburant et le coût du trajet pour un voyage personnel." },
    es: { title: "Calculadora de combustible de viaje", description: "Calcule combustible y coste del viaje para desplazamientos personales." },
  },
  "unit-price-calculator": {
    de: { title: "Stückpreis-Rechner", description: "Berechnen Sie den Preis pro Einheit aus Gesamtpreis und Menge." },
    fr: { title: "Calculateur de prix unitaire", description: "Calculez le prix par unité à partir du prix total et de la quantité." },
    es: { title: "Calculadora de precio unitario", description: "Calcule el precio por unidad a partir del precio total y la cantidad." },
  },
  "tip-calculator": {
    de: { title: "Trinkgeld-Rechner", description: "Berechnen Sie Trinkgeldbetrag und Gesamtrechnung mit Trinkgeldprozent." },
    fr: { title: "Calculateur de pourboire", description: "Calculez le pourboire et la facture totale avec le pourcentage de pourboire." },
    es: { title: "Calculadora de propina", description: "Calcule la propina y la cuenta total con el porcentaje de propina." },
  },
  "savings-goal-calculator": {
    de: { title: "Sparziel-Rechner", description: "Berechnen Sie die Monate bis zum Erreichen eines Sparziels." },
    fr: { title: "Calculateur d'objectif d'épargne", description: "Calculez les mois nécessaires pour atteindre un objectif d'épargne." },
    es: { title: "Calculadora de meta de ahorro", description: "Calcule los meses para alcanzar una meta de ahorro." },
  },
  "percentage-increase-calculator": {
    de: { title: "Prozentuale Steigerungs-Rechner", description: "Berechnen Sie die prozentuale Änderung vom alten zum neuen Wert." },
    fr: { title: "Calculateur d'augmentation en pourcentage", description: "Calculez la variation en pourcentage de l'ancienne à la nouvelle valeur." },
    es: { title: "Calculadora de aumento porcentual", description: "Calcule el cambio porcentual del valor antiguo al nuevo." },
  },
  "average-calculator": {
    de: { title: "Durchschnitts-Rechner", description: "Berechnen Sie den arithmetischen Mittelwert von bis zu fünf Werten." },
    fr: { title: "Calculateur de moyenne", description: "Calculez la moyenne arithmétique de jusqu'à cinq valeurs." },
    es: { title: "Calculadora de promedio", description: "Calcule la media aritmética de hasta cinco valores." },
  },
  "median-calculator": {
    de: { title: "Median-Rechner", description: "Berechnen Sie den Median von bis zu fünf numerischen Werten." },
    fr: { title: "Calculateur de médiane", description: "Calculez la médiane de jusqu'à cinq valeurs numériques." },
    es: { title: "Calculadora de mediana", description: "Calcule la mediana de hasta cinco valores numéricos." },
  },
  "standard-deviation-calculator": {
    de: { title: "Standardabweichungs-Rechner", description: "Berechnen Sie die Populations-Standardabweichung für bis zu fünf Werte." },
    fr: { title: "Calculateur d'écart type", description: "Calculez l'écart type populationnel pour jusqu'à cinq valeurs." },
    es: { title: "Calculadora de desviación estándar", description: "Calcule la desviación estándar poblacional para hasta cinco valores." },
  },
  "ratio-calculator": {
    de: { title: "Verhältnis-Rechner", description: "Berechnen Sie das Verhältnis a:b und die vereinfachte Form." },
    fr: { title: "Calculateur de ratio", description: "Calculez le ratio a:b et sa forme simplifiée." },
    es: { title: "Calculadora de razón", description: "Calcule la razón a:b y su forma simplificada." },
  },
  "proportion-calculator": {
    de: { title: "Proportions-Rechner", description: "Lösen Sie x in der Proportion a/b = c/x." },
    fr: { title: "Calculateur de proportion", description: "Résolvez x dans la proportion a/b = c/x." },
    es: { title: "Calculadora de proporción", description: "Resuelva x en la proporción a/b = c/x." },
  },
  "probability-calculator": {
    de: { title: "Wahrscheinlichkeits-Rechner", description: "Berechnen Sie die Wahrscheinlichkeit in Prozent aus günstigen und Gesamtergebnissen." },
    fr: { title: "Calculateur de probabilité", description: "Calculez la probabilité en pourcentage à partir des cas favorables et totaux." },
    es: { title: "Calculadora de probabilidad", description: "Calcule la probabilidad en porcentaje a partir de resultados favorables y totales." },
  },
  "sample-size-calculator": {
    de: { title: "Stichprobengrößen-Rechner", description: "Berechnen Sie die Stichprobengröße für endliche Populationen aus Fehlertoleranz und Konfidenz." },
    fr: { title: "Calculateur de taille d'échantillon", description: "Calculez la taille d'échantillon pour population finie selon marge et confiance." },
    es: { title: "Calculadora de tamaño muestral", description: "Calcule el tamaño muestral de población finita según margen y confianza." },
  },
  "z-score-calculator": {
    de: { title: "Z-Score-Rechner", description: "Berechnen Sie den Standardwert aus Wert, Mittelwert und Standardabweichung." },
    fr: { title: "Calculateur de score Z", description: "Calculez le score standard à partir de la valeur, moyenne et écart type." },
    es: { title: "Calculadora de puntuación Z", description: "Calcule la puntuación estándar a partir del valor, media y desviación estándar." },
  },
  "linear-regression-calculator": {
    de: { title: "Lineare-Regression-Rechner", description: "Berechnen Sie die Ausgleichsgerade durch drei (x,y)-Punkte." },
    fr: { title: "Calculateur de régression linéaire", description: "Calculez la droite des moindres carrés à travers trois points (x,y)." },
    es: { title: "Calculadora de regresión lineal", description: "Calcule la recta de mínimos cuadrados a través de tres puntos (x,y)." },
  },
  "length-converter": {
    de: { title: "Längen-Umrechner", description: "Rechnen Sie Längen zwischen mm, cm, m, km, Zoll, Fuß, Yard und Meile um." },
    fr: { title: "Convertisseur de longueur", description: "Convertissez les longueurs entre mm, cm, m, km, pouce, pied, yard et mile." },
    es: { title: "Convertidor de longitud", description: "Convierta longitudes entre mm, cm, m, km, pulgada, pie, yarda y milla." },
  },
  "weight-converter": {
    de: { title: "Gewichts-Umrechner", description: "Rechnen Sie Masse zwischen g, kg, Tonne, Unze und Pfund um." },
    fr: { title: "Convertisseur de poids", description: "Convertissez la masse entre g, kg, tonne, once et livre." },
    es: { title: "Convertidor de peso", description: "Convierta masa entre g, kg, tonelada, onza y libra." },
  },
  "area-converter": {
    de: { title: "Flächen-Umrechner", description: "Rechnen Sie Flächeneinheiten um, einschließlich m², ft², Acres und Hektar." },
    fr: { title: "Convertisseur de surface", description: "Convertissez les unités de surface dont m², ft², acres et hectares." },
    es: { title: "Convertidor de área", description: "Convierta unidades de área incluyendo m², ft², acres y hectáreas." },
  },
  "volume-converter": {
    de: { title: "Volumen-Umrechner", description: "Rechnen Sie Volumen zwischen ml, L, m³, in³, ft³ und US-Gallonen um." },
    fr: { title: "Convertisseur de volume", description: "Convertissez le volume entre ml, L, m³, in³, ft³ et gallons US." },
    es: { title: "Convertidor de volumen", description: "Convierta volumen entre ml, L, m³, in³, ft³ y galones US." },
  },
  "temperature-converter": {
    de: { title: "Temperatur-Umrechner", description: "Rechnen Sie zwischen Celsius, Fahrenheit und Kelvin um." },
    fr: { title: "Convertisseur de température", description: "Convertissez entre Celsius, Fahrenheit et Kelvin." },
    es: { title: "Convertidor de temperatura", description: "Convierta entre Celsius, Fahrenheit y Kelvin." },
  },
};

const locales = ["de", "fr", "es", "ar"];
const out = Object.fromEntries(locales.map((locale) => [locale, {}]));

for (const tool of catalog) {
  const entry = T[tool.slug];
  if (!entry) {
    throw new Error(`Missing translation for slug: ${tool.slug}`);
  }
  for (const locale of locales) {
    const localized = entry[locale];
    out[locale][tool.slug] = {
      title: localized.title,
      description: localized.description,
    };
  }
}

if (catalog.length !== 100) {
  throw new Error(`Expected 100 tools, got ${catalog.length}`);
}

for (const locale of locales) {
  if (Object.keys(out[locale]).length !== 100) {
    throw new Error(`Locale ${locale} has ${Object.keys(out[locale]).length} entries`);
  }
}

const outputPath = join(root, "scripts/data/free-tool-catalog-translations.json");
writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath} (${catalog.length} tools × ${locales.length} locales)`);
