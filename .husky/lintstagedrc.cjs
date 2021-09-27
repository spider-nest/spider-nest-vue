module.exports = {
  '*.{vue,js,jsx}': ['eslint --max-warnings 0 --fix', 'prettier --write'],
  '*.{less,css}': ['stylelint --fix'],
  '*.{json,yaml,yml,md,html}': 'prettier --write',
}
