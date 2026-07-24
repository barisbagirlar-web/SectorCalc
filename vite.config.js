import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html', calculator: 'calculator.html', calculator2: 'calculator2.html', calculator3: 'calculator3.html', calculator4: 'calculator4.html', pricing: 'pricing.html',
        'sc008-pro': 'sc008-pro.html', 'labor-pro': 'labor-pro.html', 'quote-pro': 'quote-pro.html', 'weld-pro': 'weld-pro.html', 'machining-pro': 'machining-pro.html', 'bearing-pro': 'bearing-pro.html', 'shaft-pro': 'shaft-pro.html', 'bolt-pro': 'bolt-pro.html', 'punching-pro': 'punching-pro.html', 'hydraulic-pro': 'hydraulic-pro.html',
        'threading-pro': 'threading-pro.html', 'cycle-cost-pro': 'cycle-cost-pro.html', 'bearing-frequencies-pro': 'bearing-frequencies-pro.html', 'belt-chain-pro': 'belt-chain-pro.html', 'fits-clearances-pro': 'fits-clearances-pro.html', 'surface-finish-pro': 'surface-finish-pro.html', 'weld-heat-input-pro': 'weld-heat-input-pro.html', 'sheet-bend-pro': 'sheet-bend-pro.html', 'sling-capacity-pro': 'sling-capacity-pro.html', 'shackle-eyebolt-pro': 'shackle-eyebolt-pro.html', 'pressure-vessel-pro': 'pressure-vessel-pro.html', 'pipe-wall-pro': 'pipe-wall-pro.html', 'bolted-joint-pro': 'bolted-joint-pro.html', 'oee-pro': 'oee-pro.html', 'machine-hour-rate-pro': 'machine-hour-rate-pro.html',
        pro: 'pro.html', tools: 'tools.html'
      }
    }
  },
  server: { port: 5173, strictPort: true, open: false },
  test: {
    environment: 'node', globals: true, include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: { provider: 'v8', all: false, include: ['src/core/**','src/tools/**','src/components/**','src/lib/**','src/industrial-suite/**'], exclude: ['**/*.test.ts','node_modules/**','dist/**'], reporter: ['text','html','lcov'], thresholds: { lines:95, functions:95, branches:90, statements:95 } }
  }
});
