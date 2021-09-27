import path from 'path'
import gulp from 'gulp'

import { buildOutput } from '../../build/utils/paths'

export const esm = './es'
export const cjs = './lib'

const inputs = './lang/*.js'

function compileLangEsm() {
  return gulp.src(inputs).pipe(gulp.dest(path.resolve(esm, 'lang')))
}

function compileLangCjs() {
  return gulp.src(inputs).pipe(gulp.dest(path.resolve(cjs, 'lang')))
}

function compileEntryEsm() {
  return gulp.src('./index.js').pipe(gulp.dest(esm))
}

function compileEntryCjs() {
  return gulp.src('./index.js').pipe(gulp.dest(cjs))
}

const distBundle = path.resolve(buildOutput, './spider-nest-vue')

/**
 * copy from packages/theme-chalk/lib to dist/theme-chalk
 */
function copyEsm() {
  return gulp
    .src(`${cjs}/**/*`)
    .pipe(gulp.dest(path.resolve(distBundle, './lib/locale')))
}

function copyCjs() {
  return gulp
    .src(`${esm}/**/*`)
    .pipe(gulp.dest(path.resolve(distBundle, './es/locale')))
}

export const build = gulp.series(
  compileEntryEsm,
  compileEntryCjs,
  compileLangEsm,
  compileLangCjs,
  copyEsm,
  copyCjs
)

export default build
