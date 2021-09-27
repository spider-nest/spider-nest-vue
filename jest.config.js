module.exports = {
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  modulePathIgnorePatterns: ['/node_modules/', 'dist'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.jsx?$': [
      'babel-jest',
      {
        presets: [
          [
            '@babel/preset-env',
            {
              loose: true,
              targets: {
                node: true,
              },
            },
          ],
        ],
        plugins: [
          '@vue/babel-plugin-jsx',
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    ],
  },
  moduleFileExtensions: ['js', 'json'],
  // u can change this option to a more specific folder for test single component or util when dev
  // for example, ['<rootDir>/packages/input']
  roots: ['<rootDir>'],
}
