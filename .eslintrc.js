module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    jest: 'readonly',
  },
  plugins: ['prettier', 'import'],
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  overrides: [
    {
      files: ['*.js', '*.vue'],
      rules: {
        'no-undef': 'off',
      },
    },
    {
      files: ['**/__tests__/**', '**/gulpfile.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',

    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: 'vue',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@vue/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@spider-nest-vue/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['type'],
      },
    ],
  },
}
