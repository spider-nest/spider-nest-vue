import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'

import { snOutput, appRoot, snPackage } from '../utils/paths.mjs'

const spinner = ora()

export default function cleanTask() {
  return new Promise((resolve) => {
    spinner.start(chalk.blue('Attaching files...'))
    Promise.all([
      fs.copy(path.resolve(appRoot, 'typings/global.d.ts'), `${snOutput}/global.d.ts`),
      fs.copy(path.resolve(appRoot, 'README.md'), `${snOutput}/README.md`),
      fs.copy(snPackage, `${snOutput}/packages.json`),
    ])
      .then(() => {
        spinner.succeed(chalk.green('Attach files OK!'))
        resolve(true)
      })
      .catch((error) => {
        spinner.fail(chalk.red(error))
        resolve(false)
      })
  })
}
