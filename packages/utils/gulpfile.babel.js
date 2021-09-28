import path from 'path'
import gulp from 'gulp'
import { buildOutput } from '../../build/utils/paths'

export const esm = './es'
export const cjs = './lib'

const inputs = [
  './**/*.js',
  '!gulpfile.babel.js',
  '!./node_modules',
  '!./tests/*.js',
]

function compileEsm() {
  return gulp.src(inputs).pipe(gulp.dest(esm))
}

function compileCjs() {
  return gulp.src(inputs).pipe(gulp.dest(cjs))
}

const distBundle = path.resolve(buildOutput, './spider-nest-vue')

/**
 * copy from packages/theme-chalk/lib to dist/theme-chalk
 */
function copyEsm() {
  return gulp
    .src(`${cjs}/**`)
    .pipe(gulp.dest(path.resolve(distBundle, './lib/utils')))
}

function copyCjs() {
  return gulp
    .src(`${esm}/**`)
    .pipe(gulp.dest(path.resolve(distBundle, './es/utils')))
}

export const build = gulp.series(compileEsm, compileCjs, copyEsm, copyCjs)

export default build
