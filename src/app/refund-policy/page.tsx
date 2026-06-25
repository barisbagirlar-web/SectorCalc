/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import Link  from "next/link";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

const T = {
  en: {
    eyebrow: "Legal",
    title: "Refund Policy",
    description: "Last updated for SectorCalc. Our 7-day refund guarantee policy for calculator credits and subscriptions.",
    intro: "SectorCalc provides engineering-grade decision support. We stand behind our results with a 7-day refund policy.",
    sections: [
      {
        title: "7-Day Satisfaction Guarantee",
        paragraphs: [
          "If your purchased calculator credit does not produce a usable result, or if you are unsatisfied with the quality of the premium decision report, contact us within 7 days of purchase.",
          "We will restore the credit to your account or issue a full refund, no questions asked."
        ]
      },
      {
        title: "Subscription Cancellations",
        paragraphs: [
          "Pro subscriptions can be canceled at any time. Upon cancellation, you will retain premium access until the end of your billing cycle.",
          "Canceled subscriptions do not renew automatically."
        ]
      },
      {
        title: "How to Request a Refund",
        paragraphs: [
          "To request a refund or credit restoration, please send an email to hello@sectorcalc.com.",
          "Include your account email address, the reference number of the transaction, and the name of the calculator you used."
        ]
      }
    ],
    metaTitle: "Refund Policy | SectorCalc",
    metaDescription: "Our 7-day refund guarantee policy for calculator credits and subscriptions.",
    seeAlso: "See also"
  },
  tr: {
    eyebrow: "Yasal",
    title: "İade Politikası",
    description: "SectorCalc için son güncelleme. Hesaplayıcı kredileri ve abonelikleri için 7 günlük iade garantisi politikamız.",
    intro: "SectorCalc, mühendislik kalitesinde karar desteği sağlar. Sonuçlarımızın arkasında duruyor ve 7 günlük iade politikası sunuyoruz.",
    sections: [
      {
        title: "7 Günlük Memnuniyet Garantisi",
        paragraphs: [
          "Satın aldığınız hesaplayıcı kredisi kullanılabilir bir sonuç üretmezse veya premium karar raporunun kalitesinden memnun kalmazsanız, satın alma tarihinden itibaren 7 gün içinde bizimle iletişime geçin.",
          "Krediyi hesabınıza iade edeceğiz veya sorgusuz sualsiz tam para iadesi gerçekleştireceğiz."
        ]
      },
      {
        title: "Abonelik İptalleri",
        paragraphs: [
          "Pro abonelikleri dilediğiniz zaman iptal edilebilir. İptal durumunda, faturalandırma döneminizin sonuna kadar premium erişiminizi korursunuz.",
          "İptal edilen abonelikler otomatik olarak yenilenmez."
        ]
      },
      {
        title: "İade Talebi Nasıl Yapılır",
        paragraphs: [
          "İade veya kredi geri yükleme talebinde bulunmak için lütfen hello@sectorcalc.com adresine e-posta gönderin.",
          "Hesap e-posta adresinizi, işlem referans numarasını ve kullandığınız hesaplayıcının adını eklemeyi unutmayın."
        ]
      }
    ],
    metaTitle: "İade Politikası | SectorCalc",
    metaDescription: "Hesaplayıcı kredileri ve abonelikleri için 7 günlük iade garantisi politikamız.",
    seeAlso: "Ayrıca bakınız"
  },
  de: {
    eyebrow: "Rechtliches",
    title: "Rückerstattungspolitik",
    description: "Zuletzt aktualisiert für SectorCalc. Unsere 7-tägige Rückerstattungsgarantie für Rechner-Credits und Abonnements.",
    intro: "SectorCalc bietet Entscheidungshilfe auf Ingenieursniveau. Wir stehen hinter unseren Ergebnissen mit einer 7-tägigen Rückerstattungsrichtlinie.",
    sections: [
      {
        title: "7-Tage-Zufriedenheitsgarantie",
        paragraphs: [
          "Wenn Ihr erworbener Rechner-Credit kein brauchbares Ergebnis liefert oder Sie mit der Qualität des Premium-Entscheidungsberichts unzufrieden sind, kontaktieren Sie uns innerhalb von 7 Tagen nach dem Kauf.",
          "Wir erstatten den Credit auf Ihr Konto zurück oder veranlassen eine vollständige Rückerstattung, ohne Fragen zu stellen."
        ]
      },
      {
        title: "Abonnement-Kündigungen",
        paragraphs: [
          "Pro-Abonnements können jederzeit gekündigt werden. Nach der Kündigung behalten Sie den Premium-Zugang bis zum Ende Ihres Abrechnungszeitraums.",
          "Gekündigte Abonnements verlängern sich nicht automatisch."
        ]
      },
      {
        title: "So fordern Sie eine Rückerstattung an",
        paragraphs: [
          "Um eine Rückerstattung oder Credit-Wiederherstellung zu beantragen, senden Sie bitte eine E-Mail an hello@sectorcalc.com.",
          "Geben Sie Ihre E-Mail-Adresse, die Referenznummer der Transaktion und den Namen des verwendeten Rechners an."
        ]
      }
    ],
    metaTitle: "Rückerstattungspolitik | SectorCalc",
    metaDescription: "Unsere 7-tägige Rückerstattungsgarantie für Rechner-Credits und Abonnements.",
    seeAlso: "Siehe auch"
  },
  fr: {
    eyebrow: "Mentions légales",
    title: "Politique de remboursement",
    description: "Dernière mise à jour pour SectorCalc. Notre politique de garantie de remboursement de 7 jours pour les crédits et abonnements.",
    intro: "SectorCalc fournit un support de décision de niveau ingénieur. Nous garantissons nos résultats avec une politique de remboursement de 7 jours.",
    sections: [
      {
        title: "Garantie de satisfaction de 7 jours",
        paragraphs: [
          "Si le crédit de calculateur que vous avez acheté ne produit pas de résultat utilisable, ou si vous n'êtes pas satisfait de la qualité du rapport de décision premium, contactez-nous dans les 7 jours suivant l'achat.",
          "Nous restaurerons le crédit sur votre compte ou effectuerons un remboursement complet, sans poser de questions."
        ]
      },
      {
        title: "Annulations d'abonnements",
        paragraphs: [
          "Les abonnements Pro peuvent être annulés à tout moment. En cas d'annulation, vous conserverez l'accès premium jusqu'à la fin de votre cycle de facturation.",
          "Les abonnements annulés ne se renouvellent pas automatiquement."
        ]
      },
      {
        title: "Comment demander un remboursement",
        paragraphs: [
          "Pour demander un remboursement ou une restauration de crédit, veuillez envoyer un e-mail à hello@sectorcalc.com.",
          "Veuillez inclure l'adresse e-mail de votre compte, le numéro de référence de la transaction et le nom du calculateur utilisé."
        ]
      }
    ],
    metaTitle: "Politique de remboursement | SectorCalc",
    metaDescription: "Notre politique de garantie de remboursement de 7 jours pour les crédits et abonnements.",
    seeAlso: "Voir aussi"
  },
  es: {
    eyebrow: "Legal",
    title: "Política de reembolso",
    description: "Última actualización para SectorCalc. Nuestra política de garantía de reembolso de 7 días para créditos de calculadora y suscripciones.",
    intro: "SectorCalc proporciona soporte de decisiones de grado de ingeniería. Respaldamos nuestros resultados con una política de reembolso de 7 días.",
    sections: [
      {
        title: "Garantía de satisfacción de 7 días",
        paragraphs: [
          "Si el crédito de calculadora comprado no produce un resultado utilizable, o si no está satisfecho con la calidad del informe de decisión premium, contáctenos dentro de los 7 días posteriores a la compra.",
          "Restauraremos el crédito a su cuenta o emitiremos un reembolso completo, sin preguntas."
        ]
      },
      {
        title: "Cancelaciones de suscripción",
        paragraphs: [
          "Las suscripciones Pro se pueden cancelar en cualquier momento. Tras la cancelación, mantendrá el acceso premium hasta el final de su ciclo de facturación.",
          "Las suscripciones canceladas no se renuevan automáticamente."
        ]
      },
      {
        title: "Cómo solicitar un reembolso",
        paragraphs: [
          "Para solicitar un reembolso o la restauración de un crédito, envíe un correo electrónico a hello@sectorcalc.com.",
          "Incluya la dirección de correo electrónico de su cuenta, el número de referencia de la transacción y el nombre de la calculadora que utilizó."
        ]
      }
    ],
    metaTitle: "Política de reembolso | SectorCalc",
    metaDescription: "Nuestra política de garantía de reembolso de 7 días para créditos de calculadora y suscripciones.",
    seeAlso: "Ver también"
  },
  ar: {
    eyebrow: "قانوني",
    title: "سياسة الاسترداد",
    description: "آخر تحديث لـ SectorCalc. سياسة ضمان الاسترداد لمدة 7 أيام للاشتراكات وائتمانات الحاسبة.",
    intro: "يوفر SectorCalc دعم اتخاذ القرار بمستوى هندسي. نحن ندعم نتائجنا بسياسة استرداد مدتها 7 أيام.",
    sections: [
      {
        title: "ضمان الرضا لمدة 7 أيام",
        paragraphs: [
          "إذا لم ينتج عن رصيد الحاسبة الذي تم شراؤه نتيجة قابلة للاستخدام، أو إذا لم تكن راضيًا عن جودة تقرير القرار المتميز، فاتصل بنا في غضون 7 أيام من الشراء.",
          "سنقوم بإعادة الرصيد إلى حسابك أو استرداد المبلغ بالكامل، دون طرح أي أسئلة."
        ]
      },
      {
        title: "إلغاء الاشتراكات",
        paragraphs: [
          "يمكن إلغاء اشتراكات Pro في أي وقت. عند الإلغاء، ستحتفظ بالوصول المتميز حتى نهاية دورة الفوترة الخاصة بك.",
          "الاشتراكات الملغاة لا تتجدد تلقائيًا."
        ]
      },
      {
        title: "كيفية طلب استرداد الأموال",
        paragraphs: [
          "لطلب استرداد الأموال أو استعادة الرصيد، يرجى إرسال بريد إلكتروني إلى hello@sectorcalc.com.",
          "يرجى تضمين عنوان البريد الإلكتروني لحسابك، والرقم المرجعي للمعاملة، واسم الحاسبة التي استخدمتها."
        ]
      }
    ],
    metaTitle: "سياسة الاسترداد | SectorCalc",
    metaDescription: "سياسة ضمان الاسترداد لمدة 7 أيام للاشتراكات وائتمانات الحاسبة.",
    seeAlso: "انظر أيضاً"
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = T[locale as keyof typeof T] || T.en;

  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/refund-policy",
    locale: locale as "en",
  });
}

export default async function RefundPolicyPage({ params }: PageProps) {
  const locale = "en";
  
  const t = T[locale as keyof typeof T] || T.en;

  return (
    <PageLayout>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />
      <LegalPageContent
        title={t.title}
        intro={t.intro}
        sections={t.sections}
        footerNote={
          <p>
            {t.seeAlso}{" "}
            <Link href="/terms" className="font-semibold text-deep-navy hover:underline">
              {locale === 'tr' ? 'Kullanım Koşulları' : (locale === 'de' ? 'Nutzungsbedingungen' : (locale === 'fr' ? 'Conditions d’utilisation' : (locale === 'es' ? 'Condiciones de uso' : (locale === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'))))}
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-deep-navy hover:underline"
            >
              {locale === 'tr' ? 'Gizlilik Politikası' : (locale === 'de' ? 'Datenschutzerklärung' : (locale === 'fr' ? 'Politique de confidentialité' : (locale === 'es' ? 'Política de privacidad' : (locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'))))}
            </Link>
            .
          </p>
        }
      />
    </PageLayout>
  );
}
