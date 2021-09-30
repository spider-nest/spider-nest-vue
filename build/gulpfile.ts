import { series, parallel } from 'gulp'

import { copyStyle } from './style'

import { copyEntryTypes } from './entry-types'

import { run } from './utils/process'
import { withTaskName } from './utils/gulp'
import { snOutput, buildOutput, snPackage } from './utils/paths'

import { copyFullStyle } from './full-bundle'

const runTask = (name: string) =>
  withTaskName(name, () => run(`pnpm run build ${name}`))

const copySourceCode = () => async () => {
  await run(`cp -r packages ${snOutput}/`)
  await run(`cp -r ${snPackage} ${snOutput}/`)
}

const copyREADME = () => async () => {
  await run(`cp -r README.md ${buildOutput}/spider-nest-vue/`)
}

export default series(
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

  parallel(
    copyStyle(),
    copyFullStyle,
    copyEntryTypes,
    copySourceCode(),
    copyREADME()
  )
)

export * from './component'
export * from './style'
export * from './full-bundle'
export * from './entry-types'
export * from './helper'
