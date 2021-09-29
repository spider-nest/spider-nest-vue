const path = require('path')
const { src, dest, series, parallel } = require('gulp')

const { withTaskName, gulpPathRewriter } = require('./utils/gulp')
const { buildConfig } = require('./info')
const { snOutput } = require('./utils/paths')
const { getPackageManifest } = require('./utils/pkg')
const { SN_PREFIX } = require('./constants')

const buildPackage = (pkgPath) => {
  const manifest = getPackageManifest(path.resolve(pkgPath, 'package.json'))
  const pkgName = manifest.name.replace(`${SN_PREFIX}/`, '')

  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = path.resolve(pkgPath, 'dist', config.output.name)

    const build = () => {
      const inputs = [
        '**/*.js',
        '!node_modules',
        '!gulpfile.js',
        '!__test?(s)__/*',
      ]
      return withTaskName(`build:${pkgName}:${module}`, () =>
        src(inputs).pipe(gulpPathRewriter(module)).pipe(dest(output))
      )
    }

    const copy = () =>
      withTaskName(`copy:${pkgName}:${module}`, () =>
        src(`${output}/**`).pipe(
          dest(path.resolve(snOutput, config.output.name, pkgName))
        )
      )

    return series(build(), copy())
  })

  return parallel(...tasks)
}

module.exports = {
  buildPackage,
}
