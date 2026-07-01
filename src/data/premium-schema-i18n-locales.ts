/**
 * Locale overrides for premium calculator schemas (DE, FR, ES, AR).
 *
 * English source lives in `src/lib/premium-schema/schemas/*`.
 * Turkish reference: `src/data/premium-schema-i18n.ts`.
 * Only end-user fields are localized: title and painStatement.
 */

export const DE_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {
  "cnc-oee-loss": {
    title: "CNC-OEE- und Zeitverlustbericht",
    painStatement:
      "Maschinenstillstand, Ausschuss und verlängerte Zykluszeiten schmälern die Marge, bevor das Angebot angenommen wird.",
  },
  "logistics-route-loss": {
    title: "Logistik-Routen- und Leerfahrtverlustbericht",
    painStatement:
      "Leerkilometer, Kraftstoffabweichungen und Verzogerungen untergraben die Frachtmarge, bevor die Ladung angenommen wird.",
  },
  "energy-peak-cost": {
    title: "Energie-Spitzenlast- und Effizienzverlustbericht",
    painStatement:
      "Spitzenlast, Mehrverbrauch in kWh und Tarifabweichungen treiben die Rechnung uber den sichtbaren Zählerstand hinaus.",
  },
  "food-waste-margin-loss": {
    title: "Lebensmittelabfall-Margenverlust-Rechner",
    painStatement:
      "Lebensmittelbetriebe konnen Marge durch Abfall, Uberportionierung und Verderb verlieren, bevor der Verlust in den Umsatzberichten sichtbar wird.",
  },
  "construction-project-overrun": {
    title: "Bauprojekt-Kostenuberschreitungs-Rechner",
    painStatement:
      "Bauprojekte verlieren Geld, wenn Arbeitszeitabweichungen, Verzogerungstage und Materialuberschreitungen vor der Ausfuhrung nicht kalkuliert werden.",
  },
  "sheet-metal-scrap-risk": {
    title: "Blech-Ausschussrisiko-Rechner",
    painStatement:
      "Blechaufträge verlieren Marge, wenn Schnittabfall, Biegefehler und Nacharbeit an der Oberfläche vor der Angebotserstellung nicht eingepreist werden.",
  },
  "restaurant-menu-margin-leak": {
    title: "Restaurant-Menu-Margenleck-Rechner",
    painStatement:
      "Restaurants verlieren Marge, wenn Wareneinsatz, Plattformgebuhren, Abfall und Portionsabweichungen nicht gemeinsam gemessen werden.",
  },
  "construction-subcontractor-margin-leak": {
    title: "Subunternehmer-Margenleck-Rechner",
    painStatement:
      "Bauunternehmer verlieren Marge, wenn Subunternehmer-Mehrkosten, Verzogerungsanspruche und Materialabweichungen nicht kontrolliert werden.",
  },
  "logistics-fuel-route-drift": {
    title: "Kraftstoff- und Routenabweichungs-Rechner",
    painStatement:
      "Logistikrouten verlieren Geld, wenn Kraftstoffabweichungen, Leerlaufzeiten und Routenabweichungen als normale Kosten behandelt werden.",
  },
  "energy-compressor-leak-cost": {
    title: "Kompressor-Leckkosten-Rechner",
    painStatement:
      "Druckluftlecks verwandeln Strom in unsichtbare Produktionskosten.",
  },
  "cloud-api-cost-overrun": {
    title: "Cloud-API-Kostenuberschreitungs-Rechner",
    painStatement:
      "Cloud- und API-Produkte verlieren Marge, wenn Aufrufe, Tokens, Speicher und Rechenleistung schneller wachsen als der Umsatz.",
  },
  "agriculture-irrigation-yield-loss": {
    title: "Bewässerungsertragsverlust-Rechner",
    painStatement:
      "Betriebe verlieren Ertrag, wenn Bewässerungskosten, Wasserdefizit und erwartete Tonnage nicht gemeinsam gemessen werden.",
  },
  "cnc-tool-wear-cost": {
    title: "CNC-Werkzeugverschleißkosten-Rechner",
    painStatement:
      "CNC-Aufträge verlieren Marge, wenn Werkzeugverschleiß, Einsätze, Kuhlmittel und Werkzeugwechsel-Stillstand nicht pro Teil verrechnet werden.",
  },
  "textile-fabric-waste-risk": {
    title: "Textil-Stoffabfallrisiko-Rechner",
    painStatement:
      "Textilproduktion verliert Marge durch Schnittabfall, Einlauf, Farbstoffverlust und Abweichungen beim Stoffverbrauch.",
  },
  "printing-reprint-margin-leak": {
    title: "Druck-Nachdruck-Margenleck-Rechner",
    painStatement:
      "Druck- und Beschilderungsaufträge verlieren Gewinn durch Nachdruck, Designrevisionen, Farbabweichungen und Nacharbeit bei der Montage.",
  },
  "auto-repair-comeback-cost": {
    title: "Kfz-Werkstatt-Wiederholungsauftragskosten-Rechner",
    painStatement:
      "Kfz-Werkstätten verlieren Marge, wenn Diagnosezeit, Teilehandling und Wiederholungsaufträge nicht in Pauschalpreise eingerechnet werden.",
  },
  "hvac-callback-margin-risk": {
    title: "HLK-Ruckruf-Margenrisiko-Rechner",
    painStatement:
      "HLK-Projekte verlieren Marge, wenn Kanalabweichungen, Inbetriebnahmezeit und Ruckrufrisiko nicht kalkuliert werden.",
  },
  "electrical-panel-rework-cost": {
    title: "Elektroschaltschrank-Nacharbeitskosten-Rechner",
    painStatement:
      "Elektroinstallateure verlieren Geld, wenn Schaltschrankverdrahtung, Prufung, Abnahme und Nacharbeitsstunden nicht eingepreist werden.",
  },
  "plumbing-leak-callback-cost": {
    title: "Sanitär-Leck-Ruckrufkosten-Rechner",
    painStatement:
      "Sanitäraufträge verlieren Marge, wenn Leck-Ruckrufe, Materialläufe und Garantiebesuche nicht kalkuliert werden.",
  },
  "roofing-weather-delay-risk": {
    title: "Dacharbeiten-Wetterverzogerungsrisiko-Rechner",
    painStatement:
      "Dachaufträge verlieren Marge, wenn Wetterverzogerungen, Entsorgungsgebuhren und Garantieruckstellungen nicht im Vertragspreis enthalten sind.",
  },
  "painting-rework-coverage-risk": {
    title: "Malerarbeiten-Nacharbeit- und Deckungsrisiko-Rechner",
    painStatement:
      "Maleraufträge verlieren Marge, wenn Vorbereitungszeit, Deckungsabweichungen, Gerustzeit und Nacharbeit unterschätzt werden.",
  },
  "dairy-feed-efficiency-loss": {
    title: "Milchvieh-Futtereffizienzverlust-Rechner",
    painStatement:
      "Milchviehbetriebe verlieren Marge, wenn die Futterkosten schneller steigen als die Milchleistung.",
  },
  "retail-inventory-turnover-risk": {
    title: "Einzelhandel-Lagerumschlagsrisiko-Rechner",
    painStatement:
      "Einzelhändler verlieren Liquidität, wenn langsame Bestände, Preisreduzierungen und Lagerhaltungskosten nicht gemeinsam gemessen werden.",
  },
  "warehouse-space-cost-leak": {
    title: "Lagerflächen-Kostenleck-Rechner",
    painStatement:
      "Lagerbetriebe verlieren Geld, wenn ungenutzte Fläche, langsame Paletten und Handling-Abweichungen als normale Gemeinkosten behandelt werden.",
  },
  "calibration-drift-risk": {
    title: "Kalibrierungsabweichungsrisiko-Rechner",
    painStatement:
      "Messabweichungen erzeugen Ausschuss, Aussortierung und Compliance-Risiko, bevor das Problem in der Produktion sichtbar wird.",
  },
  "legal-interest-fee-calculator-pro": {
    title: "Rechtliche Zins- und Gebuhrenexpositions-Rechner",
    painStatement:
      "Rechts- und Inkassofälle verlieren Entscheidungsklarheit, wenn Zinsen, Verzogerungen und Gebuhrenexposition nicht gemeinsam zusammengefasst werden.",
  },
  "carbon-footprint-compliance-risk": {
    title: "CO₂-Fußabdruck-Compliance-Risiko-Rechner",
    painStatement:
      "Exporteure und Hersteller konnen die CO₂-Exposition unterschätzen, wenn Energie-, Kraftstoff- und CO₂-Preisannahmen nicht verknupft werden.",
  },
  "quote-price-profit-margin-calculator": {
    title: "Angebotspreis- und Gewinnmargen-Rechner",
    painStatement:
      "Angebote lassen häufig Ausschuss, Rustzeit, Zahlungszielkosten und Energielast aus, bevor die Marge festgelegt wird.",
  },
  "shop-rate-hourly-cost-calculator": {
    title: "Maschinenstundensatz-Rechner",
    painStatement:
      "Die meisten Betriebe schätzen den Stundensatz nur aus Lohn und Strom und unterschätzen die tatsächliche Stundenbelastung.",
  },
  "break-even-safety-margin-calculator": {
    title: "Break-even- und Sicherheitsmargen-Rechner",
    painStatement:
      "Unternehmer erfahren Gewinn oder Verlust oft erst, wenn die Monatsabschlusse vorliegen.",
  },
  "auto-repair-parts-labor-quote-calculator": {
    title: "Kfz-Reparatur-Teile- und Arbeitsangebots-Rechner",
    painStatement:
      "Reparaturangebote variieren je nach Techniker und Format, was Preiskonsistenz erschwert.",
  },
  "cbam-unit-product-carbon-footprint-calculator": {
    title: "CBAM-Produkteinheits-CO₂-Fußabdruck-Rechner",
    painStatement:
      "Exporteure benotigen CO₂-Nachweise auf Produktebene, verfugen aber uber wenig erschwingliche Werkzeuge.",
  },
  "oee-equipment-effectiveness-calculator": {
    title: "OEE-Rechner",
    painStatement:
      "Ohne OEE-Tracking bleiben chronische Stillstände und Qualitätsverluste unsichtbar.",
  },
  "compressor-leak-cost-calculator": {
    title: "Kompressor-Leckkosten-Rechner",
    painStatement:
      "Druckluftlecks verwandeln Strom in unsichtbare Produktionskosten.",
  },
  "employee-total-cost-calculator": {
    title: "Gesamtpersonalkosten-Rechner",
    painStatement:
      "Einstellungs- und Preisentscheidungen basieren oft auf dem Nettogehalt statt auf den vollen Arbeitgeberkosten.",
  },
  "downtime-minute-cost-calculator": {
    title: "Stillstandsminutenkosten-Rechner",
    painStatement:
      "Wartungsbudgets ignorieren die Opportunitätskosten nicht produzierender Maschinen.",
  },
  "product-customer-profitability-calculator": {
    title: "Produkt- und Kundenprofitabilitäts-Rechner",
    painStatement:
      "Umsatzstarke Kunden konnen die Marge durch Retouren, Verzogerungen und Nacharbeit zerstoren.",
  },
  "inventory-carrying-cost-eoq-calculator": {
    title: "Lagerhaltungskosten- und EOQ-Rechner",
    painStatement:
      "Lagerkosten werden unterschätzt, wenn nur die Lagerhalle angesetzt wird.",
  },
  "welded-bolted-connection-calculator": {
    title: "Geschweißte und geschraubte Verbindungs-Rechner",
    painStatement:
      "Verbindungsdimensionierung basiert ohne schnelle Strukturprufung auf Schätzungen.",
  },
  "tolerance-stack-up-calculator": {
    title: "Toleranzstapel-Rechner",
    painStatement:
      "Passungsprobleme entstehen oft durch gestapelte Toleranzen ohne dokumentierte Kettenprufung.",
  },
  "bolt-tightening-torque-calculator": {
    title: "Schraubenanzugsdrehmoment-Rechner",
    painStatement:
      "Montageteams schätzen das Drehmoment ohne dokumentierte Klemmkraftmethode.",
  },
  "fire-system-flow-hydrant-calculator": {
    title: "Brandschutz-Durchfluss- und Hydranten-Rechner",
    painStatement:
      "Brandschutzangebote ubersehen den Durchflussbedarf vor der Hydranten- und Rohrdimensionierung.",
  },
  "hydraulic-pneumatic-cylinder-force-calculator": {
    title: "Hydraulik- und Pneumatikzylinder-Kraft-Rechner",
    painStatement:
      "Zylinderauswahl uberspringt häufig Kraftprufungen vor dem Aktuator-Kauf.",
  },
  "quality-cost-paf-calculator": {
    title: "Qualitätskosten-PAF-Rechner",
    painStatement:
      "Qualitätsbudgets verbergen Präventions- und Prufkosten, bis Fehlerkosten stark ansteigen.",
  },
  "pressure-vessel-wall-thickness-calculator": {
    title: "Druckbehälter-Wanddicken-Rechner",
    painStatement:
      "Hersteller benotigen eine schnelle Wanddickenprufung vor detaillierten ASME-Berechnungen.",
  },
  "value-stream-map-vsm-calculator": {
    title: "Wertstromanalyse-VSM-Rechner",
    painStatement:
      "Durchlaufzeit versteckt sich in Warteschlangen und Transport, während Teams nur die Bearbeitungszeit erfassen.",
  },
  "energy-savings-package-calculator": {
    title: "Energieeinsparpaket-Rechner",
    painStatement:
      "Effizienzprojekte werden ohne dokumentierte Einsparungs- und Amortisationsbasis vorangetrieben.",
  },
  "investment-payback-npv-calculator": {
    title: "Investitions-Amortisation- und Kapitalwert-Rechner",
    painStatement:
      "Investitionsanträge zeigen oft nur die Amortisation ohne Diskontsatz oder Zeithorizont.",
  },
  "annual-leave-severance-notice-calculator": {
    title: "Urlaub, Abfindung und Kundigungsfrist-Rechner",
    painStatement:
      "Austrittskosten werden oft unterschätzt, bis Lohnabrechnung und Rechtsprufung vorliegen.",
  },
  "belt-pulley-speed-length-calculator": {
    title: "Riemen-Riemenscheiben-Drehzahl- und Längen-Rechner",
    painStatement:
      "Antriebsänderungen werden aus dem Gedächtnis statt mit dokumentierter Drehzahl und Riemenlänge dimensioniert.",
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    title: "5S-Audit-Score – Effizienzverlust-Kostenrechner",
    painStatement:
      "Wandelt 5S-Audit-Ergebnisse in tatsächliche Dollerverluste durch Arbeitsplatzdesorganisation, Suchzeiten und ineffiziente Arbeitsabläufe um und macht den finanziellen Nutzen der Arbeitsplatzorganisation fur das Management sichtbar.\n\nDie meisten Fabriken erfassen 5S-Ergebnisse, konnen aber nicht beantworten: \"Wie viel Geld verlieren wir aufgrund eines niedrigen 5S-Werts?\" Dieses Tool modelliert den Effizienzverlustprozentsatz basierend auf der Lucke zwischen aktuellem und Ziel-5S-Wert und multipliziert ihn mit den gesamten Arbeitskapazitätskosten, um die monatliche finanzielle Belastung durch schlechte Arbeitsplatzorganisation aufzuzeigen.\n\nBeispiel: Eine Abteilung mit 50 Mitarbeitern, aktuellem 5S-Wert 38/100, Zielwert 87/100 und Arbeitskosten von 35 €/Stunde entdeckt einen monatlichen Effizienzverlust von 34.496 €. Die Verbesserung auf den Zielwert bringt monatlich 25.168 € zuruck — eine jährliche Chance von 302.000 €.\n\nLean-Manager, Produktionsleiter und Teams fur kontinuierliche Verbesserung nutzen diesen Konverter, um den ROI von 5S-Initiativen zu belegen, datengestutzte Verbesserungsziele zu setzen und den Wert der Arbeitsplatzorganisation in finanziellen Begriffen zu kommunizieren, die die Fuhrungsebene versteht.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "3D-Druck Stutzstruktur & Nachbearbeitungskosten-Rechner",
    painStatement:
      "Berechnet die Gesamtkosten von Stutzstrukturen und Nachbearbeitungsarbeit fur 3D-gedruckte Teile und deckt versteckte Kosten auf, die routinemäßig aus Additive-Fertigungskostenvoranschlägen ausgeschlossen werden.\n\nKostenschätzungen fur die Additive-Fertigung konzentrieren sich häufig auf Bauzeit und Modellmaterial und ignorieren Stutzmaterialverbrauch, Entfernungsarbeit und Oberflächenveredelung. Dieses Tool aggregiert Stutzvolumenkosten, Entfernungsarbeit und Chargen-Nachbearbeitungskosten zu einem Gesamtbetrag, der oft 30-60% zu den scheinbaren Teilekosten hinzufugt.\n\nBeispiel: Ein Teil mit 20 cm³ Stutzvolumen zu 0,05 €/cm³ und 15 Minuten Reinigungszeit zu 25 €/Stunde verursacht Nachbearbeitungskosten von 12,25 €. Bei einer Charge von 10 Teilen betragen die Nachbearbeitungskosten nur 1,23 € pro Teil. Eine Einzelteil-Charge mit 60 cm³ Stutze und 45 Minuten Reinigung steigt jedoch auf 46,50 € — oft mehr als die Baukosten.\n\nAdditive-Fertigungstechniker, Werkstattbesitzer und Angebotsspezialisten nutzen diesen Rechner, um vollständige Kostenmodelle zu erstellen, die Teileausrichtung fur minimale Stutzen zu optimieren und sicherzustellen, dass jedes Angebot die vollen Nachbearbeitungskosten abdeckt.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "3D-Druck Batch-Nesting & Bett-Auslastungs-Rechner",
    painStatement:
      "Optimiert die Bauplattenauslastung von 3D-Druckern durch Berechnung der maximalen Teile pro Charge basierend auf Bounding-Box-Abmessungen, Bettsize und Nesting-Effizienz — und ubersetzt Auslastungsprozentsätze in Kosten pro Teil.\n\nDie Bauplattenauslastung ist der großte Hebel fur die Rentabilität der Additive-Fertigung, doch die meisten Betreiber schätzen sie nach Augenmaß. Dieses Tool berechnet die exakte rechteckige Nesting-Passung, den Auslastungsgrad und die Maschinenstunden pro Teil und zeigt die wahren Kosten ineffizienten Bettpackens.\n\nBeispiel: Ein 200×200 mm Bett mit 50×50 mm Teilen fasst 12 Teile pro Charge bei 75% Auslastung mit einer 8-Stunden-Druckzeit. Jedes Teil verbraucht 0,67 Maschinenstunden. Schlechtes Nesting, das nur 8 Teile fasst, erhoht die Maschinenstunden auf 1,0 pro Teil — eine Kostensteigerung von 50%, die die Marge direkt schmälert.\n\nAdditive-Fertigungstechniker und Produktionsplaner nutzen diesen Optimierer, um die Chargengroße zu maximieren, die Maschinenkosten pro Teil zu senken und datengestutzte Entscheidungen uber Bauausrichtung und Mehrteil-Nesting-Strategie zu treffen.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "3D-Druck vs Zerspanung Break-even-Rechner",
    painStatement:
      "Ermittelt die genaue Produktionsmenge, bei der 3D-Druck wirtschaftlicher wird als CNC-Bearbeitung (oder umgekehrt), mithilfe einer Break-Even-Analyse von Rustkosten und Stuckkosten beider Fertigungsmethoden.\n\nDie Wahl zwischen additiver und subtraktiver Fertigung ist eine der häufigsten Produktionsentscheidungen in der modernen Fertigung. Ohne datengestutzten Vergleich entscheiden Teams aus Gewohnheit — sie zahlen bei hohen Volumen fur Additive oder bei niedrigen Volumen fur Zerspanung zu viel. Dieses Tool berechnet die Crossover-Menge, die Gesamtkostenkurven und die Kostendifferenz bei jedem angegebenen Volumen.\n\nBeispiel: Mit 3D-Druck bei 100 € Rustkosten und 5 €/Teil und Zerspanung bei 500 € Rustkosten und 2 €/Teil beträgt die Break-Even-Menge 134 Teile. Unter 134 Einheiten ist Drucken gunstiger; daruber gewinnt die Zerspanung. Bei 100 Einheiten kostet Drucken 600 € vs. 700 € fur Zerspanung.\n\nFertigungsingenieure, Produktionsplaner und Einkaufsleiter nutzen diesen Break-Even-Analysator, um objektiv das kostengunstigste Fertigungsverfahren fur jede Produktionsmenge auszuwählen, Rätselraten zu eliminieren und die Stuckkosten zu senken.",
  },
  "cbam-exposure-quick-check": {
    title: "CBAM-Expositions-Schnellprufung",
    painStatement:
      "Eingebettete Emissionen, Zertifikatspreis und Wechselkurs – ohne kombinierte Betrachtung bleibt die CBAM-Kostenprognose unvollständig.",
  },
  "cbam-compliance-verdict": {
    title: "CBAM-Konformitäts-Vorbereitungsbewertung",
    painStatement:
      "Ohne gemeinsame Messung von erklärten Emissionen, Zertifikatsabdeckung und Datenvollständigkeit wird das CBAM-Vorbereitungsrisiko zu spät erkannt.",
  },
  "7-israf-muda-avcisi-parasal-karsilik-calculator": {
    title: "7 Verschwendungsarten (Muda) – monetärer Impact-Rechner",
    painStatement:
      "Quantifiziert die monetären Auswirkungen aller 7 Lean-Verschwendungsarten (Muda) — Uberproduktion, Warten, Transport, Bestand, Bewegung, Uberbearbeitung und Fehler — und ubersetzt operative Ineffizienzen in finanzielle Kennzahlen, auf die das Management reagieren kann.\n\nTraditionelle Verschwendungsverfolgung beschränkt sich auf Fehlerzählung oder Stillstandszeiten. Dieses Tool wandelt jede Verschwendungskategorie in Periodenkosten, annualisierten Verlust, Abfall-Umsatz-Verhältnis und risikoadjustierte Prioritätswerte um. Es zeigt, welche Muda-Kategorie am teuersten ist und wo Kaizen die hochste Rendite erzielt.\n\nBeispiel: Eine Fabrik mit 50 Uberproduktionseinheiten, 20 Wartestunden und 15 Fehlereinheiten in 30 Tagen entdeckt, dass Warten und Fehler 62% der gesamten Abfallkosten von 28.500 € ausmachen. Das Tool priorisiert Fehlerreduzierung mit einem risikoadjustierten Wert von 4,2/5 und prognostiziert jährliche Einsparungen von 17.700 €.\n\nProduktionsleiter, Lean-Koordinatoren und Werksdirektoren nutzen diesen Analysator, um Muda in vorstandsgerechte Finanzkennzahlen zu ubersetzen, Verbesserungsinvestitionen nach ROI zu priorisieren und die Reduzierung des Abfall-Umsatz-Verhältnisses uber aufeinanderfolgende Perioden zu verfolgen.",
  },
  "hydraulic-cylinder-tonnage-power-calculator": {
    title: "Hydraulikzylinder-Tonnage- und Leistungsrechner",
    painStatement:
      "Die Dimensionierung von Hydraulikzylindern erfordert gleichzeitige Kraft-, Geschwindigkeits- und Leistungsberechnungen fur Tonnage und Motorleistung. Ein falsches Kolbenstangen-Hub-Verhältnis kann katastrophales Knickversagen verursachen.",
  },
  "compressor-power-air-flow-calculator": {
    title: "Kompressorleistungs- und Luftstromrechner",
    painStatement:
      "Kompressorleistungsberechnungen ohne korrekten Polytropenexponenten und mehrstufige Korrektur fuhren zu uber- oder unterdimensionierten Motoren.",
  },
  "cutting-parameters-power-calculator": {
    title: "Schnittparameter- und Leistungsrechner",
    painStatement:
      "Manuelle Schnittparameterwahl lässt die Maschinenauslastung unter 60% fallen und verursacht vermeidbaren Werkzeugverschleiß.",
  },
  "evaporative-cooling-capacity-calculator": {
    title: "Verdunstungskuhlungs-(FES)-Kapazitätsrechner",
    painStatement:
      "Die Dimensionierung von Verdunstungskuhlsystemen erfordert psychrometrische Berechnungen und Pad-Wirkungsgrad — das Fehlen fuhrt zu unzureichender Kuhlung.",
  },
  "condenser-precooling-savings-calculator": {
    title: "Kondensator-Vorkuhlung (adiabatische) Energieeinsparung",
    painStatement:
      "Ohne Kondensator-Vorkuhlungsanalyse konnen Sie die Energieeinsparung durch adiabatische Kuhlung nicht quantifizieren.",
  },
  "pad-media-psychrometric-calculator": {
    title: "Pad-Medien-psychrometrische Analyse",
    painStatement:
      "Der Pad-Medien-Wirkungsgrad hängt von Pad-Dicke, Luftgeschwindigkeit und psychrometrischen Bedingungen ab — manuelles Nachschlagen kostet Stunden.",
  },
  "fgas-leak-co2-calculator": {
    title: "F-Gas-Leck- und CO₂-Äquivalentrechner",
    painStatement:
      "Die F-Gas-Leckquantifizierung erfordert GWP-Berechnung und gesetzliche Compliance-Prufungen.",
  },
  "water-footprint-calculator": {
    title: "Wasserfußabdruckrechner",
    painStatement:
      "Wasserfußabdruckanalyse ohne Aufteilung in blaues/grunes/graues Wasser verbirgt die tatsächlichen Umweltauswirkungen.",
  },
  "shev-smoke-exhaust-calculator": {
    title: "SHEV-Rauchabzugs-Dimensionsrechner",
    painStatement:
      "Die Rauchabzugsdimensionierung nach EN 12101-5 erfordert Massenstrom- und Flächenberechnungen.",
  },
  "natural-ventilation-ach-calculator": {
    title: "Naturlicher Luftungs-(ACH)-Bedarfrechner",
    painStatement:
      "Die naturliche Luftungsdimensionierung erfordert auftriebsgetriebene Stromungsberechnungen.",
  },
  "compound-interest-calculator": {
    title: "Zinseszinsrechner (detailliert)",
    painStatement:
      "Zinseszinsberechnungen ohne Anpassung der Zinseszinshäufigkeit fuhren zu irrefuhrenden Zukunftswertprognosen.",
  },
  "living-wage-calculator": {
    title: "Existenzlohnrechner",
    painStatement:
      "Die Berechnung der tatsächlichen Arbeitgeberkosten pro Mitarbeiter erfordert die Aggregation von Bruttogehalt, Uberstunden, Sozialabgaben, Steuern und Zulagen.",
  },
  "panel-radiator-heating-capacity-calculator": {
    title: "Plattenheizkorper-Heizleistungsrechner",
    painStatement:
      "Die Dimensionierung eines Plattenheizkorpers erfordert Raumwärmeverlustberechnung und Heizkorperleistungskorrektur fur nicht standardmäßige Temperaturen.",
  },
  "underfloor-heating-design-calculator": {
    title: "Fußbodenheizungs-Designrechner",
    painStatement:
      "Die Fußbodenheizungsauslegung nach EN 1264 erfordert iterative Bodenvorlauftemperatur- und Kreiszahlberechnung.",
  },
  "solar-tube-collector-sizing-calculator": {
    title: "Solarkollektor-Dimensionierungsrechner",
    painStatement:
      "Die Solarkollektordimensionierung erfordert die Abstimmung von Warmwasserbedarf, Kollektorfläche, Speicher und Zusatzheizung.",
  },
  "epq-production-quantity-calculator": {
    title: "EPQ (Economical Production Quantity) Rechner",
    painStatement:
      "Die klassische EOQ-Formel ignoriert endliche Produktionsraten und uberschätzt dadurch die Losgroßen.",
  },
  "kanban-bin-card-calculator": {
    title: "Kanban-Behälter-/Kartenanzahlrechner",
    painStatement:
      "Die richtige Kanban-Kartenanzahl balanciert Bestandsrisiko und Umlaufbestand durch Nachfrage- und Durchlaufzeit.",
  },
  "littles-law-calculator": {
    title: "Little's Law (Umlaufbestand) Rechner",
    painStatement:
      "Aus zwei beliebigen Großen von Umlaufbestand/Durchlaufzeit/Durchsatz die dritte berechnen und Umlaufbestand in finanzielle Risiken ubersetzen.",
  },
  "milk-run-route-calculator": {
    title: "Milk-Run-Routenoptimierungsrechner",
    painStatement:
      "Milk-Run-Logistik muss Lieferantenentfernung, Kapazität, Ladezeit und Fahrerkosten ausbalancieren.",
  },
  "cpm-pert-calculator": {
    title: "CPM / PERT (kritischer Pfad) Rechner",
    painStatement:
      "PERT-Analyse mit optimistischsten/wahrscheinlichsten/pessimistischsten Zeiten liefert probabilistische Projektabschlussprognosen.",
  },
  "queuing-mm1-calculator": {
    title: "Warteschlangentheorie (M/M/1) Rechner",
    painStatement:
      "Warteschlangenanalyse ohne Ankunfts- und Bedienratenmodellierung fuhrt zu unter- oder uberbesetzten Betrieben.",
  },
  "fmea-rpn-calculator": {
    title: "FMEA-RPN (Risikoprioritätszahl) Rechner",
    painStatement:
      "Manuelle FMEA-RPN-Berechnung verfehlt die funktionsubergreifende Risikopriorisierung.",
  },
  "doe-factorial-design-calculator": {
    title: "DOE-Faktorieller-Design-Rechner",
    painStatement:
      "Versuchsplanung erfordert korrekte faktorielle Designs mit Mittelpunkten und Blockbildung.",
  },
  "reliability-block-calculator": {
    title: "Zuverlässigkeitsblock-(RBD/MTBF)-Rechner",
    painStatement:
      "Zuverlässigkeitsberechnungen fur Serie/Parallel-Systeme erfordern MTBF- und MTTR-Aggregation.",
  },
  "niosh-lifting-calculator": {
    title: "NIOSH-Hebevorgangs-(uberarbeiteter)-Rechner",
    painStatement:
      "Die NIOSH-Hebegleichung erfordert horizontale/vertikale/Kopplungs-/Frequenzmultiplikatoren.",
  },
  "reba-rapid-body-assessment-calculator": {
    title: "REBA (Rapid Entire Body Assessment) Rechner",
    painStatement:
      "REBA-ergonomische Bewertung nach Hignett & McAtamney erfordert Gruppe-A- und Gruppe-B-Bewertung.",
  },
  "rcm-decision-calculator": {
    title: "RCM (Reliability-Centered Maintenance) Entscheidungsrechner",
    painStatement:
      "RCM-Entscheidungsanalyse vergleicht geplante vs. ungeplante Wartungskosten.",
  },
  "pareto-root-cause-calculator": {
    title: "Pareto-/Ursachenanalyse-Rechner",
    painStatement:
      "Pareto-(80/20)-Analyse ohne kumulative Prozentsortierung ubersieht die wenigen lebenswichtigen Ursachen.",
  },
  "value-added-process-analyzer": {
    title: "Wertschopfungsprozess-(VAP)-Verhältnis-Analysator",
    painStatement:
      "VAP-Verhältnisanalyse trennt wertschopfende von nicht-wertschopfender Zeit.",
  },
  "kaizen-event-tracker": {
    title: "Kaizen-Ereignis-/Kosteneinsparungs-Tracker",
    painStatement:
      "Kaizen-Event-ROI-Tracking erfordert Vorher-/Nachher-Kennzahlen zu Zykluszeit, Ausschussrate und Stillstandszeit.",
  },
  "fives-audit-scoring-calculator": {
    title: "5S-Audit-Bewertungsrechner",
    painStatement:
      "5S-Audit-Bewertung erfordert die Sortierung jeder S-Kategorie mit konsistenten Bewertungskriterien.",
  },
};

export const FR_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {
  "cnc-oee-loss": {
    title: "Rapport TRS et pertes de temps CNC",
    painStatement:
      "Les arrêts machine, le rebut et l'allongement des cycles érodent la marge avant l'acceptation du devis.",
  },
  "logistics-route-loss": {
    title: "Rapport pertes de route et trajets à vide logistiques",
    painStatement:
      "Les kilomètres à vide, les écarts de carburant et les retards érodent la marge fret avant l'acceptation du chargement.",
  },
  "energy-peak-cost": {
    title: "Rapport pic de demande et pertes d'efficacité énergétique",
    painStatement:
      "La pointe de demande, le surplus de kWh et la dérive tarifaire gonflent la facture au-delà de la lecture visible du compteur.",
  },
  "food-waste-margin-loss": {
    title: "Calculateur de perte de marge liée au gaspillage alimentaire",
    painStatement:
      "Les activités alimentaires peuvent perdre de la marge par le gaspillage, le surportionnement et la détérioration avant que la perte n'apparaisse dans les rapports de ventes.",
  },
  "construction-project-overrun": {
    title: "Calculateur de dépassement de projet de construction",
    painStatement:
      "Les projets de construction perdent de l'argent lorsque la dérive de main-d'œuvre, les jours de retard et le dépassement matériel ne sont pas chiffrés avant l'exécution.",
  },
  "sheet-metal-scrap-risk": {
    title: "Calculateur de risque de rebut en tôlerie",
    painStatement:
      "Les travaux de tôlerie perdent de la marge lorsque les chutes de découpe, les erreurs de pliage et la retouche de finition ne sont pas intégrées au devis.",
  },
  "restaurant-menu-margin-leak": {
    title: "Calculateur de fuite de marge menu restaurant",
    painStatement:
      "Les restaurants perdent de la marge lorsque le coût alimentaire, les frais de plateforme, le gaspillage et la dérive des portions ne sont pas mesurés ensemble.",
  },
  "construction-subcontractor-margin-leak": {
    title: "Calculateur de fuite de marge sous-traitant",
    painStatement:
      "Les entreprises de construction perdent de la marge lorsque les extras sous-traitants, les réclamations de retard et les écarts matériaux ne sont pas maîtrisés.",
  },
  "logistics-fuel-route-drift": {
    title: "Calculateur de dérive carburant et itinéraire",
    painStatement:
      "Les routes logistiques perdent de l'argent lorsque la dérive carburant, le ralenti et l'écart d'itinéraire sont traités comme un coût normal.",
  },
  "energy-compressor-leak-cost": {
    title: "Calculateur de coût de fuite compresseur",
    painStatement:
      "Les fuites d'air comprimé transforment l'électricité en coût de production invisible.",
  },
  "cloud-api-cost-overrun": {
    title: "Calculateur de dépassement de coûts cloud et API",
    painStatement:
      "Les produits cloud et API perdent de la marge lorsque les appels, tokens, stockage et calcul évoluent plus vite que le chiffre d'affaires.",
  },
  "agriculture-irrigation-yield-loss": {
    title: "Calculateur de perte de rendement irrigation",
    painStatement:
      "Les exploitations perdent du rendement lorsque le coût d'irrigation, le déficit hydrique et le tonnage attendu ne sont pas mesurés ensemble.",
  },
  "cnc-tool-wear-cost": {
    title: "Calculateur de coût d'usure d'outils CNC",
    painStatement:
      "Les travaux CNC perdent de la marge lorsque l'usure d'outils, les plaquettes, le lubrifiant et l'arrêt pour changement d'outil ne sont pas imputés par pièce.",
  },
  "textile-fabric-waste-risk": {
    title: "Calculateur de risque de rebut textile",
    painStatement:
      "La production textile perd de la marge par les chutes de coupe, le retrait, la perte de teinture et la dérive de consommation de tissu.",
  },
  "printing-reprint-margin-leak": {
    title: "Calculateur de fuite de marge réimpression",
    painStatement:
      "Les travaux d'impression et de signalétique perdent du profit par la réimpression, les révisions de design, la dérive d'encre et la retouche d'installation.",
  },
  "auto-repair-comeback-cost": {
    title: "Calculateur de coût de retour atelier auto",
    painStatement:
      "Les garages perdent de la marge lorsque le temps de diagnostic, la manutention des pièces et les retours ne sont pas intégrés au forfait.",
  },
  "hvac-callback-margin-risk": {
    title: "Calculateur de risque de marge rappel CVC",
    painStatement:
      "Les projets CVC perdent de la marge lorsque la dérive des gaines, le temps de mise en service et le risque de rappel ne sont pas chiffrés.",
  },
  "electrical-panel-rework-cost": {
    title: "Calculateur de coût de retouche panneau électrique",
    painStatement:
      "Les électriciens perdent de l'argent lorsque le câblage de panneau, les tests, les échecs d'inspection et les heures de retouche ne sont pas chiffrés.",
  },
  "plumbing-leak-callback-cost": {
    title: "Calculateur de coût de rappel fuite plomberie",
    painStatement:
      "Les travaux de plomberie perdent de la marge lorsque les rappels de fuite, les courses matériaux et les visites sous garantie ne sont pas chiffrés.",
  },
  "roofing-weather-delay-risk": {
    title: "Calculateur de risque de retard météo toiture",
    painStatement:
      "Les travaux de toiture perdent de la marge lorsque les retards météo, les frais d'évacuation et la réserve de garantie ne sont pas inclus dans le prix contractuel.",
  },
  "painting-rework-coverage-risk": {
    title: "Calculateur de risque retouche et couverture peinture",
    painStatement:
      "Les travaux de peinture perdent de la marge lorsque le temps de préparation, la dérive de couverture, le temps d'échafaudage et les retouches sont sous-estimés.",
  },
  "dairy-feed-efficiency-loss": {
    title: "Calculateur de perte d'efficacité alimentation laitière",
    painStatement:
      "Les exploitations laitières perdent de la marge lorsque le coût d'alimentation augmente plus vite que le rendement laitier.",
  },
  "retail-inventory-turnover-risk": {
    title: "Calculateur de risque de rotation des stocks retail",
    painStatement:
      "Les détaillants perdent de la trésorerie lorsque les stocks lents, les démarques et le coût de détention ne sont pas mesurés ensemble.",
  },
  "warehouse-space-cost-leak": {
    title: "Calculateur de fuite de coût d'espace entrepôt",
    painStatement:
      "Les opérations d'entrepôt perdent de l'argent lorsque l'espace inutilisé, les palettes lentes et la dérive de manutention sont traités comme frais généraux normaux.",
  },
  "calibration-drift-risk": {
    title: "Calculateur de risque de dérive d'étalonnage",
    painStatement:
      "La dérive de mesure crée du rebut, des rejets et un risque de conformité avant que le problème ne soit visible en production.",
  },
  "legal-interest-fee-calculator-pro": {
    title: "Calculateur d'exposition intérêts et frais juridiques",
    painStatement:
      "Les dossiers juridiques et de recouvrement perdent en clarté décisionnelle lorsque intérêts, retards et exposition aux frais ne sont pas résumés ensemble.",
  },
  "carbon-footprint-compliance-risk": {
    title: "Calculateur de risque conformité empreinte carbone",
    painStatement:
      "Exportateurs et fabricants peuvent sous-estimer l'exposition carbone lorsque les hypothèses énergie, carburant et prix du carbone ne sont pas reliées.",
  },
  "quote-price-profit-margin-calculator": {
    title: "Calculateur de prix de devis et marge bénéficiaire",
    painStatement:
      "Les devis omettent souvent rebut, préparation, coût des délais de paiement et charge énergétique avant le verrouillage de la marge.",
  },
  "shop-rate-hourly-cost-calculator": {
    title: "Calculateur de taux horaire machine",
    painStatement:
      "La plupart des ateliers estiment le taux horaire à partir de la main-d'œuvre et de l'électricité seulement, sous-estimant la charge horaire réelle.",
  },
  "break-even-safety-margin-calculator": {
    title: "Calculateur de seuil de rentabilité et marge de sécurité",
    painStatement:
      "Les dirigeants découvrent souvent profit ou perte seulement après réception des comptes de fin de mois.",
  },
  "auto-repair-parts-labor-quote-calculator": {
    title: "Calculateur de devis pièces et main-d'œuvre auto",
    painStatement:
      "Les devis de réparation varient selon le technicien et le format, ce qui complique la cohérence des prix.",
  },
  "cbam-unit-product-carbon-footprint-calculator": {
    title: "Calculateur empreinte carbone unitaire produit CBAM",
    painStatement:
      "Les exportateurs ont besoin de preuves carbone au niveau produit mais manquent d'outils abordables.",
  },
  "oee-equipment-effectiveness-calculator": {
    title: "Calculateur TRS (OEE)",
    painStatement:
      "Sans suivi TRS, les arrêts chroniques et les pertes qualité restent invisibles.",
  },
  "compressor-leak-cost-calculator": {
    title: "Calculateur de coût de fuite compresseur",
    painStatement:
      "Les fuites d'air comprimé transforment l'électricité en coût de production invisible.",
  },
  "employee-total-cost-calculator": {
    title: "Calculateur de coût total employé",
    painStatement:
      "Les décisions d'embauche et de tarification s'appuient souvent sur le salaire net plutôt que sur le coût employeur chargé.",
  },
  "downtime-minute-cost-calculator": {
    title: "Calculateur de coût par minute d'arrêt",
    painStatement:
      "Les budgets de maintenance ignorent le coût d'opportunité des machines qui ne produisent pas.",
  },
  "product-customer-profitability-calculator": {
    title: "Calculateur de rentabilité produit et client",
    painStatement:
      "Les clients à fort chiffre d'affaires peuvent détruire la marge par les retours, retards et retouches.",
  },
  "inventory-carrying-cost-eoq-calculator": {
    title: "Calculateur coût de détention stock et EOQ",
    painStatement:
      "Le coût de stock est sous-estimé lorsque seul le loyer d'entrepôt est comptabilisé.",
  },
  "welded-bolted-connection-calculator": {
    title: "Calculateur de connexions soudées et boulonnées",
    painStatement:
      "Le dimensionnement des connexions repose sur l'estimation sans vérification structurelle rapide.",
  },
  "tolerance-stack-up-calculator": {
    title: "Calculateur d'empilement de tolérances",
    painStatement:
      "Les problèmes d'ajustement proviennent souvent de tolérances empilées sans chaîne de contrôle documentée.",
  },
  "bolt-tightening-torque-calculator": {
    title: "Calculateur de couple de serrage boulon",
    painStatement:
      "Les équipes d'assemblage estiment le couple sans méthode documentée de force de serrage.",
  },
  "fire-system-flow-hydrant-calculator": {
    title: "Calculateur débit système incendie et hydrant",
    painStatement:
      "Les offres de protection incendie omettent le besoin de débit avant le dimensionnement des hydrants et tuyaux.",
  },
  "hydraulic-pneumatic-cylinder-force-calculator": {
    title: "Calculateur de force cylindre hydraulique et pneumatique",
    painStatement:
      "Le choix de cylindre saute souvent les vérifications de force avant l'achat de l'actionneur.",
  },
  "quality-cost-paf-calculator": {
    title: "Calculateur de coût qualité PAF",
    painStatement:
      "Les budgets qualité masquent les dépenses de prévention et d'évaluation jusqu'à ce que les coûts d'échec explosent.",
  },
  "pressure-vessel-wall-thickness-calculator": {
    title: "Calculateur d'épaisseur paroi récipient sous pression",
    painStatement:
      "Les fabricants ont besoin d'un contrôle rapide d'épaisseur avant les calculs ASME détaillés.",
  },
  "value-stream-map-vsm-calculator": {
    title: "Calculateur carte de flux de valeur VSM",
    painStatement:
      "Le délai se cache dans les files d'attente et le transport alors que les équipes ne suivent que le temps de traitement.",
  },
  "energy-savings-package-calculator": {
    title: "Calculateur de package d'économies d'énergie",
    painStatement:
      "Les projets d'efficacité avancent sans base documentée d'économies et de retour sur investissement.",
  },
  "investment-payback-npv-calculator": {
    title: "Calculateur retour sur investissement et VAN",
    painStatement:
      "Les demandes d'investissement montrent souvent le retour sans taux d'actualisation ni horizon temporel.",
  },
  "annual-leave-severance-notice-calculator": {
    title: "Calculateur congés, indemnités et préavis",
    painStatement:
      "Les coûts de départ sont souvent sous-estimés jusqu'à la revue paie et juridique.",
  },
  "belt-pulley-speed-length-calculator": {
    title: "Calculateur vitesse et longueur courroie poulie",
    painStatement:
      "Les modifications d'entraînement sont dimensionnées de mémoire au lieu d'une vitesse et longueur de courroie documentées.",
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    title: "Score audit 5S – convertisseur coût de perte d'efficacité",
    painStatement:
      "Convertit les scores d'audit 5S en pertes financières réelles dues à la désorganisation du lieu de travail, au temps de recherche et aux flux de travail inefficaces, rendant le cas financier de l'organisation du lieu de travail visible pour la direction.\n\nLa plupart des usines suivent les scores 5S mais ne peuvent pas répondre : \"Combien d'argent perdons-nous à cause d'un faible score 5S ?\" Cet outil modélise le pourcentage de perte d'efficacité basé sur l'écart entre le score 5S actuel et cible, puis le multiplie par le coût total de la capacité de main-d'œuvre pour révéler le drain financier mensuel d'une mauvaise organisation du lieu de travail.\n\nExemple : Un service de 50 employés, score 5S actuel 38/100, cible 87/100 et coût de main-d'œuvre de 35 €/heure découvre une perte d'efficacité mensuelle de 34 496 €. L'amélioration jusqu'au score cible récupère 25 168 € par mois — une opportunité annuelle de 302 000 €.\n\nLes responsables Lean, superviseurs de production et équipes d'amélioration continue utilisent ce convertisseur pour prouver le ROI des initiatives 5S, définir des objectifs d'amélioration basés sur les données et communiquer la valeur de l'organisation du lieu de travail en termes financiers que la direction comprend.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "Calculateur coût supports 3D et post-traitement",
    painStatement:
      "Calcule le coût total des structures de support et de la main-d'œuvre de post-traitement pour les pièces imprimées en 3D, révélant les dépenses cachées systématiquement exclues des devis de fabrication additive.\n\nLes estimations de coûts de fabrication additive se concentrent souvent sur le temps de construction et le matériau du modèle, ignorant la consommation de matériau de support, la main-d'œuvre d'enlèvement et la finition de surface. Cet outil agrège le coût du volume de support, la main-d'œuvre d'enlèvement et le coût de post-traitement par lot en un total qui ajoute souvent 30 à 60% au coût apparent de la pièce.\n\nExemple : Une pièce avec 20 cm³ de support à 0,05 €/cm³ et 15 minutes de nettoyage à 25 €/heure a un coût de post-traitement de 12,25 €. Dans un lot de 10, le post-traitement n'ajoute que 1,23 € par pièce. Mais un lot d'une seule pièce avec 60 cm³ de support et 45 minutes de nettoyage passe à 46,50 € — souvent plus que le coût de fabrication.\n\nLes ingénieurs de fabrication additive, propriétaires d'ateliers et spécialistes des devis utilisent ce calculateur pour construire des modèles de coûts complets, optimiser l'orientation des pièces pour un support minimal et garantir que chaque devis couvre l'intégralité des coûts de post-traitement.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "Calculateur optimisation lot et nesting 3D",
    painStatement:
      "Optimise l'utilisation du plateau d'impression 3D en calculant le nombre maximum de pièces par lot basé sur les dimensions de la boîte englobante, la taille du plateau et l'efficacité du nesting — traduisant les pourcentages d'utilisation en coût par pièce.\n\nL'utilisation du plateau est le levier le plus important pour la rentabilité de la fabrication additive, mais la plupart des opérateurs l'estiment à vue d'œil. Cet outil calcule l'ajustement exact du nesting rectangulaire, le pourcentage d'utilisation et les heures machine par pièce, révélant l'impact réel des coûts d'un remplissage inefficace du plateau.\n\nExemple : Un plateau de 200×200 mm avec des pièces de 50×50 mm peut contenir 12 pièces par lot à 75% d'utilisation avec une impression de 8 heures. Chaque pièce coûte 0,67 heure machine. Un mauvais nesting ne contenant que 8 pièces augmente les heures machine à 1,0 par pièce — une augmentation de coût de 50% qui réduit directement la marge.\n\nLes ingénieurs de fabrication additive et les planificateurs de production utilisent cet optimiseur pour maximiser la taille des lots, réduire les coûts machine par pièce et prendre des décisions basées sur les données concernant l'orientation de construction et la stratégie de nesting multi-pièces.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "Calculateur seuil de rentabilité 3D vs usinage",
    painStatement:
      "Détermine la quantité de production exacte à laquelle l'impression 3D devient plus économique que l'usinage CNC (ou vice versa), en utilisant une analyse du seuil de rentabilité des coûts d'installation et des coûts unitaires des deux méthodes de fabrication.\n\nLe choix entre la fabrication additive et l'usinage soustractif est l'une des décisions de production les plus courantes dans la fabrication moderne. Sans comparaison basée sur les données, les équipes suivent leurs habitudes — payant trop pour l'additif à volume élevé ou l'usinage à volume faible. Cet outil calcule la quantité de croisement, les courbes de coût total et la différence de coût à tout volume spécifié.\n\nExemple : Avec l'impression 3D à 100 € d'installation et 5 €/pièce, et l'usinage à 500 € d'installation et 2 €/pièce, la quantité d'équilibre est de 134 pièces. En dessous de 134 unités, l'impression est moins chère ; au-dessus, l'usinage gagne. À 100 unités, l'impression coûte 600 € contre 700 € pour l'usinage.\n\nLes ingénieurs de fabrication, planificateurs de production et responsables achats utilisent cet analyseur de seuil de rentabilité pour sélectionner objectivement le procédé de fabrication le plus rentable pour toute quantité de production, éliminant les conjectures et réduisant les coûts par pièce.",
  },
  "cbam-exposure-quick-check": {
    title: "Vérification rapide d'exposition CBAM",
    painStatement:
      "Émissions incorporées, prix du certificat et taux de change – sans combinaison, le coût CBAM reste sous-estimé.",
  },
  "cbam-compliance-verdict": {
    title: "Évaluation de préparation à la conformité CBAM",
    painStatement:
      "Sans mesure conjointe des émissions déclarées, couverture des certificats et complétude des données, le risque de préparation CBAM est détecté trop tard.",
  },
  "7-israf-muda-avcisi-parasal-karsilik-calculator": {
    title: "Calculateur d'impact monétaire des 7 gaspillages (Muda)",
    painStatement:
      "Quantifie l'impact monétaire des 7 gaspillages Lean (Muda) — surproduction, attente, transport, stock, mouvement, sur-traitement et défauts — en traduisant les inefficacités opérationnelles en termes financiers directs sur lesquels la direction peut agir.\n\nLe suivi traditionnel des gaspillages se limite à compter les défauts ou à mesurer les heures d'arrêt. Cet outil convertit chaque catégorie de gaspillage en coût périodique, perte annualisée, ratio déchets/revenus et scores de priorité ajustés au risque. Il classe quelle catégorie Muda coûte le plus cher et où le kaizen offrira le meilleur retour.\n\nExemple : Une usine avec 50 unités de surproduction, 20 heures d'attente et 15 unités défectueuses sur 30 jours découvre que l'attente et les défauts représentent 62% du coût total des déchets de 28 500 €. L'outil priorise la réduction des défauts avec un score de 4,2/5 et projette 17 700 € d'économies annuelles.\n\nLes directeurs de production, coordinateurs Lean et chefs d'usine utilisent cet analyseur pour traduire le Muda en indicateurs financiers prêts pour le conseil d'administration, prioriser les investissements d'amélioration par ROI et suivre la réduction du ratio déchets/revenus sur des périodes consécutives.",
  },
  "hydraulic-cylinder-tonnage-power-calculator": {
    title: "Calculateur de tonnage et puissance de vérin hydraulique",
    painStatement:
      "Le dimensionnement des vérins hydrauliques pour le tonnage et la puissance moteur nécessite des calculs simultanés de force, vitesse et puissance. Un mauvais rapport tige/course peut provoquer un flambage catastrophique.",
  },
  "compressor-power-air-flow-calculator": {
    title: "Calculateur de puissance compresseur et débit d'air",
    painStatement:
      "Les calculs de puissance de compresseur sans exposant polytropique correct et correction multi-étages conduisent à des moteurs surdimensionnés ou sous-dimensionnés.",
  },
  "cutting-parameters-power-calculator": {
    title: "Calculateur de paramètres de coupe et puissance",
    painStatement:
      "La sélection manuelle des paramètres de coupe laisse l'utilisation machine sous 60% et provoque une usure d'outil évitable.",
  },
  "evaporative-cooling-capacity-calculator": {
    title: "Calculateur de capacité de refroidissement évaporatif (FES)",
    painStatement:
      "Le dimensionnement d'un système de refroidissement évaporatif nécessite un calcul psychrométrique et l'efficacité du pad — leur absence mène à un refroidissement inadéquat.",
  },
  "condenser-precooling-savings-calculator": {
    title: "Économies d'énergie pré-refroidissement (adiabatique) condenseur",
    painStatement:
      "Sans analyse du pré-refroidissement du condenseur, vous ne pouvez pas quantifier les économies d'énergie du refroidissement adiabatique.",
  },
  "pad-media-psychrometric-calculator": {
    title: "Analyse psychrométrique de média de pad",
    painStatement:
      "L'efficacité du média de pad dépend de l'épaisseur, de la vitesse d'air et des conditions psychrométriques — la consultation manuelle fait perdre des heures.",
  },
  "fgas-leak-co2-calculator": {
    title: "Calculateur de fuite de gaz F et équivalent CO₂",
    painStatement:
      "La quantification des fuites de gaz F nécessite le calcul du PRG et des vérifications de conformité réglementaire.",
  },
  "water-footprint-calculator": {
    title: "Calculateur d'empreinte eau",
    painStatement:
      "L'analyse de l'empreinte eau sans distinction eau bleue/verte/grise cache le véritable impact environnemental.",
  },
  "shev-smoke-exhaust-calculator": {
    title: "Calculateur de dimensionnement désenfumage (SHEV)",
    painStatement:
      "Le dimensionnement du désenfumage selon EN 12101-5 nécessite des calculs de débit massique et de surface.",
  },
  "natural-ventilation-ach-calculator": {
    title: "Calculateur de besoin de ventilation naturelle (ACH)",
    painStatement:
      "Le dimensionnement de la ventilation naturelle nécessite des calculs d'écoulement par convection naturelle.",
  },
  "compound-interest-calculator": {
    title: "Calculateur d'intérêts composés (détaillé)",
    painStatement:
      "Les calculs d'intérêts composés sans ajustement de la fréquence de composition donnent des projections de valeur future trompeuses.",
  },
  "living-wage-calculator": {
    title: "Calculateur de salaire vital",
    painStatement:
      "Le calcul du coût employeur réel par employé nécessite l'agrégation du salaire brut, des heures sup, des charges sociales, des taxes et des allocations.",
  },
  "panel-radiator-heating-capacity-calculator": {
    title: "Calculateur de capacité de chauffage radiateur panneau",
    painStatement:
      "Le dimensionnement d'un radiateur panneau nécessite le calcul des déperditions thermiques de la pièce et la correction de la puissance du radiateur pour températures non standard.",
  },
  "underfloor-heating-design-calculator": {
    title: "Calculateur de conception de chauffage par le sol",
    painStatement:
      "La conception du chauffage par le sol selon EN 1264 nécessite un calcul itératif de température de surface et de nombre de circuits.",
  },
  "solar-tube-collector-sizing-calculator": {
    title: "Calculateur de dimensionnement de capteur solaire",
    painStatement:
      "Le dimensionnement d'un capteur solaire nécessite l'équilibrage entre la demande d'eau chaude, la surface du capteur, le stockage et l'appoint auxiliaire.",
  },
  "epq-production-quantity-calculator": {
    title: "Calculateur EPQ (Quantité Économique de Production)",
    painStatement:
      "La formule classique EOQ ignore les taux de production finis, surestimant les tailles de lot.",
  },
  "kanban-bin-card-calculator": {
    title: "Calculateur de nombre de bacs/cartes Kanban",
    painStatement:
      "Définir le bon nombre de cartes Kanban équilibre le risque de rupture et l'en-cours via la demande et le délai.",
  },
  "littles-law-calculator": {
    title: "Calculateur de la loi de Little (WIP)",
    painStatement:
      "Étant donnés deux des trois paramètres WIP/CT/TH, calculez le troisième et traduisez le WIP en exposition financière.",
  },
  "milk-run-route-calculator": {
    title: "Calculateur d'optimisation de tournée Milk Run",
    painStatement:
      "La logistique Milk Run doit équilibrer distance fournisseur, capacité, temps de chargement et coûts conducteur.",
  },
  "cpm-pert-calculator": {
    title: "Calculateur CPM/PERT (chemin critique)",
    painStatement:
      "L'analyse PERT avec temps optimistes/probables/pessimistes donne des estimations probabilistes d'achèvement de projet.",
  },
  "queuing-mm1-calculator": {
    title: "Calculateur de théorie des files d'attente (M/M/1)",
    painStatement:
      "L'analyse des files d'attente sans modélisation des taux d'arrivée et de service conduit à des opérations sous- ou sur-personnelisées.",
  },
  "fmea-rpn-calculator": {
    title: "Calculateur RPN (Indice de Priorité du Risque) FMEA",
    painStatement:
      "Le calcul manuel du RPN FMEA manque la priorisation interservice des risques.",
  },
  "doe-factorial-design-calculator": {
    title: "Calculateur de plan factoriel (DOE)",
    painStatement:
      "Les plans d'expériences nécessitent un plan factoriel correct avec points centraux et blocage.",
  },
  "reliability-block-calculator": {
    title: "Calculateur de bloc de fiabilité (RBD/MTBF)",
    painStatement:
      "Les calculs de fiabilité pour systèmes série/parallèle nécessitent l'agrégation MTBF et MTTR.",
  },
  "niosh-lifting-calculator": {
    title: "Calculateur de levage NIOSH (révisé)",
    painStatement:
      "L'équation de levage NIOSH nécessite des multiplicateurs horizontaux/verticaux/préhension/fréquence.",
  },
  "reba-rapid-body-assessment-calculator": {
    title: "REBA (Rapid Entire Body Assessment)",
    painStatement:
      "La notation ergonomique REBA selon Hignett & McAtamney nécessite une notation groupe A et groupe B.",
  },
  "rcm-decision-calculator": {
    title: "Calculateur de décision RCM (Maintenance Centrée sur la Fiabilité)",
    painStatement:
      "L'analyse décisionnelle RCM compare les coûts de maintenance planifiée vs non planifiée.",
  },
  "pareto-root-cause-calculator": {
    title: "Calculateur d'analyse de Pareto / causes racines",
    painStatement:
      "L'analyse de Pareto (80/20) sans tri par pourcentage cumulé manque les causes racines vitales peu nombreuses.",
  },
  "value-added-process-analyzer": {
    title: "Analyseur de ratio VAP (Processus à Valeur Ajoutée)",
    painStatement:
      "L'analyse VAP sépare le temps à valeur ajoutée du temps sans valeur ajoutée.",
  },
  "kaizen-event-tracker": {
    title: "Suivi d'événement Kaizen / d'économies de coûts",
    painStatement:
      "Le suivi ROI d'événement Kaizen nécessite des métriques avant/après sur le temps de cycle, le taux de rebut et les temps d'arrêt.",
  },
  "fives-audit-scoring-calculator": {
    title: "Calculateur de notation d'audit 5S",
    painStatement:
      "La notation d'audit 5S nécessite le classement de chaque catégorie S avec des critères d'évaluation cohérents.",
  },
};

export const ES_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {
  "cnc-oee-loss": {
    title: "Informe OEE y pérdida de tiempo CNC",
    painStatement:
      "Las paradas de máquina, el desperdicio y el alargamiento del ciclo erosionan el margen antes de que se acepte la cotización.",
  },
  "logistics-route-loss": {
    title: "Informe de pérdida de ruta y viajes en vacío logísticos",
    painStatement:
      "Los kilómetros en vacío, la variación de combustible y los retrasos erosionan el margen de flete antes de aceptar la carga.",
  },
  "energy-peak-cost": {
    title: "Informe de pico de demanda y pérdida de eficiencia energética",
    painStatement:
      "La demanda punta, el exceso de kWh y la deriva tarifaria inflan la factura más allá de la lectura visible del medidor.",
  },
  "food-waste-margin-loss": {
    title: "Calculadora de pérdida de margen por desperdicio alimentario",
    painStatement:
      "Las operaciones alimentarias pueden perder margen por desperdicio, porciones excesivas y deterioro antes de que la pérdida aparezca en los informes de ventas.",
  },
  "construction-project-overrun": {
    title: "Calculadora de sobrecosto de proyecto de construcción",
    painStatement:
      "Los proyectos de construcción pierden dinero cuando la deriva de mano de obra, los días de retraso y el sobrecosto de material no se cotizan antes de la ejecución.",
  },
  "sheet-metal-scrap-risk": {
    title: "Calculadora de riesgo de desperdicio en chapa metálica",
    painStatement:
      "Los trabajos de chapa pierden margen cuando el desperdicio de corte, errores de doblado y retrabajo de acabado no se cotizan antes de ofertar.",
  },
  "restaurant-menu-margin-leak": {
    title: "Calculadora de fuga de margen del menú de restaurante",
    painStatement:
      "Los restaurantes pierden margen cuando el costo de alimentos, las comisiones de plataforma, el desperdicio y la deriva de porciones no se miden en conjunto.",
  },
  "construction-subcontractor-margin-leak": {
    title: "Calculadora de fuga de margen de subcontratista",
    painStatement:
      "Las constructoras pierden margen cuando los extras de subcontratistas, reclamos por retraso y variación de material no se controlan.",
  },
  "logistics-fuel-route-drift": {
    title: "Calculadora de deriva de combustible y ruta",
    painStatement:
      "Las rutas logísticas pierden dinero cuando la deriva de combustible, el ralentí y la desviación de ruta se tratan como costo normal.",
  },
  "energy-compressor-leak-cost": {
    title: "Calculadora de costo de fuga de compresor",
    painStatement:
      "Las fugas de aire comprimido convierten la electricidad en un costo de producción invisible.",
  },
  "cloud-api-cost-overrun": {
    title: "Calculadora de sobrecosto de cloud y API",
    painStatement:
      "Los productos cloud y API pierden margen cuando las llamadas, tokens, almacenamiento y cómputo crecen más rápido que los ingresos.",
  },
  "agriculture-irrigation-yield-loss": {
    title: "Calculadora de pérdida de rendimiento por riego",
    painStatement:
      "Las explotaciones pierden rendimiento cuando el costo de riego, el déficit hídrico y la tonelada esperada no se miden en conjunto.",
  },
  "cnc-tool-wear-cost": {
    title: "Calculadora de costo de desgaste de herramienta CNC",
    painStatement:
      "Los trabajos CNC pierden margen cuando el desgaste de herramienta, las plaquetas, el refrigerante y el tiempo de parada por cambio no se asignan por pieza.",
  },
  "textile-fabric-waste-risk": {
    title: "Calculadora de riesgo de desperdicio textil",
    painStatement:
      "La producción textil pierde margen por desperdicio de corte, encogimiento, pérdida de tinte y deriva de consumo de tela.",
  },
  "printing-reprint-margin-leak": {
    title: "Calculadora de fuga de margen por reimpresión",
    painStatement:
      "Los trabajos de impresión y señalización pierden beneficio por reimpresión, revisión de diseño, deriva de tinta y retrabajo de instalación.",
  },
  "auto-repair-comeback-cost": {
    title: "Calculadora de costo de trabajo repetido en taller auto",
    painStatement:
      "Los talleres pierden margen cuando el tiempo de diagnóstico, la manipulación de piezas y los trabajos repetidos no se cotizan en tarifa plana.",
  },
  "hvac-callback-margin-risk": {
    title: "Calculadora de riesgo de margen por devolución HVAC",
    painStatement:
      "Los proyectos HVAC pierden margen cuando la deriva de ductos, el tiempo de puesta en marcha y el riesgo de devolución no se cotizan.",
  },
  "electrical-panel-rework-cost": {
    title: "Calculadora de costo de retrabajo de panel eléctrico",
    painStatement:
      "Los electricistas pierden dinero cuando el cableado del panel, las pruebas, el fallo de inspección y las horas de retrabajo no se cotizan.",
  },
  "plumbing-leak-callback-cost": {
    title: "Calculadora de costo de devolución por fuga de plomería",
    painStatement:
      "Los trabajos de plomería pierden margen cuando las devoluciones por fuga, las salidas de material y las visitas de garantía no se cotizan.",
  },
  "roofing-weather-delay-risk": {
    title: "Calculadora de riesgo de retraso climático en techado",
    painStatement:
      "Los trabajos de techado pierden margen cuando el retraso climático, las tarifas de vertedero y la reserva de garantía no se incluyen en el precio contractual.",
  },
  "painting-rework-coverage-risk": {
    title: "Calculadora de riesgo de retrabajo y cobertura en pintura",
    painStatement:
      "Los trabajos de pintura pierden margen cuando el tiempo de preparación, la deriva de cobertura, el tiempo de andamio y el retoque se subestiman.",
  },
  "dairy-feed-efficiency-loss": {
    title: "Calculadora de pérdida de eficiencia de alimentación lechera",
    painStatement:
      "Las explotaciones lecheras pierden margen cuando el costo del alimento sube más rápido que el rendimiento de leche.",
  },
  "retail-inventory-turnover-risk": {
    title: "Calculadora de riesgo de rotación de inventario retail",
    painStatement:
      "Los minoristas pierden efectivo cuando el inventario lento, los descuentos y el costo de mantenimiento no se miden en conjunto.",
  },
  "warehouse-space-cost-leak": {
    title: "Calculadora de fuga de costo de espacio en almacén",
    painStatement:
      "Las operaciones de almacén pierden dinero cuando el espacio sin usar, los pallets lentos y la deriva de manipulación se tratan como gasto general normal.",
  },
  "calibration-drift-risk": {
    title: "Calculadora de riesgo de deriva de calibración",
    painStatement:
      "La deriva de medición genera desperdicio, rechazo y riesgo de cumplimiento antes de que el problema sea visible en producción.",
  },
  "legal-interest-fee-calculator-pro": {
    title: "Calculadora de exposición a intereses y honorarios legales",
    painStatement:
      "Los casos legales y de cobranza pierden claridad de decisión cuando intereses, retrasos y exposición a honorarios no se resumen en conjunto.",
  },
  "carbon-footprint-compliance-risk": {
    title: "Calculadora de riesgo de cumplimiento de huella de carbono",
    painStatement:
      "Exportadores y fabricantes pueden subestimar la exposición al carbono cuando las suposiciones de energía, combustible y precio del carbono no están conectadas.",
  },
  "quote-price-profit-margin-calculator": {
    title: "Calculadora de precio de cotización y margen de beneficio",
    painStatement:
      "Las cotizaciones suelen omitir desperdicio, preparación, costo de plazo de pago y carga energética antes de fijar el margen.",
  },
  "shop-rate-hourly-cost-calculator": {
    title: "Calculadora de tarifa horaria de máquina",
    painStatement:
      "La mayoría de los talleres estiman la tarifa solo con mano de obra y electricidad, subestimando la carga horaria real.",
  },
  "break-even-safety-margin-calculator": {
    title: "Calculadora de punto de equilibrio y margen de seguridad",
    painStatement:
      "Los propietarios suelen conocer ganancia o pérdida solo cuando llegan los estados de fin de mes.",
  },
  "auto-repair-parts-labor-quote-calculator": {
    title: "Calculadora de cotización de piezas y mano de obra auto",
    painStatement:
      "Las cotizaciones de reparación varían según el técnico y el formato, lo que dificulta la consistencia de precios.",
  },
  "cbam-unit-product-carbon-footprint-calculator": {
    title: "Calculadora de huella de carbono unitaria de producto CBAM",
    painStatement:
      "Los exportadores necesitan evidencia de carbono a nivel de producto pero carecen de herramientas asequibles.",
  },
  "oee-equipment-effectiveness-calculator": {
    title: "Calculadora OEE",
    painStatement:
      "Sin seguimiento OEE, las paradas crónicas y la pérdida de calidad permanecen invisibles.",
  },
  "compressor-leak-cost-calculator": {
    title: "Calculadora de costo de fuga de compresor",
    painStatement:
      "Las fugas de aire comprimido convierten la electricidad en un costo de producción invisible.",
  },
  "employee-total-cost-calculator": {
    title: "Calculadora de costo total del empleado",
    painStatement:
      "Las decisiones de contratación y precios suelen usar el salario neto en lugar del costo total del empleador.",
  },
  "downtime-minute-cost-calculator": {
    title: "Calculadora de costo por minuto de parada",
    painStatement:
      "Los presupuestos de mantenimiento ignoran el costo de oportunidad de las máquinas que no producen.",
  },
  "product-customer-profitability-calculator": {
    title: "Calculadora de rentabilidad de producto y cliente",
    painStatement:
      "Los clientes de alto ingreso pueden destruir el margen por devoluciones, retrasos y retrabajo.",
  },
  "inventory-carrying-cost-eoq-calculator": {
    title: "Calculadora de costo de mantenimiento de inventario y EOQ",
    painStatement:
      "El costo de inventario se subestima cuando solo se cuenta el alquiler del almacén.",
  },
  "welded-bolted-connection-calculator": {
    title: "Calculadora de conexiones soldadas y atornilladas",
    painStatement:
      "El dimensionamiento de conexiones depende de estimaciones sin verificación estructural rápida.",
  },
  "tolerance-stack-up-calculator": {
    title: "Calculadora de acumulación de tolerancias",
    painStatement:
      "Los problemas de ajuste suelen provenir de tolerancias acumuladas sin una cadena de verificación documentada.",
  },
  "bolt-tightening-torque-calculator": {
    title: "Calculadora de torque de apriete de pernos",
    painStatement:
      "Los equipos de ensamblaje estiman el torque sin un método documentado de fuerza de sujeción.",
  },
  "fire-system-flow-hydrant-calculator": {
    title: "Calculadora de caudal de sistema contra incendios e hidrante",
    painStatement:
      "Las ofertas de protección contra incendios omiten la demanda de caudal antes del dimensionamiento de hidrantes y tuberías.",
  },
  "hydraulic-pneumatic-cylinder-force-calculator": {
    title: "Calculadora de fuerza de cilindro hidráulico y neumático",
    painStatement:
      "La selección de cilindros suele omitir verificaciones de fuerza antes de comprar el actuador.",
  },
  "quality-cost-paf-calculator": {
    title: "Calculadora de costo de calidad PAF",
    painStatement:
      "Los presupuestos de calidad ocultan el gasto en prevención y evaluación hasta que los costos de fallo se disparan.",
  },
  "pressure-vessel-wall-thickness-calculator": {
    title: "Calculadora de espesor de pared de recipiente a presión",
    painStatement:
      "Los fabricantes necesitan una verificación rápida de espesor antes de los cálculos ASME detallados.",
  },
  "value-stream-map-vsm-calculator": {
    title: "Calculadora de mapa de flujo de valor VSM",
    painStatement:
      "El tiempo de entrega se oculta en colas y transporte mientras los equipos solo miden el tiempo de procesamiento.",
  },
  "energy-savings-package-calculator": {
    title: "Calculadora de paquete de ahorro energético",
    painStatement:
      "Los proyectos de eficiencia avanzan sin una base documentada de ahorro y retorno de inversión.",
  },
  "investment-payback-npv-calculator": {
    title: "Calculadora de retorno de inversión y VPN",
    painStatement:
      "Las solicitudes de capital suelen mostrar el retorno sin tasa de descuento ni horizonte temporal.",
  },
  "annual-leave-severance-notice-calculator": {
    title: "Calculadora de vacaciones, indemnización y preaviso",
    painStatement:
      "Los costos de salida laboral suelen subestimarse hasta la revisión de nómina y legal.",
  },
  "belt-pulley-speed-length-calculator": {
    title: "Calculadora de velocidad y longitud de correa y polea",
    painStatement:
      "Los cambios de transmisión se dimensionan de memoria en lugar de velocidad y longitud de correa documentadas.",
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    title: "Puntuación auditoría 5S – conversor de costo de pérdida de eficiencia",
    painStatement:
      "Convierte las puntuaciones de auditoría 5S en pérdidas monetarias reales debidas a la desorganización del lugar de trabajo, el tiempo de búsqueda y los flujos de trabajo ineficientes, haciendo visible para la dirección el caso financiero de la organización del lugar de trabajo.\n\nLa mayoría de las fábricas realizan un seguimiento de las puntuaciones 5S pero no pueden responder: \"¿Cuánto dinero estamos perdiendo debido a una puntuación 5S baja?\" Esta herramienta modela el porcentaje de pérdida de eficiencia basado en la brecha entre la puntuación 5S actual y la objetivo, y lo multiplica por el costo total de capacidad laboral para revelar el drenaje financiero mensual de una mala organización del lugar de trabajo.\n\nEjemplo: Un departamento con 50 empleados, puntuación 5S actual de 38/100, objetivo de 87/100 y costo laboral de 35 €/hora descubre una pérdida de eficiencia mensual de 34.496 €. Mejorar hasta la puntuación objetivo recupera 25.168 € mensuales — una oportunidad anual de 302.000 €.\n\nLos gerentes Lean, supervisores de producción y equipos de mejora continua utilizan este conversor para demostrar el ROI de las iniciativas 5S, establecer objetivos de mejora basados en datos y comunicar el valor de la organización del lugar de trabajo en términos financieros que la dirección entiende.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "Calculadora de costo de soportes 3D y postproceso",
    painStatement:
      "Calcula el costo total de las estructuras de soporte y la mano de obra de postprocesamiento para piezas impresas en 3D, revelando los gastos ocultos que se excluyen sistemáticamente de los presupuestos de fabricación aditiva.\n\nLas estimaciones de costos de fabricación aditiva a menudo se centran en el tiempo de construcción y el material del modelo, ignorando el consumo de material de soporte, la mano de obra de extracción y el acabado de superficies. Esta herramienta agrega el costo del volumen de soporte, la mano de obra de extracción y el costo de postprocesamiento por lote en un total que a menudo añade un 30-60% al costo aparente de la pieza.\n\nEjemplo: Una pieza con 20 cm³ de volumen de soporte a 0,05 €/cm³ y 15 minutos de limpieza a 25 €/hora tiene un costo de postprocesamiento de 12,25 €. En un lote de 10, el postprocesamiento añade solo 1,23 € por pieza. Pero un lote de una sola pieza con 60 cm³ de soporte y 45 minutos de limpieza aumenta a 46,50 € — a menudo más que el costo de fabricación.\n\nLos ingenieros de fabricación aditiva, propietarios de talleres y especialistas en presupuestos utilizan esta calculadora para construir modelos de costos completos, optimizar la orientación de las piezas para un soporte mínimo y garantizar que cada presupuesto cubra el costo total del postprocesamiento.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "Calculadora de optimización de lote y anidamiento 3D",
    painStatement:
      "Optimiza la utilización de la placa de impresión 3D calculando el número máximo de piezas por lote basado en las dimensiones de la caja delimitadora, el tamaño de la cama y la eficiencia del anidamiento — traduciendo los porcentajes de utilización en costo por pieza.\n\nLa utilización de la placa de impresión es la palanca más importante para la rentabilidad de la fabricación aditiva, pero la mayoría de los operadores la estiman a ojo. Esta herramienta calcula el ajuste exacto del anidamiento rectangular, el porcentaje de utilización y las horas máquina por pieza, revelando el impacto real en los costos del embalaje ineficiente de la cama.\n\nEjemplo: Una cama de 200×200 mm con piezas de 50×50 mm puede albergar 12 piezas por lote al 75% de utilización con una impresión de 8 horas. Cada pieza cuesta 0,67 horas máquina. Un mal anidamiento que solo alberga 8 piezas aumenta las horas máquina a 1,0 por pieza — un aumento de costo del 50% que reduce directamente el margen.\n\nLos ingenieros de fabricación aditiva y los planificadores de producción utilizan este optimizador para maximizar el tamaño del lote, reducir los costos de máquina por pieza y tomar decisiones basadas en datos sobre la orientación de construcción y la estrategia de anidamiento de múltiples piezas.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "Calculadora de punto de equilibrio 3D vs mecanizado",
    painStatement:
      "Determina la cantidad de producción exacta en la que la impresión 3D se vuelve más económica que el mecanizado CNC (o viceversa), utilizando un análisis de punto de equilibrio de los costos de configuración y los costos unitarios de ambos métodos de fabricación.\n\nElegir entre fabricación aditiva y mecanizado sustractivo es una de las decisiones de producción más comunes en la fabricación moderna. Sin una comparación basada en datos, los equipos actúan por hábito — pagando de más por aditivo en volúmenes altos o por mecanizado en volúmenes bajos. Esta herramienta calcula la cantidad de cruce, las curvas de costo total y la diferencia de costo en cualquier volumen especificado.\n\nEjemplo: Con impresión 3D a 100 € de configuración y 5 €/pieza, y mecanizado a 500 € de configuración y 2 €/pieza, la cantidad de equilibrio es de 134 piezas. Por debajo de 134 unidades, la impresión es más barata; por encima, gana el mecanizado. A 100 unidades, la impresión cuesta 600 € frente a 700 € del mecanizado.\n\nLos ingenieros de fabricación, planificadores de producción y gerentes de abastecimiento utilizan este analizador de punto de equilibrio para seleccionar objetivamente el proceso de fabricación más rentable para cualquier cantidad de producción, eliminando conjeturas y reduciendo los costos por pieza.",
  },
  "cbam-exposure-quick-check": {
    title: "Verificación rápida de exposición CBAM",
    painStatement:
      "Emisiones incorporadas, precio del certificado y tipo de cambio – sin combinarlos, el costo CBAM queda incompleto.",
  },
  "cbam-compliance-verdict": {
    title: "Evaluación de preparación para cumplimiento CBAM",
    painStatement:
      "Sin medir conjuntamente emisiones declaradas, cobertura de certificados e integridad de datos, el riesgo de preparación CBAM se detecta tarde.",
  },
  "7-israf-muda-avcisi-parasal-karsilik-calculator": {
    title: "Calculadora de impacto monetario de los 7 desperdicios (Muda)",
    painStatement:
      "Cuantifica el impacto monetario de los 7 desperdicios Lean (Muda) — sobreproducción, espera, transporte, inventario, movimiento, sobreprocesamiento y defectos — traduciendo las ineficiencias operativas en términos financieros directos sobre los que la dirección puede actuar.\n\nEl seguimiento tradicional de desperdicios se limita a contar defectos o medir horas de parada. Esta herramienta convierte cada categoría de desperdicio en costo periódico, pérdida anualizada, ratio desperdicio/ingresos y puntuaciones de prioridad ajustadas al riesgo. Clasifica qué categoría Muda cuesta más y dónde el kaizen generará el mayor retorno.\n\nEjemplo: Una fábrica con 50 unidades de sobreproducción, 20 horas de espera y 15 unidades defectuosas en 30 días descubre que la espera y los defectos representan el 62% del costo total de desperdicio de 28.500 €. La herramienta prioriza la reducción de defectos con una puntuación de 4.2/5 y proyecta un ahorro anual de 17.700 €.\n\nLos directores de producción, coordinadores Lean y jefes de planta utilizan este analizador para traducir Muda en métricas financieras listas para la dirección, priorizar inversiones de mejora por ROI y realizar un seguimiento de la reducción del ratio desperdicio/ingresos en períodos consecutivos.",
  },
  "hydraulic-cylinder-tonnage-power-calculator": {
    title: "Calculadora de tonelaje y potencia de cilindro hidráulico",
    painStatement:
      "El dimensionamiento de cilindros hidráulicos para tonelaje y potencia del motor requiere cálculos simultáneos de fuerza, velocidad y potencia. Omitir la relación vástago/carrera puede causar un fallo catastrófico por pandeo.",
  },
  "compressor-power-air-flow-calculator": {
    title: "Calculadora de potencia de compresor y flujo de aire",
    painStatement:
      "Los cálculos de potencia del compresor sin el exponente politrópico correcto y la corrección multi-etapa conducen a motores sobredimensionados o subdimensionados.",
  },
  "cutting-parameters-power-calculator": {
    title: "Calculadora de parámetros de corte y potencia",
    painStatement:
      "La selección manual de parámetros de corte deja la utilización de la máquina por debajo del 60% y provoca desgaste de herramienta evitable.",
  },
  "evaporative-cooling-capacity-calculator": {
    title: "Calculadora de capacidad de enfriamiento evaporativo (FES)",
    painStatement:
      "El dimensionamiento de sistemas de enfriamiento evaporativo requiere cálculo psicrométrico y eficiencia del panel—omitirlos conduce a enfriamiento inadecuado.",
  },
  "condenser-precooling-savings-calculator": {
    title: "Ahorro energético de preenfriamiento (adiabático) de condensador",
    painStatement:
      "Sin análisis de preenfriamiento del condensador, no puede cuantificar el ahorro energético del enfriamiento adiabático.",
  },
  "pad-media-psychrometric-calculator": {
    title: "Análisis psicrométrico de medio de panel",
    painStatement:
      "La eficiencia del medio de panel depende del espesor, la velocidad del aire y las condiciones psicrométricas—la consulta manual pierde horas.",
  },
  "fgas-leak-co2-calculator": {
    title: "Calculadora de fuga de gases F y equivalente de CO₂",
    painStatement:
      "La cuantificación de fugas de gases F requiere cálculo de PCA y verificaciones de cumplimiento normativo.",
  },
  "water-footprint-calculator": {
    title: "Calculadora de huella hídrica",
    painStatement:
      "El análisis de la huella hídrica sin división en agua azul/verde/gris oculta el verdadero impacto ambiental.",
  },
  "shev-smoke-exhaust-calculator": {
    title: "Calculadora de dimensionamiento de extracción de humos (SHEV)",
    painStatement:
      "El dimensionamiento de extracción de humos según EN 12101-5 requiere cálculos de flujo másico y área.",
  },
  "natural-ventilation-ach-calculator": {
    title: "Calculadora de requerimiento de ventilación natural (ACH)",
    painStatement:
      "El dimensionamiento de ventilación natural requiere cálculos de flujo por convección natural.",
  },
  "compound-interest-calculator": {
    title: "Calculadora de interés compuesto (detallada)",
    painStatement:
      "Los cálculos de interés compuesto sin ajuste de frecuencia de capitalización dan proyecciones de valor futuro engañosas.",
  },
  "living-wage-calculator": {
    title: "Calculadora de salario digno",
    painStatement:
      "Calcular el costo real del empleador por empleado requiere agregar salario bruto, horas extra, cotizaciones sociales, impuestos y asignaciones.",
  },
  "panel-radiator-heating-capacity-calculator": {
    title: "Calculadora de capacidad de calefacción de radiador de panel",
    painStatement:
      "Dimensionar un radiador de panel requiere cálculo de pérdida de calor de la habitación y corrección de potencia del radiador para temperaturas no estándar.",
  },
  "underfloor-heating-design-calculator": {
    title: "Calculadora de diseño de calefacción por suelo radiante",
    painStatement:
      "El diseño de calefacción por suelo radiante según EN 1264 requiere cálculo iterativo de temperatura del suelo y número de circuitos.",
  },
  "solar-tube-collector-sizing-calculator": {
    title: "Calculadora de dimensionamiento de colector solar",
    painStatement:
      "El dimensionamiento de colectores solares requiere equilibrar la demanda de agua caliente, el área del colector, el almacenamiento y el respaldo auxiliar.",
  },
  "epq-production-quantity-calculator": {
    title: "Calculadora EPQ (Cantidad Económica de Producción)",
    painStatement:
      "La fórmula clásica EOQ ignora las tasas de producción finitas, sobreestimando los tamaños de lote.",
  },
  "kanban-bin-card-calculator": {
    title: "Calculadora de número de contenedores/tarjetas Kanban",
    painStatement:
      "Establecer el número correcto de tarjetas Kanban equilibra el riesgo de desabastecimiento y el WIP a través de la demanda y el plazo de entrega.",
  },
  "littles-law-calculator": {
    title: "Calculadora de la ley de Little (WIP)",
    painStatement:
      "Dados dos de tres parámetros WIP/CT/TH, calcule el tercero y traduzca el WIP en exposición financiera.",
  },
  "milk-run-route-calculator": {
    title: "Calculadora de optimización de ruta Milk Run",
    painStatement:
      "La logística Milk Run debe equilibrar la distancia del proveedor, la capacidad, el tiempo de carga y los costos del conductor.",
  },
  "cpm-pert-calculator": {
    title: "Calculadora CPM/PERT (ruta crítica)",
    painStatement:
      "El análisis PERT con tiempos optimistas/más probables/pesimistas proporciona estimaciones probabilísticas de finalización del proyecto.",
  },
  "queuing-mm1-calculator": {
    title: "Calculadora de teoría de colas (M/M/1)",
    painStatement:
      "El análisis de colas sin modelado de tasas de llegada y servicio conduce a operaciones con personal insuficiente o excesivo.",
  },
  "fmea-rpn-calculator": {
    title: "Calculadora de NPR (Número Prioritario de Riesgo) FMEA",
    painStatement:
      "El cálculo manual de NPR FMEA omite la priorización de riesgos interdepartamental.",
  },
  "doe-factorial-design-calculator": {
    title: "Calculadora de diseño factorial DOE",
    painStatement:
      "El diseño de experimentos requiere un diseño factorial adecuado con puntos centrales y bloqueo.",
  },
  "reliability-block-calculator": {
    title: "Calculadora de bloque de confiabilidad (RBD/MTBF)",
    painStatement:
      "Los cálculos de confiabilidad para sistemas en serie/paralelo requieren agregación de MTBF y MTTR.",
  },
  "niosh-lifting-calculator": {
    title: "Calculadora de levantamiento NIOSH (revisada)",
    painStatement:
      "La ecuación de levantamiento NIOSH requiere multiplicadores horizontales/verticales/agarre/frecuencia.",
  },
  "reba-rapid-body-assessment-calculator": {
    title: "REBA (Evaluación Rápida de Cuerpo Entero)",
    painStatement:
      "La puntuación ergonómica REBA según Hignett & McAtamney requiere puntuación del grupo A y grupo B.",
  },
  "rcm-decision-calculator": {
    title: "Calculadora de decisión RCM (Mantenimiento Centrado en Confiabilidad)",
    painStatement:
      "El análisis de decisión RCM compara costos de mantenimiento planificado vs no planificado.",
  },
  "pareto-root-cause-calculator": {
    title: "Calculadora de análisis de Pareto/causa raíz",
    painStatement:
      "El análisis de Pareto (80/20) sin ordenación de porcentaje acumulativo pierde las pocas causas raíz vitales.",
  },
  "value-added-process-analyzer": {
    title: "Analizador de relación de proceso de valor agregado (VAP)",
    painStatement:
      "El análisis de relación VAP separa el tiempo de valor agregado del tiempo sin valor agregado.",
  },
  "kaizen-event-tracker": {
    title: "Rastreador de eventos Kaizen / ahorro de costos",
    painStatement:
      "El seguimiento del ROI de eventos Kaizen requiere métricas antes/después de tiempo de ciclo, tasa de desperdicio y tiempo de inactividad.",
  },
  "fives-audit-scoring-calculator": {
    title: "Calculadora de puntuación de auditoría 5S",
    painStatement:
      "La puntuación de auditoría 5S requiere clasificar cada categoría S con criterios de calificación consistentes.",
  },
};

export const AR_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {
  "cnc-oee-loss": {
    title: "تقرير كفاءة المعدات الشاملة وفقدان الوقت في التصنيع باستخدام الحاسب الآلي",
    painStatement:
      "توقف الآلات والهدر وإطالة دورة الإنتاج تآكل الهامش قبل قبول عرض السعر.",
  },
  "logistics-route-loss": {
    title: "تقرير خسائر المسار والرحلات الفارغة في الخدمات اللوجستية",
    painStatement:
      "الكيلومترات الفارغة وتباين الوقود والتأخيرات تآكل هامش الشحن قبل قبول الحمولة.",
  },
  "energy-peak-cost": {
    title: "تقرير ذروة الطلب وفقدان كفاءة الطاقة",
    painStatement:
      "ذروة الطلب والاستهلاك الزائد بالكيلوواط ساعة وانحراف التعريفة يرفع الفاتورة فوق قراءة العداد الظاهرة.",
  },
  "food-waste-margin-loss": {
    title: "حاسبة فقدان الهامش بسبب هدر الغذاء",
    painStatement:
      "قد تفقد عمليات الأغذية هامش الربح بسبب الهدر والحصص الزائدة والتلف قبل أن يظهر الخسارة في تقارير المبيعات.",
  },
  "construction-project-overrun": {
    title: "حاسبة تجاوز تكاليف مشروع البناء",
    painStatement:
      "تخسر مشاريع البناء المال عندما لا تُسعَّر انحرافات العمالة وأيام التأخير وتجاوز المواد قبل التنفيذ.",
  },
  "sheet-metal-scrap-risk": {
    title: "حاسبة مخاطر هدر الصفائح المعدنية",
    painStatement:
      "تفقد أعمال الصفائح المعدنية الهامش عندما لا تُسعَّر فضلات القص وأخطاء الثني وإعادة تشطيب السطح قبل تقديم العرض.",
  },
  "restaurant-menu-margin-leak": {
    title: "حاسبة تسرب هامش قائمة المطعم",
    painStatement:
      "تفقد المطاعم الهامش عندما لا تُقاس تكلفة المواد الغذائية ورسوم المنصات والهدر وانحراف الحصص معًا.",
  },
  "construction-subcontractor-margin-leak": {
    title: "حاسبة تسرب هامش المقاول من الباطن",
    painStatement:
      "تفقد شركات المقاولات الهامش عندما لا تُراقَب تكاليف المقاولين من الباطن الإضافية ومطالبات التأخير وتباين المواد.",
  },
  "logistics-fuel-route-drift": {
    title: "حاسبة انحراف الوقود والمسار",
    painStatement:
      "تخسر مسارات الخدمات اللوجستية المال عندما يُعامَل انحراف الوقود ووقت التشغيل الخامل وانحراف المسار كتكلفة طبيعية.",
  },
  "energy-compressor-leak-cost": {
    title: "حاسبة تكلفة تسرب ضاغط الهواء",
    painStatement:
      "تحوّل تسريبات الهواء المضغوط الكهرباء إلى تكلفة إنتاج غير مرئية.",
  },
  "cloud-api-cost-overrun": {
    title: "حاسبة تجاوز تكاليف السحابة وواجهات البرمجة",
    painStatement:
      "تفقد منتجات السحابة وواجهات البرمجة الهامش عندما تنمو الاستدعاءات والرموز والتخزين وقوة المعالجة أسرع من الإيرادات.",
  },
  "agriculture-irrigation-yield-loss": {
    title: "حاسبة فقدان الإنتاج بسبب الري",
    painStatement:
      "تفقد المزارع الإنتاج عندما لا تُقاس تكلفة الري ونقص المياه والطن المتوقع معًا.",
  },
  "cnc-tool-wear-cost": {
    title: "حاسبة تكلفة تآكل أدوات التصنيع باستخدام الحاسب الآلي",
    painStatement:
      "تفقد أعمال التصنيع باستخدام الحاسب الآلي الهامش عندما لا تُخصَّص تكاليف تآكل الأدوات والشفرات وسائل التبريد وتوقف تغيير الأداة لكل قطعة.",
  },
  "textile-fabric-waste-risk": {
    title: "حاسبة مخاطر هدر الأقمشة النسيجية",
    painStatement:
      "تفقد الإنتاج النسيجي الهامش عبر فضلات القص والانكماش وفقدان الصبغة وانحراف استهلاك القماش.",
  },
  "printing-reprint-margin-leak": {
    title: "حاسبة تسرب هامش إعادة الطباعة",
    painStatement:
      "تفقد أعمال الطباعة واللافتات الربح بسبب إعادة الطباعة ومراجعة التصميم وانحراف الحبر وإعادة العمل في التركيب.",
  },
  "auto-repair-comeback-cost": {
    title: "حاسبة تكلفة الأعمال المتكررة في ورش السيارات",
    painStatement:
      "تفقد ورش السيارات الهامش عندما لا تُسعَّر وقت التشخيص ومناولة القطع والأعمال المتكررة ضمن التعرفة الثابتة.",
  },
  "hvac-callback-margin-risk": {
    title: "حاسبة مخاطر هامش إعادة الزيارة في التكييف والتهوية",
    painStatement:
      "تفقد مشاريع التكييف والتهوية الهامش عندما لا تُسعَّر انحراف مجاري الهواء ووقت التشغيل التجريبي ومخاطر إعادة الزيارة.",
  },
  "electrical-panel-rework-cost": {
    title: "حاسبة تكلفة إعادة العمل في اللوحات الكهربائية",
    painStatement:
      "يخسر المقاولون الكهربائيون المال عندما لا تُسعَّر تمديدات اللوح والاختبار وفشل التفتيش وساعات إعادة العمل.",
  },
  "plumbing-leak-callback-cost": {
    title: "حاسبة تكلفة إعادة الزيارة بسبب التسرب في السباكة",
    painStatement:
      "تفقد أعمال السباكة الهامش عندما لا تُسعَّر إعادات الزيارة بسبب التسرب وجولات المواد وزيارات الضمان.",
  },
  "roofing-weather-delay-risk": {
    title: "حاسبة مخاطر تأخير الطقس في أعمال الأسقف",
    painStatement:
      "تفقد أعمال الأسقف الهامش عندما لا تُدرَج تأخيرات الطقس ورسوم التخلص ومخصص الضمان في سعر العقد.",
  },
  "painting-rework-coverage-risk": {
    title: "حاسبة مخاطر إعادة العمل والتغطية في الدهان",
    painStatement:
      "تفقد أعمال الدهان الهامش عندما يُستهان بوقت التحضير وانحراف التغطية ووقت السقالات وأعمال اللمس النهائي.",
  },
  "dairy-feed-efficiency-loss": {
    title: "حاسبة فقدان كفاءة علف الألبان",
    painStatement:
      "تفقد مزارع الألبان الهامش عندما ترتفع تكلفة العلف أسرع من إنتاج الحليب.",
  },
  "retail-inventory-turnover-risk": {
    title: "حاسبة مخاطر دوران المخزون في التجزئة",
    painStatement:
      "يفقد تجار التجزئة السيولة عندما لا تُقاس المخزونات البطيئة والتخفيضات وتكلفة الحمل معًا.",
  },
  "warehouse-space-cost-leak": {
    title: "حاسبة تسرب تكلفة مساحة المستودع",
    painStatement:
      "تخسر عمليات المستودعات المال عندما تُعامَل المساحة غير المستخدمة والمنصات البطيئة وانحراف المناولة كمصروفات عامة طبيعية.",
  },
  "calibration-drift-risk": {
    title: "حاسبة مخاطر انحراف المعايرة",
    painStatement:
      "ينشئ انحراف القياس الهدر والرفض ومخاطر الامتثال قبل أن تظهر المشكلة في الإنتاج.",
  },
  "legal-interest-fee-calculator-pro": {
    title: "حاسبة التعرض للفوائد والرسوم القانونية",
    painStatement:
      "تفقد القضايا القانونية والتحصيل وضوح القرار عندما لا تُلخَّص الفوائد والتأخيرات والتعرض للرسوم معًا.",
  },
  "carbon-footprint-compliance-risk": {
    title: "حاسبة مخاطر الامتثال لبصمة الكربون",
    painStatement:
      "قد يُقلِّل المصدرون والمصنعون من تقدير التعرض للكربون عندما لا تُربَط افتراضات الطاقة والوقود وسعر الكربون.",
  },
  "quote-price-profit-margin-calculator": {
    title: "حاسبة سعر العرض وهامش الربح",
    painStatement:
      "غالبًا ما تُهمل العروض الهدر ووقت الإعداد وتكلفة شروط الدفع وحمل الطاقة قبل تثبيت الهامش.",
  },
  "shop-rate-hourly-cost-calculator": {
    title: "حاسبة سعر الساعة للآلة",
    painStatement:
      "تقدّر معظم الورش سعر الساعة من العمالة والكهرباء فقط، مما يقلل من العبء الساعي الحقيقي.",
  },
  "break-even-safety-margin-calculator": {
    title: "حاسبة نقطة التعادل وهامش الأمان",
    painStatement:
      "غالبًا ما يعرف أصحاب الأعمال الربح أو الخسارة فقط بعد وصول كشوف نهاية الشهر.",
  },
  "auto-repair-parts-labor-quote-calculator": {
    title: "حاسبة عرض أسعار قطع الغيار والعمالة في إصلاح السيارات",
    painStatement:
      "تختلف عروض الإصلاح حسب الفني والنموذج، مما يصعّب اتساق الأسعار.",
  },
  "cbam-unit-product-carbon-footprint-calculator": {
    title: "حاسبة بصمة الكربون لكل وحدة منتج وفق آلية CBAM",
    painStatement:
      "يحتاج المصدرون إلى أدلة كربونية على مستوى المنتج لكنهم يفتقرون إلى أدوات ميسورة التكلفة.",
  },
  "oee-equipment-effectiveness-calculator": {
    title: "حاسبة كفاءة المعدات الشاملة",
    painStatement:
      "بدون تتبع كفاءة المعدات الشاملة، تبقى التوقفات المزمنة وفقدان الجودة غير مرئية.",
  },
  "compressor-leak-cost-calculator": {
    title: "حاسبة تكلفة تسرب الضاغط",
    painStatement:
      "تحوّل تسريبات الهواء المضغوط الكهرباء إلى تكلفة إنتاج غير مرئية.",
  },
  "employee-total-cost-calculator": {
    title: "حاسبة التكلفة الإجمالية للموظف",
    painStatement:
      "غالبًا ما تعتمد قرارات التوظيف والتسعير على صافي الراتب بدلًا من التكلفة الكاملة على صاحب العمل.",
  },
  "downtime-minute-cost-calculator": {
    title: "حاسبة تكلفة دقيقة التوقف",
    painStatement:
      "تتجاهل ميزانيات الصيانة تكلفة الفرصة الضائعة للآلات التي لا تنتج.",
  },
  "product-customer-profitability-calculator": {
    title: "حاسبة ربحية المنتج والعميل",
    painStatement:
      "قد يدمّر العملاء ذوو الإيرادات المرتفعة الهامش عبر المرتجعات والتأخيرات وإعادة العمل.",
  },
  "inventory-carrying-cost-eoq-calculator": {
    title: "حاسبة تكلفة حمل المخزون والكمية الاقتصادية للطلب",
    painStatement:
      "يُقلَّل تقدير تكلفة المخزون عندما يُحسب إيجار المستودع فقط.",
  },
  "welded-bolted-connection-calculator": {
    title: "حاسبة الوصلات الملحومة والمثبتة بالبراغي",
    painStatement:
      "يعتمد تحديد أبعاد الوصلات على التقدير دون فحص إنشائي سريع.",
  },
  "tolerance-stack-up-calculator": {
    title: "حاسبة تراكم التسامحات",
    painStatement:
      "غالبًا ما تنشأ مشاكل الملاءمة من تسامحات متراكمة دون سلسلة فحص موثقة.",
  },
  "bolt-tightening-torque-calculator": {
    title: "حاسبة عزم شد البراغي",
    painStatement:
      "تقدّر فرق التجميع العزم دون منهج موثق لقوة الضغط.",
  },
  "fire-system-flow-hydrant-calculator": {
    title: "حاسبة تدفق نظام الإطفاء والصنبور",
    painStatement:
      "تُهمل عروض الحماية من الحريق متطلبات التدفق قبل تحديد أبعاد الصنابير والأنابيب.",
  },
  "hydraulic-pneumatic-cylinder-force-calculator": {
    title: "حاسبة قوة الأسطوانة الهيدروليكية والهوائية",
    painStatement:
      "غالبًا ما تتخطى اختيار الأسطوانة فحوصات القوة قبل شراء المشغّل.",
  },
  "quality-cost-paf-calculator": {
    title: "حاسبة تكلفة الجودة وفق نموذج PAF",
    painStatement:
      "تخفي ميزانيات الجودة إنفاق الوقاية والتقييم حتى ترتفع تكاليف الفشل.",
  },
  "pressure-vessel-wall-thickness-calculator": {
    title: "حاسبة سماكة جدار وعاء الضغط",
    painStatement:
      "يحتاج المصنعون إلى فحص سريع للسماكة قبل الحسابات التفصيلية وفق معايير ASME.",
  },
  "value-stream-map-vsm-calculator": {
    title: "حاسبة خريطة تدفق القيمة VSM",
    painStatement:
      "يختبئ زمن التسليم في طوابير الانتظار والنقل بينما تتتبع الفرق وقت المعالجة فقط.",
  },
  "energy-savings-package-calculator": {
    title: "حاسبة حزمة توفير الطاقة",
    painStatement:
      "تتقدم مشاريع الكفاءة دون خط أساس موثق للتوفير والعائد على الاستثمار.",
  },
  "investment-payback-npv-calculator": {
    title: "حاسبة استرداد الاستثمار والقيمة الحالية الصافية",
    painStatement:
      "غالبًا ما تعرض طلبات رأس المال الاسترداد دون معدل الخصم أو الأفق الزمني.",
  },
  "annual-leave-severance-notice-calculator": {
    title: "حاسبة الإجازة السنوية ومكافأة نهاية الخدمة وفترة الإشعار",
    painStatement:
      "غالبًا ما يُقلَّل تقدير تكاليف إنهاء الخدمة حتى مراجعة الرواتب والشؤون القانونية.",
  },
  "belt-pulley-speed-length-calculator": {
    title: "حاسبة سرعة وطول السير والبكرة",
    painStatement:
      "يُحدَّد تغيير نقل الحركة من الذاكرة بدلًا من سرعة وطول السير الموثقين.",
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    title: "درجة تدقيق 5S – محول تكلفة فقدان الكفاءة",
    painStatement:
      "يحول نتائج تدقيق 5S إلى خسائر مالية فعلية من عدم تنظيم مكان العمل ووقت البحث وتدفقات العمل غير الفعالة، مما يجعل الحالة المالية لتنظيم مكان العمل مرئية للإدارة.\n\nتتتبع معظم المصانع نتائج 5S لكنها لا تستطيع الإجابة: \"كم نخسر من المال بسبب انخفاض نتيجة 5S؟\" تصوغ هذه الأداة النسبة المئوية لفقدان الكفاءة بناءً على الفجوة بين نتيجة 5S الحالية والهدف، ثم تضربها في إجمالي تكلفة قدرة العمل لتكشف عن العبء المالي الشهري لسوء تنظيم مكان العمل.\n\nمثال: قسم به 50 موظفًا، نتيجة 5S حالية 38/100، هدف 87/100، وتكلفة عمل 35 دولارًا/ساعة يكتشف خسارة كفاءة شهرية قدرها 34,496 دولارًا. التحسين إلى النتيجة المستهدفة يسترد 25,168 دولارًا شهريًا — فرصة سنوية قدرها 302,000 دولار.\n\nيستخدم مدراء اللين ومشرفو الإنتاج وفرق التحسين المستمر هذا المحول لإثبات العائد على الاستثمار لمبادرات 5S، وتحديد أهداف تحسين مدعومة بالبيانات، وإيصال قيمة تنظيم مكان العمل بمصطلحات مالية تفهمها الإدارة.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "حاسبة تكلفة هياكل الدعم والمعالجة اللاحقة للطباعة ثلاثية الأبعاد",
    painStatement:
      "يحسب التكلفة الإجمالية لهياكل الدعم وعمالة ما بعد المعالجة للأجزاء المطبوعة ثلاثية الأبعاد، مما يكشف النفقات الخفية التي تُستبعد بشكل روتيني من عروض أسعار التصنيع المضاف.\n\nتركز تقديرات تكلفة التصنيع المضاف غالبًا على وقت البناء ومادة النموذج، متجاهلة استهلاك مادة الدعم وعمالة الإزالة والتشطيب السطحي. تجمع هذه الأداة تكلفة حجم الدعم وعمالة الإزالة وتكلفة ما بعد المعالجة لكل دفعة في إجمالي يضيف غالبًا 30-60% إلى تكلفة الجزء الظاهرة.\n\nمثال: جزء بحجم دعم 20 سم³ بتكلفة 0.05 دولار/سم³ و15 دقيقة تنظيف بـ 25 دولارًا/ساعة له تكلفة ما بعد معالجة 12.25 دولارًا. في دفعة من 10 أجزاء، لا تضيف ما بعد المعالجة سوى 1.23 دولار لكل جزء. لكن دفعة من جزء واحد مع 60 سم³ دعم و45 دقيقة تنظيف تقفز إلى 46.50 دولارًا — غالبًا أكثر من تكلفة البناء.\n\nيستخدم مهندسو التصنيع المضاف وأصحاب الورش ومتخصصو عروض الأسعار هذه الآلة الحاسبة لبناء نماذج تكلفة كاملة، وتحسين اتجاه الجزء لأقل دعم، وضمان أن كل عرض أسعار يغطي التكلفة الكاملة لما بعد المعالجة.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "حاسبة تحسين الدفعة والتعشيش للطباعة ثلاثية الأبعاد",
    painStatement:
      "يحسن استخدام سرير الطباعة ثلاثية الأبعاد بحساب الحد الأقصى لعدد الأجزاء لكل دفعة بناءً على أبعاد الصندوق المحيط وحجم السرير وكفاءة التعشيش — ويحول نسب الاستخدام إلى تكلفة لكل جزء.\n\nاستخدام سرير الطباعة هو أكبر رافعة لربحية التصنيع المضاف، لكن معظم المشغلين يقدّرونه بالتخمين. تحسب هذه الأداة تطابق التعشيش المستطيل الدقيق ونسبة الاستخدام وساعات الماكينة لكل جزء، مما يكشف التأثير الحقيقي لتكلفة التعبئة غير الفعالة للسرير.\n\nمثال: سرير 200×200 مم مع أجزاء 50×50 مم يتسع لـ 12 جزءًا لكل دفعة بنسبة استخدام 75% مع طباعة 8 ساعات. كل جزء يكلف 0.67 ساعة ماكينة. التعشيش السيئ الذي يتسع لـ 8 أجزاء فقط يرفع ساعات الماكينة إلى 1.0 لكل جزء — زيادة تكلفة بنسبة 50% تقلل الهامش مباشرة.\n\nيستخدم مهندسو التصنيع المضاف ومخططو الإنتاج هذه الأداة لتعظيم حجم الدفعة، وتقليل تكاليف الماكينة لكل جزء، واتخاذ قرارات مدعومة بالبيانات حول اتجاه البناء واستراتيجية التعشيش متعدد الأجزاء.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "حاسبة نقطة التعادل بين الطباعة ثلاثية الأبعاد والتشغيل الآلي",
    painStatement:
      "يحدد كمية الإنتاج الدقيقة التي يصبح عندها الطباعة ثلاثية الأبعاد أكثر اقتصادًا من التصنيع باستخدام الحاسب الآلي (أو العكس)، باستخدام تحليل نقطة التعادل لتكاليف الإعداد وتكاليف الوحدة لكلتا طريقتي التصنيع.\n\nالاختيار بين التصنيع المضاف والتصنيع بالقطع هو أحد أكثر قرارات الإنتاج شيوعًا في التصنيع الحديث. بدون مقارنة مدعومة بالبيانات، تختار الفرق بالعادة — مما يؤدي إلى دفع مبالغ زائدة للتصنيع المضاف بكميات كبيرة أو للتصنيع بالقطع بكميات صغيرة. تحسب هذه الأداة كمية التقاطع ومنحنيات التكلفة الإجمالية وفرق التكلفة عند أي حجم محدد.\n\nمثال: مع الطباعة ثلاثية الأبعاد بتكلفة إعداد 100 دولار و5 دولارات/جزء، والتصنيع بتكلفة إعداد 500 دولار و2 دولار/جزء، كمية نقطة التعادل هي 134 جزءًا. تحت 134 وحدة، الطباعة أرخص؛ فوقها، يتفوق التصنيع. عند 100 وحدة، تكلفة الطباعة 600 دولار مقابل 700 دولار للتصنيع.\n\nيستخدم مهندسو التصنيع ومخططو الإنتاج ومديرو المشتريات هذا المحلل لاختيار عملية التصنيع الأكثر فعالية من حيث التكلفة لأي كمية إنتاج، مما يلغي التخمين ويقلل التكاليف لكل جزء.",
  },
  "cbam-exposure-quick-check": {
    title: "فحص سريع للتعرض لآلية تعديل الحدود الكربونية",
    painStatement:
      "الانبعاثات المضمنة وسعر الشهادة وسعر الصرف – بدون دمجها تبقى تكلفة آلية تعديل الحدود الكربونية غير مكتملة.",
  },
  "cbam-compliance-verdict": {
    title: "تقييم جاهزية الامتثال لآلية تعديل الحدود الكربونية",
    painStatement:
      "بدون قياس مشترك للانبعاثات المصرح بها وتغطية الشهادات واكتمال البيانات، يُكتشف خطر جاهزية آلية تعديل الحدود الكربونية بعد فوات الأوان.",
  },
  "7-israf-muda-avcisi-parasal-karsilik-calculator": {
    title: "حاسبة الأثر المالي لسبعة أنواع الهدر (مودا)",
    painStatement:
      "يقيس الأثر المالي لجميع أنواع الهدر السبعة في اللين (مودا) — الإنتاج الزائد، الانتظار، النقل، المخزون، الحركة، المعالجة الزائدة والعيوب — ويترجم أوجه عدم الكفاءة التشغيلية إلى مصطلحات مالية مباشرة يمكن للإدارة العمل بناءً عليها.\n\nيقتصر تتبع الهدر التقليدي على عد العيوب أو قياس ساعات التوقف. تحول هذه الأداة كل فئة من فئات الهدر إلى تكلفة دورية، وخسارة سنوية، ونسبة الهدر إلى الإيرادات، ودرجات أولوية معدلة حسب المخاطر. وتصنف فئة الهدر الأكثر تكلفة وأين سيحقق كايزن أعلى عائد.\n\nمثال: مصنع به 50 وحدة إنتاج زائد و20 ساعة انتظار و15 وحدة معيبة خلال 30 يومًا يكتشف أن الانتظار والعيوب يمثلان 62% من إجمالي تكلفة الهدر البالغة 28,500 دولار. تعطي الأداة أولوية لتقليل العيوب بدرجة 4.2/5 وتتوقع وفورات سنوية قدرها 17,700 دولار.\n\nيستخدم مدراء الإنتاج ومنسقو اللين ومديرو المصانع هذا المحلل لترجمة مودا إلى مقاييس مالية جاهزة لمجلس الإدارة، وترتيب أولويات استثمارات التحسين حسب العائد على الاستثمار، وتتبع انخفاض نسبة الهدر إلى الإيرادات على فترات متتالية.",
  },
  "hydraulic-cylinder-tonnage-power-calculator": {
    title: "حاسبة حمولة وقدرة الأسطوانة الهيدروليكية",
    painStatement:
      "يتطلب تحديد أبعاد الأسطوانة الهيدروليكية للحمولة وقدرة المحرك حسابات متزامنة للقوة والسرعة والقدرة. إهمال نسبة الكباس إلى الشوط يمكن أن يسبب فشل انبعاج كارثي.",
  },
  "compressor-power-air-flow-calculator": {
    title: "حاسبة قدرة الضاغط وتدفق الهواء",
    painStatement:
      "حسابات قدرة الضاغط بدون معامل البوليتروب الصحيح وتصحيح المراحل المتعددة تؤدي إلى محركات مفرطة أو غير كافية في الحجم.",
  },
  "cutting-parameters-power-calculator": {
    title: "حاسبة معايير القطع والقدرة",
    painStatement:
      "اختيار معايير القطع اليدوي يترك استخدام الماكينة تحت 60% ويسبب تآكل أداة يمكن تجنبه.",
  },
  "evaporative-cooling-capacity-calculator": {
    title: "حاسبة سعة التبريد التبخيري (FES)",
    painStatement:
      "يتطلب تحديد أبعاد نظام التبريد التبخيري حسابًا سيكرومتريًا وكفاءة الوسادة—إهمالها يؤدي إلى تبريد غير كافٍ.",
  },
  "condenser-precooling-savings-calculator": {
    title: "توفير الطاقة من التبريد المسبق (الأدياباتي) للمكثف",
    painStatement:
      "بدون تحليل التبريد المسبق للمكثف، لا يمكنك قياس توفير الطاقة من التبريد الأدياباتي.",
  },
  "pad-media-psychrometric-calculator": {
    title: "تحليل سيكرومتري لوسادة التبريد",
    painStatement:
      "تعتمد كفاءة وسادة التبريد على سمك الوسادة وسرعة الهواء والظروف السيكرومترية—البحث اليدوي يضيع ساعات.",
  },
  "fgas-leak-co2-calculator": {
    title: "حاسبة تسرب غازات F ومكافئ ثاني أكسيد الكربون",
    painStatement:
      "يتطلب قياس تسرب غازات F حساب قدرة الاحترار العالمي وفحوص الامتثال التنظيمي.",
  },
  "water-footprint-calculator": {
    title: "حاسبة البصمة المائية",
    painStatement:
      "تحليل البصمة المائية بدون تقسيم المياه الزرقاء/الخضراء/الرمادية يخفي التأثير البيئي الحقيقي.",
  },
  "shev-smoke-exhaust-calculator": {
    title: "حاسبة تحديد أبعاد شفط الدخان (SHEV)",
    painStatement:
      "يتطلب تحديد أبعاد شفط الدخان وفقًا للمعيار EN 12101-5 حسابات تدفق الكتلة والمساحة.",
  },
  "natural-ventilation-ach-calculator": {
    title: "حاسبة متطلبات التهوية الطبيعية (ACH)",
    painStatement:
      "يتطلب تحديد أبعاد التهوية الطبيعية حسابات تدفق مدفوعة بالطفو.",
  },
  "compound-interest-calculator": {
    title: "حاسبة الفائدة المركبة (مفصلة)",
    painStatement:
      "حسابات الفائدة المركبة بدون تعديل تكرار التركيب تعطي توقعات مستقبلية مضللة للقيمة.",
  },
  "living-wage-calculator": {
    title: "حاسبة الأجر المعيشي",
    painStatement:
      "يتطلب حساب التكلفة الحقيقية لصاحب العمل لكل موظف تجميع الراتب الإجمالي وساعات العمل الإضافية والضمان الاجتماعي والضرائب والبدلات.",
  },
  "panel-radiator-heating-capacity-calculator": {
    title: "حاسبة قدرة تدفئة المبرد اللوحي",
    painStatement:
      "يتطلب تحديد حجم المبرد اللوحي حساب فقدان حرارة الغرفة وتصحيح خرج المبرد لدرجات حرارة غير قياسية.",
  },
  "underfloor-heating-design-calculator": {
    title: "حاسبة تصميم التدفئة الأرضية",
    painStatement:
      "يتطلب تصميم التدفئة الأرضية وفقًا للمعيار EN 1264 حسابًا متكررًا لدرجة حرارة الأرضية وعدد الدوائر.",
  },
  "solar-tube-collector-sizing-calculator": {
    title: "حاسبة تحديد أبعاد المجمع الشمسي",
    painStatement:
      "يتطلب تحديد أبعاد المجمع الشمسي الموازنة بين طلب الماء الساخن ومساحة المجمع والتخزين والتدفئة الاحتياطية.",
  },
  "epq-production-quantity-calculator": {
    title: "حاسبة EPQ (الكمية الاقتصادية للإنتاج)",
    painStatement:
      "تتجاهل معادلة EOQ الكلاسيكية معدلات الإنتاج المحدودة، مما يبالغ في تقدير أحجام الدفعات.",
  },
  "kanban-bin-card-calculator": {
    title: "حاسبة عدد حاويات/بطاقات كانبان",
    painStatement:
      "تحديد العدد الصحيح لبطاقات كانبان يوازن بين مخاطر نفاد المخزون والعمل قيد التنفيذ من خلال الطلب والمهلة الزمنية.",
  },
  "littles-law-calculator": {
    title: "حاسبة قانون ليتل (العمل قيد التنفيذ)",
    painStatement:
      "بمعرفة اثنين من ثلاثة معايير العمل قيد التنفيذ/زمن الدورة/الإنتاجية، احسب الثالث وترجم العمل قيد التنفيذ إلى مخاطر مالية.",
  },
  "milk-run-route-calculator": {
    title: "حاسبة تحسين مسار Milk Run",
    painStatement:
      "يجب أن يوازن لوجستيات Milk Run بين مسافة المورد والسعة ووقت التحميل وتكاليف السائق.",
  },
  "cpm-pert-calculator": {
    title: "حاسبة CPM/PERT (المسار الحرج)",
    painStatement:
      "تحليل PERT مع الأوقات المتفائلة/الأكثر احتمالاً/المتشائمة يعطي تقديرات احتمالية لإنجاز المشروع.",
  },
  "queuing-mm1-calculator": {
    title: "حاسبة نظرية الطوابير (M/M/1)",
    painStatement:
      "تحليل الطوابير بدون نمذجة معدل الوصول ومعدل الخدمة يؤدي إلى عمليات بنقص أو زيادة في الموظفين.",
  },
  "fmea-rpn-calculator": {
    title: "حاسبة FMEA RPN (رقم أولوية المخاطرة)",
    painStatement:
      "حساب RPN اليدوي لـ FMEA يفتقد تحديد أولويات المخاطر عبر الوظائف المختلفة.",
  },
  "doe-factorial-design-calculator": {
    title: "حاسبة تصميم العوامل التجريبية (DOE)",
    painStatement:
      "تصميم التجارب يتطلب تصميمًا عامليًا مناسبًا مع نقاط مركزية وتقسيم إلى كتل.",
  },
  "reliability-block-calculator": {
    title: "حاسبة كتلة الموثوقية (RBD/MTBF)",
    painStatement:
      "حسابات الموثوقية للأنظمة المتسلسلة/المتوازية تتطلب تجميع MTBF و MTTR.",
  },
  "niosh-lifting-calculator": {
    title: "حاسبة الرفع NIOSH (المنقحة)",
    painStatement:
      "معادلة الرفع NIOSH تتطلب مضاعفات أفقية/عمودية/قبض/تردد.",
  },
  "reba-rapid-body-assessment-calculator": {
    title: "REBA (التقييم السريع لكامل الجسم)",
    painStatement:
      "تتطلب الدرجات المريحية REBA وفقًا لـ Hignett & McAtamney تسجيل المجموعة A والمجموعة B.",
  },
  "rcm-decision-calculator": {
    title: "حاسبة قرار RCM (الصيانة المتمركزة حول الموثوقية)",
    painStatement:
      "تحليل قرار RCM يقارن تكاليف الصيانة المخططة مقابل غير المخططة.",
  },
  "pareto-root-cause-calculator": {
    title: "حاسبة تحليل باريتو / السبب الجذري",
    painStatement:
      "تحليل باريتو (80/20) بدون ترتيب النسبة المئوية التراكمية يفقد الأسباب الجذرية الحيوية القليلة.",
  },
  "value-added-process-analyzer": {
    title: "محلل نسبة العملية ذات القيمة المضافة (VAP)",
    painStatement:
      "تحليل نسبة VAP يفصل الوقت ذا القيمة المضافة عن الوقت غير ذي القيمة المضافة.",
  },
  "kaizen-event-tracker": {
    title: "متتبع حدث كايزن / توفير التكاليف",
    painStatement:
      "يتتبع عائد الاستثمار لأحداث كايزن مقاييس قبل/بعد لزمن الدورة ومعدل الهدر ووقت التوقف.",
  },
  "fives-audit-scoring-calculator": {
    title: "حاسبة تسجيل تدقيق 5S",
    painStatement:
      "يتطلب تسجيل تدقيق 5S فرز كل فئة من فئات S بمعايير تقييم متسقة.",
  },
};
