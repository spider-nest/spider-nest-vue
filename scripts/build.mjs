import chalk from 'chalk'

import cleanTask from './tasks/cleanTask.mjs'

const resolveFalse = Promise.resolve(false)

async function run() {
  const cleaned = await cleanTask()
  if (!cleaned) return resolveFalse

  return Promise.resolve(true)
}

run().then((flag) => {
  if (!flag) return
  console.log(chalk.greenBright('✨  ALL DONE ✨ '))
})
