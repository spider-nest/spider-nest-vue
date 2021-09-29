const { series, parallel } = require('gulp')

const { copyStyle } = require('./style')
const { run } = require('./utils/process')
const { withTaskName } = require('./utils/gulp')
const { snOutput, buildOutput, snPackage } = require('./utils/paths')
const { copyFullStyle } = require('./full-bundle')

const { buildComponent } = require('./component')
const { buildStyle } = require('./style')
const { buildFullBundle } = require('./full-bundle')
const { buildHelper } = require('./helper')

const runTask = (name) =>
  withTaskName(name, () => run(`pnpm run build ${name}`))

const copySourceCode = () => async () => {
  await run(`cp -R packages ${snOutput}`)
  await run(`cp ${snPackage} ${snOutput}/package.json`)
}

const copyREADME = () => async () => {
  await run(`cp README.md ${buildOutput}/spider-nest-vue`)
}

exports.default = series(
  withTaskName('clean', () => run('pnpm run clean')),

  parallel(
    runTask('buildComponent'),
    runTask('buildStyle'),
    runTask('buildFullBundle'),
    runTask('buildHelper'),
    withTaskName('buildEachPackages', () =>
      run('pnpm run --filter ./packages --parallel --stream build')
    )
  ),

  parallel(copyStyle(), copyFullStyle, copySourceCode(), copyREADME())
)

exports = {
  buildComponent,
  buildStyle,
  buildFullBundle,
  buildHelper,
}
