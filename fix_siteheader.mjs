import fs from 'fs';
const file = '/Users/macair1/projects/SectorCalc-p5a/src/components/layout/SiteHeader.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix duplicate keys in T
content = content.replace(/tools:'Tools',\n\s+tools:'Tools',/g, "tools:'Tools',");
content = content.replace(/tools:'Araçlar',\n\s+tools:'Araçlar',/g, "tools:'Araçlar',");
content = content.replace(/tools:'outils',\n\s+tools:'outils',/g, "tools:'outils',");
content = content.replace(/tools:'herramientas',\n\s+tools:'herramientas',/g, "tools:'herramientas',");
content = content.replace(/tools:'أدوات',\n\s+tools:'أدوات',/g, "tools:'أدوات',");

// Also remove the one with `lang_note` next to it if it duplicated
content = content.replace(/(grp_production.*?\n.*?\n.*?\n.*?\n.*?tools:'.*?'),\s*tools:'.*?',\s*lang_note/gs, "$1, lang_note");

// Fix TS types for openMenu state
content = content.replace(/const \[openMenu,setOpenMenu\]=useState\(null\);/g, "const [openMenu,setOpenMenu]=useState<string|null>(null);");

// Fix TS any types
content = content.replace(/function getLocale\(p\)/g, "function getLocale(p: string)");
content = content.replace(/function href\(loc,slug\)/g, "function href(loc: string,slug: string)");
content = content.replace(/function rootHref\(loc\)/g, "function rootHref(loc: string)");
content = content.replace(/function buildLocalePath\(p,target\)/g, "function buildLocalePath(p: string,target: string)");
content = content.replace(/const openWithIntent=useCallback\(\(m\)=>/g, "const openWithIntent=useCallback((m: string)=>");
content = content.replace(/function onClick\(e\)/g, "function onClick(e: any)");
content = content.replace(/function onKey\(e\)/g, "function onKey(e: any)");
content = content.replace(/const switchLocale=\(code\)=>/g, "const switchLocale=(code: string)=>");
content = content.replace(/useRef\(null\)/g, "useRef<any>(null)");

// Fix mobile menu references to groupEn and en
content = content.replace(/<h4>\{locale==='tr'\?g\.groupTr:g\.groupEn\}<\/h4>/g, "<h4>{t[g.groupKey as keyof typeof t]}</h4>");
content = content.replace(/<b>\{it\.en\}<\/b>/g, "<b>{t[it.key as keyof typeof t]}</b>");
content = content.replace(/<span className="txt">\{it\.en\}<\/span>/g, '<span className="txt">{t[it.key as keyof typeof t]}</span>');
content = content.replace(/<div className="sc-draw-sec" key=\{g\.groupEn\}>/g, '<div className="sc-draw-sec" key={g.groupKey}>');
content = content.replace(/<button className="sc-draw-head" onClick\(\)=>toggleMobileGroup\(g\.groupEn\)/g, '<button className="sc-draw-head" onClick={()=>toggleMobileGroup(g.groupKey)}');
content = content.replace(/const toggleMobileGroup=\(grp\)=>/g, "const toggleMobileGroup=(grp: string)=>");

// The regex above might be slightly off. Let's do a more robust string replacement for mobile menu groupEn:
content = content.split("g.groupEn").join("g.groupKey");
content = content.split("it.en").join("t[it.key as keyof typeof t]");
content = content.split("t[g.groupKey]").join("t[g.groupKey as keyof typeof t]");

// Fix T[locale] indexing type error
content = content.replace(/const t        = T\[locale\] \|\| T\.en;/g, "const t        = T[locale as keyof typeof T] || T.en;");

fs.writeFileSync(file, content);
console.log('patched');
