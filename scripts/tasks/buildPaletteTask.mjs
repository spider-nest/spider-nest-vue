import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import dartSass from 'sass'
import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import gulpAutoprefixer from 'gulp-autoprefixer'
import gulpCleanCSS from 'gulp-clean-css'
import gulpRename from 'gulp-rename'

import { paletteRoot, paletteOutput, distOutput } from '../utils/paths.mjs'
import { resolveTrue } from '../utils/promiseResolve.mjs'

const spinner = ora()

const copySource = () => {
  return new Promise((resolve) => {
    fs.copySync(`${paletteRoot}/src`, `${paletteOutput}/src`)
    resolve(true)
  })
}

//todo make it sync
const buildPalette = async () => {
  await gulp
    .src(`${paletteRoot}/src/*.scss`)
    .pipe(gulpSass(dartSass).sync())
    .pipe(gulpAutoprefixer({ cascade: false }))
    .pipe(
      gulpCleanCSS({}, (details) => {
        spinner.info(
          `${chalk.cyanBright(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(
      gulpRename((path) => {
        if (!/(index|base|display)/.test(path.basename)) {
          path.basename = `sn-${path.basename}`
        }
      })
    )
    .pipe(gulp.dest(paletteOutput))
  return resolveTrue
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
