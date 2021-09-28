import { series, parallel } from 'gulp'

import { copyStyle } from './style'
import { run } from './utils/process'
import { withTaskName } from './utils/gulp'
import { epOutput, buildOutput, epPackage } from './utils/paths'
import { copyFullStyle } from './full-bundle'

const runTask = (name) =>
  withTaskName(name, () => run(`pnpm run build ${name}`))

const copySourceCode = () => async () => {
  await run(`cp -R packages ${epOutput}`)
  await run(`cp ${epPackage} ${epOutput}/package.json`)
}

const copyREADME = () => async () => {
  await run(`cp README.md ${buildOutput}/spider-nest-vue`)
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),

  parallel(
    runTask('buildComponents'),
    runTask('buildStyle'),
    runTask('buildFullBundle'),
    runTask('buildHelper'),
    withTaskName('buildEachPackages', () =>
      run('pnpm run --filter ./packages --parallel --stream build')
    )
  ),

  parallel(copyStyle(), copyFullStyle, copySourceCode(), copyREADME())
)

export * from './components'
export * from './style'
export * from './full-bundle'
export * from './helper'
