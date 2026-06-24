import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect x="2" y="2" width="13" height="13" rx="3" fill="#0F172A"/>
  <rect x="17" y="2" width="13" height="13" rx="3" fill="#2563EB"/>
  <rect x="2" y="17" width="13" height="13" rx="3" fill="#10B981"/>
  <rect x="17" y="17" width="13" height="13" rx="3" fill="#F59E0B"/>
</svg>
</body>
</html>
`;

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);

  const targets = [
    { size: 32, file: 'public/img/brand/sectorcalc-favicon-32.png' },
    { size: 180, file: 'public/img/brand/sectorcalc-favicon-180.png' },
    { size: 512, file: 'public/img/brand/sectorcalc-favicon.png' },
    { size: 32, file: 'public/favicon.ico' },
    { size: 192, file: 'public/icon.png' },
    { size: 180, file: 'public/apple-icon.png' },
    { size: 192, file: 'public/icons/icon-192.png' },
    { size: 512, file: 'public/icons/icon-512.png' }
  ];

  for (const target of targets) {
    const filePath = path.resolve(target.file);
    console.log(`Generating: ${target.file} (${target.size}x${target.size})...`);
    await page.setViewportSize({ width: target.size, height: target.size });
    // Small timeout to ensure rendering
    await page.waitForTimeout(100);
    await page.screenshot({
      path: filePath,
      omitBackground: true,
      type: 'png'
    });
    console.log(`Saved to ${filePath}`);
  }

  await browser.close();
  console.log('All icons generated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
