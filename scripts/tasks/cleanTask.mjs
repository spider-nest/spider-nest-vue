import chalk from 'chalk'
import ora from 'ora'

import execPromise from '../utils/execPromise.mjs'

const spinner = ora()

export default function cleanTask() {
  return new Promise((resolve) => {
    spinner.start(chalk.blue('Cleaning...'))
    execPromise('pnpm clean')
      .then(() => {
        spinner.succeed(chalk.green('Clean OK!'))
        resolve(true)
      })
      .catch((error) => {
        spinner.fail(chalk.red(`Clean Fail: ${error}`))
        resolve(false)
      })
  })
}
