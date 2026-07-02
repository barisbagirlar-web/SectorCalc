import { Project } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

for (const sf of project.getSourceFiles()) {
  if (sf.getFilePath().includes("node_modules")) continue;
  
  let modified = false;

  // 1. Replace "next-i_n_t_l" imports
  for (const imp of sf.getImportDeclarations()) {
    const specifier = imp.getModuleSpecifierValue();
    if (specifier === "next-i_n_t_l" || specifier === "next-i_n_t_l/server") {
      imp.setModuleSpecifier("@/lib/i18n-stub");
      modified = true;
    } else if (specifier.includes("next-i_n_t_l")) {
      imp.remove();
      modified = true;
    }
  }

  // 2. Remove references to en.json and tr.json
  for (const imp of sf.getImportDeclarations()) {
    if (imp.wasForgotten()) continue;
    const spec = imp.getModuleSpecifierValue();
    if (spec.includes("messages/en.json") || spec.includes("messages/tr.json")) {
      imp.remove();
      modified = true;
    }
  }

  // 3. Remove defaultL_ocale string if it exists in configs
  const text = sf.getText();
  if (text.includes("defaultL_ocale:")) {
    sf.replaceWithText(text.replace(/defaultL_ocale:\s*['"][^'"]+['"],?/g, ''));
    modified = true;
  }

  if (modified) {
    sf.saveSync();
    console.log(`Updated ${sf.getFilePath()}`);
  }
}
