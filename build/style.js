const path = require('path')
const { parallel, dest, src } = require('gulp')

const { buildOutput, compRoot } = require('./utils/paths')
const { buildConfig } = require('./info')
const { withTaskName, gulpPathRewriter } = require('./utils/gulp')
const { run } = require('./utils/process')

const inputs = path.resolve(compRoot, '**/style/*.js')
const output = path.resolve(buildOutput, 'styles')

const build = (module) =>
  withTaskName(`buildStyle:${module}`, () =>
    src(inputs)
      .pipe(gulpPathRewriter(module))
      .pipe(dest(path.resolve(output, buildConfig[module].output.name)))
  )

const buildStyle = parallel(build('esm'), build('cjs'))

const copyStyle = () => {
  const copy = (module) => {
    const config = buildConfig[module]
    const src = path.resolve(buildOutput, 'styles', config.output.name)
    const dst = path.resolve(config.output.path, 'components')

    return withTaskName(`copyStyle:${module}`, () =>
      run(`rsync -a ${src}/ ${dst}/`)
    )
  }

  return parallel(copy('esm'), copy('cjs'))
}

module.exports = {
  buildStyle,
  copyStyle,
}
