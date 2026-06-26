import fs from 'fs';

let content = fs.readFileSync('src/components/pricing/PricingPageContent.tsx', 'utf8');

content = content.replace(
  "import { EmailCaptureModal } from '@/components/pricing/EmailCaptureModal'",
  "import { EmailCaptureModal } from '@/components/pricing/EmailCaptureModal'\nimport { Container } from '@/components/layout/Container'"
);

content = content.replace(
  "Prices in USD · Tax included · Credits valid 12 months",
  "{t.rich('footer.pricingDisclaimer', { currency: 'USD' })}"
);

content = content.replace(
  "        <FAQ />\n      </Container>\n    </div>\n  )\n}",
  `        <FAQ />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <footer className="text-center text-[11px] text-body-charcoal leading-7 border-t border-technical-gray pt-8 mt-4">
          {t('footer.companyInfo')}<br/>
          <a href="mailto:info@sectorcalc.com" className="hover:text-sc-navy">info@sectorcalc.com</a>
          {' · '}<a href="/terms" className="hover:text-sc-navy">{t('footer.terms')}</a>
          {' · '}<a href="/privacy" className="hover:text-sc-navy">{t('footer.privacy')}</a>
          {' · '}<a href="/refund-policy" className="hover:text-sc-navy">{t('footer.refund')}</a>
        </footer>
      </Container>
    </div>
  )
}`
);

fs.writeFileSync('src/components/pricing/PricingPageContent.tsx', content);
