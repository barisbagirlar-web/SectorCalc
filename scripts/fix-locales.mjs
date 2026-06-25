import fs from 'fs';
import path from 'path';

function fixLocales(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixLocales(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // 1. const { locale, slug } = await params;
      // -> const { slug } = await params; const locale = "en";
      if (content.includes('const { locale, slug } = await params;')) {
        content = content.replace(
          /const \{ locale, slug \} = await params;/g,
          'const { slug } = await params;\n  const locale = "en";'
        );
        changed = true;
      }
      
      // 2. const { slug, locale } = await params;
      if (content.includes('const { slug, locale } = await params;')) {
        content = content.replace(
          /const \{ slug, locale \} = await params;/g,
          'const { slug } = await params;\n  const locale = "en";'
        );
        changed = true;
      }

      // 3. const { locale } = await params;
      if (content.includes('const { locale } = await params;')) {
        content = content.replace(
          /const \{ locale \} = await params;/g,
          'const locale = "en";'
        );
        changed = true;
      }

      // 4. const locale = (await params).locale;
      if (content.includes('const locale = (await params).locale;')) {
        content = content.replace(
          /const locale = \(await params\)\.locale;/g,
          'const locale = "en";'
        );
        changed = true;
      }

      // 5. In generateStaticParams
      // return ["en", "tr"].map((locale) => ({ locale, slug })); -> return [{ slug }]
      // But they might be doing: return ["en"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
      // Let's just fix the case study one directly:
      if (content.includes('return ["en"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));')) {
        content = content.replace(
          'return ["en"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));',
          'return slugs.map((slug) => ({ slug }));'
        );
        changed = true;
      }
      
      // Also for Free Tools / Pro Tools generateStaticParams
      if (content.includes('return ["en"].flatMap((locale) => tools.map((t) => ({ locale, slug: t.slug })));')) {
        content = content.replace(
          'return ["en"].flatMap((locale) => tools.map((t) => ({ locale, slug: t.slug })));',
          'return tools.map((t) => ({ slug: t.slug }));'
        );
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed locales in ${fullPath}`);
      }
    }
  }
}

fixLocales('src/app');
