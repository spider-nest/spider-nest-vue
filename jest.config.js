module.exports = {
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  modulePathIgnorePatterns: ['/node_modules/', 'dist'],
  testEnvironment: 'jsdom',
  transform: {
    // Doesn't support jsx/tsx since sucrase doesn't support Vue JSX
    '\\.(j|t)s$': '@sucrase/jest-plugin',
    '^.+\\.vue$': 'vue-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  // u can change this option to a more specific folder for test single component or util when dev
  // for example, ['<rootDir>/packages/input']
  roots: ['<rootDir>'],
}
