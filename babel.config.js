module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    '@babel/transform-runtime',
    'lodash',
  ],
  env: {
    utils: {
      ignore: ['**/*.test.js', '**/*.spec.js'],
      presets: [
        [
          '@babel/env',
          {
            loose: true,
            modules: false,
          },
        ],
      ],
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            root: ['spider-nest-vue'],
            alias: {
              '@spider-nest-vue': 'spider-nest-vue/lib',
            },
          },
        ],
      ],
    },
  },
}
