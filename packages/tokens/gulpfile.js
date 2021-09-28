import path from 'path'
import { src, dest, parallel, series } from 'gulp'

import { epOutput } from '../../build/utils/paths'
import rewriter from '../../build/gulp-rewriter'
import { buildConfig } from '../../build/info'
import { withTaskName } from '../../build/utils/gulp'

export const buildTokens = (module) => {
  const inputs = [
    './*.js',
    '!./node_modules',
    '!./gulpfile.js',
    '!./__tests__/*.js',
  ]
  const config = buildConfig[module]
  return withTaskName(`buildTokens:${module}`, () =>
    src(inputs)
      .pipe(rewriter('..'))
      .pipe(dest(path.resolve(__dirname, config.output.name)))
  )
}

const copyTokens = (module) => {
  const config = buildConfig[module]
  return withTaskName(`copyTokens:${module}`, () => {
    return src(`${path.resolve(__dirname, config.output.name)}/**`).pipe(
      dest(path.resolve(epOutput, config.output.name, 'tokens'))
    )
  })
}

export default parallel(
  series(buildTokens('cjs'), copyTokens('cjs')),
  series(buildTokens('esm'), copyTokens('esm'))
)
