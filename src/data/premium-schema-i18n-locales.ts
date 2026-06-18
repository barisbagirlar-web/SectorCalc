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
      "Leerkilometer, Kraftstoffabweichungen und Verzögerungen untergraben die Frachtmarge, bevor die Ladung angenommen wird.",
  },
  "energy-peak-cost": {
    title: "Energie-Spitzenlast- und Effizienzverlustbericht",
    painStatement:
      "Spitzenlast, Mehrverbrauch in kWh und Tarifabweichungen treiben die Rechnung über den sichtbaren Zählerstand hinaus.",
  },
  "food-waste-margin-loss": {
    title: "Lebensmittelabfall-Margenverlust-Rechner",
    painStatement:
      "Lebensmittelbetriebe können Marge durch Abfall, Überportionierung und Verderb verlieren, bevor der Verlust in den Umsatzberichten sichtbar wird.",
  },
  "construction-project-overrun": {
    title: "Bauprojekt-Kostenüberschreitungs-Rechner",
    painStatement:
      "Bauprojekte verlieren Geld, wenn Arbeitszeitabweichungen, Verzögerungstage und Materialüberschreitungen vor der Ausführung nicht kalkuliert werden.",
  },
  "sheet-metal-scrap-risk": {
    title: "Blech-Ausschussrisiko-Rechner",
    painStatement:
      "Blechaufträge verlieren Marge, wenn Schnittabfall, Biegefehler und Nacharbeit an der Oberfläche vor der Angebotserstellung nicht eingepreist werden.",
  },
  "restaurant-menu-margin-leak": {
    title: "Restaurant-Menü-Margenleck-Rechner",
    painStatement:
      "Restaurants verlieren Marge, wenn Wareneinsatz, Plattformgebühren, Abfall und Portionsabweichungen nicht gemeinsam gemessen werden.",
  },
  "construction-subcontractor-margin-leak": {
    title: "Subunternehmer-Margenleck-Rechner",
    painStatement:
      "Bauunternehmer verlieren Marge, wenn Subunternehmer-Mehrkosten, Verzögerungsansprüche und Materialabweichungen nicht kontrolliert werden.",
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
    title: "Cloud-API-Kostenüberschreitungs-Rechner",
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
      "CNC-Aufträge verlieren Marge, wenn Werkzeugverschleiß, Einsätze, Kühlmittel und Werkzeugwechsel-Stillstand nicht pro Teil verrechnet werden.",
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
    title: "HLK-Rückruf-Margenrisiko-Rechner",
    painStatement:
      "HLK-Projekte verlieren Marge, wenn Kanalabweichungen, Inbetriebnahmezeit und Rückrufrisiko nicht kalkuliert werden.",
  },
  "electrical-panel-rework-cost": {
    title: "Elektroschaltschrank-Nacharbeitskosten-Rechner",
    painStatement:
      "Elektroinstallateure verlieren Geld, wenn Schaltschrankverdrahtung, Prüfung, Abnahme und Nacharbeitsstunden nicht eingepreist werden.",
  },
  "plumbing-leak-callback-cost": {
    title: "Sanitär-Leck-Rückrufkosten-Rechner",
    painStatement:
      "Sanitäraufträge verlieren Marge, wenn Leck-Rückrufe, Materialläufe und Garantiebesuche nicht kalkuliert werden.",
  },
  "roofing-weather-delay-risk": {
    title: "Dacharbeiten-Wetterverzögerungsrisiko-Rechner",
    painStatement:
      "Dachaufträge verlieren Marge, wenn Wetterverzögerungen, Entsorgungsgebühren und Garantierückstellungen nicht im Vertragspreis enthalten sind.",
  },
  "painting-rework-coverage-risk": {
    title: "Malerarbeiten-Nacharbeit- und Deckungsrisiko-Rechner",
    painStatement:
      "Maleraufträge verlieren Marge, wenn Vorbereitungszeit, Deckungsabweichungen, Gerüstzeit und Nacharbeit unterschätzt werden.",
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
    title: "Rechtliche Zins- und Gebührenexpositions-Rechner",
    painStatement:
      "Rechts- und Inkassofälle verlieren Entscheidungsklarheit, wenn Zinsen, Verzögerungen und Gebührenexposition nicht gemeinsam zusammengefasst werden.",
  },
  "carbon-footprint-compliance-risk": {
    title: "CO₂-Fußabdruck-Compliance-Risiko-Rechner",
    painStatement:
      "Exporteure und Hersteller können die CO₂-Exposition unterschätzen, wenn Energie-, Kraftstoff- und CO₂-Preisannahmen nicht verknüpft werden.",
  },
  "quote-price-profit-margin-calculator": {
    title: "Angebotspreis- und Gewinnmargen-Rechner",
    painStatement:
      "Angebote lassen häufig Ausschuss, Rüstzeit, Zahlungszielkosten und Energielast aus, bevor die Marge festgelegt wird.",
  },
  "shop-rate-hourly-cost-calculator": {
    title: "Maschinenstundensatz-Rechner",
    painStatement:
      "Die meisten Betriebe schätzen den Stundensatz nur aus Lohn und Strom und unterschätzen die tatsächliche Stundenbelastung.",
  },
  "break-even-safety-margin-calculator": {
    title: "Break-even- und Sicherheitsmargen-Rechner",
    painStatement:
      "Unternehmer erfahren Gewinn oder Verlust oft erst, wenn die Monatsabschlüsse vorliegen.",
  },
  "auto-repair-parts-labor-quote-calculator": {
    title: "Kfz-Reparatur-Teile- und Arbeitsangebots-Rechner",
    painStatement:
      "Reparaturangebote variieren je nach Techniker und Format, was Preiskonsistenz erschwert.",
  },
  "cbam-unit-product-carbon-footprint-calculator": {
    title: "CBAM-Produkteinheits-CO₂-Fußabdruck-Rechner",
    painStatement:
      "Exporteure benötigen CO₂-Nachweise auf Produktebene, verfügen aber über wenig erschwingliche Werkzeuge.",
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
      "Umsatzstarke Kunden können die Marge durch Retouren, Verzögerungen und Nacharbeit zerstören.",
  },
  "inventory-carrying-cost-eoq-calculator": {
    title: "Lagerhaltungskosten- und EOQ-Rechner",
    painStatement:
      "Lagerkosten werden unterschätzt, wenn nur die Lagerhalle angesetzt wird.",
  },
  "welded-bolted-connection-calculator": {
    title: "Geschweißte und geschraubte Verbindungs-Rechner",
    painStatement:
      "Verbindungsdimensionierung basiert ohne schnelle Strukturprüfung auf Schätzungen.",
  },
  "tolerance-stack-up-calculator": {
    title: "Toleranzstapel-Rechner",
    painStatement:
      "Passungsprobleme entstehen oft durch gestapelte Toleranzen ohne dokumentierte Kettenprüfung.",
  },
  "bolt-tightening-torque-calculator": {
    title: "Schraubenanzugsdrehmoment-Rechner",
    painStatement:
      "Montageteams schätzen das Drehmoment ohne dokumentierte Klemmkraftmethode.",
  },
  "fire-system-flow-hydrant-calculator": {
    title: "Brandschutz-Durchfluss- und Hydranten-Rechner",
    painStatement:
      "Brandschutzangebote übersehen den Durchflussbedarf vor der Hydranten- und Rohrdimensionierung.",
  },
  "hydraulic-pneumatic-cylinder-force-calculator": {
    title: "Hydraulik- und Pneumatikzylinder-Kraft-Rechner",
    painStatement:
      "Zylinderauswahl überspringt häufig Kraftprüfungen vor dem Aktuator-Kauf.",
  },
  "quality-cost-paf-calculator": {
    title: "Qualitätskosten-PAF-Rechner",
    painStatement:
      "Qualitätsbudgets verbergen Präventions- und Prüfkosten, bis Fehlerkosten stark ansteigen.",
  },
  "pressure-vessel-wall-thickness-calculator": {
    title: "Druckbehälter-Wanddicken-Rechner",
    painStatement:
      "Hersteller benötigen eine schnelle Wanddickenprüfung vor detaillierten ASME-Berechnungen.",
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
    title: "Urlaub, Abfindung und Kündigungsfrist-Rechner",
    painStatement:
      "Austrittskosten werden oft unterschätzt, bis Lohnabrechnung und Rechtsprüfung vorliegen.",
  },
  "belt-pulley-speed-length-calculator": {
    title: "Riemen-Riemenscheiben-Drehzahl- und Längen-Rechner",
    painStatement:
      "Antriebsänderungen werden aus dem Gedächtnis statt mit dokumentierter Drehzahl und Riemenlänge dimensioniert.",
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    title: "5S-Audit-Score – Effizienzverlust-Kostenrechner",
    painStatement:
      "Ohne monetäre 5S-Bewertung fehlt die Priorität für Workplace-Organisation und Suchzeitverluste.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "3D-Druck Stützstruktur & Nachbearbeitungskosten-Rechner",
    painStatement:
      "Stützmaterial und Reinigungsarbeit werden oft nicht in Additive-Angebote eingerechnet.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "3D-Druck Batch-Nesting & Bett-Auslastungs-Rechner",
    painStatement:
      "Unklare Teilezahl pro Druckbett verschwendet Maschinenstunden und erhöht Stückkosten.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "3D-Druck vs Zerspanung Break-even-Rechner",
    painStatement:
      "Ohne Mengen-Schwellenwert wird die falsche Fertigungsmethode gewählt.",
  },
  "cbam-exposure-quick-check": {
    title: "CBAM-Expositions-Schnellprüfung",
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
      "Überproduktion, Warten, Transport, Bestand, Bewegung, Fehler und Überbearbeitung bleiben ohne Periodenkosten unsichtbar.",
  }};

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
      "Sans valorisation monétaire du 5S, les priorités d'amélioration du poste de travail manquent.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "Calculateur coût supports 3D et post-traitement",
    painStatement:
      "Matériau de support et nettoyage sont souvent absents des devis d'impression additive.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "Calculateur optimisation lot et nesting 3D",
    painStatement:
      "Sans pièces par plateau optimisées, les heures machine sont gaspillées.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "Calculateur seuil de rentabilité 3D vs usinage",
    painStatement:
      "Sans quantité seuil, la mauvaise méthode de fabrication est choisie.",
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
      "Surproduction, attente, transport, stock, mouvement, défauts et sur-traitement restent invisibles sans coût périodique.",
  }};

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
      "Sin valoración monetaria del 5S faltan prioridades de mejora en el puesto de trabajo.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "Calculadora de costo de soportes 3D y postproceso",
    painStatement:
      "Material de soporte y limpieza suelen omitirse en cotizaciones de impresión aditiva.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "Calculadora de optimización de lote y anidamiento 3D",
    painStatement:
      "Sin piezas optimizadas por cama se desperdician horas de máquina.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "Calculadora de punto de equilibrio 3D vs mecanizado",
    painStatement:
      "Sin cantidad umbral se elige el método de fabricación incorrecto.",
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
      "Sobreproducción, espera, transporte, inventario, movimiento, defectos y sobreproceso quedan invisibles sin costo periódico.",
  }};

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
      "بدون تقييم مالي لـ 5S تفتقر أولويات تحسين مكان العمل.",
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    title: "حاسبة تكلفة هياكل الدعم والمعالجة اللاحقة للطباعة ثلاثية الأبعاد",
    painStatement:
      "غالبًا ما يُستبعد مادة الدعم والتنظيف من عروض الطباعة الإضافية.",
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    title: "حاسبة تحسين الدفعة والتعشيش للطباعة ثلاثية الأبعاد",
    painStatement:
      "بدون تحسين القطع لكل سرير تُهدر ساعات الماكينة.",
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    title: "حاسبة نقطة التعادل بين الطباعة ثلاثية الأبعاد والتشغيل الآلي",
    painStatement:
      "بدون كمية عتبة يُختار أسلوب التصنيع الخاطئ.",
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
      "الإنتاج الزائد والانتظار والنقل والمخزون والحركة والعيوب والمعالجة الزائدة تبقى غير مرئية دون تكلفة دورية.",
  }};
