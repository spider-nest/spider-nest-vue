module.exports = {
  '*.{vue,js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{scss,css}': ['stylelint --fix'],
  '*.{json,yaml,yml,md,html}': 'prettier --write',
  'package.json': 'sort-package-json',
}
