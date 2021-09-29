const { resolve } = require('path')

const projRoot = resolve(__dirname, '..', '..')
const pkgRoot = resolve(projRoot, 'packages')
const compRoot = resolve(pkgRoot, 'components')
const themeRoot = resolve(pkgRoot, 'theme-chalk')
const hookRoot = resolve(pkgRoot, 'hooks')
const localeRoot = resolve(pkgRoot, 'locale')
const directiveRoot = resolve(pkgRoot, 'directives')
const snRoot = resolve(pkgRoot, 'spider-nest-vue')
const utilRoot = resolve(pkgRoot, 'utils')
const docRoot = resolve(projRoot, 'docs')

/** dist */
const buildOutput = resolve(projRoot, 'dist')
/** dist/spider-nest-vue */
const snOutput = resolve(buildOutput, 'spider-nest-vue')

const projPackage = resolve(projRoot, 'package.json')
const compPackage = resolve(compRoot, 'package.json')
const themePackage = resolve(themeRoot, 'package.json')
const hookPackage = resolve(hookRoot, 'package.json')
const localePackage = resolve(localeRoot, 'package.json')
const directivePackage = resolve(directiveRoot, 'package.json')
const snPackage = resolve(snRoot, 'package.json')
const utilPackage = resolve(utilRoot, 'package.json')
const docPackage = resolve(docRoot, 'package.json')

module.exports = {
  projRoot,
  pkgRoot,
  compRoot,
  themeRoot,
  hookRoot,
  localeRoot,
  directiveRoot,
  snRoot,
  utilRoot,
  docRoot,
  buildOutput,
  snOutput,
  projPackage,
  compPackage,
  themePackage,
  hookPackage,
  localePackage,
  directivePackage,
  snPackage,
  utilPackage,
  docPackage,
}
