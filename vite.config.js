import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/', // Root-absolute assets — required for /calculator/* Firebase rewrites

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html',
        calculator: 'calculator.html',
        calculator2: 'calculator2.html',
        calculator3: 'calculator3.html',
        calculator4: 'calculator4.html',
        pricing: 'pricing.html',
        'sc008-pro': 'sc008-pro.html',
        'labor-pro': 'labor-pro.html',
        'quote-pro': 'quote-pro.html',
        'weld-pro': 'weld-pro.html',
        'machining-pro': 'machining-pro.html',
        'bearing-pro': 'bearing-pro.html',
        'shaft-pro': 'shaft-pro.html',
        'bolt-pro': 'bolt-pro.html',
        'punching-pro': 'punching-pro.html',
        'hydraulic-pro': 'hydraulic-pro.html',
        'tap-thread-pro': 'tap-thread-pro.html',
        'cycle-cost-pro': 'cycle-cost-pro.html',
        'bearing-freq-pro': 'bearing-freq-pro.html',
        'belt-chain-pro': 'belt-chain-pro.html',
        'fits-pro': 'fits-pro.html',
        'surface-finish-pro': 'surface-finish-pro.html',
        'heat-input-pro': 'heat-input-pro.html',
        'bend-pro': 'bend-pro.html',
        'sling-pro': 'sling-pro.html',
        'shackle-eyebolt-pro': 'shackle-eyebolt-pro.html',
        'pressure-vessel-pro': 'pressure-vessel-pro.html',
        'pipe-wall-pro': 'pipe-wall-pro.html',
        'bolted-joint-pro': 'bolted-joint-pro.html',
        'oee-pro': 'oee-pro.html',
        'machine-rate-pro': 'machine-rate-pro.html',
        pro: 'pro.html',
        tools: 'tools.html',
        login: 'login.html',
        account: 'account.html',
        'sc-ops': 'sc-ops.html'
      }
    }
  },

  server: {
    port: 5173,
    strictPort: true, // do not silently switch ports if 5173 is taken
    open: false
  },

  test: {
    environment: 'node', // core tests use no DOM; crypto.subtle is global in Node 20
    globals: true,
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      all: false, // lock behavior; do not rely on version defaults
      include: ['src/core/**', 'src/tools/**', 'src/components/**', 'src/lib/**'], // scope to tested code; widen as modules land
      exclude: ['**/*.test.ts', 'node_modules/**', 'dist/**'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95
      }
    }
  }
});
