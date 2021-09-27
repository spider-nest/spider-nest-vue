import path from 'path'
import chalk from 'chalk'
import gulp from 'gulp'
import gulpLess from 'gulp-less'
import LESS from 'less'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import { buildOutput } from '../../build/utils/paths'

const noElPrefixFile = /(index|base|display)/

const less = gulpLess(LESS)
export const distFolder = './lib'

/**
 * compile theme-chalk less & minify
 * not use less.sync().on('error', less.logError) to throw exception
 * @returns
 */
function compile() {
  return gulp
    .src('./src/*.less')
    .pipe(less.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        console.log(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(
      rename((path) => {
        if (!noElPrefixFile.test(path.basename)) {
          path.basename = `sn-${path.basename}`
        }
      })
    )
    .pipe(gulp.dest(distFolder))
}

/**
 * copy font to lib/fonts
 * @returns
 */
function copyFont() {
  return gulp.src('./src/fonts/**').pipe(gulp.dest(`${distFolder}/fonts`))
}

const distBundle = path.resolve(buildOutput, './spider-nest-vue/theme-chalk')

/**
 * copy from packages/theme-chalk/lib to dist/theme-chalk
 */
function copyToLib() {
  return gulp.src(`${distFolder}/**`).pipe(gulp.dest(distBundle))
}

/**
 * copy source file to packages
 */

function copySourceToLib() {
  return gulp.src('./src/**').pipe(gulp.dest(path.resolve(distBundle, './src')))
}

export const build = gulp.series(compile, copyFont, copyToLib, copySourceToLib)

export default build
