/** ESLint 8 (legacy) — matches `npm run lint` → eslint src/ --ext .js */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/'],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            name: 'react-dom',
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            name: 'vue',
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            name: 'next',
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            name: 'stripe',
            message: 'SECTORCALC: Paddle only (install later).'
          },
          {
            name: '@stripe/stripe-js',
            message: 'SECTORCALC: Paddle only (install later).'
          }
        ],
        patterns: [
          {
            group: ['react', 'react-*', 'react/*', '@react/*'],
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            group: ['vue', 'vue-*', 'vue/*', '@vue/*', 'nuxt', 'nuxt/*'],
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            group: ['next', 'next/*'],
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            group: ['@angular/*'],
            message: 'SECTORCALC: Vanilla JS + Lit only.'
          },
          {
            group: ['stripe', '@stripe/*'],
            message: 'SECTORCALC: Paddle only (install later).'
          },
          {
            group: [
              'protobufjs',
              'google-protobuf',
              '@bufbuild/*',
              'msgpack*',
              'cbor*',
              'bson'
            ],
            message: 'SECTORCALC: JSON only.'
          }
        ]
      }
    ]
  }
};
