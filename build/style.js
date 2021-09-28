import path from 'path'
import { parallel, dest, src } from 'gulp'
import through2 from 'through2'

import { buildOutput, compRoot } from './utils/paths'
import { buildConfig } from './info'
import { withTaskName } from './utils/gulp'
import { run } from './utils/process'
import { SN_PREFIX } from './constants'

const inputs = path.resolve(compRoot, '**/style/*.js')
const output = path.resolve(buildOutput, 'styles')

const rewriter = (module) => {
  const config = buildConfig[module]
  return through2.obj(function (file, _, cb) {
    file.contents = Buffer.from(
      file.contents
        .toString()
        .replaceAll(
          `${SN_PREFIX}/components`,
          `${config.bundle.path}/components`
        )
        .replaceAll(`${SN_PREFIX}/theme-chalk`, 'spider-nest-vue/theme-chalk')
    )
    cb(null, file)
  })
}

const build = (module) =>
  withTaskName(`buildStyle:${module}`, () =>
    src(inputs)
      .pipe(rewriter(module))
      .pipe(dest(path.resolve(output, buildConfig[module].output.name)))
  )

export const buildStyle = parallel(build('esm'), build('cjs'))

export const copyStyle = () => {
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
