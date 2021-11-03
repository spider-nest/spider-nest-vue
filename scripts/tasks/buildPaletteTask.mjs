import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import fb from 'fast-glob'

import { paletteRoot, paletteOutput, distOutput } from '../utils/paths.mjs'
import { resolveTrue, resolveFalse } from '../utils/promiseResolve.mjs'
import execPromise from '../utils/execPromise.mjs'

const spinner = ora()

const copySource = () => {
  return new Promise((resolve) => {
    fs.copySync(`${paletteRoot}/src`, `${paletteOutput}/src`)
    resolve(true)
  })
}

const buildPalette = async () => {
  let ret = resolveTrue
  const sourceFiles = await fb('*.scss', {
    cwd: `${paletteRoot}/src`,
    absolute: true,
    onlyFiles: true,
    objectMode: true,
    stats: true,
  })
  await Promise.all(
    sourceFiles.map(async (sourceFile) => {
      const { name, path, stats } = sourceFile
      const cssName = name.replace('.scss', '.css')
      const outputName = !/(index|base|display)/.test(cssName)
        ? `sn-${cssName}`
        : cssName
      const outputFile = `${paletteOutput}/${outputName}`
      await execPromise(
        `sass --no-source-map ${path} ${paletteOutput}/${outputName}`
      ).catch((error) => {
        ret = resolveFalse
        spinner.fail(chalk.red(error))
      })
      await execPromise(
        `postcss -u autoprefixer --no-map -r ${paletteOutput}/${outputName}`
      )
        .then(() => {
          const outputFileStat = fs.statSync(outputFile)
          spinner.info(
            `${chalk.cyanBright(name)}: ${chalk.yellow(
              (stats.size / 1024).toFixed(3)
            )} KB -> ${chalk.green((outputFileStat.size / 1024).toFixed(3))} KB`
          )
        })
        .catch((error) => {
          ret = resolveFalse
          spinner.fail(chalk.red(error))
        })
    })
  )
  return ret
}

const main = () => {
  return new Promise((resolve) => {
    Promise.all([copySource(), buildPalette()])
      .then(([flag1, flag2]) => {
        if (!flag1 || !flag2) return resolve(false)
        fs.copySync(`${paletteOutput}/index.css`, `${distOutput}/index.css`)
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

export default function buildPaletteTask() {
  return new Promise((resolve) => {
    spinner.start(chalk.blue('Palette Building...'))
    main().then((flag) => {
      if (!flag) return resolve(false)
      spinner.succeed(chalk.green('Build Palette OK!'))
      resolve(true)
    })
  })
}
