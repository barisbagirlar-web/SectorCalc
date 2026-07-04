#!/usr/bin/env node
/**
 * Merge legal page + contact label i18n into messages/*.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const packs = {
  en: {
    legalContact: {
      taxIdLabel: "Tax ID",
      addressLabel: "Address",
      phoneLabel: "Phone",
      emailLabel: "Email",
    },
    legalCommon: {
      eyebrow: "Legal",
      readPrivacy: "Privacy Policy",
      readTerms: "Terms of Service",
      readRefund: "Refund Policy",
      seeAlso: "See also",
      termsFooter:
        "Read our <privacy>Privacy Policy</privacy> and <refund>Refund Policy</refund>.",
      privacyFooter:
        "See also <terms>Terms of Service</terms> and <refund>Refund Policy</refund>.",
      refundFooter:
        "See also <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>.",
    },
    terms: {
      meta: {
        title: "Terms of Service",
        description:
          "Legal terms and conditions for using SectorCalc calculators and services.",
      },
      heroDescription:
        "By accessing or using SectorCalc, you agree to these Terms of Service.",
      title: "Terms of Service",
      lastUpdated: "Last updated: {date}",
      lastUpdatedDate: "June 15, 2026",
      intro:
        "Welcome to SectorCalc. By accessing or using our website and calculation tools, you agree to be bound by these Terms of Service.",
      section1: {
        title: "1. Our Services",
        content:
          "SectorCalc provides industrial and business calculators for informational and decision-support purposes. Our tools do not constitute professional engineering, financial, or legal advice. You are solely responsible for verifying any results before making business decisions.",
      },
      section2: {
        title: "2. Premium Features & Credits",
        content:
          "Premium tools require credits. Credits are non-refundable and expire 12 months after purchase. You may purchase credit packages through our secure payment provider. Unused credits do not roll over.",
      },
      section3: {
        title: "3. User Accounts",
        content:
          "You must create an account to access premium features. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
      },
      section4: {
        title: "4. Intellectual Property",
        content:
          "All content, formulas, algorithms, designs, and trademarks are the exclusive property of Sector Calculator (operating as SectorCalc). You may not reproduce, distribute, or create derivative works without prior written permission.",
      },
      section5: {
        title: "5. Limitation of Liability",
        content:
          "To the maximum extent permitted by law, Sector Calculator shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.",
      },
      section6: {
        title: "6. Modifications",
        content:
          "We may update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.",
      },
      section7: {
        title: "7. Contact Information",
        content: "For questions about these Terms, contact us using the details below.",
      },
    },
    privacy: {
      meta: {
        title: "Privacy Policy",
        description: "How SectorCalc collects, uses, and protects your personal data.",
      },
      heroDescription: "What data we collect, how we use it, and your rights.",
      title: "Privacy Policy",
      effective: "Effective: June 15, 2026",
      intro:
        "Your privacy is important to us. This policy explains what data we collect, how we use it, and your rights.",
      section1: {
        title: "1. Information We Collect",
        content:
          "We collect personal information you provide (e.g., email address when you register). We also automatically collect usage data (IP address, browser type, pages visited) to improve our tools.",
      },
      section2: {
        title: "2. How We Use Your Information",
        content:
          "We use your data to operate, maintain, and improve SectorCalc, to process payments, and to communicate with you about your account or updates.",
      },
      section3: {
        title: "3. Cookies & Tracking",
        content:
          "We use essential cookies for authentication and optional analytics cookies (e.g., Google Analytics) to analyze usage. You can disable non-essential cookies in your browser settings.",
      },
      section4: {
        title: "4. Data Sharing",
        content:
          "We do not sell your personal data. We share data only with trusted third-party services (payment processors — Stripe/Paddle, hosting — Firebase) as necessary to provide our services.",
      },
      section5: {
        title: "5. Data Retention & Security",
        content:
          "We retain your data as long as your account is active. We implement reasonable security measures, but no method of transmission over the Internet is 100% secure.",
      },
      section6: {
        title: "6. Your Rights",
        content:
          "You may request access, correction, or deletion of your personal data by contacting us at info@sectorcalc.com.",
      },
      section7: {
        title: "7. Children's Privacy",
        content:
          "Our services are not directed to individuals under 16. We do not knowingly collect personal information from children.",
      },
      section8: {
        title: "8. Changes to This Policy",
        content:
          'We may update this policy from time to time. The "Effective" date at the top indicates when the latest version was posted.',
      },
      section9: {
        title: "9. Data Controller",
        content: "The data controller for SectorCalc is:",
      },
    },
    refundPolicy: {
      meta: {
        title: "Refund Policy",
        description: "Refund terms for credit purchases and subscriptions on SectorCalc.",
      },
      heroDescription: "Refund terms for credit purchases and subscriptions.",
      title: "Refund Policy",
      lastUpdated: "Last updated: June 15, 2026",
      intro:
        "We want you to be satisfied with your purchase. Please read this Refund Policy carefully.",
      section1: {
        title: "1. Credits & Subscriptions",
        content:
          "Credits: Purchases of credits are final and non-refundable. Unused credits expire 12 months after purchase. No cash refunds will be issued for unused credits. Subscriptions: If you purchase a recurring subscription, you may request a full refund within 14 days of your first payment, provided you have not used any premium tool during that period. After 14 days or after first use, subscription fees are non-refundable.",
      },
      section2: {
        title: "2. Faulty or Incorrect Tools",
        content:
          "If a premium tool produces demonstrably incorrect results due to a bug in our system, we will refund the credits used for that calculation (up to the number of credits spent) or provide replacement credits. Please report the issue with screenshots and details to info@sectorcalc.com.",
      },
      section3: {
        title: "3. How to Request a Refund",
        content:
          "To request a refund, contact us at info@sectorcalc.com with your transaction ID (from your payment provider) and the reason for the request. We will respond within 7–14 business days.",
      },
      section4: {
        title: "4. Chargebacks",
        content:
          "If you initiate a chargeback without first contacting us, we may suspend your account until the matter is resolved.",
      },
      section5: {
        title: "5. Changes to this Policy",
        content:
          "We reserve the right to modify this refund policy at any time. Changes will be posted on this page.",
      },
      section6: {
        title: "6. Contact Information",
        content:
          "For refund requests or billing questions, contact us using the details below.",
      },
    },
    creditsPricing: {
      meta: {
        title: "Pricing – SectorCalc Credits",
        description:
          "Purchase credits to unlock premium industrial calculators. Plans start at $1.99.",
      },
      title: "Choose your credits",
      subtitle:
        "One credit unlocks one premium calculation. Credits expire 12 months after purchase.",
      creditsLabel: "{count} credits",
      perCredit: "/ credit",
      buyNow: "Buy credits",
      popular: "Most popular",
      legalNote:
        "All prices are in USD. Credits are non-refundable and expire 12 months after purchase.",
    },
  },

  tr: {
    legalContact: {
      taxIdLabel: "Tax No",
      addressLabel: "Adres",
      phoneLabel: "Telefon",
      emailLabel: "E-posta",
    },
    legalCommon: {
      eyebrow: "Yasal",
      readPrivacy: "Gizlilik Politikası",
      readTerms: "Hizmet Şartları",
      readRefund: "İade Politikası",
      seeAlso: "Ayrıca bakınız",
      termsFooter:
        "<privacy>Gizlilik Politikası</privacy> ve <refund>İade Politikası</refund> sayfalarını okuyun.",
      privacyFooter:
        "Ayrıca <terms>Hizmet Şartları</terms> ve <refund>İade Politikası</refund> sayfalarına bakın.",
      refundFooter:
        "Ayrıca <terms>Hizmet Şartları</terms> ve <privacy>Gizlilik Politikası</privacy> sayfalarına bakın.",
    },
    terms: {
      meta: {
        title: "Hizmet Şartları",
        description:
          "SectorCalc hesaplayıcıları ve hizmetlerini kullanmaya ilişkin yasal şartlar.",
      },
      heroDescription:
        "SectorCalc'e erişerek veya kullanarak bu Hizmet Şartları'nı kabul etmiş sayılırsınız.",
      title: "Hizmet Şartları",
      lastUpdated: "Son güncelleme: {date}",
      lastUpdatedDate: "15 Haziran 2026",
      intro:
        "SectorCalc'e hoş geldiniz. Web sitemizi ve calculation araçlarımızı kullanarak bu Hizmet Şartları'nı kabul etmiş sayılırsınız.",
      section1: {
        title: "1. Hizmetlerimiz",
        content:
          "SectorCalc, endüstriyel ve ticari hesaplamalar için bilgilendirme ve karar destek araçları sunar. Araçlarımız profesyonel mühendislik, finansal veya hukuki tavsiye niteliği taşımaz. İş kararları almadan önce sonuçları doğrulamak sizin sorumluluğunuzdadır.",
      },
      section2: {
        title: "2. Premium Özellikler ve Krediler",
        content:
          "Premium araçlar kredi gerektirir. Krediler iade edilemez ve satın taking tarihinden itibaren 12 ay sonra geçerliliğini yitirir. Kredi paketlerini güvenli ödeme sağlayıcımız üzerinden satın alabilirsiniz. Useılmayan krediler yenilenmez.",
      },
      section3: {
        title: "3. Useıcı Hesapları",
        content:
          "Premium özelliklere erişmek için bir account oluşturmalısınız. Account bilgilerinizin gizliliğini korumak ve hesabınız altında gerçekleşen tüm işlemlerden siz sorumlusunuz.",
      },
      section4: {
        title: "4. Fikri Mülkiyet",
        content:
          "Tüm içerik, formüller, algoritmalar, tasarımlar ve ticari markalar Sector Calculator'a (SectorCalc olarak faaliyet gösteren) aittir. Önceden yazılı izin alınmadan kopyalanamaz, dağıtılamaz veya türev çalışmalar oluşturulamaz.",
      },
      section5: {
        title: "5. Sorumluluk Sınırlaması",
        content:
          "Yasanın izin verdiği azami ölçüde, Sector Calculator, hizmetlerimizin useımından kaynaklanan dolaylı, arızi, özel, cezai veya neticesi zararlardan sorumlu değildir.",
      },
      section6: {
        title: "6. Değişiklikler",
        content:
          "Bu Şartları her zaman güncelleyebiliriz. Değişikliklerden sonra hizmeti kullanmaya devam etmeniz, yeni Şartları kabul ettiğiniz anlamına gelir.",
      },
      section7: {
        title: "7. İletişim Bilgileri",
        content:
          "Bu Şartlar hakkında sorularınız için aşağıdaki iletişim bilgilerini useın.",
      },
    },
    privacy: {
      meta: {
        title: "Gizlilik Politikası",
        description:
          "SectorCalc kişisel verilerinizi nasıl toplar, useır ve korur.",
      },
      heroDescription:
        "Which verileri topladığımız, nasıl kullandığımız ve haklarınız.",
      title: "Gizlilik Politikası",
      effective: "Yürürlük Tarihi: 15 Haziran 2026",
      intro:
        "Gizliliğiniz bizim için önemlidir. Bu politika, which verileri topladığımızı, nasıl kullandığımızı ve haklarınızı açıklar.",
      section1: {
        title: "1. Topladığımız Bilgiler",
        content:
          "Kayıt olurken sağladığınız kişisel bilgileri (örneğin e-posta adresiniz) toplarız. Ayrıca araçlarımızı iyileştirmek için useım verilerini (IP adresi, tarayıcı türü, ziyaret edilen sayfalar) otomatik olarak toplarız.",
      },
      section2: {
        title: "2. Bilgilerinizi Nasıl Useıyoruz",
        content:
          "Verilerinizi SectorCalc'i işletmek, geliştirmek, ödemeleri işlemek ve hesabınız veya güncellemeler hakkında sizinle iletişim kurmak için useırız.",
      },
      section3: {
        title: "3. Çerezler ve İzleme",
        content:
          "Kimlik doğrulama için zorunlu çerezler ve useım analysis için isteğe bağlı analitik çerezler (örneğin Google Analytics) useırız. Zorunlu olmayan çerezleri tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz.",
      },
      section4: {
        title: "4. Veri Paylaşımı",
        content:
          "Kişisel verilerinizi satmayız. Verileri yalnızca güvenilir üçüncü taraf hizmet sağlayıcılarla (ödeme işlemcileri — Stripe/Paddle, barındırma — Firebase) hizmetlerimizi sunmak için gerekli olduğu ölçüde paylaşırız.",
      },
      section5: {
        title: "5. Veri Saklama ve Güvenlik",
        content:
          "Verilerinizi hesabınız active olduğu sürece saklarız. Makul güvenlik önlemleri alırız, ancak internet üzerinden hiçbir veri iletim yöntemi %100 güvenli değildir.",
      },
      section6: {
        title: "6. Haklarınız",
        content:
          "Kişisel verilerinize erişmek, düzeltmek veya silmek için info@sectorcalc.com adresinden bize ulaşabilirsiniz.",
      },
      section7: {
        title: "7. Çocukların Gizliliği",
        content:
          "Hizmetlerimiz 16 yaşından küçük bireylere yönelik değildir. Bilerek çocuklardan kişisel bilgi toplamayız.",
      },
      section8: {
        title: "8. Politikadaki Değişiklikler",
        content:
          'Bu politikayı zaman zaman güncelleyebiliriz. Başlıktaki "Yürürlük Tarihi" en son sürümü belirtir.',
      },
      section9: {
        title: "9. Veri Sorumlusu",
        content: "SectorCalc için veri sorumlusu:",
      },
    },
    refundPolicy: {
      meta: {
        title: "İade Politikası",
        description:
          "SectorCalc kredi satın alımları ve abonelikler için iade şartları.",
      },
      heroDescription: "Kredi satın alımları ve abonelikler için iade şartları.",
      title: "İade Politikası",
      lastUpdated: "Son güncelleme: 15 Haziran 2026",
      intro:
        "Satın aldığınız üründen memnun kalmanızı isteriz. Lütfen bu İade Politikası'nı dikkatlice okuyun.",
      section1: {
        title: "1. Krediler ve Abonelikler",
        content:
          "Krediler: Kredi satın alımları kesindir ve iade edilemez. Useılmayan krediler, satın taking tarihinden itibaren 12 ay sonra geçerliliğini yitirir. Useılmayan krediler için nakit iade yapılmaz. Abonelikler: Yinelenen bir abonelik satın alırsanız, ilk ödemeden sonraki 14 gün içinde, bu süre boyunca herhangi bir premium araç kullanmadıysanız tam iade demand edebilirsiniz. 14 gün sonra veya ilk useımdan sonra abonelik ücretleri iade edilemez.",
      },
      section2: {
        title: "2. Hatalı veya Yanlış Araçlar",
        content:
          "Bir premium araç, sistemimizdeki bir error nedeniyle belirgin şekilde yanlış sonuç üretirse, bu calculation için useılan kredileri iade ederiz (harcanan kredi sayısına kadar) veya spare kredi sağlarız. Lütfen sorunu ekran görüntüleri ve ayrıntılarla info@sectorcalc.com adresine bildirin.",
      },
      section3: {
        title: "3. İade Nasıl Demand Edilir",
        content:
          "İade talebi için, ödeme sağlayıcınızdan işlem kimliğinizle birlikte gerekçenizi info@sectorcalc.com adresine gönderin. 7-14 iş günü içinde yanıt vereceğiz.",
      },
      section4: {
        title: "4. Geri Ödeme Ters İşlemleri (Chargeback)",
        content:
          "Önce bize başvurmadan bir geri ödeme ters işlemi başlatırsanız, sorun çözülene kadar hesabınız askıya alınabilir.",
      },
      section5: {
        title: "5. Politikadaki Değişiklikler",
        content:
          "Bu iade politikasını her zaman değiştirme hakkımız saklıdır. Değişiklikler bu sayfada yayınlanır.",
      },
      section6: {
        title: "6. İletişim Bilgileri",
        content:
          "İade talepleri veya faturalandırma soruları için aşağıdaki iletişim bilgilerini useın.",
      },
    },
    creditsPricing: {
      meta: {
        title: "Fiyatlandırma – SectorCalc Kredileri",
        description:
          "Premium endüstriyel hesaplayıcıların kilidini açmak için kredi satın alın. Planlar $1.99'dan başlar.",
      },
      title: "Kredi Paketinizi Seçin",
      subtitle:
        "Bir kredi, bir premium hesaplamayı açar. Krediler satın taking tarihinden itibaren 12 ay geçerlidir.",
      creditsLabel: "{count} kredi",
      perCredit: "/ kredi",
      buyNow: "Kredi Satın Al",
      popular: "En Popüler",
      legalNote:
        "Tüm fiyatlar USD cinsindendir. Krediler iade edilemez ve satın taking tarihinden itibaren 12 ay sonra geçerliliğini yitirir.",
    },
  },

  de: {
    legalContact: {
      taxIdLabel: "Steuernummer",
      addressLabel: "Adresse",
      phoneLabel: "Telefon",
      emailLabel: "E-Mail",
    },
    legalCommon: {
      eyebrow: "Rechtliches",
      readPrivacy: "Datenschutzerklärung",
      readTerms: "Nutzungsbedingungen",
      readRefund: "Rückerstattungsrichtlinie",
      seeAlso: "Siehe auch",
      termsFooter:
        "Lesen Sie unsere <privacy>Datenschutzerklärung</privacy> und <refund>Rückerstattungsrichtlinie</refund>.",
      privacyFooter:
        "Siehe auch <terms>Nutzungsbedingungen</terms> und <refund>Rückerstattungsrichtlinie</refund>.",
      refundFooter:
        "Siehe auch <terms>Nutzungsbedingungen</terms> und <privacy>Datenschutzerklärung</privacy>.",
    },
    terms: {
      meta: {
        title: "Nutzungsbedingungen",
        description:
          "Rechtliche Bedingungen für die Nutzung der SectorCalc-Rechner und -Dienste.",
      },
      heroDescription:
        "Durch den Zugriff auf oder die Nutzung von SectorCalc stimmen Sie diesen Nutzungsbedingungen zu.",
      title: "Nutzungsbedingungen",
      lastUpdated: "Zuletzt aktualisiert: {date}",
      lastUpdatedDate: "15. Juni 2026",
      intro:
        "Willkommen bei SectorCalc. Durch den Zugriff auf unsere Website und unsere Berechnungstools erklären Sie sich mit diesen Nutzungsbedingungen einverstanden.",
      section1: {
        title: "1. Unsere Dienste",
        content:
          "SectorCalc stellt industrielle und geschäftliche Rechner zu Informations- und Entscheidungsunterstützungszwecken bereit. Unsere Tools stellen keine professionelle Ingenieur-, Finanz- oder Rechtsberatung dar. Sie sind allein dafür verantwortlich, Ergebnisse vor geschäftlichen Entscheidungen zu überprüfen.",
      },
      section2: {
        title: "2. Premium-Funktionen und Credits",
        content:
          "Premium-Tools erfordern Credits. Credits sind nicht erstattungsfähig und verfallen 12 Monate nach dem Kauf. Sie können Credit-Pakete über unseren sicheren Zahlungsanbieter erwerben. Nicht genutzte Credits werden nicht übertragen.",
      },
      section3: {
        title: "3. Benutzerkonten",
        content:
          "Für den Zugriff auf Premium-Funktionen müssen Sie ein Konto erstellen. Sie sind für die Vertraulichkeit Ihrer Anmeldedaten und für alle Aktivitäten unter Ihrem Konto verantwortlich.",
      },
      section4: {
        title: "4. Geistiges Eigentum",
        content:
          "Alle Inhalte, Formeln, Algorithmen, Designs und Marken sind ausschließliches Eigentum von Sector Calculator (betrieben als SectorCalc). Eine Vervielfältigung, Verbreitung oder Erstellung abgeleiteter Werke ist ohne vorherige schriftliche Genehmigung nicht gestattet.",
      },
      section5: {
        title: "5. Haftungsbeschränkung",
        content:
          "Soweit gesetzlich zulässig, haftet Sector Calculator nicht für indirekte, zufällige, besondere, Folge- oder Strafschäden, die aus Ihrer Nutzung unserer Dienste entstehen.",
      },
      section6: {
        title: "6. Änderungen",
        content:
          "Wir können diese Bedingungen jederzeit aktualisieren. Die fortgesetzte Nutzung des Dienstes nach Änderungen gilt als Zustimmung zu den neuen Bedingungen.",
      },
      section7: {
        title: "7. Kontaktinformationen",
        content:
          "Bei Fragen zu diesen Bedingungen kontaktieren Sie uns über die untenstehenden Angaben.",
      },
    },
    privacy: {
      meta: {
        title: "Datenschutzerklärung",
        description:
          "Wie SectorCalc Ihre personenbezogenen Daten erhebt, nutzt und schützt.",
      },
      heroDescription:
        "Welche Daten wir erheben, wie wir sie nutzen und welche Rechte Sie haben.",
      title: "Datenschutzerklärung",
      effective: "Gültig ab: 15. Juni 2026",
      intro:
        "Ihre Privatsphäre ist uns wichtig. Diese Richtlinie erläutert, welche Daten wir erheben, wie wir sie nutzen und welche Rechte Sie haben.",
      section1: {
        title: "1. Von uns erhobene Informationen",
        content:
          "Wir erheben personenbezogene Daten, die Sie bereitstellen (z. B. Ihre E-Mail-Adresse bei der Registrierung). Außerdem erfassen wir automatisch Nutzungsdaten (IP-Adresse, Browsertyp, besuchte Seiten), um unsere Tools zu verbessern.",
      },
      section2: {
        title: "2. Wie wir Ihre Informationen nutzen",
        content:
          "Wir nutzen Ihre Daten, um SectorCalc zu betreiben und zu verbessern, Zahlungen zu verarbeiten und mit Ihnen über Ihr Konto oder Updates zu kommunizieren.",
      },
      section3: {
        title: "3. Cookies und Tracking",
        content:
          "Wir verwenden essenzielle Cookies für die Authentifizierung und optionale Analyse-Cookies (z. B. Google Analytics) zur Nutzungsanalyse. Nicht essenzielle Cookies können Sie in Ihren Browsereinstellungen deaktivieren.",
      },
      section4: {
        title: "4. Datenweitergabe",
        content:
          "Wir verkaufen Ihre personenbezogenen Daten nicht. Wir geben Daten nur an vertrauenswürdige Drittanbieter weiter (Zahlungsabwickler — Stripe/Paddle, Hosting — Firebase), soweit dies zur Erbringung unserer Dienste erforderlich ist.",
      },
      section5: {
        title: "5. Datenspeicherung und Sicherheit",
        content:
          "Wir speichern Ihre Daten, solange Ihr Konto aktiv ist. Wir setzen angemessene Sicherheitsmaßnahmen ein, doch keine Übertragungsmethode im Internet ist zu 100 % sicher.",
      },
      section6: {
        title: "6. Ihre Rechte",
        content:
          "Sie können Auskunft, Berichtigung oder Löschung Ihrer personenbezogenen Daten anfordern, indem Sie uns unter info@sectorcalc.com kontaktieren.",
      },
      section7: {
        title: "7. Datenschutz von Kindern",
        content:
          "Unsere Dienste richten sich nicht an Personen unter 16 Jahren. Wir erheben wissentlich keine personenbezogenen Daten von Kindern.",
      },
      section8: {
        title: "8. Änderungen dieser Richtlinie",
        content:
          'Wir können diese Richtlinie von Zeit zu Zeit aktualisieren. Das Datum „Gültig ab" oben zeigt an, wann die aktuelle Version veröffentlicht wurde.',
      },
      section9: {
        title: "9. Verantwortlicher",
        content: "Verantwortlicher für SectorCalc:",
      },
    },
    refundPolicy: {
      meta: {
        title: "Rückerstattungsrichtlinie",
        description:
          "Rückerstattungsbedingungen für Credit-Käufe und Abonnements bei SectorCalc.",
      },
      heroDescription:
        "Rückerstattungsbedingungen für Credit-Käufe und Abonnements.",
      title: "Rückerstattungsrichtlinie",
      lastUpdated: "Zuletzt aktualisiert: 15. Juni 2026",
      intro:
        "Wir möchten, dass Sie mit Ihrem Kauf zufrieden sind. Bitte lesen Sie diese Rückerstattungsrichtlinie sorgfältig.",
      section1: {
        title: "1. Credits und Abonnements",
        content:
          "Credits: Credit-Käufe sind endgültig und nicht erstattungsfähig. Nicht genutzte Credits verfallen 12 Monate nach dem Kauf. Für nicht genutzte Credits werden keine Bargeldrückerstattungen gewährt. Abonnements: Bei einem wiederkehrenden Abonnement können Sie innerhalb von 14 Tagen nach der ersten Zahlung eine vollständige Rückerstattung beantragen, sofern Sie in diesem Zeitraum kein Premium-Tool genutzt haben. Nach 14 Tagen oder nach der ersten Nutzung sind Abonnementgebühren nicht erstattungsfähig.",
      },
      section2: {
        title: "2. Fehlerhafte oder falsche Tools",
        content:
          "Wenn ein Premium-Tool aufgrund eines Fehlers in unserem System nachweislich falsche Ergebnisse liefert, erstatten wir die für diese Berechnung verwendeten Credits (bis zur Anzahl der ausgegebenen Credits) oder stellen Ersatz-Credits bereit. Bitte melden Sie das Problem mit Screenshots und Details an info@sectorcalc.com.",
      },
      section3: {
        title: "3. So beantragen Sie eine Rückerstattung",
        content:
          "Für eine Rückerstattung kontaktieren Sie uns unter info@sectorcalc.com mit Ihrer Transaktions-ID (vom Zahlungsanbieter) und dem Grund Ihrer Anfrage. Wir antworten innerhalb von 7–14 Werktagen.",
      },
      section4: {
        title: "4. Rückbuchungen (Chargebacks)",
        content:
          "Wenn Sie eine Rückbuchung einleiten, ohne uns zuvor zu kontaktieren, können wir Ihr Konto bis zur Klärung sperren.",
      },
      section5: {
        title: "5. Änderungen dieser Richtlinie",
        content:
          "Wir behalten uns vor, diese Rückerstattungsrichtlinie jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht.",
      },
      section6: {
        title: "6. Kontaktinformationen",
        content:
          "Für Rückerstattungsanfragen oder Abrechnungsfragen kontaktieren Sie uns über die untenstehenden Angaben.",
      },
    },
    creditsPricing: {
      meta: {
        title: "Preise – SectorCalc Credits",
        description:
          "Kaufen Sie Credits, um Premium-Industrierechner freizuschalten. Pakete ab $1,99.",
      },
      title: "Wählen Sie Ihre Credits",
      subtitle:
        "Ein Credit schaltet eine Premium-Berechnung frei. Credits verfallen 12 Monate nach dem Kauf.",
      creditsLabel: "{count} Credits",
      perCredit: "/ Credit",
      buyNow: "Credits kaufen",
      popular: "Am beliebtesten",
      legalNote:
        "Alle Preise in USD. Credits sind nicht erstattungsfähig und verfallen 12 Monate nach dem Kauf.",
    },
  },

  fr: {
    legalContact: {
      taxIdLabel: "Numéro fiscal",
      addressLabel: "Adresse",
      phoneLabel: "Téléphone",
      emailLabel: "E-mail",
    },
    legalCommon: {
      eyebrow: "Mentions légales",
      readPrivacy: "Politique de confidentialité",
      readTerms: "Conditions d'utilisation",
      readRefund: "Politique de remboursement",
      seeAlso: "Voir aussi",
      termsFooter:
        "Consultez notre <privacy>Politique de confidentialité</privacy> et notre <refund>Politique de remboursement</refund>.",
      privacyFooter:
        "Voir aussi les <terms>Conditions d'utilisation</terms> et la <refund>Politique de remboursement</refund>.",
      refundFooter:
        "Voir aussi les <terms>Conditions d'utilisation</terms> et la <privacy>Politique de confidentialité</privacy>.",
    },
    terms: {
      meta: {
        title: "Conditions d'utilisation",
        description:
          "Conditions légales d'utilisation des calculateurs et services SectorCalc.",
      },
      heroDescription:
        "En accédant à SectorCalc ou en l'utilisant, vous acceptez ces Conditions d'utilisation.",
      title: "Conditions d'utilisation",
      lastUpdated: "Dernière mise à jour : {date}",
      lastUpdatedDate: "15 juin 2026",
      intro:
        "Bienvenue sur SectorCalc. En accédant à notre site et à nos outils de calcul, vous acceptez d'être lié par ces Conditions d'utilisation.",
      section1: {
        title: "1. Nos services",
        content:
          "SectorCalc fournit des calculateurs industriels et commerciaux à des fins d'information et d'aide à la décision. Nos outils ne constituent pas un conseil professionnel en ingénierie, finance ou droit. Vous êtes seul responsable de la vérification des résultats avant toute décision commerciale.",
      },
      section2: {
        title: "2. Fonctionnalités Premium et crédits",
        content:
          "Les outils Premium nécessitent des crédits. Les crédits ne sont pas remboursables et expirent 12 mois après l'achat. Vous pouvez acheter des packs de crédits via notre prestataire de paiement sécurisé. Les crédits non utilisés ne sont pas reportés.",
      },
      section3: {
        title: "3. Comptes utilisateur",
        content:
          "Vous devez créer un compte pour accéder aux fonctionnalités Premium. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte.",
      },
      section4: {
        title: "4. Propriété intellectuelle",
        content:
          "Tous les contenus, formules, algorithmes, designs et marques sont la propriété exclusive de Sector Calculator (exploité sous SectorCalc). Toute reproduction, distribution ou création d'œuvres dérivées est interdite sans autorisation écrite préalable.",
      },
      section5: {
        title: "5. Limitation de responsabilité",
        content:
          "Dans la mesure permise par la loi, Sector Calculator ne saurait être tenu responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de votre utilisation de nos services.",
      },
      section6: {
        title: "6. Mise à jour des conditions",
        content:
          "Nous pouvons mettre à jour ces Conditions à tout moment. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles Conditions.",
      },
      section7: {
        title: "7. Coordonnées",
        content:
          "Pour toute question concernant ces Conditions, contactez-nous via les coordonnées ci-dessous.",
      },
    },
    privacy: {
      meta: {
        title: "Politique de confidentialité",
        description:
          "Comment SectorCalc collecte, utilise et protège vos données personnelles.",
      },
      heroDescription:
        "Les données que nous collectons, leur utilisation et vos droits.",
      title: "Politique de confidentialité",
      effective: "En vigueur : 15 juin 2026",
      intro:
        "Votre vie privée est importante pour nous. Cette politique explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.",
      section1: {
        title: "1. Informations que nous collectons",
        content:
          "Nous collectons les informations personnelles que vous fournissez (par ex. votre adresse e-mail lors de l'inscription). Nous collectons également automatiquement des données d'utilisation (adresse IP, type de navigateur, pages visitées) pour améliorer nos outils.",
      },
      section2: {
        title: "2. Comment nous utilisons vos informations",
        content:
          "Nous utilisons vos données pour exploiter, maintenir et améliorer SectorCalc, traiter les paiements et communiquer avec vous concernant votre compte ou les mises à jour.",
      },
      section3: {
        title: "3. Cookies et suivi",
        content:
          "Nous utilisons des cookies essentiels pour l'authentification et des cookies analytiques optionnels (par ex. Google Analytics) pour analyser l'utilisation. Vous pouvez désactiver les cookies non essentiels dans les paramètres de votre navigateur.",
      },
      section4: {
        title: "4. Partage des données",
        content:
          "Nous ne vendons pas vos données personnelles. Nous les partageons uniquement avec des prestataires tiers de confiance (processeurs de paiement — Stripe/Paddle, hébergement — Firebase) dans la mesure nécessaire à la fourniture de nos services.",
      },
      section5: {
        title: "5. Conservation et sécurité des données",
        content:
          "Nous conservons vos données tant que votre compte est actif. Nous mettons en œuvre des mesures de sécurité raisonnables, mais aucune méthode de transmission sur Internet n'est sécurisée à 100 %.",
      },
      section6: {
        title: "6. Vos droits",
        content:
          "Vous pouvez demander l'accès, la rectification ou la suppression de vos données personnelles en nous contactant à info@sectorcalc.com.",
      },
      section7: {
        title: "7. Confidentialité des enfants",
        content:
          "Nos services ne s'adressent pas aux personnes de moins de 16 ans. Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants.",
      },
      section8: {
        title: "8. Modifications de cette politique",
        content:
          'Nous pouvons mettre à jour cette politique de temps à autre. La date « En vigueur » en tête indique la date de publication de la dernière version.',
      },
      section9: {
        title: "9. Responsable du traitement",
        content: "Le responsable du traitement pour SectorCalc est :",
      },
    },
    refundPolicy: {
      meta: {
        title: "Politique de remboursement",
        description:
          "Conditions de remboursement pour les achats de crédits et abonnements SectorCalc.",
      },
      heroDescription:
        "Conditions de remboursement pour les achats de crédits et abonnements.",
      title: "Politique de remboursement",
      lastUpdated: "Dernière mise à jour : 15 juin 2026",
      intro:
        "Nous souhaitons que vous soyez satisfait de votre achat. Veuillez lire attentivement cette Politique de remboursement.",
      section1: {
        title: "1. Crédits et abonnements",
        content:
          "Crédits : Les achats de crédits sont définitifs et non remboursables. Les crédits non utilisés expirent 12 mois après l'achat. Aucun remboursement en espèces ne sera effectué pour les crédits non utilisés. Abonnements : Si vous souscrivez un abonnement récurrent, vous pouvez demander un remboursement intégral dans les 14 jours suivant votre premier paiement, à condition de n'avoir utilisé aucun outil Premium pendant cette période. Après 14 jours ou après la première utilisation, les frais d'abonnement ne sont pas remboursables.",
      },
      section2: {
        title: "2. Outils défectueux ou incorrects",
        content:
          "Si un outil Premium produit des résultats manifestement incorrects en raison d'un bug de notre système, nous rembourserons les crédits utilisés pour ce calcul (jusqu'au nombre de crédits dépensés) ou fournirons des crédits de remplacement. Veuillez signaler le problème avec des captures d'écran et des détails à info@sectorcalc.com.",
      },
      section3: {
        title: "3. Comment demander un remboursement",
        content:
          "Pour demander un remboursement, contactez-nous à info@sectorcalc.com avec votre identifiant de transaction (fourni par votre prestataire de paiement) et le motif de votre demande. Nous répondrons sous 7 à 14 jours ouvrés.",
      },
      section4: {
        title: "4. Contestations bancaires",
        content:
          "Si vous initiez une contestation bancaire sans nous avoir contactés au préalable, nous pouvons suspendre votre compte jusqu'à résolution du litige.",
      },
      section5: {
        title: "5. Modifications de cette politique",
        content:
          "Nous nous réservons le droit de modifier cette politique de remboursement à tout moment. Les modifications seront publiées sur cette page.",
      },
      section6: {
        title: "6. Coordonnées",
        content:
          "Pour les demandes de remboursement ou questions de facturation, contactez-nous via les coordonnées ci-dessous.",
      },
    },
    creditsPricing: {
      meta: {
        title: "Tarifs – Crédits SectorCalc",
        description:
          "Achetez des crédits pour débloquer des calculateurs industriels Premium. À partir de 1,99 $.",
      },
      title: "Choisissez vos crédits",
      subtitle:
        "Un crédit débloque un calcul Premium. Les crédits expirent 12 mois après l'achat.",
      creditsLabel: "{count} crédits",
      perCredit: "/ crédit",
      buyNow: "Acheter des crédits",
      popular: "Le plus populaire",
      legalNote:
        "Tous les prix sont en USD. Les crédits ne sont pas remboursables et expirent 12 mois après l'achat.",
    },
  },

  es: {
    legalContact: {
      taxIdLabel: "NIF fiscal",
      addressLabel: "Dirección",
      phoneLabel: "Teléfono",
      emailLabel: "Correo electrónico",
    },
    legalCommon: {
      eyebrow: "Legal",
      readPrivacy: "Política de privacidad",
      readTerms: "Términos de servicio",
      readRefund: "Política de reembolso",
      seeAlso: "Ver también",
      termsFooter:
        "Lea nuestra <privacy>Política de privacidad</privacy> y nuestra <refund>Política de reembolso</refund>.",
      privacyFooter:
        "Ver también los <terms>Términos de servicio</terms> y la <refund>Política de reembolso</refund>.",
      refundFooter:
        "Ver también los <terms>Términos de servicio</terms> y la <privacy>Política de privacidad</privacy>.",
    },
    terms: {
      meta: {
        title: "Términos de servicio",
        description:
          "Términos legales para el uso de las calculadoras y servicios de SectorCalc.",
      },
      heroDescription:
        "Al acceder o utilizar SectorCalc, acepta estos Términos de servicio.",
      title: "Términos de servicio",
      lastUpdated: "Última actualización: {date}",
      lastUpdatedDate: "15 de junio de 2026",
      intro:
        "Bienvenido a SectorCalc. Al acceder a nuestro sitio web y herramientas de cálculo, acepta quedar vinculado por estos Términos de servicio.",
      section1: {
        title: "1. Nuestros servicios",
        content:
          "SectorCalc ofrece calculadoras industriales y empresariales con fines informativos y de apoyo a la decisión. Nuestras herramientas no constituyen asesoramiento profesional en ingeniería, finanzas o derecho. Usted es el único responsable de verificar los resultados antes de tomar decisiones empresariales.",
      },
      section2: {
        title: "2. Funciones Premium y créditos",
        content:
          "Las herramientas Premium requieren créditos. Los créditos no son reembolsables y caducan 12 meses después de la compra. Puede adquirir paquetes de créditos a través de nuestro proveedor de pago seguro. Los créditos no utilizados no se acumulan.",
      },
      section3: {
        title: "3. Cuentas de usuario",
        content:
          "Debe crear una cuenta para acceder a las funciones Premium. Es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades realizadas bajo su cuenta.",
      },
      section4: {
        title: "4. Propiedad intelectual",
        content:
          "Todo el contenido, fórmulas, algoritmos, diseños y marcas son propiedad exclusiva de Sector Calculator (operando como SectorCalc). No puede reproducir, distribuir ni crear obras derivadas sin permiso previo por escrito.",
      },
      section5: {
        title: "5. Limitación de responsabilidad",
        content:
          "En la máxima medida permitida por la ley, Sector Calculator no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso de nuestros servicios.",
      },
      section6: {
        title: "6. Modificaciones",
        content:
          "Podemos actualizar estos Términos en cualquier momento. El uso continuado del servicio tras los cambios constituye la aceptación de los nuevos Términos.",
      },
      section7: {
        title: "7. Información de contacto",
        content:
          "Para preguntas sobre estos Términos, contáctenos mediante los datos que figuran a continuación.",
      },
    },
    privacy: {
      meta: {
        title: "Política de privacidad",
        description:
          "Cómo SectorCalc recopila, utiliza y protege sus datos personales.",
      },
      heroDescription:
        "Qué datos recopilamos, cómo los usamos y sus derechos.",
      title: "Política de privacidad",
      effective: "Vigente desde: 15 de junio de 2026",
      intro:
        "Su privacidad es importante para nosotros. Esta política explica qué datos recopilamos, cómo los usamos y cuáles son sus derechos.",
      section1: {
        title: "1. Información que recopilamos",
        content:
          "Recopilamos la información personal que usted proporciona (p. ej., su dirección de correo electrónico al registrarse). También recopilamos automáticamente datos de uso (dirección IP, tipo de navegador, páginas visitadas) para mejorar nuestras herramientas.",
      },
      section2: {
        title: "2. Cómo usamos su información",
        content:
          "Usamos sus datos para operar, mantener y mejorar SectorCalc, procesar pagos y comunicarnos con usted sobre su cuenta o actualizaciones.",
      },
      section3: {
        title: "3. Cookies y seguimiento",
        content:
          "Utilizamos cookies esenciales para la autenticación y cookies analíticas opcionales (p. ej., Google Analytics) para analizar el uso. Puede desactivar las cookies no esenciales en la configuración de su navegador.",
      },
      section4: {
        title: "4. Compartición de datos",
        content:
          "No vendemos sus datos personales. Solo compartimos datos con servicios de terceros de confianza (procesadores de pago — Stripe/Paddle, alojamiento — Firebase) según sea necesario para prestar nuestros servicios.",
      },
      section5: {
        title: "5. Retención y seguridad de datos",
        content:
          "Conservamos sus datos mientras su cuenta esté activa. Implementamos medidas de seguridad razonables, pero ningún método de transmisión por Internet es 100 % seguro.",
      },
      section6: {
        title: "6. Sus derechos",
        content:
          "Puede solicitar acceso, corrección o eliminación de sus datos personales contactándonos en info@sectorcalc.com.",
      },
      section7: {
        title: "7. Privacidad de menores",
        content:
          "Nuestros servicios no están dirigidos a menores de 16 años. No recopilamos deliberadamente información personal de niños.",
      },
      section8: {
        title: "8. Cambios en esta política",
        content:
          'Podemos actualizar esta política periódicamente. La fecha «Vigente desde» en la parte superior indica cuándo se publicó la última versión.',
      },
      section9: {
        title: "9. Responsable del tratamiento",
        content: "El responsable del tratamiento de SectorCalc es:",
      },
    },
    refundPolicy: {
      meta: {
        title: "Política de reembolso",
        description:
          "Condiciones de reembolso para compras de créditos y suscripciones en SectorCalc.",
      },
      heroDescription:
        "Condiciones de reembolso para compras de créditos y suscripciones.",
      title: "Política de reembolso",
      lastUpdated: "Última actualización: 15 de junio de 2026",
      intro:
        "Queremos que esté satisfecho con su compra. Lea atentamente esta Política de reembolso.",
      section1: {
        title: "1. Créditos y suscripciones",
        content:
          "Créditos: Las compras de créditos son definitivas y no reembolsables. Los créditos no utilizados caducan 12 meses después de la compra. No se emitirán reembolsos en efectivo por créditos no utilizados. Suscripciones: Si adquiere una suscripción recurrente, puede solicitar un reembolso completo dentro de los 14 días posteriores al primer pago, siempre que no haya utilizado ninguna herramienta Premium durante ese período. Tras 14 días o tras el primer uso, las cuotas de suscripción no son reembolsables.",
      },
      section2: {
        title: "2. Herramientas defectuosas o incorrectas",
        content:
          "Si una herramienta Premium produce resultados manifiestamente incorrectos debido a un error en nuestro sistema, reembolsaremos los créditos utilizados para ese cálculo (hasta el número de créditos gastados) o proporcionaremos créditos de reemplazo. Informe del problema con capturas de pantalla y detalles a info@sectorcalc.com.",
      },
      section3: {
        title: "3. Cómo solicitar un reembolso",
        content:
          "Para solicitar un reembolso, contáctenos en info@sectorcalc.com con su ID de transacción (del proveedor de pago) y el motivo de la solicitud. Responderemos en un plazo de 7 a 14 días hábiles.",
      },
      section4: {
        title: "4. Contracargos",
        content:
          "Si inicia un contracargo sin contactarnos primero, podemos suspender su cuenta hasta que se resuelva el asunto.",
      },
      section5: {
        title: "5. Cambios en esta política",
        content:
          "Nos reservamos el derecho de modificar esta política de reembolso en cualquier momento. Los cambios se publicarán en esta página.",
      },
      section6: {
        title: "6. Información de contacto",
        content:
          "Para solicitudes de reembolso o consultas de facturación, contáctenos mediante los datos que figuran a continuación.",
      },
    },
    creditsPricing: {
      meta: {
        title: "Precios – Créditos SectorCalc",
        description:
          "Compre créditos para desbloquear calculadoras industriales Premium. Planes desde $1,99.",
      },
      title: "Elija sus créditos",
      subtitle:
        "Un crédito desbloquea un cálculo Premium. Los créditos caducan 12 meses después de la compra.",
      creditsLabel: "{count} créditos",
      perCredit: "/ crédito",
      buyNow: "Comprar créditos",
      popular: "Más popular",
      legalNote:
        "Todos los precios están en USD. Los créditos no son reembolsables y caducan 12 meses después de la compra.",
    },
  },

  ar: {
    legalContact: {
      taxIdLabel: "الرقم الضريبي",
      addressLabel: "العنوان",
      phoneLabel: "الهاتف",
      emailLabel: "البريد الإلكتروني",
    },
    legalCommon: {
      eyebrow: "قانوني",
      readPrivacy: "سياسة الخصوصية",
      readTerms: "شروط الخدمة",
      readRefund: "سياسة الاسترداد",
      seeAlso: "انظر أيضًا",
      termsFooter:
        "اقرأ <privacy>سياسة الخصوصية</privacy> و<refund>سياسة الاسترداد</refund>.",
      privacyFooter:
        "انظر أيضًا <terms>شروط الخدمة</terms> و<refund>سياسة الاسترداد</refund>.",
      refundFooter:
        "انظر أيضًا <terms>شروط الخدمة</terms> و<privacy>سياسة الخصوصية</privacy>.",
    },
    terms: {
      meta: {
        title: "شروط الخدمة",
        description:
          "الشروط القانونية لاستخدام حاسبات وخدمات SectorCalc.",
      },
      heroDescription:
        "باستخدامك SectorCalc أو الوصول إليه، فإنك توافق على شروط الخدمة هذه.",
      title: "شروط الخدمة",
      lastUpdated: "آخر تحديث: {date}",
      lastUpdatedDate: "15 يونيو 2026",
      intro:
        "مرحبًا بك في SectorCalc. باستخدامك موقعنا وأدوات الحساب، فإنك توافق على الالتزام بشروط الخدمة هذه.",
      section1: {
        title: "1. خدماتنا",
        content:
          "يوفر SectorCalc حاسبات صناعية وتجارية لأغراض إعلامية ودعم اتخاذ القرار. لا تشكل أدواتنا استشارة هندسية أو مالية أو قانونية مهنية. أنت وحدك المسؤول عن التحقق من أي نتائج قبل اتخاذ قرارات عمل.",
      },
      section2: {
        title: "2. الميزات المميزة والأرصدة",
        content:
          "تتطلب الأدوات المميزة أرصدة. الأرصدة غير قابلة للاسترداد وتنتهي صلاحيتها بعد 12 شهرًا من الشراء. يمكنك شراء حزم الأرصدة عبر مزود الدفع الآمن لدينا. لا تُرحَّل الأرصدة غير المستخدمة.",
      },
      section3: {
        title: "3. حسابات المستخدمين",
        content:
          "يجب إنشاء حساب للوصول إلى الميزات المميزة. أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول وعن جميع الأنشطة التي تتم عبر حسابك.",
      },
      section4: {
        title: "4. الملكية الفكرية",
        content:
          "جميع المحتويات والصيغ والخوارزميات والتصاميم والعلامات التجارية هي ملكية حصرية لـ Sector Calculator (تعمل باسم SectorCalc). لا يجوز النسخ أو التوزيع أو إنشاء أعمال مشتقة دون إذن كتابي مسبق.",
      },
      section5: {
        title: "5. تحديد المسؤولية",
        content:
          "في الحد الأقصى الذي يسمح به القانون، لا تتحمل Sector Calculator أي مسؤولية عن الأضرار غير المباشرة أو العرضية أو الخاصة أو التبعية أو العقابية الناتجة عن استخدامك لخدماتنا.",
      },
      section6: {
        title: "6. التعديلات",
        content:
          "يجوز لنا تحديث هذه الشروط في أي وقت. استمرارك في استخدام الخدمة بعد التغييرات يُعد قبولًا للشروط الجديدة.",
      },
      section7: {
        title: "7. معلومات الاتصال",
        content:
          "للاستفسارات حول هذه الشروط، تواصل معنا عبر بيانات الاتصال أدناه.",
      },
    },
    privacy: {
      meta: {
        title: "سياسة الخصوصية",
        description:
          "كيف تجمع SectorCalc بياناتك الشخصية وتستخدمها وتحميها.",
      },
      heroDescription:
        "البيانات التي نجمعها وكيف نستخدمها وحقوقك.",
      title: "سياسة الخصوصية",
      effective: "ساري المفعول: 15 يونيو 2026",
      intro:
        "خصوصيتك مهمة بالنسبة لنا. توضح هذه السياسة البيانات التي نجمعها وكيف نستخدمها وحقوقك.",
      section1: {
        title: "1. المعلومات التي نجمعها",
        content:
          "نجمع المعلومات الشخصية التي تقدمها (مثل عنوان بريدك الإلكتروني عند التسجيل). كما نجمع تلقائيًا بيانات الاستخدام (عنوان IP ونوع المتصفح والصفحات التي تزورها) لتحسين أدواتنا.",
      },
      section2: {
        title: "2. كيف نستخدم معلوماتك",
        content:
          "نستخدم بياناتك لتشغيل SectorCalc وصيانته وتحسينه ومعالجة المدفوعات والتواصل معك بشأن حسابك أو التحديثات.",
      },
      section3: {
        title: "3. ملفات تعريف الارتباط والتتبع",
        content:
          "نستخدم ملفات تعريف ارتباط أساسية للمصادقة وملفات تحليلية اختيارية (مثل Google Analytics) لتحليل الاستخدام. يمكنك تعطيل ملفات الارتباط غير الأساسية من إعدادات المتصفح.",
      },
      section4: {
        title: "4. مشاركة البيانات",
        content:
          "لا نبيع بياناتك الشخصية. نشارك البيانات فقط مع مزودي خدمات خارجيين موثوقين (معالجو الدفع — Stripe/Paddle، الاستضافة — Firebase) بالقدر اللازم لتقديم خدماتنا.",
      },
      section5: {
        title: "5. الاحتفاظ بالبيانات والأمان",
        content:
          "نحتفظ ببياناتك طالما كان حسابك نشطًا. نطبق تدابير أمنية معقولة، لكن لا توجد طريقة نقل عبر الإنترنت آمنة بنسبة 100%.",
      },
      section6: {
        title: "6. حقوقك",
        content:
          "يمكنك طلب الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها بالتواصل معنا على info@sectorcalc.com.",
      },
      section7: {
        title: "7. خصوصية الأطفال",
        content:
          "خدماتنا غير موجهة للأفراد دون سن 16. لا نجمع عن قصد معلومات شخصية من الأطفال.",
      },
      section8: {
        title: "8. تغييرات هذه السياسة",
        content:
          'يجوز لنا تحديث هذه السياسة من وقت لآخر. يشير تاريخ «ساري المفعول» في الأعلى إلى موعد نشر أحدث نسخة.',
      },
      section9: {
        title: "9. مسؤول البيانات",
        content: "مسؤول البيانات لـ SectorCalc هو:",
      },
    },
    refundPolicy: {
      meta: {
        title: "سياسة الاسترداد",
        description:
          "شروط استرداد مشتريات الأرصدة والاشتراكات في SectorCalc.",
      },
      heroDescription:
        "شروط استرداد مشتريات الأرصدة والاشتراكات.",
      title: "سياسة الاسترداد",
      lastUpdated: "آخر تحديث: 15 يونيو 2026",
      intro:
        "نريدك أن تكون راضيًا عن مشترياتك. يرجى قراءة سياسة الاسترداد هذه بعناية.",
      section1: {
        title: "1. الأرصدة والاشتراكات",
        content:
          "الأرصدة: مشتريات الأرصدة نهائية وغير قابلة للاسترداد. تنتهي صلاحية الأرصدة غير المستخدمة بعد 12 شهرًا من الشراء. لن يُصدر أي استرداد نقدي للأرصدة غير المستخدمة. الاشتراكات: إذا اشتريت اشتراكًا متكررًا، يمكنك طلب استرداد كامل خلال 14 يومًا من أول دفعة، بشرط ألا تكون قد استخدمت أي أداة مميزة خلال تلك الفترة. بعد 14 يومًا أو بعد أول استخدام، لا تُسترد رسوم الاشتراك.",
      },
      section2: {
        title: "2. أدوات معيبة أو غير صحيحة",
        content:
          "إذا أنتجت أداة مميزة نتائج خاطئة بشكل واضح بسبب خطأ في نظامنا، فسنسترد الأرصدة المستخدمة لذلك الحساب (حتى عدد الأرصدة المُنفقة) أو نوفر أرصدة بديلة. يرجى الإبلاغ عن المشكلة مع لقطات الشاشة والتفاصيل إلى info@sectorcalc.com.",
      },
      section3: {
        title: "3. كيفية طلب الاسترداد",
        content:
          "لطلب الاسترداد، تواصل معنا على info@sectorcalc.com مع معرّف المعاملة (من مزود الدفع) وسبب الطلب. سنرد خلال 7–14 يوم عمل.",
      },
      section4: {
        title: "4. عمليات رد المبالغ (Chargeback)",
        content:
          "إذا بدأت عملية رد مبالغ دون التواصل معنا أولًا، قد نعلق حسابك حتى يُحل الأمر.",
      },
      section5: {
        title: "5. تغييرات هذه السياسة",
        content:
          "نحتفظ بالحق في تعديل سياسة الاسترداد هذه في أي وقت. تُنشر التغييرات على هذه الصفحة.",
      },
      section6: {
        title: "6. معلومات الاتصال",
        content:
          "لطلبات الاسترداد أو استفسارات الفوترة، تواصل معنا عبر بيانات الاتصال أدناه.",
      },
    },
    creditsPricing: {
      meta: {
        title: "الأسعار – أرصدة SectorCalc",
        description:
          "اشترِ أرصدة لفتح الحاسبات الصناعية المميزة. تبدأ الخطط من 1.99 دولار.",
      },
      title: "اختر أرصدتك",
      subtitle:
        "رصيد واحد يفتح حسابًا مميزًا واحدًا. تنتهي صلاحية الأرصدة بعد 12 شهرًا من الشراء.",
      creditsLabel: "{count} رصيد",
      perCredit: "/ رصيد",
      buyNow: "شراء أرصدة",
      popular: "الأكثر شيوعًا",
      legalNote:
        "جميع الأسعار بالدولار الأمريكي. الأرصدة غير قابلة للاسترداد وتنتهي صلاحيتها بعد 12 شهرًا من الشراء.",
    },
  },
};

for (const locale of LOCALES) {
  const filePath = join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  Object.assign(data, packs[locale]);
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`merged legal i18n → messages/${locale}.json`);
}
