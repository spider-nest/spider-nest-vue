import chalk from 'chalk'

import cleanTask from './tasks/cleanTask.mjs'
import buildModulesTask from './tasks/buildModulesTask.mjs'

import { resolveFalse, resolveTrue } from './utils/promiseResolve.mjs'

async function run() {
  const clean = await cleanTask()
  if (!clean) return resolveFalse

  const buildModules = await buildModulesTask()
  if (!buildModules) return resolveFalse

  return resolveTrue
}

run().then((flag) => {
  if (!flag) return
  console.log(chalk.greenBright('✨  ALL DONE ✨ '))
})
