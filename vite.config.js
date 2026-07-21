import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './', // Firebase Hosting subdirectory compatibility

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2020',
    minify: 'esbuild'
    // NOTE: multi-page (tools.html, calculator.html) will be added in PHASE 8.
    // Defining inputs before the first tool arrives breaks the build. Single entry for now: root index.html
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
      include: ['src/core/**', 'src/tools/**'], // scope to tested code; widen as modules land
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
